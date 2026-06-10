import { useState, useEffect, useMemo, useCallback } from 'react';
import { GetCompletedMatches } from '@/backend/core/usecases/GetCompletedMatches';
import { SupabaseMatchRepository } from '@/backend/core/infra/repositories/SupabaseMatchRepository';
import { getCachedData, setCachedData, clearCachedData } from '@/presentation/utils/storage';

const CACHE_KEY = 'quiniela-completed-matches-cache';

interface Club {
  id: number;
  nombre: string;
  logo_url: string;
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
  club_a_id?: number;
  club_b_id?: number;
  resultado_a?: number | null;
  resultado_b?: number | null;
  club_a?: Club | null;
  club_b?: Club | null;
}

const toMatch = (raw: any): Match => {
  const clubA = raw.club_a ?? raw.clubA ?? null;
  const clubB = raw.club_b ?? raw.clubB ?? null;
  return {
    id: raw.id,
    clubAId: raw.club_a_id ?? raw.clubAId ?? 0,
    clubBId: raw.club_b_id ?? raw.clubBId ?? 0,
    fecha: raw.fecha,
    estadio: raw.estadio,
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

const filterByDate = (matches: Match[], date: Date): Match[] => {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  return matches.filter((match) => {
    const md = new Date(match.fecha);
    return md.getFullYear() === y && md.getMonth() === m && md.getDate() === d;
  });
};

export const useCompletedMatches = (selectedDate: Date) => {
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompletedMatches = useCallback(async () => {
    try {
      const repo = new SupabaseMatchRepository();
      const useCase = new GetCompletedMatches(repo);
      const data = await useCase.execute();
      const formatted = data.map(toMatch);
      setAllMatches(formatted);
      setCachedData(CACHE_KEY, formatted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar partidos completados');
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    clearCachedData(CACHE_KEY);
    return fetchCompletedMatches();
  }, [fetchCompletedMatches]);

  useEffect(() => {
    const cached = getCachedData<Match[]>(CACHE_KEY);
    if (cached) {
      setAllMatches(cached);
      setLoading(false);
      return;
    }
    fetchCompletedMatches();
  }, [fetchCompletedMatches]);

  const matches = useMemo(
    () => filterByDate(allMatches, selectedDate),
    [allMatches, selectedDate]
  );

  return { matches, loading, error, refetch };
};
