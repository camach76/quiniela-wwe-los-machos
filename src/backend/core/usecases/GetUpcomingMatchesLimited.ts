import { Match } from "../domain/entities/MatchesEntity";
import { MatchRepository } from "../domain/repositories/MatchesRepository";

export class GetUpcomingMatchesLimited {
  constructor(private repo: MatchRepository) {}

  async execute(limit: number = 3): Promise<Match[]> {
    return await this.repo.getUpcomingLimited(limit);
  }
}
