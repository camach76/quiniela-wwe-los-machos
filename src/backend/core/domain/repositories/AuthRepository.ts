import { UserEntity } from "@/backend/core/domain/entities/UserEntity";

export interface AuthRepository {
  register(email: string, password: string): Promise<UserEntity>;
}
