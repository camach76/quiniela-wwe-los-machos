import { AuthRepository } from "@/backend/core/domain/repositories/AuthRepository";
import { User } from "@/backend/core/domain/entities/User";

export class RegisterUser {
  constructor(private authRepo: AuthRepository) {}

  async execute(email: string, password: string): Promise<User> {
    return this.authRepo.register(email, password);
  }
}
