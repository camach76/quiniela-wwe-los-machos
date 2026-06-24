"use client";

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/presentation/utils/supabase/client';

export interface BetRow {
  id: number;
  userId: string;
  username: string;
  prediccionA: number;
  prediccionB: number;
  puntosObtenidos: number;
}

export interface MatchWithBets {
  matchId: number;
  fecha: string;
  hasStarted: boolean;
  resultadoA: number | null;
  resultadoB: number | null;
  clubA: { nombre: string; logo_url: string };
  clubB: { nombre: string; logo_url: string };
  bets: BetRow[];
}

// Guatemala = UTC-6, sin DST
const GT_OFFSET_HOURS = 6;

const getGTDateParts = (d: Date) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Guatemala',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(d);
  return {
    year:  Number(parts.find(p => p.type === 'year')?.value),
    month: Number(parts.find(p => p.type === 'month')?.value),
    day:   Number(parts.find(p => p.type === 'day')?.value),
  };
};

export const useBetsByDate = (selectedDate: Date) => {
  const [rawMatches, setRawMatches] = useState<MatchWithBets[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id ?? null);

        // Rango UTC que cubre el día completo en Guatemala (UTC-6, sin DST)
        const { year, month, day } = getGTDateParts(selectedDate);
        const startUTC = new Date(Date.UTC(year, month - 1, day,     GT_OFFSET_HOURS, 0, 0));
        const endUTC   = new Date(Date.UTC(year, month - 1, day + 1, GT_OFFSET_HOURS, 0, 0));

        const { data, error: sbError } = await supabase
          .from('matches')
          .select(`
            id,
            fecha,
            resultado_a,
            resultado_b,
            club_a:club_a_id ( nombre, logo_url ),
            club_b:club_b_id ( nombre, logo_url ),
            bets (
              id,
              user_id,
              prediccion_a,
              prediccion_b,
              puntos_obtenidos,
              profiles ( username )
            )
          `)
          .gte('fecha', startUTC.toISOString())
          .lt('fecha', endUTC.toISOString())
          .order('fecha');

        if (sbError) {
          console.error('[useBetsByDate] Supabase error:', sbError);
          throw sbError;
        }

        const now = new Date();
        const matches: MatchWithBets[] = (data ?? []).map((match) => {
          const rawBets = (match.bets as any[]) ?? [];
          const bets: BetRow[] = rawBets
            .filter((b) => b.profiles?.username)
            .map((b) => ({
              id: b.id,
              userId: b.user_id,
              username: b.profiles.username,
              prediccionA: b.prediccion_a,
              prediccionB: b.prediccion_b,
              puntosObtenidos: b.puntos_obtenidos,
            }))
            .sort((a, b) =>
              b.puntosObtenidos !== a.puntosObtenidos
                ? b.puntosObtenidos - a.puntosObtenidos
                : a.username.localeCompare(b.username)
            );

          return {
            matchId: match.id,
            fecha: match.fecha,
            hasStarted: new Date(match.fecha) <= now,
            resultadoA: match.resultado_a,
            resultadoB: match.resultado_b,
            clubA: (match.club_a as any) ?? { nombre: '', logo_url: '' },
            clubB: (match.club_b as any) ?? { nombre: '', logo_url: '' },
            bets,
          };
        });

        setRawMatches(matches);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar apuestas');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  // hasStarted se recalcula en cada render para no quedar obsoleto
  const matchesForDate = useMemo(() => {
    const now = new Date();
    return rawMatches.map((m) => ({ ...m, hasStarted: new Date(m.fecha) <= now }));
  }, [rawMatches]);

  return { matchesForDate, currentUserId, loading, error };
};
