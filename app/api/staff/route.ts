import { prisma } from "@/lib/prisma";
import { jsonOk } from "@/lib/api/errors";

export async function GET() {
  const staff = await prisma.staff.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      role: true,
      avatar: true,
    },
  });

  return jsonOk(staff);
}
