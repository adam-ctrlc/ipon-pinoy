"use client";
import { authClient } from "@/lib/auth-client";

export function useAuth() {
  const { data: session, isPending: isLoading, error, refetch } = authClient.useSession();
  return {
    user: session?.user ?? null,
    isLoading,
    isError: !!error,
    isAuthenticated: !!session,
    mutate: refetch,
  };
}
