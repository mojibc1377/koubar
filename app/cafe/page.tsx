import Image from "next/image";
import { CafeMenuView } from "@/components/cafe/CafeMenuView";
import { PageShell } from "@/components/PageShell";
import { icons } from "@/lib/icons";

export const metadata = {
  title: "منوی کافه | کوبار",
  description: "منوی نوشیدنی‌های کافه کوبار — اسپرسو، لاته، دم‌آوری و بیشتر",
};

export default function CafePage() {
  return (
    <PageShell>
      <div className="relative overflow-hidden border-b border-border bg-card">
        <div className="pointer-events-none absolute -right-12 top-6 h-40 w-40 rounded-full bg-accent/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-2 h-36 w-36 rounded-full bg-foreground/10 blur-3xl" />
        <div className="mx-auto flex max-w-350 flex-col items-start gap-6 px-6 py-14 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-20">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Image src={icons.cafe} alt="" width={36} height={36} />
              <span className="text-xs font-semibold tracking-widest text-muted">
                Koubar CAFÉ
              </span>
            </div>
            <h1 className="bg-linear-to-r from-foreground via-accent to-foreground bg-size-[200%_auto] bg-clip-text text-4xl font-extrabold text-transparent">
              منوی کافه
            </h1>
            <p className="mt-4 max-w-xl leading-8 text-muted">
              نوشیدنی‌های آماده سرو در فضای کافه — از اسپرسوی روز تا دم‌آوری دستی.
              برای سفارش حضوری به باریستا مراجعه کنید.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-border-strong bg-background px-3 py-1 text-xs text-accent">
                Fresh Roasted
              </span>
              <span className="rounded-full border border-border-strong bg-background px-3 py-1 text-xs text-accent">
                Signature Drinks
              </span>
            </div>
          </div>
          <div>
            <Image src={icons.menu} alt="" width={80} height={80} className="opacity-45" />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-350 px-6 py-16 lg:px-10 lg:py-20">
        <CafeMenuView />
      </div>
    </PageShell>
  );
}
