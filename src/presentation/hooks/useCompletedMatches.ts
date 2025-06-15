import { useState, useEffect, useMemo } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { GetCompletedMatches } from '@/backend/core/usecases/GetCompletedMatches';
import { SupabaseMatchRepository } from '@/backend/core/infra/repositories/SupabaseMatchRepository';

interface Club {
  id: number;
  nombre: string;
  logo_url: string;
  fondo_url: string;
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
  clubA?: Club;
  clubB?: Club;
}

export const useCompletedMatches = (filterDate?: Date) => {
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtrar partidos por fecha si se proporciona
  const matches = useMemo(() => {
    if (!filterDate) return allMatches;
    
    return allMatches.filter(match => {
      try {
        const matchDate = new Date(match.fecha);
        return (
          matchDate.getDate() === filterDate.getDate() &&
          matchDate.getMonth() === filterDate.getMonth() &&
          matchDate.getFullYear() === filterDate.getFullYear()
        );
      } catch (err) {
        console.error('Error al procesar fecha del partido:', match, err);
        return false;
      }
    });
  }, [allMatches, filterDate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Inicializar Supabase
        const supabase = createClientComponentClient();
        const matchRepository = new SupabaseMatchRepository(supabase);
        const getCompletedMatches = new GetCompletedMatches(matchRepository);
        
        // Obtener partidos completados (ya incluyen los datos de los clubes)
        const matchesData = await getCompletedMatches.execute();
        
        // Mapear a la estructura esperada
        const formattedMatches = matchesData.map(match => ({
          ...match,
          // Mantener compatibilidad con código existente
          clubAId: match.clubAId || match.club_a_id,
          clubBId: match.clubBId || match.club_b_id,
          resultadoA: match.resultadoA || match.resultado_a,
          resultadoB: match.resultadoB || match.resultado_b,
          isComplete: match.isComplete || match.is_complete,
          // Los datos de los clubes ya vienen incluidos en la consulta
        }));
        
        setAllMatches(formattedMatches);
      } catch (err) {
        console.error('Error en useCompletedMatches:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar partidos completados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { 
    matches,
    loading, 
    error 
  };
};
