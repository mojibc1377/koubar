"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStaff, useSubmitReview } from "@/hooks/use-reviews";
import { ease } from "@/lib/motion";

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function StarRating({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (stars: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex flex-row-reverse items-center justify-end gap-1">
        {[5, 4, 3, 2, 1].map((star) => {
          const active = star <= (hover || value);
          return (
            <motion.button
              key={star}
              type="button"
              aria-label={`${star} ستاره`}
              onClick={() => onChange(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              className="p-0.5 text-2xl leading-none"
            >
              <span className={active ? "text-amber-400" : "text-border"}>★</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export function ReviewSheet({
  orderId,
  onClose,
  onSuccess,
}: {
  orderId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { data: staff = [], isLoading: staffLoading } = useStaff();
  const submitReview = useSubmitReview();
  const [staffId, setStaffId] = useState("");
  const [staffStars, setStaffStars] = useState(0);
  const [foodStars, setFoodStars] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);

  useEffect(() => {
    if (staff.length > 0 && !staffId) {
      setStaffId(staff[0]!.id);
    }
  }, [staff, staffId]);

  function handleClose() {
    onClose();
  }

  function onTouchStart(e: React.TouchEvent) {
    startY.current = e.touches[0].clientY;
  }

  function onTouchEnd(e: React.TouchEvent) {
    const dy = e.changedTouches[0].clientY - startY.current;
    if (dy > 80) handleClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!staffId) {
      setError("لطفاً پرسنل را انتخاب کنید");
      return;
    }
    if (staffStars < 1 || foodStars < 1) {
      setError("لطفاً به پرسنل و محصولات امتیاز دهید");
      return;
    }

    try {
      await submitReview.mutateAsync({
        orderId,
        staffId,
        staffStars,
        foodStars,
        comment: comment.trim() || undefined,
      });
      onSuccess();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ثبت نظر");
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={handleClose}
        aria-hidden
      />

      <motion.div
        ref={sheetRef}
        key="sheet"
        role="dialog"
        aria-modal="true"
        aria-label="ثبت نظر"
        dir="rtl"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.36, ease: [0.32, 0.72, 0, 1] }}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex max-h-[90vh] flex-col",
          "rounded-t-3xl bg-card px-6 pb-10 pt-4 shadow-[0_-8px_40px_rgba(0,0,0,0.18)]",
        )}
      >
        <div className="mb-6 flex justify-center">
          <div className="h-1 w-10 rounded-full bg-border" />
        </div>

        <h2 className="mb-1 text-xl font-extrabold">ثبت نظر</h2>
        <p className="mb-6 text-sm text-muted">سفارش {orderId}</p>

        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto">
          <div className="space-y-2">
            <label htmlFor="staff-select" className="text-sm font-medium">
              پرسنل
            </label>
            <select
              id="staff-select"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              disabled={staffLoading || staff.length === 0}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-accent"
            >
              {staffLoading && <option value="">در حال بارگذاری…</option>}
              {!staffLoading && staff.length === 0 && (
                <option value="">پرسنلی یافت نشد</option>
              )}
              {staff.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} — {member.role}
                </option>
              ))}
            </select>
          </div>

          <StarRating
            label="امتیاز پرسنل"
            value={staffStars}
            onChange={setStaffStars}
          />
          <StarRating
            label="امتیاز محصولات"
            value={foodStars}
            onChange={setFoodStars}
          />

          <div className="space-y-2">
            <label htmlFor="review-comment" className="text-sm font-medium">
              نظر شما (اختیاری)
            </label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="نظر یا پیشنهادی دارید؟"
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-accent"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <motion.button
            type="submit"
            disabled={submitReview.isPending}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-xl bg-accent py-3.5 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {submitReview.isPending ? "در حال ثبت…" : "ثبت نظر"}
          </motion.button>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}

function SuccessToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-emerald-500/30 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-800 shadow-lg dark:bg-emerald-950/80 dark:text-emerald-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.35, ease }}
    >
      {message}
    </motion.div>
  );
}

export { SuccessToast };
