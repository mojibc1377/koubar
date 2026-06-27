import type { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api/auth";
import { jsonError, jsonOk } from "@/lib/api/errors";

const statusMap: Record<string, OrderStatus> = {
  processing: "PROCESSING",
  delivered: "DELIVERED",
  cancelled: "CANCELLED",
  pending: "PENDING",
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  const { id } = await params;
  const body = (await request.json()) as { status?: string };

  const status = body.status ? statusMap[body.status] : undefined;
  if (!status) return jsonError("وضعیت نامعتبر است");

  const order = await prisma.order.update({
    where: { orderNumber: id },
    data: { status },
  });

  return jsonOk({ id: order.orderNumber, status: order.status });
}
