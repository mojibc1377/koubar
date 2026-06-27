import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api/auth";
import { jsonError, jsonOk } from "@/lib/api/errors";
import { formatDisplayDate } from "@/lib/dates";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const authResult = await requireUser();
  if ("error" in authResult) return authResult.error;

  const { orderId: orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: { id: true, userId: true },
  });

  if (!order || order.userId !== authResult.session.user.id) {
    return jsonError("سفارش یافت نشد", 404);
  }

  const review = await prisma.review.findUnique({
    where: { orderId: order.id },
  });

  if (!review) {
    return jsonOk(null);
  }

  return jsonOk({
    id: review.id,
    orderId: orderNumber,
    staffId: review.staffId,
    staffStars: review.staffStars,
    foodStars: review.foodStars,
    comment: review.comment ?? undefined,
    createdAt: formatDisplayDate(review.createdAt),
  });
}
