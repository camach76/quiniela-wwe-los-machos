import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export async function logoutUser() {
  const supabase = createClientComponentClient();
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return { success: true };
}
