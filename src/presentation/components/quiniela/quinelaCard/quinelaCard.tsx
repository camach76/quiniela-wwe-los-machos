import React from "react";
import Image from "next/image";

interface Equipo {
  nombre: string;
  logo: string;
  fondo: string;
}

interface QuinielaCardProps {
  local: Equipo;
  visitante: Equipo;
  fecha: string;
  torneo?: string;
  pronostico: { a: number; b: number };
  resultado?: { a: number; b: number } | null;
  puntos: number;
  className?: string;
}

export const QuinielaCard: React.FC<QuinielaCardProps> = ({
  local,
  visitante,
  fecha,
  torneo,
  pronostico,
  resultado,
  puntos,
  className = "",
}) => {
  const partidoJugado = resultado?.a !== null && resultado?.b !== null;
  const acertado =
    partidoJugado &&
    pronostico.a === resultado?.a &&
    pronostico.b === resultado?.b;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl shadow-xl h-64 ${className}`}
    >
      {/* Fondos visuales */}
      <div
        className="absolute inset-0 w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: `url(${local.fondo})`,
          clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)",
        }}
      />
      <div
        className="absolute inset-0 left-1/2 w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: `url(${visitante.fondo})`,
          clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

      {/* Contenido */}
      <div className="relative z-10 h-full flex flex-col justify-center p-3 text-white">
        {torneo && (
          <div className="text-center text-sm font-medium text-gray-200 mb-2">
            {torneo.toUpperCase()}
          </div>
        )}

        <div className="flex items-center justify-between h-3/4">
          {/* Local */}
          <div className="flex-1 flex flex-col items-center space-y-2">
            <div className="w-20 h-20 relative">
              <Image
                src={local.logo}
                alt={local.nombre}
                fill
                className="object-contain"
              />
            </div>
            <span className="text-lg font-bold text-center">
              {local.nombre}
            </span>
          </div>

          {/* Centro */}
          <div className="mx-4 flex flex-col items-center text-sm">
            <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center border-2 border-white/30">
              <span className="text-2xl font-black">VS</span>
            </div>
            <div className="mt-1 text-xs bg-black/50 px-3 py-1 rounded-full">
              {new Date(fecha).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>

            {/* Pronóstico */}
            <div className="mt-2 text-xs text-center">
              <div className="font-medium">Tu pronóstico:</div>
              <div className="text-white font-bold">
                {pronostico.a} - {pronostico.b}
              </div>
            </div>

            {/* Resultado real */}
            {partidoJugado && (
              <div className="mt-1 text-xs text-center">
                <div className="font-medium">Resultado:</div>
                <div
                  className={`font-bold ${acertado ? "text-green-400" : "text-red-400"}`}
                >
                  {resultado?.a} - {resultado?.b}
                </div>
              </div>
            )}

            {/* Puntos */}
            {partidoJugado && (
              <div className="mt-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                Puntos: <span className="font-bold">{puntos}</span>
              </div>
            )}
          </div>

          {/* Visitante */}
          <div className="flex-1 flex flex-col items-center space-y-2">
            <div className="w-20 h-20 relative">
              <Image
                src={visitante.logo}
                alt={visitante.nombre}
                fill
                className="object-contain"
              />
            </div>
            <span className="text-lg font-bold text-center">
              {visitante.nombre}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
