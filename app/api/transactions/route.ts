import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api/auth";
import { jsonOk } from "@/lib/api/errors";
import { formatDisplayDate } from "@/lib/dates";
import { serializeTransaction } from "@/lib/serializers";

export async function GET() {
  const authResult = await requireUser();
  if ("error" in authResult) return authResult.error;

  const transactions = await prisma.transaction.findMany({
    where: { userId: authResult.session.user.id },
    include: { order: { select: { orderNumber: true } } },
    orderBy: { createdAt: "desc" },
  });

  return jsonOk(
    transactions.map((tx) => {
      const base = serializeTransaction(tx, formatDisplayDate(tx.createdAt));
      return { ...base, orderId: tx.order.orderNumber };
    }),
  );
}
