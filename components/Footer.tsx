import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import "../app/globals.css";

const productLinks = [
  { href: "/products", label: "اسپشیالتی" },
  { href: "/products?cat=african", label: "آفریقایی" },
  { href: "/products?cat=american", label: "آمریکایی" },
  { href: "/products?cat=blend", label: "ترکیبی" },
  { href: "/products?cat=decaf", label: "دی کف" },
];

const ecosystemLinks = [
  { href: "/about", label: "رستری قهوه تخصصی" },
  { href: "/blog", label: "راهنمای خرید قهوه" },
  { href: "/accessories", label: "اکسسوری‌ها" },
  { href: "/blog", label: "دانش قهوه" },
];

const companyLinks = [
  { href: "/products", label: "لیست قیمت" },
  { href: "/about", label: "درباره ما" },
  { href: "/blog", label: "وبلاگ" },
];

const legalLinks = [
  { href: "/privacy", label: "حریم خصوصی" },
  { href: "/terms", label: "قوانین" },
  { href: "/faq", label: "سوالات متداول" },
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

function LocationIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-accent"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.5-7.5 11-7.5 11s-7.5-3.5-7.5-11a7.5 7.5 0 1115 0z"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-accent"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h1.5a2.25 2.25 0 002.25-2.25v-1.5a1.5 1.5 0 00-1.5-1.5h-2.379a1.5 1.5 0 00-1.06.44l-1.007 1.006a12.037 12.037 0 01-6.5-6.5l1.006-1.006a1.5 1.5 0 00.44-1.061V4.5A1.5 1.5 0 007.5 3h-1.5a2.25 2.25 0 00-2.25 2.25v1.5z"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-accent"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
      />
    </svg>
  );
}

export function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-border bg-card-elevated py-12 pt-4"
    >
      <div className="mb-12 pb-2 overflow-hidden border-b border-border">
        <div className="cafe-footer-marquee text-base font-medium">
          <span>کوبار؛ تلفیقِ دقیقِ هنرِ باریستا و دانشِ روست</span>
          <span>روست‌شده در کارگاهِ ما با متدهای اختصاصی و مدرن</span>
          <span>از انتخابِ دانه تا کنترلِ پروفایل‌های حرارتیِ نسلِ جدید</span>
          <span>لذتِ طعم‌های کشف‌نشده در هر فنجانِ کوبار</span>
          <span>خلوصِ دانه، دقتِ ماشین، و اشتیاقِ ما به قهوه</span>
          <span>تکنولوژیِ نوینِ روست، ضامنِ تازگی و عطرِ پایدار</span>
          <span>کوبار؛ مقصدِ همیشگی برای دوستدارانِ قهوه‌ی تخصصی</span>
          <span>کوبار؛ تلفیقِ دقیقِ هنرِ باریستا و دانشِ روست</span>
          <span>روست‌شده در کارگاهِ ما با متدهای اختصاصی و مدرن</span>
          <span>از انتخابِ دانه تا کنترلِ پروفایل‌های حرارتیِ نسلِ جدید</span>
          <span>لذتِ طعم‌های کشف‌نشده در هر فنجانِ کوبار</span>
          <span>خلوصِ دانه، دقتِ ماشین، و اشتیاقِ ما به قهوه</span>
          <span>تکنولوژیِ نوینِ روست، ضامنِ تازگی و عطرِ پایدار</span>
          <span>کوبار؛ مقصدِ همیشگی برای دوستدارانِ قهوه‌ی تخصصی</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-350 grid-cols-1 gap-12 px-6 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-10 lg:px-10">
        {/* Brand + contact */}
        <div className="sm:col-span-2 lg:col-span-1">
          <BrandLogo variant="english" className="animate-bounce"/>
          <ul className="mt-6 space-y-4">
            <li className="flex items-start gap-3">
              <LocationIcon />
              <span className="text-sm leading-7 text-muted">
                رشت-گلسار- خیابان ۹۳-شاهد یکم-نبش خیابان ۹۱ شمالی
              </span>
            </li>
            <li className="flex items-center gap-3">
              <PhoneIcon />
              <a
                href="tel:+989003612123"
                className="text-sm text-muted transition hover:text-accent"
              >
                ۰۹۰۰۳۶۱۲۱۲۳
              </a>
            </li>
            <li className="flex items-center gap-3">
              <ClockIcon />
              <span className="text-sm text-muted" dir="auto">
                ۰۸:۰۰ صبح الی ۱۱:۰۰ شب
              </span>
            </li>
          </ul>
        </div>

        <FooterColumn title="اکوسیستم قهوه" links={ecosystemLinks} />
        <FooterColumn title="شرکت" links={companyLinks} />
      </div>

      <div className="mx-auto mt-12 flex max-w-350 flex-col-reverse items-center gap-4 border-t border-border px-6 pt-6 text-center sm:flex-row sm:justify-between sm:text-right lg:px-10">
        <p className="text-xs text-muted">
          © {new Date().getFullYear()} Koubar — قهوه تخصصی تازه‌رُست
        </p>
        <div className="flex gap-5 text-xs text-muted">
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}