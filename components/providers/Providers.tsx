"use client";

import { CartModal } from "@/components/cart/CartModal";
import { CartToast } from "@/components/cart/CartToast";
import { PlatformTheme } from "@/components/PlatformTheme";
import { PlatformToggle } from "@/components/PlatformToggle";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { PlatformModeProvider } from "@/context/PlatformModeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PlatformModeProvider>
      <AuthProvider>
        <CartProvider>
          <PlatformTheme />
          {children}
          <PlatformToggle />
          <CartToast />
          <CartModal />
        </CartProvider>
      </AuthProvider>
    </PlatformModeProvider>
  );
}
