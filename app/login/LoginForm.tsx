"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BrandLogo } from "@/components/BrandLogo";
import { FloatingOrbs } from "@/components/motion/FloatingOrbs";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { logos } from "@/lib/icons";
import { ease, spring } from "@/lib/motion";

const fieldVariants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.08, duration: 0.45, ease },
  }),
};

export function LoginForm() {
  const { login, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/account";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (user) router.replace(redirect);
  }, [user, router, redirect]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const ok = await login(email, password);
    setLoading(false);
    if (ok) router.push(redirect);
    else setError("ورود ناموفق بود. ایمیل را بررسی کنید.");
  }

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
            تجربه‌ای تازه
            <br />
            از قهوه تخصصی
          </motion.h2>
          <p className="mt-4 max-w-xs text-sm leading-7 text-background/85">
            با ورود به حساب، سفارش‌ها و تراکنش‌های خود را یکجا مدیریت کنید.
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
            به فروشگاه و حساب کاربری کوبار وارد شوید
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              custom={i}
              variants={fieldVariants}
              initial="hidden"
              animate="show"
            >
              {i === 0 ? (
                <Input
                  label="ایمیل"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                />
              ) : (
                <Input
                  label="رمز عبور"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                />
              )}
            </motion.div>
          ))}

          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                key="err"
                className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-600"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, ease }}
          >
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "در حال ورود..." : "ورود"}
            </Button>
          </motion.div>
        </form>

        <p className="mt-8 text-center text-sm text-muted lg:text-right">
          حساب ندارید؟{" "}
          <Link href="/signup" className="font-medium text-accent hover:underline">
            ثبت‌نام
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-muted/80 lg:text-right">
          دمو: هر ایمیل معتبر برای ورود کافی است
        </p>
      </motion.div>
    </div>
  );
}
