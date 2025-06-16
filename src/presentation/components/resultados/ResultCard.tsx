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

  // Crear fecha a partir del string ISO
  const matchDate = new Date(match.fecha);
  
  // Formatear fecha en español
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC' // Usar UTC para mantener consistencia
  };
  
  const formattedDate = matchDate.toLocaleDateString('es-ES', options);
  
  // Formatear hora
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC' // Usar UTC para mantener consistencia
  };
  
  const formattedTime = matchDate.toLocaleTimeString('es-ES', timeOptions);

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
    <div className="relative w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 flex flex-col">
      {/* Fondo con opacidad */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="/images/bgFifa.jpg" 
          alt="Fondo de la tarjeta"
          className="w-full h-full object-cover opacity-30"
        />
      </div>
      
      {/* Encabezado con fecha, hora y estadio */}
      <div className="relative z-10 bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-2 sm:px-6 md:px-8">
        <div className="flex flex-col items-center space-y-1 sm:space-y-2">
          <div className="flex flex-wrap justify-center gap-2">
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs sm:text-sm text-white whitespace-nowrap">
              {formattedDate}
            </span>
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs sm:text-sm text-white whitespace-nowrap">
              {formattedTime}
            </span>
          </div>
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs sm:text-sm text-white text-center max-w-full truncate">
            {match.estadio}
          </span>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 p-3 sm:p-4 md:p-6 flex flex-col items-center">
        {/* Equipos y resultado */}
        <div className="w-full">
          <div className="grid grid-cols-7 items-center gap-2 w-full">
            {/* Equipo Local */}
            <div className="col-span-3 flex flex-col items-center space-y-1 sm:space-y-2">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20">
                <TeamLogo logoUrl={match.clubA?.logo_url} name={match.clubA?.nombre} size={48} />
              </div>
              <span className="text-xs sm:text-sm md:text-base font-medium text-center text-gray-800 line-clamp-2 leading-tight">
                {match.clubA?.nombre}
              </span>
            </div>

            {/* Marcador */}
            <div className="col-span-1 flex flex-col items-center">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-2xl sm:text-3xl md:text-4xl font-bold px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-lg shadow-md whitespace-nowrap">
                {resultadoA} : {resultadoB}
              </div>
              <span className={`mt-1 sm:mt-2 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] xs:text-xs sm:text-sm font-medium ${
                matchStatus === 'Finalizado' ? 'bg-green-100 text-green-800' :
                matchStatus === 'En juego' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {matchStatus}
              </span>
            </div>

            {/* Equipo Visitante */}
            <div className="col-span-3 flex flex-col items-center space-y-1 sm:space-y-2">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20">
                <TeamLogo logoUrl={match.clubB?.logo_url} name={match.clubB?.nombre} size={48} />
              </div>
              <span className="text-xs sm:text-sm md:text-base font-medium text-center text-gray-800 line-clamp-2 leading-tight">
                {match.clubB?.nombre}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
