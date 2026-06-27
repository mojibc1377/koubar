"use client";

import { motion } from "framer-motion";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { useAdminStaffLeaderboard } from "@/hooks/use-admin";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0]!.charAt(0)}${parts[1]!.charAt(0)}`;
  }
  return name.slice(0, 2);
}

function Stars({ value }: { value: number }) {
  return (
    <span className="text-amber-300" aria-label={`${value} ستاره`}>
      {"★".repeat(Math.round(value))}
      <span className="text-[#fffbf5]/25">
        {"★".repeat(Math.max(0, 5 - Math.round(value)))}
      </span>
    </span>
  );
}

export default function AdminStaffPage() {
  const { data: staff = [], isLoading } = useAdminStaffLeaderboard();

  return (
    <>
      <AdminPageHeader
        title="امتیاز پرسنل"
        description="رتبه‌بندی و نظرات مشتریان درباره پرسنل کافه"
      />

      {isLoading && (
        <p className="text-sm text-[#fffbf5]/60">در حال بارگذاری…</p>
      )}

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {staff.map((member, i) => (
          <motion.article
            key={member.id}
            className="flex flex-col rounded-2xl border border-[#fffbf51a] bg-[#3d3d3a] p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#575b49] text-lg font-extrabold">
                {initials(member.name)}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-bold">{member.name}</h2>
                <p className="text-sm text-[#fffbf5]/60">{member.role}</p>
                {!member.active && (
                  <span className="mt-1 inline-block rounded-full bg-red-900/40 px-2 py-0.5 text-xs text-red-200">
                    غیرفعال
                  </span>
                )}
              </div>
            </div>

            <dl className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
              <div className="rounded-xl border border-[#fffbf51a] px-2 py-3">
                <dt className="text-xs text-[#fffbf5]/55">امتیاز پرسنل</dt>
                <dd className="mt-1 font-extrabold">
                  {member.avgStaffStars.toLocaleString("fa-IR")}
                </dd>
                <dd className="mt-1 text-xs">
                  <Stars value={member.avgStaffStars} />
                </dd>
              </div>
              <div className="rounded-xl border border-[#fffbf51a] px-2 py-3">
                <dt className="text-xs text-[#fffbf5]/55">امتیاز محصول</dt>
                <dd className="mt-1 font-extrabold">
                  {member.avgFoodStars.toLocaleString("fa-IR")}
                </dd>
                <dd className="mt-1 text-xs">
                  <Stars value={member.avgFoodStars} />
                </dd>
              </div>
              <div className="rounded-xl border border-[#fffbf51a] px-2 py-3">
                <dt className="text-xs text-[#fffbf5]/55">تعداد نظر</dt>
                <dd className="mt-1 text-xl font-extrabold">
                  {member.totalReviews.toLocaleString("fa-IR")}
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex min-h-0 flex-1 flex-col">
              <h3 className="text-sm font-semibold text-[#fffbf5]/80">
                آخرین نظرات
              </h3>
              {member.recentComments.length === 0 ? (
                <p className="mt-3 text-sm text-[#fffbf5]/45">هنوز نظری ثبت نشده</p>
              ) : (
                <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-1">
                  {member.recentComments.map((item, idx) => (
                    <li
                      key={`${item.date}-${idx}`}
                      className="rounded-xl border border-[#fffbf51a] px-3 py-2.5 text-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{item.userName}</span>
                        <span className="text-xs text-[#fffbf5]/50">{item.date}</span>
                      </div>
                      {item.comment ? (
                        <p className="mt-1.5 text-[#fffbf5]/75">{item.comment}</p>
                      ) : (
                        <p className="mt-1.5 text-[#fffbf5]/45 italic">بدون متن</p>
                      )}
                      <p className="mt-1.5 text-xs text-[#fffbf5]/55">
                        پرسنل: {item.staffStars.toLocaleString("fa-IR")} · محصول:{" "}
                        {item.foodStars.toLocaleString("fa-IR")}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.article>
        ))}
      </div>

      {!isLoading && staff.length === 0 && (
        <p className="text-sm text-[#fffbf5]/60">پرسنلی ثبت نشده است.</p>
      )}
    </>
  );
}
