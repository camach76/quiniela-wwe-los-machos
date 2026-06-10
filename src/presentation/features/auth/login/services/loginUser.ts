import { supabase } from "@/presentation/utils/supabase/client";

export async function loginUser(
  email: string,
  password: string,
  rememberMe: boolean = false,
) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data.user;
}
