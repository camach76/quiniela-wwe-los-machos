import React, { useState } from 'react';
import { MatchWithClubs } from '../../types/match';
import { format, isToday, isTomorrow, isYesterday, isSameDay, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface MatchListProps {
  matches: MatchWithClubs[];
  onEdit: (match: MatchWithClubs) => void;
  onReset: (matchId: number) => void;
  onToggleComplete: (matchId: number, isComplete: boolean) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
  isSubmitting: boolean;
  emptyMessage: string;
}

export const MatchList: React.FC<MatchListProps> = ({
  matches,
  onEdit,
  onReset,
  onToggleComplete,
  isLoading,
  isSubmitting,
  emptyMessage,
}) => {
  const [updating, setUpdating] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleToggleComplete = async (matchId: number, currentComplete: boolean) => {
    try {
      setUpdating(matchId);
      setError(null);
      const { success, error } = await onToggleComplete(matchId, !currentComplete);
      if (!success && error) {
        setError(error);
      }
    } catch (err) {
      setError('Error al actualizar el estado del partido');
    } finally {
      setUpdating(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString);

    if (isToday(date)) return 'Hoy';
    if (isTomorrow(date)) return 'Mañana';
    if (isYesterday(date)) return 'Ayer';

    return format(date, "EEEE d 'de' MMMM 'de' yyyy");
  };

  const getFriendlyDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();

    if (isToday(date)) return 'HOY';
    if (isYesterday(date)) return 'AYER';
    if (isTomorrow(date)) return 'MAÑANA';

    return format(date, "EEEE d 'de' MMMM").toUpperCase();
  };

  const matchesByDate = matches
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    .reduce<Record<string, MatchWithClubs[]>>((acc, match) => {
      const dateKey = format(new Date(match.fecha), 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(match);
      return acc;
    }, {});

  const sortedDates = Object.keys(matchesByDate).sort();

  return (
    <div className="space-y-8">
      {sortedDates.map((date) => {
        const dateMatches = matchesByDate[date];
        const friendlyDate = getFriendlyDate(date);
        const dateObj = new Date(date);

        return (
          <div key={date} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-800 px-4 py-3">
              <h3 className="text-lg font-bold text-white">
                {friendlyDate} - {format(dateObj, 'd MMMM yyyy')}
              </h3>
            </div>

            <div className="divide-y divide-gray-200">
              {dateMatches.map((match) => (
                <div
                  key={match.id}
                  className={`p-4 ${match.isComplete ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 text-right pr-4">
                      <div className="font-medium text-gray-900">{match.club_a_nombre}</div>
                      <div className="text-sm text-gray-500">{match.estadio}</div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="flex items-center space-x-2 mb-1">
                        <span
                          className={`w-10 text-center text-lg font-bold ${
                            match.isComplete ? 'text-gray-900' : 'text-gray-300'
                          }`}
                        >
                          {match.resultado_a ?? '-'}
                        </span>
                        <span className="text-gray-500">-</span>
                        <span
                          className={`w-10 text-center text-lg font-bold ${
                            match.isComplete ? 'text-gray-900' : 'text-gray-300'
                          }`}
                        >
                          {match.resultado_b ?? '-'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(match.fecha), 'HH:mm')} hrs
                      </div>
                    </div>

                    <div className="flex-1 pl-4">
                      <div className="font-medium text-gray-900">{match.club_b_nombre}</div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          match.isComplete
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {match.isComplete ? 'Completado' : 'Pendiente'}
                      </span>
                      {error && match.id === updating && (
                        <span className="ml-2 text-xs text-red-600">{error}</span>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit(match)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                      >
                        {match.isComplete ? 'Editar' : 'Ingresar'}
                      </button>

                      <button
                        onClick={() => handleToggleComplete(match.id, match.isComplete)}
                        disabled={updating === match.id}
                        className={`px-3 py-1 text-sm rounded focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                          match.isComplete
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:ring-yellow-500'
                            : 'bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-500'
                        } ${updating === match.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {updating === match.id
                          ? 'Actualizando...'
                          : match.isComplete
                            ? 'Marcar pendiente'
                            : 'Marcar completado'}
                      </button>

                      {match.isComplete && (
                        <button
                          onClick={() => onReset(match.id)}
                          className="px-3 py-1 text-sm text-red-700 bg-red-100 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                        >
                          Reiniciar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
