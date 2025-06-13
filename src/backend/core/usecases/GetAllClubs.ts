import { Club } from "../domain/entities/clubEntity";
import { ClubRepository } from "../domain/repositories/clubRepository";

export class GetAllClubs {
  constructor(private clubRepository: ClubRepository) {}

  async execute(): Promise<Club[]> {
    return await this.clubRepository.getAll();
  }
}
