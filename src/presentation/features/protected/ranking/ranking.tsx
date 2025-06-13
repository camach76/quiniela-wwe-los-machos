"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaBell,
  FaFilter,
  FaSearch,
  FaSignOutAlt,
  FaTrophy,
} from "react-icons/fa";

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
        const res = await fetch("/api/ranking", {
          credentials: "include",
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Error en /api/ranking:", res.status, errorText);
          return;
        }

        const data: RankingJugador[] = await res.json();
        setJugadores(data);
      } catch (error) {
        console.error("Error de red en /api/ranking:", error);
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
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10 flex items-center justify-between px-4 lg:px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/images/logo.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Quinela Los Machos
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors relative">
            <FaBell className="text-gray-600" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
              {userName.charAt(0)}
            </div>
            <span className="text-gray-700 font-medium">Hola, {userName}</span>
          </div>
          <button className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium transition-colors">
            <FaSignOutAlt />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </nav>

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
