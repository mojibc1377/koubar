import { prisma } from "@/lib/prisma";
import { serializeAccessory } from "@/lib/serializers";
import { jsonOk } from "@/lib/api/errors";

export async function GET() {
  const items = await prisma.accessory.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  return jsonOk(items.map(serializeAccessory));
}
