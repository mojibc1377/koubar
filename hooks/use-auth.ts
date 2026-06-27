"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useCallback } from "react";

export type AuthUser = {
  id: string;
  phone: string;
  name: string;
  address: string;
  role: "USER" | "ADMIN";
};

export function useAuth() {
  const { data: session, status, update } = useSession();

  const user: AuthUser | null = session?.user
    ? {
        id: session.user.id,
        phone: session.user.phone,
        name: session.user.name ?? "",
        address: session.user.address ?? "",
        role: session.user.role ?? "USER",
      }
    : null;

  const isAdmin = user?.role === "ADMIN";

  const isReady = status !== "loading";
  const isAuthenticated = status === "authenticated";

  const sendOtp = useCallback(
    async (phone: string, intent: "login" | "signup") => {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, intent }),
      });
      const data = (await res.json()) as { error?: string; ok?: boolean };
      if (!res.ok) {
        throw new Error(data.error ?? "ارسال کد ناموفق بود.");
      }
      return data;
    },
    [],
  );

  const verifyOtp = useCallback(
    async (params: {
      phone: string;
      code: string;
      intent: "login" | "signup";
      name?: string;
      address?: string;
    }) => {
      const result = await signIn("phone-otp", {
        phone: params.phone,
        code: params.code,
        intent: params.intent,
        name: params.name ?? "",
        address: params.address ?? "",
        redirect: false,
      });

      if (result?.error) {
        throw new Error("کد تأیید نامعتبر یا منقضی شده است.");
      }

      await update();
      return result?.ok ?? false;
    },
    [update],
  );

  const logout = useCallback(async () => {
    await signOut({ callbackUrl: "/" });
  }, []);

  const updateProfile = useCallback(
    async (data: Partial<Pick<AuthUser, "name" | "phone" | "address">>) => {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(json.error ?? "به‌روزرسانی ناموفق بود.");
      }
      await update();
    },
    [update],
  );

  return {
    user,
    session,
    isReady,
    isAuthenticated,
    status,
    sendOtp,
    verifyOtp,
    logout,
    updateProfile,
    refreshSession: update,
    isAdmin,
  };
}
