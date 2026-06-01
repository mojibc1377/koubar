"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminModal } from "@/components/admin/AdminModal";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { initialOrders } from "@/lib/admin/mock-data";
import type { AdminOrder } from "@/lib/admin/types";
import { formatPrice } from "@/lib/format";

const statusLabels = {
  delivered: "تحویل شده",
  processing: "در حال پردازش",
  cancelled: "لغو شده",
} as const;

const statusColors = {
  delivered: "bg-emerald-900/40 text-emerald-200",
  processing: "bg-amber-900/40 text-amber-200",
  cancelled: "bg-red-900/40 text-red-200",
};

export default function AdminOrdersPage() {
  const [orders] = useState(initialOrders);
  const [tab, setTab] = useState<"all" | "shop" | "cafe">("all");
  const [selected, setSelected] = useState<AdminOrder | null>(null);

  const filtered = useMemo(() => {
    if (tab === "all") return orders;
    return orders.filter((o) => o.type === tab);
  }, [orders, tab]);

  const shopCount = orders.filter((o) => o.type === "shop").length;
  const cafeCount = orders.filter((o) => o.type === "cafe").length;

  return (
    <>
      <AdminPageHeader
        title="سفارش‌ها"
        description="مشاهده سفارش‌های رستری (فروشگاه) و کافه"
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {(
          [
            { key: "all", label: `همه (${orders.length})` },
            { key: "shop", label: `رستری (${shopCount})` },
            { key: "cafe", label: `کافه (${cafeCount})` },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === t.key ? "bg-[#575b49]" : "bg-[#fffbf50d] text-[#fffbf5]/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#fffbf51a]">
        <table className="w-full min-w-[800px] text-right text-sm">
          <thead>
            <tr className="border-b border-[#fffbf51a] text-[#fffbf5]/60">
              <th className="p-4">شناسه</th>
              <th className="p-4">نوع</th>
              <th className="p-4">مشتری</th>
              <th className="p-4">تاریخ</th>
              <th className="p-4">وضعیت</th>
              <th className="p-4">مبلغ</th>
              <th className="p-4">جزئیات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <motion.tr
                key={order.id}
                layout
                className="border-b border-[#fffbf50d] hover:bg-[#fffbf508]"
              >
                <td className="p-4 font-mono text-xs" dir="ltr">
                  {order.id}
                </td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      order.type === "shop"
                        ? "bg-[#575b49]/50"
                        : "bg-[#fffbf515]"
                    }`}
                  >
                    {order.type === "shop" ? "رستری" : "کافه"}
                  </span>
                </td>
                <td className="p-4">
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-xs text-[#fffbf5]/50" dir="ltr">
                    {order.customerPhone}
                  </p>
                </td>
                <td className="p-4 text-[#fffbf5]/70">{order.date}</td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${statusColors[order.status]}`}
                  >
                    {statusLabels[order.status]}
                  </span>
                </td>
                <td className="p-4 font-bold">{formatPrice(order.total)}</td>
                <td className="p-4">
                  <AdminButton
                    variant="secondary"
                    className="!py-1.5 !px-3 !text-xs"
                    onClick={() => setSelected(order)}
                  >
                    مشاهده
                  </AdminButton>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal
        open={selected !== null}
        title={selected ? `سفارش ${selected.id}` : ""}
        onClose={() => setSelected(null)}
        wide
      >
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <p>
                <span className="text-[#fffbf5]/55">مشتری: </span>
                {selected.customerName}
              </p>
              <p dir="ltr">
                <span className="text-[#fffbf5]/55">موبایل: </span>
                {selected.customerPhone}
              </p>
              <p>
                <span className="text-[#fffbf5]/55">نوع: </span>
                {selected.type === "shop" ? "رستری" : "کافه"}
              </p>
              <p>
                <span className="text-[#fffbf5]/55">وضعیت: </span>
                {statusLabels[selected.status]}
              </p>
            </div>
            <ul className="space-y-2 rounded-xl border border-[#fffbf51a] p-4">
              {selected.items.map((item) => (
                <li key={item.id + item.title} className="flex justify-between gap-3">
                  <span>
                    {item.title} × {item.quantity.toLocaleString("fa-IR")}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <p className="text-lg font-bold">جمع: {formatPrice(selected.total)}</p>
            <div className="flex gap-2 pt-2">
              <AdminButton variant="secondary">تغییر وضعیت (دمو)</AdminButton>
              <AdminButton variant="ghost" onClick={() => setSelected(null)}>
                بستن
              </AdminButton>
            </div>
          </div>
        )}
      </AdminModal>
    </>
  );
}
