import type {
  BlogContentBlock,
  BlogPost,
  CafeCategory,
  CafeMenuItem,
  Order,
  OrderItem,
  Transaction,
} from "@/lib/types";
import type {
  Accessory as DbAccessory,
  BlogPost as DbBlog,
  CafeCategory as DbCafeCat,
  CafeMenuItem as DbCafeItem,
  Order as DbOrder,
  OrderItem as DbOrderItem,
  RoasteryProduct as DbRoastery,
  Transaction as DbTx,
  User,
} from "@prisma/client";

function notesArray(notes: unknown): string[] {
  if (Array.isArray(notes)) return notes.filter((n) => typeof n === "string");
  return [];
}

function blocksArray(blocks: unknown): BlogContentBlock[] {
  if (Array.isArray(blocks)) return blocks as BlogContentBlock[];
  return [];
}

export function serializeCafeItem(item: DbCafeItem): CafeMenuItem {
  return {
    id: item.slug,
    name: item.name,
    description: item.description,
    longDescription: item.longDescription ?? undefined,
    image: item.image,
    price: item.price,
    badge: item.badge ?? undefined,
    notes: notesArray(item.notes),
  };
}

export function serializeCafeCategory(
  cat: DbCafeCat & { items: DbCafeItem[] },
): CafeCategory {
  return {
    id: cat.id,
    name: cat.name,
    items: cat.items.filter((i) => i.active).map(serializeCafeItem),
  };
}

export function serializeRoastery(p: DbRoastery) {
  return {
    id: p.slug,
    title: p.title,
    description: p.description,
    longDescription: p.longDescription ?? undefined,
    image: p.image,
    price: p.price,
    badge: p.badge ?? undefined,
    variant: p.variant.toLowerCase() as "african" | "kenya" | "street",
    inStock: p.inStock,
  };
}

export function serializeAccessory(a: DbAccessory) {
  return {
    id: a.slug,
    title: a.title,
    description: a.description,
    longDescription: a.longDescription ?? undefined,
    image: a.image,
    price: a.price,
    badge: a.badge ?? undefined,
    category: a.category,
    notes: notesArray(a.notes),
  };
}

export function serializeBlog(b: DbBlog): BlogPost {
  const blocks = blocksArray(b.blocks);
  return {
    slug: b.slug,
    title: b.title,
    excerpt: b.excerpt,
    image: b.image,
    date: b.publishedAt
      ? new Intl.DateTimeFormat("fa-IR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(b.publishedAt)
      : new Intl.DateTimeFormat("fa-IR").format(b.createdAt),
    author: b.author,
    category: b.category,
    readMinutes: b.readMinutes,
    content: blocks
      .filter((x) => x.type === "paragraph")
      .map((x) => (x as { text: string }).text),
    blocks,
    status: b.status === "PUBLISHED" ? ("published" as const) : ("draft" as const),
  };
}

export function serializeOrderItem(item: DbOrderItem): OrderItem {
  return {
    id: item.catalogId,
    title: item.title,
    quantity: item.quantity,
    price: item.price,
  };
}

export function serializeOrder(
  order: DbOrder & { items: DbOrderItem[] },
  displayDate: string,
): Order & { orderNumber: string; customerName?: string; customerPhone?: string } {
  const type = order.type === "CAFE" ? "cafe" : "shop";
  return {
    id: order.orderNumber,
    date: displayDate,
    status:
      order.status === "DELIVERED"
        ? "delivered"
        : order.status === "CANCELLED"
          ? "cancelled"
          : "processing",
    type,
    items: order.items.map(serializeOrderItem),
    total: order.total,
    orderNumber: order.orderNumber,
  };
}

export function serializeTransaction(
  tx: DbTx & { orderId?: string },
  displayDate: string,
): Transaction {
  return {
    id: tx.txNumber,
    orderId: tx.orderId ?? "",
    date: displayDate,
    amount: tx.amount,
    method: tx.method,
    status:
      tx.status === "PAID"
        ? "paid"
        : tx.status === "REFUNDED"
          ? "refunded"
          : "pending",
  };
}

export function serializeUser(u: User) {
  return {
    id: u.id,
    name: u.name ?? "",
    phone: u.phone,
    address: u.address ?? "",
    role: u.role,
    joinedAt: new Intl.DateTimeFormat("fa-IR").format(u.createdAt),
    ordersCount: 0,
  };
}
