import { useState, useEffect, useMemo } from 'react';

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
  clubA?: Club;
  clubB?: Club;
}

export const useUpcomingMatches = (filterDate?: Date) => {
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
        
        // Obtener partidos
        const matchesRes = await fetch('/api/match/upcoming');
        if (!matchesRes.ok) throw new Error('Error al cargar los partidos');
        const matchesData = await matchesRes.json();
        
        // Obtener clubes
        const clubsRes = await fetch('/api/clubs');
        if (!clubsRes.ok) throw new Error('Error al cargar los clubes');
        const clubsData = await clubsRes.json();
        
        // Mapear clubes por ID para búsqueda rápida
        const clubsMap = new Map<number, Club>();
        clubsData.forEach((club: any) => {
          clubsMap.set(club.id, {
            id: club.id,
            nombre: club.nombre,
            logo_url: club.logo_url,
            fondo_url: club.fondo_url || '/images/bgFifa.jpg' // Valor por defecto
          });
        });
        
        // Combinar datos de partidos con clubes
        const enrichedMatches = matchesData.map((match: any) => ({
          ...match,
          clubA: clubsMap.get(match.clubAId) || {
            id: match.clubAId,
            nombre: 'Equipo Local',
            logo_url: '/images/placeholder-team.png',
            fondo_url: '/images/bgFifa.jpg'
          },
          clubB: clubsMap.get(match.clubBId) || {
            id: match.clubBId,
            nombre: 'Equipo Visitante',
            logo_url: '/images/placeholder-team.png',
            fondo_url: '/images/bgFifa.jpg'
          }
        }));
        
        setAllMatches(enrichedMatches);
      } catch (err) {
        console.error('Error en useUpcomingMatches:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
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