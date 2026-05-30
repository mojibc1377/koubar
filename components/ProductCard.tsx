"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { AnimatedActionButton } from "@/components/lightswind/button";
import { formatPrice } from "@/lib/format";
import { ease, spring } from "@/lib/motion";

type ProductVariant = "african" | "kenya" | "street";

const variantStyles: Record<
  ProductVariant,
  { bg: string; accent?: string; label?: string }
> = {
  african: {
    bg: "from-neutral-900 via-neutral-950 to-black",
    accent: "text-red-500",
    label: "AFRICAN BLEND",
  },
  kenya: {
    bg: "from-accent/80 via-accent/60 to-accent",
  },
  street: {
    bg: "from-neutral-800 via-neutral-900 to-black",
  },
};

export function ProductCard({
  id,
  title,
  description,
  price,
  badge,
  variant,
  index = 0,
}: {
  id: string;
  title: string;
  description: string;
  price: number;
  badge: string;
  variant: ProductVariant;
  index?: number;
}) {
  const style = variantStyles[variant];
  const reduce = useReducedMotion();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ id, title, price, type: "shop", image: "/images/hero.png" });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <motion.article
      className="flex w-[min(100%,320px)] shrink-0 flex-col"
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease }}
      whileHover={reduce ? {} : { y: -10 }}
    >
      <motion.div
        className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-sm bg-linear-to-br ${style.bg}`}
        whileHover={reduce ? {} : { scale: 1.03 }}
        transition={spring}
      >
        <motion.span
          className="absolute right-3 top-3 rounded-full bg-background px-3 py-1 text-xs font-semibold text-foreground"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ ...spring, delay: 0.2 + index * 0.05 }}
        >
          {badge}
        </motion.span>
        {variant === "african" && (
          <div className="text-center">
            <div className={`text-6xl font-black ${style.accent}`}>X</div>
            <p className="mt-2 text-xs tracking-widest text-foreground/80">
              {style.label}
            </p>
            <p className="text-[10px] text-muted">80% ARABICA</p>
          </div>
        )}
        {variant === "kenya" && (
          <div className="flex gap-3">
            <motion.div
              className="h-28 w-20 rounded-sm bg-[#b5c4a8] shadow-lg"
              animate={reduce ? {} : { y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="mt-4 h-24 w-20 rounded-sm bg-[#9aab8e] shadow-lg"
              animate={reduce ? {} : { y: [0, 6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        )}
        {variant === "street" && (
          <div className="flex gap-3">
            <div className="h-28 w-20 rounded-sm bg-neutral-800 shadow-lg" />
            <div className="mt-4 h-24 w-20 rounded-sm bg-neutral-900 shadow-lg" />
          </div>
        )}
      </motion.div>

      <div className="mt-5 flex flex-1 flex-col">
        <h3 className="text-lg font-bold leading-8">{title}</h3>
        <p className="mt-2 text-sm leading-7 text-muted">{description}</p>
        <motion.p
          className="mt-4 text-base font-bold"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {formatPrice(price)}
        </motion.p>
        <div className="mt-5">
          <AnimatedActionButton
            type="button"
            onClick={handleAdd}
            text="افزودن به سبد خرید"
            successText="اضافه شد!"
            isSuccess={added}
            size="lg"
            className="w-full rounded-md"
          />
        </div>
      </div>
    </motion.article>
  );
}
