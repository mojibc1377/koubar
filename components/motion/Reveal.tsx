"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ease, fadeUp } from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variants?: Variants;
  once?: boolean;
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  variants = fadeUp,
  once = true,
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export function MotionSection({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <section id={id} className={`relative overflow-hidden ${className}`}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease }}
    >
      {children}
    </motion.section>
  );
}
