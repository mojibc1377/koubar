"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !user) {
      router.replace("/login?redirect=/account");
    }
  }, [isReady, user, router]);

  if (!isReady) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted">
        در حال بارگذاری...
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
