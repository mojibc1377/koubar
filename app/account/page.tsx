"use client";

import { FormEvent, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { spring } from "@/lib/motion";

export default function AccountPage() {
  const { user, updateProfile, logout } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const reduce = useReducedMotion();

  if (!user) return null;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    updateProfile({
      name: String(form.get("name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      address: String(form.get("address") ?? ""),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  return (
    <motion.div
      className="rounded-2xl border border-border bg-card p-6 md:p-8"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">اطلاعات حساب</h2>
          <p className="mt-2 text-sm text-muted">ویرایش مشخصات و آدرس تحویل</p>
        </div>
        <span className="rounded-full border border-border-strong bg-card-elevated px-3 py-1 text-xs text-muted">
          {user.email}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 max-w-lg space-y-5">
        <Input label="نام" name="name" defaultValue={user.name} required />
        <Input label="شماره موبایل" name="phone" defaultValue={user.phone} required />
        <Input label="آدرس" name="address" defaultValue={user.address} required />
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button type="submit">ذخیره تغییرات</Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            خروج از حساب
          </Button>
          <AnimatePresence>
            {saved && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-medium text-emerald-700"
              >
                ذخیره شد ✓
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </form>
    </motion.div>
  );
}
