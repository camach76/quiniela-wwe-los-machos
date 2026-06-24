"use client";

import { useState, useMemo } from 'react';
import { useBetsByDate, MatchWithBets } from '@/presentation/hooks/useBetsByDate';
import { TeamLogo } from '@/presentation/components/TeamLogo';

const pointsBadge = (pts: number) => {
  if (pts === 3) return 'bg-green-100 text-green-800 font-bold';
  if (pts === 1) return 'bg-yellow-100 text-yellow-800';
  return 'bg-gray-100 text-gray-500';
};

const MatchBetsCard = ({
  match,
  currentUserId,
}: {
  match: MatchWithBets;
  currentUserId: string | null;
}) => {
  const hasResult = match.resultadoA !== null && match.resultadoB !== null;
  const visibleBets = match.hasStarted
    ? match.bets
    : match.bets.filter((b) => b.userId === currentUserId);
  const hiddenCount = match.hasStarted ? 0 : match.bets.length - visibleBets.length;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 overflow-hidden">
      {/* Cabecera del partido */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TeamLogo
              logoUrl={match.clubA.logo_url}
              name={match.clubA.nombre}
              size={32}
            />
            <span className="text-white font-medium text-sm">{match.clubA.nombre}</span>
          </div>

          <div className="text-center px-3">
            {hasResult ? (
              <span className="bg-white text-blue-800 font-bold text-lg px-3 py-1 rounded-lg">
                {match.resultadoA} - {match.resultadoB}
              </span>
            ) : (
              <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                Pendiente
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white font-medium text-sm text-right">{match.clubB.nombre}</span>
            <TeamLogo
              logoUrl={match.clubB.logo_url}
              name={match.clubB.nombre}
              size={32}
            />
          </div>
        </div>
      </div>

      {/* Tabla de apuestas */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-2 font-medium text-gray-600">Usuario</th>
              <th className="text-center px-4 py-2 font-medium text-gray-600">Apuesta</th>
              {hasResult && (
                <th className="text-center px-4 py-2 font-medium text-gray-600">Resultado</th>
              )}
              <th className="text-center px-4 py-2 font-medium text-gray-600">Pts</th>
            </tr>
          </thead>
          <tbody>
            {visibleBets.map((bet, i) => (
              <tr
                key={bet.id}
                className={`border-b border-gray-100 last:border-0 ${
                  i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                <td className="px-4 py-2 text-gray-800">{bet.username}</td>
                <td className="px-4 py-2 text-center font-mono text-gray-700">
                  {bet.prediccionA} - {bet.prediccionB}
                </td>
                {hasResult && (
                  <td className="px-4 py-2 text-center font-mono text-gray-500">
                    {match.resultadoA} - {match.resultadoB}
                  </td>
                )}
                <td className="px-4 py-2 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${pointsBadge(bet.puntosObtenidos)}`}>
                    {bet.puntosObtenidos}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hiddenCount > 0 && (
        <div className="px-4 py-3 bg-amber-50 border-t border-amber-100 flex items-center gap-2 text-amber-700 text-xs">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Las apuestas de los otros {hiddenCount} jugador{hiddenCount !== 1 ? 'es' : ''} se revelan cuando empiece el partido.
        </div>
      )}
    </div>
  );
};

export default function Apuestas() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { matchesForDate, currentUserId, loading, error } = useBetsByDate(selectedDate);

  const changeDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d);
  };

  const formattedDate = selectedDate.toLocaleDateString('es-ES', {
    timeZone: 'America/Guatemala',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const totalApuestas = useMemo(
    () => matchesForDate.reduce((acc, m) => acc + m.bets.length, 0),
    [matchesForDate]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        Error al cargar las apuestas. Intentá recargar la página.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Apuestas del Día</h1>
          {matchesForDate.length > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">
              {matchesForDate.length} partido{matchesForDate.length !== 1 ? 's' : ''} · {totalApuestas} apuesta{totalApuestas !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Navegación de fechas */}
        <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => changeDate(-1)}
            className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>

          <div className="px-4 py-2 text-center min-w-[200px]">
            <div className="font-medium text-gray-800 capitalize">{formattedDate}</div>
          </div>

          <button
            onClick={() => changeDate(1)}
            className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>

          <button
            onClick={() => setSelectedDate(new Date())}
            className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            Hoy
          </button>
        </div>
      </div>

      {matchesForDate.length > 0 ? (
        <div className="space-y-6">
          {matchesForDate.map((match) => (
            <MatchBetsCard key={match.matchId} match={match} currentUserId={currentUserId} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-lg">No hay apuestas para esta fecha</p>
        </div>
      )}
    </div>
  );
}
