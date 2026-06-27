"use client";

import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { spring } from "@/lib/motion";
import type { Order } from "@/lib/types";

const statusLabels: Record<Order["status"], string> = {
  delivered: "تحویل شده",
  processing: "در حال پردازش",
  cancelled: "لغو شده",
};

const statusColors: Record<Order["status"], string> = {
  delivered: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  processing: "bg-amber-500/15 text-amber-800 border-amber-500/30",
  cancelled: "bg-red-500/10 text-red-700 border-red-500/25",
};

const steps = ["ثبت", "پردازش", "ارسال", "تحویل"];

function stepIndex(status: Order["status"]) {
  if (status === "cancelled") return 0;
  if (status === "processing") return 1;
  if (status === "delivered") return 3;
  return 2;
}

export function OrderCard({
  order,
  index,
  showReviewButton,
  onReviewClick,
}: {
  order: Order;
  index: number;
  showReviewButton?: boolean;
  onReviewClick?: () => void;
}) {
  const [open, setOpen] = useState(index === 0);
  const reduce = useReducedMotion();
  const active = stepIndex(order.status);

  return (
    <motion.li
      layout
      className="overflow-hidden rounded-2xl border border-border bg-card"
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: index * 0.06 }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 p-5 text-right transition hover:bg-foreground/[0.02]"
      >
        <div>
          <p className="font-bold">{order.id}</p>
          <p className="mt-1 text-sm text-muted">{order.date}</p>
          <p className="mt-2 text-xs text-muted">
            {order.type === "shop" ? "فروشگاه آنلاین" : "کافه"}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium ${statusColors[order.status]}`}
          >
            {statusLabels[order.status]}
          </span>
          <p className="font-bold">{formatPrice(order.total)}</p>
          {showReviewButton && onReviewClick && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onReviewClick();
              }}
              className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent transition hover:bg-accent/20"
            >
              ثبت نظر
            </button>
          )}
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            className="text-xs text-muted"
          >
            ▼
          </motion.span>
        </div>
      </button>

      <div className="px-5 pb-2">
        <div className="flex items-center justify-between gap-1">
          {steps.map((label, i) => (
            <div key={label} className="flex flex-1 flex-col items-center gap-1">
              <motion.div
                className={`h-2 w-full max-w-[48px] rounded-full ${
                  i <= active ? "bg-accent" : "bg-border"
                }`}
                initial={false}
                animate={{ scaleX: i <= active ? 1 : 0.6 }}
              />
              <span className="text-[10px] text-muted">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden border-t border-border"
          >
            <ul className="space-y-3 p-5 pt-4">
              {order.items.map((item) => (
                <li
                  key={item.id + item.title}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 overflow-hidden rounded-lg border border-border">
                      <Image
                        src="/images/hero.png"
                        alt=""
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    </div>
                    <span className="text-foreground/80">
                      {item.title} × {item.quantity.toLocaleString("fa-IR")}
                    </span>
                  </div>
                  <span className="font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}
