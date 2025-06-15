import React, { useMemo } from 'react';
import { useCompletedMatches } from '@/presentation/hooks/useCompletedMatches';
import { MatchCard } from '../matchCard/matchCard';
import { toast } from 'react-hot-toast';

interface MatchListCompleteProps {
  className?: string;
  maxItems?: number;
}

export const MatchListComplete: React.FC<MatchListCompleteProps> = ({
  className = '',
  maxItems = Infinity
}) => {
  const { matches, loading, error } = useCompletedMatches();

  // Ordenar partidos por fecha (más recientes primero)
  const sortedMatches = useMemo(() => {
    return [...matches].sort((a, b) => 
      new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    ).slice(0, maxItems);
  }, [matches, maxItems]);

  // Mostrar mensaje de error si hay alguno
  if (error) {
    toast.error(error);
    return (
      <div className={`text-center py-4 text-red-500 ${className}`}>
        Error al cargar los partidos completados
      </div>
    );
  }

  // Mostrar mensaje de carga
  if (loading) {
    return (
      <div className={`grid gap-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-40" />
        ))}
      </div>
    );
  }

  // Mostrar mensaje si no hay partidos
  if (sortedMatches.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        No hay partidos completados para mostrar
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${className}`}>
      {sortedMatches.map((partido) => {
        try {
          const datosPartido = {
            id: partido.id,
            torneo: 'Partido Completado',
            fecha: partido.fecha,
            local: {
              nombre: partido.clubA?.nombre || 'Equipo Local',
              logo: partido.clubA?.logo_url || '/images/placeholder-team.png',
              fondo: partido.clubA?.fondo_url || '/images/bgFifa.jpg',
              resultado: partido.resultadoA
            },
            visitante: {
              nombre: partido.clubB?.nombre || 'Equipo Visitante',
              logo: partido.clubB?.logo_url || '/images/placeholder-team.png',
              fondo: partido.clubB?.fondo_url || '/images/bgFifa.jpg',
              resultado: partido.resultadoB
            },
            resultado: {
              local: partido.resultadoA,
              visitante: partido.resultadoB
            }
          };

          return <MatchCard key={partido.id} {...datosPartido} />;
        } catch (err) {
          console.error('Error al renderizar partido:', partido, err);
          return null;
        }
      })}
    </div>
  );
};
