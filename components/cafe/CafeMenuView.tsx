"use client";

import Image from "next/image";
import { getImageUrl } from "@/lib/storage";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { useCafeMenu } from "@/hooks/use-catalog";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import type { CafeCoffeeLine } from "@/lib/cafe-coffee-lines";
import {
  getCafeCoffeeLines,
  itemHasCoffeeLinePricing,
} from "@/lib/cafe-coffee-lines";
import { formatPrice } from "@/lib/format";
import { spring } from "@/lib/motion";
import { Z } from "@/lib/z-index";
import { useCart } from "@/context/CartContext";
import type { CafeMenuItem } from "@/lib/types";
import { AnimatedActionButton } from "../lightswind/button";
import { CafeCoffeeLinePicker } from "./CafeCoffeeLinePicker";
import { CafeMenuItemCard } from "./CafeMenuItemCard";

export function CafeMenuView() {
  const reduce = useReducedMotion();
  const { addItem } = useCart();
  const { data: cafeMenu = [], isLoading } = useCafeMenu();
  const [selectedItem, setSelectedItem] = useState<CafeMenuItem | null>(null);
  const [modalLineId, setModalLineId] =
    useState<CafeCoffeeLine["id"]>("primary");
  const [addedItemId, setAddedItemId] = useState<string | null>(null);

  const addToCart = (item: CafeMenuItem, line: CafeCoffeeLine | null) => {
    const cartId = line ? `cafe-${item.id}-${line.id}` : `cafe-${item.id}`;
    const title = line ? `${item.name} · ${line.label}` : item.name;

    addItem({
      id: cartId,
      catalogId: item.id,
      source: "CAFE",
      title,
      price: line?.price ?? item.price,
      image: item.image,
      type: "cafe",
    });
    setAddedItemId(cartId);
    window.setTimeout(
      () => setAddedItemId((id) => (id === cartId ? null : id)),
      1400,
    );
  };

  const openModal = (item: CafeMenuItem) => {
    setSelectedItem(item);
    setModalLineId("primary");
  };

  const selectedLines = selectedItem ? getCafeCoffeeLines(selectedItem) : null;
  const modalActiveLine =
    selectedLines?.find((line) => line.id === modalLineId) ??
    selectedLines?.[0] ??
    null;
  const modalCartKey = selectedItem
    ? selectedLines
      ? `${selectedItem.id}-${modalActiveLine?.id ?? "primary"}`
      : selectedItem.id
    : null;

  if (isLoading) {
    return <p className="py-12 text-center text-muted">در حال بارگذاری منو…</p>;
  }

  return (
    <>
      <div className="space-y-16">
        {cafeMenu.map((category, catIndex) => (
          <section key={category.id} id={category.id}>
            <Reveal delay={catIndex * 0.05}>
              <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
                <h2 className="text-2xl font-extrabold">{category.name}</h2>
                <span className="rounded-full bg-accent/15 px-3 py-1 text-xs text-accent">
                  {category.items.length.toLocaleString("fa-IR")} آیتم
                </span>
              </div>
            </Reveal>
            <Stagger className="grid auto-rows-fr gap-5 md:grid-cols-2">
              {category.items.map((item, i) => (
                <StaggerItem key={item.id} className="h-full">
                  <CafeMenuItemCard
                    item={item}
                    index={i}
                    addedItemId={addedItemId}
                    onSelect={openModal}
                    onAdd={addToCart}
                  />
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        ))}
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-foreground/45 p-4 backdrop-blur-sm"
            style={{ zIndex: Z.cafeModal }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border-strong bg-background shadow-2xl"
              initial={reduce ? false : { opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={spring}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-92 lg:h-96">
                <Image
                  src={
                    selectedItem.image
                      ? getImageUrl(selectedItem.image)
                      : "/images/hero.png"
                  }
                  alt={selectedItem.name}
                  fill
                  unoptimized
                  className="object-cover lg:object-cover bg-red-500"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-foreground/75 to-transparent" />
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-bold text-foreground"
                >
                  بستن
                </button>
                <div className="absolute bottom-4 right-4">
                  <h3 className="text-2xl font-extrabold text-background">
                    {selectedItem.name}
                  </h3>
                </div>
              </div>
              <div className="space-y-5 p-6">
                <p className="leading-8 text-foreground/90">
                  {selectedItem.longDescription ?? selectedItem.description}
                </p>
                {!!selectedItem.notes?.length && (
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.notes.map((note) => (
                      <span
                        key={note}
                        className="rounded-full border border-border-strong bg-card-elevated px-3 py-1 text-xs text-accent"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                )}
                {selectedLines && (
                  <CafeCoffeeLinePicker
                    lines={selectedLines}
                    value={modalLineId}
                    onChange={setModalLineId}
                  />
                )}
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <p className="text-lg font-bold text-foreground">
                    {itemHasCoffeeLinePricing(selectedItem) && modalActiveLine
                      ? formatPrice(modalActiveLine.price)
                      : formatPrice(selectedItem.price)}
                  </p>
                  <AnimatedActionButton
                    type="button"
                    onClick={() => addToCart(selectedItem, modalActiveLine)}
                    text="افزودن به سبد"
                    successText="اضافه شد!"
                    isSuccess={addedItemId === modalCartKey}
                    className="rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-background"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
