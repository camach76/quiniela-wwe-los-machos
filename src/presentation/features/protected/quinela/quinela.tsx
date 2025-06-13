"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaSignOutAlt,
  FaBell,
  FaFutbol,
  FaCheck,
  FaCalendarAlt,
  FaHistory,
  FaChevronDown,
  FaChevronUp,
  FaSave,
  FaLock,
} from "react-icons/fa";

export default function MiQuinela() {
  const userName = "Usuario";
  const [tabActiva, setTabActiva] = useState("pendientes");
  const [jornadas, setJornadas] = useState({
    jornada1: true,
    jornada2: false,
    jornada3: false,
  });

  const toggleJornada = (jornada) => {
    setJornadas({
      ...jornadas,
      [jornada]: !jornadas[jornada],
    });
  };

  const partidosPendientes = [
    {
      id: "j1-1",
      jornada: "jornada1",
      competicion: "LaLiga",
      fecha: "15 Jun",
      hora: "16:00",
      estadio: "Camp Nou",
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
      estado: "pendiente",
      limite: "Hoy, 15:00",
    },
    {
      id: "j1-2",
      jornada: "jornada1",
      competicion: "Premier League",
      fecha: "15 Jun",
      hora: "18:30",
      estadio: "Etihad Stadium",
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
      estado: "pendiente",
      limite: "Hoy, 17:30",
    },
    {
      id: "j1-3",
      jornada: "jornada1",
      competicion: "Serie A",
      fecha: "15 Jun",
      hora: "20:45",
      estadio: "San Siro",
      local: {
        nombre: "Milan",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#FB090B",
      },
      visitante: {
        nombre: "Juventus",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#000000",
      },
      estado: "pendiente",
      limite: "Hoy, 19:45",
    },
    {
      id: "j2-1",
      jornada: "jornada2",
      competicion: "Bundesliga",
      fecha: "18 Jun",
      hora: "15:30",
      estadio: "Allianz Arena",
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
      estado: "pendiente",
      limite: "18 Jun, 14:30",
    },
    {
      id: "j2-2",
      jornada: "jornada2",
      competicion: "Ligue 1",
      fecha: "18 Jun",
      hora: "21:00",
      estadio: "Parc des Princes",
      local: {
        nombre: "PSG",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#004170",
      },
      visitante: {
        nombre: "Marseille",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#2B63AD",
      },
      estado: "pendiente",
      limite: "18 Jun, 20:00",
    },
    {
      id: "j3-1",
      jornada: "jornada3",
      competicion: "LaLiga",
      fecha: "22 Jun",
      hora: "18:00",
      estadio: "Metropolitano",
      local: {
        nombre: "Atlético",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#CB3524",
      },
      visitante: {
        nombre: "Sevilla",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#CB3524",
      },
      estado: "pendiente",
      limite: "22 Jun, 17:00",
    },
  ];

  // Datos de ejemplo para partidos pronosticados
  const partidosPronosticados = [
    {
      id: "p1",
      competicion: "Champions League",
      fecha: "10 Jun",
      hora: "20:45",
      estadio: "Wembley",
      local: {
        nombre: "Arsenal",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#EF0107",
        goles: null,
      },
      visitante: {
        nombre: "Inter",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#0057B8",
        goles: null,
      },
      pronostico: {
        local: 2,
        visitante: 1,
      },
      estado: "pronosticado",
      limite: "Cerrado",
    },
    {
      id: "p2",
      competicion: "Europa League",
      fecha: "9 Jun",
      hora: "18:30",
      estadio: "Olímpico de Roma",
      local: {
        nombre: "Roma",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#A31C2F",
        goles: null,
      },
      visitante: {
        nombre: "Leverkusen",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#E32221",
        goles: null,
      },
      pronostico: {
        local: 1,
        visitante: 2,
      },
      estado: "pronosticado",
      limite: "Cerrado",
    },
  ];

  // Datos de ejemplo para partidos completados
  const partidosCompletados = [
    {
      id: "c1",
      competicion: "LaLiga",
      fecha: "5 Jun",
      local: {
        nombre: "Valencia",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#F49E00",
        goles: 2,
      },
      visitante: {
        nombre: "Betis",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#00954C",
        goles: 1,
      },
      pronostico: {
        local: 2,
        visitante: 0,
      },
      puntos: 5,
      estado: "completado",
    },
    {
      id: "c2",
      competicion: "Premier League",
      fecha: "4 Jun",
      local: {
        nombre: "Chelsea",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#034694",
        goles: 1,
      },
      visitante: {
        nombre: "Tottenham",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#132257",
        goles: 1,
      },
      pronostico: {
        local: 2,
        visitante: 1,
      },
      puntos: 3,
      estado: "completado",
    },
    {
      id: "c3",
      competicion: "Serie A",
      fecha: "3 Jun",
      local: {
        nombre: "Napoli",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#12A0D7",
        goles: 3,
      },
      visitante: {
        nombre: "Roma",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#A31C2F",
        goles: 1,
      },
      pronostico: {
        local: 1,
        visitante: 1,
      },
      puntos: 0,
      estado: "completado",
    },
  ];

  // Estado para los pronósticos
  const [pronosticos, setPronosticos] = useState({});
  const actualizarPronostico = (partidoId, equipo, valor) => {
    const valorNumerico = valor === "" ? "" : Number.parseInt(valor);

    setPronosticos({
      ...pronosticos,
      [partidoId]: {
        ...pronosticos[partidoId],
        [equipo]: valorNumerico,
      },
    });
  };

  // Función para guardar todos los pronósticos
  const guardarPronosticos = () => {
    console.log("Pronósticos guardados:", pronosticos);
    // Aquí iría la lógica para enviar los pronósticos al servidor
    alert("¡Pronósticos guardados con éxito!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10 flex items-center justify-between px-4 lg:px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/images/logo.png"
                alt="Logo"
                fill
                className="object-contain rounded-full"
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
              <FaFutbol className="text-blue-500" /> Mi Quinela
            </h1>
            <p className="text-gray-600 mt-1">
              Gestiona tus pronósticos para los próximos partidos
            </p>
          </div>

          {tabActiva === "pendientes" && (
            <button
              onClick={guardarPronosticos}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FaSave />
              <span>Guardar Pronósticos</span>
            </button>
          )}
        </div>

        {/* Tabs de navegación */}
        <div className="mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setTabActiva("pendientes")}
              className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
                tabActiva === "pendientes"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FaCalendarAlt />
                <span>Partidos Pendientes</span>
              </div>
            </button>
            <button
              onClick={() => setTabActiva("pronosticados")}
              className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
                tabActiva === "pronosticados"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FaCheck />
                <span>Pronosticados</span>
              </div>
            </button>
            <button
              onClick={() => setTabActiva("completados")}
              className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
                tabActiva === "completados"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FaHistory />
                <span>Completados</span>
              </div>
            </button>
          </div>
        </div>

        {/* Contenido de los tabs */}
        <div>
          {/* Partidos Pendientes */}
          {tabActiva === "pendientes" && (
            <div className="space-y-6">
              {/* Jornada 1 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/20 overflow-hidden">
                <div
                  className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleJornada("jornada1")}
                >
                  <h3 className="font-medium text-gray-800">
                    Jornada 1 - 15 de Junio
                  </h3>
                  {jornadas.jornada1 ? (
                    <FaChevronUp className="text-gray-500" />
                  ) : (
                    <FaChevronDown className="text-gray-500" />
                  )}
                </div>

                {jornadas.jornada1 && (
                  <div className="divide-y divide-gray-100">
                    {partidosPendientes
                      .filter((partido) => partido.jornada === "jornada1")
                      .map((partido) => (
                        <div key={partido.id} className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-medium text-gray-500">
                              {partido.competicion}
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-medium text-gray-500">
                                {partido.fecha} • {partido.hora}
                              </span>
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                Límite: {partido.limite}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 w-2/5">
                              <div className="relative w-10 h-10 flex-shrink-0">
                                <div
                                  className="absolute inset-0 rounded-full"
                                  style={{
                                    backgroundColor: partido.local.color,
                                  }}
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

                            <div className="flex items-center gap-2 w-1/5 justify-center">
                              <input
                                type="number"
                                min="0"
                                max="99"
                                className="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-lg"
                                value={pronosticos[partido.id]?.local || ""}
                                onChange={(e) =>
                                  actualizarPronostico(
                                    partido.id,
                                    "local",
                                    e.target.value,
                                  )
                                }
                              />
                              <span className="text-gray-400">-</span>
                              <input
                                type="number"
                                min="0"
                                max="99"
                                className="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-lg"
                                value={pronosticos[partido.id]?.visitante || ""}
                                onChange={(e) =>
                                  actualizarPronostico(
                                    partido.id,
                                    "visitante",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>

                            <div className="flex items-center gap-3 w-2/5 justify-end">
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

                          <div className="mt-2 text-xs text-gray-500 text-center">
                            {partido.estadio}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Jornada 2 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/20 overflow-hidden">
                <div
                  className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleJornada("jornada2")}
                >
                  <h3 className="font-medium text-gray-800">
                    Jornada 2 - 18 de Junio
                  </h3>
                  {jornadas.jornada2 ? (
                    <FaChevronUp className="text-gray-500" />
                  ) : (
                    <FaChevronDown className="text-gray-500" />
                  )}
                </div>

                {jornadas.jornada2 && (
                  <div className="divide-y divide-gray-100">
                    {partidosPendientes
                      .filter((partido) => partido.jornada === "jornada2")
                      .map((partido) => (
                        <div key={partido.id} className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-medium text-gray-500">
                              {partido.competicion}
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-medium text-gray-500">
                                {partido.fecha} • {partido.hora}
                              </span>
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                Límite: {partido.limite}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 w-2/5">
                              <div className="relative w-10 h-10 flex-shrink-0">
                                <div
                                  className="absolute inset-0 rounded-full"
                                  style={{
                                    backgroundColor: partido.local.color,
                                  }}
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

                            <div className="flex items-center gap-2 w-1/5 justify-center">
                              <input
                                type="number"
                                min="0"
                                max="99"
                                className="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-lg"
                                value={pronosticos[partido.id]?.local || ""}
                                onChange={(e) =>
                                  actualizarPronostico(
                                    partido.id,
                                    "local",
                                    e.target.value,
                                  )
                                }
                              />
                              <span className="text-gray-400">-</span>
                              <input
                                type="number"
                                min="0"
                                max="99"
                                className="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-lg"
                                value={pronosticos[partido.id]?.visitante || ""}
                                onChange={(e) =>
                                  actualizarPronostico(
                                    partido.id,
                                    "visitante",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>

                            <div className="flex items-center gap-3 w-2/5 justify-end">
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

                          <div className="mt-2 text-xs text-gray-500 text-center">
                            {partido.estadio}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Jornada 3 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/20 overflow-hidden">
                <div
                  className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleJornada("jornada3")}
                >
                  <h3 className="font-medium text-gray-800">
                    Jornada 3 - 22 de Junio
                  </h3>
                  {jornadas.jornada3 ? (
                    <FaChevronUp className="text-gray-500" />
                  ) : (
                    <FaChevronDown className="text-gray-500" />
                  )}
                </div>

                {jornadas.jornada3 && (
                  <div className="divide-y divide-gray-100">
                    {partidosPendientes
                      .filter((partido) => partido.jornada === "jornada3")
                      .map((partido) => (
                        <div key={partido.id} className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-medium text-gray-500">
                              {partido.competicion}
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-medium text-gray-500">
                                {partido.fecha} • {partido.hora}
                              </span>
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                Límite: {partido.limite}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 w-2/5">
                              <div className="relative w-10 h-10 flex-shrink-0">
                                <div
                                  className="absolute inset-0 rounded-full"
                                  style={{
                                    backgroundColor: partido.local.color,
                                  }}
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

                            <div className="flex items-center gap-2 w-1/5 justify-center">
                              <input
                                type="number"
                                min="0"
                                max="99"
                                className="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-lg"
                                value={pronosticos[partido.id]?.local || ""}
                                onChange={(e) =>
                                  actualizarPronostico(
                                    partido.id,
                                    "local",
                                    e.target.value,
                                  )
                                }
                              />
                              <span className="text-gray-400">-</span>
                              <input
                                type="number"
                                min="0"
                                max="99"
                                className="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-lg"
                                value={pronosticos[partido.id]?.visitante || ""}
                                onChange={(e) =>
                                  actualizarPronostico(
                                    partido.id,
                                    "visitante",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>

                            <div className="flex items-center gap-3 w-2/5 justify-end">
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

                          <div className="mt-2 text-xs text-gray-500 text-center">
                            {partido.estadio}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Partidos Pronosticados */}
          {tabActiva === "pronosticados" && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/20 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {partidosPronosticados.map((partido) => (
                  <div key={partido.id} className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-gray-500">
                        {partido.competicion}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium text-gray-500">
                          {partido.fecha} • {partido.hora}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <FaLock className="text-xs" /> {partido.limite}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 w-2/5">
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

                      <div className="flex items-center gap-2 w-1/5 justify-center">
                        <div className="w-12 h-12 flex items-center justify-center text-lg font-bold bg-gray-100 rounded-lg">
                          {partido.pronostico.local}
                        </div>
                        <span className="text-gray-400">-</span>
                        <div className="w-12 h-12 flex items-center justify-center text-lg font-bold bg-gray-100 rounded-lg">
                          {partido.pronostico.visitante}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-2/5 justify-end">
                        <span className="font-medium">
                          {partido.visitante.nombre}
                        </span>
                        <div className="relative w-10 h-10 flex-shrink-0">
                          <div
                            className="absolute inset-0 rounded-full"
                            style={{ backgroundColor: partido.visitante.color }}
                          ></div>
                          <Image
                            src={partido.visitante.logo || "/placeholder.svg"}
                            alt={partido.visitante.nombre}
                            width={40}
                            height={40}
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-gray-500 text-center">
                      {partido.estadio}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Partidos Completados */}
          {tabActiva === "completados" && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/20 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {partidosCompletados.map((partido) => (
                  <div key={partido.id} className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-gray-500">
                        {partido.competicion}
                      </span>
                      <span className="text-xs font-medium text-gray-500">
                        {partido.fecha}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 w-2/5">
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

                      <div className="flex flex-col items-center gap-2 w-1/5">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 flex items-center justify-center text-lg font-bold bg-gray-800 text-white rounded-lg">
                            {partido.local.goles}
                          </div>
                          <span className="text-gray-400">-</span>
                          <div className="w-10 h-10 flex items-center justify-center text-lg font-bold bg-gray-800 text-white rounded-lg">
                            {partido.visitante.goles}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <span>Tu pronóstico:</span>
                          <span className="font-medium">
                            {partido.pronostico.local} -{" "}
                            {partido.pronostico.visitante}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-2/5 justify-end">
                        <div>
                          <span className="font-medium">
                            {partido.visitante.nombre}
                          </span>
                        </div>
                        <div className="relative w-10 h-10 flex-shrink-0">
                          <div
                            className="absolute inset-0 rounded-full"
                            style={{ backgroundColor: partido.visitante.color }}
                          ></div>
                          <Image
                            src={partido.visitante.logo || "/placeholder.svg"}
                            alt={partido.visitante.nombre}
                            width={40}
                            height={40}
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 flex justify-center">
                      <div
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          partido.puntos > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {partido.puntos > 0
                          ? `+${partido.puntos} puntos`
                          : "0 puntos"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
