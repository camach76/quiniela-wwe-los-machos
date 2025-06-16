import { useState, useEffect, useMemo, useCallback } from 'react';
import { getCachedData, setCachedData, clearCachedData } from '@/presentation/utils/storage';
import { SupabaseMatchRepository } from '@/backend/core/infra/repositories/SupabaseMatchRepository';
import { SupabaseClubRepository } from '@/backend/core/infra/repositories/SupabaseClubRepository';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { supabase } from '@/presentation/utils/supabase/client'; // Cliente de Supabase

const UPCOMING_MATCHES_CACHE_KEY = 'quiniela-upcoming-matches-cache';

interface Club {
  id: number;
  nombre: string;
  logo_url: string;
  fondo_url: string;
}

interface Match {
  id: number;
  clubAId: number;
  clubBId: number;
  fecha: string;
  estadio: string;
  resultadoA: number | null;
  resultadoB: number | null;
  clubA?: Club;
  clubB?: Club;
}

export const useUpcomingMatches = (filterDate?: Date) => {
  const [allMatches, setAllMatches] = useState<Match[]>(() => {
    if (typeof window !== 'undefined') {
      return getCachedData<Match[]>(UPCOMING_MATCHES_CACHE_KEY) || [];
    }
    return [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtrar partidos por fecha si se proporciona
  const matches = useMemo(() => {
    if (!filterDate) return allMatches;
    
    return allMatches.filter(match => {
      try {
        const matchDate = new Date(match.fecha);
        return (
          matchDate.getDate() === filterDate.getDate() &&
          matchDate.getMonth() === filterDate.getMonth() &&
          matchDate.getFullYear() === filterDate.getFullYear()
        );
      } catch (err) {
        console.error('Error al procesar fecha del partido:', match, err);
        return false;
      }
    });
  }, [allMatches, filterDate]);

  const fetchData = useCallback(async () => {
    try {
      console.log('Iniciando carga de partidos...');
      // Usar caché si existe
      const cachedData = getCachedData<Match[]>(UPCOMING_MATCHES_CACHE_KEY);
      if (cachedData) {
        console.log('Usando datos en caché:', cachedData);
        setAllMatches(cachedData);
        setLoading(false);
        return cachedData;
      }

      setLoading(true);
      
      // Obtener partidos y clubes usando los repositorios de Supabase
      console.log('Obteniendo partidos y clubes de Supabase...');
      const matchRepo = new SupabaseMatchRepository();
      const clubRepo = new SupabaseClubRepository(supabase);
      
      const [matchesData, clubsData] = await Promise.all([
        matchRepo.getUpcoming(),
        clubRepo.getAll()
      ]);
      
      console.log('Datos de partidos obtenidos:', matchesData);
      console.log('Datos de clubes obtenidos:', clubsData);
      
      // Mapear clubes por ID para búsqueda rápida
      const clubsMap = new Map<number, Club>();
      clubsData.forEach((club: any) => {
        clubsMap.set(club.id, {
          id: club.id,
          nombre: club.nombre,
          logo_url: club.logo_url,
          fondo_url: club.fondo_url || '/images/bgFifa.jpg' // Valor por defecto
        });
      });
      
      // Combinar datos de partidos con clubes
      const enrichedMatches = matchesData.map((match: any) => ({
        ...match,
        clubA: clubsMap.get(match.clubAId) || {
          id: match.clubAId,
          nombre: 'Equipo Local',
          logo_url: '/images/placeholder-team.png',
          fondo_url: '/images/bgFifa.jpg'
        },
        clubB: clubsMap.get(match.clubBId) || {
          id: match.clubBId,
          nombre: 'Equipo Visitante',
          logo_url: '/images/placeholder-team.png',
          fondo_url: '/images/bgFifa.jpg'
        }
      }));
      
      // Actualizar caché y estado
      console.log('Partidos enriquecidos:', enrichedMatches);
      setCachedData(UPCOMING_MATCHES_CACHE_KEY, enrichedMatches);
      setAllMatches(enrichedMatches);
      setLoading(false);
      console.log('Partidos cargados exitosamente');
      return enrichedMatches;
    } catch (err) {
      console.error('Error en useUpcomingMatches:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para forzar la actualización
  const refetch = useCallback(async () => {
    clearCachedData(UPCOMING_MATCHES_CACHE_KEY);
    return fetchData();
  }, [fetchData]);

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { 
    matches,
    loading, 
    error,
    refetch
  };
};