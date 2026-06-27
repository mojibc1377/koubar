"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageShell } from "@/components/PageShell";

/* ─── tiny helpers ─── */
function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ─── icons ─── */
function IconCheck() {
  return (
    <svg viewBox="0 0 52 52" fill="none" className="h-full w-full" aria-hidden>
      <circle cx="26" cy="26" r="25" stroke="currentColor" strokeWidth="2" className="text-emerald-500" />
      <path
        d="M14 27l8 8 16-16"
        stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        className="text-emerald-500 [stroke-dasharray:40] [stroke-dashoffset:40] animate-[draw_0.45s_0.2s_ease_forwards]"
      />
    </svg>
  );
}

function IconX() {
  return (
    <svg viewBox="0 0 52 52" fill="none" className="h-full w-full" aria-hidden>
      <circle cx="26" cy="26" r="25" stroke="currentColor" strokeWidth="2" className="text-red-400" />
      <path
        d="M17 17l18 18M35 17L17 35"
        stroke="currentColor" strokeWidth="3" strokeLinecap="round"
        className="text-red-400 [stroke-dasharray:60] [stroke-dashoffset:60] animate-[draw_0.35s_0.15s_ease_forwards]"
      />
    </svg>
  );
}

/* ─── sheet ─── */
interface ResultSheetProps {
  status: "success" | "failed";
  orderId: string;
  refId?: string;
}

function ResultSheet({ status, orderId, refId }: ResultSheetProps) {
  const router = useRouter();
  const sheetRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const isSuccess = status === "success";

  // Trigger enter animation after mount
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // Close & navigate
  function close(destination: string) {
    setVisible(false);
    setTimeout(() => router.push(destination), 360);
  }

  // Drag-to-dismiss (optional, touch friendly)
  const startY = useRef(0);
  function onTouchStart(e: React.TouchEvent) {
    startY.current = e.touches[0].clientY;
  }
  function onTouchEnd(e: React.TouchEvent) {
    const dy = e.changedTouches[0].clientY - startY.current;
    if (dy > 80) close(isSuccess ? "/account/orders" : "/checkout");
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          visible ? "opacity-100" : "opacity-0"
        )}
        onClick={() => close(isSuccess ? "/account/orders" : "/checkout")}
        aria-hidden
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={isSuccess ? "پرداخت موفق" : "پرداخت ناموفق"}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex flex-col items-center rounded-t-3xl",
          "bg-card px-6 pb-10 pt-4 shadow-[0_-8px_40px_rgba(0,0,0,0.18)]",
          "transition-transform duration-[360ms] ease-[cubic-bezier(0.32,0.72,0,1)]",
          visible ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Drag handle */}
        <div className="mb-6 h-1 w-10 rounded-full bg-border" />

        {/* Icon */}
        <div className="mb-5 h-16 w-16">
          {isSuccess ? <IconCheck /> : <IconX />}
        </div>

        {/* Heading */}
        <h2 className={cn("mb-1 text-2xl font-extrabold", isSuccess ? "text-emerald-600" : "text-red-500")}>
          {isSuccess ? "پرداخت موفق" : "پرداخت ناموفق"}
        </h2>

        {/* Sub-text */}
        <p className="mb-6 text-center text-sm text-muted">
          {isSuccess
            ? "سفارش شما با موفقیت ثبت شد. از خرید شما متشکریم!"
            : "تراکنش ناموفق بود یا لغو شد. مبلغی از حساب شما کسر نشده است."}
        </p>

        {/* Detail rows */}
        <dl className="mb-8 w-full divide-y divide-border rounded-xl border border-border text-sm">
          <Row label="شماره سفارش" value={`#${orderId}`} mono />
          {isSuccess && refId && <Row label="کد پیگیری (Ref ID)" value={refId} mono highlight />}
          <Row label="وضعیت" value={isSuccess ? "پرداخت شده ✓" : "ناموفق ✗"} />
        </dl>

        {/* Actions */}
        {isSuccess ? (
          <button
            onClick={() => close("/account/orders")}
            className="w-full rounded-xl bg-emerald-600 py-3.5 text-base font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.98]"
          >
            مشاهده سفارش‌ها
          </button>
        ) : (
          <div className="flex w-full flex-col gap-3">
            <button
              onClick={() => close("/checkout")}
              className="w-full rounded-xl bg-foreground py-3.5 text-base font-semibold text-background transition hover:opacity-90 active:scale-[0.98]"
            >
              تلاش مجدد
            </button>
            <button
              onClick={() => close("/")}
              className="w-full rounded-xl border border-border py-3 text-sm text-muted transition hover:bg-muted/10 active:scale-[0.98]"
            >
              بازگشت به صفحه اصلی
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/* ─── tiny row helper ─── */
function Row({
  label, value, mono, highlight,
}: {
  label: string; value: string; mono?: boolean; highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <dt className="text-muted">{label}</dt>
      <dd className={cn(
        "font-medium",
        mono && "font-mono tracking-tight",
        highlight && "text-emerald-600",
      )}>{value}</dd>
    </div>
  );
}

/* ─── page ─── */
function ResultPageInner() {
  const params = useSearchParams();

  const status  = (params.get("status") ?? "failed") as "success" | "failed";
  const orderId = params.get("orderId") ?? "—";
  const refId   = params.get("refId")   ?? undefined;

  return (
    <PageShell>
      <div
        className={cn(
          "min-h-screen transition-colors duration-700",
          status === "success"
            ? "bg-emerald-50/40 dark:bg-emerald-950/20"
            : "bg-red-50/40 dark:bg-red-950/20"
        )}
      />
      <ResultSheet status={status} orderId={orderId} refId={refId} />
    </PageShell>
  );
}

export default function CheckoutResultPage() {
  return (
    <Suspense fallback={<PageShell><div className="min-h-screen" /></PageShell>}>
      <ResultPageInner />
    </Suspense>
  );
}