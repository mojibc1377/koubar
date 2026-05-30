import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { blogPosts, getPost } from "@/lib/blog";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
        <Link href="/blog" className="text-sm text-muted hover:text-accent">
          ← بازگشت به وبلاگ
        </Link>
        <p className="mt-6 text-xs text-muted">
          {post.category} · {post.date} · {post.readMinutes} دقیقه
        </p>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight md:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-muted">نویسنده: {post.author}</p>
        <div className="mt-10 space-y-6 border-t border-border pt-10">
          {post.content.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="text-lg leading-9 text-foreground/80">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </PageShell>
  );
}
