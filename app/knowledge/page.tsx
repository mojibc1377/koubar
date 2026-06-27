import { BlogListView } from "@/components/blog/BlogListView";
import { PageShell } from "@/components/PageShell";

export const metadata = {
  title: "دانش قهوه | کوبار",
};

export default function KnowledgePage() {
  return (
    <PageShell>
      <BlogListView
        title="دانش قهوه"
        description="راهنماها و مقالات تخصصی برای انتخاب دانه، دم‌آوری و درک طعم."
      />
    </PageShell>
  );
}
