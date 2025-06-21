import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export async function loginUser(email: string, password: string, rememberMe: boolean = false) {
  const supabase = createClientComponentClient();

  // Configurar las opciones de autenticación
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  
  // Si rememberMe está activado, configuramos una cookie de larga duración
  if (rememberMe && data.session) {
    // Configurar una cookie de larga duración (30 días)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    
    document.cookie = `sb-auth-token=${data.session.access_token}; expires=${expiresAt.toUTCString()}; path=/; samesite=lax${process.env.NODE_ENV === 'production' ? '; secure' : ''}`;
  }

  // Devolver tanto el usuario como el email para facilitar la redirección
  return {
    user: data.user,
    email: data.user?.email || email // Usar el email del usuario o el proporcionado si no está disponible
  };
}
