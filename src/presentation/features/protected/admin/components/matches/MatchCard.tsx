import { Match } from '../../types/match';
import { MatchWithClubs } from '../../types/match';

interface MatchCardProps {
  match: MatchWithClubs;
  onEdit: (match: MatchWithClubs) => void;
  onReset: (matchId: number) => void;
  isSubmitting?: boolean;
}

export const MatchCard = ({ match, onEdit, onReset, isSubmitting = false }: MatchCardProps) => {
  const date = new Date(match.fecha);
  const formattedDate = date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const getMatchStatus = () => {
    if (match.is_complete) {
      return 'Completado';
    }
    const now = new Date();
    return date > now ? 'Pendiente' : 'En curso';
  };

  const getMatchResult = () => {
    if (!match.is_complete || match.resultado_a === null || match.resultado_b === null) {
      return 'No disponible';
    }
    
    if (match.resultado_a === match.resultado_b) {
      return `Empate ${match.resultado_a}-${match.resultado_b}`;
    }
    
    const winnerName = match.resultado_a > match.resultado_b ? match.club_a_nombre : match.club_b_nombre;
    const winnerScore = Math.max(match.resultado_a, match.resultado_b);
    const loserScore = Math.min(match.resultado_a, match.resultado_b);
    
    return `${winnerName} ${winnerScore}-${loserScore}`;
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-4">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {match.club_a_nombre} vs {match.club_b_nombre}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {formattedDate}
          </p>
          {match.estadio && (
            <p className="mt-1 text-sm text-gray-500">
              {match.estadio}
            </p>
          )}
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          match.is_complete ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {getMatchStatus()}
        </span>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Resultado</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {getMatchResult()}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Acciones</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 space-x-2">
              <button
                type="button"
                onClick={() => onEdit(match)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {match.is_complete ? 'Editar' : 'Agregar'} resultado
              </button>
              {match.is_complete && (
                <button
                  type="button"
                  onClick={() => onReset(match.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Reiniciar
                </button>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};
function getMethodName(method: string): string {
  const methods: Record<string, string> = {
    pin: 'Pin',
    submission: 'Sumisión',
    decision: 'Decisión',
    dq: 'Descalificación',
    other: 'Otro',
  };
  return methods[method] || method;
}
