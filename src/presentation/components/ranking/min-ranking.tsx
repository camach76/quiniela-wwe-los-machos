import React, { useEffect, useState } from 'react';
import { FaTrophy, FaChevronRight } from 'react-icons/fa';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';
import { useUserSession } from '@/presentation/hooks/useUserSession';
import Link from 'next/link';

interface JugadorRanking {
  id: string;
  nombre: string;
  puntos: number;
}

export const MinRanking: React.FC = () => {
  const [topJugadores, setTopJugadores] = useState<JugadorRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserSession();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoading(true);
        
        // Primero intentamos con la tabla profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, puntos')
          .order('puntos', { ascending: false })
          .limit(5);

        if (error) {
          throw error;
        }

        // Mapeamos los datos al formato esperado
        const jugadores = (data || []).map((jugador: any) => ({
          id: jugador.id,
          nombre: jugador.username || 'Usuario',
          puntos: jugador.puntos || 0
        }));

        setTopJugadores(jugadores);
      } catch (error) {
        console.error('Error al cargar el ranking:', error);
        toast.error('No se pudo cargar el ranking');
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [supabase]);

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-5 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Top Jugadores</h2>
          <FaTrophy className="text-yellow-500" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex justify-between py-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-8"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-5 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Top Jugadores</h2>
        <FaTrophy className="text-yellow-500" />
      </div> 
      {topJugadores.length > 0 ? (
        <div className="space-y-3">
          {topJugadores.map((jugador, index) => (
            <div 
              key={jugador.id} 
              className={`flex items-center justify-between p-2 rounded-lg ${
                user?.id === jugador.id ? 'bg-blue-50' : 'bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span 
                  className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium ${
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
                <span className={`text-sm ${user?.id === jugador.id ? 'text-blue-700 font-semibold' : 'text-gray-700'}`}>
                  {jugador.nombre}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-700">{jugador.puntos} pts</span>
            </div>
          ))}
          
          <div className="pt-2">
            <Link 
              href="/ranking" 
              className="flex items-center justify-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium mt-2"
            >
              Ver ranking completo <FaChevronRight className="text-xs" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 text-sm">
          No hay datos de ranking disponibles
        </div>
      )}
    </div>
  );
};