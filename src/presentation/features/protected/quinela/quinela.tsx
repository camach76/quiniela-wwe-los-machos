"use client";

import { useEffect, useState } from 'react';
import { Match } from '@/backend/core/domain/entities/MatchesEntity';
import { MatchRepository } from '@/backend/core/domain/repositories/MatchesRepository';
import { SupabaseMatchRepository } from '@/backend/core/infra/repositories/SupabaseMatchRepository';
import { supabase } from '@/presentation/utils/supabase/client';

export default function Quinela() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [prediccionA, setPrediccionA] = useState<string>('');
  const [prediccionB, setPrediccionB] = useState<string>('');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const matchRepo: MatchRepository = new SupabaseMatchRepository(supabase);
        const upcomingMatches = await matchRepo.getUpcoming();
        setMatches(upcomingMatches);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError('Error al cargar los partidos');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleSubmitPrediction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch) return;
    
    // Aquí implementaremos la lógica para guardar la apuesta
    console.log('Guardando apuesta:', {
      matchId: selectedMatch.id,
      prediccionA: parseInt(prediccionA),
      prediccionB: parseInt(prediccionB)
    });
  };

  if (loading) return <div>Cargando partidos...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Quiniela</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lista de partidos */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Próximos Partidos</h2>
          {matches.length === 0 ? (
            <p>No hay partidos próximos</p>
          ) : (
            <ul className="space-y-4">
              {matches.map((match) => (
                <li 
                  key={match.id}
                  className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${selectedMatch?.id === match.id ? 'border-blue-500 bg-blue-50' : ''}`}
                  onClick={() => setSelectedMatch(match)}
                >
                  <div className="flex justify-between items-center">
                    <span>Equipo A vs Equipo B</span>
                    <span className="text-sm text-gray-500">
                      {new Date(match.fecha).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Formulario de predicción */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            {selectedMatch ? 'Hacer Predicción' : 'Selecciona un partido'}
          </h2>
          
          {selectedMatch ? (
            <form onSubmit={handleSubmitPrediction} className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">
                  Predicción para {new Date(selectedMatch.fecha).toLocaleDateString()}
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Equipo A
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={prediccionA}
                      onChange={(e) => setPrediccionA(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center justify-center text-xl font-bold">
                    -
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Equipo B
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={prediccionB}
                      onChange={(e) => setPrediccionB(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Guardar Predicción
                </button>
              </div>
            </form>
          ) : (
            <p className="text-gray-500">Selecciona un partido para hacer tu predicción</p>
          )}
        </div>
      </div>
    </div>
  );
}
