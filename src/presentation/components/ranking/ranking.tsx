// src/presentation/components/ranking/ranking.tsx
import React, { useEffect, useState } from 'react';
import { FaTrophy } from 'react-icons/fa';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';
import { useUserSession } from '@/presentation/hooks/useUserSession';

interface JugadorRanking {
  id: string;
  nombre: string;
  puntos: number;
}

export const Ranking: React.FC = () => {
  const [topJugadores, setTopJugadores] = useState<JugadorRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserSession();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchRanking = async () => {
      if (!user) {
        setTopJugadores([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('ranking')
          .select('*')
          .order('puntos', { ascending: false })
          .limit(5);

        if (error) {
          throw error;
        }

        setTopJugadores(data || []);
      } catch (error) {
        console.error('Error al cargar el ranking:', error);
        toast.error('Error al cargar el ranking');
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [user, supabase]);

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-5 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Ranking</h2>
          <FaTrophy className="text-yellow-500" />
        </div>
        <div className="text-center py-8">Cargando ranking...</div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-5 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Ranking</h2>
        <FaTrophy className="text-yellow-500" />
      </div>
      
      {topJugadores.length > 0 ? (
        <div className="space-y-3">
          {topJugadores.map((jugador, index) => (
            <div 
              key={jugador.id} 
              className={`flex items-center justify-between p-3 rounded-lg ${
                user?.id === jugador.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span 
                  className={`w-6 h-6 flex items-center justify-center rounded-full text-sm font-medium ${
                    index === 0 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : index === 1 
                        ? 'bg-gray-200 text-gray-700'
                        : index === 2
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {index + 1}
                </span>
                <span className={`font-medium ${
                  user?.id === jugador.id ? 'text-blue-700 font-semibold' : 'text-gray-800'
                }`}>
                  {jugador.nombre}
                </span>
              </div>
              <span className="font-bold text-gray-700">{jugador.puntos} pts</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No hay datos de ranking disponibles</div>
      )}
    </div>
  );
};