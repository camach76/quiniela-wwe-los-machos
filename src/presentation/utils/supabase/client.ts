import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Asegúrate de que estas variables de entorno estén configuradas en tu archivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

export default supabase;
