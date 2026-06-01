import { blogPosts } from "@/lib/blog";
import { cafeMenu } from "@/lib/cafe-menu";
import { limitedProducts } from "@/lib/data";
import type {
  AdminBlog,
  AdminCafeItem,
  AdminOrder,
  AdminRoasteryProduct,
  AdminUser,
} from "./types";

export const adminNav = [
  { href: "/admin", label: "داشبورد", icon: "dashboard" as const },
  { href: "/admin/cafe-menu", label: "منوی کافه", icon: "cafe" as const },
  { href: "/admin/roastery", label: "محصولات رستری", icon: "beans" as const },
  { href: "/admin/blogs", label: "وبلاگ", icon: "blog" as const },
  { href: "/admin/orders", label: "سفارش‌ها", icon: "order" as const },
  { href: "/admin/users", label: "کاربران", icon: "profile" as const },
] as const;

export const initialRoasteryProducts: AdminRoasteryProduct[] = limitedProducts.map(
  (p) => ({
    ...p,
    inStock: true,
  }),
);

export const initialCafeItems: AdminCafeItem[] = cafeMenu.flatMap((cat) =>
  cat.items.map((item) => ({
    ...item,
    categoryId: cat.id,
    categoryName: cat.name,
  })),
);

export const initialBlogs: AdminBlog[] = blogPosts.map((post, i) => ({
  ...post,
  status: i === 2 ? "draft" : "published",
}));

export const initialUsers: AdminUser[] = [
  {
    id: "usr_1",
    name: "سارا محمدی",
    phone: "09121234567",
    address: "تهران، نیاوران",
    joinedAt: "۱۴۰۴/۰۱/۱۲",
    ordersCount: 5,
  },
  {
    id: "usr_2",
    name: "علی رضایی",
    phone: "09129876543",
    address: "تهران، زعفرانیه",
    joinedAt: "۱۴۰۴/۰۲/۰۳",
    ordersCount: 2,
  },
  {
    id: "usr_3",
    name: "مریم کاظمی",
    phone: "09131112233",
    address: "اصفهان، چهارباغ",
    joinedAt: "۱۴۰۴/۰۲/۲۸",
    ordersCount: 8,
  },
  {
    id: "usr_4",
    name: "کاربر کوبار",
    phone: "09123456789",
    address: "تهران، نیاوران",
    joinedAt: "۱۴۰۴/۰۳/۰۱",
    ordersCount: 1,
  },
];

export const initialOrders: AdminOrder[] = [
  {
    id: "ORD-1042",
    date: "۱۴۰۴/۰۲/۲۸",
    status: "delivered",
    type: "shop",
    customerName: "سارا محمدی",
    customerPhone: "09121234567",
    items: [
      {
        id: "1",
        title: "دانه قهوه 80/20 آفریقایی ۱ کیلوگرمی",
        quantity: 1,
        price: 4_950_000,
      },
    ],
    total: 4_950_000,
  },
  {
    id: "ORD-1045",
    date: "۱۴۰۴/۰۳/۰۲",
    status: "processing",
    type: "shop",
    customerName: "علی رضایی",
    customerPhone: "09129876543",
    items: [
      {
        id: "2",
        title: "دانه قهوه کنیا واشد ۱ کیلوگرمی",
        quantity: 2,
        price: 6_500_000,
      },
    ],
    total: 13_000_000,
  },
  {
    id: "ORD-1038",
    date: "۱۴۰۴/۰۲/۱۰",
    status: "delivered",
    type: "cafe",
    customerName: "مریم کاظمی",
    customerPhone: "09131112233",
    items: [
      { id: "2", title: "لاته", quantity: 2, price: 195_000 },
      { id: "3", title: "کورتادو", quantity: 1, price: 175_000 },
    ],
    total: 565_000,
  },
  {
    id: "ORD-1048",
    date: "۱۴۰۴/۰۳/۰۵",
    status: "processing",
    type: "cafe",
    customerName: "سارا محمدی",
    customerPhone: "09121234567",
    items: [
      { id: "4", title: "اسپرسو دوبل", quantity: 1, price: 150_000 },
      { id: "5", title: "کاپوچینو", quantity: 2, price: 185_000 },
    ],
    total: 520_000,
  },
  {
    id: "ORD-1035",
    date: "۱۴۰۴/۰۱/۲۵",
    status: "cancelled",
    type: "shop",
    customerName: "کاربر کوبار",
    customerPhone: "09123456789",
    items: [
      {
        id: "3",
        title: "قهوه استریت لاین ۱ کیلوگرمی",
        quantity: 1,
        price: 5_550_000,
      },
    ],
    total: 5_550_000,
  },
];

export const adminStats = {
  revenueToday: 2_450_000,
  ordersToday: 7,
  usersTotal: initialUsers.length,
  blogsPublished: initialBlogs.filter((b) => b.status === "published").length,
};
