import { Bet } from "../../domain/entities/betEntity";
import { BetRepository } from "../../domain/repositories/BetRepository";

export class SupabaseBetRepository implements BetRepository {
  constructor(private supabase: any) {}

  async create(
    input: Omit<Bet, "id" | "createdAt" | "updatedAt" | "puntosObtenidos">,
  ): Promise<Bet> {
    const { data, error } = await this.supabase
      .from("bets")
      .insert([{ ...input }])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Bet;
  }

  async update(bet: Bet): Promise<Bet> {
    const { data, error } = await this.supabase
      .from("bets")
      .update(bet)
      .eq("id", bet.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Bet;
  }

  async getByUser(userId: string): Promise<Bet[]> {
    const { data, error } = await this.supabase
      .from("bets")
      .select("*")
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return data as Bet[];
  }

  async getByMatchAndUser(
    matchId: number,
    userId: string,
  ): Promise<Bet | null> {
    const { data, error } = await this.supabase
      .from("bets")
      .select("*")
      .eq("match_id", matchId)
      .eq("user_id", userId)
      .single();
    if (error) return null;
    return data as Bet;
  }
}
