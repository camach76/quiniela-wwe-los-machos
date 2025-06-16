import { GetRankingUsers } from "../usecases/GetRankingUsers";
import { SupabaseUserRepository } from "../infra/repositories/SupabaseUserReposotory";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export class RankingService {
  private getRankingUseCase: GetRankingUsers;
  private supabase: any;

  constructor() {
    this.supabase = createClientComponentClient();
    const userRepo = new SupabaseUserRepository(this.supabase);
    this.getRankingUseCase = new GetRankingUsers(userRepo);
  }

  async getRanking(currentUserId: string) {
    try {
      const ranking = await this.getRankingUseCase.execute(currentUserId);
      return { data: ranking, error: null };
    } catch (error) {
      console.error('Error en RankingService.getRanking:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Error desconocido al obtener el ranking' 
      };
    }
  }
}

export const rankingService = new RankingService();
