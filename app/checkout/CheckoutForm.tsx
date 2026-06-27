"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/use-auth";
import { formatPrice } from "@/lib/format";

export function CheckoutForm() {
  const { user, isAuthenticated } = useAuth();
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
      return;
    }

    if (items.length === 0) {
      setError("سبد خرید شما خالی است.");
      return;
    }

    const form = new FormData(e.currentTarget);

    setLoading(true);
    try {
      const res = await fetch("/api/checkout/zarinpal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingName:    String(form.get("name")    ?? ""),
          shippingPhone:   String(form.get("phone")   ?? ""),
          shippingAddress: String(form.get("address") ?? ""),
          items: items.map((item) => ({
            source:    item.source,
            catalogId: item.catalogId,
            title:     item.title,
            price:     item.price,
            quantity:  item.quantity,
            image:     item.image,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.paymentUrl) {
        throw new Error(data.error ?? "خطا در ایجاد پرداخت");
      }

      // Clear cart directly in localStorage before navigating away —
      // React's useEffect won't flush in time after window.location.href
      clearCart();
      localStorage.setItem("loubar_cart", JSON.stringify([]));

      // Hand off to Zarinpal — full page navigation
      window.location.href = data.paymentUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در اتصال به درگاه پرداخت.");
      setLoading(false);
    }
  }

  return (
    <>
      {!user && (
        <p className="mt-4 text-sm text-muted">
          برای پیگیری سفارش{" "}
          <a href="/login?redirect=/checkout" className="text-accent underline">
            وارد شوید
          </a>
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-10 space-y-5 border border-border bg-card p-8">
        <Input label="نام گیرنده"   name="name"    defaultValue={user?.name}    required />
        <Input label="آدرس تحویل"   name="address" defaultValue={user?.address} required />
        <Input label="شماره تماس"   name="phone"   defaultValue={user?.phone}   required />

        <p className="border-t border-border pt-4 font-bold">
          مبلغ قابل پرداخت: {formatPrice(total || 0)}
        </p>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "در حال انتقال به درگاه…" : "پرداخت آنلاین"}
        </Button>
      </form>

      {/* Subtle reassurance badge */}
      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        پرداخت امن از طریق درگاه زرین‌پال
      </p>
    </>
  );
}