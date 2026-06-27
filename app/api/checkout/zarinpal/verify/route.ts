import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const ZARINPAL_MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID ?? "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
const ZARINPAL_VERIFY_URL = "https://sandbox.zarinpal.com/pg/v4/payment/verify.json";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId   = searchParams.get("orderId")   ?? "";
  const authority = searchParams.get("Authority") ?? "";
  const status    = searchParams.get("Status")    ?? "";

  const redirectBase = `${process.env.NEXT_PUBLIC_APP_URL}/checkout/result`;

  if (status !== "OK") {
    // User cancelled or bank refused before verification
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
    }).catch(() => null);

    return NextResponse.redirect(`${redirectBase}?status=failed&orderId=${orderId}`);
  }

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order || order.paymentAuthority !== authority) {
      return NextResponse.redirect(`${redirectBase}?status=failed&orderId=${orderId}&reason=mismatch`);
    }

    if (order.status === "PAID") {
      // Already verified (duplicate callback)
      return NextResponse.redirect(
        `${redirectBase}?status=success&orderId=${orderId}&refId=${order.paymentRefId}`
      );
    }

    const verifyRes = await fetch(ZARINPAL_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        merchant_id: ZARINPAL_MERCHANT_ID,
        amount: order.total,
        authority,
      }),
    });

    const verifyData = await verifyRes.json();
    const code: number = verifyData?.data?.code;

    // code 100 = verified, code 101 = already verified (idempotent)
    if (code === 100 || code === 101) {
      const refId = String(verifyData.data.ref_id ?? "");

      await prisma.order.update({
        where: { id: orderId },
        data: { status: "PAID", paymentRefId: refId },
      });

      // Create the Transaction record so it shows up in the user's history
      await prisma.transaction.create({
        data: {
          txNumber: `TX-ZP-${refId || Date.now()}`,
          orderId,
          userId: order.userId,
          amount: order.total,
          method: "زرین‌پال",
          status: "PAID",
        },
      });

      return NextResponse.redirect(
        `${redirectBase}?status=success&orderId=${orderId}&refId=${refId}`
      );
    }

    // Payment failed at verify step
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "FAILED" },
    });

    return NextResponse.redirect(
      `${redirectBase}?status=failed&orderId=${orderId}&code=${code}`
    );
  } catch (err) {
    console.error("[zarinpal/verify]", err);
    return NextResponse.redirect(`${redirectBase}?status=failed&orderId=${orderId}&reason=error`);
  }
}