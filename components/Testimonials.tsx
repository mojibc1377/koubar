"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { testimonials } from "@/lib/data";
import { Reveal } from "@/components/motion/Reveal";
import { CarouselArrows } from "./icons";
import { ease, spring } from "@/lib/motion";

export function Testimonials() {
  const [active, setActive] = useState(0);
  const item = testimonials[active];
  const reduce = useReducedMotion();

  const go = (dir: "prev" | "next") => {
    setActive((i) => {
      if (dir === "next") return (i + 1) % testimonials.length;
      return (i - 1 + testimonials.length) % testimonials.length;
    });
  };

  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="mx-auto max-w-[900px] px-6 text-center lg:px-10">
        <Reveal>
          <h2 className="text-3xl font-extrabold md:text-4xl">نظر مشتریان ما</h2>
        </Reveal>

        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <CarouselArrows onPrev={() => go("prev")} onNext={() => go("next")} />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.blockquote
            key={active}
            className="mt-10 rounded-2xl border border-border bg-card px-8 py-14 shadow-lg shadow-accent/5 md:px-16 md:py-16"
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.45, ease }}
          >
            <motion.p
              className="text-lg leading-10 text-foreground/90 md:text-xl"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              «{item.quote}»
            </motion.p>
            <footer className="mt-10">
              <p className="text-lg font-bold">{item.name}</p>
              <p className="mt-1 text-sm text-muted">{item.role}</p>
            </footer>
          </motion.blockquote>
        </AnimatePresence>

        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <motion.button
              key={i}
              type="button"
              aria-label={`نظر ${i + 1}`}
              onClick={() => setActive(i)}
              className="h-2 rounded-full bg-accent/30"
              animate={{
                width: i === active ? 24 : 8,
                backgroundColor: i === active ? "#575b49" : "rgba(87,91,73,0.3)",
              }}
              transition={spring}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
