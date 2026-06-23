"use client";
import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  });

export function useTransactions(params: Record<string, string> = {}) {
  const query = new URLSearchParams(params).toString();
  const key = `/api/transactions${query ? `?${query}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
  });

  return { transactions: data || [], isLoading, isError: !!error, mutate };
}

export function useTransaction(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/transactions/${id}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  return { transaction: data, isLoading, isError: !!error, mutate };
}
