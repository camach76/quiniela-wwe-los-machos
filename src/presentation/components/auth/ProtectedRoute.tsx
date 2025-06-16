"use client";

import { useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useUserSession } from '@/presentation/hooks/useUserSession';
import { LoadingSpinner } from '@/presentation/components/ui/loading-spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading } = useUserSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (loading) return;

    const isAuthPage = ['/login', '/register'].includes(pathname);
    const redirectPath = searchParams.get('redirectedFrom') || '/';

    // Si el usuario no está autenticado y no está en una página de autenticación
    if (!user && !isAuthPage) {
      router.push(`/login?redirectedFrom=${encodeURIComponent(pathname)}`);
      return;
    }

    // Si el usuario está autenticado y está en una página de autenticación
    if (user && isAuthPage) {
      router.push(redirectPath);
      return;
    }

    // Verificar si se requiere rol de administrador
    if (requireAdmin && user?.user_metadata?.role !== 'admin') {
      router.push('/unauthorized');
      return;
    }
  }, [user, loading, pathname, router, searchParams, requireAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Si el usuario está autenticado y tiene los permisos necesarios, renderizar los hijos
  if (user && (requireAdmin ? user.user_metadata?.role === 'admin' : true)) {
    return <>{children}</>;
  }

  // Mostrar un estado de carga por defecto mientras se redirige
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" />
    </div>
  );
}
