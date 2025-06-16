"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FaListOl,
  FaFilter,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
  FaFutbol,
  FaClock,
  FaSearch,
} from "react-icons/fa";

export default function Resultados() {
  const userName = "Usuario";
  const [filtroCompeticion, setFiltroCompeticion] = useState("todas");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [jornadas, setJornadas] = useState({
    jornada1: true,
    jornada2: false,
    jornada3: false,
  });
  const [busqueda, setBusqueda] = useState("");

  // Función para alternar la visibilidad de una jornada
  const toggleJornada = (jornada) => {
    setJornadas({
      ...jornadas,
      [jornada]: !jornadas[jornada],
    });
  };

  // Datos de ejemplo para competiciones
  const competiciones = [
    { id: "todas", nombre: "Todas" },
    {
      id: "laliga",
      nombre: "LaLiga",
      logo: "/placeholder.svg?height=24&width=24",
    },
    {
      id: "premier",
      nombre: "Premier League",
      logo: "/placeholder.svg?height=24&width=24",
    },
    {
      id: "champions",
      nombre: "Champions League",
      logo: "/placeholder.svg?height=24&width=24",
    },
    {
      id: "seriea",
      nombre: "Serie A",
      logo: "/placeholder.svg?height=24&width=24",
    },
    {
      id: "bundesliga",
      nombre: "Bundesliga",
      logo: "/placeholder.svg?height=24&width=24",
    },
  ];

  // Datos de ejemplo para resultados
  const resultados = [
    {
      id: "r1",
      jornada: "jornada1",
      competicion: "LaLiga",
      competicionId: "laliga",
      fecha: "12 Jun 2025",
      hora: "16:00",
      estadio: "Camp Nou",
      local: {
        nombre: "Barcelona",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#004D98",
        goles: 3,
        goleadores: ["L. Messi (23', 67')", "F. De Jong (45')"],
      },
      visitante: {
        nombre: "Real Madrid",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#FFFFFF",
        goles: 1,
        goleadores: ["K. Benzema (78')"],
      },
      eventos: [
        { minuto: 23, tipo: "gol", equipo: "local", jugador: "L. Messi" },
        { minuto: 45, tipo: "gol", equipo: "local", jugador: "F. De Jong" },
        { minuto: 67, tipo: "gol", equipo: "local", jugador: "L. Messi" },
        { minuto: 78, tipo: "gol", equipo: "visitante", jugador: "K. Benzema" },
      ],
      estadisticas: {
        posesion: { local: 65, visitante: 35 },
        tiros: { local: 14, visitante: 8 },
        tirosAPuerta: { local: 7, visitante: 3 },
        corners: { local: 8, visitante: 2 },
        faltas: { local: 10, visitante: 14 },
      },
    },
    {
      id: "r2",
      jornada: "jornada1",
      competicion: "Premier League",
      competicionId: "premier",
      fecha: "11 Jun 2025",
      hora: "18:30",
      estadio: "Etihad Stadium",
      local: {
        nombre: "Man City",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#6CABDD",
        goles: 2,
        goleadores: ["E. Haaland (34')", "K. De Bruyne (56')"],
      },
      visitante: {
        nombre: "Liverpool",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#C8102E",
        goles: 2,
        goleadores: ["M. Salah (12')", "D. Núñez (89')"],
      },
      eventos: [
        { minuto: 12, tipo: "gol", equipo: "visitante", jugador: "M. Salah" },
        { minuto: 34, tipo: "gol", equipo: "local", jugador: "E. Haaland" },
        { minuto: 56, tipo: "gol", equipo: "local", jugador: "K. De Bruyne" },
        { minuto: 89, tipo: "gol", equipo: "visitante", jugador: "D. Núñez" },
      ],
      estadisticas: {
        posesion: { local: 58, visitante: 42 },
        tiros: { local: 15, visitante: 12 },
        tirosAPuerta: { local: 6, visitante: 5 },
        corners: { local: 7, visitante: 5 },
        faltas: { local: 8, visitante: 10 },
      },
    },
    {
      id: "r3",
      jornada: "jornada1",
      competicion: "Champions League",
      competicionId: "champions",
      fecha: "10 Jun 2025",
      hora: "20:45",
      estadio: "Allianz Arena",
      local: {
        nombre: "Bayern",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#DC052D",
        goles: 3,
        goleadores: ["H. Kane (15', 67')", "J. Musiala (42')"],
      },
      visitante: {
        nombre: "PSG",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#004170",
        goles: 0,
        goleadores: [],
      },
      eventos: [
        { minuto: 15, tipo: "gol", equipo: "local", jugador: "H. Kane" },
        { minuto: 42, tipo: "gol", equipo: "local", jugador: "J. Musiala" },
        { minuto: 67, tipo: "gol", equipo: "local", jugador: "H. Kane" },
      ],
      estadisticas: {
        posesion: { local: 62, visitante: 38 },
        tiros: { local: 18, visitante: 7 },
        tirosAPuerta: { local: 9, visitante: 2 },
        corners: { local: 9, visitante: 3 },
        faltas: { local: 7, visitante: 12 },
      },
    },
    {
      id: "r4",
      jornada: "jornada2",
      competicion: "Serie A",
      competicionId: "seriea",
      fecha: "9 Jun 2025",
      hora: "20:45",
      estadio: "San Siro",
      local: {
        nombre: "Milan",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#FB090B",
        goles: 1,
        goleadores: ["R. Leão (56')"],
      },
      visitante: {
        nombre: "Juventus",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#000000",
        goles: 1,
        goleadores: ["D. Vlahović (23')"],
      },
      eventos: [
        {
          minuto: 23,
          tipo: "gol",
          equipo: "visitante",
          jugador: "D. Vlahović",
        },
        { minuto: 56, tipo: "gol", equipo: "local", jugador: "R. Leão" },
      ],
      estadisticas: {
        posesion: { local: 55, visitante: 45 },
        tiros: { local: 14, visitante: 9 },
        tirosAPuerta: { local: 5, visitante: 3 },
        corners: { local: 6, visitante: 4 },
        faltas: { local: 12, visitante: 14 },
      },
    },
    {
      id: "r5",
      jornada: "jornada2",
      competicion: "Bundesliga",
      competicionId: "bundesliga",
      fecha: "8 Jun 2025",
      hora: "15:30",
      estadio: "Signal Iduna Park",
      local: {
        nombre: "Dortmund",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#FDE100",
        goles: 4,
        goleadores: [
          "M. Reus (12')",
          "J. Sancho (34', 56')",
          "E. Haaland (78')",
        ],
      },
      visitante: {
        nombre: "Leipzig",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#DD0741",
        goles: 1,
        goleadores: ["T. Werner (45')"],
      },
      eventos: [
        { minuto: 12, tipo: "gol", equipo: "local", jugador: "M. Reus" },
        { minuto: 34, tipo: "gol", equipo: "local", jugador: "J. Sancho" },
        { minuto: 45, tipo: "gol", equipo: "visitante", jugador: "T. Werner" },
        { minuto: 56, tipo: "gol", equipo: "local", jugador: "J. Sancho" },
        { minuto: 78, tipo: "gol", equipo: "local", jugador: "E. Haaland" },
      ],
      estadisticas: {
        posesion: { local: 60, visitante: 40 },
        tiros: { local: 19, visitante: 8 },
        tirosAPuerta: { local: 10, visitante: 3 },
        corners: { local: 8, visitante: 3 },
        faltas: { local: 9, visitante: 13 },
      },
    },
    {
      id: "r6",
      jornada: "jornada3",
      competicion: "LaLiga",
      competicionId: "laliga",
      fecha: "7 Jun 2025",
      hora: "21:00",
      estadio: "Metropolitano",
      local: {
        nombre: "Atlético",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#CB3524",
        goles: 2,
        goleadores: ["Á. Morata (34')", "A. Griezmann (67')"],
      },
      visitante: {
        nombre: "Sevilla",
        logo: "/placeholder.svg?height=40&width=40",
        color: "#CB3524",
        goles: 0,
        goleadores: [],
      },
      eventos: [
        { minuto: 34, tipo: "gol", equipo: "local", jugador: "Á. Morata" },
        { minuto: 67, tipo: "gol", equipo: "local", jugador: "A. Griezmann" },
      ],
      estadisticas: {
        posesion: { local: 52, visitante: 48 },
        tiros: { local: 12, visitante: 9 },
        tirosAPuerta: { local: 5, visitante: 2 },
        corners: { local: 6, visitante: 5 },
        faltas: { local: 14, visitante: 10 },
      },
    },
  ];

  // Filtrar resultados por competición y búsqueda
  const resultadosFiltrados = resultados.filter((resultado) => {
    const coincideCompeticion =
      filtroCompeticion === "todas" ||
      resultado.competicionId === filtroCompeticion;
    const coincideBusqueda =
      resultado.local.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      resultado.visitante.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      resultado.competicion.toLowerCase().includes(busqueda.toLowerCase());

    return coincideCompeticion && coincideBusqueda;
  });

  // Agrupar resultados por jornada
  const resultadosPorJornada = resultadosFiltrados.reduce((acc, resultado) => {
    if (!acc[resultado.jornada]) {
      acc[resultado.jornada] = [];
    }
    acc[resultado.jornada].push(resultado);
    return acc;
  }, {});

  // Función para renderizar la barra de progreso de posesión
  const renderPosesionBar = (local, visitante) => {
    return (
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500"
          style={{ width: `${local}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
      {/* Contenido principal */}
      <main className="w-full px-4 lg:px-6 py-6">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaListOl className="text-blue-500" /> Resultados
            </h1>
            <p className="text-gray-600 mt-1">
              Consulta los resultados de los partidos disputados
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar equipo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70"
              />
            </div>
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className={`p-2 rounded-lg border ${
                mostrarFiltros
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white/70"
              } hover:bg-white transition-colors`}
            >
              <FaFilter
                className={mostrarFiltros ? "text-blue-600" : "text-gray-600"}
              />
            </button>
          </div>
        </div>

        {/* Filtros */}
        {mostrarFiltros && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4 mb-6 border border-white/20">
            <h3 className="font-medium text-gray-700 mb-3">
              Filtrar por competición
            </h3>
            <div className="flex flex-wrap gap-2">
              {competiciones.map((competicion) => (
                <button
                  key={competicion.id}
                  onClick={() => setFiltroCompeticion(competicion.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                    filtroCompeticion === competicion.id
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent"
                  }`}
                >
                  {competicion.logo && (
                    <div className="relative w-5 h-5">
                      <Image
                        src={competicion.logo || "/placeholder.svg"}
                        alt={competicion.nombre}
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    </div>
                  )}
                  <span className="text-sm font-medium">
                    {competicion.nombre}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Resultados por jornada */}
        <div className="space-y-6">
          {Object.keys(resultadosPorJornada).length > 0 ? (
            Object.keys(resultadosPorJornada).map((jornada) => (
              <div
                key={jornada}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/20 overflow-hidden"
              >
                <div
                  className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleJornada(jornada)}
                >
                  <h3 className="font-medium text-gray-800">
                    {jornada === "jornada1"
                      ? "Jornada 1 - 10-12 de Junio"
                      : jornada === "jornada2"
                        ? "Jornada 2 - 8-9 de Junio"
                        : "Jornada 3 - 7 de Junio"}
                  </h3>
                  {jornadas[jornada] ? (
                    <FaChevronUp className="text-gray-500" />
                  ) : (
                    <FaChevronDown className="text-gray-500" />
                  )}
                </div>

                {jornadas[jornada] && (
                  <div className="divide-y divide-gray-100">
                    {resultadosPorJornada[jornada].map((resultado) => (
                      <div key={resultado.id} className="p-4">
                        {/* Encabezado del partido */}
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 rounded-full">
                              {resultado.competicion}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-gray-400 text-xs" />
                            <span className="text-xs text-gray-600">
                              {resultado.fecha}
                            </span>
                            <FaClock className="text-gray-400 text-xs" />
                            <span className="text-xs text-gray-600">
                              {resultado.hora}
                            </span>
                          </div>
                        </div>

                        {/* Resultado principal */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3 w-2/5">
                            <div className="relative w-12 h-12 flex-shrink-0">
                              <div
                                className="absolute inset-0 rounded-full"
                                style={{
                                  backgroundColor: resultado.local.color,
                                }}
                              ></div>
                              <Image
                                src={resultado.local.logo || "/placeholder.svg"}
                                alt={resultado.local.nombre}
                                width={48}
                                height={48}
                                className="object-contain"
                              />
                            </div>
                            <div>
                              <div className="font-medium">
                                {resultado.local.nombre}
                              </div>
                              <div className="text-xs text-gray-500">
                                {resultado.local.goleadores.map(
                                  (goleador, index) => (
                                    <div key={index}>{goleador}</div>
                                  ),
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-gray-800 text-white rounded-lg">
                                {resultado.local.goles}
                              </div>
                              <span className="text-gray-400">-</span>
                              <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-gray-800 text-white rounded-lg">
                                {resultado.visitante.goles}
                              </div>
                            </div>
                            <span className="text-xs text-gray-500 mt-1">
                              Final
                            </span>
                          </div>

                          <div className="flex items-center gap-3 w-2/5 justify-end">
                            <div className="text-right">
                              <div className="font-medium">
                                {resultado.visitante.nombre}
                              </div>
                              <div className="text-xs text-gray-500">
                                {resultado.visitante.goleadores.map(
                                  (goleador, index) => (
                                    <div key={index}>{goleador}</div>
                                  ),
                                )}
                              </div>
                            </div>
                            <div className="relative w-12 h-12 flex-shrink-0">
                              <div
                                className="absolute inset-0 rounded-full"
                                style={{
                                  backgroundColor: resultado.visitante.color,
                                }}
                              ></div>
                              <Image
                                src={
                                  resultado.visitante.logo || "/placeholder.svg"
                                }
                                alt={resultado.visitante.nombre}
                                width={48}
                                height={48}
                                className="object-contain"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Estadísticas */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Estadísticas
                          </h4>
                          <div className="space-y-3">
                            {/* Posesión */}
                            <div className="flex items-center text-sm">
                              <div className="w-1/6 text-right pr-2">
                                {resultado.estadisticas.posesion.local}%
                              </div>
                              <div className="w-4/6">
                                {renderPosesionBar(
                                  resultado.estadisticas.posesion.local,
                                  resultado.estadisticas.posesion.visitante,
                                )}
                              </div>
                              <div className="w-1/6 text-left pl-2">
                                {resultado.estadisticas.posesion.visitante}%
                              </div>
                            </div>

                            {/* Otras estadísticas */}
                            <div className="grid grid-cols-3 gap-2 text-sm">
                              <div className="flex justify-between">
                                <span className="font-medium">
                                  {resultado.estadisticas.tiros.local}
                                </span>
                                <span className="text-gray-500">Tiros</span>
                                <span className="font-medium">
                                  {resultado.estadisticas.tiros.visitante}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">
                                  {resultado.estadisticas.tirosAPuerta.local}
                                </span>
                                <span className="text-gray-500">A puerta</span>
                                <span className="font-medium">
                                  {
                                    resultado.estadisticas.tirosAPuerta
                                      .visitante
                                  }
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">
                                  {resultado.estadisticas.corners.local}
                                </span>
                                <span className="text-gray-500">Corners</span>
                                <span className="font-medium">
                                  {resultado.estadisticas.corners.visitante}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Estadio */}
                        <div className="mt-3 text-center">
                          <span className="text-xs text-gray-500">
                            {resultado.estadio}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-8 text-center border border-white/20">
              <FaFutbol className="text-gray-400 text-4xl mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">
                No se encontraron resultados
              </h3>
              <p className="text-gray-500">
                No hay resultados que coincidan con los filtros seleccionados.
                Intenta con otros criterios de búsqueda.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
