"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminButton } from "@/components/admin/AdminButton";
import {
  AdminInput,
  AdminSelect,
  AdminTextarea,
} from "@/components/admin/AdminField";
import { AdminModal } from "@/components/admin/AdminModal";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminImageField } from "@/components/admin/AdminImageField";
import { useAdminCafe, useCafeMutations } from "@/hooks/use-admin";
import type { AdminCafeItem } from "@/lib/admin/types";
import { formatPrice } from "@/lib/format";

const categories = [
  { id: "espresso", name: "اسپرسو" },
  { id: "matcha", name: "ماچا بار" },
  { id: "brew", name: "دم‌آوری" },
  { id: "cold-gas", name: "نوشیدنی سرد گازدار" },
  { id: "hotDrinks", name: "نوشیدبنی گرم" },
  { id: "shake", name: "شیک" },
  { id: "smoothie", name: "اسموتی" },
  { id: "special", name: "اسپشیالیتی" },
  { id: "desserts", name: "دسر ها" },
];

const emptyItem = (): AdminCafeItem => ({
  id: `new-${Date.now()}`,
  categoryId: "espresso",
  categoryName: "اسپرسو",
  name: "",
  description: "",
  image: "/images/hero.png",
  price: 0,
  active: true,
  dualCoffeePricing: false,
  priceSecondary: undefined,
  linePrimaryLabel: "",
  lineSecondaryLabel: "",
  notes: [],
});

// Small inline switch — matches the site's palette, no extra import needed.
function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2"
    >
      {label && <span className="text-sm text-[#fffbf5]/80">{label}</span>}
      <span
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-[#8a9a6b]" : "bg-[#fffbf51a]"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-[#fffbf5] transition-transform ${
            checked ? "translate-x-[-22px]" : "translate-x-[-2px]"
          }`}
        />
      </span>
    </button>
  );
}

export default function AdminCafeMenuPage() {
  const { data: items = [], isLoading } = useAdminCafe();
  const { create, update, remove } = useCafeMutations();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [draft, setDraft] = useState<AdminCafeItem | null>(null);
  const [noteInput, setNoteInput] = useState("");
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
    setDraft({ ...item, notes: item.notes ?? [] });
    setModal("edit");
  }

  function buildPayload(item: AdminCafeItem) {
    return {
      slug: item.id,
      name: item.name,
      description: item.description,
      longDescription: item.longDescription,
      price: item.price,
      image: item.image ?? "/images/hero.png",
      categoryId: item.categoryId,
      badge: item.badge,
      active: item.active,
      dualCoffeePricing: item.dualCoffeePricing,
      priceSecondary: item.dualCoffeePricing ? item.priceSecondary ?? 0 : null,
      linePrimaryLabel: item.linePrimaryLabel || null,
      lineSecondaryLabel: item.dualCoffeePricing
        ? item.lineSecondaryLabel || null
        : null,
      notes: item.notes ?? [],
    };
  }

  async function saveItem() {
    if (!draft?.name.trim()) return;
    try {
      if (modal === "add") {
        await create.mutateAsync(buildPayload(draft));
        showToast("آیتم اضافه شد");
      } else {
        await update.mutateAsync(buildPayload(draft));
        showToast("آیتم ویرایش شد");
      }
      setModal(null);
      setDraft(null);
      setNoteInput("");
    } catch {
      showToast("خطا در ذخیره");
    }
  }

  async function deleteItem(id: string) {
    if (!confirm("این آیتم حذف شود؟")) return;
    await remove.mutateAsync(id);
    showToast("حذف شد");
  }

  async function toggleActive(item: AdminCafeItem) {
    try {
      await update.mutateAsync(buildPayload({ ...item, active: !item.active }));
      showToast(!item.active ? "آیتم فعال شد" : "آیتم غیرفعال شد");
    } catch {
      showToast("خطا در تغییر وضعیت");
    }
  }

  function addNote() {
    const val = noteInput.trim();
    if (!val || !draft) return;
    if ((draft.notes ?? []).includes(val)) {
      setNoteInput("");
      return;
    }
    setDraft({ ...draft, notes: [...(draft.notes ?? []), val] });
    setNoteInput("");
  }

  function removeNote(note: string) {
    if (!draft) return;
    setDraft({ ...draft, notes: (draft.notes ?? []).filter((n) => n !== note) });
  }

  return (
    <>
      <AdminPageHeader
        title="منوی کافه"
        description="افزودن، ویرایش و حذف نوشیدنی‌ها و آیتم‌های منو"
        action={<AdminButton onClick={openAdd}>+ آیتم جدید</AdminButton>}
      />

      {isLoading && (
        <p className="mb-4 text-sm text-[#fffbf5]/60">در حال بارگذاری…</p>
      )}

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
        <table className="w-full min-w-[820px] text-right text-sm">
          <thead>
            <tr className="border-b border-[#fffbf51a] text-[#fffbf5]/60">
              <th className="p-4 font-medium">نام</th>
              <th className="p-4 font-medium">دسته</th>
              <th className="p-4 font-medium">قیمت</th>
              <th className="p-4 font-medium">نشان</th>
              <th className="p-4 font-medium">فعال</th>
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
                <td className="p-4 font-semibold">
                  {item.name}
                  {item.dualCoffeePricing && (
                    <span className="ml-2 rounded-full bg-[#fffbf51a] px-2 py-0.5 text-[10px] text-[#fffbf5]/70">
                      دو قیمتی
                    </span>
                  )}
                </td>
                <td className="p-4 text-[#fffbf5]/70">{item.categoryName}</td>
                <td className="p-4">
                  {formatPrice(item.price)}
                  {item.dualCoffeePricing && item.priceSecondary != null && (
                    <span className="block text-xs text-[#fffbf5]/50">
                      {formatPrice(item.priceSecondary)}
                    </span>
                  )}
                </td>
                <td className="p-4">{item.badge ?? "—"}</td>
                <td className="p-4">
                  <Toggle checked={item.active} onChange={() => toggleActive(item)} />
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <AdminButton
                      variant="secondary"
                      className="!py-1.5 !px-3 text-xs"
                      onClick={() => openEdit(item)}
                    >
                      ویرایش
                    </AdminButton>
                    <AdminButton
                      variant="danger"
                      className="!py-1.5 !px-3 text-xs"
                      onClick={() => deleteItem(item.id)}
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

      <AdminModal
        open={modal !== null && draft !== null}
        title={modal === "add" ? "افزودن آیتم کافه" : "ویرایش آیتم کافه"}
        onClose={() => {
          setModal(null);
          setDraft(null);
          setNoteInput("");
        }}
        wide
      >
        {draft && (
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput
              label="نام"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
            <AdminSelect
              label="دسته"
              value={draft.categoryId}
              onChange={(e) =>
                setDraft({ ...draft, categoryId: e.target.value })
              }
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
              onChange={(e) =>
                setDraft({ ...draft, price: Number(e.target.value) })
              }
            />
            <AdminInput
              label="نشان (اختیاری)"
              value={draft.badge ?? ""}
              onChange={(e) =>
                setDraft({ ...draft, badge: e.target.value || undefined })
              }
            />

            <div className="sm:col-span-2">
              <AdminTextarea
                label="توضیح کوتاه"
                value={draft.description}
                onChange={(e) =>
                  setDraft({ ...draft, description: e.target.value })
                }
              />
            </div>
            <div className="sm:col-span-2">
              <AdminTextarea
                label="توضیح کامل"
                value={draft.longDescription ?? ""}
                onChange={(e) =>
                  setDraft({ ...draft, longDescription: e.target.value })
                }
              />
            </div>
            <div className="sm:col-span-2">
              <AdminImageField
                value={draft.image ?? "/images/hero.png"}
                onChange={(image) => setDraft({ ...draft, image })}
              />
            </div>

            {/* Status + dual pricing toggles */}
            <div className="flex items-center justify-between rounded-xl border border-[#fffbf51a] p-4">
              <Toggle
                checked={draft.active}
                onChange={(v) => setDraft({ ...draft, active: v })}
                label="فعال باشد"
              />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[#fffbf51a] p-4">
              <Toggle
                checked={draft.dualCoffeePricing}
                onChange={(v) =>
                  setDraft({
                    ...draft,
                    dualCoffeePricing: v,
                    priceSecondary: v ? draft.priceSecondary : undefined,
                    lineSecondaryLabel: v ? draft.lineSecondaryLabel : undefined,
                  })
                }
                label="قیمت‌گذاری دوگانه"
              />
            </div>

            <AdminInput
              label="برچسب خط اول"
              placeholder="مثلاً: بار سرد"
              value={draft.linePrimaryLabel ?? ""}
              onChange={(e) =>
                setDraft({ ...draft, linePrimaryLabel: e.target.value || undefined })
              }
            />

            {draft.dualCoffeePricing && (
              <>
                <AdminInput
                  label="قیمت دوم (تومان)"
                  type="number"
                  value={draft.priceSecondary ?? ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      priceSecondary: Number(e.target.value),
                    })
                  }
                />
                <AdminInput
                  label="برچسب خط دوم"
                  placeholder="مثلاً: بار گرم"
                  value={draft.lineSecondaryLabel ?? ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      lineSecondaryLabel: e.target.value || undefined,
                    })
                  }
                />
              </>
            )}

            {/* Notes array editor */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm text-[#fffbf5]/70">
                یادداشت‌ها
              </label>
              <div className="mb-2 flex flex-wrap gap-2">
                {(draft.notes ?? []).map((note) => (
                  <span
                    key={note}
                    className="flex items-center gap-1 rounded-full bg-[#fffbf51a] px-3 py-1 text-xs"
                  >
                    {note}
                    <button
                      type="button"
                      onClick={() => removeNote(note)}
                      className="text-[#fffbf5]/60 hover:text-[#fffbf5]"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {(draft.notes ?? []).length === 0 && (
                  <span className="text-xs text-[#fffbf5]/40">
                    یادداشتی ثبت نشده
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <AdminInput
                  placeholder="یادداشت جدید..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addNote();
                    }
                  }}
                  className="flex-1"
                />
                <AdminButton
                  variant="secondary"
                  className="!py-1.5 !px-4 text-xs"
                  onClick={addNote}
                >
                  افزودن
                </AdminButton>
              </div>
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