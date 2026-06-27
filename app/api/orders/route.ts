import type { ItemSource, OrderType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api/auth";
import { jsonError, jsonOk } from "@/lib/api/errors";
import {
  formatDisplayDate,
  generateOrderNumber,
  generateTxNumber,
} from "@/lib/dates";
import { serializeOrder } from "@/lib/serializers";

type CheckoutItem = {
  source: ItemSource;
  catalogId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
};

export async function GET() {
  const authResult = await requireUser();
  if ("error" in authResult) return authResult.error;

  const orders = await prisma.order.findMany({
    where: { userId: authResult.session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return jsonOk(
    orders.map((o) =>
      serializeOrder(o, formatDisplayDate(o.createdAt)),
    ),
  );
}

export async function POST(request: Request) {
  const authResult = await requireUser();
  if ("error" in authResult) return authResult.error;

  const body = (await request.json()) as {
    shippingName?: string;
    shippingPhone?: string;
    shippingAddress?: string;
    items?: CheckoutItem[];
  };

  const items = body.items ?? [];
  if (items.length === 0) {
    return jsonError("سبد خرید خالی است");
  }

  const shippingName =
    body.shippingName?.trim() || authResult.session.user.name || "";
  const shippingPhone =
    body.shippingPhone?.trim() || authResult.session.user.phone || "";
  const shippingAddress =
    body.shippingAddress?.trim() || authResult.session.user.address || "";

  if (!shippingName || !shippingPhone || !shippingAddress) {
    return jsonError("اطلاعات تحویل کامل نیست");
  }

  const hasCafe = items.some((i) => i.source === "CAFE");
  const hasShop = items.some((i) => i.source !== "CAFE");
  let type: OrderType = "SHOP";
  if (hasCafe && hasShop) type = "MIXED";
  else if (hasCafe) type = "CAFE";

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const orderNumber = generateOrderNumber();
  const txNumber = generateTxNumber();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: authResult.session.user.id,
      type,
      status: "PROCESSING",
      total,
      shippingName,
      shippingPhone,
      shippingAddress,
      items: {
        create: items.map((item) => ({
          source: item.source,
          catalogId: item.catalogId,
          title: item.title,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
      },
      transactions: {
        create: {
          txNumber,
          userId: authResult.session.user.id,
          amount: total,
          method: "ثبت دستی (بدون درگاه)",
          status: "PAID",
        },
      },
    },
    include: { items: true },
  });

  return jsonOk({
    order: serializeOrder(order, formatDisplayDate(order.createdAt)),
    transactionId: txNumber,
  });
}
