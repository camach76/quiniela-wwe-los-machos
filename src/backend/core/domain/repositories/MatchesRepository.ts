import { Match } from "../entities/MatchesEntity";

export interface MatchRepository {
  getAll(): Promise<Match[]>;
  getById(id: number): Promise<Match | null>;
  getUpcoming(): Promise<Match[]>;
  getUpcomingLimited(limit: number): Promise<Match[]>;
  getCompleted(): Promise<Match[]>;
}
