import { BlogCard } from "@/components/blog/BlogCard";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/motion/Reveal";
import { blogPosts } from "@/lib/blog";

export const metadata = {
  title: "وبلاگ | کوبار",
  description: "مقالات و یادداشت‌های تخصصی قهوه از رستری کوبار",
};

export default function BlogPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10 lg:py-24">
        <Reveal>
          <h1 className="text-4xl font-extrabold">وبلاگ کوبار</h1>
          <p className="mt-4 max-w-2xl text-muted">
            مقالات به‌روز درباره رُست، دم‌آوری، تأمین اخلاقی و فرهنگ قهوه تخصصی.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {blogPosts.map((post, index) => (
            <BlogCard key={post.slug} post={post} index={index} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}
