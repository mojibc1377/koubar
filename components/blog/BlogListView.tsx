"use client";

import { BlogCard } from "@/components/blog/BlogCard";
import { Reveal } from "@/components/motion/Reveal";
import { useBlogs } from "@/hooks/use-blogs";

export function BlogListView({ title, description }: { title: string; description: string }) {
  const { data: posts = [], isLoading, isError } = useBlogs();

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10 lg:py-24">
      <Reveal>
        <h1 className="text-4xl font-extrabold">{title}</h1>
        <p className="mt-4 max-w-2xl text-muted">{description}</p>
      </Reveal>
      {isLoading && (
        <p className="mt-12 text-sm text-muted">در حال بارگذاری مقالات…</p>
      )}
      {isError && (
        <p className="mt-12 text-sm text-red-600">بارگذاری مقالات ناموفق بود.</p>
      )}
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {posts.map((post, index) => (
          <BlogCard key={post.slug} post={post} index={index} />
        ))}
      </div>
    </div>
  );
}
