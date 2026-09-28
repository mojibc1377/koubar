import type { DiscountCode, DiscountType } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";

export function normalizeDiscountCode(code: string) {
  return code.trim().toUpperCase();
}

export function calculateDiscountAmount(
  subtotal: number,
  type: DiscountType,
  value: number,
): number {
  if (subtotal <= 0) return 0;

  let amount =
    type === "PERCENT"
      ? Math.floor((subtotal * value) / 100)
      : value;

  return Math.min(Math.max(amount, 0), subtotal);
}

export type DiscountValidationResult =
  | {
      ok: true;
      discountCodeId: string;
      code: string;
      type: "percent" | "fixed";
      value: number;
      subtotal: number;
      discountAmount: number;
      total: number;
    }
  | { ok: false; error: string };

export async function validateDiscountForUser(
  db: Pick<PrismaClient, "discountCode" | "discountRedemption">,
  params: {
    code: string;
    userId: string;
    subtotal: number;
  },
): Promise<DiscountValidationResult> {
  const normalized = normalizeDiscountCode(params.code);
  if (!normalized) {
    return { ok: false, error: "کد تخفیف را وارد کنید" };
  }

  if (params.subtotal <= 0) {
    return { ok: false, error: "مبلغ سبد خرید نامعتبر است" };
  }

  const discount = await db.discountCode.findUnique({
    where: { code: normalized },
  });

  if (!discount) {
    return { ok: false, error: "کد تخفیف معتبر نیست" };
  }

  const eligibility = checkDiscountEligibility(discount, params.userId, params.subtotal);
  if (!eligibility.ok) return eligibility;

  const alreadyUsed = await db.discountRedemption.findUnique({
    where: {
      discountCodeId_userId: {
        discountCodeId: discount.id,
        userId: params.userId,
      },
    },
  });

  if (alreadyUsed) {
    return { ok: false, error: "شما قبلاً از این کد تخفیف استفاده کرده‌اید" };
  }

  const useCount = await db.discountRedemption.count({
    where: { discountCodeId: discount.id },
  });

  if (discount.maxUses != null && useCount >= discount.maxUses) {
    return { ok: false, error: "ظرفیت استفاده از این کد تکمیل شده است" };
  }

  const discountAmount = calculateDiscountAmount(
    params.subtotal,
    discount.type,
    discount.value,
  );

  return {
    ok: true,
    discountCodeId: discount.id,
    code: discount.code,
    type: discount.type === "PERCENT" ? "percent" : "fixed",
    value: discount.value,
    subtotal: params.subtotal,
    discountAmount,
    total: params.subtotal - discountAmount,
  };
}

function checkDiscountEligibility(
  discount: DiscountCode,
  _userId: string,
  subtotal: number,
): DiscountValidationResult | { ok: true } {
  if (!discount.active) {
    return { ok: false, error: "این کد تخفیف غیرفعال است" };
  }

  if (discount.expiresAt && discount.expiresAt < new Date()) {
    return { ok: false, error: "مهلت استفاده از این کد به پایان رسیده است" };
  }

  if (discount.type === "PERCENT" && (discount.value < 1 || discount.value > 100)) {
    return { ok: false, error: "کد تخفیف پیکربندی نامعتبر دارد" };
  }

  if (discount.type === "FIXED" && discount.value <= 0) {
    return { ok: false, error: "کد تخفیف پیکربندی نامعتبر دارد" };
  }

  if (subtotal <= 0) {
    return { ok: false, error: "مبلغ سبد خرید نامعتبر است" };
  }

  return { ok: true };
}

export async function recordDiscountRedemption(
  db: Pick<PrismaClient, "discountRedemption" | "order">,
  orderId: string,
) {
  const order = await db.order.findUnique({
    where: { id: orderId },
    select: { id: true, userId: true, discountCodeId: true, status: true },
  });

  if (!order?.discountCodeId) return;

  await db.discountRedemption.create({
    data: {
      discountCodeId: order.discountCodeId,
      userId: order.userId,
      orderId: order.id,
    },
  });
}
