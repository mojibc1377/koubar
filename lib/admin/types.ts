import type { BlogPost, CafeMenuItem, Order } from "@/lib/types";

export type AdminRoasteryProduct = {
  id: string;
  title: string;
  description: string;
  price: number;
  badge?: string;
  variant: "african" | "kenya" | "street";
  inStock: boolean;
};

export type AdminCafeItem = CafeMenuItem & {
  categoryId: string;
  categoryName: string;
};

export type AdminUser = {
  id: string;
  name: string;
  phone: string;
  address: string;
  joinedAt: string;
  ordersCount: number;
  role?: "USER" | "ADMIN";
};

export type AdminBlog = BlogPost & {
  status: "published" | "draft";
};

export type AdminOrder = Order & {
  customerName: string;
  customerPhone: string;
};
