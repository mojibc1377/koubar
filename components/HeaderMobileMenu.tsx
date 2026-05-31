/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { usePlatformMode } from "@/context/PlatformModeContext";
import { ease, spring, staggerContainer, staggerItem } from "@/lib/motion";
import { Z } from "@/lib/z-index";
import { BrandLogo } from "./BrandLogo";

type NavLink = { href: string; label: string };

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-5 w-6" aria-hidden>
      <motion.span
        className="absolute left-0 top-0 h-0.5 w-6 origin-center rounded-full bg-icon"
        animate={open ? { top: 9, rotate: 45 } : { top: 0, rotate: 0 }}
        transition={spring}
      />
      <motion.span
        className="absolute left-0 top-[9px] h-0.5 w-6 origin-center rounded-full bg-icon"
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={spring}
      />
      <motion.span
        className="absolute left-0 top-[18px] h-0.5 w-6 origin-center rounded-full bg-icon"
        animate={open ? { top: 9, rotate: -45 } : { top: 18, rotate: 0 }}
        transition={spring}
      />
    </span>
  );
}

export function HeaderMobileMenu({ links }: { links: readonly NavLink[] }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const { mode } = usePlatformMode();
  const reduce = useReducedMotion();
  const firstName = user?.name?.split(" ")?.[0] ?? "کاربر";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const overlay = mounted
    ? createPortal(
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                className="fixed inset-0 bg-foreground/35 backdrop-blur-md"
                style={{ zIndex: Z.mobileMenuBackdrop }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease }}
                onClick={() => setOpen(false)}
              />
              <motion.nav
                role="dialog"
                aria-modal="true"
                aria-label="منوی اصلی"
                className="fixed inset-y-0 right-0 flex w-[min(100vw,340px)] flex-col overflow-hidden border-l border-border bg-background shadow-2xl backdrop-blur-xl"
                style={{ zIndex: Z.mobileMenu }}
                initial={reduce ? false : { x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={spring}
              >
                <div className="pointer-events-none absolute -left-16 top-20 h-48 w-48 rounded-full bg-accent/15 blur-3xl" />
                <div className="pointer-events-none absolute -right-10 bottom-24 h-40 w-40 rounded-full bg-foreground/5 blur-3xl" />

                <div className="relative flex items-center justify-between border-b border-border px-5 py-4">
                  <BrandLogo variant="farsi" />
                  <motion.button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-muted"
                    whileHover={{ scale: 1.05, borderColor: "rgba(87,91,73,0.5)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    بستن
                  </motion.button>
                </div>
                <motion.div
                  className="relative flex-1 justify-between overflow-y-auto px-4 py-6"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.p
                    variants={staggerItem}
                    className="mb-4 px-2 text-xs font-medium text-accent"
                  >
                    {mode === "cafe" ? "منوی کافه" : "فروشگاه"}
                  </motion.p>
<div>
                  <ul className="space-y-2">
                    {links.map((link) => {
                      const base = link.href.split("#")[0];
                      const active =
                        pathname === link.href ||
                        (base !== "/" && pathname.startsWith(base));
                      return (
                        <motion.li key={link.href} variants={staggerItem}>
                          <Link
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="group block"
                          >
                            <motion.span
                              className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-base font-semibold transition ${
                                active
                                  ? "border-accent/50 bg-accent text-background"
                                  : "border-border bg-card text-foreground hover:border-accent/40 hover:bg-accent/5"
                              }`}
                              whileHover={reduce ? {} : { x: -6 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {link.label}
                              <motion.span
                                className={`text-lg ${active ? "opacity-90" : "opacity-0 group-hover:opacity-60"}`}
                                animate={{ x: active ? -4 : 0 }}
                              >
                                ←
                              </motion.span>
                            </motion.span>
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>
                  </div>
<div>
                  <motion.div
                    variants={staggerItem}
                    className="mt-8 rounded-2xl border border-border bg-linear-to-br from-accent/10 to-card p-4"
                  >
                    {user ? (
                      <Link
                        href="/account"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3"
                      >
                        <FaUserCircle className="text-2xl text-icon" />
                        <div>
                          <p className="text-sm font-bold">سلام، {firstName}</p>
                          <p className="text-xs text-muted">مدیریت حساب کاربری</p>
                        </div>
                      </Link>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Link
                          href="/login"
                          onClick={() => setOpen(false)}
                          className="rounded-xl bg-accent py-3 text-center text-sm font-bold text-background"
                        >
                          ورود
                        </Link>
                        <Link
                          href="/signup"
                          onClick={() => setOpen(false)}
                          className="rounded-xl border border-border py-3 text-center text-sm font-semibold"
                        >
                          ثبت‌نام
                        </Link>
                      </div>
                    )}
                  </motion.div>
                  </div>
                </motion.div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )
    : null;

  return (
    <div className="xl:hidden">
      <motion.button
        type="button"
        aria-label={open ? "بستن منو" : "باز کردن منو"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/80 backdrop-blur-sm"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        <MenuIcon open={open} />
        <AnimatePresence>
          {open && (
            <motion.span
              className="absolute inset-0 rounded-xl border border-accent/40"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
      </motion.button>
      {overlay}
    </div>
  );
}
