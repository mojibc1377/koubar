"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminModal } from "@/components/admin/AdminModal";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { useAdminOrders, useOrderStatusMutation } from "@/hooks/use-admin";
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
  const [tab, setTab] = useState<"all" | "shop" | "cafe">("all");
  const { data: orders = [], isLoading } = useAdminOrders(
    tab === "all" ? undefined : tab,
  );
  const statusMutation = useOrderStatusMutation();
  const [selected, setSelected] = useState<AdminOrder | null>(null);

  const shopCount = useMemo(
    () => orders.filter((o) => o.type === "shop").length,
    [orders],
  );
  const cafeCount = useMemo(
    () => orders.filter((o) => o.type === "cafe").length,
    [orders],
  );

  const filtered = orders;

  return (
    <>
      <AdminPageHeader
        title="سفارش‌ها"
        description="مشاهده سفارش‌های رستری (فروشگاه) و کافه"
      />

      {isLoading && <p className="mb-4 text-sm text-[#fffbf5]/60">در حال بارگذاری…</p>}

      <div className="mb-6 flex flex-wrap gap-2">
        {(
          [
            { key: "all", label: `همه` },
            { key: "shop", label: `رستری` },
            { key: "cafe", label: `کافه` },
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
                <td className="p-4 font-mono text-xs">{order.id}</td>
                <td className="p-4">{order.type === "shop" ? "رستری" : "کافه"}</td>
                <td className="p-4">{order.customerName}</td>
                <td className="p-4 text-[#fffbf5]/60">{order.date}</td>
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
                    className="!text-xs"
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
        title={`سفارش ${selected?.id ?? ""}`}
        onClose={() => setSelected(null)}
        wide
      >
        {selected && (
          <div className="space-y-4 text-sm">
            <p>
              <span className="text-[#fffbf5]/60">مشتری: </span>
              {selected.customerName} · {selected.customerPhone}
            </p>
            <ul className="space-y-2 rounded-xl border border-[#fffbf51a] p-4">
              {selected.items.map((item) => (
                <li key={item.id} className="flex justify-between gap-4">
                  <span>
                    {item.title} × {item.quantity.toLocaleString("fa-IR")}
                  </span>
                  <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <p className="text-lg font-extrabold">جمع: {formatPrice(selected.total)}</p>
            <div className="flex flex-wrap gap-2">
              {(["processing", "delivered", "cancelled"] as const).map((status) => (
                <AdminButton
                  key={status}
                  variant="secondary"
                  className="!text-xs"
                  onClick={async () => {
                    await statusMutation.mutateAsync({ id: selected.id, status });
                    setSelected({ ...selected, status });
                  }}
                >
                  {statusLabels[status]}
                </AdminButton>
              ))}
            </div>
          </div>
        )}
      </AdminModal>
    </>
  );
}
