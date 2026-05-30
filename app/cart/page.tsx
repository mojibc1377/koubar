"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

/** Legacy /cart URL — opens the cart modal and returns the user to their previous page. */
export default function CartPage() {
  const { openCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    openCart();
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.replace("/");
    }
  }, [openCart, router]);

  return null;
}
