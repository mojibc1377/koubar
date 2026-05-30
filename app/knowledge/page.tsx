import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { blogPosts } from "@/lib/blog";

const guides = [
  { title: "راهنمای خرید قهوه", href: "/blog/washed-vs-natural" },
  { title: "دیال-این اسپرسو", href: "/blog/home-espresso-dial-in" },
  { title: "کلد برو تابستانی", href: "/blog/cold-brew-summer" },
  { title: "تأمین اخلاقی", href: "/blog/ethical-sourcing-2025" },
];

export default function KnowledgePage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10 lg:py-24">
        <h1 className="text-4xl font-extrabold">دانش قهوه</h1>
        <p className="mt-4 max-w-2xl text-muted">
          راهنماها و مقالات برای انتخاب دانه، دم‌آوری و درک پروفایل طعمی.
        </p>
        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {guides.map((g) => (
            <li key={g.href}>
              <Link
                href={g.href}
                className="flex items-center justify-between border border-border bg-card px-6 py-5 transition hover:border-border-strong"
              >
                <span className="font-bold">{g.title}</span>
                <span className="text-muted">←</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-16">
          <h2 className="text-2xl font-bold">آخرین مطالب وبلاگ</h2>
          <ul className="mt-6 space-y-3">
            {blogPosts.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="text-muted hover:text-accent">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageShell>
  );
}
