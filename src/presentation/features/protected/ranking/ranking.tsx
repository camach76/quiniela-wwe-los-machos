"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaFilter, FaSearch, FaTrophy } from "react-icons/fa";
import { SupabaseUserRepository } from "@/backend/core/infra/repositories/SupabaseUserReposotory";
import supabase from "@/presentation/utils/supabase/client";

type RankingJugador = {
  id: string;
  nombre: string;
  puntos: number;
  aciertos: number;
  total: number;
  precision: number;
  racha: number;
  avatar: string;
  esUsuario: boolean;
};

export default function RankingPage() {
  const [jugadores, setJugadores] = useState<RankingJugador[]>([]);
  const [filteredJugadores, setFilteredJugadores] = useState<RankingJugador[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<
    "puntos" | "precision" | "aciertos" | "racha"
  >("puntos");
  const [showFilters, setShowFilters] = useState(false);

  const userName = jugadores.find((j) => j.esUsuario)?.nombre || "Usuario";

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const userRepo = new SupabaseUserRepository(supabase);
        const users = await userRepo.getRanking();

        // Obtener la sesión actual para marcar al usuario actual
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        const rankingData: RankingJugador[] = users.map((user) => ({
          id: user.id,
          nombre: user.username || "Usuario",
          puntos: user.puntos || 0,
          aciertos: user.aciertos || 0,
          total: user.total_apostados || 0,
          precision: user.precision || 0,
          racha: user.racha || 0,
          avatar: "/images/avatar-placeholder.png", // Avatar por defecto
          esUsuario: user.id === currentUser?.id,
        }));

        setJugadores(rankingData);
      } catch (error) {
        console.error("Error al cargar el ranking:", error);
      }
    };

    fetchRanking();
  }, []);

  useEffect(() => {
    let filtered = [...jugadores];

    if (searchTerm) {
      filtered = filtered.filter((j) =>
        j.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    filtered.sort((a, b) => b[sortBy] - a[sortBy]);

    setFilteredJugadores(filtered);
  }, [jugadores, searchTerm, sortBy]);

  const handleSort = (key: typeof sortBy) => {
    setSortBy(key);
  };

  const renderSortArrow = (key: typeof sortBy) => {
    return sortBy === key ? "⬇️" : "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
      <main className="w-full px-4 lg:px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaTrophy className="text-yellow-500" /> Ranking de Jugadores
            </h1>
            <p className="text-gray-600 mt-1">
              Clasificación actual de todos los participantes
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar jugador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-lg border border-gray-200 bg-white/70 hover:bg-white transition-colors"
            >
              <FaFilter
                className={showFilters ? "text-blue-600" : "text-gray-600"}
              />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-4 mb-6 border border-white/20">
            <div className="flex flex-wrap gap-3">
              {["puntos", "precision", "aciertos", "racha"].map((key) => (
                <button
                  key={key}
                  onClick={() => handleSort(key as typeof sortBy)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    sortBy === key
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                  {renderSortArrow(key as typeof sortBy)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jugador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Puntos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precisión
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aciertos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Racha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredJugadores.map((jugador, index) => (
                  <tr
                    key={jugador.id}
                    className={`${
                      jugador.esUsuario
                        ? "bg-blue-50 hover:bg-blue-100"
                        : "hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <td className="px-6 py-4">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                          index === 0
                            ? "bg-yellow-100 text-yellow-700"
                            : index === 1
                              ? "bg-gray-100 text-gray-700"
                              : index === 2
                                ? "bg-amber-100 text-amber-700"
                                : "bg-gray-50 text-gray-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <Image
                        src={jugador.avatar || "/placeholder.svg"}
                        alt={jugador.nombre}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                      <div>
                        <div
                          className={`text-sm font-medium ${
                            jugador.esUsuario
                              ? "text-blue-700"
                              : "text-gray-900"
                          }`}
                        >
                          {jugador.nombre}
                        </div>
                        {jugador.esUsuario && (
                          <div className="text-xs text-blue-500">Tú</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold">{jugador.puntos}</td>
                    <td className="px-6 py-4">{jugador.precision}%</td>
                    <td className="px-6 py-4">
                      {jugador.aciertos}/{jugador.total}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          jugador.racha > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {jugador.racha > 0
                          ? `${jugador.racha} aciertos seguidos`
                          : "Sin racha"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredJugadores.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No se encontraron jugadores con ese nombre
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
