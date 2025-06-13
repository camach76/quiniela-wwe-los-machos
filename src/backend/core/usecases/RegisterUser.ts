import { AuthRepository } from "@/backend/core/domain/repositories/AuthRepository";
import { UserEntity } from "@/backend/core/domain/entities/UserEntity";

export class RegisterUser {
  constructor(private authRepo: AuthRepository) {}

  async execute(email: string, password: string): Promise<UserEntity> {
    return this.authRepo.register(email, password);
  }
}
