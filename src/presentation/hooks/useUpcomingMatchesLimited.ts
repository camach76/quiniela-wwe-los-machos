import { useState, useEffect, useCallback } from 'react';
import { clearCachedData, setCachedData } from '@/presentation/utils/storage';
import { SupabaseMatchRepository } from '@/backend/core/infra/repositories/SupabaseMatchRepository';

const CACHE_KEY = 'quiniela-upcoming-matches-limited-cache';

interface Club {
  id: number;
  nombre: string;
  logo_url: string;
}

interface Match {
  id: number;
  clubAId: number;
  clubBId: number;
  fecha: string;
  estadio: string;
  resultadoA: number | null;
  resultadoB: number | null;
  isComplete: boolean;
  clubA?: Club;
  clubB?: Club;
}

export const useUpcomingMatchesLimited = (limit: number = 3) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const repo = new SupabaseMatchRepository();
      const data = await repo.getUpcomingLimited(Math.max(limit, 10));

      const formatted: Match[] = data.slice(0, limit).map((match: any) => ({
        id: match.id,
        clubAId: match.club_a_id ?? match.clubAId,
        clubBId: match.club_b_id ?? match.clubBId,
        fecha: match.fecha,
        estadio: match.estadio,
        resultadoA: match.resultado_a ?? null,
        resultadoB: match.resultado_b ?? null,
        isComplete: match.resultado_a !== null && match.resultado_b !== null,
        clubA: match.club_a
          ? { id: match.club_a.id, nombre: match.club_a.nombre, logo_url: match.club_a.logo_url }
          : undefined,
        clubB: match.club_b
          ? { id: match.club_b.id, nombre: match.club_b.nombre, logo_url: match.club_b.logo_url }
          : undefined,
      }));

      setCachedData(CACHE_KEY, formatted);
      setMatches(formatted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar partidos');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const refetch = useCallback(async () => {
    clearCachedData(CACHE_KEY);
    return fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { matches, loading, error, refetch };
};
