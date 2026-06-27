"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { OrderCard } from "@/components/account/OrderCard";
import { ReviewSheet, SuccessToast } from "@/components/account/ReviewSheet";
import { useMyOrders, useMyTransactions } from "@/hooks/use-orders";
import { useReview } from "@/hooks/use-reviews";
import { formatPrice } from "@/lib/format";
import { ease } from "@/lib/motion";
import type { Order, Transaction } from "@/lib/types";

const txLabels: Record<Transaction["status"], string> = {
  paid: "پرداخت شده",
  refunded: "بازگشت وجه",
  pending: "در انتظار",
};

const txColors: Record<Transaction["status"], string> = {
  paid: "text-emerald-700",
  refunded: "text-amber-700",
  pending: "text-muted",
};

function OrderCardWithReview({
  order,
  index,
  onReviewClick,
}: {
  order: Order;
  index: number;
  onReviewClick: (orderId: string) => void;
}) {
  const canCheckReview = order.status === "delivered";
  const { data: review, isLoading: reviewLoading } = useReview(
    canCheckReview ? order.id : undefined,
  );
  const showReviewButton =
    canCheckReview && !reviewLoading && !review;

  return (
    <OrderCard
      order={order}
      index={index}
      showReviewButton={showReviewButton}
      onReviewClick={() => onReviewClick(order.id)}
    />
  );
}

export default function OrdersPage() {
  const { data: orders = [], isLoading: ordersLoading } = useMyOrders();
  const { data: transactions = [], isLoading: txLoading } = useMyTransactions();
  const reduce = useReducedMotion();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <motion.section
        className="rounded-2xl border border-border bg-card p-6 md:p-8"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease }}
      >
        <h2 className="text-xl font-bold">سفارش‌های خریداری‌شده</h2>
        <p className="mt-2 text-sm text-muted">
          تاریخچه خرید از فروشگاه آنلاین و سفارش‌های کافه
        </p>

        {ordersLoading && (
          <p className="mt-8 text-sm text-muted">در حال بارگذاری سفارش‌ها…</p>
        )}

        <ul className="mt-8 space-y-4">
          {orders.map((order, index) => (
            <OrderCardWithReview
              key={order.id}
              order={order}
              index={index}
              onReviewClick={setSelectedOrderId}
            />
          ))}
        </ul>
        {!ordersLoading && orders.length === 0 && (
          <p className="mt-8 text-sm text-muted">هنوز سفارشی ثبت نشده است.</p>
        )}
      </motion.section>

      <motion.section
        className="overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1, ease }}
      >
        <h2 className="text-xl font-bold">تاریخچه تراکنش‌ها</h2>
        {txLoading && (
          <p className="mt-6 text-sm text-muted">در حال بارگذاری تراکنش‌ها…</p>
        )}
        <div className="mt-6 space-y-3 md:hidden">
          {transactions.map((tx, i) => (
            <motion.div
              key={tx.id}
              className="rounded-xl border border-border p-4"
              initial={reduce ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex justify-between">
                <span className="font-bold">{tx.id}</span>
                <span className={`text-sm font-medium ${txColors[tx.status]}`}>
                  {txLabels[tx.status]}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted">
                {tx.date} · {tx.method}
              </p>
              <p className="mt-2 font-bold">{formatPrice(tx.amount)}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 hidden overflow-x-auto md:block">
          <table className="w-full min-w-[520px] text-right text-sm">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="pb-3 font-medium">شناسه</th>
                <th className="pb-3 font-medium">سفارش</th>
                <th className="pb-3 font-medium">تاریخ</th>
                <th className="pb-3 font-medium">روش</th>
                <th className="pb-3 font-medium">وضعیت</th>
                <th className="pb-3 font-medium">مبلغ</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <motion.tr
                  key={tx.id}
                  className="border-b border-border"
                  whileHover={{ backgroundColor: "rgba(87,91,73,0.06)" }}
                >
                  <td className="py-4">{tx.id}</td>
                  <td className="py-4 text-muted">{tx.orderId}</td>
                  <td className="py-4 text-muted">{tx.date}</td>
                  <td className="py-4 text-muted">{tx.method}</td>
                  <td className={`py-4 font-medium ${txColors[tx.status]}`}>
                    {txLabels[tx.status]}
                  </td>
                  <td className="py-4 font-bold">{formatPrice(tx.amount)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {selectedOrderId && (
        <ReviewSheet
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          onSuccess={() => setSuccessMessage("نظر شما با موفقیت ثبت شد. متشکریم!")}
        />
      )}

      <AnimatePresence>
        {successMessage && (
          <SuccessToast
            message={successMessage}
            onDismiss={() => setSuccessMessage(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
