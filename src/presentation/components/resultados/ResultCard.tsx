import { Match } from '@/presentation/hooks/useCompletedMatches';
import { TeamLogo } from '@/presentation/components/TeamLogo';

interface ResultCardProps {
  match: Match;
}

export const ResultCard = ({ match }: ResultCardProps) => {
  if (!match.clubA || !match.clubB) {
    return null; // No mostrar si no hay equipos
  }
  
  // Asegurarse de que los resultados no sean null
  const resultadoA = match.resultadoA ?? 0;
  const resultadoB = match.resultadoB ?? 0;

  // Formatear la fecha del partido
  const matchDate = new Date(match.fecha);
  const formattedDate = matchDate.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const formattedTime = matchDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Determinar el estado del partido
  const getMatchStatus = () => {
    if (match.isComplete) return 'Finalizado';
    const now = new Date();
    return now > matchDate ? 'En juego' : 'Por jugar';
  };

  const matchStatus = getMatchStatus();
  const statusColor = matchStatus === 'Finalizado' ? 'bg-green-100 text-green-800' : 
                     matchStatus === 'En juego' ? 'bg-yellow-100 text-yellow-800' : 
                     'bg-blue-100 text-blue-800';

  return (
    <div className="relative w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 flex flex-col">
      {/* Fondo con opacidad */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="/images/bgFifa.jpg" 
          alt="Fondo de la tarjeta"
          className="w-full h-full object-cover opacity-50"
        />
      </div>
      {/* Encabezado con información del partido */}
      <div className="relative z-10 bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-2">
        <div className="flex flex-col items-center space-y-2">
          {/* Fecha y hora */}
          <div className="flex items-center gap-2">
            <span className="text-white/90 text-xs bg-black/20 px-3 py-1 rounded-full">
              {formattedDate}
            </span>
            <span className="text-white/90 text-xs bg-black/20 px-3 py-1 rounded-full">
              {formattedTime}
            </span>
          </div>
          
          {/* Tag del estadio */}
          <div className="mt-2">
            <span className="text-white/90 text-sm font-medium bg-black/20 px-4 py-1.5 rounded-full">
              {match.estadio || 'Estadio no disponible'}
            </span>
          </div>
        </div>
      </div>

      {/* Contenido principal con los equipos y resultado */}
      <div className="relative z-10 p-10 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-12 items-center gap-8">
          {/* Equipo local */}
          <div className="col-span-5 flex flex-col items-center">
            <h4 className="font-semibold text-center text-gray-800 text-lg mb-4">
              {match.clubA.nombre}
            </h4>
            <TeamLogo 
              name={match.clubA.nombre} 
              logoUrl={match.clubA.logo_url} 
              size={120}
              className="mb-4"
            />

          </div>

          {/* Marcador */}
          <div className="col-span-2 flex flex-col items-center">
            <div className="bg-gray-100 rounded-xl p-4 shadow-inner">
              <div className="flex items-center justify-center space-x-4">
                <span className="text-6xl font-bold text-gray-800 w-16 text-center">{resultadoA}</span>
                <span className="text-4xl text-gray-500">:</span>
                <span className="text-6xl font-bold text-gray-800 w-16 text-center">{resultadoB}</span>
              </div>
              <div className={`mt-2 px-4 py-2 rounded-full text-sm font-medium text-center ${statusColor}`}>
                {matchStatus}
              </div>
            </div>
            

          </div>

          {/* Equipo visitante */}
          <div className="col-span-5 flex flex-col items-center">
            <h4 className="font-semibold text-center text-gray-800 text-lg mb-4">
              {match.clubB.nombre}
            </h4>
            <TeamLogo 
              name={match.clubB.nombre} 
              logoUrl={match.clubB.logo_url} 
              size={120}
              className="mb-4"
            />

          </div>
        </div>

        {/* Detalles adicionales - Solo el ícono de ubicación */}
        <div className="relative z-10 mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-center text-sm text-gray-600">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {match.estadio || 'Estadio no disponible'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
