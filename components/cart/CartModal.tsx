"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { spring } from "@/lib/motion";
import { Z } from "@/lib/z-index";

export function CartModal() {
  const { items, total, count, isOpen, closeCart, removeItem } = useCart();
  const router = useRouter();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  function goCheckout() {
    closeCart();
    router.push("/checkout");
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="بستن سبد خرید"
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm"
            style={{ zIndex: Z.cartBackdrop }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="سبد خرید"
            className="fixed inset-y-0 left-0 flex w-full max-w-md flex-col border-r border-border bg-background shadow-2xl"
            style={{ zIndex: Z.cart }}
            initial={reduce ? false : { x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={spring}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="text-lg font-extrabold">سبد خرید</h2>
                <p className="text-xs text-muted">
                  {count.toLocaleString("fa-IR")} آیتم
                </p>
              </div>
              <motion.button
                type="button"
                onClick={closeCart}
                aria-label="بستن"
                className="rounded-full border border-border p-2 text-muted transition hover:border-accent hover:text-accent"
                whileHover={{ scale: 1.08, rotate: 90 }}
                whileTap={{ scale: 0.92 }}
              >
                <FaTimes />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <motion.div
                  className="flex h-full min-h-[200px] flex-col items-center justify-center text-center"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-muted">سبد خرید شما خالی است.</p>
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-6"
                    onClick={closeCart}
                  >
                    ادامه خرید
                  </Button>
                </motion.div>
              ) : (
                <ul className="space-y-3">
                  {items.map((item, i) => (
                    <motion.li
                      key={item.id}
                      layout
                      className="flex gap-3 rounded-2xl border border-border bg-card p-3"
                      initial={reduce ? false : { opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ delay: i * 0.04, ...spring }}
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border">
                        <Image
                          src={item.image ?? "/images/hero.png"}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{item.title}</p>
                        <p className="mt-1 text-xs text-muted">
                          {item.type === "shop" ? "فروشگاه" : "کافه"} ·{" "}
                          {item.quantity.toLocaleString("fa-IR")} عدد
                        </p>
                        <p className="mt-2 font-bold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="self-start text-xs text-muted transition hover:text-red-600"
                        aria-label="حذف"
                      >
                        حذف
                      </button>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border bg-card-elevated/50 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">جمع کل</span>
                  <span className="text-xl font-extrabold">{formatPrice(total)}</span>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <Button type="button" className="w-full" onClick={goCheckout}>
                    ادامه تسویه
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={closeCart}
                  >
                    ادامه خرید
                  </Button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
