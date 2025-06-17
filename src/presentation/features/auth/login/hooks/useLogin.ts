"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser } from "../services/loginUser";

type LoginCredentials = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";

  return useMutation({
    mutationFn: ({ email, password, rememberMe = false }: LoginCredentials) =>
      loginUser(email, password, rememberMe),
    onSuccess: () => {
      router.push(redirect);
    },
    onError: (error) => {
      console.error("Login error:", error.message);
    },
  });
}
