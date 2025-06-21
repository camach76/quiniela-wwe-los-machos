import { useState, useEffect, useCallback } from 'react';
import { getCachedData, setCachedData, clearCachedData } from '@/presentation/utils/storage';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import supabase from '@/presentation/utils/supabase/client';

// Usamos una clave de caché única para este hook
const UPCOMING_MATCHES_LIMITED_CACHE_KEY = 'quiniela-upcoming-matches-limited-cache';

// Definimos las interfaces necesarias solo para este hook
interface Club {
  id: number;
  nombre: string;
  logo_url: string;
  fondo_url: string;
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
  const [matches, setMatches] = useState<Match[]>(() => {
    if (typeof window !== 'undefined') {
      return getCachedData<Match[]>(UPCOMING_MATCHES_LIMITED_CACHE_KEY) || [];
    }
    return [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      console.log('Iniciando carga de próximos partidos limitados...');
      
      // Usar caché si existe
      const cachedData = getCachedData<Match[]>(UPCOMING_MATCHES_LIMITED_CACHE_KEY);
      if (cachedData) {
        // Aplicar el límite a los datos en caché
        const limitedCachedData = cachedData.slice(0, limit);
        console.log('Usando datos en caché (limitados):', limitedCachedData);
        setMatches(limitedCachedData);
        setLoading(false);
        return limitedCachedData;
      }

      setLoading(true);
      
      // Hacemos la consulta directamente a Supabase
      const now = new Date().toISOString();
      
      // Aseguramos que el límite se aplique tanto en la consulta como en el cliente
      const dbLimit = Math.max(limit, 10); // Traemos un poco más para el caché
      
      const { data: matchesData, error } = await supabase
        .from('matches')
        .select(`
          *,
          club_a:club_a_id(*),
          club_b:club_b_id(*)
        `)
        .gte('fecha', now)
        .order('fecha', { ascending: true })
        .limit(dbLimit);
      
      if (error) throw error;
      if (!matchesData) throw new Error('No se encontraron partidos próximos');
      
      // Mapeamos los datos al formato que espera nuestro componente
      // Aplicamos el límite después de formatear los datos
      const formattedMatches = matchesData
        .slice(0, limit)
        .map((match: any) => ({
        id: match.id,
        clubAId: match.club_a_id,
        clubBId: match.club_b_id,
        fecha: match.fecha,
        estadio: match.estadio,
        resultadoA: match.resultado_a,
        resultadoB: match.resultado_b,
        isComplete: match.is_complete,
        clubA: match.club_a ? {
          id: match.club_a.id,
          nombre: match.club_a.nombre,
          logo_url: match.club_a.logo_url,
          fondo_url: match.club_a.fondo_url || '/images/bgFifa.jpg'
        } : undefined,
        clubB: match.club_b ? {
          id: match.club_b.id,
          nombre: match.club_b.nombre,
          logo_url: match.club_b.logo_url,
          fondo_url: match.club_b.fondo_url || '/images/bgFifa.jpg'
        } : undefined
      }));
      
      console.log('Datos de partidos próximos limitados obtenidos:', formattedMatches);
      
      // Actualizar caché y estado
      setCachedData(UPCOMING_MATCHES_LIMITED_CACHE_KEY, formattedMatches);
      setMatches(formattedMatches);
      
      console.log('Partidos próximos limitados cargados exitosamente');
      return matchesData;
    } catch (err) {
      console.error('Error en useUpcomingMatchesLimited:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar partidos');
      return [];
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Función para forzar la actualización
  const refetch = useCallback(async () => {
    clearCachedData(UPCOMING_MATCHES_LIMITED_CACHE_KEY);
    return fetchData();
  }, [fetchData]);

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { 
    matches,
    loading, 
    error,
    refetch
  };
};
