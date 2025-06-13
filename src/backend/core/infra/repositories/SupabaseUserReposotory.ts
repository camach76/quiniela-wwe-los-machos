import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase.types";
import { UserEntity } from "@/backend/core/domain/entities/UserEntity";
import { UserRepository } from "../../domain/repositories/userRepository";

export class SupabaseUserRepository implements UserRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getRanking(): Promise<UserEntity[]> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .order("puntos", { ascending: false });

    if (error || !data)
      throw new Error(error?.message || "Error al obtener ranking");

    return data.map((u) =>
      UserEntity.fromPrimitives({
        id: u.id,
        email: u.email,
        username: u.username,
        puntos: u.puntos ?? 0,
        aciertos: u.aciertos ?? 0,
        total_apostados: u.total_apostados ?? 0,
        precision: u.precision ?? 0,
        racha: u.racha ?? 0,
        role: u.role as "user" | "admin",
        created_at: u.created_at,
      }),
    );
  }

  async getById(id: string): Promise<UserEntity | null> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    return UserEntity.fromPrimitives({
      id: data.id,
      email: data.email,
      username: data.username,
      puntos: data.puntos ?? 0,
      aciertos: data.aciertos ?? 0,
      total_apostados: data.total_apostados ?? 0,
      precision: data.precision ?? 0,
      racha: data.racha ?? 0,
      role: data.role as "user" | "admin",
      created_at: data.created_at,
    });
  }
}
