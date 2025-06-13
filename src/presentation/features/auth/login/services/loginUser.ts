import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export async function loginUser(email: string, password: string) {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  return data.user;
}
