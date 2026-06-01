import { notFound } from "next/navigation";
import { BlogArticleView } from "@/components/blog/BlogArticleView";
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

  const related = blogPosts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <PageShell>
      <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10 lg:py-14">
        <BlogArticleView post={post} related={related} />
      </div>
    </PageShell>
  );
}
