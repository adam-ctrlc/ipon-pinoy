"use client";
import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  });

export function useCategories(params: Record<string, string> = {}) {
  const query = new URLSearchParams(params).toString();
  const key = `/api/categories${query ? `?${query}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
  });

  return { categories: data || [], isLoading, isError: !!error, mutate };
}

export function useCategory(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/categories/${id}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  return { category: data, isLoading, isError: !!error, mutate };
}
