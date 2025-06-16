import { Bet } from "../../domain/entities/betEntity";
import { BetRepository } from "../../domain/repositories/BetRepository";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export class SupabaseBetRepository implements BetRepository {
  private supabase: any;

  constructor() {
    this.supabase = createClientComponentClient();
  }

  async create(
    input: Omit<Bet, "id" | "createdAt" | "updatedAt" | "puntosObtenidos">,
  ): Promise<Bet> {
    const betData = {
      user_id: input.userId,
      match_id: input.matchId,
      prediccion_a: input.prediccionA,
      prediccion_b: input.prediccionB,
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
      prediccionA: data.prediccion_a,
      prediccionB: data.prediccion_b,
      puntosObtenidos: data.puntos_obtenidos,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async update(bet: Bet): Promise<Bet> {
    const betData = {
      prediccion_a: bet.prediccionA,
      prediccion_b: bet.prediccionB,
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
      prediccionA: data.prediccion_a,
      prediccionB: data.prediccion_b,
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
      prediccionA: data.prediccion_a,
      prediccionB: data.prediccion_b,
      puntosObtenidos: data.puntos_obtenidos,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async getByUser(userId: string): Promise<Bet[]> {
    try {
      console.log("🔍 Obteniendo apuestas para el usuario:", userId);
      
      if (!userId) {
        console.error('❌ No se proporcionó un ID de usuario válido');
        return [];
      }

      console.log('🔌 Conectando a Supabase...');
      
      // Usamos una consulta más segura que respete las políticas RLS
      const { data, error, status, statusText } = await this.supabase
        .from('bets')
        .select(`
          id,
          user_id,
          match_id,
          prediccion_a,
          prediccion_b,
          puntos_obtenidos,
          created_at,
          updated_at
        `)
        .eq('user_id', userId);

      console.log('📊 Respuesta de Supabase:', { status, statusText, error });

      if (error) {
        console.error('❌ Error al obtener apuestas:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          status: error.status
        });
        throw error;
      }

      console.log(`✅ Se encontraron ${data?.length || 0} apuestas`);
      
      return (data || []).map((bet: any) => ({
        id: bet.id,
        userId: bet.user_id,
        matchId: bet.match_id,
        prediccionA: bet.prediccion_a,
        prediccionB: bet.prediccion_b,
        puntosObtenidos: bet.puntos_obtenidos,
        createdAt: bet.created_at,
        updatedAt: bet.updated_at,
      }));
    } catch (error: unknown) {
      console.error('❌ Error en getByUser:', error);
      // Si hay un error de permisos, devolvemos un array vacío
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('permission denied')) {
        console.warn('⚠️ Permiso denegado al acceder a las apuestas');
        return [];
      }
      throw error;
    }
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
        prediccionA: data.prediccion_a,
        prediccionB: data.prediccion_b,
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
