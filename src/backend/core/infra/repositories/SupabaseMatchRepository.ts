import { Match } from "../../domain/entities/MatchesEntity";
import { MatchRepository } from "../../domain/repositories/MatchesRepository";

export class SupabaseMatchRepository implements MatchRepository {
  constructor(private supabase: any) {}

  async getAll(): Promise<Match[]> {
    const { data, error } = await this.supabase
      .from("matches")
      .select("*")
      .order("fecha", { ascending: true });

    if (error) throw new Error(error.message);

    return data as Match[];
  }

  async getById(id: number): Promise<Match | null> {
    const { data, error } = await this.supabase
      .from("matches")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    return data as Match;
  }

  async getUpcoming(): Promise<Match[]> {
    const now = new Date().toISOString();
    const { data, error } = await this.supabase
      .from("matches")
      .select("*")
      .gte("fecha", now)
      .order("fecha", { ascending: true });

    if (error) throw new Error(error.message);

    return data as Match[];
  }
}
