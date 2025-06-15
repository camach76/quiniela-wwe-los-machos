import { SupabaseClient } from '@supabase/supabase-js';
import { Profile } from '../../domain/entities/Profile';
import { ProfileRepository } from '../../domain/repositories/ProfileRepository';

export class SupabaseProfileRepository implements ProfileRepository {
  constructor(private supabase: SupabaseClient) {}

  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.error('Error fetching profile:', error?.message);
      return null;
    }

    // Mapear los datos de la base de datos a nuestro modelo de dominio
    return this.mapToProfile(data);
  }

  async updateProfile(userId: string, profileData: Partial<Profile>): Promise<Profile> {
    const { data, error } = await this.supabase
      .from('profiles')
      .update({
        username: profileData.username,
        full_name: profileData.full_name,
        phone: profileData.phone,
        location: profileData.location,
        bio: profileData.bio,
        website: profileData.website,
        facebook_url: profileData.facebook_url,
        twitter_url: profileData.twitter_url,
        instagram_url: profileData.instagram_url,
        notifications_email: profileData.notifications_email,
        notifications_push: profileData.notifications_push,
        notifications_results: profileData.notifications_results,
        notifications_new_matches: profileData.notifications_new_matches,
        notifications_ranking_updates: profileData.notifications_ranking_updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error.message);
      throw new Error('Error al actualizar el perfil');
    }

    return this.mapToProfile(data);
  }

  async createProfile(profileData: Omit<Profile, 'id' | 'created_at'>): Promise<Profile> {
    const { data, error } = await this.supabase
      .from('profiles')
      .insert({
        username: profileData.username,
        email: profileData.email,
        full_name: profileData.full_name,
        phone: profileData.phone,
        location: profileData.location,
        bio: profileData.bio,
        website: profileData.website,
        facebook_url: profileData.facebook_url,
        twitter_url: profileData.twitter_url,
        instagram_url: profileData.instagram_url,
        notifications_email: profileData.notifications_email ?? true,
        notifications_push: profileData.notifications_push ?? true,
        notifications_results: profileData.notifications_results ?? true,
        notifications_new_matches: profileData.notifications_new_matches ?? true,
        notifications_ranking_updates: profileData.notifications_ranking_updates ?? true,
        role: profileData.role ?? 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error.message);
      throw new Error('Error al crear el perfil');
    }

    return this.mapToProfile(data);
  }

  private mapToProfile(data: any): Profile {
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      full_name: data.full_name || null,
      avatar_url: data.avatar_url || null,
      phone: data.phone || null,
      location: data.location || null,
      bio: data.bio || null,
      website: data.website || null,
      created_at: data.created_at,
      updated_at: data.updated_at || null,
      aciertos: data.aciertos || 0,
      precision: data.precision || 0,
      puntos: data.puntos || 0,
      racha: data.racha || 0,
      total_apostados: data.total_apostados || 0,
      role: data.role || 'user',
      facebook_url: data.facebook_url || null,
      twitter_url: data.twitter_url || null,
      instagram_url: data.instagram_url || null,
      notifications_email: data.notifications_email ?? true,
      notifications_push: data.notifications_push ?? true,
      notifications_results: data.notifications_results ?? true,
      notifications_new_matches: data.notifications_new_matches ?? true,
      notifications_ranking_updates: data.notifications_ranking_updates ?? true,
    };
  }
}
