"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { ease } from "@/lib/motion";

export function SeasonalBestsellers() {
  const reduce = useReducedMotion();

  return (
    <section className="overflow-hidden border-b border-border">
      <div dir="ltr" className="grid lg:grid-cols-2">
        <motion.div
          className="relative min-h-120"
          initial={reduce ? false : { opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease }}
        >
          <motion.div
            className="relative h-full min-h-120 w-full"
            animate={reduce ? {} : { scale: [1, 1.04, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/images/seasonal.png"
              alt="Castillo Washed Colombia"
              fill
              className="object-cover object-left"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
          <div className="absolute inset-0 bg-linear-to-l from-foreground/60 via-transparent to-transparent lg:from-foreground/30" />

          <motion.div
            className="absolute left-6 top-8 hidden flex-col gap-1 md:flex"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6, ease }}
          >
            <div className="flex items-start gap-2">
              <motion.span
                className="mt-1 h-12 w-px bg-accent"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease }}
              />
              <div className="text-xs font-medium tracking-[0.35em] text-background">
                <span className="block">SOFT</span>
                <span className="block">FLAVOR</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-24 left-6 right-6 md:left-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7, ease }}
          >
            <p className="text-xs tracking-[0.25em] text-background/90">CASTILLO</p>
            <p className="text-2xl font-bold tracking-[0.2em] text-background md:text-3xl">
              WASHED COLOMBIA
            </p>
            <p className="mt-2 max-w-md text-[10px] leading-5 tracking-wider text-background/75">
              TASTE PROFILE : SWEET, CARAMEL, BALANCED, PEACH, APRICOT
            </p>
            <motion.div
              className="mt-6 inline-block bg-foreground/80 px-4 py-2 text-[10px] tracking-widest text-background"
              whileInView={{ scale: [0.9, 1] }}
              viewport={{ once: true }}
            >
              100% QUALITY PRODUCT
            </motion.div>
            <motion.div
              className="mt-2 h-px w-16 bg-accent"
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
            />
          </motion.div>
        </motion.div>

        <motion.div
          dir="rtl"
          className="flex flex-col justify-center bg-card-elevated px-8 py-16 lg:px-16 lg:py-24"
          initial={reduce ? false : { opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
        >
          <Reveal>
            <h2 className="text-3xl font-extrabold leading-tight md:text-4xl lg:text-[2.75rem]">
              پرفروش‌های فصل
            </h2>
            <p className="mt-6 max-w-md text-sm leading-8 text-muted">
              بهترین انتخاب‌های فصل برای هدیه‌دادن یا لذت‌بردن در خانه؛ تا موجود است
              از آن‌ها استفاده کنید.
            </p>
          </Reveal>
          <motion.div whileHover={{ x: -6 }} transition={{ duration: 0.25 }}>
            <Link
              href="#products"
              className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-accent transition hover:text-foreground"
            >
              همین حالا خرید کنید
              <motion.span
                animate={{ x: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ←
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
