"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { AnimatedActionButton } from "@/components/lightswind/button";
import {
  getCafeCoffeeLines,
  itemHasCoffeeLinePricing,
  type CafeCoffeeLine,
} from "@/lib/cafe-coffee-lines";
import { formatPrice } from "@/lib/format";
import { spring } from "@/lib/motion";
import type { CafeMenuItem } from "@/lib/types";
import { CafeCoffeeLinePicker } from "./CafeCoffeeLinePicker";
import { getImageUrl } from "@/lib/storage";

type CafeMenuItemCardProps = {
  item: CafeMenuItem;
  index: number;
  addedItemId: string | null;
  onSelect: (item: CafeMenuItem) => void;
  onAdd: (
    item: CafeMenuItem,
    line: CafeCoffeeLine | null,
  ) => void;
};

export function CafeMenuItemCard({
  item,
  index,
  addedItemId,
  onSelect,
  onAdd,
}: CafeMenuItemCardProps) {
  const reduce = useReducedMotion();
  const lines = getCafeCoffeeLines(item);
  const [selectedLineId, setSelectedLineId] = useState<CafeCoffeeLine["id"]>(
    "primary",
  );

  const activeLine =
    lines?.find((line) => line.id === selectedLineId) ?? lines?.[0] ?? null;
  const displayPrice = activeLine?.price ?? item.price;
  const cartKey = lines
    ? `${item.id}-${activeLine?.id ?? "primary"}`
    : item.id;

  return (
    <motion.article
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card"
      whileHover={
        reduce
          ? {}
          : {
              y: -8,
              borderColor: "rgba(87,91,73,0.55)",
              boxShadow: "0 18px 46px rgba(87,91,73,0.18)",
            }
      }
      transition={spring}
    >
      <div className="relative h-45 lg:h-55 shrink-0 overflow-hidden">
        <Image
  src={item.image ? getImageUrl(item.image) : "/images/hero.png"}
          alt={item.name}
          fill
          
          className="object-cover transition duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-foreground/65 via-foreground/25 to-transparent" />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="rounded-full bg-background/90 px-2 py-1 text-xs font-bold text-foreground">
            {itemHasCoffeeLinePricing(item) && !activeLine
              ? `از ${formatPrice(item.price)}`
              : formatPrice(displayPrice)}
          </span>
          {item.badge && (
            <motion.span
              className="rounded-full bg-accent px-2 py-1 text-[10px] font-bold text-background"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: 0.1 + index * 0.05 }}
            >
              {item.badge}
            </motion.span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="min-h-22">
          <h3 className="line-clamp-1 text-lg font-bold">{item.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-7 text-muted">
            {item.description}
          </p>
        </div>

        {lines && (
          <div className="mt-4">
            <CafeCoffeeLinePicker
              lines={lines}
              value={selectedLineId}
              onChange={setSelectedLineId}
              compact
            />
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <motion.button
            type="button"
            onClick={() => onSelect(item)}
            className="rounded-xl border border-border-strong bg-card-elevated px-4 py-2 text-xs font-semibold text-foreground"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            جزئیات کامل
          </motion.button>
          <AnimatedActionButton
            type="button"
            onClick={() => onAdd(item, activeLine)}
            text="افزودن به سبد"
            successText="اضافه شد!"
            isSuccess={addedItemId === cartKey}
            className="rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-background"
          />
        </div>
      </div>
    </motion.article>
  );
}
