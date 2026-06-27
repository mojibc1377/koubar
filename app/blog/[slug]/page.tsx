import { BlogPostClient } from "@/components/blog/BlogPostClient";
import { PageShell } from "@/components/PageShell";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <PageShell>
      <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10 lg:py-14">
        <BlogPostClient slug={slug} />
      </div>
    </PageShell>
  );
}
