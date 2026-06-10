import { GetRankingUsers } from "../usecases/GetRankingUsers";
import { supabase } from '@/presentation/utils/supabase/client'
import { SupabaseUserRepository } from "../infra/repositories/SupabaseUserReposotory";

export class RankingService {
  private getRankingUseCase: GetRankingUsers;
  private supabase: any;

  constructor() {
    const userRepo = new SupabaseUserRepository(supabase);
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
