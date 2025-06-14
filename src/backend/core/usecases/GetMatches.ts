import { Match } from "../domain/entities/MatchesEntity";
import { MatchRepository } from "../domain/repositories/MatchesRepository";

export class GetMatches {
  constructor(private repo: MatchRepository) {}

  async execute(): Promise<Match[]> {
    return await this.repo.getAll();
  }
}

export class GetUpcomingMatches {
  constructor(private repo: MatchRepository) {}

  async execute(): Promise<Match[]> {
    return await this.repo.getUpcoming();
  }
}
