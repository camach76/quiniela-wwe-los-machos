import { createClient as createSupabaseClient, type SupabaseClientOptions } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Verificar variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Tipo personalizado para el almacenamiento seguro
type SafeStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

// Función para manejar el almacenamiento de manera segura
const createSafeStorage = (): SafeStorage => {
  return {
    getItem: (key: string) => {
      try {
        if (typeof window === 'undefined') return null;
        
        // Para el code_verifier, priorizamos sessionStorage
        if (key.includes('code-verifier') || key.includes('pkce')) {
          const value = sessionStorage.getItem(key) || localStorage.getItem(key);
          console.log(`[getItem] ${key}:`, value ? 'Encontrado' : 'No encontrado');
          return value;
        }
        
        // Para otros datos, primero intentamos con sessionStorage
        const sessionValue = sessionStorage.getItem(key);
        if (sessionValue) return sessionValue;
        
        // Si no está en sessionStorage, intentamos con localStorage
        return localStorage.getItem(key);
      } catch (error) {
        console.error('Error al leer del almacenamiento:', error);
        return null;
      }
    },
    setItem: (key: string, value: string) => {
      try {
        if (typeof window === 'undefined') return;
        
        // Para el code_verifier, guardamos en ambos almacenamientos
        if (key.includes('code-verifier') || key.includes('pkce')) {
          console.log(`[setItem] Guardando ${key} en sessionStorage`);
          sessionStorage.setItem(key, value);
          // También guardamos en localStorage como respaldo
          localStorage.setItem(key, value);
        } else {
          // Para otros datos, usamos sessionStorage por defecto
          sessionStorage.setItem(key, value);
        }
      } catch (error) {
        console.error('Error al guardar en el almacenamiento:', error);
      }
    },
    removeItem: (key: string) => {
      try {
        if (typeof window === 'undefined') return;
        
        console.log(`[removeItem] Eliminando ${key} de almacenamiento`);
        // Eliminamos de ambos almacenamientos
        sessionStorage.removeItem(key);
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error al eliminar del almacenamiento:', error);
      }
    },
  };
};

// Configuración de autenticación
const authOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce' as const,
    storage: createSafeStorage(),
    // Usar la clave de almacenamiento específica del proyecto
    storageKey: 'sb-pmjtdcskhdsqltzuxpts-auth-token',
    // Habilitar el modo de depuración
    debug: process.env.NODE_ENV === 'development',
    // Configuración de cookies para el flujo PKCE
    cookieOptions: {
      name: 'sb-auth-token',
      lifetime: 60 * 60 * 24 * 7, // 7 días
      domain: '',
      path: '/',
      sameSite: 'lax' as const
    }
  }
};

// Crear el cliente de Supabase
export const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, authOptions);

// Configurar el manejador de errores global
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session);
});

// Función para obtener el code_verifier del almacenamiento
export const getCodeVerifier = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Lista de posibles claves donde podría estar el code_verifier
  const possibleKeys = [
    'sb-pmjtdcskhdsqltzuxpts-auth-token-code-verifier',
    'sb-auth-token-code-verifier',
    'sb-pkce-code-verifier',
    'sb-code-verifier',
    'sb-pmjtdcskhdsqltzuxpts-code-verifier',
    'code-verifier',
  ];
  
  // Buscar en sessionStorage primero
  for (const key of possibleKeys) {
    const value = sessionStorage.getItem(key);
    if (value) {
      console.log(`[getCodeVerifier] Encontrado en sessionStorage con clave: ${key}`);
      return value;
    }
  }
  
  // Si no está en sessionStorage, buscar en localStorage
  for (const key of possibleKeys) {
    const value = localStorage.getItem(key);
    if (value) {
      console.log(`[getCodeVerifier] Encontrado en localStorage con clave: ${key}`);
      return value;
    }
  }
  
  // Si no se encuentra en ningún lado, buscar en todas las claves
  console.log('[getCodeVerifier] Buscando en todas las claves de almacenamiento...');
  
  // Buscar en sessionStorage
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && (key.includes('verifier') || key.includes('pkce'))) {
      const value = sessionStorage.getItem(key);
      if (value) {
        console.log(`[getCodeVerifier] Encontrado en sessionStorage con clave personalizada: ${key}`);
        return value;
      }
    }
  }
  
  // Buscar en localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('verifier') || key.includes('pkce'))) {
      const value = localStorage.getItem(key);
      if (value) {
        console.log(`[getCodeVerifier] Encontrado en localStorage con clave personalizada: ${key}`);
        return value;
      }
    }
  }
  
  console.log('[getCodeVerifier] No se encontró el code_verifier en ningún almacenamiento');
  console.log('Claves en sessionStorage:', Array.from({ length: sessionStorage.length }, (_, i) => sessionStorage.key(i)));
  console.log('Claves en localStorage:', Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i)));
  
  return null;
};

// Función para limpiar todos los datos de autenticación
export const clearAuthData = (): void => {
  if (typeof window === 'undefined') return;
  
  console.log('Limpiando todos los datos de autenticación...');
  
  // Limpiar sessionStorage
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && (key.startsWith('sb-') || key.includes('auth') || key.includes('token') || key.includes('pkce') || key.includes('verifier'))) {
      sessionStorage.removeItem(key);
    }
  }
  
  // Limpiar localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('sb-') || key.includes('auth') || key.includes('token') || key.includes('pkce') || key.includes('verifier'))) {
      localStorage.removeItem(key);
    }
  }
  
  // Limpiar cookies
  document.cookie.split(';').forEach(cookie => {
    const [name] = cookie.trim().split('=');
    if (name && (name.startsWith('sb-') || name.includes('auth') || name.includes('token'))) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  });
  
  console.log('Datos de autenticación limpiados correctamente');
};

/**
 * Función para limpiar completamente la sesión
 */
export async function clearSupabaseSession() {
  if (typeof window === 'undefined') return true;
  
  try {
    // Cerrar sesión en Supabase
    await supabase.auth.signOut();
    
    // Limpiar el almacenamiento local
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sb-') || key.includes('supabase') || key.includes('pkce') || key.includes('code-verifier')) {
        localStorage.removeItem(key);
      }
    });
    
    // Limpiar el almacenamiento de sesión
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('sb-') || key.includes('supabase') || key.includes('pkce') || key.includes('code-verifier')) {
        sessionStorage.removeItem(key);
      }
    });
    
    // Limpiar cookies
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.trim().split('=');
      if (name && (name.includes('sb-') || name.includes('supabase'))) {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
    });
    
    console.log('[Supabase] Sesión limpiada correctamente');
    return true;
  } catch (error) {
    console.error('[Supabase] Error al limpiar la sesión:', error);
    return false;
  }
}

export default supabase;
