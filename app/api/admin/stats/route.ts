import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api/auth";
import { jsonOk } from "@/lib/api/errors";

export async function GET() {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [ordersToday, revenueToday, usersTotal, blogsPublished, recentOrders] =
    await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfDay }, status: { not: "CANCELLED" } },
        _sum: { total: true },
      }),
      prisma.user.count(),
      prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: true, items: true },
      }),
    ]);

  return jsonOk({
    ordersToday,
    revenueToday: revenueToday._sum.total ?? 0,
    usersTotal,
    blogsPublished,
    recentOrders: recentOrders.map((o) => ({
      id: o.orderNumber,
      type: o.type === "CAFE" ? "cafe" : "shop",
      customerName: o.shippingName,
      total: o.total,
      status:
        o.status === "DELIVERED"
          ? "delivered"
          : o.status === "CANCELLED"
            ? "cancelled"
            : "processing",
    })),
  });
}
