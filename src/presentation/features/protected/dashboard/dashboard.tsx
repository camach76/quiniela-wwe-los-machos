"use client";

import { useState, useEffect } from "react";
import { useUserSession } from "@/presentation/hooks/useUserSession";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-hot-toast";
import { Estadisticas } from "@/presentation/components/estadisticas/estadisticas";
import { MinRanking } from "@/presentation/components/ranking/min-ranking";
import { AccesosRapidos } from "@/presentation/components/fastAcces/fastAcces";
import { MatchListComplete } from "@/presentation/components/matchListComplete/matchListComplete";
// El componente MinRanking ya maneja su propio estado
import { UpcomingMatchesList } from "@/presentation/components/matchList/UpcomingMatchesList";

export default function Dashboard() {
  const { user } = useUserSession();
  const [activeTab, setActiveTab] = useState<"proximos" | "completados">("proximos");
  ;
  // El componente MinRanking maneja su propio estado

  // Estadísticas del usuario
  const estadisticas = {
    puntuacion: user?.puntos || 0,
    aciertos: user?.aciertos || 0,
    totalPronosticos: user?.total_apostados || 0,
    precision: user?.precision || 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
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
                  onClick={() => setActiveTab("completados")}
                  className={`flex-1 py-3 text-center font-medium ${
                    activeTab === "completados"
                      ? "text-blue-600 border-b-2 border-blue-500" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Partidos Completados
                </button>
              </div>
              {/* Contenido de las pestañas */}
              <div className="p-3">
                {activeTab === 'completados' ? (
                  <MatchListComplete maxItems={3} />
                ) : (
                  <UpcomingMatchesList limit={3} />
                )}
              </div>
            </div>
          </div>
          
          {/* Columna derecha - Ranking */}
          <div className="w-full lg:w-1/4 space-y-6">
            <MinRanking />
          </div>
        </div>
      </main>
    </div>
  );
}