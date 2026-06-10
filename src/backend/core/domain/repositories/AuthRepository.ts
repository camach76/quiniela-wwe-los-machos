import { UserEntity } from "@/backend/core/domain/entities/UserEntity";

export interface AuthRepository {
  register(
    name: string,
    email: string,
    password: string,
    company: string,
  ): Promise<UserEntity>;
}
