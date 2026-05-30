"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ease } from "@/lib/motion";

export function PageShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <>
      <Header />
      <motion.main
        className={className}
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease, delay: 0.1 }}
      >
        {children}
      </motion.main>
      <Footer />
    </>
  );
}
