"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { spring } from "@/lib/motion";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
};

const variants = {
  primary: "bg-accent text-background border border-transparent",
  secondary: "border border-border-strong bg-card text-foreground",
  ghost: "text-foreground/80",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  disabled,
  onClick,
  href,
}: ButtonProps) {
  const reduce = useReducedMotion();
  const base =
    "inline-flex items-center justify-center px-6 py-3 text-sm font-semibold disabled:opacity-50";

  const motionProps = reduce
    ? {}
    : {
        whileHover: { scale: 1.03, y: -2 },
        whileTap: { scale: 0.97 },
        transition: spring,
      };

  if (href) {
    return (
      <motion.div {...motionProps} className="inline-flex">
        <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
