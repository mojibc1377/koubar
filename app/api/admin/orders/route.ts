import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api/auth";
import { jsonOk } from "@/lib/api/errors";
import { formatDisplayDate } from "@/lib/dates";
import { serializeOrder } from "@/lib/serializers";

export async function GET(request: Request) {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  const type = new URL(request.url).searchParams.get("type");
  const where =
    type === "cafe"
      ? { type: "CAFE" as const }
      : type === "shop"
        ? { type: { in: ["SHOP" as const, "MIXED" as const] } }
        : {};

  const orders = await prisma.order.findMany({
    where,
    include: { items: true, user: true },
    orderBy: { createdAt: "desc" },
  });

  return jsonOk(
    orders.map((o) => ({
      ...serializeOrder(o, formatDisplayDate(o.createdAt)),
      customerName: o.shippingName,
      customerPhone: o.shippingPhone,
    })),
  );
}
