import { prisma } from "@/lib/prisma";
import { jsonOk } from "@/lib/api/errors";

export async function GET() {
  const gifts = await prisma.giftItem.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  return jsonOk(
    gifts.map((g) => ({
      id: g.id,
      title: g.title,
      description: g.description,
      image: g.image,
      linkHref: g.linkHref,
    })),
  );
}
