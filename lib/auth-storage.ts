import type { Order, Transaction } from "./types";

const ORDERS_KEY = "Koubar_orders";
const TX_KEY = "Koubar_transactions";

const seedOrders: Order[] = [
  {
    id: "ORD-1042",
    date: "۱۴۰۴/۰۲/۲۸",
    status: "delivered",
    type: "shop",
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
    id: "ORD-1038",
    date: "۱۴۰۴/۰۲/۱۰",
    status: "delivered",
    type: "cafe",
    items: [
      { id: "2", title: "لاته", quantity: 2, price: 195_000 },
      { id: "3", title: "کورتادو", quantity: 1, price: 175_000 },
    ],
    total: 565_000,
  },
];

const seedTransactions: Transaction[] = [
  {
    id: "TX-8821",
    orderId: "ORD-1042",
    date: "۱۴۰۴/۰۲/۲۸",
    amount: 4_950_000,
    method: "درگاه بانکی",
    status: "paid",
  },
  {
    id: "TX-8810",
    orderId: "ORD-1038",
    date: "۱۴۰۴/۰۲/۱۰",
    amount: 565_000,
    method: "کارت در محل",
    status: "paid",
  },
];

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getOrders(): Order[] {
  const stored = read<Order[] | null>(ORDERS_KEY, null);
  return stored ?? seedOrders;
}

export function saveOrders(orders: Order[]) {
  write(ORDERS_KEY, orders);
}

export function getTransactions(): Transaction[] {
  const stored = read<Transaction[] | null>(TX_KEY, null);
  return stored ?? seedTransactions;
}

export function saveTransactions(transactions: Transaction[]) {
  write(TX_KEY, transactions);
}
