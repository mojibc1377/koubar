"use client";

import { motion, useReducedMotion } from "framer-motion";
import { spring } from "@/lib/motion";

export function IconCart() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 6h15l-1.5 9h-12z" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
      <path d="M6 6L5 3H2" />
    </svg>
  );
}

export function IconUser() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
    </svg>
  );
}

export function IconGlobe() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 4.5 7 4.5 9S15 18 12 21M12 3c-3 3-4.5 7-4.5 9S9 18 12 21" />
    </svg>
  );
}

export function IconCup() {
  return (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M12 16h20v16c0 4-4 8-10 8s-10-4-10-8V16z" />
      <path d="M32 20h4c2 0 4 2 4 5s-2 5-4 5h-4" />
      <path d="M14 12h16" />
    </svg>
  );
}

export function IconBranch() {
  return (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M24 40V20M24 20c-6-8-14-6-14-14M24 20c6-8 14-6 14-14" />
      <circle cx="10" cy="8" r="2" fill="currentColor" />
      <circle cx="38" cy="8" r="2" fill="currentColor" />
      <circle cx="24" cy="6" r="2" fill="currentColor" />
    </svg>
  );
}

export function IconBeans() {
  return (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
      <ellipse cx="16" cy="28" rx="6" ry="8" />
      <ellipse cx="24" cy="26" rx="6" ry="8" />
      <ellipse cx="32" cy="28" rx="6" ry="8" />
      <path d="M14 14c2-2 6-2 10 0M24 12c2-2 6-2 10 0" />
    </svg>
  );
}

export function IconBags() {
  return (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="8" y="16" width="14" height="22" rx="2" />
      <rect x="26" y="16" width="14" height="22" rx="2" />
      <path d="M12 16V12h6v4M30 16V12h6v4" />
    </svg>
  );
}

export function CarouselArrows({
  onPrev,
  onNext,
}: {
  onPrev: () => void;
  onNext: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="flex gap-2">
      <motion.button
        type="button"
        onClick={onNext}
        aria-label="بعدی"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border-strong text-muted"
        whileHover={reduce ? {} : { scale: 1.1, borderColor: "#575b49", color: "#343434" }}
        whileTap={{ scale: 0.92 }}
        transition={spring}
      >
        ‹
      </motion.button>
      <motion.button
        type="button"
        onClick={onPrev}
        aria-label="قبلی"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border-strong text-muted"
        whileHover={reduce ? {} : { scale: 1.1, borderColor: "#575b49", color: "#343434" }}
        whileTap={{ scale: 0.92 }}
        transition={spring}
      >
        ›
      </motion.button>
    </div>
  );
}
