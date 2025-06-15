import { Bet } from "../../domain/entities/betEntity";
import { BetRepository } from "../../domain/repositories/BetRepository";

export class SupabaseBetRepository implements BetRepository {
  constructor(private supabase: any) {}

  async create(
    input: Omit<Bet, "id" | "createdAt" | "updatedAt" | "puntosObtenidos">,
  ): Promise<Bet> {
    const betData = {
      user_id: input.userId,
      match_id: input.matchId,
      prediccion_a: input.prediccion_a,
      prediccion_b: input.prediccion_b,
      puntos_obtenidos: 0,
    };

    const { data, error } = await this.supabase
      .from("bets")
      .insert([betData])
      .select(
        "id, user_id, match_id, prediccion_a, prediccion_b, puntos_obtenidos, created_at, updated_at",
      )
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      userId: data.user_id,
      matchId: data.match_id,
      prediccion_a: data.prediccion_a,
      prediccion_b: data.prediccion_b,
      puntosObtenidos: data.puntos_obtenidos,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async update(bet: Bet): Promise<Bet> {
    const betData = {
      prediccion_a: bet.prediccion_a,
      prediccion_b: bet.prediccion_b,
      puntos_obtenidos: bet.puntosObtenidos,
    };

    const { data, error } = await this.supabase
      .from("bets")
      .update(betData)
      .eq("id", bet.id)
      .select(
        "id, user_id, match_id, prediccion_a, prediccion_b, puntos_obtenidos, created_at, updated_at",
      )
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      userId: data.user_id,
      matchId: data.match_id,
      prediccion_a: data.prediccion_a,
      prediccion_b: data.prediccion_b,
      puntosObtenidos: data.puntos_obtenidos,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async getById(betId: string): Promise<Bet | null> {
    const { data, error } = await this.supabase
      .from("bets")
      .select(
        "id, user_id, match_id, prediccion_a, prediccion_b, puntos_obtenidos, created_at, updated_at",
      )
      .eq("id", betId)
      .single();

    if (error) throw new Error(error.message);
    if (!data) return null;

    return {
      id: data.id,
      userId: data.user_id,
      matchId: data.match_id,
      prediccion_a: data.prediccion_a,
      prediccion_b: data.prediccion_b,
      puntosObtenidos: data.puntos_obtenidos,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async getByUser(userId: string): Promise<Bet[]> {
    console.log("🧪 userId:", userId);
    const { data, error } = await this.supabase
      .from("bets")
      .select(
        "id, user_id, match_id, prediccion_a, prediccion_b, puntos_obtenidos, created_at, updated_at",
      )
      .eq("user_id", userId);

    if (error) throw new Error(error.message);

    return data.map((bet: any) => ({
      id: bet.id,
      userId: bet.user_id,
      matchId: bet.match_id,
      prediccionA: bet.prediccion_a,
      prediccionB: bet.prediccion_b,
      puntosObtenidos: bet.puntos_obtenidos,
      createdAt: bet.created_at,
      updatedAt: bet.updated_at,
    }));
  }

  async getByMatchAndUser(
    matchId: number,
    userId: string,
  ): Promise<Bet | null> {
    try {
      const { data, error } = await this.supabase
        .from("bets")
        .select(
          "id, user_id, match_id, prediccion_a, prediccion_b, puntos_obtenidos, created_at, updated_at",
        )
        .eq("match_id", matchId)
        .eq("user_id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null; // sin resultados
        }
        throw error;
      }

      if (!data) return null;

      return {
        id: data.id,
        userId: data.user_id,
        matchId: data.match_id,
        prediccion_a: data.prediccion_a,
        prediccion_b: data.prediccion_b,
        puntosObtenidos: data.puntos_obtenidos,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error("Error en getByMatchAndUser:", error);
      throw error;
    }
  }
}
