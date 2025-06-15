import { useState, useEffect } from 'react';
import { Club } from '@/backend/core/domain/entities/clubEntity';
import { ClubRepository } from '@/backend/core/domain/repositories/clubRepository';
import { SupabaseClubRepository } from '@/backend/core/infra/repositories/SupabaseClubRepository';
import { supabase } from '@/presentation/utils/supabase/client';

export function useClubs() {
  const [clubs, setClubs] = useState<Record<number, Club>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clubRepo] = useState<ClubRepository>(new SupabaseClubRepository(supabase));

  // Cargar todos los clubes
  const loadClubs = async () => {
    try {
      setLoading(true);
      const clubes = await clubRepo.getAll();
      
      // Convertir el array a un objeto con id como clave para un acceso más rápido
      const clubsMap = clubes.reduce<Record<number, Club>>((acc, club) => {
        acc[club.id] = club;
        return acc;
      }, {});
      
      setClubs(clubsMap);
      setError(null);
    } catch (err) {
      console.error('Error loading clubs:', err);
      setError('Error al cargar los equipos');
    } finally {
      setLoading(false);
    }
  };

  // Cargar clubes al montar el componente
  useEffect(() => {
    loadClubs();
  }, []);

  return {
    clubs,
    loading,
    error,
    getClubById: (id: number) => clubs[id] || { id, nombre: `Equipo ${id}`, pais: 'Desconocido', logoUrl: '' },
  };
}
