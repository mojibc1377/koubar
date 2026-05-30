"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import type { PlatformMode } from "@/lib/types";

const STORAGE_KEY = "Koubar_platform_mode";

type PlatformModeContextValue = {
  mode: PlatformMode;
  setMode: (mode: PlatformMode) => void;
  toggleMode: () => void;
  isReady: boolean;
};

const PlatformModeContext = createContext<PlatformModeContextValue | null>(null);

export function PlatformModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mode, setModeState] = useState<PlatformMode>("shop");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    const isCafe = path === "/cafe" || path.startsWith("/cafe/");
    setModeState(isCafe ? "cafe" : "shop");
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const isCafe = pathname === "/cafe" || pathname.startsWith("/cafe/");
    const next: PlatformMode = isCafe ? "cafe" : "shop";
    setModeState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, [pathname, isReady]);

  const setMode = useCallback(
    (next: PlatformMode) => {
      setModeState(next);
      localStorage.setItem(STORAGE_KEY, next);
      router.push(next === "cafe" ? "/cafe" : "/");
    },
    [router],
  );

  const toggleMode = useCallback(() => {
    setMode(mode === "shop" ? "cafe" : "shop");
  }, [mode, setMode]);

  return (
    <PlatformModeContext.Provider
      value={{ mode, setMode, toggleMode, isReady }}
    >
      {children}
    </PlatformModeContext.Provider>
  );
}

export function usePlatformMode() {
  const ctx = useContext(PlatformModeContext);
  if (!ctx) {
    throw new Error("usePlatformMode must be used within PlatformModeProvider");
  }
  return ctx;
}
