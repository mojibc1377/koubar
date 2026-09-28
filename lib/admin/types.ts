import type { BlogPost, CafeMenuItem, Order } from "@/lib/types";

export type AdminRoasteryProduct = {
  id: string;
  title: string;
  description: string;
  image?: string;
  price: number;
  badge?: string;
  variant: "african" | "kenya" | "street";
  inStock: boolean;
};

export type AdminCafeItem = CafeMenuItem & {
  categoryId: string;
  categoryName: string;
  active: boolean;
  dualCoffeePricing: boolean;
  priceSecondary?: number;
  linePrimaryLabel?: string;
  lineSecondaryLabel?: string;
  notes: string[];
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
export type AdminJobApplication = {
  id: string;
  applicationNumber: string;

  fullName: string;
  phone: string;
  email: string | null;

  age: number;
  marriageStatus: "SINGLE" | "MARRIED";
  militaryStatus:
    | "NOT_APPLICABLE"
    | "IN_PROGRESS"
    | "COMPLETED";
  address: string;

  department: "CAFE" | "ROASTERY" | "GENERAL";
  positionTitle: string;
  message: string | null;

  resumeUrl: string;
  resumeFileName: string;

  status:
    | "SUBMITTED"
    | "IN_REVIEW"
    | "INTERVIEW"
    | "OFFER"
    | "HIRED"
    | "REJECTED";

  userId: string | null;

  createdAt: string;
  updatedAt: string;
};

export type AdminDiscountCode = {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  active: boolean;
  expiresAt?: string;
  maxUses?: number;
  useCount: number;
  createdAt: string;
};
