"use client";

import { formatPrice } from "@/lib/format";
import type { CafeCoffeeLine } from "@/lib/cafe-coffee-lines";

export function CafeCoffeeLinePicker({
  lines,
  value,
  onChange,
  compact = false,
}: {
  lines: CafeCoffeeLine[];
  value: CafeCoffeeLine["id"];
  onChange: (lineId: CafeCoffeeLine["id"]) => void;
  compact?: boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted">انتخاب لاین قهوه</p>
      <div className={`flex flex-row gap-2 ${compact ? "" : "sm:flex-row"}`}>
        {lines.map((line) => {
          const active = value === line.id;
          return (
            <button
              key={line.id}
              type="button"
              onClick={() => onChange(line.id)}
              className={`flex flex-1 items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-right text-xs transition ${
                active
                  ? "border-accent bg-accent/10 text-foreground"
                  : "border-border bg-card-elevated text-muted hover:border-accent/40"
              }`}
            >
              <span className="font-semibold">{line.label}</span>
              <span className={active ? "font-bold text-accent" : "font-medium"}>
                {formatPrice(line.price)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
