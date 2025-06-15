import { useEffect, useState } from "react";
import { clubService } from "@/backend/core/services/clubService";
import { matchService } from "@/backend/core/services/matchService";
import { betService } from "../services/betService";
import type { Bet } from "@/backend/core/domain/entities/betEntity";
import type { Match } from "@/backend/core/domain/entities/MatchesEntity";
import type { Club } from "@/backend/core/domain/entities/clubEntity";

export interface BetDisplay {
  betId: number;
  prediccionA: number;
  prediccionB: number;
  puntos: number;
  matchDate: string;
  estadio: string;
  isComplete: boolean;
  resultadoA: number | null;
  resultadoB: number | null;
  clubA: Club;
  clubB: Club;
}

export const useUserBets = (userId: string) => {
  const [quiniela, setQuiniela] = useState<BetDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Obtener apuestas del usuario
        const bets: Bet[] = await betService.getByUser(userId);

        if (!bets.length) {
          setQuiniela([]);
          setLoading(false);
          return;
        }

        // 2. Obtener los partidos relacionados
        const matchIds = bets.map((b) => b.matchId);
        const matches: Match[] = await matchService.getManyByIds(matchIds);

        // 3. Obtener todos los clubes (menos consultas)
        const clubs: Club[] = await clubService.getAll();

        // 4. Enriquecer cada apuesta
        const enriched: BetDisplay[] = bets
          .map((bet) => {
            const match = matches.find((m) => m.id === bet.matchId);
            const clubA = clubs.find((c) => c.id === Number(match?.club_a_id));
            const clubB = clubs.find((c) => c.id === Number(match?.club_b_id));

            if (!match || !clubA || !clubB) return null;

            return {
              betId: bet.id,
              prediccionA: bet.prediccion_a,
              prediccionB: bet.prediccion_b,
              puntos: bet.puntosObtenidos,
              matchDate: match.fecha,
              estadio: match.estadio,
              isComplete: match.is_complete ?? false,
              resultadoA: match.resultado_a,
              resultadoB: match.resultado_b,
              clubA,
              clubB,
            };
          })
          .filter(Boolean) as BetDisplay[];

        setQuiniela(enriched);
      } catch (err) {
        console.error(err);
        setError("Ocurrió un error al cargar tus pronósticos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return {
    quiniela,
    loading,
    error,
  };
};
