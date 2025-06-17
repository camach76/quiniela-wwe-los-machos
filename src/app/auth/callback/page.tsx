'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';
  const error = searchParams.get('error');

  useEffect(() => {
    const handleAuth = async () => {
      try {
        console.log('=== MANEJANDO CALLBACK DE AUTENTICACIÓN ===');
        
        // Verificar si hay un error en la URL
        if (error) {
          console.error('Error en la autenticación:', error);
          router.push(`/auth/error?error=${encodeURIComponent(error)}`);
          return;
        }
        
        // Verificar si hay un código de autenticación en la URL
        const code = searchParams.get('code');
        
        if (!code) {
          console.error('No se proporcionó código de autenticación');
          router.push(`/auth/error?error=${encodeURIComponent('missing_code')}`);
          return;
        }
        
        console.log('Código de autenticación encontrado en la URL');
        const supabase = createClientComponentClient();
        
        // Intercambiar el código por una sesión
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
        if (exchangeError) {
          console.error('Error al intercambiar código por sesión:', exchangeError);
          throw exchangeError;
        }
        
        console.log('Sesión establecida correctamente');
        
        // Forzar recarga de la aplicación para asegurar que los datos de sesión se actualicen
        window.location.href = redirectTo;
      } catch (err) {
        console.error('Error en el proceso de autenticación:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        router.push(`/login?error=${encodeURIComponent(errorMessage)}`);
      }
    };

    handleAuth();
  }, [router, searchParams, redirectTo, error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800">Verificando tu sesión...</h2>
        <p className="text-gray-600 mt-2">Por favor espera mientras te redirigimos.</p>
      </div>
    </div>
  );
}
