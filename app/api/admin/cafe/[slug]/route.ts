import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api/auth";
import { jsonOk } from "@/lib/api/errors";
import { serializeCafeItem } from "@/lib/serializers";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  const { slug } = await params;
  const body = (await request.json()) as Record<string, unknown>;

  const item = await prisma.cafeMenuItem.update({
    where: { slug },
    data: {
      ...(typeof body.name === "string" ? { name: body.name } : {}),
      ...(typeof body.description === "string"
        ? { description: body.description }
        : {}),
      ...(typeof body.price === "number" ? { price: body.price } : {}),
      ...(typeof body.badge === "string" ? { badge: body.badge || null } : {}),
      ...(typeof body.active === "boolean" ? { active: body.active } : {}),
      ...(typeof body.categoryId === "string"
        ? { categoryId: body.categoryId }
        : {}),
    },
    include: { category: true },
  });

  return jsonOk({
    ...serializeCafeItem(item),
    categoryId: item.categoryId,
    categoryName: item.category.name,
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  const { slug } = await params;
  await prisma.cafeMenuItem.delete({ where: { slug } });
  return jsonOk({ ok: true });
}
