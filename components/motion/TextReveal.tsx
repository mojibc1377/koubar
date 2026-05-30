"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ease } from "@/lib/motion";

export function TextReveal({
  lines,
  className = "",
}: {
  lines: string[];
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <h1 className={className}>
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>
    );
  }

  return (
    <motion.h1
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {lines.map((line) => (
        <motion.span
          key={line}
          className="block overflow-hidden"
          variants={{
            hidden: {},
            visible: {},
          }}
        >
          <motion.span
            className="block"
            variants={{
              hidden: { y: "110%", opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: { duration: 0.65, ease },
              },
            }}
          >
            {line}
          </motion.span>
        </motion.span>
      ))}
    </motion.h1>
  );
}
