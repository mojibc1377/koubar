"use client";

import { notFound } from "next/navigation";
import { BlogArticleView } from "@/components/blog/BlogArticleView";
import { useBlog, useBlogs } from "@/hooks/use-blogs";

export function BlogPostClient({ slug }: { slug: string }) {
  const { data: post, isLoading, isError } = useBlog(slug);
  const { data: allPosts = [] } = useBlogs();

  if (isLoading) {
    return <p className="py-20 text-center text-muted">در حال بارگذاری…</p>;
  }

  if (isError || !post) {
    notFound();
  }

  const related = allPosts.filter((p) => p.slug !== slug).slice(0, 2);

  return <BlogArticleView post={post} related={related} />;
}
