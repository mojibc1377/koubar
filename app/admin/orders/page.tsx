"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminModal } from "@/components/admin/AdminModal";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  useAdminOrders,
  useOrderStatusMutation,
  useOrderDeleteMutation,
} from "@/hooks/use-admin";
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
  const deleteMutation = useOrderDeleteMutation();
  const [selected, setSelected] = useState<AdminOrder | null>(null);

  // Row selection for bulk delete
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState("");

  const filtered = orders;

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2500);
  }

  function toggleChecked(id: string) {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleCheckAll() {
    setCheckedIds((prev) => {
      if (prev.size === filtered.length) return new Set();
      return new Set(filtered.map((o) => o.id));
    });
  }

  async function deleteOrder(id: string) {
    if (!confirm("این سفارش برای همیشه حذف شود؟")) return;
    try {
      await deleteMutation.mutateAsync(id);
      setCheckedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      if (selected?.id === id) setSelected(null);
      showToast("سفارش حذف شد");
    } catch {
      showToast("خطا در حذف سفارش");
    }
  }

  async function deleteSelected() {
    if (checkedIds.size === 0) return;
    if (
      !confirm(
        `${checkedIds.size.toLocaleString("fa-IR")} سفارش انتخاب شده حذف شود؟ این عملیات قابل بازگشت نیست.`,
      )
    )
      return;
    try {
      await Promise.all(
        Array.from(checkedIds).map((id) => deleteMutation.mutateAsync(id)),
      );
      setCheckedIds(new Set());
      showToast("سفارش‌های انتخاب شده حذف شدند");
    } catch {
      showToast("خطا در حذف سفارش‌ها");
    }
  }

  return (
    <>
      <AdminPageHeader
        title="سفارش‌ها"
        description="مشاهده سفارش‌های رستری (فروشگاه) و کافه"
      />

      {isLoading && <p className="mb-4 text-sm text-[#fffbf5]/60">در حال بارگذاری…</p>}

      <AnimatePresence>
        {toast && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 rounded-xl bg-[#575b49] px-4 py-2 text-sm"
          >
            {toast}
          </motion.p>
        )}
      </AnimatePresence>

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

      {/* Bulk selection bar */}
      {checkedIds.size > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-xl bg-[#fffbf50d] px-4 py-3 text-sm">
          <span>{checkedIds.size.toLocaleString("fa-IR")} سفارش انتخاب شده</span>
          <div className="flex gap-2">
            <AdminButton
              variant="ghost"
              className="text-xs!"
              onClick={() => setCheckedIds(new Set())}
            >
              لغو انتخاب
            </AdminButton>
            <AdminButton variant="danger" className="text-xs!" onClick={deleteSelected}>
              حذف انتخاب‌شده‌ها
            </AdminButton>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-[#fffbf51a]">
        <table className="w-full min-w-215 text-right text-sm">
          <thead>
            <tr className="border-b border-[#fffbf51a] text-[#fffbf5]/60">
              <th className="w-10 p-4">
                <input
                  type="checkbox"
                  checked={filtered.length > 0 && checkedIds.size === filtered.length}
                  onChange={toggleCheckAll}
                />
              </th>
              <th className="p-4">شناسه</th>
              <th className="p-4">نوع</th>
              <th className="p-4">مشتری</th>
              <th className="p-4">تاریخ</th>
              <th className="p-4">وضعیت</th>
              <th className="p-4">مبلغ</th>
              <th className="p-4">جزئیات</th>
              <th className="p-4">حذف</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <motion.tr
                key={order.id}
                layout
                className="border-b border-[#fffbf50d] hover:bg-[#fffbf508]"
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={checkedIds.has(order.id)}
                    onChange={() => toggleChecked(order.id)}
                  />
                </td>
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
                    className="text-xs!"
                    onClick={() => setSelected(order)}
                  >
                    مشاهده
                  </AdminButton>
                </td>
                <td className="p-4">
                  <AdminButton
                    variant="danger"
                    className="py-1.5! px-3! text-xs"
                    onClick={() => deleteOrder(order.id)}
                  >
                    حذف
                  </AdminButton>
                </td>
              </motion.tr>
            ))}
            {filtered.length === 0 && !isLoading && (
              <tr>
                <td colSpan={9} className="p-8 text-center text-[#fffbf5]/40">
                  سفارشی یافت نشد
                </td>
              </tr>
            )}
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
                  className="text-xs!"
                  onClick={async () => {
                    await statusMutation.mutateAsync({ id: selected.id, status });
                    setSelected({ ...selected, status });
                  }}
                >
                  {statusLabels[status]}
                </AdminButton>
              ))}
            </div>
            <div className="border-t border-[#fffbf51a] pt-4">
              <AdminButton
                variant="danger"
                className="text-xs!"
                onClick={() => deleteOrder(selected.id)}
              >
                حذف این سفارش
              </AdminButton>
            </div>
          </div>
        )}
      </AdminModal>
    </>
  );
}