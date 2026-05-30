"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePlatformMode } from "@/context/PlatformModeContext";
import { RiDrinksFill } from "react-icons/ri";
import { PiCoffeeBeanFill } from "react-icons/pi";
import { Z } from "@/lib/z-index";
import { cn } from "@/lib/utils";

const pillSpring = {
  type: "spring" as const,
  stiffness: 520,
  damping: 38,
  mass: 0.55,
};

export function PlatformToggle() {
  const { mode, setMode, isReady } = usePlatformMode();
  const reduce = useReducedMotion();
  const isShop = mode === "shop";

  if (!isReady) {
    return (
      <div
        className="fixed bottom-24 right-4 h-24 w-12 -translate-y-1/2 animate-pulse rounded-full bg-foreground/10 sm:bottom-auto sm:top-1/3"
        style={{ zIndex: Z.platformToggle }}
      />
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-24 right-4 flex h-28 w-12 flex-col rounded-full border p-1 shadow-lg backdrop-blur-xl sm:bottom-auto sm:right-4 sm:top-1/3 sm:-translate-y-1/2",
        isShop
          ? "border-[var(--surface-glass-border)] bg-[var(--surface-glass)] shadow-black/35"
          : "border-white/45 bg-white/25 shadow-[0_8px_24px_rgba(52,52,52,0.12)]",
      )}
      style={{ zIndex: Z.platformToggle }}
      role="group"
      aria-label="نوع پلتفرم"
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-full",
          isShop
            ? "bg-linear-to-b from-accent/50 to-transparent"
            : "bg-linear-to-b from-[#575b49]/40 to-white/5",
        )}
      />
      <motion.div
        className={cn(
          "absolute left-1 right-1 top-1 z-10 h-[calc(50%-4px)] rounded-full border backdrop-blur-xl",
          isShop
            ? "border-border-strong bg-accent shadow-[0_6px_18px_rgba(0,0,0,0.35)]"
            : "border-white/70 bg-[#575b49]/85 shadow-[0_6px_18px_rgba(52,52,52,0.18)]",
        )}
        initial={false}
        animate={{
          y: isShop ? 0 : "calc(100% + 4px)",
        }}
        transition={reduce ? { duration: 0 } : pillSpring}
      />

      <button
        type="button"
        onClick={() => setMode("shop")}
        className={cn(
          "relative z-20 flex flex-1 items-center justify-center rounded-full text-xs font-semibold transition-colors",
          isShop ? "text-background" : "text-icon/55",
        )}
        aria-label="رستری و فروشگاه"
      >
        <PiCoffeeBeanFill className="text-[18px]" />
      </button>

      <button
        type="button"
        onClick={() => setMode("cafe")}
        className={cn(
          "relative z-20 flex flex-1 items-center justify-center rounded-full text-xs font-semibold transition-colors",
          !isShop ? "text-background" : "text-icon/55",
        )}
        aria-label="منوی کافه"
      >
        <RiDrinksFill className="text-[18px]" />
      </button>
    </div>
  );
}
