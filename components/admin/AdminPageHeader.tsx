"use client";

import { motion } from "framer-motion";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      className="mb-8 flex flex-wrap items-end justify-between gap-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div>
        <h1 className="text-2xl font-extrabold md:text-3xl">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-[#fffbf5]/65">{description}</p>
        )}
      </div>
      {action}
    </motion.div>
  );
}
