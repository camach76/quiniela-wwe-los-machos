import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Configuración básica de Supabase
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    // Usar localStorage para mantener la sesión
    storage: {
      getItem: (key) => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(key);
      },
      setItem: (key, value) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(key, value);
      },
      removeItem: (key) => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(key);
      },
    },
  },
});

// Función para limpiar completamente la sesión
export const clearSupabaseSession = async () => {
  try {
    console.log('[Supabase] Limpiando sesión...');
    
    // 1. Cerrar sesión en Supabase
    const { error: signOutError } = await supabase.auth.signOut();
    
    if (signOutError) {
      console.error('[Supabase] Error al cerrar sesión:', signOutError);
    } else {
      console.log('[Supabase] Sesión cerrada correctamente');
    }
    
    // 2. Limpiar cookies manualmente
    if (typeof document !== 'undefined') {
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.trim().split('=');
        if (name.includes('sb-') || name.includes('supabase-')) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });
    }
    
    // 3. Limpiar almacenamiento local
    if (typeof window !== 'undefined') {
      Object.keys(localStorage).forEach(key => {
        if (key.includes('sb-') || key.includes('supabase-')) {
          localStorage.removeItem(key);
        }
      });
      
      Object.keys(sessionStorage).forEach(key => {
        if (key.includes('sb-') || key.includes('supabase-')) {
          sessionStorage.removeItem(key);
        }
      });
    }
    
    console.log('[Supabase] Sesión limpiada completamente');
    return true;
  } catch (error) {
    console.error('[Supabase] Error al limpiar la sesión:', error);
    return false;
  }
};

export default supabase;
