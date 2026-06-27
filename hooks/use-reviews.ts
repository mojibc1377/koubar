"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/client";
import { queryKeys } from "@/lib/query-keys";
import type { Review, Staff } from "@/lib/types";

type SubmitReviewPayload = {
  orderId: string;
  staffId: string;
  staffStars: number;
  foodStars: number;
  comment?: string;
};

export function useStaff() {
  return useQuery({
    queryKey: queryKeys.staff,
    queryFn: () => apiFetch<Staff[]>("/api/staff"),
  });
}

export function useReview(orderId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.review(orderId ?? ""),
    queryFn: () => apiFetch<Review | null>(`/api/reviews/${orderId}`),
    enabled: !!orderId,
  });
}

export function useSubmitReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubmitReviewPayload) =>
      apiFetch<Review>("/api/reviews", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.myOrders });
      qc.invalidateQueries({ queryKey: queryKeys.review(variables.orderId) });
    },
  });
}
