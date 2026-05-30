import { AuthGuard } from "@/components/account/AuthGuard";
import { AccountLayoutClient } from "@/components/account/AccountLayoutClient";
import { PageShell } from "@/components/PageShell";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageShell>
      <AuthGuard>
        <AccountLayoutClient>{children}</AccountLayoutClient>
      </AuthGuard>
    </PageShell>
  );
}
