"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { BlogContentBlock } from "@/lib/types";
import { ease } from "@/lib/motion";

export function BlogContent({ blocks }: { blocks: BlogContentBlock[] }) {
  const reduce = useReducedMotion();

  return (
    <div className="space-y-8">
      {blocks.map((block, i) => (
        <motion.div
          key={`${block.type}-${i}`}
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: Math.min(i * 0.04, 0.2), ease }}
        >
          {block.type === "paragraph" && (
            <p className="text-lg leading-[2.1] text-foreground/88 first-letter:float-right first-letter:ms-1 first-letter:text-5xl first-letter:font-extrabold first-letter:text-accent">
              {block.text}
            </p>
          )}
          {block.type === "heading" && (
            <h2 className="relative pt-2 text-2xl font-extrabold text-foreground">
              <span className="absolute right-0 top-0 h-1 w-12 rounded-full bg-accent" />
              <span className="mt-3 block">{block.text}</span>
            </h2>
          )}
          {block.type === "quote" && (
            <blockquote className="relative rounded-2xl border-r-4 border-accent bg-accent/10 px-6 py-5">
              <p className="text-xl font-medium leading-10 text-foreground/90">
                «{block.text}»
              </p>
              {block.cite && (
                <footer className="mt-3 text-sm text-muted">— {block.cite}</footer>
              )}
            </blockquote>
          )}
          {block.type === "callout" && (
            <div
              className={`rounded-2xl border p-5 ${
                block.variant === "tip"
                  ? "border-accent/40 bg-accent/10"
                  : "border-border-strong bg-card-elevated"
              }`}
            >
              <p className="text-sm font-bold text-accent">{block.title}</p>
              <p className="mt-2 leading-8 text-foreground/85">{block.text}</p>
            </div>
          )}
          {block.type === "list" && (
            <ul
              className={`space-y-3 pr-1 ${
                block.ordered ? "list-decimal list-inside" : "list-disc list-inside"
              }`}
            >
              {block.items.map((item) => (
                <li key={item} className="text-lg leading-9 text-foreground/85">
                  {item}
                </li>
              ))}
            </ul>
          )}
          {block.type === "divider" && (
            <hr className="border-0 bg-linear-to-l from-transparent via-border-strong to-transparent h-px" />
          )}
        </motion.div>
      ))}
    </div>
  );
}
