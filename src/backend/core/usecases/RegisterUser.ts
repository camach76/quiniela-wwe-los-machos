import { AuthRepository } from "@/backend/core/domain/repositories/AuthRepository";
import { UserEntity } from "@/backend/core/domain/entities/UserEntity";

export class RegisterUser {
  constructor(private authRepo: AuthRepository) {}

  async execute(
    name: string,
    email: string,
    password: string,
    company: string,
  ): Promise<UserEntity> {
    return this.authRepo.register(name, email, password, company);
  }
}
