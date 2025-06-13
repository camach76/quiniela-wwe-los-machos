import { User } from "@/backend/core/domain/entities/User";

export interface AuthRepository {
  register(email: string, password: string): Promise<User>;
}
