"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminInput, AdminSelect, AdminTextarea } from "@/components/admin/AdminField";
import { AdminModal } from "@/components/admin/AdminModal";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { useAdminCafe, useCafeMutations } from "@/hooks/use-admin";
import type { AdminCafeItem } from "@/lib/admin/types";
import { formatPrice } from "@/lib/format";

const categories = [
  { id: "espresso", name: "اسپرسو" },
  { id: "milk", name: "شیر و لاته" },
  { id: "brew", name: "دم‌آوری" },
  { id: "cold", name: "سرد" },
];

const emptyItem = (): AdminCafeItem => ({
  id: `new-${Date.now()}`,
  categoryId: "espresso",
  categoryName: "اسپرسو",
  name: "",
  description: "",
  price: 0,
});

export default function AdminCafeMenuPage() {
  const { data: items = [], isLoading } = useAdminCafe();
  const { create, update, remove } = useCafeMutations();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [draft, setDraft] = useState<AdminCafeItem | null>(null);
  const [toast, setToast] = useState("");

  const filtered = useMemo(
    () =>
      items.filter(
        (i) =>
          i.name.includes(search) ||
          i.categoryName.includes(search) ||
          i.description.includes(search),
      ),
    [items, search],
  );

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2500);
  }

  function openAdd() {
    setDraft(emptyItem());
    setModal("add");
  }

  function openEdit(item: AdminCafeItem) {
    setDraft({ ...item });
    setModal("edit");
  }

  async function saveItem() {
    if (!draft?.name.trim()) return;
    try {
      if (modal === "add") {
        await create.mutateAsync({
          slug: draft.id,
          name: draft.name,
          description: draft.description,
          price: draft.price,
          categoryId: draft.categoryId,
          badge: draft.badge,
        });
        showToast("آیتم اضافه شد");
      } else {
        await update.mutateAsync({
          slug: draft.id,
          name: draft.name,
          description: draft.description,
          price: draft.price,
          categoryId: draft.categoryId,
          badge: draft.badge,
        });
        showToast("آیتم ویرایش شد");
      }
      setModal(null);
      setDraft(null);
    } catch {
      showToast("خطا در ذخیره");
    }
  }

  async function deleteItem(id: string) {
    if (!confirm("این آیتم حذف شود؟")) return;
    await remove.mutateAsync(id);
    showToast("حذف شد");
  }

  return (
    <>
      <AdminPageHeader
        title="منوی کافه"
        description="افزودن، ویرایش و حذف نوشیدنی‌ها و آیتم‌های منو"
        action={<AdminButton onClick={openAdd}>+ آیتم جدید</AdminButton>}
      />

      {isLoading && <p className="mb-4 text-sm text-[#fffbf5]/60">در حال بارگذاری…</p>}

      <AdminInput
        label="جستجو"
        placeholder="نام، دسته یا توضیح..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 max-w-md"
      />

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

      <div className="overflow-x-auto rounded-2xl border border-[#fffbf51a]">
        <table className="w-full min-w-[720px] text-right text-sm">
          <thead>
            <tr className="border-b border-[#fffbf51a] text-[#fffbf5]/60">
              <th className="p-4 font-medium">نام</th>
              <th className="p-4 font-medium">دسته</th>
              <th className="p-4 font-medium">قیمت</th>
              <th className="p-4 font-medium">نشان</th>
              <th className="p-4 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <motion.tr
                key={item.id}
                layout
                className="border-b border-[#fffbf50d] hover:bg-[#fffbf508]"
              >
                <td className="p-4 font-semibold">{item.name}</td>
                <td className="p-4 text-[#fffbf5]/70">{item.categoryName}</td>
                <td className="p-4">{formatPrice(item.price)}</td>
                <td className="p-4">{item.badge ?? "—"}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <AdminButton variant="secondary" className="!py-1.5 !px-3 text-xs" onClick={() => openEdit(item)}>
                      ویرایش
                    </AdminButton>
                    <AdminButton variant="danger" className="!py-1.5 !px-3 text-xs" onClick={() => deleteItem(item.id)}>
                      حذف
                    </AdminButton>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal
        open={modal !== null && draft !== null}
        title={modal === "add" ? "افزودن آیتم کافه" : "ویرایش آیتم کافه"}
        onClose={() => {
          setModal(null);
          setDraft(null);
        }}
        wide
      >
        {draft && (
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput label="نام" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            <AdminSelect
              label="دسته"
              value={draft.categoryId}
              onChange={(e) => setDraft({ ...draft, categoryId: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </AdminSelect>
            <AdminInput
              label="قیمت (تومان)"
              type="number"
              value={draft.price || ""}
              onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
            />
            <AdminInput
              label="نشان (اختیاری)"
              value={draft.badge ?? ""}
              onChange={(e) => setDraft({ ...draft, badge: e.target.value || undefined })}
            />
            <div className="sm:col-span-2">
              <AdminTextarea
                label="توضیح کوتاه"
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <AdminTextarea
                label="توضیح کامل"
                value={draft.longDescription ?? ""}
                onChange={(e) => setDraft({ ...draft, longDescription: e.target.value })}
              />
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <AdminButton onClick={saveItem}>ذخیره</AdminButton>
              <AdminButton variant="ghost" onClick={() => setModal(null)}>
                انصراف
              </AdminButton>
            </div>
          </div>
        )}
      </AdminModal>
    </>
  );
}
