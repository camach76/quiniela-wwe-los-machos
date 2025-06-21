"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser } from "../services/loginUser";
import { getRedirectPath } from "@/presentation/features/auth/services/userService";

type LoginCredentials = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRedirect = "/dashboard";
  const redirect = searchParams.get("redirect") || defaultRedirect;

  return useMutation({
    mutationFn: async ({ email, password, rememberMe = false }: LoginCredentials) => {
      console.log('Iniciando login para:', email);
      const result = await loginUser(email, password, rememberMe);
      console.log('Login exitoso, datos recibidos:', { 
        email: result.email, 
        userEmail: result.user?.email 
      });
      return { ...result, email };
    },
    onSuccess: async (data) => {
      try {
        console.log('=== DATOS EN ONSUCCESS ===');
        console.log('Email del usuario:', data.email);
        console.log('Es admin?', data.email === 'admin@quinela.com');
        
        // Usar getRedirectPath para determinar la ruta correcta
        const redirectPath = data.email === 'admin@quinela.com' ? '/admin' : redirect;
        
        console.log('=== REDIRECCIÓN ===');
        console.log('Ruta de redirección:', redirectPath);
        console.log('Redirigiendo a:', redirectPath);
        
        // Usar replace en lugar de push para evitar problemas con el historial
        router.replace(redirectPath);
      } catch (error) {
        console.error('Error al determinar la ruta de redirección:', error);
        router.replace(redirect); // Usar la ruta por defecto en caso de error
      }
    },
    onError: (error: any) => {
      console.error("Error en el login:", error);
      console.error("Mensaje de error:", error.message);
    },
  });
}
