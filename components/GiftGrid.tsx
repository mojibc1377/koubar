"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useGifts } from "@/hooks/use-catalog";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { ease, spring } from "@/lib/motion";

export function GiftGrid() {
  const reduce = useReducedMotion();
  const { data: giftItems = [] } = useGifts();

  return (
    <section id="gifts" className="relative overflow-hidden border-b border-border py-16 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal>
          <h2 className="text-3xl font-extrabold md:text-4xl">
            هدایای ارزشمند با قیمت ویژه
          </h2>
        </Reveal>

        <Stagger className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {giftItems.map((item) => (
            <StaggerItem key={item.id}>
              <motion.article
                className="group"
                whileHover={reduce ? {} : { y: -8 }}
                transition={spring}
              >
                <div className="relative aspect-square overflow-hidden bg-card shadow-md shadow-accent/5">
                  <motion.div className="relative h-full w-full" whileHover={{ scale: 1.08 }} transition={{ duration: 0.5, ease }}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 bg-accent/0"
                    whileHover={{ backgroundColor: "rgba(87,91,73,0.15)" }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <h3 className="mt-5 text-lg font-bold leading-8">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{item.description}</p>
                <Link
                  href={item.linkHref}
                  className="mt-4 inline-flex items-center gap-1 text-sm text-accent transition hover:text-foreground"
                >
                  مشاهده و خرید
                  <motion.span
                    animate={{ x: [0, -4, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    ←
                  </motion.span>
                </Link>
              </motion.article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
