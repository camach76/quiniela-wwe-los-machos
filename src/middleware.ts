import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server'
import { authGuard } from './backend/shared/middleware/authGuard';

export async function middleware(request: NextRequest) {
  // Manejo de rutas estáticas y archivos públicos
  if (request.nextUrl.pathname.startsWith('/_next') || 
      request.nextUrl.pathname.startsWith('/favicon.ico') ||
      request.nextUrl.pathname.startsWith('/images') ||
      request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Crear cliente de Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          const response = NextResponse.next();
          response.cookies.set(name, value, options);
          return response;
        },
        remove(name: string, options: any) {
          const response = NextResponse.next();
          response.cookies.delete(name, options);
          return response;
        },
      },
    }
  );

  // Obtener la sesión actual
  const { data: { session } } = await supabase.auth.getSession();
  
  // Pasar la sesión al authGuard
  return authGuard(request, session);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
