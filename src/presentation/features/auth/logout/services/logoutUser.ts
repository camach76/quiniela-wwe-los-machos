import { supabase } from '@/presentation/utils/supabase/client'

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return { success: true };
}
