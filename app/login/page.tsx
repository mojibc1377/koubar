import { Suspense } from "react";
import { PageShell } from "@/components/PageShell";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <PageShell className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-linear-to-b from-accent/5 to-background px-6 py-16">
      <Suspense
        fallback={
          <div className="text-muted">در حال بارگذاری...</div>
        }
      >
        <LoginForm />
      </Suspense>
    </PageShell>
  );
}
