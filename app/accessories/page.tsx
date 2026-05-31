import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { giftItems } from "@/lib/data";
import { formatPrice } from "@/lib/format";

const accessories = [
  { title: "ماگ سرامیکی کینتو", price: 1_200_000 },
  { title: "فیلتر V60", price: 450_000 },
  { title: "کتل برقی گوسنیک", price: 8_500_000 },
  { title: "آسیاب دستی کامکس", price: 3_200_000 },
];

export default function AccessoriesPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10 lg:py-24">
        <h1 className="text-4xl font-extrabold">اکسسوری‌ها</h1>
        <p className="mt-4 text-muted">
          تجهیزات دم‌آوری و هدایای قهوه‌ای برای تکمیل تجربه شما.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {accessories.map((item) => (
            <div
              key={item.title}
              className="border border-border bg-card p-6"
            >
              <h2 className="font-bold">{item.title}</h2>
              <p className="mt-4 font-bold">{formatPrice(item.price)}</p>
              <button
                type="button"
                className="mt-4 w-full bg-accent rounded-2xl py-2.5 text-sm font-semibold text-background"
              >
                افزودن به سبد
              </button>
            </div>
          ))}
        </div>
        <div className="mt-16 border-t border-border pt-16">
          <h2 className="text-2xl font-bold">ست‌های هدیه</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {giftItems.slice(0, 2).map((g) => (
              <Link
                key={g.title}
                href="/#gifts"
                className="block border border-border p-6 hover:border-border-strong"
              >
                <h3 className="font-bold">{g.title}</h3>
                <p className="mt-2 text-sm text-muted">{g.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
