import { Club } from "../entities/clubEntity";

export interface ClubRepository {
  getAll(): Promise<Club[]>;
  getById(id: number): Promise<Club | null>;
}
