'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clearSupabaseSession } from '@/presentation/utils/supabase/client';

export default function ClearSession() {
  const router = useRouter();

  useEffect(() => {
    const clearSession = async () => {
      console.log('Iniciando limpieza de sesión...');
      await clearSupabaseSession();
      console.log('Redirigiendo a la página de inicio...');
      router.push('/');
      router.refresh();
    };

    clearSession();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Limpiando sesión...</h1>
        <p>Por favor espera mientras limpiamos tu sesión actual.</p>
      </div>
    </div>
  );
}
