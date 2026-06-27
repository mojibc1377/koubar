export function formatDisplayDate(date: Date): string {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function generateOrderNumber(): string {
  const n = Date.now().toString(36).toUpperCase();
  return `ORD-${n.slice(-8)}`;
}

export function generateTxNumber(): string {
  const n = Date.now().toString(36).toUpperCase();
  return `TX-${n.slice(-8)}`;
}
