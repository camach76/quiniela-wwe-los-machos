import { useState, useEffect, useMemo, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { GetCompletedMatches } from '@/backend/core/usecases/GetCompletedMatches';
import { SupabaseMatchRepository } from '@/backend/core/infra/repositories/SupabaseMatchRepository';
import { getCachedData, setCachedData, clearCachedData } from '@/presentation/utils/storage';

const COMPLETED_MATCHES_CACHE_KEY = 'quiniela-completed-matches-cache';

interface Club {
  id: number;
  nombre: string;
  logo_url: string;
  fondo_url: string;
}

interface Club {
  id: number;
  nombre: string;
  logo_url: string;
  fondo_url?: string;
}

export interface Match {
  id: number;
  clubAId: number;
  clubBId: number;
  fecha: string;
  estadio: string;
  resultadoA: number | null;
  resultadoB: number | null;
  isComplete: boolean;
  clubA: Club | null;
  clubB: Club | null;
  // Propiedades de solo lectura para compatibilidad
  readonly club_a_id?: number;
  readonly club_b_id?: number;
  readonly resultado_a?: number | null;
  readonly resultado_b?: number | null;
  readonly is_complete?: boolean;
  readonly club_a?: Club | null;
  readonly club_b?: Club | null;
}

export const useCompletedMatches = (selectedDate: Date) => {
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const supabase = createClientComponentClient();

  const fetchCompletedMatches = useCallback(async () => {
    try {
      console.log('Obteniendo partidos completados...');
      const matchRepository = new SupabaseMatchRepository(supabase);
      const getCompletedMatches = new GetCompletedMatches(matchRepository);
      
      // Obtener partidos completados (ya incluyen los datos de los clubes)
      console.log('Obteniendo partidos completados...');
      const matchesData = await getCompletedMatches.execute();
      console.log('Partidos completados obtenidos:', matchesData);
      
      // Mapear los datos a la estructura esperada
      const formattedMatches = matchesData.map(match => {
        const clubA = match.club_a || match.clubA || null;
        const clubB = match.club_b || match.clubB || null;
        
        return {
          id: match.id,
          clubAId: match.club_a_id || match.clubAId || 0,
          clubBId: match.club_b_id || match.clubBId || 0,
          fecha: match.fecha,
          estadio: match.estadio,
          resultadoA: match.resultado_a ?? match.resultadoA ?? null,
          resultadoB: match.resultado_b ?? match.resultadoB ?? null,
          isComplete: match.is_complete ?? match.isComplete ?? false,
          clubA: clubA ? {
            id: clubA.id,
            nombre: clubA.nombre,
            logo_url: clubA.logo_url,
            fondo_url: clubA.fondo_url || '/images/bgFifa.jpg'
          } : null,
          clubB: clubB ? {
            id: clubB.id,
            nombre: clubB.nombre,
            logo_url: clubB.logo_url,
            fondo_url: clubB.fondo_url || '/images/bgFifa.jpg'
          } : null,
          // Propiedades de solo lectura para compatibilidad
          club_a_id: match.club_a_id || match.clubAId,
          club_b_id: match.club_b_id || match.clubBId,
          resultado_a: match.resultado_a ?? match.resultadoA,
          resultado_b: match.resultado_b ?? match.resultadoB,
          is_complete: match.is_complete ?? match.isComplete,
          club_a: clubA,
          club_b: clubB
        } as Match;
      });
      
      console.log('Partidos completados formateados:', formattedMatches);
      
      setAllMatches(formattedMatches);
      setCachedData(COMPLETED_MATCHES_CACHE_KEY, formattedMatches, 60 * 60); // Cache por 1 hora
      
      // Filtrar partidos por la fecha seleccionada
      const filtered = filterMatchesByDate(formattedMatches, selectedDate);
      setMatches(filtered);
      setInitialized(true);
      return formattedMatches;
    } catch (err) {
      console.error('Error en useCompletedMatches:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar partidos completados');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [supabase, selectedDate]);

  // Función para forzar la actualización
  const refetch = useCallback(async () => {
    console.log('Forzando actualización de partidos completados...');
    clearCachedData(COMPLETED_MATCHES_CACHE_KEY);
    return fetchCompletedMatches();
  }, [fetchCompletedMatches]);

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Verificar si hay datos en caché
        const cachedData = getCachedData<Match[]>(COMPLETED_MATCHES_CACHE_KEY);
        if (cachedData) {
          console.log('Usando datos en caché:', cachedData);
          setAllMatches(cachedData);
          setLoading(false);
          setInitialized(true);
          return;
        }

        // Si no hay datos en caché, cargar desde la API
        await fetchCompletedMatches();
      } catch (err) {
        console.error('Error al cargar datos iniciales:', err);
      }
    };

    loadInitialData();
  }, [fetchCompletedMatches]);

  // Efecto para filtrar cuando cambia la fecha seleccionada
  useEffect(() => {
    if (allMatches.length > 0) {
      const filtered = filterMatchesByDate(allMatches, selectedDate);
      setMatches(filtered);
    }
  }, [selectedDate, allMatches]);

  // Función para filtrar partidos por fecha
  const filterMatchesByDate = (matches: Match[], date: Date): Match[] => {
    const dateStr = date.toISOString().split('T')[0];
    return matches.filter(match => {
      const matchDate = new Date(match.fecha);
      const matchDateStr = matchDate.toISOString().split('T')[0];
      return matchDateStr === dateStr;
    });
  };

  return { matches, loading, error, initialized, refetch };
};
