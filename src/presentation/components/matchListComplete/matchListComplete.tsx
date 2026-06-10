"use client";

import { useCompletedMatchesList } from '@/presentation/hooks/useCompletedMatchesList';
import { TeamLogo } from '../TeamLogo';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface MatchListCompleteProps {
  className?: string;
  maxItems?: number;
}

export const MatchListComplete = ({ className = '', maxItems = Infinity }: MatchListCompleteProps) => {
  const { matches, loading, error } = useCompletedMatchesList(maxItems);

  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-20" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center py-6 text-red-500 text-sm">Error al cargar resultados</p>;
  }

  if (matches.length === 0) {
    return <p className="text-center py-8 text-gray-400 text-sm">No hay partidos con resultado aún</p>;
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${className}`}>
      {matches.map((match) => {
        const localGano = (match.resultadoA ?? 0) > (match.resultadoB ?? 0);
        const visitanteGano = (match.resultadoB ?? 0) > (match.resultadoA ?? 0);

        return (
          <div key={match.id} className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
            {/* Fecha */}
            <p className="text-xs text-gray-400 text-center mb-2">
              {format(new Date(match.fecha), "d MMM · HH:mm", { locale: es })}
            </p>

            {/* Equipos y marcador */}
            <div className="flex items-center gap-2">
              {/* Equipo local */}
              <div className={`flex-1 flex items-center gap-2 justify-end ${localGano ? 'opacity-100' : 'opacity-60'}`}>
                <span className={`text-sm text-right leading-tight ${localGano ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                  {match.clubA?.nombre ?? '—'}
                </span>
                <TeamLogo name={match.clubA?.nombre ?? ''} logoUrl={match.clubA?.logo_url} size={32} />
              </div>

              {/* Marcador */}
              <div className="flex items-center gap-1 shrink-0">
                <span className={`text-xl font-black w-7 text-center ${localGano ? 'text-gray-900' : 'text-gray-500'}`}>
                  {match.resultadoA ?? '—'}
                </span>
                <span className="text-gray-300 font-bold">-</span>
                <span className={`text-xl font-black w-7 text-center ${visitanteGano ? 'text-gray-900' : 'text-gray-500'}`}>
                  {match.resultadoB ?? '—'}
                </span>
              </div>

              {/* Equipo visitante */}
              <div className={`flex-1 flex items-center gap-2 ${visitanteGano ? 'opacity-100' : 'opacity-60'}`}>
                <TeamLogo name={match.clubB?.nombre ?? ''} logoUrl={match.clubB?.logo_url} size={32} />
                <span className={`text-sm leading-tight ${visitanteGano ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                  {match.clubB?.nombre ?? '—'}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
