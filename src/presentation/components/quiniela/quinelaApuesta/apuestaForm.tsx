"use client";

import React, { useState } from "react";
import { TeamLogo } from "@/presentation/components/TeamLogo";

interface ApuestaFormProps {
  match: {
    id: string;
    fecha: string;
    club_a: { nombre: string; logo: string };
    club_b: { nombre: string; logo: string };
  };
  bet?: {
    prediccion_a: number;
    prediccion_b: number;
  } | null;
  onSubmit: (a: number, b: number) => void;
}

export const ApuestaForm: React.FC<ApuestaFormProps> = ({
  match,
  bet,
  onSubmit,
}) => {
  const [a, setA] = useState<string>(
    bet?.prediccion_a !== undefined && bet?.prediccion_a !== null && bet.prediccion_a >= 0
      ? bet.prediccion_a.toString()
      : ""
  );

  const [b, setB] = useState<string>(
    bet?.prediccion_b !== undefined && bet?.prediccion_b !== null && bet.prediccion_b >= 0
      ? bet.prediccion_b.toString()
      : ""
  );

  const [showSuccess, setShowSuccess] = useState(false);
  // Componente TeamLogo ya está importado y listo para usar

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Asegurarse de que los valores no estén vacíos
    if (a === '' || b === '') {
      return;
    }
    // Convertir a números y validar que sean números válidos
    const scoreA = parseInt(a);
    const scoreB = parseInt(b);
    if (isNaN(scoreA) || isNaN(scoreB)) {
      return;
    }
    onSubmit(scoreA, scoreB);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        day: date.toLocaleDateString("es-ES", { weekday: 'long' }),
        time: date.toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' })
      };
    } catch (error) {
      return {
        day: 'Fecha no disponible',
        time: ''
      };
    }
  };

  const { day, time } = formatDate(match.fecha);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl w-full max-w-2xl mx-auto">
      <div className="h-1.5 bg-gradient-to-r from-blue-600 to-blue-800"></div>
      
      <div className="p-6">
        {/* Encabezado con fecha */}
        <div className="text-center mb-6">
          <span className="inline-block px-4 py-1.5 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
            {day.charAt(0).toUpperCase() + day.slice(1)} • {time}
          </span>
        </div>

        {/* Equipos y marcadores */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-12 items-center gap-4 md:gap-6">
            {/* Equipo Local */}
            <div className="col-span-5">
              <div className="flex flex-col items-center space-y-2">
                <TeamLogo 
                  name={match.club_a.nombre}
                  logoUrl={match.club_a?.logo}
                  size={72}
                  className="w-16 h-16"
                />
                <span className="text-sm md:text-base font-medium text-center text-gray-800">{match.club_a.nombre}</span>
              </div>
            </div>

            {/* Marcador */}
            <div className="col-span-2">
              <div className="flex items-center justify-center space-x-2">
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="99"
                    className={`w-16 h-16 text-center text-3xl font-bold border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      bet ? 'bg-gray-100' : 'bg-white hover:border-blue-300'
                    }`}
                    value={a}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d+$/.test(value)) {
                        setA(value);
                      }
                    }}
                    disabled={!!bet}
                    required
                  />
                </div>
                <span className="text-3xl font-bold text-gray-700">:</span>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="99"
                    className={`w-16 h-16 text-center text-3xl font-bold border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      bet ? 'bg-gray-100' : 'bg-white hover:border-blue-300'
                    }`}
                    value={b}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d+$/.test(value)) {
                        setB(value);
                      }
                    }}
                    disabled={!!bet}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Equipo Visitante */}
            <div className="col-span-5">
              <div className="flex flex-col items-center space-y-2">
                <TeamLogo 
                  name={match.club_b.nombre}
                  logoUrl={match.club_b?.logo}
                  size={72}
                  className="w-16 h-16"
                />
                <span className="text-sm md:text-base font-medium text-center text-gray-800">{match.club_b.nombre}</span>
              </div>
            </div>
          </div>

          {/* Mensajes de estado */}
          <div className={`h-8 flex items-center justify-center`}>
            {showSuccess ? (
              <p className="text-center text-green-600 text-sm font-medium animate-fade-in">
                ¡Apuesta guardada! ✓
              </p>
            ) : bet ? (
              <p className="text-center text-green-600 text-sm font-medium">
                Ya apostaste este partido
              </p>
            ) : null}
          </div>

          {/* Botón de acción */}
          {!bet && (
            <div className="pt-2">
              <button
                type="submit"
                disabled={!a || !b}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
                  !a || !b
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg active:scale-95'
                }`}
              >
                GUARDAR APUESTA
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
