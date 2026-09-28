import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api/auth";
import { validateDiscountForUser } from "@/lib/discount";
import { jsonError, jsonOk } from "@/lib/api/errors";

export async function POST(request: Request) {
  const authResult = await requireUser();
  if ("error" in authResult) return authResult.error;

  const body = (await request.json()) as {
    code?: string;
    subtotal?: number;
  };

  const subtotal = Number(body.subtotal);
  if (!Number.isFinite(subtotal) || subtotal <= 0) {
    return jsonError("مبلغ سبد خرید نامعتبر است");
  }

  const result = await validateDiscountForUser(prisma, {
    code: body.code ?? "",
    userId: authResult.session.user.id,
    subtotal,
  });

  if (!result.ok) {
    return jsonError(result.error);
  }

  return jsonOk({
    code: result.code,
    type: result.type,
    value: result.value,
    subtotal: result.subtotal,
    discountAmount: result.discountAmount,
    total: result.total,
  });
}
