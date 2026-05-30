"use client";

import Link from "next/link";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { usePlatformMode } from "@/context/PlatformModeContext";
import { getNavLinks } from "@/lib/navigation";
import { ease, spring } from "@/lib/motion";
import { AppIcon } from "./AppIcon";
import { BrandLogo } from "./BrandLogo";
import { CartBadge } from "./cart/CartBadge";
import { HeaderMobileMenu } from "./HeaderMobileMenu";
import { useCart } from "@/context/CartContext";

export function Header() {
  const { mode } = usePlatformMode();
  const { user } = useAuth();
  const { openCart } = useCart();
  const links = getNavLinks(mode);
  const reduce = useReducedMotion();
  const firstName = user?.name?.split(" ")?.[0] ?? "کاربر";

  return (
    <motion.header
      className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md"
      initial={reduce ? false : { y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease }}
    >
      <div className="mx-auto flex h-16 max-w-350 items-center justify-between gap-3 pl-4 pr-3 sm:gap-4 sm:pl-5 sm:pr-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <HeaderMobileMenu links={links} />
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <BrandLogo
              variant="farsi"
              className="mt-1 inline-flex max-w-[72px] shrink-0 sm:max-w-none"
            />
          </motion.div>
        </div>

        <nav className="hidden items-center gap-8 xl:flex">
          {links.map((link, i) => (
            <motion.div
              key={link.href}
              initial={reduce ? false : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06, duration: 0.45, ease }}
            >
              <Link
                href={link.href}
                className="group relative text-sm font-medium text-foreground transition hover:opacity-80"
              >
                {link.label}
                <motion.span
                  className="absolute -bottom-1 right-0 h-px w-0 bg-accent group-hover:w-full"
                  transition={{ duration: 0.3, ease }}
                />
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 text-foreground sm:gap-4">
          <AnimatePresence mode="wait">
            {user && (
              <motion.div
                key="user-pill"
                initial={{ opacity: 0, x: 12, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 8 }}
                transition={spring}
                className="hidden items-center gap-2 sm:flex"
              >
                <Link
                  href="/account"
                  className="rounded-full border border-foreground/25 bg-foreground/10 px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-foreground/15"
                >
                  سلام، {firstName}
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div whileHover={{ scale: 1.12, rotate: 3 }} whileTap={{ scale: 0.9 }}>
            <button
              type="button"
              onClick={openCart}
              aria-label="سبد خرید"
              className="relative block opacity-85 hover:opacity-100"
            >
              <FaShoppingCart className="text-[22px] text-icon" />
              <CartBadge />
            </button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.12, rotate: 3 }} whileTap={{ scale: 0.9 }}>
            <Link
              href={user ? "/account" : "/login"}
              aria-label="حساب کاربری"
              className="relative block"
            >
              {user ? (
                <span className="relative flex items-center">
                  <span className="absolute -inset-1 rounded-full bg-accent/25 blur-sm" />
                  <FaUserCircle className="relative text-[24px] text-icon" />
                  <motion.span
                    className="absolute -bottom-0.5 -left-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={spring}
                  />
                </span>
              ) : (
                <FaUserCircle className="text-[24px] text-icon opacity-85" />
              )}
            </Link>
          </motion.div>

          <motion.button
            type="button"
            aria-label="زبان"
            className="hidden opacity-85 sm:block"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
          >
            <AppIcon name="globe" className="animate-spin" size={44} />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
