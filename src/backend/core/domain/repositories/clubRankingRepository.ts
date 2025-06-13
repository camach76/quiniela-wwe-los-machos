import { ClubRanking } from "../entities/ClubRankingEntity";

export interface ClubRankingRepository {
  getAll(): Promise<ClubRanking[]>;
  getByUserId(userId: string): Promise<ClubRanking | null>;
}
