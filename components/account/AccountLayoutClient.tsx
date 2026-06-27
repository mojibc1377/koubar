"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useMyOrders } from "@/hooks/use-orders";
import { formatPrice } from "@/lib/format";
import { ease } from "@/lib/motion";
import { AccountNav } from "./AccountNav";

export function AccountLayoutClient({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const reduce = useReducedMotion();
  const { data: orders = [] } = useMyOrders();
  const totalSpent = orders.reduce((s, o) => s + o.total, 0);
  const delivered = orders.filter((o) => o.status === "delivered").length;

  const firstName = user?.name?.split(" ")?.[0] ?? "کاربر";

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10 lg:py-16">
      <motion.div
        className="relative mb-10 overflow-hidden rounded-3xl border border-border bg-linear-to-br from-accent/15 via-card to-background p-6 md:p-10"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease }}
      >
        <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-foreground/5 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <motion.p
              className="text-sm text-accent"
              initial={reduce ? false : { opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              پنل کاربری
            </motion.p>
            <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">
              سلام، {firstName} 👋
            </h1>
            <p className="mt-2 max-w-md text-sm text-muted" dir="ltr">
              {user?.phone}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "سفارش‌ها", value: orders.length.toLocaleString("fa-IR") },
              { label: "تحویل‌شده", value: delivered.toLocaleString("fa-IR") },
              { label: "مجموع خرید", value: formatPrice(totalSpent) },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="min-w-[120px] rounded-2xl border border-border-strong bg-background/80 px-4 py-3 backdrop-blur-sm"
                initial={reduce ? false : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + i * 0.08, ease }}
                whileHover={{ y: -4 }}
              >
                <p className="text-xs text-muted">{stat.label}</p>
                <p className="mt-1 text-lg font-bold">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <AccountNav />
        <motion.div
          initial={reduce ? false : { opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
