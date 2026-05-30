"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { cafeMenu } from "@/lib/cafe-menu";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { spring } from "@/lib/motion";
import { Z } from "@/lib/z-index";
import { useCart } from "@/context/CartContext";
import type { CafeMenuItem } from "@/lib/types";
import { AnimatedActionButton } from "../lightswind/button";

export function CafeMenuView() {
  const reduce = useReducedMotion();
  const { addItem } = useCart();
  const [selectedItem, setSelectedItem] = useState<CafeMenuItem | null>(null);
  const [addedItemId, setAddedItemId] = useState<string | null>(null);

  const addToCart = (item: CafeMenuItem) => {
    addItem({
      id: `cafe-${item.id}`,
      title: item.name,
      price: item.price,
      image: item.image,
      type: "cafe",
    });
    setAddedItemId(item.id);
    window.setTimeout(() => setAddedItemId((id) => (id === item.id ? null : id)), 1400);
  };

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
            <Stagger className="grid gap-5 md:grid-cols-2">
              {category.items.map((item, i) => (
                <StaggerItem key={item.id}>
                  <motion.article
                    className="group overflow-hidden rounded-2xl border border-border bg-card"
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
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={item.image ?? "/images/hero.png"}
                        alt={item.name}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-foreground/65 via-foreground/25 to-transparent" />
                      <div className="absolute bottom-3 right-3 flex items-center gap-2">
                        <span className="rounded-full bg-background/90 px-2 py-1 text-xs font-bold text-foreground">
                          {formatPrice(item.price)}
                        </span>
                        {item.badge && (
                          <motion.span
                            className="rounded-full bg-accent px-2 py-1 text-[10px] font-bold text-background"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ ...spring, delay: 0.1 + i * 0.05 }}
                          >
                            {item.badge}
                          </motion.span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 p-5">
                      <div>
                        <h3 className="text-lg font-bold">{item.name}</h3>
                        <p className="mt-2 text-sm leading-7 text-muted">{item.description}</p>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <motion.button
                          type="button"
                          onClick={() => setSelectedItem(item)}
                          className="rounded-xl border border-border-strong bg-card-elevated px-4 py-2 text-xs font-semibold text-foreground"
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                        >
                          جزئیات کامل
                        </motion.button>
                      <AnimatedActionButton
  type="button"
  onClick={() => addToCart(item)}
  text="افزودن به سبد"
  successText="اضافه شد!"
  isSuccess={addedItemId === item.id}
  className="rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-background"
/>

                      </div>
                    </div>
                  </motion.article>
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
              <div className="relative h-56">
                <Image
                  src={selectedItem.image ?? "/images/hero.png"}
                  alt={selectedItem.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
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
                  <h3 className="text-2xl font-extrabold text-background">{selectedItem.name}</h3>
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
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <p className="text-lg font-bold text-foreground">{formatPrice(selectedItem.price)}</p>
              <AnimatedActionButton
  type="button"
  onClick={() => addToCart(selectedItem)}
  text="افزودن به سبد"
  successText="اضافه شد!"
  isSuccess={addedItemId === selectedItem.id}
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
