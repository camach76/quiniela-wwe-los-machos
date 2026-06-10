import { useState, useEffect, useCallback } from 'react';
import { GetCompletedMatches } from '@/backend/core/usecases/GetCompletedMatches';
import { SupabaseMatchRepository } from '@/backend/core/infra/repositories/SupabaseMatchRepository';
import { getCachedData, setCachedData } from '@/presentation/utils/storage';

const CACHE_KEY = 'quiniela-completed-matches-list-cache';

interface Club {
  id: number;
  nombre: string;
  logo_url: string;
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
  club_a_id?: number;
  club_b_id?: number;
  resultado_a?: number | null;
  resultado_b?: number | null;
  club_a?: Club | null;
  club_b?: Club | null;
}

const toCompletedMatch = (raw: any): CompletedMatch => {
  const clubA = raw.club_a ?? raw.clubA ?? null;
  const clubB = raw.club_b ?? raw.clubB ?? null;
  return {
    id: raw.id,
    clubAId: raw.club_a_id ?? raw.clubAId ?? 0,
    clubBId: raw.club_b_id ?? raw.clubBId ?? 0,
    fecha: raw.fecha,
    estadio: raw.estadio ?? '',
    resultadoA: raw.resultado_a ?? raw.resultadoA ?? null,
    resultadoB: raw.resultado_b ?? raw.resultadoB ?? null,
    isComplete: true,
    clubA: clubA ? { id: clubA.id, nombre: clubA.nombre, logo_url: clubA.logo_url } : null,
    clubB: clubB ? { id: clubB.id, nombre: clubB.nombre, logo_url: clubB.logo_url } : null,
    club_a_id: raw.club_a_id ?? raw.clubAId,
    club_b_id: raw.club_b_id ?? raw.clubBId,
    resultado_a: raw.resultado_a ?? raw.resultadoA,
    resultado_b: raw.resultado_b ?? raw.resultadoB,
    club_a: clubA,
    club_b: clubB,
  };
};

export const useCompletedMatchesList = (limit: number = 5) => {
  const [matches, setMatches] = useState<CompletedMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompletedMatches = useCallback(async () => {
    try {
      const cached = getCachedData<CompletedMatch[]>(CACHE_KEY);
      if (cached) {
        setMatches(cached);
        setLoading(false);
      }

      const repo = new SupabaseMatchRepository();
      const useCase = new GetCompletedMatches(repo);
      const data = await useCase.execute();

      const formatted = data
        .map(toCompletedMatch)
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .slice(0, limit);

      setMatches(formatted);
      setCachedData(CACHE_KEY, formatted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar partidos completados');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchCompletedMatches();
  }, [fetchCompletedMatches]);

  return { matches, loading, error, refresh: fetchCompletedMatches };
};

export default useCompletedMatchesList;
