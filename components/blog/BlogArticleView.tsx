"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogContent } from "@/components/blog/BlogContent";
import type { BlogPost } from "@/lib/types";
import { ease } from "@/lib/motion";

export function BlogArticleView({
  post,
  related,
}: {
  post: BlogPost;
  related: BlogPost[];
}) {
  const reduce = useReducedMotion();
  const blocks =
    post.blocks.length > 0
      ? post.blocks
      : post.content.map((text) => ({ type: "paragraph" as const, text }));

  return (
    <article>
      <div className="relative -mx-6 mb-10 h-[min(52vh,420px)] overflow-hidden lg:-mx-10 lg:rounded-3xl">
        <Image
          src={post.image}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-foreground/20" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 pb-10 lg:p-10">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <Link
              href="/blog"
              className="inline-flex rounded-full border border-border-strong bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur-sm"
            >
              ← بازگشت به وبلاگ
            </Link>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-background">
                {post.category}
              </span>
              <span className="rounded-full bg-background/80 px-3 py-1 text-xs backdrop-blur-sm">
                {post.date}
              </span>
              <span className="rounded-full bg-background/80 px-3 py-1 text-xs backdrop-blur-sm">
                {post.readMinutes} دقیقه مطالعه
              </span>
            </div>
            <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight text-foreground md:text-5xl md:leading-[1.2]">
              {post.title}
            </h1>
            <p className="mt-4 text-sm text-muted">نویسنده: {post.author}</p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl">
        <p className="mb-10 rounded-2xl border border-border bg-card p-5 text-lg leading-9 text-muted">
          {post.excerpt}
        </p>
        <BlogContent blocks={blocks} />
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-20 max-w-[1400px] border-t border-border pt-16">
          <h2 className="text-2xl font-extrabold">مطالب مرتبط</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {related.map((p, i) => (
              <BlogCard key={p.slug} post={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
