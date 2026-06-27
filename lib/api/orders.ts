import { prisma } from "@/lib/prisma";

export async function findOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: { review: true },
  });
}
