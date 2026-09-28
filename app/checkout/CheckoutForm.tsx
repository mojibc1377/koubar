"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/use-auth";
import { apiFetch } from "@/lib/api/client";
import { formatPrice } from "@/lib/format";

type AppliedDiscount = {
  code: string;
  subtotal: number;
  discountAmount: number;
  total: number;
};

export function CheckoutForm() {
  const { user, isAuthenticated } = useAuth();
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [discountInput, setDiscountInput] = useState("");
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountError, setDiscountError] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(
    null,
  );

  const subtotal = total || 0;
  const payable = appliedDiscount?.total ?? subtotal;

  async function applyDiscount() {
    setDiscountError("");
    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
      return;
    }
    if (!discountInput.trim()) {
      setDiscountError("کد تخفیف را وارد کنید");
      return;
    }
    if (subtotal <= 0) {
      setDiscountError("سبد خرید خالی است");
      return;
    }

    setDiscountLoading(true);
    try {
      const result = await apiFetch<{
        code: string;
        subtotal: number;
        discountAmount: number;
        total: number;
      }>("/api/discount-codes/validate", {
        method: "POST",
        body: JSON.stringify({ code: discountInput, subtotal }),
      });
      setAppliedDiscount(result);
    } catch (err) {
      setAppliedDiscount(null);
      setDiscountError(
        err instanceof Error ? err.message : "کد تخفیف معتبر نیست",
      );
    } finally {
      setDiscountLoading(false);
    }
  }

  function removeDiscount() {
    setAppliedDiscount(null);
    setDiscountError("");
  }

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
          shippingName: String(form.get("name") ?? ""),
          shippingPhone: String(form.get("phone") ?? ""),
          shippingAddress: String(form.get("address") ?? ""),
          discountCode: appliedDiscount?.code,
          items: items.map((item) => ({
            source: item.source,
            catalogId: item.catalogId,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.paymentUrl) {
        throw new Error(data.error ?? "خطا در ایجاد پرداخت");
      }

      clearCart();
      localStorage.setItem("loubar_cart", JSON.stringify([]));

      window.location.href = data.paymentUrl;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "خطا در اتصال به درگاه پرداخت.",
      );
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

      <form
        onSubmit={handleSubmit}
        className="mt-10 space-y-5 border border-border bg-card p-8 pb-6"
      >
        <Input
          label="نام گیرنده"
          name="name"
          defaultValue={user?.name}
          required
        />
        <Input
          label="آدرس تحویل"
          name="address"
          defaultValue={user?.address}
          required
        />
        <Input
          label="شماره تماس"
          name="phone"
          defaultValue={user?.phone}
          required
        />

        <div className="space-y-3 border-t border-border pt-4">
          <p className="text-sm font-semibold">کد تخفیف</p>
          {appliedDiscount ? (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm">
              <div>
                <p className="font-bold text-emerald-700 dark:text-emerald-300">
                  {appliedDiscount.code}
                </p>
                <p className="text-xs text-muted">
                  {formatPrice(appliedDiscount.discountAmount)} تخفیف اعمال شد
                </p>
              </div>
              <button
                type="button"
                onClick={removeDiscount}
                className="text-xs font-semibold text-red-600 hover:underline"
              >
                حذف
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value.toUpperCase())}
                placeholder="کد تخفیف"
                dir="ltr"
                className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={applyDiscount}
                disabled={discountLoading}
              >
                {discountLoading ? "…" : "اعمال"}
              </Button>
            </div>
          )}
          {discountError && (
            <p className="text-sm text-red-600">{discountError}</p>
          )}
        </div>

        <div className="space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between text-muted">
            <span>جمع سبد</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {appliedDiscount && (
            <div className="flex justify-between text-emerald-700 dark:text-emerald-300">
              <span>تخفیف</span>
              <span>− {formatPrice(appliedDiscount.discountAmount)}</span>
            </div>
          )}
          <p className="flex justify-between border-t border-border pt-3 text-base font-bold">
            <span>مبلغ قابل پرداخت</span>
            <span>{formatPrice(payable)}</span>
          </p>
        </div>

        <p className="flex items-center justify-center gap-1.5 text-xs text-muted animate-bounce">
          لطفا قبل از شروع خرید، vpn خود را خاموش کنید{" "}
        </p>
        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "در حال انتقال به درگاه…" : "پرداخت آنلاین"}
        </Button>
      </form>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        پرداخت امن از طریق درگاه زرین‌پال
      </p>
    </>
  );
}
