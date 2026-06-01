"use client";

import { cn } from "@/lib/utils";

export function AdminButton({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}) {
  const variants = {
    primary: "bg-[#575b49] text-[#fffbf5] hover:bg-[#6a6f58]",
    secondary: "border border-[#fffbf52e] bg-[#fffbf50d] text-[#fffbf5] hover:bg-[#fffbf514]",
    danger: "bg-red-900/50 text-red-100 border border-red-500/30 hover:bg-red-900/70",
    ghost: "text-[#fffbf5]/70 hover:text-[#fffbf5] hover:bg-[#fffbf50d]",
  };

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
