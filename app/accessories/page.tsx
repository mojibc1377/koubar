import { AccessoriesView } from "@/components/accessories/AccessoriesView";
import { PageShell } from "@/components/PageShell";

export const metadata = {
  title: "اکسسوری‌ها | کوبار",
  description: "تجهیزات دم‌آوری و اکسسوری قهوه — کوبار",
};

export default function AccessoriesPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10 lg:py-24">
        <AccessoriesView />
      </div>
    </PageShell>
  );
}
