import type { PlatformMode } from "./types";

export const shopNav = [
  { href: "/products", label: "محصولات" },
  { href: "/accessories", label: "اکسسوری‌ها" },
  { href: "/knowledge", label: "دانش قهوه" },
  { href: "/blog", label: "وبلاگ" },
  { href: "/contact", label: "تماس با ما" },
] as const;

export const cafeNav = [
  { href: "/cafe", label: "منو" },
  { href: "/cafe#espresso", label: "اسپرسو" },
  { href: "/cafe#brew", label: "دم‌آوری" },
  { href: "/contact", label: "تماس" },
] as const;

export function getNavLinks(mode: PlatformMode) {
  return mode === "cafe" ? cafeNav : shopNav;
}
