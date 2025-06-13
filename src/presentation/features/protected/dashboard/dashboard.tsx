"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  FaFutbol,
  FaTable,
  FaUser,
  FaSignOutAlt,
  FaListOl,
  FaBell,
  FaTrophy,
  FaCalendarAlt,
} from "react-icons/fa";

export default function Dashboard() {
  const userName = "Usuario";
  const [activeTab, setActiveTab] = useState("proximos");

  // Datos de ejemplo para partidos próximos
  const proximosPartidos = [
    {
      id: 1,
      local: {
        nombre: "Barcelona",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#004D98",
      },
      visitante: {
        nombre: "Real Madrid",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#FFFFFF",
      },
      fecha: "15 Jun",
      hora: "16:00",
      competicion: "LaLiga",
      estadio: "Camp Nou",
    },
    {
      id: 2,
      local: {
        nombre: "Man City",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#6CABDD",
      },
      visitante: {
        nombre: "Liverpool",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#C8102E",
      },
      fecha: "18 Jun",
      hora: "15:30",
      competicion: "Premier League",
      estadio: "Etihad Stadium",
    },
    {
      id: 3,
      local: {
        nombre: "Bayern",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#DC052D",
      },
      visitante: {
        nombre: "Dortmund",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#FDE100",
      },
      fecha: "20 Jun",
      hora: "18:45",
      competicion: "Bundesliga",
      estadio: "Allianz Arena",
    },
  ];

  // Datos de ejemplo para partidos recientes
  const partidosRecientes = [
    {
      id: 4,
      local: {
        nombre: "PSG",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#004170",
        goles: 2,
      },
      visitante: {
        nombre: "Marseille",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#2B63AD",
        goles: 1,
      },
      fecha: "10 Jun",
      competicion: "Ligue 1",
      tuPronostico: { local: 2, visitante: 0 },
      puntos: 5,
    },
    {
      id: 5,
      local: {
        nombre: "Juventus",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#000000",
        goles: 3,
      },
      visitante: {
        nombre: "Milan",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#FB090B",
        goles: 0,
      },
      fecha: "8 Jun",
      competicion: "Serie A",
      tuPronostico: { local: 2, visitante: 0 },
      puntos: 5,
    },
    {
      id: 6,
      local: {
        nombre: "Ajax",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#C8102E",
        goles: 1,
      },
      visitante: {
        nombre: "PSV",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#FF0000",
        goles: 1,
      },
      fecha: "5 Jun",
      competicion: "Eredivisie",
      tuPronostico: { local: 2, visitante: 1 },
      puntos: 0,
    },
  ];

  // Datos de ejemplo para estadísticas
  const estadisticas = {
    puntosTotales: 125,
    posicionRanking: 8,
    pronosticosAcertados: 12,
    partidosPronosticados: 20,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10 flex items-center justify-between px-4 lg:px-6 py-4">
        <div className="flex items-center gap-3">
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
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Columna izquierda - Estadísticas y accesos rápidos */}
          <div className="w-full lg:w-1/4 space-y-6">
            {/* Tarjeta de estadísticas */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-5 border border-white/20">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaTrophy className="text-yellow-500" /> Tus Estadísticas
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {estadisticas.puntosTotales}
                  </p>
                  <p className="text-xs text-gray-600">Puntos totales</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    #{estadisticas.posicionRanking}
                  </p>
                  <p className="text-xs text-gray-600">Posición</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {estadisticas.pronosticosAcertados}
                  </p>
                  <p className="text-xs text-gray-600">Aciertos</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-amber-600">
                    {Math.round(
                      (estadisticas.pronosticosAcertados /
                        estadisticas.partidosPronosticados) *
                        100,
                    )}
                    %
                  </p>
                  <p className="text-xs text-gray-600">Precisión</p>
                </div>
              </div>
            </div>

            {/* Accesos rápidos */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/quinela"
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-lg transition-all border-t-4 border-blue-600"
              >
                <FaFutbol className="text-2xl text-blue-600 mb-2" />
                <span className="font-medium text-sm text-center">
                  Mi Quinela
                </span>
              </Link>
              <Link
                href="/tabla"
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-lg transition-all border-t-4 border-green-600"
              >
                <FaTable className="text-2xl text-green-600 mb-2" />
                <span className="font-medium text-sm text-center">Tabla</span>
              </Link>
              <Link
                href="/resultados"
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-lg transition-all border-t-4 border-yellow-500"
              >
                <FaListOl className="text-2xl text-yellow-500 mb-2" />
                <span className="font-medium text-sm text-center">
                  Resultados
                </span>
              </Link>
              <Link
                href="/perfil"
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-lg transition-all border-t-4 border-purple-600"
              >
                <FaUser className="text-2xl text-purple-600 mb-2" />
                <span className="font-medium text-sm text-center">Perfil</span>
              </Link>
            </div>
          </div>

          {/* Columna central - Partidos */}
          <div className="w-full lg:w-2/4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/20">
              {/* Tabs de navegación */}
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab("proximos")}
                  className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
                    activeTab === "proximos"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FaCalendarAlt />
                    <span>Próximos Partidos</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("recientes")}
                  className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
                    activeTab === "recientes"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FaListOl />
                    <span>Resultados Recientes</span>
                  </div>
                </button>
              </div>

              {/* Contenido de los tabs */}
              <div className="p-4">
                {activeTab === "proximos" && (
                  <div className="space-y-4">
                    {proximosPartidos.map((partido) => (
                      <div
                        key={partido.id}
                        className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-500">
                            {partido.competicion}
                          </span>
                          <span className="text-xs font-medium text-gray-500">
                            {partido.fecha} • {partido.hora}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 flex-shrink-0">
                              <div
                                className="absolute inset-0 rounded-full"
                                style={{ backgroundColor: partido.local.color }}
                              ></div>
                              <Image
                                src={partido.local.logo || "/placeholder.svg"}
                                alt={partido.local.nombre}
                                width={40}
                                height={40}
                                className="object-contain"
                              />
                            </div>
                            <span className="font-medium">
                              {partido.local.nombre}
                            </span>
                          </div>
                          <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded">
                            VS
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="font-medium">
                              {partido.visitante.nombre}
                            </span>
                            <div className="relative w-10 h-10 flex-shrink-0">
                              <div
                                className="absolute inset-0 rounded-full"
                                style={{
                                  backgroundColor: partido.visitante.color,
                                }}
                              ></div>
                              <Image
                                src={
                                  partido.visitante.logo || "/placeholder.svg"
                                }
                                alt={partido.visitante.nombre}
                                width={40}
                                height={40}
                                className="object-contain"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {partido.estadio}
                          </span>
                          <Link
                            href={`/pronostico/${partido.id}`}
                            className="text-sm bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
                          >
                            Pronosticar
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "recientes" && (
                  <div className="space-y-4">
                    {partidosRecientes.map((partido) => (
                      <div
                        key={partido.id}
                        className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-500">
                            {partido.competicion}
                          </span>
                          <span className="text-xs font-medium text-gray-500">
                            {partido.fecha}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 flex-shrink-0">
                              <div
                                className="absolute inset-0 rounded-full"
                                style={{ backgroundColor: partido.local.color }}
                              ></div>
                              <Image
                                src={partido.local.logo || "/placeholder.svg"}
                                alt={partido.local.nombre}
                                width={40}
                                height={40}
                                className="object-contain"
                              />
                            </div>
                            <div>
                              <span className="font-medium">
                                {partido.local.nombre}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold">
                              {partido.local.goles}
                            </span>
                            <span className="text-xs">-</span>
                            <span className="text-lg font-bold">
                              {partido.visitante.goles}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div>
                              <span className="font-medium">
                                {partido.visitante.nombre}
                              </span>
                            </div>
                            <div className="relative w-10 h-10 flex-shrink-0">
                              <div
                                className="absolute inset-0 rounded-full"
                                style={{
                                  backgroundColor: partido.visitante.color,
                                }}
                              ></div>
                              <Image
                                src={
                                  partido.visitante.logo || "/placeholder.svg"
                                }
                                alt={partido.visitante.nombre}
                                width={40}
                                height={40}
                                className="object-contain"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              Tu pronóstico:
                            </span>
                            <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded">
                              {partido.tuPronostico.local} -{" "}
                              {partido.tuPronostico.visitante}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">
                              Puntos:
                            </span>
                            <span
                              className={`text-xs font-bold px-2 py-1 rounded ${
                                partido.puntos > 0
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {partido.puntos}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/4 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-5 border border-white/20">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaListOl className="text-green-500" /> Top Jugadores
              </h2>
              <div className="space-y-3">
                {[
                  { nombre: "Carlos R.", puntos: 156, posicion: 1 },
                  { nombre: "María L.", puntos: 142, posicion: 2 },
                  { nombre: "Juan P.", puntos: 138, posicion: 3 },
                  { nombre: "Ana S.", puntos: 135, posicion: 4 },
                  {
                    nombre: "Usuario",
                    puntos: 125,
                    posicion: 8,
                    esUsuario: true,
                  },
                ].map((jugador) => (
                  <div
                    key={jugador.posicion}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      jugador.esUsuario
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                          jugador.posicion === 1
                            ? "bg-yellow-100 text-yellow-700"
                            : jugador.posicion === 2
                              ? "bg-gray-100 text-gray-700"
                              : jugador.posicion === 3
                                ? "bg-amber-100 text-amber-700"
                                : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {jugador.posicion}
                      </span>
                      <span
                        className={`font-medium ${jugador.esUsuario ? "text-blue-700" : ""}`}
                      >
                        {jugador.nombre}
                      </span>
                    </div>
                    <span className="font-bold text-gray-700">
                      {jugador.puntos}
                    </span>
                  </div>
                ))}
                <Link
                  href="/ranking"
                  className="block text-center text-sm text-blue-600 hover:text-blue-800 mt-2 py-1"
                >
                  Ver ranking completo
                </Link>
              </div>
            </div>

            {/* Noticias o Anuncios */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-5 border border-white/20">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaBell className="text-red-500" /> Anuncios
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-3 py-1">
                  <p className="text-sm font-medium text-gray-800">
                    Nuevo torneo disponible
                  </p>
                  <p className="text-xs text-gray-500">
                    Copa América 2025 - ¡Inscríbete ahora!
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-3 py-1">
                  <p className="text-sm font-medium text-gray-800">
                    Actualización de reglas
                  </p>
                  <p className="text-xs text-gray-500">
                    Nuevos criterios de puntuación para pronósticos
                  </p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-3 py-1">
                  <p className="text-sm font-medium text-gray-800">
                    Premios del mes
                  </p>
                  <p className="text-xs text-gray-500">
                    Los ganadores serán anunciados el 30 de junio
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
