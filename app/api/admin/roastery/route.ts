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

export async function GET() {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  const products = await prisma.roasteryProduct.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return jsonOk(
    products.map((p) => ({
      ...serializeRoastery(p),
      inStock: p.inStock,
      active: p.active,
    })),
  );
}

export async function POST(request: Request) {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  const body = (await request.json()) as {
    slug?: string;
    title?: string;
    description?: string;
    price?: number;
    badge?: string;
    variant?: string;
    inStock?: boolean;
    image?: string;
  };

  if (!body.title?.trim() || !body.slug?.trim()) {
    return jsonError("عنوان و شناسه الزامی است");
  }

  const product = await prisma.roasteryProduct.create({
    data: {
      slug: body.slug.trim(),
      title: body.title.trim(),
      description: body.description?.trim() ?? "",
      longDescription: body.description?.trim(),
      image: body.image ?? "/images/hero.png",
      price: Number(body.price) || 0,
      badge: body.badge,
      variant: toVariant(body.variant ?? "african"),
      inStock: body.inStock ?? true,
      active: true,
    },
  });

  return jsonOk(serializeRoastery(product));
}
