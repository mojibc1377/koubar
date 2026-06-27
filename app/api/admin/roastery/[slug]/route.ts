import { RoasteryVariant } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api/auth";
import { jsonError, jsonOk } from "@/lib/api/errors";
import { serializeRoastery } from "@/lib/serializers";

function toVariant(v: string): RoasteryVariant {
  if (v === "kenya") return RoasteryVariant.KENYA;
  if (v === "street") return RoasteryVariant.STREET;
  return RoasteryVariant.AFRICAN;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  const { slug } = await params;
  const body = (await request.json()) as Record<string, unknown>;

  const product = await prisma.roasteryProduct.update({
    where: { slug },
    data: {
      ...(typeof body.title === "string" ? { title: body.title } : {}),
      ...(typeof body.description === "string"
        ? { description: body.description, longDescription: body.description }
        : {}),
      ...(typeof body.price === "number" ? { price: body.price } : {}),
      ...(typeof body.badge === "string" ? { badge: body.badge || null } : {}),
      ...(typeof body.variant === "string"
        ? { variant: toVariant(body.variant) }
        : {}),
      ...(typeof body.inStock === "boolean" ? { inStock: body.inStock } : {}),
      ...(typeof body.active === "boolean" ? { active: body.active } : {}),
    },
  });

  return jsonOk(serializeRoastery(product));
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  const { slug } = await params;
  await prisma.roasteryProduct.delete({ where: { slug } });
  return jsonOk({ ok: true });
}
