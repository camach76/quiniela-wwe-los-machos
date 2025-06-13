import { ClubRanking } from "../domain/entities/ClubRankingEntity";
import { ClubRankingRepository } from "../domain/repositories/clubRankingRepository";

export class GetClubRanking {
  constructor(private repo: ClubRankingRepository) {}

  async execute(userId?: string): Promise<ClubRanking[] | ClubRanking | null> {
    if (userId && userId !== "anonymous") {
      return await this.repo.getByUserId(userId);
    }

    return await this.repo.getAll();
  }
}
