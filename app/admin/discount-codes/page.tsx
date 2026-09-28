"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminInput, AdminSelect } from "@/components/admin/AdminField";
import { AdminModal } from "@/components/admin/AdminModal";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  useAdminDiscountCodes,
  useDiscountCodeMutations,
  type AdminDiscountCode,
} from "@/hooks/use-admin";
import { formatPrice } from "@/lib/format";

const emptyCode = (): AdminDiscountCode & { maxUsesInput?: string; expiresInput?: string } => ({
  id: "",
  code: "",
  type: "percent",
  value: 10,
  active: true,
  useCount: 0,
  createdAt: new Date().toISOString(),
  maxUsesInput: "",
  expiresInput: "",
});

function formatDiscountLabel(code: AdminDiscountCode) {
  return code.type === "percent"
    ? `${code.value.toLocaleString("fa-IR")}٪`
    : formatPrice(code.value);
}

function formatExpiry(iso?: string) {
  if (!iso) return "بدون انقضا";
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

export default function AdminDiscountCodesPage() {
  const { data: codes = [], isLoading } = useAdminDiscountCodes();
  const { create, update, remove } = useDiscountCodeMutations();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [draft, setDraft] = useState<
    AdminDiscountCode & { maxUsesInput?: string; expiresInput?: string }
  | null>(null);
  const [toast, setToast] = useState("");

  const filtered = useMemo(
    () => codes.filter((c) => c.code.includes(search.toUpperCase())),
    [codes, search],
  );

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2500);
  }

  async function saveCode() {
    if (!draft?.code.trim()) return;

    const payload = {
      code: draft.code,
      type: draft.type,
      value: draft.value,
      active: draft.active,
      expiresAt: draft.expiresInput?.trim() ? draft.expiresInput : null,
      maxUses: draft.maxUsesInput?.trim()
        ? Number(draft.maxUsesInput)
        : null,
    };

    try {
      if (modal === "add") {
        await create.mutateAsync(payload);
        showToast("کد تخفیف ایجاد شد");
      } else if (draft.id) {
        await update.mutateAsync({ id: draft.id, ...payload });
        showToast("کد تخفیف ویرایش شد");
      }
      setModal(null);
      setDraft(null);
    } catch {
      showToast("خطا در ذخیره");
    }
  }

  async function toggleActive(code: AdminDiscountCode) {
    try {
      await update.mutateAsync({ id: code.id, active: !code.active });
      showToast(!code.active ? "کد فعال شد" : "کد غیرفعال شد");
    } catch {
      showToast("خطا در تغییر وضعیت");
    }
  }

  return (
    <>
      <AdminPageHeader
        title="کدهای تخفیف"
        description="ایجاد و مدیریت کدهای تخفیف — هر کاربر هر کد را فقط یک‌بار می‌تواند استفاده کند"
        action={
          <AdminButton
            onClick={() => {
              setDraft(emptyCode());
              setModal("add");
            }}
          >
            + کد جدید
          </AdminButton>
        }
      />

      {isLoading && (
        <p className="mb-4 text-sm text-[#fffbf5]/60">در حال بارگذاری…</p>
      )}

      <AdminInput
        label="جستجو"
        placeholder="کد تخفیف..."
        value={search}
        onChange={(e) => setSearch(e.target.value.toUpperCase())}
        dir="ltr"
        className="mb-6 max-w-md"
      />

      <AnimatePresence>
        {toast && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-4 rounded-xl bg-[#575b49] px-4 py-2 text-sm"
          >
            {toast}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="overflow-x-auto rounded-2xl border border-[#fffbf51a]">
        <table className="w-full min-w-[760px] text-right text-sm">
          <thead>
            <tr className="border-b border-[#fffbf51a] text-[#fffbf5]/60">
              <th className="p-4 font-medium">کد</th>
              <th className="p-4 font-medium">نوع</th>
              <th className="p-4 font-medium">مقدار</th>
              <th className="p-4 font-medium">استفاده</th>
              <th className="p-4 font-medium">انقضا</th>
              <th className="p-4 font-medium">وضعیت</th>
              <th className="p-4 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((code) => (
              <motion.tr
                key={code.id}
                layout
                className="border-b border-[#fffbf50d] hover:bg-[#fffbf508]"
              >
                <td className="p-4 font-mono font-bold" dir="ltr">
                  {code.code}
                </td>
                <td className="p-4">
                  {code.type === "percent" ? "درصدی" : "مبلغ ثابت"}
                </td>
                <td className="p-4 font-semibold">{formatDiscountLabel(code)}</td>
                <td className="p-4">
                  {code.useCount.toLocaleString("fa-IR")}
                  {code.maxUses != null && (
                    <span className="text-[#fffbf5]/50">
                      {" "}
                      / {code.maxUses.toLocaleString("fa-IR")}
                    </span>
                  )}
                </td>
                <td className="p-4 text-[#fffbf5]/70">
                  {formatExpiry(code.expiresAt)}
                </td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      code.active
                        ? "bg-emerald-900/40 text-emerald-200"
                        : "bg-red-900/40 text-red-200"
                    }`}
                  >
                    {code.active ? "فعال" : "غیرفعال"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    <AdminButton
                      variant="secondary"
                      className="!py-1.5 !px-3 text-xs"
                      onClick={() => {
                        setDraft({
                          ...code,
                          maxUsesInput: code.maxUses?.toString() ?? "",
                          expiresInput: code.expiresAt
                            ? code.expiresAt.slice(0, 10)
                            : "",
                        });
                        setModal("edit");
                      }}
                    >
                      ویرایش
                    </AdminButton>
                    <AdminButton
                      variant="secondary"
                      className="!py-1.5 !px-3 text-xs"
                      onClick={() => toggleActive(code)}
                    >
                      {code.active ? "غیرفعال" : "فعال"}
                    </AdminButton>
                    <AdminButton
                      variant="danger"
                      className="!py-1.5 !px-3 text-xs"
                      onClick={async () => {
                        if (!confirm("این کد حذف شود؟")) return;
                        await remove.mutateAsync(code.id);
                        showToast("حذف شد");
                      }}
                    >
                      حذف
                    </AdminButton>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isLoading && filtered.length === 0 && (
        <p className="mt-6 text-sm text-[#fffbf5]/60">کد تخفیفی ثبت نشده است.</p>
      )}

      <AdminModal
        open={modal !== null && draft !== null}
        title={modal === "add" ? "کد تخفیف جدید" : "ویرایش کد تخفیف"}
        onClose={() => {
          setModal(null);
          setDraft(null);
        }}
      >
        {draft && (
          <div className="space-y-4">
            <AdminInput
              label="کد"
              value={draft.code}
              onChange={(e) =>
                setDraft({ ...draft, code: e.target.value.toUpperCase() })
              }
              dir="ltr"
              placeholder="KOUBAR10"
            />
            <AdminSelect
              label="نوع تخفیف"
              value={draft.type}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  type: e.target.value as AdminDiscountCode["type"],
                })
              }
            >
              <option value="percent">درصدی</option>
              <option value="fixed">مبلغ ثابت (تومان)</option>
            </AdminSelect>
            <AdminInput
              label={draft.type === "percent" ? "درصد (۱–۱۰۰)" : "مبلغ (تومان)"}
              type="number"
              value={draft.value || ""}
              onChange={(e) =>
                setDraft({ ...draft, value: Number(e.target.value) })
              }
            />
            <AdminInput
              label="حداکثر استفاده (اختیاری)"
              type="number"
              value={draft.maxUsesInput ?? ""}
              onChange={(e) =>
                setDraft({ ...draft, maxUsesInput: e.target.value })
              }
              placeholder="نامحدود"
            />
            <AdminInput
              label="تاریخ انقضا (اختیاری)"
              type="date"
              value={draft.expiresInput ?? ""}
              onChange={(e) =>
                setDraft({ ...draft, expiresInput: e.target.value })
              }
              dir="ltr"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) =>
                  setDraft({ ...draft, active: e.target.checked })
                }
              />
              فعال
            </label>
            <AdminButton onClick={saveCode}>ذخیره</AdminButton>
          </div>
        )}
      </AdminModal>
    </>
  );
}
