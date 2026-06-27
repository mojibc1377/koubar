import { BlogStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api/auth";
import { jsonError, jsonOk } from "@/lib/api/errors";
import { serializeBlog } from "@/lib/serializers";

export async function GET() {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  const posts = await prisma.blogPost.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return jsonOk(posts.map(serializeBlog));
}

export async function POST(request: Request) {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  const body = (await request.json()) as {
    slug?: string;
    title?: string;
    excerpt?: string;
    image?: string;
    author?: string;
    category?: string;
    readMinutes?: number;
    status?: string;
    blocks?: unknown[];
  };

  if (!body.slug?.trim() || !body.title?.trim()) {
    return jsonError("عنوان و اسلاگ الزامی است");
  }

  const status =
    body.status === "published" ? BlogStatus.PUBLISHED : BlogStatus.DRAFT;

  const post = await prisma.blogPost.create({
    data: {
      slug: body.slug.trim(),
      title: body.title.trim(),
      excerpt: body.excerpt?.trim() ?? "",
      image: body.image ?? "/images/seasonal.png",
      author: body.author?.trim() ?? "تیم کوبار",
      category: body.category?.trim() ?? "دانش قهوه",
      readMinutes: Number(body.readMinutes) || 5,
      status,
      blocks: (body.blocks ?? []) as Prisma.InputJsonValue,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });

  return jsonOk(serializeBlog(post));
}
