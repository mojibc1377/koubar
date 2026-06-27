import { prisma } from "@/lib/prisma";
import { serializeCafeCategory } from "@/lib/serializers";
import { jsonOk } from "@/lib/api/errors";

export async function GET() {
  const categories = await prisma.cafeCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      items: { where: { active: true }, orderBy: { sortOrder: "asc" } },
    },
  });

  return jsonOk(categories.map(serializeCafeCategory));
}
