import type { CafeMenuItem } from "@/lib/types";

export const COFFEE_LINE_PRIMARY_LABEL = "لاین دیلمان";
export const COFFEE_LINE_SECONDARY_LABEL = "لاین استریت";

/** Cafe categories that use dual coffee-line pricing */
export const CAFE_COFFEE_CATEGORY_IDS = new Set(["espresso", "milk", "brew"]);

export type CafeCoffeeLine = {
  id: "primary" | "secondary";
  label: string;
  price: number;
};

export function itemHasCoffeeLinePricing(item: CafeMenuItem): boolean {
  return (
    item.dualCoffeePricing === true &&
    typeof item.priceSecondary === "number" &&
    item.priceSecondary > 0
  );
}

export function getCafeCoffeeLines(item: CafeMenuItem): CafeCoffeeLine[] | null {
  if (!itemHasCoffeeLinePricing(item)) return null;

  return [
    {
      id: "primary",
      label: item.linePrimaryLabel ?? COFFEE_LINE_PRIMARY_LABEL,
      price: item.price,
    },
    {
      id: "secondary",
      label: item.lineSecondaryLabel ?? COFFEE_LINE_SECONDARY_LABEL,
      price: item.priceSecondary!,
    },
  ];
}

export function getCafeLinePrice(item: CafeMenuItem, lineId: CafeCoffeeLine["id"]): number {
  const lines = getCafeCoffeeLines(item);
  if (!lines) return item.price;
  return lines.find((l) => l.id === lineId)?.price ?? item.price;
}
