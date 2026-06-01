/** Normalize Iranian mobile to 09XXXXXXXXX (ASCII digits). */
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("09")) return digits;
  if (digits.length === 10 && digits.startsWith("9")) return `0${digits}`;
  if (digits.length === 12 && digits.startsWith("98")) return `0${digits.slice(2)}`;
  if (digits.length === 13 && digits.startsWith("0098")) return `0${digits.slice(4)}`;
  return null;
}

export function isValidPhone(input: string): boolean {
  return normalizePhone(input) !== null;
}
