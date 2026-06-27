import { BlogStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api/auth";
import { jsonOk } from "@/lib/api/errors";
import { serializeBlog } from "@/lib/serializers";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  const { slug } = await params;
  const body = (await request.json()) as Record<string, unknown>;

  const status =
    body.status === "published"
      ? BlogStatus.PUBLISHED
      : body.status === "draft"
        ? BlogStatus.DRAFT
        : undefined;

  const post = await prisma.blogPost.update({
    where: { slug },
    data: {
      ...(typeof body.title === "string" ? { title: body.title } : {}),
      ...(typeof body.excerpt === "string" ? { excerpt: body.excerpt } : {}),
      ...(typeof body.image === "string" ? { image: body.image } : {}),
      ...(typeof body.author === "string" ? { author: body.author } : {}),
      ...(typeof body.category === "string" ? { category: body.category } : {}),
      ...(typeof body.readMinutes === "number"
        ? { readMinutes: body.readMinutes }
        : {}),
      ...(Array.isArray(body.blocks)
        ? { blocks: body.blocks as Prisma.InputJsonValue }
        : {}),
      ...(status
        ? {
            status,
            publishedAt: status === "PUBLISHED" ? new Date() : null,
          }
        : {}),
    },
  });

  return jsonOk(serializeBlog(post));
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  const { slug } = await params;
  await prisma.blogPost.delete({ where: { slug } });
  return jsonOk({ ok: true });
}
