import { Match } from "@/presentation/hooks/useCompletedMatches";
import supabase from "@/presentation/utils/supabase/client";

export const matchService = {
  async getManyByIds(ids: number[]): Promise<Match[]> {
    const { data, error } = await supabase
      .from("match")
      .select("*")
      .in("id", ids);

    if (error) throw new Error(error.message);
    return data ?? [];
  },
};
