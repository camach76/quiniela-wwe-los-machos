"use client";

import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "../services/logoutUser";

export function useLogout() {
  return useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      window.location.assign("/login");
    },
    onError: (error) => {
      console.error("Error al cerrar sesión:", error);
    },
  });
}
