import { Match } from "../../domain/entities/MatchesEntity";
import { supabase } from '@/presentation/utils/supabase/client'
import { MatchRepository } from "../../domain/repositories/MatchesRepository";

export class SupabaseMatchRepository implements MatchRepository {
  async getAll(): Promise<Match[]> {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .order("fecha", { ascending: true });

    if (error) throw new Error(error.message);
    return data as Match[];
  }

  async getById(id: number): Promise<Match | null> {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return data as Match;
  }

  async getUpcoming(): Promise<Match[]> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("matches")
      .select(`*, club_a:club_a_id(*), club_b:club_b_id(*)`)
      .gte("fecha", now)
      .is("resultado_a", null)
      .order("fecha", { ascending: true });

    if (error) throw new Error(error.message);

    return data.map((match: any) => ({
      ...match,
      clubAId: match.club_a_id,
      clubBId: match.club_b_id,
      clubA: match.club_a ?? null,
      clubB: match.club_b ?? null,
    }));
  }

  async getUpcomingLimited(limit: number): Promise<Match[]> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("matches")
      .select(`*, club_a:club_a_id(*), club_b:club_b_id(*)`)
      .gte("fecha", now)
      .is("resultado_a", null)
      .order("fecha", { ascending: true })
      .limit(limit);

    if (error) throw new Error(error.message);

    return data.map((match: any) => ({
      ...match,
      clubAId: match.club_a_id,
      clubBId: match.club_b_id,
      clubA: match.club_a ?? null,
      clubB: match.club_b ?? null,
    }));
  }

  async getCompleted(): Promise<Match[]> {
    const { data, error } = await supabase
      .from("matches")
      .select(`*, club_a:club_a_id(*), club_b:club_b_id(*)`)
      .not("resultado_a", "is", null)
      .not("resultado_b", "is", null)
      .order("fecha", { ascending: false });

    if (error) throw new Error(error.message);
    if (!data) return [];

    return data.map((match: any) => ({
      ...match,
      clubAId: match.club_a_id,
      clubBId: match.club_b_id,
      resultadoA: match.resultado_a,
      resultadoB: match.resultado_b,
      isComplete: true,
      clubA: match.club_a ?? null,
      clubB: match.club_b ?? null,
    }));
  }
}
