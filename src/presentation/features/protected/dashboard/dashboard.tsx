"use client";

import { useState, useEffect } from "react";
import { useUserSession } from "@/presentation/hooks/useUserSession";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-hot-toast";
import { Navbar } from "@/presentation/components/navbar/navbar";
import { Estadisticas } from "@/presentation/components/estadisticas/estadisticas";
import { MinRanking } from "@/presentation/components/ranking/min-ranking";
import { AccesosRapidos } from "@/presentation/components/fastAcces/fastAcces";
import { MatchesList } from "@/presentation/components/matchList/matchList";

export default function Dashboard() {
  const { user } = useUserSession();
  const supabase = createClientComponentClient();  
  const [activeTab, setActiveTab] = useState<"proximos" | "recientes">("proximos");
  
  // Estados para el ranking
  const [topJugadores, setTopJugadores] = useState<any[]>([]);
  const [loadingRanking, setLoadingRanking] = useState(true);

  // Cargar ranking
  useEffect(() => {
    const fetchRanking = async () => {
      if (!user) {
        setTopJugadores([]);
        setLoadingRanking(false);
        return;
      }

      try {
        setLoadingRanking(true);
        const res = await fetch(`/api/ranking?userId=${user.id}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Error al cargar el ranking');
        }
        
        setTopJugadores(data);
      } catch (error) {
        console.error('Error al cargar el ranking:', error);
        toast.error('Error al cargar el ranking');
      } finally {
        setLoadingRanking(false);
      }
    };

    fetchRanking();
  }, [user]);

  // Estadísticas del usuario (ejemplo)
  const estadisticas = {
    puntuacion: 150,
    aciertos: 12,
    totalPronosticos: 15
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
      <Navbar appName="Quiniela WWE Los Machos" />
      <main className="w-full px-4 lg:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Columna izquierda - Estadísticas y accesos rápidos */}
          <div className="w-full lg:w-1/4 space-y-6">
            <Estadisticas 
              puntuacion={estadisticas.puntuacion}
              aciertos={estadisticas.aciertos}
              totalPronosticos={estadisticas.totalPronosticos}
            />
            <AccesosRapidos />
          </div>

          {/* Columna central - Lista de partidos */}
          <div className="flex-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/20">
              {/* Pestañas */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("proximos")}
                  className={`flex-1 py-3 px-4 text-center font-medium ${
                    activeTab === "proximos" 
                      ? "text-blue-600 border-b-2 border-blue-500" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Próximos Partidos
                </button>
                <button
                  onClick={() => setActiveTab("recientes")}
                  className={`flex-1 py-3 px-4 text-center font-medium ${
                    activeTab === "recientes" 
                      ? "text-blue-600 border-b-2 border-blue-500" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Partidos Recientes
                </button>
              </div>

              {/* Contenido de las pestañas */}
              <div className="p-6">
                <MatchesList tipo={activeTab} />
              </div>
            </div>
          </div>

          {/* Columna derecha - Ranking */}
          <div className="w-full lg:w-1/4">
            <div className="sticky top-6">
              <MinRanking />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}