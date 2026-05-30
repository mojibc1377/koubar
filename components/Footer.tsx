import Link from "next/link";
import { BrandLogo } from "./BrandLogo";

const productLinks = [
  { href: "/products", label: "اسپشیالتی" },
  { href: "/products?cat=african", label: "آفریقایی" },
  { href: "/products?cat=american", label: "آمریکایی" },
  { href: "/products?cat=blend", label: "ترکیبی" },
  { href: "/products?cat=decaf", label: "دی کف" },
];

const ecosystemLinks = [
  { href: "/about", label: "رستری قهوه تخصصی" },
  { href: "/knowledge", label: "راهنمای خرید قهوه" },
  { href: "/accessories", label: "اکسسوری‌ها" },
  { href: "/blog", label: "دانش قهوه" },
];

const companyLinks = [
  { href: "/products", label: "لیست قیمت" },
  { href: "/about", label: "درباره ما" },
  { href: "/blog", label: "وبلاگ" },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="mb-5 text-sm font-bold text-foreground">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="text-sm text-muted transition hover:text-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-border bg-card-elevated pb-12 pt-4"
    >
        <div className="mb-10 overflow-hidden border-b border-border">
          <div className="cafe-footer-marquee text-base font-light">
            <span>AURORA CAFÉ · RIVERSIDE · SLOW BREWED STORIES</span>
            <span>FROM FIRST LIGHT TO GOLDEN HOUR</span>

            <span>AURORA CAFÉ · RIVERSIDE · SLOW BREWED STORIES</span>
            <span>FROM FIRST LIGHT TO GOLDEN HOUR</span>
           <span>AURORA CAFÉ · RIVERSIDE · SLOW BREWED STORIES</span>
            <span>FROM FIRST LIGHT TO GOLDEN HOUR</span>

            <span>AURORA CAFÉ · RIVERSIDE · SLOW BREWED STORIES</span>
            <span>FROM FIRST LIGHT TO GOLDEN HOUR</span>
           
          </div>
        </div>
      <div className="mx-auto grid max-w-350 gap-12 px-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:px-10">
        <div className="sm:col-span-2 lg:col-span-1">
          <BrandLogo variant="farsi" />
          <p className="mt-6 max-w-xs text-sm leading-8 text-muted">
            تهران، نیاوران، خیابان باهنر، خیابان شفیعی، نبش کوچه بهرام، پلاک ۹
          </p>
          <p className="mt-4 text-sm text-muted">
            تلفن تماس | تهران:{" "}
            <a href="tel:+989123456003" className="hover:text-accent">
              ۰۹۱۲۳۴۵۶۰۰۳
            </a>
          </p>
          <p className="mt-2 text-sm text-muted">
            <a href="tel:+989126873268" className="hover:text-accent">
              ۰۹۱۲۶۸۷۳۲۶۸
            </a>
          </p>
          <div className="mt-6 flex gap-4 text-xs text-muted">
            <Link href="/privacy" className="hover:text-accent">
              حریم خصوصی
            </Link>
            <Link href="/terms" className="hover:text-accent">
              قوانین
            </Link>
            <Link href="/faq" className="hover:text-accent">
              سوالات متداول
            </Link>
          </div>
        </div>

        <FooterColumn title="محصولات" links={productLinks} />
        <FooterColumn title="اکوسیستم قهوه" links={ecosystemLinks} />
        <FooterColumn title="شرکت" links={companyLinks} />
      </div>
      <p className="mx-auto mt-12 max-w-350 px-6 text-center text-xs text-muted lg:px-10">
        © {new Date().getFullYear()} Koubar — قهوه تخصصی تازه‌رُست
      </p>
    </footer>
  );
}
