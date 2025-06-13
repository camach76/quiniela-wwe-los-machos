import { UserEntity } from "../domain/entities/UserEntity";
import { UserRepository } from "../domain/repositories/userRepository";

export class GetRankingUsers {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(
    currentUserId: string,
  ): Promise<ReturnType<UserEntity["toRankingView"]>[]> {
    const users = await this.userRepo.getRanking();
    return users.map((user) => user.toRankingView(currentUserId));
  }
}
