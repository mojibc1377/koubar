import { prisma } from "@/lib/prisma";
import { serializeBlog } from "@/lib/serializers";
import { jsonError, jsonOk } from "@/lib/api/errors";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });

  if (!post || post.status !== "PUBLISHED") {
    return jsonError("مقاله یافت نشد", 404);
  }

  return jsonOk(serializeBlog(post));
}
