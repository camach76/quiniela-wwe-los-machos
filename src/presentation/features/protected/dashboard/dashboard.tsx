"use client";

import { useState } from "react";
import { useProfile } from "@/presentation/hooks/useProfile";
import { Estadisticas } from "@/presentation/components/estadisticas/estadisticas";
import { MinRanking } from "@/presentation/components/ranking/min-ranking";
import { AccesosRapidos } from "@/presentation/components/fastAcces/fastAcces";
import { MatchListComplete } from "@/presentation/components/matchListComplete/matchListComplete";
// El componente MinRanking ya maneja su propio estado
import { UpcomingMatchesList } from "@/presentation/components/matchList/UpcomingMatchesList";

export default function Dashboard() {
  const { profile } = useProfile();
  const [activeTab, setActiveTab] = useState<"proximos" | "completados">("proximos");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
      <main className="w-full px-4 lg:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Columna izquierda - Estadísticas y accesos rápidos */}
          <div className="w-full lg:w-1/4 space-y-6">
            <Estadisticas
              puntuacion={profile?.puntos ?? 0}
              aciertos={profile?.aciertos ?? 0}
              totalPronosticos={profile?.total_apostados ?? 0}
              precision={profile?.precision ?? 0}
              racha={profile?.racha ?? 0}
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