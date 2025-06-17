import { createClient } from '@supabase/supabase-js';
import { Club } from '@/backend/core/domain/entities/clubEntity';
import { ClubRepository } from '@/backend/core/domain/repositories/clubRepository';

export class SupabaseClubRepository implements ClubRepository {
    constructor(private supabase: any) {}
  
    async getAll(): Promise<Club[]> {
      const { data, error } = await this.supabase
        .from('clubs')
        .select('id, nombre, pais, logo_url')
        .order('nombre', { ascending: true });
  
      if (error) throw new Error(error.message);
  
      return (data ?? []).map((club: any) => ({
        id: club.id,
        nombre: club.nombre,
        pais: club.pais,
        logo_url: club.logo_url
      }));
    }
  
    async getById(id: number): Promise<Club | null> {
      const { data, error } = await this.supabase
        .from('clubs')
        .select('*')
        .eq('id', id)
        .single();
  
      if (error) return null;
  
      return {
        id: data.id,
        nombre: data.nombre,
        pais: data.pais,
        logo_url: data.logo_url
      };
    }
  }
