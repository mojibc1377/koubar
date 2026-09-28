"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageShell } from "@/components/PageShell";

/* ─── helpers ─── */
function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ─── confetti ─── */
function useConfetti(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const container = document.getElementById("confetti-root");
    if (!container) return;

    const colors = ["#10b981", "#34d399", "#6ee7b7", "#fbbf24", "#60a5fa", "#a78bfa"];
    const pieces: HTMLDivElement[] = [];

    for (let i = 0; i < 40; i++) {
      const el = document.createElement("div");
      const size = 6 + Math.random() * 6;
      const isCircle = Math.random() > 0.5;
      el.style.cssText = `
        position:absolute;
        width:${size}px;height:${size}px;
        left:${Math.random() * 100}%;
        top:-10px;
        background:${colors[i % colors.length]};
        border-radius:${isCircle ? "50%" : "2px"};
        animation: confettiFall ${0.9 + Math.random() * 0.9}s ${Math.random() * 0.5}s linear both;
        transform: rotate(${Math.random() * 360}deg);
        pointer-events:none;
      `;
      container.appendChild(el);
      pieces.push(el);
    }

    const cleanup = setTimeout(() => pieces.forEach((p) => p.remove()), 2500);
    return () => {
      clearTimeout(cleanup);
      pieces.forEach((p) => p.remove());
    };
  }, [active]);
}

/* ─── icons ─── */
function IconCheck() {
  return (
    <svg viewBox="0 0 52 52" fill="none" className="h-full w-full" aria-hidden>
      <circle
        cx="26" cy="26" r="24"
        stroke="#10b981" strokeWidth="1.5"
        fill="#d1fae5"
        className="dark:fill-emerald-900/40"
      />
      <path
        d="M15 27l7 8 16-16"
        stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        style={{
          strokeDasharray: 40,
          strokeDashoffset: 40,
          animation: "drawStroke 0.5s 0.6s ease forwards",
        }}
      />
    </svg>
  );
}

function IconX() {
  return (
    <svg viewBox="0 0 52 52" fill="none" className="h-full w-full" aria-hidden>
      <circle
        cx="26" cy="26" r="24"
        stroke="#f87171" strokeWidth="1.5"
        fill="#fee2e2"
        className="dark:fill-red-900/30"
      />
      <path
        d="M17 17l18 18M35 17L17 35"
        stroke="#f87171" strokeWidth="3" strokeLinecap="round"
        style={{
          strokeDasharray: 60,
          strokeDashoffset: 60,
          animation: "drawStroke 0.4s 0.55s ease forwards",
        }}
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
  const [visible, setVisible] = useState(false);
  const isSuccess = status === "success";

  useConfetti(isSuccess && visible);

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  function close(destination: string) {
    setVisible(false);
    setTimeout(() => router.push(destination), 380);
  }

  const startY = useRef(0);
  function onTouchStart(e: React.TouchEvent) { startY.current = e.touches[0].clientY; }
  function onTouchEnd(e: React.TouchEvent) {
    if (e.changedTouches[0].clientY - startY.current > 80)
      close(isSuccess ? "/account/orders" : "/checkout");
  }

  return (
    <>
      {/* Keyframes injected once */}
      <style>{`
        @keyframes drawStroke   { to { stroke-dashoffset: 0; } }
        @keyframes sheetUp      { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fadeInBg     { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn        { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.12); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes pulseRing    { 0% { transform: scale(1); opacity: 0.55; } 100% { transform: scale(1.9); opacity: 0; } }
        @keyframes rowSlide     { from { opacity: 0; transform: translateX(14px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes badgePop     { 0% { transform: scale(0); opacity: 0; } 65% { transform: scale(1.18); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes shimmerSlide { 0%,100% { background-position: 200% center; } 50% { background-position: -200% center; } }
        @keyframes confettiFall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(260px) rotate(420deg); opacity: 0; } }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={() => close(isSuccess ? "/account/orders" : "/checkout")}
        aria-hidden
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        style={{
          transition: "opacity 0.3s",
          opacity: visible ? 1 : 0,
        }}
      />

      {/* Confetti layer */}
      <div
        id="confetti-root"
        className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
        aria-hidden
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isSuccess ? "پرداخت موفق" : "پرداخت ناموفق"}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center rounded-t-3xl bg-card px-6 pb-10 pt-4"
        style={{
          boxShadow: "0 -8px 48px rgba(0,0,0,0.18)",
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.38s cubic-bezier(0.32,0.72,0,1)",
          animation: visible ? undefined : undefined,
        }}
      >
        {/* Drag handle */}
        <div className="mb-6 h-1 w-10 rounded-full bg-border" />

        {/* Icon with pulse ring */}
        <div
          className="relative mb-5 flex items-center justify-center"
          style={{ width: 80, height: 80 }}
        >
          {/* Pulse ring */}
          {visible && (
            <span
              aria-hidden
              className={cn(
                "absolute inset-0 rounded-full",
                isSuccess ? "bg-emerald-400" : "bg-red-400"
              )}
              style={{
                animation: "pulseRing 1.4s ease-out 0.45s 2",
              }}
            />
          )}
          {/* Icon */}
          <div
            style={{
              width: 72, height: 72,
              animation: visible ? "popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.15s both" : undefined,
            }}
          >
            {isSuccess ? <IconCheck /> : <IconX />}
          </div>
        </div>

        {/* Heading + badge */}
        <div className="mb-1 flex items-center gap-2">
          <h2
            className={cn(
              "text-2xl font-extrabold",
              isSuccess ? "text-emerald-600" : "text-red-500"
            )}
          >
            {isSuccess ? "پرداخت موفق" : "پرداخت ناموفق"}
          </h2>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-semibold",
              isSuccess
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300"
                : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
            )}
            style={{ animation: "badgePop 0.38s cubic-bezier(0.34,1.56,0.64,1) 0.85s both", opacity: 0 }}
          >
            {isSuccess ? "✓ تأیید شد" : "✗ ناموفق"}
          </span>
        </div>

        {/* Sub-text */}
        <p className="mb-6 text-center text-sm text-muted">
          {isSuccess
            ? "سفارش شما با موفقیت ثبت شد. از خرید شما متشکریم!"
            : "تراکنش ناموفق بود یا لغو شد. مبلغی از حساب شما کسر نشده است."}
        </p>

        {/* Detail rows */}
        <dl className="mb-8 w-full divide-y divide-border rounded-xl border border-border text-sm overflow-hidden">
          <Row label="شماره سفارش" value={`#${orderId}`} mono delay={0} />
          <Row label="وضعیت" value={isSuccess ? "پرداخت شده ✓" : "ناموفق ✗"} highlight={isSuccess} failHighlight={!isSuccess} delay={1} />
          {isSuccess && refId && (
            <Row label="کد پیگیری" value={refId} mono shimmer delay={2} />
          )}
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

/* ─── row ─── */
function Row({
  label, value, mono, highlight, failHighlight, shimmer, delay = 0,
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
  failHighlight?: boolean;
  shimmer?: boolean;
  delay?: number;
}) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3"
      style={{
        opacity: 0,
        animation: `rowSlide 0.3s ${0.55 + delay * 0.09}s ease forwards`,
      }}
    >
      <dt className="text-muted">{label}</dt>
      <dd
        className={cn(
          "font-medium",
          mono && "font-mono tracking-tight",
          highlight && "text-emerald-600",
          failHighlight && "text-red-500",
        )}
        style={
          shimmer
            ? {
                background:
                  "linear-gradient(90deg, #059669 0%, #34d399 40%, #059669 60%, #34d399 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "shimmerSlide 2.2s linear 1.2s 3",
              }
            : undefined
        }
      >
        {value}
      </dd>
    </div>
  );
}

/* ─── page ─── */
function ResultPageInner() {
  const params = useSearchParams();
  const status  = (params.get("status") ?? "failed") as "success" | "failed";
  const orderId = params.get("orderId") ?? "—";
  const refId   = params.get("refId") ?? undefined;

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