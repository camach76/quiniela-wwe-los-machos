import { useState, useEffect, useMemo, useCallback } from "react";
import {
  getCachedData,
  setCachedData,
  clearCachedData,
} from "@/presentation/utils/storage";
import { SupabaseMatchRepository } from "@/backend/core/infra/repositories/SupabaseMatchRepository";

const CACHE_KEY = "quiniela-upcoming-matches-cache";

interface Club {
  id: number;
  nombre: string;
  logo_url: string;
  fondo_url?: string;
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
    if (typeof window !== "undefined") {
      return getCachedData<Match[]>(CACHE_KEY) ?? [];
    }
    return [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const matches = useMemo(() => {
    if (!filterDate) return allMatches;
    return allMatches.filter((match) => {
      const md = new Date(match.fecha);
      return (
        md.getDate() === filterDate.getDate() &&
        md.getMonth() === filterDate.getMonth() &&
        md.getFullYear() === filterDate.getFullYear()
      );
    });
  }, [allMatches, filterDate]);

  const fetchData = useCallback(async () => {
    try {
      const cached = getCachedData<Match[]>(CACHE_KEY);
      if (cached) {
        setAllMatches(cached);
        setLoading(false);
        return cached;
      }

      setLoading(true);
      const repo = new SupabaseMatchRepository();
      const data = await repo.getUpcoming();

      const enriched: Match[] = data.map((match: any) => ({
        id: match.id,
        clubAId: match.club_a_id ?? match.clubAId,
        clubBId: match.club_b_id ?? match.clubBId,
        fecha: match.fecha,
        estadio: match.estadio,
        resultadoA: match.resultado_a ?? null,
        resultadoB: match.resultado_b ?? null,
        clubA: match.club_a
          ? {
              id: match.club_a.id,
              nombre: match.club_a.nombre,
              logo_url: match.club_a.logo_url,
              fondo_url: match.club_a.fondo_url,
            }
          : undefined,
        clubB: match.club_b
          ? {
              id: match.club_b.id,
              nombre: match.club_b.nombre,
              logo_url: match.club_b.logo_url,
              fondo_url: match.club_b.fondo_url,
            }
          : undefined,
      }));

      setCachedData(CACHE_KEY, enriched);
      setAllMatches(enriched);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    clearCachedData(CACHE_KEY);
    return fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { matches, loading, error, refetch };
};
