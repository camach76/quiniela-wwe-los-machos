import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { getCachedData, setCachedData, clearCachedData } from '@/presentation/utils/storage';

interface JugadorRanking {
  id: string;
  nombre: string;
  puntos: number;
}

const RANKING_CACHE_KEY = 'quiniela-ranking-cache';

export const useRanking = (limit: number = 5) => {
  // Intentar cargar del caché al inicio
  const [topJugadores, setTopJugadores] = useState<JugadorRanking[]>(() => {
    if (typeof window !== 'undefined') {
      return getCachedData<JugadorRanking[]>(RANKING_CACHE_KEY) || [];
    }
    return [];
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const fetchRanking = useCallback(async () => {
    try {
      // Usar caché si existe
      const cachedData = getCachedData<JugadorRanking[]>(RANKING_CACHE_KEY);
      if (cachedData) {
        setTopJugadores(cachedData);
        setLoading(false);
        return cachedData;
      }

      setLoading(true);
      
      const { data, error: queryError } = await supabase
        .from('profiles')
        .select('id, username, puntos')
        .order('puntos', { ascending: false })
        .limit(limit);

      if (queryError) {
        throw queryError;
      }

      // Mapear los datos al formato esperado
      const jugadores = (data || []).map((jugador: any) => ({
        id: jugador.id,
        nombre: jugador.username || 'Usuario',
        puntos: jugador.puntos || 0
      }));

      // Actualizar caché y estado
      setTopJugadores(jugadores);
      setCachedData(RANKING_CACHE_KEY, jugadores);
      return jugadores;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el ranking';
      setError(errorMessage);
      console.error('Error en useRanking:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [limit, supabase]);

  // Función para forzar la actualización del ranking
  const refetch = useCallback(async () => {
    // Limpiar caché para forzar una nueva carga
    clearCachedData(RANKING_CACHE_KEY);
    return fetchRanking();
  }, [fetchRanking]);

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchRanking();
  }, [fetchRanking]);

  return {
    topJugadores,
    loading,
    error,
    refetch
  };
};
