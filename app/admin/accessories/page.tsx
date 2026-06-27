"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminInput, AdminTextarea } from "@/components/admin/AdminField";
import { AdminModal } from "@/components/admin/AdminModal";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { useAdminAccessories, useAccessoryMutations } from "@/hooks/use-admin";
import type { AccessoryItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";

const emptyItem = (): AccessoryItem => ({
  id: `acc-${Date.now()}`,
  title: "",
  description: "",
  image: "/images/hero.png",
  price: 0,
  category: "عمومی",
});

export default function AdminAccessoriesPage() {
  const { data: items = [], isLoading } = useAdminAccessories();
  const { create, update, remove } = useAccessoryMutations();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [draft, setDraft] = useState<AccessoryItem | null>(null);
  const [toast, setToast] = useState("");

  const filtered = useMemo(
    () => items.filter((i) => i.title.includes(search) || i.category.includes(search)),
    [items, search],
  );

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2500);
  }

  async function saveItem() {
    if (!draft?.title.trim()) return;
    try {
      const body = {
        slug: draft.id,
        title: draft.title,
        description: draft.description,
        price: draft.price,
        category: draft.category,
        image: draft.image,
        badge: draft.badge,
      };
      if (modal === "add") {
        await create.mutateAsync(body);
        showToast("اکسسوری اضافه شد");
      } else {
        const { slug: _s, ...rest } = body;
        await update.mutateAsync({ slug: draft.id, ...rest });
        showToast("ویرایش شد");
      }
      setModal(null);
      setDraft(null);
    } catch {
      showToast("خطا در ذخیره");
    }
  }

  return (
    <>
      <AdminPageHeader
        title="اکسسوری‌ها"
        description="مدیریت تجهیزات و لوازم جانبی فروشگاه"
        action={
          <AdminButton
            onClick={() => {
              setDraft(emptyItem());
              setModal("add");
            }}
          >
            + آیتم جدید
          </AdminButton>
        }
      />

      {isLoading && <p className="mb-4 text-sm text-[#fffbf5]/60">در حال بارگذاری…</p>}

      <AdminInput
        label="جستجو"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => (
          <motion.article
            key={item.id}
            layout
            className="rounded-2xl border border-[#fffbf51a] bg-[#3d3d3a] p-5"
          >
            <h3 className="font-bold">{item.title}</h3>
            <p className="mt-2 text-xs text-[#fffbf5]/60">{item.category}</p>
            <p className="mt-4 text-lg font-extrabold">{formatPrice(item.price)}</p>
            <div className="mt-4 flex gap-2">
              <AdminButton
                variant="secondary"
                className="flex-1 !text-xs"
                onClick={() => {
                  setDraft({ ...item });
                  setModal("edit");
                }}
              >
                ویرایش
              </AdminButton>
              <AdminButton
                variant="danger"
                className="!text-xs"
                onClick={async () => {
                  if (confirm("حذف شود؟")) {
                    await remove.mutateAsync(item.id);
                    showToast("حذف شد");
                  }
                }}
              >
                حذف
              </AdminButton>
            </div>
          </motion.article>
        ))}
      </div>

      <AdminModal
        open={modal !== null && draft !== null}
        title={modal === "add" ? "اکسسوری جدید" : "ویرایش"}
        onClose={() => {
          setModal(null);
          setDraft(null);
        }}
      >
        {draft && (
          <div className="space-y-4">
            {modal === "add" && (
              <AdminInput
                label="شناسه (slug)"
                value={draft.id}
                onChange={(e) => setDraft({ ...draft, id: e.target.value })}
              />
            )}
            <AdminInput
              label="عنوان"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
            <AdminInput
              label="دسته"
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            />
            <AdminInput
              label="قیمت"
              type="number"
              value={draft.price || ""}
              onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
            />
            <AdminTextarea
              label="توضیحات"
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
            <AdminButton onClick={saveItem}>ذخیره</AdminButton>
          </div>
        )}
      </AdminModal>
    </>
  );
}
