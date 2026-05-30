"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedActionButtonProps {
  text: string;
  successText?: string;
  onClick?: () => void;
  isSuccess?: boolean;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  size?: "sm" | "md" | "lg";
}

export function AnimatedActionButton({
  text,
  successText = "انجام شد!",
  onClick,
  isSuccess = false,
  className,
  disabled = false,
  type = "button",
  size = "md",
}: AnimatedActionButtonProps) {
  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-4 py-2 text-xs rounded-xl",
    lg: "px-5 py-2.5 text-sm rounded-xl",
  };

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden bg-accent font-semibold text-background transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        sizes[size],
        className
      )}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.96 }}
    >
      {/* Ripple */}
      <AnimatePresence>
        {isSuccess && (
          <motion.span
            key="ripple"
            initial={{ opacity: 0.4, scale: 1 }}
            animate={{ opacity: 0, scale: 2.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 rounded-[inherit] bg-green-500/20"
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <span className="relative z-10 inline-flex items-center gap-2">
        <AnimatePresence mode="wait" initial={false}>
          {isSuccess ? (
            <motion.span
              key="success"
              initial={{ opacity: 0, scale: 0.6, rotate: -35 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 35 }}
              transition={{ type: "spring", stiffness: 320, damping: 20 }}
              className="inline-flex items-center gap-2"
            >
              <Check className={cn("text-green-300", iconSizes[size])} />
              <span>{successText}</span>
            </motion.span>
          ) : (
            <motion.span
              key="default"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: "spring", stiffness: 320, damping: 20 }}
              className="inline-flex items-center gap-2"
            >
              <ShoppingCart className={iconSizes[size]} />
              <span>{text}</span>
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  );
}
