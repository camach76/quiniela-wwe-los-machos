import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  console.log('[Auth Callback] Iniciando proceso de callback de autenticación');
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';
  
  // Crear una respuesta de redirección
  const redirectUrl = new URL(next, request.url);
  console.log(`[Auth Callback] Redirigiendo a: ${redirectUrl.toString()}`);
  
  // Crear una respuesta de redirección con encabezados de no caché
  const response = NextResponse.redirect(redirectUrl, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
  
  if (!code) {
    console.error('[Auth Callback] Error: No se proporcionó un código de autenticación');
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'no_code');
    return NextResponse.redirect(loginUrl);
  }

  try {
    console.log('[Auth Callback] Intercambiando código por sesión...');
    
    // Crear cliente Supabase para el servidor
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const value = request.cookies.get(name)?.value;
            console.log(`[Auth Callback] Obteniendo cookie: ${name}`, { exists: !!value });
            return value;
          },
          set(name: string, value: string, options: any) {
            console.log(`[Auth Callback] Configurando cookie: ${name}`, { 
              secure: options?.secure,
              httpOnly: options?.httpOnly,
              maxAge: options?.maxAge,
              path: options?.path
            });
            response.cookies.set({
              name,
              value,
              ...options,
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
            });
          },
          remove(name: string, options: any) {
            console.log(`[Auth Callback] Eliminando cookie: ${name}`);
            response.cookies.set({
              name,
              value: '',
              ...options,
              maxAge: 0,
            });
          },
        },
      }
    );

    // Intercambiar el código de autenticación por una sesión
    console.log('[Auth Callback] Intercambiando código por sesión...');
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('[Auth Callback] Error al intercambiar código por sesión:', error);
      throw error;
    }

    if (!data.session) {
      throw new Error('No se pudo crear una sesión válida');
    }

    console.log('[Auth Callback] Autenticación exitosa, redirigiendo...', {
      user: data.session.user?.email,
      expiresAt: data.session.expires_at,
      expiresIn: data.session.expires_in
    });

    // Asegurarse de que las cookies se establezcan correctamente
    const cookiesToSet = response.cookies.getAll();
    console.log('[Auth Callback] Cookies que se establecerán:', cookiesToSet.map(c => ({
      name: c.name,
      value: c.value ? '***' : 'empty',
      expires: c.expires,
      path: c.path,
      sameSite: c.sameSite,
      secure: c.secure,
      httpOnly: c.httpOnly
    })));
    
    // Forzar una recarga de la página para asegurar que el estado de autenticación se actualice
    response.headers.set('x-middleware-cache', 'no-cache');
    
    return response;
    
  } catch (error) {
    console.error('[Auth Callback] Error en el proceso de autenticación:', error);
    
    // Obtener más información del error
    let errorMessage = 'Error de autenticación';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    }
    
    console.error('[Auth Callback] Detalles del error:', {
      message: errorMessage,
      code: (error as any)?.code,
      status: (error as any)?.status,
      stack: (error as Error)?.stack
    });
    
    // Redirigir a la página de login con un mensaje de error detallado
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'auth_error');
    loginUrl.searchParams.set('message', encodeURIComponent(errorMessage));
    
    // Redirigir con encabezados de no caché
    const response = NextResponse.redirect(loginUrl, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    return response;
  }
}
