"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaSignOutAlt,
  FaBell,
  FaTable,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function TablaPosiciones() {
  const userName = "Usuario";
  const [competicionActiva, setCompeticionActiva] = useState("laliga");
  const competiciones = [
    {
      id: "laliga",
      nombre: "LaLiga",
      pais: "España",
      logo: "/placeholder.svg?height=30&width=30",
    },
    {
      id: "premier",
      nombre: "Premier League",
      pais: "Inglaterra",
      logo: "/placeholder.svg?height=30&width=30",
    },
    {
      id: "seriea",
      nombre: "Serie A",
      pais: "Italia",
      logo: "/placeholder.svg?height=30&width=30",
    },
    {
      id: "bundesliga",
      nombre: "Bundesliga",
      pais: "Alemania",
      logo: "/placeholder.svg?height=30&width=30",
    },
    {
      id: "ligue1",
      nombre: "Ligue 1",
      pais: "Francia",
      logo: "/placeholder.svg?height=30&width=30",
    },
  ];
  const tablas = {
    laliga: [
      {
        posicion: 1,
        equipo: "Real Madrid",
        logo: "/placeholder.svg?height=30&width=30",
        color: "#FFFFFF",
        pj: 38,
        pg: 27,
        pe: 8,
        pp: 3,
        gf: 70,
        gc: 20,
        dg: 50,
        pts: 89,
        forma: ["V", "V", "E", "V", "V"],
        clasificacion: "champions",
      },
      {
        posicion: 2,
        equipo: "Barcelona",
        logo: "/placeholder.svg?height=30&width=30",
        color: "#004D98",
        pj: 38,
        pg: 25,
        pe: 9,
        pp: 4,
        gf: 68,
        gc: 25,
        dg: 43,
        pts: 84,
        forma: ["V", "V", "V", "E", "V"],
        clasificacion: "champions",
      },
      {
        posicion: 3,
        equipo: "Atlético Madrid",
        logo: "/placeholder.svg?height=30&width=30",
        color: "#CB3524",
        pj: 38,
        pg: 23,
        pe: 8,
        pp: 7,
        gf: 63,
        gc: 30,
        dg: 33,
        pts: 77,
        forma: ["V", "D", "V", "V", "E"],
        clasificacion: "champions",
      },
      {
        posicion: 4,
        equipo: "Real Sociedad",
        logo: "/placeholder.svg?height=30&width=30",
        color: "#0B67AB",
        pj: 38,
        pg: 19,
        pe: 8,
        pp: 11,
        gf: 51,
        gc: 35,
        dg: 16,
        pts: 65,
        forma: ["V", "V", "D", "E", "V"],
        clasificacion: "champions",
      },
      {
        posicion: 5,
        equipo: "Villarreal",
        logo: "/placeholder.svg?height=30&width=30",
        color: "#FFF000",
        pj: 38,
        pg: 18,
        pe: 7,
        pp: 13,
        gf: 54,
        gc: 40,
        dg: 14,
        pts: 61,
        forma: ["V", "D", "V", "E", "D"],
        clasificacion: "europa",
      },
      {
        posicion: 6,
        equipo: "Betis",
        logo: "/placeholder.svg?height=30&width=30",
        color: "#00954C",
        pj: 38,
        pg: 17,
        pe: 8,
        pp: 13,
        gf: 48,
        gc: 42,
        dg: 6,
        pts: 59,
        forma: ["E", "V", "D", "V", "E"],
        clasificacion: "europa",
      },
      {
        posicion: 7,
        equipo: "Athletic Club",
        logo: "/placeholder.svg?height=30&width=30",
        color: "#EE2523",
        pj: 38,
        pg: 16,
        pe: 9,
        pp: 13,
        gf: 47,
        gc: 39,
        dg: 8,
        pts: 57,
        forma: ["V", "V", "E", "D", "V"],
        clasificacion: "conference",
      },
      {
        posicion: 8,
        equipo: "Sevilla",
        logo: "/placeholder.svg?height=30&width=30",
        color: "#CB3524",
        pj: 38,
        pg: 15,
        pe: 9,
        pp: 14,
        gf: 46,
        gc: 45,
        dg: 1,
        pts: 54,
        forma: ["D", "V", "E", "V", "D"],
      },
      {
        posicion: 9,
        equipo: "Valencia",
        logo: "/placeholder.svg?height=30&width=30",
        color: "#F49E00",
        pj: 38,
        pg: 14,
        pe: 8,
        pp: 16,
        gf: 43,
        gc: 48,
        dg: -5,
        pts: 50,
        forma: ["D", "D", "V", "E", "V"],
      },
      {
        posicion: 10,
        equipo: "Osasuna",
        logo: "/placeholder.svg?height=30&width=30",
        color: "#D91A21",
        pj: 38,
        pg: 13,
        pe: 9,
        pp: 16,
        gf: 38,
        gc: 46,
        dg: -8,
        pts: 48,
        forma: ["E", "D", "V", "D", "E"],
      },
      {
        posicion: 18,
        equipo: "Cádiz",
        logo: "/placeholder.svg?height=30&width=30",
        color: "#FFF000",
        pj: 38,
        pg: 5,
        pe: 16,
        pp: 17,
        gf: 25,
        gc: 56,
        dg: -31,
        pts: 31,
        forma: ["D", "D", "E", "D", "D"],
        clasificacion: "descenso",
      },
      {
        posicion: 19,
        equipo: "Almería",
        logo: "/placeholder.svg?height=30&width=30",
        color: "#E41B23",
        pj: 38,
        pg: 5,
        pe: 13,
        pp: 20,
        gf: 33,
        gc: 69,
        dg: -36,
        pts: 28,
        forma: ["D", "D", "D", "E", "D"],
        clasificacion: "descenso",
      },
      {
        posicion: 20,
        equipo: "Elche",
        logo: "/placeholder.svg?height=30&width=30",
        color: "#FFFFFF",
        pj: 38,
        pg: 3,
        pe: 9,
        pp: 26,
        gf: 27,
        gc: 74,
        dg: -47,
        pts: 18,
        forma: ["D", "D", "D", "D", "E"],
        clasificacion: "descenso",
      },
    ],
    premier: [
      {
        posicion: 1,
        equipo: "Manchester City",
        logo: "/placeholder.svg?height=30&width=30",
        color: "#6CABDD",
        pj: 38,
        pg: 28,
        pe: 5,
        pp: 5,
        gf: 94,
        gc: 33,
        dg: 61,
        pts: 89,
        forma: ["V", "V", "V", "V", "V"],
        clasificacion: "champions",
      },
      {
        posicion: 2,
        equipo: "Arsenal",
        logo: "/placeholder.svg?height=30&width=30",
        color: "#EF0107",
        pj: 38,
        pg: 26,
        pe: 6,
        pp: 6,
        gf: 88,
        gc: 43,
        dg: 45,
        pts: 84,
        forma: ["V", "V", "D", "V", "V"],
        clasificacion: "champions",
      },
      // Más equipos...
    ],
    // Más ligas...
  };

  // Obtener la tabla de la competición activa
  const tablaActual = tablas[competicionActiva] || [];

  const renderForma = (forma) => {
    return (
      <div className="flex gap-1">
        {forma.map((resultado, index) => (
          <span
            key={index}
            className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold text-white ${
              resultado === "V"
                ? "bg-green-500"
                : resultado === "E"
                  ? "bg-gray-500"
                  : resultado === "D"
                    ? "bg-red-500"
                    : ""
            }`}
          >
            {resultado}
          </span>
        ))}
      </div>
    );
  };

  // Función para renderizar el indicador de clasificación
  const renderClasificacion = (clasificacion) => {
    if (!clasificacion) return null;

    switch (clasificacion) {
      case "champions":
        return (
          <div
            className="w-1 h-full absolute left-0 top-0 bg-blue-500"
            title="Clasificación a Champions League"
          ></div>
        );
      case "europa":
        return (
          <div
            className="w-1 h-full absolute left-0 top-0 bg-orange-500"
            title="Clasificación a Europa League"
          ></div>
        );
      case "conference":
        return (
          <div
            className="w-1 h-full absolute left-0 top-0 bg-green-500"
            title="Clasificación a Conference League"
          ></div>
        );
      case "descenso":
        return (
          <div
            className="w-1 h-full absolute left-0 top-0 bg-red-500"
            title="Descenso"
          ></div>
        );
      default:
        return null;
    }
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

      {/* Contenido principal */}
      <main className="w-full px-4 lg:px-6 py-6">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaTable className="text-blue-500" /> Tablas de Posiciones
            </h1>
            <p className="text-gray-600 mt-1">
              Clasificación actual de los equipos por competición
            </p>
          </div>
        </div>

        {/* Selector de competiciones */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {competiciones.map((competicion) => (
              <button
                key={competicion.id}
                onClick={() => setCompeticionActiva(competicion.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  competicionActiva === competicion.id
                    ? "bg-white shadow-sm border border-white/20"
                    : "bg-white/50 hover:bg-white/70"
                }`}
              >
                <div className="relative w-6 h-6">
                  <Image
                    src={competicion.logo || "/placeholder.svg"}
                    alt={competicion.nombre}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {competicion.nombre}
                  </span>
                  <span className="text-xs text-gray-500">
                    {competicion.pais}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Leyenda */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Champions League</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Europa League</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Conference League</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Descenso</span>
          </div>
        </div>

        {/* Tabla de posiciones */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    Pos
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipo
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    PJ
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    G
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    E
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    P
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    GF
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    GC
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    DG
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    PTS
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Forma
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tablaActual.map((equipo) => (
                  <tr
                    key={equipo.posicion}
                    className="hover:bg-gray-50 transition-colors relative"
                  >
                    {renderClasificacion(equipo.clasificacion)}
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 pl-2">
                        {equipo.posicion}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 relative">
                          <div
                            className="absolute inset-0 rounded-full"
                            style={{ backgroundColor: equipo.color }}
                          ></div>
                          <Image
                            src={equipo.logo || "/placeholder.svg"}
                            alt={equipo.equipo}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {equipo.equipo}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{equipo.pj}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{equipo.pg}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{equipo.pe}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{equipo.pp}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{equipo.gf}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{equipo.gc}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-center">
                      <div
                        className={`text-sm font-medium ${
                          equipo.dg > 0
                            ? "text-green-600"
                            : equipo.dg < 0
                              ? "text-red-600"
                              : "text-gray-600"
                        }`}
                      >
                        {equipo.dg > 0 ? "+" : ""}
                        {equipo.dg}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-bold text-gray-900">
                        {equipo.pts}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        {renderForma(equipo.forma)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Si no hay resultados */}
          {tablaActual.length === 0 && (
            <div className="text-center py-10">
              <FaExclamationTriangle className="mx-auto text-yellow-500 text-3xl mb-2" />
              <p className="text-gray-500">
                No hay datos disponibles para esta competición
              </p>
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-6 text-sm text-gray-500 text-center">
          <p>Última actualización: 12 de junio de 2025</p>
        </div>
      </main>
    </div>
  );
}
