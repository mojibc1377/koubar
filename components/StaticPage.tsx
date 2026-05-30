import { PageShell } from "./PageShell";

export function StaticPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
        <h1 className="text-4xl font-extrabold">{title}</h1>
        <div className="mt-10 space-y-6 text-foreground/75 leading-8">{children}</div>
      </div>
    </PageShell>
  );
}
