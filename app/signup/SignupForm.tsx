"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    transition: { delay: 0.2 + i * 0.06, duration: 0.45, ease },
  }),
};

const fields = [
  { key: "name", label: "نام و نام خانوادگی", type: "text", span: 2, autoComplete: "name" },
  { key: "email", label: "ایمیل", type: "email", span: 1, autoComplete: "email" },
  { key: "phone", label: "شماره موبایل", type: "tel", span: 1, autoComplete: "tel" },
  { key: "address", label: "آدرس", type: "text", span: 2, autoComplete: "street-address" },
  { key: "password", label: "رمز عبور", type: "password", span: 2, autoComplete: "new-password", minLength: 6 },
] as const;

export function SignupForm() {
  const { signup, user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (user) router.replace("/account");
  }, [user, router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");
    if (password.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
      setLoading(false);
      return;
    }
    try {
      await signup({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        address: String(form.get("address") ?? ""),
        password,
      });
      router.push("/account");
    } catch {
      setError("ثبت‌نام ناموفق بود. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-accent/10 lg:flex-row-reverse">
      <motion.aside
        className="relative hidden min-h-[520px] w-full flex-col justify-between overflow-hidden bg-linear-to-br from-accent via-accent/90 to-foreground/90 p-10 text-background lg:flex lg:max-w-[52%]"
        initial={reduce ? false : { opacity: 0, x: 30 }}
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
            به جمع دوست‌داران
            <br />
            قهوه بپیوندید
          </motion.h2>
          <p className="mt-4 max-w-xs text-sm leading-7 text-background/85">
            با یک حساب ساده، سفارش‌ها، آدرس‌ها و تراکنش‌های خود را همیشه در دسترس
            داشته باشید.
          </p>
        </div>
        <motion.div
          className="relative z-10 overflow-hidden rounded-2xl border border-background/20"
          initial={reduce ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, ...spring }}
        >
          <Image
            src="/images/seasonal.png"
            alt=""
            width={480}
            height={280}
            className="h-44 w-full object-cover"
          />
        </motion.div>
      </motion.aside>

      <motion.div
        className="relative min-w-0 flex-1 p-8 md:p-12"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease }}
      >
        <div className="mb-8 flex flex-col items-center gap-3 lg:items-start">
          <Image src={logos.farsi} alt="" width={72} height={40} className="opacity-90" />
          <h1 className="text-2xl font-extrabold">ثبت‌نام</h1>
          <p className="text-center text-sm text-muted lg:text-right">
            حساب جدید برای خرید آنلاین و پیگیری سفارش‌ها
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
          {fields.map((field, i) => (
            <motion.div
              key={field.key}
              custom={i}
              variants={fieldVariants}
              initial="hidden"
              animate="show"
              className={field.span === 2 ? "sm:col-span-2" : undefined}
            >
              <Input
                label={field.label}
                name={field.key}
                type={field.type}
                required
                autoComplete={field.autoComplete}
                minLength={"minLength" in field ? field.minLength : undefined}
              />
            </motion.div>
          ))}

          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                key="err"
                className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-600 sm:col-span-2"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.div
            className="sm:col-span-2"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, ease }}
          >
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "در حال ایجاد حساب..." : "ایجاد حساب"}
            </Button>
          </motion.div>
        </form>

        <p className="mt-8 text-center text-sm text-muted lg:text-right">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link href="/login" className="font-medium text-accent hover:underline">
            ورود
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
