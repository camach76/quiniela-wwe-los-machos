import { Match } from "../domain/entities/MatchesEntity";
import { MatchRepository } from "../domain/repositories/MatchesRepository";

export class GetCompletedMatches {
  constructor(private matchRepository: MatchRepository) {}

  async execute(): Promise<Match[]> {
    try {
      return await this.matchRepository.getCompleted();
    } catch (error) {
      console.error('Error en GetCompletedMatches:', error);
      throw new Error('No se pudieron obtener los partidos completados');
    }
  }
}
