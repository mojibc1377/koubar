"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/use-auth";
import { ease } from "@/lib/motion";

type PhoneOtpFormProps = {
  intent: "login" | "signup";
  redirect?: string;
  profileDefaults?: { name?: string; address?: string };
};

export function PhoneOtpForm({
  intent,
  redirect = "/",
  profileDefaults,
}: PhoneOtpFormProps) {
  const { user, isReady, sendOtp, verifyOtp } = useAuth();
  const router = useRouter();
  const reduce = useReducedMotion();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState(profileDefaults?.name ?? "");
  const [address, setAddress] = useState(profileDefaults?.address ?? "");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isReady && user) router.replace(redirect);
  }, [isReady, user, router, redirect]);

  useEffect(() => {
    if (step === "code") codeRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearInterval(t);
  }, [cooldown]);

  async function handleSendOtp(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await sendOtp(phone, intent);
      setStep("code");
      setCooldown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ارسال کد");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await verifyOtp({
        phone,
        code,
        intent,
        name: intent === "signup" ? name : undefined,
        address: intent === "signup" ? address : undefined,
      });
      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ورود ناموفق بود");
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    if (cooldown > 0) return;
    setError("");
    try {
      await sendOtp(phone, intent);
      setCooldown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ارسال مجدد");
    }
  }

  return (
    <div className="space-y-5">
      <AnimatePresence mode="wait">
        {step === "phone" ? (
          <motion.form
            key="phone"
            onSubmit={handleSendOtp}
            className="space-y-5"
            initial={reduce ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.35, ease }}
          >
            {intent === "signup" && (
              <>
                <Input
                  label="نام و نام خانوادگی"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
                <Input
                  label="آدرس"
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  autoComplete="street-address"
                />
              </>
            )}
            <Input
              label="شماره موبایل"
              name="phone"
              type="tel"
              inputMode="numeric"
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              autoComplete="tel"
            />
            {error && (
              <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-600">
                {error}
              </p>
            )}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "در حال ارسال..." : "دریافت کد تأیید"}
            </Button>
          </motion.form>
        ) : (
          <motion.form
            key="code"
            onSubmit={handleVerify}
            className="space-y-5"
            initial={reduce ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.35, ease }}
          >
            <p className="text-sm text-muted">
              کد ۶ رقمی به{" "}
              <span className="font-bold text-foreground" dir="ltr">
                {phone}
              </span>{" "}
              ارسال شد.
            </p>
            <p className="rounded-xl border border-accent/30 bg-accent/10 px-3 py-2 text-xs text-muted">
              حالت توسعه: کد در ترمینال سرور (console) چاپ می‌شود.
            </p>
            <Input
              ref={codeRef}
              label="کد تأیید"
              name="code"
              inputMode="numeric"
              maxLength={6}
              placeholder="۱۲۳۴۵۶"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              required
              autoComplete="one-time-code"
            />
            {error && (
              <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-600">
                {error}
              </p>
            )}
            <Button type="submit" disabled={loading || code.length !== 6} className="w-full">
              {loading ? "در حال تأیید..." : intent === "login" ? "ورود" : "تکمیل ثبت‌نام"}
            </Button>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <button
                type="button"
                className="text-muted hover:text-foreground"
                onClick={() => {
                  setStep("phone");
                  setCode("");
                  setError("");
                }}
              >
                تغییر شماره
              </button>
              <button
                type="button"
                className="text-accent hover:underline disabled:opacity-50"
                disabled={cooldown > 0}
                onClick={resend}
              >
                {cooldown > 0
                  ? `ارسال مجدد (${cooldown.toLocaleString("fa-IR")})`
                  : "ارسال مجدد کد"}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <p className="text-center text-sm text-muted lg:text-right">
        {intent === "login" ? (
          <>
            حساب ندارید؟{" "}
            <Link href="/signup" className="font-medium text-accent hover:underline">
              ثبت‌نام
            </Link>
          </>
        ) : (
          <>
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <Link href="/login" className="font-medium text-accent hover:underline">
              ورود
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
