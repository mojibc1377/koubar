"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { AnimatedActionButton } from "@/components/lightswind/button";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { useCart } from "@/context/CartContext";
import { useAccessories } from "@/hooks/use-catalog";
import { formatPrice } from "@/lib/format";
import { ease, spring } from "@/lib/motion";
import type { AccessoryItem } from "@/lib/types";
import { getImageUrl } from "@/lib/storage";

export function AccessoriesSection() {
  const reduce = useReducedMotion();
  const { addItem } = useCart();
  const { data: accessories = [], isLoading } = useAccessories();
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
    <section
      id="accessories"
      className="relative overflow-hidden border-b border-border py-16 lg:py-24"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <h2 className="text-3xl font-extrabold md:text-4xl">اکسسوری‌های دم‌آوری</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
              تجهیزات حرفه‌ای و لوازم جانبی برای تجربه‌ای کامل از قهوه در خانه.
            </p>
          </Reveal>
          <motion.div
            initial={reduce ? false : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
          >
            <Link
              href="/accessories"
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition hover:text-foreground"
            >
              مشاهده همه
              <motion.span
                animate={{ x: [0, -4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                ←
              </motion.span>
            </Link>
          </motion.div>
        </div>

        {isLoading ? (
          <p className="mt-12 text-sm text-muted">در حال بارگذاری اکسسوری‌ها…</p>
        ) : (
          <Stagger className="mt-12 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {accessories.slice(0, 4).map((item) => (
              <StaggerItem key={item.id} className="h-full">
                <motion.article
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card"
                  whileHover={
                    reduce
                      ? {}
                      : {
                          y: -6,
                          borderColor: "rgba(87,91,73,0.55)",
                          boxShadow: "0 16px 40px rgba(87,91,73,0.16)",
                        }
                  }
                  transition={spring}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={getImageUrl(item.image)}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover transition duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-foreground/70 via-foreground/15 to-transparent" />
                    <span className="absolute right-3 top-3 rounded-full bg-background/90 px-2 py-1 text-[10px] font-bold">
                      {item.category}
                    </span>
                    <span className="absolute bottom-3 right-3 rounded-full bg-background/90 px-2 py-1 text-xs font-bold">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="min-h-22">
                      <h3 className="line-clamp-1 text-lg font-bold leading-8">{item.title}</h3>
                      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-7 text-muted">
                        {item.description}
                      </p>
                    </div>
                    <div className="mt-4">
                      <AnimatedActionButton
                        type="button"
                        onClick={() => addToCart(item)}
                        text="افزودن به سبد"
                        successText="اضافه شد!"
                        isSuccess={addedId === item.id}
                        className="w-full rounded-xl bg-accent px-4 py-2.5 text-xs font-semibold text-background"
                      />
                    </div>
                  </div>
                </motion.article>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
