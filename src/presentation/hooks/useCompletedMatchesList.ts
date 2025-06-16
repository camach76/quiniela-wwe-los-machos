import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { GetCompletedMatches } from '@/backend/core/usecases/GetCompletedMatches';
import { SupabaseMatchRepository } from '@/backend/core/infra/repositories/SupabaseMatchRepository';
import { getCachedData, setCachedData } from '@/presentation/utils/storage';

const COMPLETED_MATCHES_CACHE_KEY = 'quiniela-completed-matches-list-cache';

interface Club {
  id: number;
  nombre: string;
  logo_url: string;
  fondo_url?: string;
}

export interface CompletedMatch {
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
  // Propiedades para compatibilidad
  club_a_id?: number;
  club_b_id?: number;
  resultado_a?: number | null;
  resultado_b?: number | null;
  is_complete?: boolean;
  club_a?: Club | null;
  club_b?: Club | null;
}

export const useCompletedMatchesList = (limit: number = 5) => {
  const [matches, setMatches] = useState<CompletedMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const fetchCompletedMatches = useCallback(async () => {
    try {
      // Intentar obtener datos de la caché primero
      const cachedData = getCachedData<CompletedMatch[]>(COMPLETED_MATCHES_CACHE_KEY);
      if (cachedData) {
        setMatches(cachedData);
        setLoading(false);
      }

      // Obtener datos del servidor
      const matchRepository = new SupabaseMatchRepository();
      const getCompletedMatches = new GetCompletedMatches(matchRepository);
      const matchesData = await getCompletedMatches.execute();

      // Formatear los datos para asegurar la estructura correcta
      const formattedMatches = matchesData.map(matchData => {
        // Usar type assertion para acceder a las propiedades de manera segura
        const match = matchData as any;
        
        // Extraer datos del partido con compatibilidad para ambos formatos (snake_case y camelCase)
        const clubA = match.club_a || match.clubA || null;
        const clubB = match.club_b || match.clubB || null;
        
        // Extraer IDs con valores por defecto
        const clubAId = match.club_a_id || match.clubAId || 0;
        const clubBId = match.club_b_id || match.clubBId || 0;
        
        // Extraer resultados con valores por defecto
        const resultadoA = match.resultado_a ?? match.resultadoA ?? null;
        const resultadoB = match.resultado_b ?? match.resultadoB ?? null;
        const isComplete = match.is_complete ?? match.isComplete ?? false;
        
        return {
          id: match.id,
          clubAId,
          clubBId,
          fecha: match.fecha,
          estadio: match.estadio || 'Estadio no especificado',
          resultadoA,
          resultadoB,
          isComplete,
          clubA: clubA ? {
            id: clubA.id,
            nombre: clubA.nombre || 'Equipo Local',
            logo_url: clubA.logo_url || '/images/placeholder-team.png',
            fondo_url: clubA.fondo_url || '/images/bgFifa.jpg'
          } : null,
          clubB: clubB ? {
            id: clubB.id,
            nombre: clubB.nombre || 'Equipo Visitante',
            logo_url: clubB.logo_url || '/images/placeholder-team.png',
            fondo_url: clubB.fondo_url || '/images/bgFifa.jpg'
          } : null,
          // Propiedades para compatibilidad
          club_a_id: clubAId,
          club_b_id: clubBId,
          resultado_a: resultadoA,
          resultado_b: resultadoB,
          is_complete: isComplete,
          club_a: clubA,
          club_b: clubB
        };
      });

      // Aplicar límite y ordenar por fecha (más recientes primero)
      const limitedMatches = formattedMatches
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .slice(0, limit);

      // Actualizar estado y caché
      setMatches(limitedMatches);
      // Usar setCachedData con el formato correcto (sin el parámetro de tiempo)
      setCachedData(COMPLETED_MATCHES_CACHE_KEY, limitedMatches);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los partidos completados';
      console.error('Error en useCompletedMatchesList:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [limit, supabase]);

  useEffect(() => {
    fetchCompletedMatches();
  }, [fetchCompletedMatches]);

  return {
    matches,
    loading,
    error,
    refresh: fetchCompletedMatches
  };
};

export default useCompletedMatchesList;
