"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { BlogPost } from "@/lib/types";
import { spring } from "@/lib/motion";

export function BlogCard({ post, index = 0 }: { post: BlogPost; index?: number }) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-xl hover:shadow-accent/10"
      initial={reduce ? false : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      whileHover={reduce ? {} : { y: -8 }}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={post.image}
            alt=""
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-foreground/75 via-foreground/25 to-transparent" />
          <span className="absolute right-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground">
            {post.category}
          </span>
        </div>
        <div className="p-6">
          <time className="text-xs text-muted">{post.date}</time>
          <h2 className="mt-2 text-xl font-bold leading-9 transition group-hover:text-accent">
            {post.title}
          </h2>
          <p className="mt-3 line-clamp-2 text-sm leading-7 text-muted">{post.excerpt}</p>
          <div className="mt-5 flex items-center justify-between text-xs text-muted">
            <span>{post.author}</span>
            <span>{post.readMinutes} دقیقه مطالعه</span>
          </div>
          <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent">
            ادامه مطلب
            <motion.span
              animate={{ x: [0, -4, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              ←
            </motion.span>
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
