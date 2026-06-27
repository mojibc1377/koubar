import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api/auth";
import { jsonOk } from "@/lib/api/errors";
import { formatDisplayDate } from "@/lib/dates";

export async function GET() {
  const authResult = await requireUser();
  if ("error" in authResult) return authResult.error;

  const user = await prisma.user.findUnique({
    where: { id: authResult.session.user.id },
    include: { _count: { select: { orders: true } } },
  });

  if (!user) {
    return authResult.error;
  }

  return jsonOk({
    user: {
      id: user.id,
      name: user.name ?? "",
      phone: user.phone,
      address: user.address ?? "",
      role: user.role,
      joinedAt: formatDisplayDate(user.createdAt),
      ordersCount: user._count.orders,
    },
  });
}
