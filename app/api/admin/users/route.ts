import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api/auth";
import { jsonOk } from "@/lib/api/errors";
import { formatDisplayDate } from "@/lib/dates";

export async function GET() {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return jsonOk(
    users.map((u) => ({
      id: u.id,
      name: u.name ?? "",
      phone: u.phone,
      address: u.address ?? "",
      role: u.role,
      joinedAt: formatDisplayDate(u.createdAt),
      ordersCount: u._count.orders,
    })),
  );
}
