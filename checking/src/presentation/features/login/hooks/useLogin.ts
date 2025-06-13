"use client";

import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../services/loginUser";
import { useRouter, useSearchParams } from "next/navigation";

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginUser(email, password),
    onSuccess: () => {
      router.push(redirect);
    },
    onError: (error) => {
      console.error("Login error:", error.message);
    },
  });
}
