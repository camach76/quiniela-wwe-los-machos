import React from 'react';
import Image from 'next/image';

interface Equipo {
  nombre: string;
  logo: string;
  fondo: string;
}

interface MatchCardProps {
  local: Equipo;
  visitante: Equipo;
  fecha: string;
  torneo?: string;
  className?: string;
}

export const MatchCard: React.FC<MatchCardProps> = ({ 
  local, 
  visitante, 
  fecha, 
  torneo,
  className = '' 
}) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-xl h-64 ${className}`}>
      {/* Fondo del equipo local (izquierda) */}
      <div 
        className="absolute inset-0 w-1/2 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${local.fondo})`,
          clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0% 100%)'
        }}
      />
      
      {/* Fondo del equipo visitante (derecha) */}
      <div 
        className="absolute inset-0 left-1/2 w-1/2 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${visitante.fondo})`,
          clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)'
        }}
      /> 
      {/* Overlay con gradiente central */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
      {/* Contenido principal */}
      <div className="relative z-10 h-full flex flex-col justify-center p-6 text-white">
        {torneo && (
          <div className="text-center text-sm font-medium text-gray-200 mb-2">
            {torneo.toUpperCase()}
          </div>
        )}
        
        <div className="flex items-center justify-between h-3/4">
          {/* Equipo local */}
          <div className="flex-1 flex flex-col items-center space-y-2">
            <div className="w-20 h-20 relative">
              <Image
                src={local.logo}
                alt={local.nombre}
                fill
                className="object-contain"
              />
            </div>
            <span className="text-lg font-bold text-center">{local.nombre}</span>
          </div>
          
          {/* VS central */}
          <div className="mx-4 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center border-2 border-white/30">
              <span className="text-2xl font-black">VS</span>
            </div>
            <div className="mt-2 text-sm bg-black/50 px-3 py-1 rounded-full">
              {new Date(fecha).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
          
          {/* Equipo visitante */}
          <div className="flex-1 flex flex-col items-center space-y-2">
            <div className="w-20 h-20 relative">
              <Image
                src={visitante.logo}
                alt={visitante.nombre}
                fill
                className="object-contain"
              />
            </div>
            <span className="text-lg font-bold text-center">{visitante.nombre}</span>
          </div>
        </div>
      </div>
    </div>
  );
};