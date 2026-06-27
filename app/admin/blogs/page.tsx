"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminInput, AdminSelect, AdminTextarea } from "@/components/admin/AdminField";
import { AdminModal } from "@/components/admin/AdminModal";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { useBlogMutations } from "@/hooks/use-admin";
import { useAdminBlogs } from "@/hooks/use-blogs";
import type { AdminBlog } from "@/lib/admin/types";

const emptyBlog = (): AdminBlog => ({
  slug: "",
  title: "",
  excerpt: "",
  image: "/images/hero.png",
  date: "۱۴۰۴/۰۳/۱۰",
  author: "تیم کوبار",
  category: "دانش قهوه",
  readMinutes: 5,
  content: [""],
  blocks: [{ type: "paragraph", text: "" }],
  status: "draft",
});

export default function AdminBlogsPage() {
  const { data: blogs = [], isLoading } = useAdminBlogs();
  const { create, update, remove } = useBlogMutations();
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [draft, setDraft] = useState<AdminBlog | null>(null);
  const [toast, setToast] = useState("");

  const filtered = useMemo(() => {
    if (filter === "all") return blogs;
    return blogs.filter((b) => b.status === filter);
  }, [blogs, filter]);

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2500);
  }

  async function saveBlog() {
    if (!draft?.title.trim()) return;
    const slug =
      draft.slug.trim() ||
      draft.title
        .replace(/\s+/g, "-")
        .slice(0, 40)
        .replace(/[^\w\u0600-\u06FF-]/g, "");
    try {
      const payload = {
        slug,
        title: draft.title,
        excerpt: draft.excerpt,
        image: draft.image,
        author: draft.author,
        category: draft.category,
        readMinutes: draft.readMinutes,
        status: draft.status,
        blocks: draft.blocks,
      };
      if (modal === "add") {
        await create.mutateAsync(payload);
        showToast("مقاله اضافه شد");
      } else {
        const { slug: _newSlug, ...rest } = payload;
        await update.mutateAsync({ slug: draft.slug, ...rest });
        showToast("مقاله ویرایش شد");
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
        title="وبلاگ"
        description="افزودن، ویرایش و حذف مقالات"
        action={
          <AdminButton
            onClick={() => {
              setDraft(emptyBlog());
              setModal("add");
            }}
          >
            + مقاله جدید
          </AdminButton>
        }
      />

      {isLoading && <p className="mb-4 text-sm text-[#fffbf5]/60">در حال بارگذاری…</p>}

      <div className="mb-6 flex flex-wrap gap-2">
        {(["all", "published", "draft"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              filter === f ? "bg-[#575b49]" : "bg-[#fffbf50d] text-[#fffbf5]/70"
            }`}
          >
            {f === "all" ? "همه" : f === "published" ? "منتشرشده" : "پیش‌نویس"}
          </button>
        ))}
      </div>

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

      <ul className="space-y-3">
        {filtered.map((blog) => (
          <motion.li
            key={blog.slug}
            layout
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#fffbf51a] bg-[#3d3d3a] p-5"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold">{blog.title}</h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    blog.status === "published"
                      ? "bg-emerald-900/40 text-emerald-200"
                      : "bg-amber-900/40 text-amber-200"
                  }`}
                >
                  {blog.status === "published" ? "منتشر" : "پیش‌نویس"}
                </span>
              </div>
              <p className="mt-1 line-clamp-1 text-sm text-[#fffbf5]/60">{blog.excerpt}</p>
              <p className="mt-2 text-xs text-[#fffbf5]/45">
                {blog.category} · {blog.date} · {blog.readMinutes} دقیقه
              </p>
            </div>
            <div className="flex gap-2">
              <AdminButton
                variant="secondary"
                className="!text-xs"
                onClick={() => {
                  setDraft({ ...blog, status: blog.status ?? "draft" });
                  setModal("edit");
                }}
              >
                ویرایش
              </AdminButton>
              <AdminButton
                variant="danger"
                className="!text-xs"
                onClick={() => {
                  if (confirm("مقاله حذف شود؟")) {
                    void remove.mutateAsync(blog.slug).then(() =>
                      showToast("مقاله حذف شد"),
                    );
                  }
                }}
              >
                حذف
              </AdminButton>
            </div>
          </motion.li>
        ))}
      </ul>

      <AdminModal
        open={modal !== null && draft !== null}
        title={modal === "add" ? "مقاله جدید" : "ویرایش مقاله"}
        onClose={() => {
          setModal(null);
          setDraft(null);
        }}
        wide
      >
        {draft && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <AdminInput
                label="عنوان"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </div>
            <AdminInput
              label="تصویر (مسیر)"
              value={draft.image}
              onChange={(e) => setDraft({ ...draft, image: e.target.value })}
              dir="ltr"
            />
            <AdminInput
              label="اسلاگ (URL)"
              value={draft.slug}
              onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
              dir="ltr"
            />
            <AdminSelect
              label="وضعیت"
              value={draft.status}
              onChange={(e) =>
                setDraft({ ...draft, status: e.target.value as AdminBlog["status"] })
              }
            >
              <option value="published">منتشرشده</option>
              <option value="draft">پیش‌نویس</option>
            </AdminSelect>
            <AdminInput
              label="دسته"
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            />
            <AdminInput
              label="نویسنده"
              value={draft.author}
              onChange={(e) => setDraft({ ...draft, author: e.target.value })}
            />
            <AdminInput
              label="تاریخ"
              value={draft.date}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
            />
            <AdminInput
              label="زمان مطالعه (دقیقه)"
              type="number"
              value={draft.readMinutes}
              onChange={(e) => setDraft({ ...draft, readMinutes: Number(e.target.value) })}
            />
            <div className="sm:col-span-2">
              <AdminTextarea
                label="خلاصه"
                value={draft.excerpt}
                onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <AdminTextarea
                label="متن (هر پاراگراف در یک خط)"
                value={draft.content.join("\n\n")}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    content: e.target.value.split(/\n\n+/).filter(Boolean),
                  })
                }
                className="min-h-[160px]"
              />
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <AdminButton onClick={saveBlog}>ذخیره</AdminButton>
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
