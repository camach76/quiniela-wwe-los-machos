"use client";

import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { loginUser } from "../services/loginUser";

type LoginCredentials = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export function useLogin() {
  const searchParams = useSearchParams();
  const redirect =
    searchParams.get("redirect") ??
    searchParams.get("redirectedFrom") ??
    "/dashboard";

  return useMutation({
    mutationFn: ({ email, password, rememberMe = false }: LoginCredentials) =>
      loginUser(email, password, rememberMe),
    onSuccess: () => {
      window.location.assign(redirect);
    },
    onError: (error) => {
      console.error("Login error:", error.message);
    },
  });
}
