export type PlatformMode = "shop" | "cafe";

export type User = {
  id: string;
  name: string;
  phone: string;
  address: string;
};

export type OrderItem = {
  id: string;
  title: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  date: string;
  status: "delivered" | "processing" | "cancelled";
  items: OrderItem[];
  total: number;
  type: "shop" | "cafe";
};

export type Transaction = {
  id: string;
  orderId: string;
  date: string;
  amount: number;
  method: string;
  status: "paid" | "refunded" | "pending";
};

export type BlogContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "callout"; variant?: "tip" | "note"; title: string; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "divider" };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  category: string;
  readMinutes: number;
  /** @deprecated use blocks — kept for admin fallback */
  content: string[];
  blocks: BlogContentBlock[];
};

export type AccessoryItem = {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  price: number;
  badge?: string;
  notes?: string[];
  category: string;
};

export type CafeMenuItem = {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  image?: string;
  notes?: string[];
  price: number;
  badge?: string;
};

export type CafeCategory = {
  id: string;
  name: string;
  items: CafeMenuItem[];
};
