import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

function removeAuthCookies() {
  if (typeof document === 'undefined') return

  const cookies = document.cookie.split(';')

  cookies.forEach((cookie) => {
    const [rawName] = cookie.split('=')
    const name = rawName?.trim()

    if (!name) return

    if (name === 'sb-auth-token' || name.startsWith('sb-')) {
      document.cookie = `${name}=; Max-Age=0; path=/; samesite=lax`
    }
  })
}

function removeStoredAuthKeys() {
  if (typeof window === 'undefined') return

  const authKeys = Object.keys(window.localStorage).filter((key) =>
    key.includes('-auth-token') || key.includes('supabase.auth.token')
  )

  authKeys.forEach((key) => window.localStorage.removeItem(key))
}

export function isInvalidRefreshTokenError(error: unknown) {
  if (!(error instanceof Error)) return false

  return (
    error.message.includes('Invalid Refresh Token') ||
    error.message.includes('refresh_token_not_found')
  )
}

export const clearSupabaseSession = async () => {
  try {
    const { error } = await supabase.auth.signOut({ scope: 'local' })
    if (error) console.error('[Supabase] Error al cerrar sesión:', error)
  } catch (error) {
    console.error('[Supabase] Error al limpiar la sesión:', error)
  }

  removeAuthCookies()
  removeStoredAuthKeys()
  return true
}

export default supabase
