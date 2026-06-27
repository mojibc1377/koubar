"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/client";
import { queryKeys } from "@/lib/query-keys";
import type { CartItem } from "@/lib/cart";
import type { Order, Transaction } from "@/lib/types";

type CheckoutPayload = {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  items: {
    source: CartItem["source"];
    catalogId: string;
    title: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
};

export function useMyOrders() {
  return useQuery({
    queryKey: queryKeys.myOrders,
    queryFn: () => apiFetch<Order[]>("/api/orders"),
  });
}

export function useMyTransactions() {
  return useQuery({
    queryKey: queryKeys.myTransactions,
    queryFn: () => apiFetch<Transaction[]>("/api/transactions"),
  });
}

export function useCheckout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CheckoutPayload) =>
      apiFetch<{ order: Order }>("/api/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.myOrders });
      qc.invalidateQueries({ queryKey: queryKeys.myTransactions });
    },
  });
}
