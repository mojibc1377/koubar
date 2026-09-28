"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { AnimatedActionButton } from "@/components/lightswind/button";
import { formatPrice } from "@/lib/format";
import { ease, spring } from "@/lib/motion";
import Image from "next/image";
import { getImageUrl } from "@/lib/storage";

type ProductVariant = "african" | "kenya" | "street";

const variantStyles: Record<
  ProductVariant,
  { bg: string; accent?: string; label?: string }
> = {
  african: {
    bg: "",
    accent: "text-red-500",
    label: "AFRICAN BLEND",
  },
  kenya: {
    bg: "",
  },
  street: {
    bg: "",
  },
};

export function ProductCard({
  id,
  title,
  description,
  longDescription,
  price,
  badge,
  image,
  variant,
  index = 0,
  className = "",
}: {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  price: number;
  badge: string;
  image:string;
  variant: ProductVariant;
  index?: number;
  className?: string;
}) {
  const style = variantStyles[variant];
  const reduce = useReducedMotion();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      id: `roastery-${id}`,
      catalogId: id,
      source: "ROASTERY",
      title,
      price,
      type: "shop",
      image: image,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <motion.article
      className={`flex h-full w-[min(100%,320px)] shrink-0 flex-col ${className}`}
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease }}
      whileHover={reduce ? {} : { scale: 1.02 }}
    >
   <motion.div
  className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-sm bg-linear-to-br ${style.bg}`}
  whileHover={reduce ? {} : { scale: 1.03 }}
  transition={spring}
>
  <Image
    src={getImageUrl(image)}
    alt={title}
    unoptimized
    fill
    sizes="(max-width: 768px) 100vw, 320px"
    className="object-cover "
  />

  <motion.span
    className="absolute right-3 top-3 rounded-full bg-background px-3 py-1 text-xs font-semibold text-foreground"
    initial={{ scale: 0 }}
    whileInView={{ scale: 1 }}
    viewport={{ once: true }}
    transition={{ ...spring, delay: 0.2 + index * 0.05 }}
  >
    {badge}
  </motion.span>
</motion.div>
      <div className="mt-5 flex flex-1 flex-col">
        <h3 className="line-clamp-1 min-h-14 text-lg font-bold leading-8">
          {title}
        </h3>
        <p className="mt-1 line-clamp-3 min-h-18 text-xs leading-7 text-muted">
          {longDescription || description}
        </p>
        <div className="mt-1 pt-1">
          <motion.p
            className="text-base font-bold"
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {formatPrice(price)}
          </motion.p>
          <div className="mt-3">
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
      </div>
    </motion.article>
  );
}
