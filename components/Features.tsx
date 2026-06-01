"use client";

import { motion, useReducedMotion } from "framer-motion";
import { features } from "@/lib/data";
import { FloatingOrbs } from "@/components/motion/FloatingOrbs";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { AppIcon } from "./AppIcon";
import type { icons } from "@/lib/icons";
import { ease } from "@/lib/motion";

const featureIcons: Record<
  (typeof features)[number]["icon"],
  keyof typeof icons
> = {
  cup: "coffeeCup",
  branch: "branch",
  beans: "beans",
  bags: "bags",
};

export function Features() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-b border-border py-16 lg:py-20">
      <FloatingOrbs />
      <div className="relative mx-auto max-w-350 px-6 lg:px-10">
        <Reveal className="mb-12 text-center md:mb-14">
          <p className="text-xs font-semibold tracking-[0.3em] text-accent">
            چرا کوبار
          </p>
        </Reveal>
        <Stagger className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {features.map((feature, i) => (
            <StaggerItem key={feature.label}>
              <motion.div
                className="group flex flex-col items-center gap-4 rounded-2xl  p-4 text-center transition-colors hover:border-border hover:bg-card"
                whileHover={reduce ? {} : { y: -6 }}
                transition={{ duration: 0.35, ease }}
              >
                <motion.div
                  animate={reduce ? {} : { y: [0, -8, 0] }}
                  transition={{
                    duration: 3 + i * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <AppIcon name={featureIcons[feature.icon]} size={40} tone="olive" />
                </motion.div>
                <p className="max-w-45 text-sm font-bold leading-7 text-foreground">
                  {feature.label}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
