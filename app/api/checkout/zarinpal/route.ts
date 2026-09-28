import type { ItemSource, OrderType } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { validateDiscountForUser } from "@/lib/discount";
import { NextRequest, NextResponse } from "next/server";

const ZARINPAL_MERCHANT_ID =
  process.env.ZARINPAL_MERCHANT_ID ?? "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
const ZARINPAL_REQUEST_URL =
  "https://sandbox.zarinpal.com/pg/v4/payment/request.json";
const ZARINPAL_GATEWAY_URL = "https://sandbox.zarinpal.com/pg/StartPay/";

type CheckoutItem = {
  source: ItemSource;
  catalogId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { shippingName, shippingPhone, shippingAddress, items, discountCode } =
      body as {
        shippingName?: string;
        shippingPhone?: string;
        shippingAddress?: string;
        items?: CheckoutItem[];
        discountCode?: string;
      };

    if (!items?.length) {
      return NextResponse.json({ error: "سبد خرید خالی است" }, { status: 400 });
    }

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    let discountAmount = 0;
    let discountCodeId: string | null = null;
    let total = subtotal;

    if (discountCode?.trim()) {
      const validation = await validateDiscountForUser(prisma, {
        code: discountCode,
        userId: session.user.id,
        subtotal,
      });

      if (!validation.ok) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }

      discountAmount = validation.discountAmount;
      discountCodeId = validation.discountCodeId;
      total = validation.total;
    }

    if (total <= 0) {
      return NextResponse.json(
        { error: "مبلغ نهایی سفارش نامعتبر است" },
        { status: 400 },
      );
    }

    const hasCafe = items.some((i) => i.source === "CAFE");
    const hasShop = items.some((i) => i.source !== "CAFE");
    let type: OrderType = "SHOP";
    if (hasCafe && hasShop) type = "MIXED";
    else if (hasCafe) type = "CAFE";

    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        type,
        userId: session.user.id,
        shippingName: shippingName ?? "",
        shippingPhone: shippingPhone ?? "",
        shippingAddress: shippingAddress ?? "",
        subtotal,
        discountAmount,
        discountCodeId,
        total,
        status: "PENDING",
        items: {
          create: items.map((item) => ({
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
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        merchant_id: ZARINPAL_MERCHANT_ID,
        amount: total,
        description: `سفارش #${order.orderNumber}`,
        callback_url: callbackUrl,
        metadata: { mobile: shippingPhone },
      }),
    });

    const zarinpalData = await zarinpalRes.json();

    if (zarinpalData?.data?.code !== 100) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "FAILED" },
      });
      const msg =
        zarinpalData?.errors?.message ?? "خطا در اتصال به درگاه پرداخت";
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    const authority = zarinpalData.data.authority as string;

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
