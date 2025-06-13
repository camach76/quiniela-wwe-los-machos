import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AuthRepository } from "@/backend/core/domain/repositories/AuthRepository";
import { User } from "@/backend/core/domain/entities/User";

export class SupabaseAuthRepository implements AuthRepository {
  async register(email: string, password: string): Promise<User> {
    const supabase = createClientComponentClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw new Error(error.message);
    return { id: data.user?.id ?? "", email: data.user?.email ?? "" };
  }
}
