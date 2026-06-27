"use client";

import { SessionProvider } from "next-auth/react";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { CartModal } from "@/components/cart/CartModal";
import { CartToast } from "@/components/cart/CartToast";
import { PlatformTheme } from "@/components/PlatformTheme";
import { PlatformToggle } from "@/components/PlatformToggle";
import { CartProvider } from "@/context/CartContext";
import { PlatformModeProvider } from "@/context/PlatformModeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus>
      <QueryProvider>
      <PlatformModeProvider>
        <CartProvider>
          <PlatformTheme />
          {children}
          <PlatformToggle />
          <CartToast />
          <CartModal />
        </CartProvider>
      </PlatformModeProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
