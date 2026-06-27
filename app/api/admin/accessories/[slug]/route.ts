import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api/auth";
import { jsonOk } from "@/lib/api/errors";
import { serializeAccessory } from "@/lib/serializers";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  const { slug } = await params;
  const body = (await request.json()) as Record<string, unknown>;

  const item = await prisma.accessory.update({
    where: { slug },
    data: {
      ...(typeof body.title === "string" ? { title: body.title } : {}),
      ...(typeof body.description === "string"
        ? { description: body.description, longDescription: body.description }
        : {}),
      ...(typeof body.price === "number" ? { price: body.price } : {}),
      ...(typeof body.category === "string" ? { category: body.category } : {}),
      ...(typeof body.inStock === "boolean" ? { inStock: body.inStock } : {}),
      ...(typeof body.active === "boolean" ? { active: body.active } : {}),
    },
  });

  return jsonOk(serializeAccessory(item));
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  const { slug } = await params;
  await prisma.accessory.delete({ where: { slug } });
  return jsonOk({ ok: true });
}
