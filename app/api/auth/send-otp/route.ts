import { NextResponse } from "next/server";
import { createAndLogOtp } from "@/auth";
import { isValidPhone, normalizePhone } from "@/lib/phone";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      phone?: string;
      intent?: "login" | "signup";
    };

    const phone = normalizePhone(String(body.phone ?? ""));
    const intent = body.intent === "signup" ? "signup" : "login";

    if (!phone || !isValidPhone(phone)) {
      return NextResponse.json(
        { error: "شماره موبایل معتبر نیست." },
        { status: 400 },
      );
    }

    if (intent === "login") {
      const existing = await prisma.user.findUnique({ where: { phone } });
      if (!existing) {
        return NextResponse.json(
          { error: "حسابی با این شماره یافت نشد. ابتدا ثبت‌نام کنید." },
          { status: 404 },
        );
      }
    }

    if (intent === "signup") {
      const existing = await prisma.user.findUnique({ where: { phone } });
      if (existing) {
        return NextResponse.json(
          { error: "این شماره قبلاً ثبت شده است. وارد شوید." },
          { status: 409 },
        );
      }
    }

    await createAndLogOtp(phone);

    return NextResponse.json({
      ok: true,
      message: "کد تأیید ارسال شد (در حالت توسعه در ترمینال سرور نمایش داده می‌شود).",
    });
  } catch (error) {
    console.error("[send-otp]", error);
    return NextResponse.json(
      { error: "خطا در ارسال کد. دیتابیس را بررسی کنید." },
      { status: 500 },
    );
  }
}
