"use client";

import { Children, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";

export function Stagger({
  children,
  className = "",
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-60px" });
  const hasChildren = Children.count(children) > 0;

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  // Only reveal once children exist. whileInView on an empty list fires too early;
  // items added after fetch stay at opacity: 0 until a full page refresh.
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={hasChildren && isInView ? "visible" : "hidden"}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}
