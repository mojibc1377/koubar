"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FloatingOrbs } from "@/components/motion/FloatingOrbs";
import { TextReveal } from "@/components/motion/TextReveal";
import { ease, spring } from "@/lib/motion";
import ImageSlider3D from "./lightswind/ 3d-image-slider";

const slides = [
  {
    title: ["قهوه تخصصی", "تازه‌رُست", "تی‌دی‌اس"],
    description:
      "دانه‌های منتخب و رُست کنترل‌شده با پروفایل‌های طعمی شفاف؛ مناسب برای اسپرسو و روش‌های دمی. انتخاب کنید و طعم دلخواهتان را دقیق‌تر تجربه کنید.",
    overlay: "The Art of Hands",
  },
  {
    title: ["رُست تخصصی", "در دسته‌های", "کوچک"],
    description:
      "هر دسته با دقت کنترل می‌شود تا پروفایل طعمی شفاف و یکدست بماند؛ از اسپرسو تا روش‌های دمی.",
    overlay: "Small Batch Roasting",
  },
  {
    title: ["طعم دلخواه", "دقیق‌تر", "تجربه کنید"],
    description:
      "بلندهای اختصاصی و تک‌خاستگاه‌های منتخب برای هر سلیقه؛ آنچه دوست دارید را پیدا کنید.",
    overlay: "Specialty Coffee",
  },
] as const;

const HERO_VIDEO = "/videos/hero-roasting.mp4";

function HeroContent({ slideKey, slide }: { slideKey: number; slide: (typeof slides)[number] }) {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={slideKey}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.35 } }}
        transition={{ duration: 0.5, ease }}
      >
        <TextReveal
          lines={[...slide.title]}
          className="space-y-1 text-4xl font-extrabold leading-tight tracking-tight text-background sm:text-5xl lg:text-[3.25rem]"
        />
        <motion.p
          className="mt-6 max-w-lg text-base leading-8 text-background/85 lg:mt-8"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease }}
        >
          {slide.description}
        </motion.p>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.55, ease }}
        >
          <Link
            href="#products"
            className="group mt-8 inline-flex w-fit items-center gap-2 border border-background/25 bg-accent px-8 py-3.5 text-sm font-medium text-background transition-colors hover:bg-foreground lg:mt-10"
          >
            مشاهده محصولات
            <motion.span
              className="inline-block"
              animate={{ x: [0, -4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              ←
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function Hero() {
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const slide = slides[active];
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [reduce]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden border-b border-border">
      <FloatingOrbs />
      <div dir="ltr" className="absolute inset-0 lg:right-1/2 lg:left-0">
        <motion.div
          className="h-full w-full"
          animate={reduce ? {} : { scale: [1, 1.06, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/images/hero.png"
            aria-hidden
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
        </motion.div>
        <div className="absolute inset-0 bg-foreground/35 lg:bg-foreground/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-foreground/20 lg:hidden" />
        <AnimatePresence mode="wait">
          <motion.p
            key={slide.overlay}
            className="pointer-events-none absolute left-1/2 top-[38%] hidden -translate-x-1/2 -translate-y-1/2 font-serif text-3xl tracking-wide text-background/95 md:block lg:top-1/2 lg:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease }}
          >
            {slide.overlay}
          </motion.p>
        </AnimatePresence>
        <motion.button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "فعال‌سازی صدا" : "بی‌صدا کردن ویدیو"}
          className="absolute left-4 top-4 z-20 rounded-full bg-foreground/50 p-2 text-background"
          whileHover={{ scale: 1.08, backgroundColor: "rgba(52,52,52,0.75)" }}
          whileTap={{ scale: 0.95 }}
        >
          {muted ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M11 5L6 9H3v6h3l5 4V5z" />
              <path d="M16 10l5 5M21 10l-5 5" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M11 5L6 9H3v6h3l5 4V5z" />
              <path d="M19 8c1.5 1 2.5 2.5 2.5 4s-1 3-2.5 4" />
            </svg>
          )}
        </motion.button>
      </div>
      
      <div dir="auto" className="relative z-10 grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
        <div
          dir="auto"
          className="flex min-h-[calc(100vh-4rem)] flex-col justify-end px-6 pb-24 pt-28 lg:hidden"
        >
          <HeroContent slideKey={active} slide={slide} />
        </div>
        <div className="hidden lg:block" aria-hidden />
        <motion.div
          dir="rtl"
          className="relative hidden flex-col justify-center overflow-hidden bg-accent px-14 py-20 lg:flex"
          initial={reduce ? false : { x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease }}
        >
          <motion.div
            className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-background/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <HeroContent slideKey={active} slide={slide} />
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <motion.button
            key={i}
            type="button"
            aria-label={`اسلاید ${i + 1}`}
            onClick={() => setActive(i)}
            className="h-2 rounded-full bg-background/40"
            animate={{
              width: i === active ? 28 : 8,
              backgroundColor: i === active ? "#fffbf5" : "rgba(255,251,245,0.4)",
            }}
            transition={spring}
          />
        ))}
      </div>
    </section>
  );
}
