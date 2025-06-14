import { ClubRanking } from "../../domain/entities/ClubRankingEntity";
import { ClubRankingRepository } from "../../domain/repositories/clubRankingRepository";

export class SupabaseClubRankingRepository implements ClubRankingRepository {
  constructor(private supabase: any) {}

  async getAll(): Promise<ClubRanking[]> {
    const { data, error } = await this.supabase
      .from("club_ranking")
      .select("*, club:club_id(*)") // Incluye la relación con la tabla de clubes
      .order("pts", { ascending: false });

    if (error) throw new Error(error.message);

    // Si no hay rankings registrados aún, devolvemos los clubes con valores por defecto
    if (!data || data.length === 0) {
      const { data: clubs, error: clubError } = await this.supabase
        .from("clubs")
        .select("*");

      if (clubError) throw new Error(clubError.message);

      return clubs.map((club: any) => ({
        club_id: club.id,
        club: club,
        pj: 0,
        g: 0,
        e: 0,
        p: 0,
        gf: 0,
        gc: 0,
        dg: 0,
        pts: 0,
        forma: [],
      })) as ClubRanking[];
    }

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
