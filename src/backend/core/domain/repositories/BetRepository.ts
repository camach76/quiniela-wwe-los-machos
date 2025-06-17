import { Bet } from "../entities/betEntity";

export interface BetRepository {
  create(
    bet: Omit<Bet, "id" | "createdAt" | "updatedAt" | "puntosObtenidos">,
  ): Promise<Bet>;
  update(bet: Bet): Promise<Bet>;
  getById(id: number): Promise<Bet | null>;
  getByUser(userId: string): Promise<Bet[]>;
  getByMatchAndUser(matchId: number, userId: string): Promise<Bet | null>;
}
