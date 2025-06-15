import supabase from "@/presentation/utils/supabase/client";
import { Club } from "@/types/partidos";

export const clubService = {
  async getAll(): Promise<Club[]> {
    const { data, error } = await supabase.from("clubs").select("*");
    if (error) throw new Error(error.message);
    return data ?? [];
  },
};
