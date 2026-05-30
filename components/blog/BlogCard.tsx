"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { BlogPost } from "@/lib/types";
import { icons } from "@/lib/icons";
import { spring } from "@/lib/motion";

export function BlogCard({ post, index = 0 }: { post: BlogPost; index?: number }) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      className="group overflow-hidden border border-border bg-card transition-shadow hover:shadow-xl hover:shadow-accent/10"
      initial={reduce ? false : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      whileHover={reduce ? {} : { y: -8 }}
    >
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <motion.div whileHover={{ rotate: 12, scale: 1.1 }} transition={spring}>
          <Image src={icons.blog} alt="" width={28} height={28} className="opacity-80" />
        </motion.div>
        <span className="text-xs text-muted">{post.category}</span>
      </div>
      <div className="p-6">
        <time className="text-xs text-muted">{post.date}</time>
        <h2 className="mt-2 text-xl font-bold leading-9 transition group-hover:text-accent">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted">{post.excerpt}</p>
        <div className="mt-5 flex items-center justify-between text-xs text-muted">
          <span>{post.author}</span>
          <span>{post.readMinutes} دقیقه مطالعه</span>
        </div>
        <Link
          href={`/blog/${post.slug}`}
          className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-foreground"
        >
          ادامه مطلب
          <motion.span animate={{ x: [0, -4, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
            ←
          </motion.span>
        </Link>
      </div>
    </motion.article>
  );
}
