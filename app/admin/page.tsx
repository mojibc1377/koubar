"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { adminNav } from "@/lib/admin/nav";
import { useAdminStats } from "@/hooks/use-admin";
import { formatPrice } from "@/lib/format";

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminStats();

  const cards = [
    { label: "درآمد امروز", value: formatPrice(stats?.revenueToday ?? 0) },
    {
      label: "سفارش‌های امروز",
      value: (stats?.ordersToday ?? 0).toLocaleString("fa-IR"),
    },
    {
      label: "کاربران",
      value: (stats?.usersTotal ?? 0).toLocaleString("fa-IR"),
    },
    {
      label: "مقالات منتشرشده",
      value: (stats?.blogsPublished ?? 0).toLocaleString("fa-IR"),
    },
  ];

  const recent = stats?.recentOrders ?? [];

  return (
    <>
      <AdminPageHeader
        title="داشبورد"
        description="نمای کلی فروشگاه، کافه و محتوا"
      />

      {isLoading && <p className="text-sm text-[#fffbf5]/60">در حال بارگذاری…</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            className="rounded-2xl border border-[#fffbf51a] bg-[#3d3d3a] p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <p className="text-xs text-[#fffbf5]/60">{card.label}</p>
            <p className="mt-2 text-2xl font-extrabold">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#fffbf51a] bg-[#3d3d3a] p-5">
          <h2 className="font-bold">دسترسی سریع</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {adminNav.slice(1).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-xl border border-[#fffbf52e] px-4 py-3 text-sm transition hover:bg-[#575b49]/40"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#fffbf51a] bg-[#3d3d3a] p-5">
          <h2 className="font-bold">آخرین سفارش‌ها</h2>
          <ul className="mt-4 space-y-3">
            {recent.map((order) => (
              <li
                key={order.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-[#fffbf51a] px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold">{order.id}</p>
                  <p className="text-xs text-[#fffbf5]/55">
                    {order.type === "shop" ? "رستری" : "کافه"} · {order.customerName}
                  </p>
                </div>
                <span className="font-bold">{formatPrice(order.total)}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/admin/orders"
            className="mt-4 inline-block text-sm text-[#fffbf5]/70 underline"
          >
            مشاهده همه سفارش‌ها
          </Link>
        </section>
      </div>
    </>
  );
}
