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
      <div className="mx-auto grid max-w-350 gap-12 px-6 py-16 lg:grid-cols-2 lg:px-10 lg:py-24">
        <div>
          <h1 className="text-4xl font-extrabold">تماس با ما</h1>
          <p className="mt-6 max-w-xs text-sm leading-8 text-muted">
            رشت-گلسار- خیابان ۹۳-شاهد یکم-نبش خیابان ۹۱ شمالی
          </p>
          <p className="mt-4 text-sm text-muted">
            تلفن تماس | {" "}
            <a href="tel:+989003612123" className="hover:text-accent">
              ۰۹۰۰۳۶۱۲۱۲۳
            </a>
          </p>
          <p className="mt-2 text-sm text-muted">
            <span className="hover:text-accent" dir="auto">
               ۰۸:۰۰ صبح  الی ۱۱:۰۰ شب
            </span>
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
