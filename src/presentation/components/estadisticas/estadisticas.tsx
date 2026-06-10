import React from 'react';

interface EstadisticasProps {
  puntuacion: number;
  aciertos: number;
  totalPronosticos: number;
  precision: number;
  racha: number;
}

export const Estadisticas: React.FC<EstadisticasProps> = ({
  puntuacion,
  aciertos,
  totalPronosticos,
  precision,
  racha,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-5 border border-white/20">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Mis Estadísticas</h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-2xl font-bold text-blue-600">{puntuacion}</p>
          <p className="text-xs text-gray-500">Puntos</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-2xl font-bold text-green-600">{aciertos}<span className="text-sm font-normal text-gray-400">/{totalPronosticos}</span></p>
          <p className="text-xs text-gray-500">Aciertos</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3">
          <p className="text-2xl font-bold text-purple-600">{precision}<span className="text-sm font-normal text-gray-400">%</span></p>
          <p className="text-xs text-gray-500">Precisión</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-3">
          <p className="text-2xl font-bold text-orange-500">{racha}</p>
          <p className="text-xs text-gray-500">Racha</p>
        </div>
      </div>
    </div>
  );
};
