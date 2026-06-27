export type ItemSource = "ROASTERY" | "ACCESSORY" | "CAFE";

export type CartItem = {
  id: string;
  catalogId: string;
  source: ItemSource;
  title: string;
  price: number;
  image?: string;
  type: "shop" | "cafe";
  quantity: number;
};

export type CartToastPayload = {
  id: string;
  title: string;
  image?: string;
};

const CART_KEY = "loubar_cart";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}
