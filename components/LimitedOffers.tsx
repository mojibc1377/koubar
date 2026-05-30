"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { limitedProducts } from "@/lib/data";
import { FloatingOrbs } from "@/components/motion/FloatingOrbs";
import { Reveal } from "@/components/motion/Reveal";
import { CarouselArrows } from "./icons";
import { ProductCard } from "./ProductCard";
import { ease } from "@/lib/motion";

export function LimitedOffers() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const scroll = (direction: "prev" | "next") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === "next" ? -340 : 340;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section id="products" className="relative overflow-hidden border-b border-border py-16 lg:py-24">
      <FloatingOrbs />
      <div className="relative mx-auto max-w-350 px-6 lg:px-10">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <motion.h2
              className="text-3xl font-extrabold md:text-4xl"
              initial={reduce ? false : { backgroundPosition: "200% center" }}
              animate={{ backgroundPosition: "-200% center" }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #343434 0%, #575b49 50%, #343434 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              عرضه‌های محدود
            </motion.h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
              تا وقتی موجود است، سری‌های محدود و ویژه ما را از دست ندهید.
            </p>
          </Reveal>
          <motion.div
            initial={reduce ? false : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
          >
            <CarouselArrows onPrev={() => scroll("prev")} onNext={() => scroll("next")} />
          </motion.div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          {limitedProducts.map((product, index) => (
            <ProductCard key={product.id} {...product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
