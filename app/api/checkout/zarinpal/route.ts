import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


const ZARINPAL_MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID ?? "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
const ZARINPAL_REQUEST_URL = "https://sandbox.zarinpal.com/pg/v4/payment/request.json";
const ZARINPAL_GATEWAY_URL = "https://sandbox.zarinpal.com/pg/StartPay/";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { shippingName, shippingPhone, shippingAddress, items } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "سبد خرید خالی است" }, { status: 400 });
    }

    const total: number = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    // Persist the pending order so we can verify it after redirect
    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        type: "SHOP",
        userId: session.user.id,
        shippingName,
        shippingPhone,
        shippingAddress,
        total,
        status: "PENDING",
        items: {
          create: items.map((item: {
            source: string;
            catalogId: string;
            title: string;
            price: number;
            quantity: number;
            image?: string;
          }) => ({
            source: item.source,
            catalogId: item.catalogId,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.image ?? null,
          })),
        },
      },
    });

    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/checkout/zarinpal/verify?orderId=${order.id}`;

    const zarinpalRes = await fetch(ZARINPAL_REQUEST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        merchant_id: ZARINPAL_MERCHANT_ID,
        amount: total,           // IRR (Rials); if your prices are in Tomans multiply by 10
        description: `سفارش #${order.id}`,
        callback_url: callbackUrl,
        metadata: { mobile: shippingPhone },
      }),
    });

    const zarinpalData = await zarinpalRes.json();

    if (zarinpalData?.data?.code !== 100) {
      const msg = zarinpalData?.errors?.message ?? "خطا در اتصال به درگاه پرداخت";
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    const authority = zarinpalData.data.authority as string;

    // Save authority on the order for later verification
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentAuthority: authority },
    });

    return NextResponse.json({
      paymentUrl: `${ZARINPAL_GATEWAY_URL}${authority}`,
    });
  } catch (err) {
    console.error("[zarinpal/request]", err);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}