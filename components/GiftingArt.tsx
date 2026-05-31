"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { ease } from "@/lib/motion";

export function GiftingArt() {
  const reduce = useReducedMotion();

  return (
    <section className="overflow-hidden border-b border-border">
      <div dir="ltr" className="grid lg:grid-cols-2">
        <motion.div
          dir="rtl"
          className="relative flex flex-col justify-center overflow-hidden bg-accent px-8 py-16 lg:px-16 lg:py-24"
          initial={reduce ? false : { x: -40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
        >
          <motion.div
            className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-background/15 blur-3xl"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <Reveal>
            <h2 className="text-3xl font-extrabold text-background md:text-4xl lg:text-[2.75rem]">
              هنر هدیه‌دادن
            </h2>
            <p className="mt-6 max-w-md text-sm leading-8 text-background/85">
              قهوه‌ای باکیفیت و متفاوت، هدیه‌ای ماندگار برای هر مناسبتی است.
            </p>
          </Reveal>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="#gifts"
              className="mt-10 inline-flex rounded-2xl w-fit bg-background px-8 py-3.5 text-sm font-semibold text-foreground shadow-lg transition hover:shadow-xl"
            >
              مشاهده هدایای قهوه‌ای
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative min-h-100 lg:min-h-130"
          initial={reduce ? false : { scale: 1.1, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease }}
        >
          <motion.div
            className="relative h-full min-h-[inherit] w-full"
            animate={reduce ? {} : { scale: [1, 1.05, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/images/gifting-art.png"
              alt="هدایای قهوه"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
