import { prisma } from "@/lib/prisma";
import { serializeRoastery } from "@/lib/serializers";
import { jsonOk } from "@/lib/api/errors";

export async function GET() {
  const products = await prisma.roasteryProduct.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  return jsonOk(products.map(serializeRoastery));
}
