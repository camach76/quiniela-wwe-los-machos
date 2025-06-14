import { Bet } from "../entities/betEntity";

export interface BetRepository {
  create(
    bet: Omit<Bet, "id" | "createdAt" | "updatedAt" | "puntosObtenidos">,
  ): Promise<Bet>;
  update(bet: Bet): Promise<Bet>;
  getByUser(userId: string): Promise<Bet[]>;
  getByMatchAndUser(matchId: number, userId: string): Promise<Bet | null>;
}
