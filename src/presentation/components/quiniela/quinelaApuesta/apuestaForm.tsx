"use client";

import React, { useState, useMemo, useEffect } from "react";
import { TeamLogo } from "@/presentation/components/TeamLogo";

interface ApuestaFormProps {
  match: {
    id: string;
    fecha: string;
    club_a: { nombre: string; logo: string };
    club_b: { nombre: string; logo: string };
  };
  bet?: {
    id?: number;
    userId?: string;
    matchId?: number;
    prediccionA: number;
    prediccionB: number;
    puntosObtenidos?: number;
    createdAt?: string;
    updatedAt?: string;
  } | null;
  onSubmit: (a: number, b: number) => void;
}

export const ApuestaForm: React.FC<ApuestaFormProps> = ({
  match,
  bet,
  onSubmit,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Verificar si el partido ya comenzó
  const isMatchStarted = useMemo(() => {
    try {
      const matchDate = new Date(match.fecha);
      const now = new Date();
      return now >= matchDate;
    } catch (error) {
      return false; // En caso de error, asumir que no ha comenzado
    }
  }, [match.fecha]);
  
  // Determinar si los inputs deben estar deshabilitados
  const isDisabled = isMatchStarted; // Solo deshabilitar si el partido ya comenzó
  
  
  // Usar los valores de la apuesta existente si están disponibles
  // y forzar la actualización cuando cambie el prop 'bet'
  const [a, setA] = useState<string>(
    bet?.prediccionA !== undefined && bet?.prediccionA !== null && bet.prediccionA >= 0
      ? bet.prediccionA.toString()
      : ""
  );

  const [b, setB] = useState<string>(
    bet?.prediccionB !== undefined && bet?.prediccionB !== null && bet.prediccionB >= 0
      ? bet.prediccionB.toString()
      : ""
  );

  // Actualizar los estados locales cuando cambie el prop 'bet'
  useEffect(() => {
    if (bet?.prediccionA !== undefined && bet?.prediccionA !== null && bet.prediccionA >= 0) {
      setA(bet.prediccionA.toString());
    } else {
      setA("");
    }

    if (bet?.prediccionB !== undefined && bet?.prediccionB !== null && bet.prediccionB >= 0) {
      setB(bet.prediccionB.toString());
    } else {
      setB("");
    }
  }, [bet]);

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
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl w-full max-w-2xl mx-3 sm:mx-auto">
      <div className="h-1.5 bg-gradient-to-r from-blue-600 to-blue-800"></div>
      
      <div className="p-4 sm:p-6">
        {/* Encabezado con fecha */}
        <div className="text-center mb-4 sm:mb-6">
          <span className="inline-block px-3 py-1 text-xs sm:text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
            {day.charAt(0).toUpperCase() + day.slice(1)} • {time}
          </span>
        </div>

        {/* Equipos y marcadores */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-12 items-center gap-2 sm:gap-4 md:gap-6">
            {/* Equipo Local */}
            <div className="col-span-5">
              <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                <TeamLogo 
                  name={match.club_a.nombre}
                  logoUrl={match.club_a?.logo}
                  size={64}
                  className="w-14 h-14 sm:w-16 sm:h-16"
                />
                <span className="text-xs sm:text-sm md:text-base font-medium text-center text-gray-800 line-clamp-2 h-8 sm:h-auto">
                  {match.club_a.nombre}
                </span>
              </div>
            </div>

            {/* Marcador */}
            <div className="col-span-2">
              <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="99"
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-2xl sm:text-3xl font-bold border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center bg-white text-gray-900 border-gray-300"
                    value={a}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d+$/.test(value)) {
                        setA(value);
                      }
                    }}
                    disabled={isDisabled}
                    style={isDisabled ? { 
                      backgroundColor: '#f3f4f6',
                      color: '#111827',
                      fontWeight: 'bold',
                      opacity: 1,
                      WebkitTextFillColor: '#111827'
                    } : {}}
                    required
                  />
                </div>
                <span className="text-2xl sm:text-3xl font-bold text-gray-700">:</span>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="99"
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-2xl sm:text-3xl font-bold border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center bg-white text-gray-900 border-gray-300"
                    value={b}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d+$/.test(value)) {
                        setB(value);
                      }
                    }}
                    disabled={isDisabled}
                    style={isDisabled ? { 
                      backgroundColor: '#f3f4f6',
                      color: '#111827',
                      fontWeight: 'bold',
                      opacity: 1,
                      WebkitTextFillColor: '#111827'
                    } : {}}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Equipo Visitante */}
            <div className="col-span-5">
              <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                <TeamLogo 
                  name={match.club_b.nombre}
                  logoUrl={match.club_b?.logo}
                  size={64}
                  className="w-14 h-14 sm:w-16 sm:h-16"
                />
                <span className="text-xs sm:text-sm md:text-base font-medium text-center text-gray-800 line-clamp-2 h-8 sm:h-auto">
                  {match.club_b.nombre}
                </span>
              </div>
            </div>
          </div>
          
          {/* Mensajes de estado */}
          <div className={`h-8 flex items-center justify-center`}>
            {showSuccess ? (
              <p className="text-center text-green-600 text-xs sm:text-sm font-medium animate-fade-in">
                ¡Apuesta guardada! ✓
              </p>
            ) : bet ? (
              <p className="text-center text-green-600 text-xs sm:text-sm font-medium">
                {isMatchStarted 
                  ? 'El partido ya comenzó' 
                  : 'Puedes modificar tu apuesta hasta que comience el partido'}
              </p>
            ) : null}
          </div>

          {/* Botón de acción */}
          {!isMatchStarted && (
            <div className="pt-2">
              <button
                type="submit"
                disabled={!a || !b}
                className={`w-full py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold text-white transition-all duration-300 text-sm sm:text-base ${
                  !a || !b
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg active:scale-95'
                }`}
              >
                {bet ? 'ACTUALIZAR APUESTA' : 'GUARDAR APUESTA'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
