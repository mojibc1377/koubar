import type { DiscountType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api/auth";
import { normalizeDiscountCode } from "@/lib/discount";
import { jsonError, jsonOk } from "@/lib/api/errors";

function serializeDiscount(
  code: {
    id: string;
    code: string;
    type: DiscountType;
    value: number;
    active: boolean;
    expiresAt: Date | null;
    maxUses: number | null;
    createdAt: Date;
    _count?: { redemptions: number };
  },
) {
  return {
    id: code.id,
    code: code.code,
    type: code.type === "PERCENT" ? ("percent" as const) : ("fixed" as const),
    value: code.value,
    active: code.active,
    expiresAt: code.expiresAt?.toISOString() ?? undefined,
    maxUses: code.maxUses ?? undefined,
    useCount: code._count?.redemptions ?? 0,
    createdAt: code.createdAt.toISOString(),
  };
}

export async function GET() {

  const codes = await prisma.discountCode.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { redemptions: true } } },
  });

  return jsonOk(codes.map(serializeDiscount));
}

export async function POST(request: Request) {

  const body = (await request.json()) as {
    code?: string;
    type?: string;
    value?: number;
    active?: boolean;
    expiresAt?: string | null;
    maxUses?: number | null;
  };

  const code = normalizeDiscountCode(body.code ?? "");
  if (!code) return jsonError("کد تخفیف الزامی است");

  const type: DiscountType =
    body.type === "fixed" ? "FIXED" : body.type === "percent" ? "PERCENT" : "PERCENT";

  const value = Number(body.value);
  if (!Number.isFinite(value) || value <= 0) {
    return jsonError("مقدار تخفیف نامعتبر است");
  }

  if (type === "PERCENT" && (value < 1 || value > 100)) {
    return jsonError("درصد تخفیف باید بین ۱ تا ۱۰۰ باشد");
  }

  const expiresAt =
    body.expiresAt === null || body.expiresAt === ""
      ? null
      : body.expiresAt
        ? new Date(body.expiresAt)
        : null;

  if (expiresAt && Number.isNaN(expiresAt.getTime())) {
    return jsonError("تاریخ انقضا نامعتبر است");
  }

  const maxUses =
    body.maxUses === null || body.maxUses === undefined
      ? null
      : Number(body.maxUses);

  if (maxUses != null && (!Number.isFinite(maxUses) || maxUses < 1)) {
    return jsonError("حداکثر استفاده نامعتبر است");
  }

  try {
    const created = await prisma.discountCode.create({
      data: {
        code,
        type,
        value,
        active: body.active ?? true,
        expiresAt,
        maxUses,
      },
      include: { _count: { select: { redemptions: true } } },
    });

    return jsonOk(serializeDiscount(created));
  } catch {
    return jsonError("این کد تخفیف قبلاً ثبت شده است");
  }
}
