"use client";

import { SupabaseAuthRepository } from "@/backend/core/infra/repositories/SupabaseAuthRepository";
import { RegisterUser } from "@/backend/core/usecases/RegisterUser";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useRegister() {
  const router = useRouter();
  const usecase = new RegisterUser(new SupabaseAuthRepository());

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      usecase.execute(email, password),
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error) => {
      console.error("Registro fallido:", error.message);
    },
  });
}
