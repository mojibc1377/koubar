"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { AdminButton } from "./AdminButton";
import { spring } from "@/lib/motion";

export function AdminModal({
  open,
  title,
  onClose,
  children,
  wide,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center">
          <motion.button
            type="button"
            aria-label="بستن"
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal
            className={`relative max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-[#fffbf52e] bg-[#3d3d3a] shadow-2xl ${
              wide ? "max-w-2xl" : "max-w-lg"
            }`}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={spring}
          >
            <div className="flex items-center justify-between border-b border-[#fffbf51a] px-5 py-4">
              <h2 className="text-lg font-bold">{title}</h2>
              <AdminButton variant="ghost" onClick={onClose}>
                ✕
              </AdminButton>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
