"use client";
import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  });

export function useBudgets(params: Record<string, string> = {}) {
  const query = new URLSearchParams(params).toString();
  const key = `/api/budgets${query ? `?${query}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
  });

  return { budgets: data || [], isLoading, isError: !!error, mutate };
}

export function useBudget(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/budgets/${id}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  return { budget: data, isLoading, isError: !!error, mutate };
}
