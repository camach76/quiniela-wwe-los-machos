"use client";

import { useState, useEffect, useMemo } from 'react';
import { useCompletedMatches } from '@/presentation/hooks/useCompletedMatches';
import { ResultCard } from '@/presentation/components/resultados/ResultCard';

// Función para formatear fechas
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export default function Resultados() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [busqueda, setBusqueda] = useState<string>('');
  
  // Obtener partidos para la fecha seleccionada
  const { matches, loading, error } = useCompletedMatches(selectedDate);

  // Navegar entre fechas
  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  // Filtrar partidos según la búsqueda
  const partidosFiltrados = useMemo(() => {
    return matches.filter(partido => {
      if (!busqueda.trim()) return true;
      
      const busquedaMin = busqueda.toLowerCase();
      return (
        (partido.clubA?.nombre.toLowerCase().includes(busquedaMin) ||
         partido.clubB?.nombre.toLowerCase().includes(busquedaMin) ||
         partido.estadio?.toLowerCase().includes(busquedaMin))
      );
    });
  }, [matches, busqueda]);

  // Formatear la fecha para mostrar
  const formattedDate = selectedDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        Error al cargar los partidos. Intenta recargar la página.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Resultados de Partidos</h1>
        
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
      
      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Buscar partidos por equipo o estadio..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute right-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
      </div>

      {/* Lista de partidos */}
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
        {partidosFiltrados.length > 0 ? (
          partidosFiltrados.map((partido) => (
            <ResultCard key={partido.id} match={partido} />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            {busqueda 
              ? 'No se encontraron partidos que coincidan con la búsqueda.'
              : 'No hay partidos programados para esta fecha.'}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}