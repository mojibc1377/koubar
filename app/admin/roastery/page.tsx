"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminInput, AdminSelect, AdminTextarea } from "@/components/admin/AdminField";
import { AdminModal } from "@/components/admin/AdminModal";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { useAdminRoastery, useRoasteryMutations } from "@/hooks/use-admin";
import type { AdminRoasteryProduct } from "@/lib/admin/types";
import { formatPrice } from "@/lib/format";

const emptyProduct = (): AdminRoasteryProduct => ({
  id: `prod-${Date.now()}`,
  title: "",
  description: "",
  price: 0,
  variant: "african",
  inStock: true,
});

export default function AdminRoasteryPage() {
  const { data: products = [], isLoading } = useAdminRoastery();
  const { create, update, remove } = useRoasteryMutations();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [draft, setDraft] = useState<AdminRoasteryProduct | null>(null);
  const [toast, setToast] = useState("");

  const filtered = useMemo(
    () => products.filter((p) => p.title.includes(search) || p.description.includes(search)),
    [products, search],
  );

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2500);
  }

  async function saveProduct() {
    if (!draft?.title.trim()) return;
    try {
      if (modal === "add") {
        await create.mutateAsync({
          slug: draft.id,
          title: draft.title,
          description: draft.description,
          price: draft.price,
          badge: draft.badge,
          variant: draft.variant,
          inStock: draft.inStock,
        });
        showToast("محصول اضافه شد");
      } else {
        await update.mutateAsync({
          slug: draft.id,
          title: draft.title,
          description: draft.description,
          price: draft.price,
          badge: draft.badge,
          variant: draft.variant,
          inStock: draft.inStock,
        });
        showToast("محصول ویرایش شد");
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
        title="محصولات رستری"
        description="مدیریت دانه‌ها و محصولات فروشگاه آنلاین"
        action={
          <AdminButton
            onClick={() => {
              setDraft(emptyProduct());
              setModal("add");
            }}
          >
            + محصول جدید
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
        {filtered.map((product) => (
          <motion.article
            key={product.id}
            layout
            className="rounded-2xl border border-[#fffbf51a] bg-[#3d3d3a] p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold leading-7">{product.title}</h3>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${
                  product.inStock
                    ? "bg-emerald-900/40 text-emerald-200"
                    : "bg-red-900/40 text-red-200"
                }`}
              >
                {product.inStock ? "موجود" : "ناموجود"}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-xs text-[#fffbf5]/60">{product.description}</p>
            <p className="mt-4 text-lg font-extrabold">{formatPrice(product.price)}</p>
            <div className="mt-4 flex gap-2">
              <AdminButton
                variant="secondary"
                className="flex-1 !text-xs"
                onClick={() => {
                  setDraft({ ...product });
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
                    await remove.mutateAsync(product.id);
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
        title={modal === "add" ? "محصول جدید" : "ویرایش محصول"}
        onClose={() => {
          setModal(null);
          setDraft(null);
        }}
        wide
      >
        {draft && (
          <div className="grid gap-4 sm:grid-cols-2">
            {modal === "add" && (
              <div className="sm:col-span-2">
                <AdminInput
                  label="شناسه (slug)"
                  value={draft.id}
                  onChange={(e) => setDraft({ ...draft, id: e.target.value })}
                />
              </div>
            )}
            <div className="sm:col-span-2">
              <AdminInput
                label="عنوان"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </div>
            <AdminInput
              label="قیمت"
              type="number"
              value={draft.price || ""}
              onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
            />
            <AdminSelect
              label="نوع نمایش"
              value={draft.variant}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  variant: e.target.value as AdminRoasteryProduct["variant"],
                })
              }
            >
              <option value="african">african</option>
              <option value="kenya">kenya</option>
              <option value="street">street</option>
            </AdminSelect>
            <AdminInput
              label="نشان"
              value={draft.badge ?? ""}
              onChange={(e) => setDraft({ ...draft, badge: e.target.value || undefined })}
            />
            <AdminSelect
              label="موجودی"
              value={draft.inStock ? "yes" : "no"}
              onChange={(e) => setDraft({ ...draft, inStock: e.target.value === "yes" })}
            >
              <option value="yes">موجود</option>
              <option value="no">ناموجود</option>
            </AdminSelect>
            <div className="sm:col-span-2">
              <AdminTextarea
                label="توضیحات"
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <AdminButton onClick={saveProduct}>ذخیره</AdminButton>
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
