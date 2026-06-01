"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/use-auth";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage() {
  const { user } = useAuth();
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    router.push("/account/orders");
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-lg px-6 py-16 lg:py-24">
        <h1 className="text-4xl font-extrabold">تسویه حساب</h1>
        {!user && (
          <p className="mt-4 text-sm text-muted">
            برای پیگیری سفارش{" "}
            <a href="/login?redirect=/checkout" className="text-accent underline">
              وارد شوید
            </a>
          </p>
        )}
        <form onSubmit={handleSubmit} className="mt-10 space-y-5 border border-border bg-card p-8">
          <Input label="نام گیرنده" name="name" defaultValue={user?.name} required />
          <Input label="آدرس تحویل" name="address" defaultValue={user?.address} required />
          <Input label="شماره تماس" name="phone" defaultValue={user?.phone} required />
          <p className="border-t border-border pt-4 font-bold">
            مبلغ قابل پرداخت: {formatPrice(10_500_000)}
          </p>
          <Button type="submit" className="w-full">
            پرداخت و ثبت سفارش
          </Button>
        </form>
      </div>
    </PageShell>
  );
}
