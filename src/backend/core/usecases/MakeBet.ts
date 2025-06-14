import { Bet } from "../domain/entities/betEntity";
import { BetRepository } from "../domain/repositories/BetRepository";

export class MakeBet {
  constructor(private repo: BetRepository) {}

  async execute(input: {
    userId: string;
    matchId: number;
    prediccionA: number;
    prediccionB: number;
  }): Promise<Bet> {
    const existing = await this.repo.getByMatchAndUser(
      input.matchId,
      input.userId,
    );
    if (existing) {
      const updated = {
        ...existing,
        prediccionA: input.prediccionA,
        prediccionB: input.prediccionB,
        updatedAt: new Date().toISOString(),
      };
      return this.repo.update(updated);
    }

    return this.repo.create({ ...input });
  }
}
