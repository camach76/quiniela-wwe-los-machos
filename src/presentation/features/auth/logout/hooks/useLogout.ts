"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logoutUser } from "../services/logoutUser";

export function useLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      // Redirigir al login después de cerrar sesión
      router.push("/login");
      router.refresh(); // Forzar actualización de la página
    },
    onError: (error) => {
      console.error("Error al cerrar sesión:", error);
    },
  });
}
