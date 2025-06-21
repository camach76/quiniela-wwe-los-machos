"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const useGoogleLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Limpiar el estado de error cuando el componente se desmonte
  useEffect(() => {
    return () => {
      setError(null);
    };
  }, []);

  const cleanupAuthState = useCallback(async () => {
    try {
      // Limpiar cualquier sesión existente
      await supabase.auth.signOut();
      
      // Limpiar almacenamiento local
      if (typeof window === 'undefined') return;
      
      // Limpiar claves específicas de autenticación
      const authKeys = [
        'sb-auth-token',
        'sb-pkce-code-verifier',
        'sb-pmjtdcskhdsqltzuxpts-auth-token',
        'sb-pmjtdcskhdsqltzuxpts-auth-token-verifier',
        'sb-pmjtdcskhdsqltzuxpts-auth-token-code-verifier',
      ];
      
      // Limpiar claves específicas
      authKeys.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      
      // Limpiar cualquier otra clave relacionada con Supabase
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('sb-') || key.includes('pkce') || key.includes('code-verifier'))) {
          localStorage.removeItem(key);
        }
      }
      
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key.startsWith('sb-') || key.includes('pkce') || key.includes('code-verifier'))) {
          sessionStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error('Error al limpiar el estado de autenticación:', error);
    }
  }, [supabase]);

  const signInWithGoogle = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Limpiar el estado de autenticación antes de iniciar
      await cleanupAuthState();
      
      console.log('Iniciando autenticación con Google...');
      
      // Iniciar el flujo de autenticación OAuth
      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          // Asegurarse de que el flujo PKCE esté habilitado
          skipBrowserRedirect: false,
        },
      });
      
      console.log('Respuesta de signInWithOAuth:', { data, error: signInError });
      
      if (signInError) {
        console.error('Error en signInWithOAuth:', signInError);
        throw signInError;
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [cleanupAuthState, supabase]);

  return { signInWithGoogle, isLoading, error };
};

export default useGoogleLogin;
