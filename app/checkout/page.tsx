"use client";

import { PageShell } from "@/components/PageShell";
import { CheckoutForm } from "./CheckoutForm";

export default function CheckoutPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-lg px-6 py-16 lg:py-24">
        <h1 className="text-4xl font-extrabold">تسویه حساب</h1>
        <CheckoutForm />
      </div>
    </PageShell>
  );
}
