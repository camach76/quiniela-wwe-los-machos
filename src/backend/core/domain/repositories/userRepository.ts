import { UserEntity } from "@/backend/core/domain/entities/UserEntity";

export interface UserRepository {
  getRanking(): Promise<UserEntity[]>;
  getById(id: string): Promise<UserEntity | null>;
}
