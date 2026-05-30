"use client";

import { useEffect } from "react";
import { usePlatformMode } from "@/context/PlatformModeContext";

export function PlatformTheme() {
  const { mode, isReady } = usePlatformMode();

  useEffect(() => {
    if (!isReady) return;
    const root = document.documentElement;
    root.dataset.platform = mode;
    root.style.colorScheme = mode === "shop" ? "dark" : "light";
  }, [mode, isReady]);

  return null;
}
