import { ClubRanking } from "../../domain/entities/ClubRankingEntity";
import { ClubRankingRepository } from "../../domain/repositories/clubRankingRepository";

export class SupabaseClubRankingRepository implements ClubRankingRepository {
  constructor(private supabase: any) {}

  async getAll(): Promise<ClubRanking[]> {
    const { data, error } = await this.supabase
      .from("club_ranking")
      .select("*")
      .order("pts", { ascending: false });

    if (error) throw new Error(error.message);

    return data as ClubRanking[];
  }

  async getByUserId(userId: string): Promise<ClubRanking | null> {
    const { data, error } = await this.supabase
      .from("club_ranking")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !data) return null;

    return data as ClubRanking;
  }
}
