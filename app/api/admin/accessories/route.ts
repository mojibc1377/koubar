import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api/auth";
import { jsonError, jsonOk } from "@/lib/api/errors";
import { serializeAccessory } from "@/lib/serializers";

export async function GET() {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  const items = await prisma.accessory.findMany({ orderBy: { sortOrder: "asc" } });
  return jsonOk(
    items.map((a) => ({
      ...serializeAccessory(a),
      inStock: a.inStock,
      active: a.active,
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
    category?: string;
    image?: string;
    badge?: string;
    notes?: string[];
  };

  if (!body.slug?.trim() || !body.title?.trim()) {
    return jsonError("عنوان و شناسه الزامی است");
  }

  const item = await prisma.accessory.create({
    data: {
      slug: body.slug.trim(),
      title: body.title.trim(),
      description: body.description?.trim() ?? "",
      longDescription: body.description?.trim(),
      image: body.image ?? "/images/hero.png",
      price: Number(body.price) || 0,
      category: body.category?.trim() ?? "عمومی",
      badge: body.badge,
      notes: body.notes ?? [],
      inStock: true,
      active: true,
    },
  });

  return jsonOk(serializeAccessory(item));
}
