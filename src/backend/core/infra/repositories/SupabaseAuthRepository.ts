import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AuthRepository } from "@/backend/core/domain/repositories/AuthRepository";
import { UserEntity } from "@/backend/core/domain/entities/UserEntity";

export class SupabaseAuthRepository implements AuthRepository {
  async register(email: string, password: string): Promise<UserEntity> {
    const supabase = createClientComponentClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.user) {
      throw new Error(error?.message || "No user returned");
    }

    const { id } = data.user;
    const username = email.split("@")[0];

    return new UserEntity(
      id,
      email,
      username,
      0, // puntos
      0, // aciertos
      0, // total_apostados
      0, // precision
      0, // racha
      "user", // rol por defecto
      new Date().toISOString(), // fecha creación
    );
  }
}
