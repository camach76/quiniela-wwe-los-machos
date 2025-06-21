import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";

type User = {
  id: string;
  email?: string;
  user_metadata?: {
    user_role?: 'admin' | 'user';
  };
  app_metadata?: {
    provider?: string;
    [key: string]: any;
  };
};

/**
 * Obtiene el perfil del usuario actual
 * @returns El perfil del usuario o null si no está autenticado
 */
export async function getUserProfile() {
  try {
    const supabase = createClientComponentClient<Database>();
    
    // Obtener la sesión actual
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error al obtener la sesión:', sessionError);
      return null;
    }
    
    if (!session?.user) {
      console.log('No hay sesión de usuario activa');
      return null;
    }
    
    console.log('Usuario de la sesión:', {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role
    });
    
    // Verificar si el usuario es administrador
    const isAdmin = session.user.email === 'admin@quinela.com';
    
    // Crear un perfil básico basado en la sesión
    const profile = {
      id: session.user.id,
      email: session.user.email || '',
      role: isAdmin ? 'admin' : 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('Perfil del usuario:', profile);
    return profile;
  } catch (error) {
    console.error('Error en getUserProfile:', error);
    return null;
  }
}

/**
 * Verifica si el usuario actual es administrador
 * @returns true si el usuario es administrador, false en caso contrario
 */
export async function isUserAdmin() {
  try {
    const profile = await getUserProfile();
    console.log('Rol del usuario en isUserAdmin:', profile?.role);
    return profile?.role === 'admin';
  } catch (error) {
    console.error('Error en isUserAdmin:', error);
    return false;
  }
}

/**
 * Obtiene la ruta de redirección basada en el usuario autenticado
 * @returns La ruta de redirección ('/admin' para administradores, '/dashboard' para usuarios normales)
 */
export async function getRedirectPath() {
  try {
    // Obtener la sesión actual
    const supabase = createClientComponentClient<Database>();
    const { data: { session } } = await supabase.auth.getSession();
    
    // Si no hay sesión, redirigir al login
    if (!session?.user) {
      console.log('No hay sesión activa, redirigiendo a /login');
      return '/login';
    }
    
    // Determinar la ruta basada en el correo del usuario
    const userEmail = session.user.email;
    const isAdmin = userEmail === 'admin@quinela.com';
    const redirectPath = isAdmin ? '/admin' : '/dashboard';
    
    console.log(`Redirigiendo a ${redirectPath} (usuario: ${userEmail}, admin: ${isAdmin})`);
    return redirectPath;
  } catch (error) {
    console.error('Error al determinar la ruta de redirección:', error);
    // En caso de error, redirigir al dashboard por defecto
    return '/dashboard';
  }
}
