"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { AnimatedActionButton } from "@/components/lightswind/button";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { useCart } from "@/context/CartContext";
import { useAccessories, useGifts } from "@/hooks/use-catalog";
import { formatPrice } from "@/lib/format";
import { spring } from "@/lib/motion";
import { Z } from "@/lib/z-index";
import type { AccessoryItem } from "@/lib/types";

export function AccessoriesView() {
  const reduce = useReducedMotion();
  const { addItem } = useCart();
  const { data: accessories = [], isLoading } = useAccessories();
  const { data: giftItems = [] } = useGifts();
  const [selected, setSelected] = useState<AccessoryItem | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const addToCart = (item: AccessoryItem) => {
    addItem({
      id: `acc-${item.id}`,
      catalogId: item.id,
      source: "ACCESSORY",
      title: item.title,
      price: item.price,
      image: item.image,
      type: "shop",
    });
    setAddedId(item.id);
    window.setTimeout(() => setAddedId((id) => (id === item.id ? null : id)), 1400);
  };

  return (
    <>
      <Reveal>
        <h1 className="text-4xl font-extrabold">اکسسوری‌ها</h1>
        <p className="mt-4 max-w-2xl text-muted">
          تجهیزات دم‌آوری و لوازم جانبی — جزئیات کامل، افزودن به سبد، همان تجربه منوی کافه.
        </p>
      </Reveal>

      {isLoading ? (
        <p className="mt-8 text-sm text-muted">در حال بارگذاری اکسسوری‌ها…</p>
      ) : (
      <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {accessories.map((item) => (
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
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-foreground/70 via-foreground/20 to-transparent" />
                <span className="absolute right-3 top-3 rounded-full bg-background/90 px-2 py-1 text-[10px] font-bold text-foreground">
                  {item.category}
                </span>
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <span className="rounded-full bg-background/90 px-2 py-1 text-xs font-bold text-foreground">
                    {formatPrice(item.price)}
                  </span>
                  {item.badge && (
                    <span className="rounded-full bg-accent px-2 py-1 text-[10px] font-bold text-background">
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-4 p-5">
                <div>
                  <h2 className="text-lg font-bold">{item.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-7 text-muted">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <motion.button
                    type="button"
                    onClick={() => setSelected(item)}
                    className="rounded-xl border border-border-strong bg-card-elevated px-4 py-2 text-xs font-semibold"
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
                    isSuccess={addedId === item.id}
                    className="rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-background"
                  />
                </div>
              </div>
            </motion.article>
          </StaggerItem>
        ))}
      </Stagger>
      )}

      <section className="mt-20 border-t border-border pt-16">
        <Reveal>
          <h2 className="text-2xl font-bold">ست‌های هدیه</h2>
          <p className="mt-2 text-sm text-muted">انتخاب‌های ویژه برای هدیه دادن</p>
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {giftItems.slice(0, 2).map((g, i) => (
            <motion.div
              key={g.title}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="relative h-48">
                <Image
                  src={g.image}
                  alt={g.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="50vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-foreground/80 to-transparent" />
                <h3 className="absolute bottom-4 right-4 text-lg font-bold text-background">
                  {g.title}
                </h3>
              </div>
              <div className="p-5">
                <p className="text-sm leading-7 text-muted">{g.description}</p>
                <Link
                  href="/#gifts"
                  className="mt-4 inline-flex text-sm font-semibold text-accent hover:underline"
                >
                  مشاهده در صفحه اصلی ←
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-foreground/45 p-4 backdrop-blur-sm"
            style={{ zIndex: Z.cafeModal }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
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
                  src={selected.image}
                  alt={selected.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-foreground/80 to-transparent" />
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-bold"
                >
                  بستن
                </button>
                <div className="absolute bottom-4 right-4 left-4">
                  <span className="text-xs text-background/80">{selected.category}</span>
                  <h3 className="text-2xl font-extrabold text-background">{selected.title}</h3>
                </div>
              </div>
              <div className="space-y-5 p-6">
                <p className="leading-8 text-foreground/90">
                  {selected.longDescription ?? selected.description}
                </p>
                {!!selected.notes?.length && (
                  <div className="flex flex-wrap gap-2">
                    {selected.notes.map((note) => (
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
                  <p className="text-lg font-bold">{formatPrice(selected.price)}</p>
                  <AnimatedActionButton
                    type="button"
                    onClick={() => addToCart(selected)}
                    text="افزودن به سبد"
                    successText="اضافه شد!"
                    isSuccess={addedId === selected.id}
                    className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-background"
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
