import { BlogListView } from "@/components/blog/BlogListView";
import { PageShell } from "@/components/PageShell";

export const metadata = {
  title: "وبلاگ | کوبار",
  description: "مقالات و یادداشت‌های تخصصی قهوه از رستری کوبار",
};

export default function BlogPage() {
  return (
    <PageShell>
      <BlogListView
        title="وبلاگ کوبار"
        description="مقالات به‌روز درباره رُست، دم‌آوری، تأمین اخلاقی و فرهنگ قهوه تخصصی."
      />
    </PageShell>
  );
}
