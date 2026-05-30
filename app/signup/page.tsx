import { PageShell } from "@/components/PageShell";
import { SignupForm } from "./SignupForm";

export default function SignupPage() {
  return (
    <PageShell className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-linear-to-b from-accent/5 to-background px-6 py-16">
      <SignupForm />
    </PageShell>
  );
}
