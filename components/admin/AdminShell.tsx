"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { AppIcon } from "@/components/AppIcon";
import { BrandLogo } from "@/components/BrandLogo";
import { adminNav } from "@/lib/admin/mock-data";
import { spring } from "@/lib/motion";

const iconMap = {
  dashboard: "shop" as const,
  cafe: "cafe" as const,
  beans: "beans" as const,
  blog: "blog" as const,
  order: "order" as const,
  profile: "profile" as const,
};

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div
      data-admin="true"
      className="min-h-screen bg-[#2a2a28] text-[#fffbf5]"
      dir="rtl"
    >
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-l border-[#fffbf51a] bg-[#343434] lg:flex">
          <div className="border-b border-[#fffbf51a] p-5">
            <BrandLogo variant="farsi" className="brand-logo" />
            <p className="mt-3 text-xs text-[#fffbf5]/60">پنل مدیریت کوبار</p>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {adminNav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "text-[#fffbf5]"
                      : "text-[#fffbf5]/65 hover:bg-[#fffbf50d] hover:text-[#fffbf5]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="admin-nav-active"
                      className="absolute inset-0 rounded-xl bg-[#575b49]"
                      transition={spring}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-3">
                    <AppIcon name={iconMap[item.icon]} size={20} tone="olive" />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-[#fffbf51a] p-4">
            <Link
              href="/"
              className="block rounded-xl border border-[#fffbf52e] px-4 py-2.5 text-center text-xs text-[#fffbf5]/80 transition hover:bg-[#fffbf50d]"
            >
              بازگشت به سایت
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-[#fffbf51a] bg-[#343434]/95 px-4 py-4 backdrop-blur-md lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="lg:hidden">
                <BrandLogo variant="farsi" className="brand-logo max-w-[72px]" />
              </div>
              <p className="rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-xs text-amber-200">
                UI دمو — داده‌ها موقت و در مرورگر ذخیره نمی‌شوند
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="hidden sm:inline text-[#fffbf5]/60">مدیر سیستم</span>
                <span className="rounded-full bg-[#575b49] px-3 py-1 text-xs font-bold">
                  ادمین
                </span>
              </div>
            </div>
            <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {adminNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                    pathname === item.href
                      ? "bg-[#575b49] text-[#fffbf5]"
                      : "bg-[#fffbf50d] text-[#fffbf5]/70"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>
          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
