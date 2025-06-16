import React, { useMemo } from 'react';
import { useUpcomingMatchesLimited } from '@/presentation/hooks/useUpcomingMatchesLimited';
import { MatchCard } from '../matchCard/matchCard';
import { toast } from 'react-hot-toast';

interface UpcomingMatchesListProps {
  className?: string;
  limit?: number;
  showDate?: boolean;
}

export const UpcomingMatchesList: React.FC<UpcomingMatchesListProps> = ({
  className = '',
  limit = 3,
  showDate = true
}) => {
  const { matches, loading, error } = useUpcomingMatchesLimited(limit);

  // Manejar errores
  if (error) {
    console.error('Error al cargar partidos próximos:', error);
    toast.error('Error al cargar los próximos partidos');
  }

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className={`flex flex-col space-y-4 ${className}`}>
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse h-32" />
        ))}
      </div>
    );
  }

  // Mostrar mensaje si no hay partidos
  if (matches.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay partidos próximos programados</p>
      </div>
    );
  }

  // Mostrar lista de partidos
  return (
    <div className={`space-y-4 ${className}`}>
      {matches.map((match) => {
        // Verificar que los equipos tengan la estructura esperada
        if (!match.clubA || !match.clubB) {
          console.warn('Partido con datos incompletos:', match);
          return null;
        }

        return (
          <MatchCard
            key={match.id}
            local={{
              nombre: match.clubA.nombre,
              logo: match.clubA.logo_url,
              fondo: match.clubA.fondo_url
            }}
            visitante={{
              nombre: match.clubB.nombre,
              logo: match.clubB.logo_url,
              fondo: match.clubB.fondo_url
            }}
            fecha={match.fecha}
            torneo={showDate ? 'Próximo partido' : undefined}
          />
        );
      })}
    </div>
  );
};
