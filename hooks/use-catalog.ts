"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/client";
import { queryKeys } from "@/lib/query-keys";
import type {
  AccessoryItem,
  CafeCategory,
} from "@/lib/types";

export type RoasteryProduct = {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  price: number;
  badge?: string;
  variant: "african" | "kenya" | "street";
  inStock: boolean;
};

export type GiftItemDto = {
  id: string;
  title: string;
  description: string;
  image: string;
  linkHref: string;
};

export function useCafeMenu() {
  return useQuery({
    queryKey: queryKeys.cafeMenu,
    queryFn: () => apiFetch<CafeCategory[]>("/api/cafe-menu"),
  });
}

export function useRoasteryProducts() {
  return useQuery({
    queryKey: queryKeys.roastery,
    queryFn: () => apiFetch<RoasteryProduct[]>("/api/roastery"),
  });
}

export function useAccessories() {
  return useQuery({
    queryKey: queryKeys.accessories,
    queryFn: () => apiFetch<AccessoryItem[]>("/api/accessories"),
  });
}

export function useGifts() {
  return useQuery({
    queryKey: queryKeys.gifts,
    queryFn: () => apiFetch<GiftItemDto[]>("/api/gifts"),
  });
}
