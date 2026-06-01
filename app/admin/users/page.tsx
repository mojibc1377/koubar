"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminInput } from "@/components/admin/AdminField";
import { AdminModal } from "@/components/admin/AdminModal";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { initialUsers } from "@/lib/admin/mock-data";
import type { AdminUser } from "@/lib/admin/types";

export default function AdminUsersPage() {
  const [users] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminUser | null>(null);

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name.includes(search) ||
          u.phone.includes(search) ||
          u.address.includes(search),
      ),
    [users, search],
  );

  return (
    <>
      <AdminPageHeader
        title="کاربران"
        description="لیست کاربران ثبت‌نام‌شده با موبایل"
      />

      <AdminInput
        label="جستجو"
        placeholder="نام، موبایل یا آدرس..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 max-w-md"
      />

      <div className="overflow-x-auto rounded-2xl border border-[#fffbf51a]">
        <table className="w-full min-w-[640px] text-right text-sm">
          <thead>
            <tr className="border-b border-[#fffbf51a] text-[#fffbf5]/60">
              <th className="p-4">نام</th>
              <th className="p-4">موبایل</th>
              <th className="p-4">تاریخ عضویت</th>
              <th className="p-4">سفارش‌ها</th>
              <th className="p-4">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <motion.tr
                key={user.id}
                layout
                className="border-b border-[#fffbf50d] hover:bg-[#fffbf508]"
              >
                <td className="p-4 font-semibold">{user.name}</td>
                <td className="p-4 font-mono text-xs" dir="ltr">
                  {user.phone}
                </td>
                <td className="p-4 text-[#fffbf5]/70">{user.joinedAt}</td>
                <td className="p-4">
                  {user.ordersCount.toLocaleString("fa-IR")}
                </td>
                <td className="p-4">
                  <AdminButton
                    variant="secondary"
                    className="!py-1.5 !px-3 !text-xs"
                    onClick={() => setSelected(user)}
                  >
                    جزئیات
                  </AdminButton>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal
        open={selected !== null}
        title="پروفایل کاربر"
        onClose={() => setSelected(null)}
      >
        {selected && (
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-[#fffbf5]/55">نام</dt>
              <dd className="mt-1 font-bold">{selected.name}</dd>
            </div>
            <div>
              <dt className="text-[#fffbf5]/55">موبایل</dt>
              <dd className="mt-1 font-mono" dir="ltr">
                {selected.phone}
              </dd>
            </div>
            <div>
              <dt className="text-[#fffbf5]/55">آدرس</dt>
              <dd className="mt-1">{selected.address}</dd>
            </div>
            <div>
              <dt className="text-[#fffbf5]/55">عضویت</dt>
              <dd className="mt-1">{selected.joinedAt}</dd>
            </div>
            <div>
              <dt className="text-[#fffbf5]/55">تعداد سفارش</dt>
              <dd className="mt-1">{selected.ordersCount.toLocaleString("fa-IR")}</dd>
            </div>
            <AdminButton variant="ghost" onClick={() => setSelected(null)}>
              بستن
            </AdminButton>
          </dl>
        )}
      </AdminModal>
    </>
  );
}
