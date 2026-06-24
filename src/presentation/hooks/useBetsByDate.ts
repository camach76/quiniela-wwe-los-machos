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

const GT_TZ = 'America/Guatemala';

const getGTDateParts = (d: Date) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: GT_TZ,
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

const isSameGTDate = (isoDate: string, target: Date): boolean => {
  const a = getGTDateParts(new Date(isoDate));
  const b = getGTDateParts(target);
  return a.year === b.year && a.month === b.month && a.day === b.day;
};

export const useBetsByDate = (selectedDate: Date) => {
  const [allData, setAllData] = useState<MatchWithBets[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id ?? null);

        const { data, error: sbError } = await supabase
          .from('bets')
          .select(`
            id,
            user_id,
            prediccion_a,
            prediccion_b,
            puntos_obtenidos,
            profiles ( username ),
            matches (
              id,
              fecha,
              resultado_a,
              resultado_b,
              club_a:club_a_id ( nombre, logo_url ),
              club_b:club_b_id ( nombre, logo_url )
            )
          `);

        if (sbError) {
          console.error('[useBetsByDate] Supabase error:', sbError);
          throw sbError;
        }

        const now = new Date();
        const map = new Map<number, MatchWithBets>();

        for (const row of data ?? []) {
          const match = row.matches as any;
          const profile = row.profiles as any;
          if (!match || !profile) continue;

          if (!map.has(match.id)) {
            map.set(match.id, {
              matchId: match.id,
              fecha: match.fecha,
              hasStarted: new Date(match.fecha) <= now,
              resultadoA: match.resultado_a,
              resultadoB: match.resultado_b,
              clubA: match.club_a ?? { nombre: '', logo_url: '' },
              clubB: match.club_b ?? { nombre: '', logo_url: '' },
              bets: [],
            });
          }

          map.get(match.id)!.bets.push({
            id: row.id,
            userId: row.user_id,
            username: profile.username,
            prediccionA: row.prediccion_a,
            prediccionB: row.prediccion_b,
            puntosObtenidos: row.puntos_obtenidos,
          });
        }

        const sorted = Array.from(map.values()).sort(
          (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        );

        for (const m of sorted) {
          m.bets.sort((a, b) =>
            b.puntosObtenidos !== a.puntosObtenidos
              ? b.puntosObtenidos - a.puntosObtenidos
              : a.username.localeCompare(b.username)
          );
        }

        setAllData(sorted);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar apuestas');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  const matchesForDate = useMemo(
    () => allData.filter((m) => isSameGTDate(m.fecha, selectedDate)),
    [allData, selectedDate]
  );

  return { matchesForDate, currentUserId, loading, error };
};
