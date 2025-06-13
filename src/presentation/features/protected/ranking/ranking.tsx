"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaSignOutAlt,
  FaBell,
  FaSearch,
  FaTrophy,
  FaChevronUp,
  FaChevronDown,
  FaFilter,
} from "react-icons/fa";

export default function Ranking() {
  const userName = "Usuario";
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("puntos");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const jugadores = [
    {
      id: 1,
      nombre: "Carlos Rodríguez",
      puntos: 156,
      aciertos: 18,
      total: 22,
      precision: 82,
      racha: 5,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      nombre: "María López",
      puntos: 142,
      aciertos: 16,
      total: 22,
      precision: 73,
      racha: 3,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      nombre: "Juan Pérez",
      puntos: 138,
      aciertos: 15,
      total: 21,
      precision: 71,
      racha: 0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      nombre: "Ana Sánchez",
      puntos: 135,
      aciertos: 15,
      total: 22,
      precision: 68,
      racha: 2,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      nombre: "Roberto Gómez",
      puntos: 132,
      aciertos: 14,
      total: 20,
      precision: 70,
      racha: 0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 6,
      nombre: "Laura Martínez",
      puntos: 130,
      aciertos: 14,
      total: 22,
      precision: 64,
      racha: 1,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 7,
      nombre: "Miguel Fernández",
      puntos: 128,
      aciertos: 14,
      total: 21,
      precision: 67,
      racha: 0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 8,
      nombre: "Usuario",
      puntos: 125,
      aciertos: 12,
      total: 20,
      precision: 60,
      racha: 2,
      avatar: "/placeholder.svg?height=40&width=40",
      esUsuario: true,
    },
    {
      id: 9,
      nombre: "Patricia Díaz",
      puntos: 120,
      aciertos: 13,
      total: 22,
      precision: 59,
      racha: 0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 10,
      nombre: "Fernando Torres",
      puntos: 118,
      aciertos: 12,
      total: 21,
      precision: 57,
      racha: 1,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 11,
      nombre: "Lucía Gutiérrez",
      puntos: 115,
      aciertos: 12,
      total: 22,
      precision: 55,
      racha: 0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 12,
      nombre: "Javier Ruiz",
      puntos: 110,
      aciertos: 11,
      total: 20,
      precision: 55,
      racha: 0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ];

  // Filtrar y ordenar jugadores
  const filteredJugadores = jugadores
    .filter((jugador) =>
      jugador.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;

      switch (sortBy) {
        case "puntos":
          return (a.puntos - b.puntos) * direction;
        case "precision":
          return (a.precision - b.precision) * direction;
        case "aciertos":
          return (a.aciertos - b.aciertos) * direction;
        case "racha":
          return (a.racha - b.racha) * direction;
        default:
          return 0;
      }
    });

  // Función para cambiar el orden
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("desc");
    }
  };

  // Renderizar flecha de ordenación
  const renderSortArrow = (column) => {
    if (sortBy !== column) return null;
    return sortDirection === "asc" ? (
      <FaChevronUp className="ml-1 inline" />
    ) : (
      <FaChevronDown className="ml-1 inline" />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10 flex items-center justify-between px-4 lg:px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/logo-mundial.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Quinela Mundial de Clubes
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

      {/* Contenido principal */}
      <main className="w-full px-4 lg:px-6 py-6">
        {/* Encabezado */}
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

        {/* Filtros adicionales (opcional) */}
        {showFilters && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-4 mb-6 border border-white/20">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleSort("puntos")}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  sortBy === "puntos"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Puntos {renderSortArrow("puntos")}
              </button>
              <button
                onClick={() => handleSort("precision")}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  sortBy === "precision"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Precisión {renderSortArrow("precision")}
              </button>
              <button
                onClick={() => handleSort("aciertos")}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  sortBy === "aciertos"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Aciertos {renderSortArrow("aciertos")}
              </button>
              <button
                onClick={() => handleSort("racha")}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  sortBy === "racha"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Racha {renderSortArrow("racha")}
              </button>
            </div>
          </div>
        )}

        {/* Tabla de ranking */}
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
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("puntos")}
                  >
                    <div className="flex items-center">
                      Puntos {renderSortArrow("puntos")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("precision")}
                  >
                    <div className="flex items-center">
                      Precisión {renderSortArrow("precision")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("aciertos")}
                  >
                    <div className="flex items-center">
                      Aciertos {renderSortArrow("aciertos")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("racha")}
                  >
                    <div className="flex items-center">
                      Racha {renderSortArrow("racha")}
                    </div>
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
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          <div
                            className={`absolute inset-0 rounded-full ${jugador.esUsuario ? "bg-blue-100" : "bg-gray-100"}`}
                          ></div>
                          <Image
                            src={jugador.avatar || "/placeholder.svg"}
                            alt={jugador.nombre}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div
                            className={`text-sm font-medium ${jugador.esUsuario ? "text-blue-700" : "text-gray-900"}`}
                          >
                            {jugador.nombre}
                          </div>
                          {jugador.esUsuario && (
                            <div className="text-xs text-blue-500">Tú</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {jugador.puntos}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${jugador.precision}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">
                          {jugador.precision}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {jugador.aciertos}/{jugador.total}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          jugador.racha > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {jugador.racha > 0
                          ? `${jugador.racha} aciertos seguidos`
                          : "Sin racha"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Si no hay resultados */}
          {filteredJugadores.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">
                No se encontraron jugadores con ese nombre
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
