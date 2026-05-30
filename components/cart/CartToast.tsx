"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { spring } from "@/lib/motion";
import { Z } from "@/lib/z-index";

export function CartToast() {
  const { toast, clearToast, count, openCart } = useCart();

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(clearToast, 2800);
    return () => window.clearTimeout(timer);
  }, [toast, clearToast]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="fixed bottom-24 left-1/2 w-[min(92vw,360px)] -translate-x-1/2 sm:bottom-8 sm:left-8 sm:translate-x-0"
          style={{ zIndex: Z.cartToast }}
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={spring}
        >
          <div className="flex items-center gap-3 overflow-hidden rounded-2xl border border-border-strong bg-background/95 p-3 shadow-2xl shadow-accent/20 backdrop-blur-xl">
            <motion.div
              className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border"
              initial={{ rotate: -8, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={spring}
            >
              <Image
                src={toast.image ?? "/images/hero.png"}
                alt=""
                fill
                className="object-cover"
                sizes="56px"
              />
            </motion.div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-accent">به سبد اضافه شد</p>
              <p className="truncate font-bold">{toast.title}</p>
              <p className="mt-1 text-xs text-muted">
                {count.toLocaleString("fa-IR")} آیتم در سبد
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                clearToast();
                openCart();
              }}
              className="shrink-0 rounded-xl bg-accent px-3 py-2 text-xs font-bold text-background"
            >
              مشاهده
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
