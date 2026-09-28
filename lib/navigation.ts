import type { PlatformMode } from "./types";

export const shopNav = [
  { href: "/products", label: "محصولات" },
  { href: "/accessories", label: "اکسسوری‌ها" },
  { href: "/blog", label: "وبلاگ" },
  { href: "/contact", label: "تماس با ما" },
  { href: "/jobopportunities", label: "همکاری با ما" },

] as const;

export const cafeNav = [
  { href: "/cafe#espresso", label: "اسپرسو" },
  { href: "/cafe#brew", label: "دم‌آوری" },
  { href: "/cafe#hotDrinks", label: "گرم" },
  { href: "/cafe#smoothie", label: "اسموتی" },
  { href: "/cafe#shake", label: "شیک" },
  { href: "/cafe#matcha", label: "ماچا" },
  { href: "/cafe#special", label: "اسپشیال" },
  { href: "/contact", label: "تماس" },
  { href: "/jobopportunities", label: "همکاری با ما" },

] as const;

export function getNavLinks(mode: PlatformMode) {
  return mode === "cafe" ? cafeNav : shopNav;
}
