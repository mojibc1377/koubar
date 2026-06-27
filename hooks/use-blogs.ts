"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/client";
import { queryKeys } from "@/lib/query-keys";
import type { BlogPost } from "@/lib/types";

export function useBlogs(status = "published") {
  return useQuery({
    queryKey: queryKeys.blogs(status),
    queryFn: () => apiFetch<BlogPost[]>(`/api/blogs?status=${status}`),
  });
}

export function useBlog(slug: string) {
  return useQuery({
    queryKey: queryKeys.blog(slug),
    queryFn: () => apiFetch<BlogPost>(`/api/blogs/${slug}`),
    enabled: Boolean(slug),
  });
}

export function useAdminBlogs() {
  return useQuery({
    queryKey: queryKeys.adminBlogs,
    queryFn: () => apiFetch<BlogPost[]>("/api/admin/blogs"),
  });
}
