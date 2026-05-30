"use client";

import { FormEvent, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <PageShell>
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 lg:grid-cols-2 lg:px-10 lg:py-24">
        <div>
          <h1 className="text-4xl font-extrabold">تماس با ما</h1>
          <p className="mt-4 text-muted">
            تهران، نیاوران، خیابان باهنر، خیابان شفیعی، نبش کوچه بهرام، پلاک ۹
          </p>
          <p className="mt-6 text-muted">
            <a href="tel:+989123456003" className="hover:text-accent">
              ۰۹۱۲۳۴۵۶۰۰۳
            </a>
            <br />
            <a href="tel:+989126873268" className="hover:text-accent">
              ۰۹۱۲۶۸۷۳۲۶۸
            </a>
          </p>
          <p className="mt-8 text-sm text-muted">
            شنبه تا پنج‌شنبه ۹ تا ۲۱ — جمعه‌ها ۱۰ تا ۱۸
          </p>
        </div>
        <div className="border border-border bg-card p-8">
          {sent ? (
            <p className="text-center text-foreground/80">پیام شما دریافت شد. به زودی پاسخ می‌دهیم.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input label="نام" name="name" required />
              <Input label="ایمیل" name="email" type="email" required />
              <Textarea label="پیام" name="message" required />
              <Button type="submit" className="w-full">
                ارسال پیام
              </Button>
            </form>
          )}
        </div>
      </div>
    </PageShell>
  );
}
