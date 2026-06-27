"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/client";
import { queryKeys } from "@/lib/query-keys";
import type { AdminBlog, AdminCafeItem, AdminOrder, AdminRoasteryProduct, AdminUser } from "@/lib/admin/types";
import type { BlogPost } from "@/lib/types";
import type { AccessoryItem } from "@/lib/types";

export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.adminStats,
    queryFn: () =>
      apiFetch<{
        ordersToday: number;
        revenueToday: number;
        usersTotal: number;
        blogsPublished: number;
        recentOrders: {
          id: string;
          type: string;
          customerName: string;
          total: number;
          status: string;
        }[];
      }>("/api/admin/stats"),
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: queryKeys.adminUsers,
    queryFn: () => apiFetch<AdminUser[]>("/api/admin/users"),
  });
}

export function useAdminOrders(type?: string) {
  return useQuery({
    queryKey: queryKeys.adminOrders(type),
    queryFn: () =>
      apiFetch<AdminOrder[]>(
        `/api/admin/orders${type ? `?type=${type}` : ""}`,
      ),
  });
}

export function useAdminRoastery() {
  return useQuery({
    queryKey: queryKeys.adminRoastery,
    queryFn: () =>
      apiFetch<(AdminRoasteryProduct & { active?: boolean })[]>(
        "/api/admin/roastery",
      ),
  });
}

export function useAdminCafe() {
  return useQuery({
    queryKey: queryKeys.adminCafe,
    queryFn: () => apiFetch<AdminCafeItem[]>("/api/admin/cafe"),
  });
}

export function useAdminAccessories() {
  return useQuery({
    queryKey: queryKeys.adminAccessories,
    queryFn: () =>
      apiFetch<(AccessoryItem & { inStock?: boolean; active?: boolean })[]>(
        "/api/admin/accessories",
      ),
  });
}

function invalidateAdmin(qc: ReturnType<typeof useQueryClient>, keys: readonly unknown[]) {
  qc.invalidateQueries({ queryKey: keys });
}

export function useRoasteryMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    invalidateAdmin(qc, queryKeys.adminRoastery);
    qc.invalidateQueries({ queryKey: queryKeys.roastery });
  };

  const create = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      apiFetch("/api/admin/roastery", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ slug, ...body }: { slug: string } & Record<string, unknown>) =>
      apiFetch(`/api/admin/roastery/${slug}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (slug: string) =>
      apiFetch(`/api/admin/roastery/${slug}`, { method: "DELETE" }),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}

export function useCafeMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    invalidateAdmin(qc, queryKeys.adminCafe);
    qc.invalidateQueries({ queryKey: queryKeys.cafeMenu });
  };

  const create = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      apiFetch("/api/admin/cafe", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ slug, ...body }: { slug: string } & Record<string, unknown>) =>
      apiFetch(`/api/admin/cafe/${slug}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (slug: string) =>
      apiFetch(`/api/admin/cafe/${slug}`, { method: "DELETE" }),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}

export function useAccessoryMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    invalidateAdmin(qc, queryKeys.adminAccessories);
    qc.invalidateQueries({ queryKey: queryKeys.accessories });
  };

  const create = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      apiFetch("/api/admin/accessories", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ slug, ...body }: { slug: string } & Record<string, unknown>) =>
      apiFetch(`/api/admin/accessories/${slug}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (slug: string) =>
      apiFetch(`/api/admin/accessories/${slug}`, { method: "DELETE" }),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}

export function useBlogMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    invalidateAdmin(qc, queryKeys.adminBlogs);
    qc.invalidateQueries({ queryKey: ["blogs"] });
  };

  const create = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      apiFetch<BlogPost>("/api/admin/blogs", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ slug, ...body }: { slug: string } & Record<string, unknown>) =>
      apiFetch(`/api/admin/blogs/${slug}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (slug: string) =>
      apiFetch(`/api/admin/blogs/${slug}`, { method: "DELETE" }),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}

export function useOrderStatusMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiFetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      qc.invalidateQueries({ queryKey: queryKeys.adminStats });
      qc.invalidateQueries({ queryKey: queryKeys.myOrders });
    },
  });
}

export function useUserAdminMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: {
      id: string;
      name?: string;
      address?: string;
      role?: "USER" | "ADMIN";
    }) =>
      apiFetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.adminUsers });
    },
  });
}

export type { AdminBlog };
