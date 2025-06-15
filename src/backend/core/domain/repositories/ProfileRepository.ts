import { Profile } from "../entities/Profile";

export interface ProfileRepository {
  getProfile(userId: string): Promise<Profile | null>;
  updateProfile(userId: string, profileData: Partial<Profile>): Promise<Profile>;
  createProfile(profileData: Omit<Profile, 'id' | 'created_at'>): Promise<Profile>;
}
