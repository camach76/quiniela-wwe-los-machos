"use client";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState, ReactNode, useCallback } from 'react';
import { getCodeVerifier, clearAuthData, supabase } from '@/presentation/utils/supabase/client';
import { getRedirectPath } from '@/presentation/features/auth/services/userService';

// Función para obtener el código de la URL
const getCodeFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('code');
};

// Componente de carga
const LoadingSpinner = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-2xl font-bold text-gray-800">Procesando autenticación</h2>
        <p className="text-gray-600 text-center">
          {message}
        </p>
      </div>
    </div>
  </div>
);

// Componente de error
const ErrorMessage = ({ error }: { error: string }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
      <div className="flex flex-col items-center space-y-4">
        <div className="p-3 text-red-500 bg-red-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Error de autenticación</h2>
        <p className="text-red-600 text-center">
          {error}
        </p>
        <p className="text-gray-600 text-center">
          Serás redirigido a la página de inicio de sesión en unos segundos...
        </p>
      </div>
    </div>
  </div>
);

// Componente principal de la página de callback
const AuthCallbackContent = (): ReactNode => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  
  // Obtener parámetros de la URL
  const code = getCodeFromUrl();
  const error = searchParams.get('error');
  const next = searchParams.get('next') || '/dashboard';
  
  // Función para limpiar y redirigir
  const cleanAndRedirect = (path: string) => {
    clearAuthData();
    window.location.href = path;
  };

  // Función para realizar el intercambio de código por sesión
  const exchangeCodeForSession = useCallback(async (code: string) => {
    try {
      console.log('\n=== INICIANDO INTERCAMBIO DE CÓDIGO ===');
      console.log('Código recibido:', code);
      
      // Verificar si hay un code_verifier en el almacenamiento
      const codeVerifier = getCodeVerifier();
      console.log('\n=== VERIFICACIÓN DE CODE_VERIFIER ===');
      console.log('Code verifier encontrado:', codeVerifier ? 'Sí' : 'No');
      
      if (!codeVerifier) {
        const errorMsg = 'No se encontró el code_verifier necesario para la autenticación';
        console.error(errorMsg);
        console.log('Claves en sessionStorage:', Array.from({ length: sessionStorage.length }, (_, i) => sessionStorage.key(i)));
        console.log('Claves en localStorage:', Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i)));
        
        // Limpiar y redirigir al inicio de sesión
        cleanAndRedirect('/auth/login');
        return;
      }
      
      console.log('Iniciando exchangeCodeForSession...');
      
      // Intercambiar el código por una sesión
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      console.log('\n=== RESPUESTA DE exchangeCodeForSession ===');
      
      if (exchangeError) {
        console.error('Error en exchangeCodeForSession:', exchangeError);
        console.error('Mensaje de error:', exchangeError.message);
        console.error('Código de error:', exchangeError.status);
        
        // Si el error es porque el código ya fue usado o es inválido
        if (exchangeError.status === 400 || exchangeError.status === 401) {
          cleanAndRedirect('/auth/login');
          return;
        }
        
        throw exchangeError;
      }
      
      // Verificar si se recibieron datos de sesión
      if (!data?.session) {
        throw new Error('No se recibieron datos de sesión válidos');
      }
      
      console.log('✔️ Autenticación exitosa');
      console.log('Usuario autenticado:', data.user?.email || 'No disponible');
      console.log('Sesión activa hasta:', data.session.expires_at ? new Date(data.session.expires_at * 1000).toLocaleString() : 'No disponible');
      
      // Forzar una recarga de la sesión para asegurar que esté actualizada
      const { data: { session: updatedSession } } = await supabase.auth.getSession();
      console.log('Sesión actualizada después del intercambio:', updatedSession);
      
      if (!updatedSession) {
        throw new Error('No se pudo obtener la sesión actualizada');
      }
      
      // Obtener el perfil del usuario para verificar el rol
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', updatedSession.user.id)
        .single();
      
      if (profileError) {
        console.error('Error al obtener el perfil del usuario:', profileError);
        throw profileError;
      }
      
      console.log('Perfil del usuario obtenido:', profile);
      
      // Determinar la ruta de redirección basada en el rol
      const redirectPath = profile?.role === 'admin' ? '/admin' : '/dashboard';
      console.log('Redirigiendo a:', redirectPath);
      
      // Forzar una actualización de la sesión antes de redirigir
      await supabase.auth.getSession();
      
      // Redirigir a la página de destino después de un breve retraso
      // Usar replace en lugar de href para evitar problemas con el historial
      setTimeout(() => {
        window.location.replace(redirectPath);
      }, 500);
      
      return { success: true };
      
    } catch (exchangeError) {
      console.error('Error durante el intercambio de código:', exchangeError);
      setAuthError('Error al procesar la autenticación. Por favor, inténtalo de nuevo.');
      setIsLoading(false);
      
      // Limpiar y redirigir al inicio de sesión después de un tiempo
      setTimeout(() => {
        cleanAndRedirect('/auth/login');
      }, 3000);
      
      return { success: false, error: exchangeError };
    }
  }, [next]);

  // Efecto para manejar la autenticación
  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Verificar si hay un error en la URL
        if (error) {
          console.error('Error en la URL de redirección:', error);
          setAuthError(`Error de autenticación: ${error}`);
          setIsLoading(false);
          return;
        }

        // Verificar si ya hay una sesión activa
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        if (existingSession) {
          console.log('Sesión existente encontrada, redirigiendo...');
          console.log('Usuario autenticado:', existingSession.user?.email);
          
          // Determinar la ruta de redirección basada en el correo del usuario
          let redirectPath = next;
          
          // Si el usuario es admin, redirigir a /admin
          if (existingSession.user?.email === 'admin@quinela.com') {
            console.log('Usuario administrador detectado, redirigiendo a /admin');
            redirectPath = '/admin';
          }
          
          console.log('Redirigiendo a:', redirectPath);
          
          // Forzar una actualización de la sesión
          await supabase.auth.getSession();
          
          // Usar replace para evitar problemas con el historial
          setTimeout(() => {
            window.location.replace(redirectPath);
          }, 100);
          return;
        }

        // Verificar si hay un código de autenticación
        if (!code) {
          console.log('No se encontró código en la URL, verificando si ya está autenticado...');
          
          // Verificar nuevamente la sesión
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            console.log('Sesión encontrada después de la verificación, redirigiendo...');
            // Forzar una actualización de la sesión
            await supabase.auth.getSession();
            const redirectPath = await getRedirectPath();
            console.log('Redirigiendo a:', redirectPath);
            setTimeout(() => {
              window.location.replace(redirectPath);
            }, 500);
          } else {
            console.log('No hay sesión activa, redirigiendo al login...');
            cleanAndRedirect('/auth/login');
          }
          return;
        }

        console.log('=== INICIO DEL PROCESO DE AUTENTICACIÓN ===');
        console.log('Código de autenticación encontrado en la URL');
        
        // Mostrar información de depuración del almacenamiento
        if (typeof window !== 'undefined') {
          console.log('\n=== ALMACENAMIENTO ACTUAL ===');
          
          // Función para mostrar el contenido del almacenamiento
          const getStorageContents = (storage: Storage) => {
            const contents: Record<string, string> = {};
            for (let i = 0; i < storage.length; i++) {
              const key = storage.key(i);
              if (key) {
                const value = storage.getItem(key);
                if (value) contents[key] = value;
              }
            }
            return contents;
          };
          
          console.log('sessionStorage (completo):', getStorageContents(sessionStorage));
          console.log('localStorage (completo):', getStorageContents(localStorage));
        }
        
        // Intentar el intercambio de código
        const result = await exchangeCodeForSession(code);
        
        // Si el intercambio falló pero hay una sesión, redirigir de todos modos
        if (!result?.success) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            console.log('Se encontró una sesión activa después del fallo, redirigiendo...');
            // Forzar una actualización de la sesión
            await supabase.auth.getSession();
            const redirectPath = await getRedirectPath();
            console.log('Redirigiendo a:', redirectPath);
            setTimeout(() => {
              window.location.replace(redirectPath);
            }, 500);
            return;
          }
        }
        
      } catch (error) {
        console.error("Error en el proceso de autenticación:", error);
        
        // Verificar si hay una sesión activa a pesar del error
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            console.log('Se encontró una sesión activa a pesar del error, redirigiendo...');
            const redirectPath = await getRedirectPath();
            setTimeout(() => {
              window.location.href = redirectPath;
            }, 500);
            return;
          }
        } catch (sessionError) {
          console.error('Error al verificar la sesión:', sessionError);
        }
        
        setAuthError(error instanceof Error ? error.message : "Error desconocido");
        setIsLoading(false);
        
        // Limpiar y redirigir al inicio de sesión después de un tiempo
        setTimeout(() => {
          cleanAndRedirect('/auth/login');
        }, 3000);
      }
    };
    
    // Iniciar el proceso de autenticación
    handleAuth();
    
    // Limpiar en caso de desmontaje
    return () => {
      // Limpiar cualquier temporizador pendiente
    };
  }, [code, error, exchangeCodeForSession, next]);

  // Mostrar el estado de carga
  if (isLoading) {
    return <LoadingSpinner message="Estamos verificando tus credenciales. Por favor, espera un momento..." />;
  }

  // Mostrar mensaje de error si lo hay
  if (authError) {
    return <ErrorMessage error={authError} />;
  }

  // Por defecto, no mostrar nada (aunque no debería llegar aquí)
  return null;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
