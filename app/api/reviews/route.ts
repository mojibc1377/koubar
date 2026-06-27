import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api/auth";
import { findOrderByNumber } from "@/lib/api/orders";
import { jsonError, jsonOk } from "@/lib/api/errors";
import { formatDisplayDate } from "@/lib/dates";

function isValidStars(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5;
}

export async function POST(request: Request) {
  const authResult = await requireUser();
  if ("error" in authResult) return authResult.error;

  const body = (await request.json()) as {
    orderId?: string;
    staffId?: string;
    staffStars?: number;
    foodStars?: number;
    comment?: string;
  };

  const orderNumber = body.orderId?.trim();
  if (!orderNumber) return jsonError("شناسه سفارش الزامی است");
  if (!body.staffId) return jsonError("انتخاب پرسنل الزامی است");
  if (!isValidStars(body.staffStars) || !isValidStars(body.foodStars)) {
    return jsonError("امتیاز باید بین ۱ تا ۵ باشد");
  }

  const order = await findOrderByNumber(orderNumber);
  if (!order || order.userId !== authResult.session.user.id) {
    return jsonError("سفارش یافت نشد", 404);
  }
  if (order.status !== "DELIVERED") {
    return jsonError("فقط سفارش‌های تحویل‌شده قابل ثبت نظر هستند");
  }
  if (order.review) {
    return jsonError("برای این سفارش قبلاً نظر ثبت شده است");
  }

  const staff = await prisma.staff.findFirst({
    where: { id: body.staffId, active: true },
  });
  if (!staff) return jsonError("پرسنل انتخاب‌شده معتبر نیست");

  const comment = body.comment?.trim() || null;

  const review = await prisma.review.create({
    data: {
      orderId: order.id,
      userId: authResult.session.user.id,
      staffId: staff.id,
      staffStars: body.staffStars,
      foodStars: body.foodStars,
      comment,
    },
  });

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
