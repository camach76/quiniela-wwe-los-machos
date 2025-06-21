import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

// Rutas públicas que no requieren autenticación
const publicPaths = ['/login', '/register', '/auth/callback'];

// Rutas de administrador
const adminPaths = ['/admin'];

// Rutas de usuario normal
const userPaths = ['/dashboard'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('Middleware ejecutado para ruta:', pathname);

  // Si es una ruta pública, permitir el acceso
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Crear una respuesta que podamos modificar
  const response = NextResponse.next();
  
  // Crear cliente Supabase
  const supabase = createMiddlewareClient({ req: request, res: response });
  
  // Obtener la sesión
  const { data: { session }, error } = await supabase.auth.getSession();
  
  // Si no hay sesión, redirigir a login
  if (!session) {
    console.log('Redirigiendo a login desde middleware - No hay sesión activa');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verificar si es administrador
  const isAdmin = session.user?.email === 'admin@quinela.com';
  console.log('Usuario autenticado:', { email: session.user?.email, isAdmin });

  // Si está intentando acceder a una ruta de admin sin ser admin
  if (adminPaths.some(path => pathname.startsWith(path)) && !isAdmin) {
    console.log('Acceso denegado a ruta de administrador');
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Si es admin y está intentando ir a dashboard, redirigir a admin
  if (isAdmin && userPaths.some(path => pathname.startsWith(path))) {
    console.log('Redirigiendo admin a /admin');
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Si es usuario normal y está intentando ir a admin, redirigir a dashboard
  if (!isAdmin && adminPaths.some(path => pathname.startsWith(path))) {
    console.log('Redirigiendo usuario a /dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
