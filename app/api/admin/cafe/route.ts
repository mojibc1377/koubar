import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api/auth";
import { jsonError, jsonOk } from "@/lib/api/errors";
import { serializeCafeItem } from "@/lib/serializers";

export async function GET() {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  const categories = await prisma.cafeCategory.findMany({
    include: { items: { orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });

  const flat = categories.flatMap((cat) =>
    cat.items.map((item) => ({
      ...serializeCafeItem(item),
      categoryId: cat.id,
      categoryName: cat.name,
      active: item.active,
    })),
  );

  return jsonOk(flat);
}

export async function POST(request: Request) {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  const body = (await request.json()) as {
    slug?: string;
    name?: string;
    description?: string;
    price?: number;
    categoryId?: string;
    image?: string;
    badge?: string;
    notes?: string[];
  };

  if (!body.slug?.trim() || !body.name?.trim() || !body.categoryId) {
    return jsonError("فیلدهای الزامی کامل نیست");
  }

  const item = await prisma.cafeMenuItem.create({
    data: {
      slug: body.slug.trim(),
      name: body.name.trim(),
      description: body.description?.trim() ?? "",
      image: body.image ?? "/images/hero.png",
      price: Number(body.price) || 0,
      badge: body.badge,
      notes: body.notes ?? [],
      categoryId: body.categoryId,
      active: true,
    },
    include: { category: true },
  });

  return jsonOk({
    ...serializeCafeItem(item),
    categoryId: item.categoryId,
    categoryName: item.category.name,
  });
}
