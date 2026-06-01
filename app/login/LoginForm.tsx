"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { FloatingOrbs } from "@/components/motion/FloatingOrbs";
import { PhoneOtpForm } from "@/components/auth/PhoneOtpForm";
import { logos } from "@/lib/icons";
import { ease, spring } from "@/lib/motion";

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const reduce = useReducedMotion();

  return (
    <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-accent/10 lg:grid-cols-[1.05fr_1fr]">
      <motion.aside
        className="relative hidden min-h-[520px] flex-col justify-between overflow-hidden bg-linear-to-br from-accent via-accent/90 to-foreground/90 p-10 text-background lg:flex"
        initial={reduce ? false : { opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease }}
      >
        <FloatingOrbs />
        <div className="relative z-10">
          <BrandLogo variant="english" className="brightness-0 invert" />
          <motion.h2
            className="mt-10 text-3xl font-extrabold leading-12"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, ease }}
          >
            ورود با موبایل
          </motion.h2>
          <p className="mt-4 max-w-xs text-sm leading-7 text-background/85">
            کد یک‌بارمصرف برای شما ارسال می‌شود — بدون رمز عبور.
          </p>
        </div>
        <motion.div
          className="relative z-10 overflow-hidden rounded-2xl border border-background/20"
          initial={reduce ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, ...spring }}
        >
          <Image
            src="/images/hero.png"
            alt=""
            width={480}
            height={280}
            className="h-44 w-full object-cover"
          />
        </motion.div>
      </motion.aside>

      <motion.div
        className="relative p-8 md:p-12"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease }}
      >
        <div className="mb-8 flex flex-col items-center gap-3 lg:items-start">
          <Image src={logos.farsi} alt="" width={72} height={40} className="opacity-90" />
          <h1 className="text-2xl font-extrabold">ورود به حساب</h1>
          <p className="text-center text-sm text-muted lg:text-right">
            شماره موبایل خود را وارد کنید
          </p>
        </div>
        <PhoneOtpForm intent="login" redirect={redirect} />
      </motion.div>
    </div>
  );
}
