import { useEffect, useState } from "react";
import { betService, type Bet } from "../services/betService";
import type { Partido } from "@/types/partidos";

interface BetDisplay {
  betId: number;
  prediccionA: number;
  prediccionB: number;
  puntos: number;
  matchDate: string;
  estadio: string;
  isComplete: boolean;
  resultadoA: number | null;
  resultadoB: number | null;
  clubA: {
    id: string;
    nombre: string;
    logo: string;
  };
  clubB: {
    id: string;
    nombre: string;
    logo: string;
  };
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
        const bets = await betService.getByUser(userId);

        if (!bets.length) {
          setQuiniela([]);
          setLoading(false);
          return;
        }

        // 2. Obtener los partidos relacionados (simulados para el ejemplo)
        // En una implementación real, esto vendría de tu API
        const matches: Partido[] = [];

        // 3. Mapear a formato de visualización
        const enriched: BetDisplay[] = bets
          .map((bet) => {
            // Esto es un ejemplo - en una implementación real, deberías obtener los datos reales
            // de los partidos y clubes desde tu API
            return {
              betId: bet.id || 0,
              prediccionA: bet.prediccion_a,
              prediccionB: bet.prediccion_b,
              puntos: bet.puntos || 0,
              matchDate: new Date().toISOString(), // Fecha de ejemplo
              estadio: 'Estadio de ejemplo', // Estadio de ejemplo
              isComplete: false, // Por defecto no completado
              resultadoA: null,
              resultadoB: null,
              clubA: {
                id: '1',
                nombre: 'Equipo A',
                logo: '/path/to/logo-a.png'
              },
              clubB: {
                id: '2',
                nombre: 'Equipo B',
                logo: '/path/to/logo-b.png'
              }
            };
          });

        setQuiniela(enriched);
      } catch (err) {
        console.error('Error al cargar la quiniela:', err);
        setError('Error al cargar las apuestas');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return { quiniela, loading, error };
};
