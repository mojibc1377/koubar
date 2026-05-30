"use client";

import { motion, useReducedMotion } from "framer-motion";

export function FloatingOrbs() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -left-16 bottom-32 h-56 w-56 rounded-full bg-foreground/5 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, -25, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/3 top-1/2 h-40 w-40 rounded-full bg-accent/8 blur-2xl"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
