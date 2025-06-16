import { SupabaseClubRankingRepository } from "@/backend/core/infra/repositories/SupabaseClubRankingRepository";
import { supabase } from "@/presentation/utils/supabase/client";

export async function getClubRanking() {
  const repo = new SupabaseClubRankingRepository(supabase);
  return await repo.getAll();
}
