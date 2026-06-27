import { prisma } from "@/lib/prisma";
import { serializeBlog } from "@/lib/serializers";
import { jsonOk } from "@/lib/api/errors";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? "published";
  const isAdmin = searchParams.get("admin") === "1";

  const where =
    status === "all"
      ? {}
      : {
          status:
            status === "draft" ? ("DRAFT" as const) : ("PUBLISHED" as const),
        };

  const posts = await prisma.blogPost.findMany({
    where: isAdmin ? where : { ...where, status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });

  return jsonOk(posts.map(serializeBlog));
}
