import { LimitedOffers } from "@/components/LimitedOffers";
import { PageShell } from "@/components/PageShell";

export const metadata = {
  title: "محصولات | کوبار",
};

export default function ProductsPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
        <h1 className="text-4xl font-extrabold">محصولات</h1>
        <p className="mt-4 max-w-2xl text-muted">
          دانه‌های تخصصی تازه‌رُست — بلند، تک‌خاستگاه و عرضه‌های محدود.
        </p>
      </div>
      <LimitedOffers />
    </PageShell>
  );
}
