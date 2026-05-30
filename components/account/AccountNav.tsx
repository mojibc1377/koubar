"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { AppIcon } from "@/components/AppIcon";
import { spring } from "@/lib/motion";

const links = [
  { href: "/account", label: "اطلاعات حساب", icon: "profile" as const },
  { href: "/account/orders", label: "سفارش‌ها و تراکنش‌ها", icon: "order" as const },
];

export function AccountNav() {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return (
    <nav className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-2">
      {links.map((link, i) => {
        const active = pathname === link.href;
        return (
          <motion.div
            key={link.href}
            initial={reduce ? false : { opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...spring, delay: i * 0.06 }}
          >
            <Link
              href={link.href}
              className={`relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3.5 text-sm font-medium transition ${
                active
                  ? "text-background"
                  : "text-muted hover:bg-foreground/5 hover:text-accent"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="account-nav-active"
                  className="absolute inset-0 bg-accent"
                  transition={spring}
                />
              )}
              <span className="relative z-10 flex items-center gap-3">
                <AppIcon name={link.icon} size={20} />
                {link.label}
              </span>
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
}
