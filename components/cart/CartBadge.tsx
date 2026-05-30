"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

export function CartBadge() {
  const { count } = useCart();

  return (
    <AnimatePresence mode="popLayout">
      {count > 0 && (
        <motion.span
          key={count}
          className="absolute -left-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white"
          initial={{ scale: 0 }}
          animate={{ scale: [0.6, 1.15, 1] }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.35 }}
        >
          {count > 9 ? "۹+" : count.toLocaleString("fa-IR")}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
