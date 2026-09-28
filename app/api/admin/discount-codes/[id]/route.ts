import type { DiscountType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api/auth";
import { normalizeDiscountCode } from "@/lib/discount";
import { jsonError, jsonOk } from "@/lib/api/errors";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  
  const { id } = await params;
  const body = (await request.json()) as {
    code?: string;
    type?: string;
    value?: number;
    active?: boolean;
    expiresAt?: string | null;
    maxUses?: number | null;
  };

  const data: {
    code?: string;
    type?: DiscountType;
    value?: number;
    active?: boolean;
    expiresAt?: Date | null;
    maxUses?: number | null;
  } = {};

  if (typeof body.code === "string") {
    const code = normalizeDiscountCode(body.code);
    if (!code) return jsonError("کد تخفیف نامعتبر است");
    data.code = code;
  }

  if (body.type === "percent") data.type = "PERCENT";
  if (body.type === "fixed") data.type = "FIXED";

  if (typeof body.value === "number") {
    if (body.value <= 0) return jsonError("مقدار تخفیف نامعتبر است");
    data.value = body.value;
  }

  if (typeof body.active === "boolean") data.active = body.active;

  if (body.expiresAt !== undefined) {
    data.expiresAt =
      body.expiresAt === null || body.expiresAt === ""
        ? null
        : new Date(body.expiresAt);
    if (data.expiresAt && Number.isNaN(data.expiresAt.getTime())) {
      return jsonError("تاریخ انقضا نامعتبر است");
    }
  }

  if (body.maxUses !== undefined) {
    data.maxUses =
      body.maxUses === null ? null : Number(body.maxUses);
    if (data.maxUses != null && data.maxUses < 1) {
      return jsonError("حداکثر استفاده نامعتبر است");
    }
  }

  try {
    const updated = await prisma.discountCode.update({
      where: { id },
      data,
      include: { _count: { select: { redemptions: true } } },
    });

    return jsonOk({
      id: updated.id,
      code: updated.code,
      type: updated.type === "PERCENT" ? "percent" : "fixed",
      value: updated.value,
      active: updated.active,
      expiresAt: updated.expiresAt?.toISOString(),
      maxUses: updated.maxUses ?? undefined,
      useCount: updated._count.redemptions,
      createdAt: updated.createdAt.toISOString(),
    });
  } catch {
    return jsonError("خطا در ویرایش کد تخفیف");
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  const { id } = await params;

  try {
    await prisma.discountCode.delete({ where: { id } });
    return jsonOk({ ok: true });
  } catch {
    return jsonError("حذف کد تخفیف ممکن نیست");
  }
}
