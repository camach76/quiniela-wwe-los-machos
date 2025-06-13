"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaSignOutAlt,
  FaBell,
  FaUser,
  FaEdit,
  FaTrophy,
  FaChartLine,
  FaCog,
  FaHistory,
  FaCheck,
  FaCamera,
  FaLock,
  FaEnvelope,
  FaGlobe,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaSave,
  FaExclamationTriangle,
  FaMedal,
  FaStar,
  FaSun,
  FaMoon,
} from "react-icons/fa";

export default function Perfil() {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [pestanaActiva, setPestanaActiva] = useState("general");
  const [datosUsuario, setDatosUsuario] = useState({
    nombre: "Carlos Rodríguez",
    usuario: "carlos_r",
    email: "carlos@ejemplo.com",
    telefono: "+34 612 345 678",
    ubicacion: "Madrid, España",
    biografia:
      "Aficionado al fútbol desde pequeño. Seguidor del Real Madrid y la selección española. Me encanta participar en quinielas y compartir mis predicciones con amigos.",
    sitioWeb: "www.ejemplo.com",
    redes: {
      facebook: "carlos.rodriguez",
      twitter: "@carlos_r",
      instagram: "@carlos_rodriguez",
    },
    notificaciones: {
      email: true,
      push: true,
      resultados: true,
      nuevosPartidos: true,
      actualizacionesRanking: false,
    },
  });

  // Datos de ejemplo para estadísticas
  const estadisticas = {
    puntosTotales: 156,
    posicionRanking: 1,
    partidosPronosticados: 22,
    aciertos: 18,
    precision: 82,
    rachaActual: 5,
    mejorRacha: 8,
    competicionFavorita: "LaLiga",
    equipoMasAcertado: "Barcelona",
  };

  // Datos de ejemplo para logros
  const logros = [
    {
      id: 1,
      nombre: "Principiante",
      descripcion: "Completar 10 pronósticos",
      completado: true,
      fecha: "15/05/2025",
      icono: "🏆",
    },
    {
      id: 2,
      nombre: "Experto",
      descripcion: "Alcanzar 80% de precisión",
      completado: true,
      fecha: "28/05/2025",
      icono: "🥇",
    },
    {
      id: 3,
      nombre: "Racha Ganadora",
      descripcion: "5 aciertos consecutivos",
      completado: true,
      fecha: "10/06/2025",
      icono: "🔥",
    },
    {
      id: 4,
      nombre: "Maestro Predictor",
      descripcion: "100 pronósticos acertados",
      completado: false,
      progreso: 18,
      total: 100,
      icono: "🧙‍♂️",
    },
    {
      id: 5,
      nombre: "Leyenda",
      descripcion: "Primer puesto en el ranking",
      completado: true,
      fecha: "12/06/2025",
      icono: "👑",
    },
    {
      id: 6,
      nombre: "Fiel Seguidor",
      descripcion: "Participar durante 3 meses",
      completado: false,
      progreso: 1,
      total: 3,
      icono: "📅",
    },
  ];

  // Datos de ejemplo para historial de actividad
  const historialActividad = [
    {
      id: 1,
      tipo: "pronostico",
      descripcion: "Pronosticaste Barcelona 3-1 Real Madrid",
      fecha: "12/06/2025",
      resultado: "Acertado (+10 pts)",
    },
    {
      id: 2,
      tipo: "ranking",
      descripcion: "Subiste al 1er puesto del ranking",
      fecha: "12/06/2025",
      resultado: null,
    },
    {
      id: 3,
      tipo: "logro",
      descripcion: "Desbloqueaste el logro 'Leyenda'",
      fecha: "12/06/2025",
      resultado: null,
    },
    {
      id: 4,
      tipo: "pronostico",
      descripcion: "Pronosticaste Man City 2-2 Liverpool",
      fecha: "11/06/2025",
      resultado: "Acertado (+10 pts)",
    },
    {
      id: 5,
      tipo: "pronostico",
      descripcion: "Pronosticaste Bayern 3-0 PSG",
      fecha: "10/06/2025",
      resultado: "Acertado (+10 pts)",
    },
    {
      id: 6,
      tipo: "logro",
      descripcion: "Desbloqueaste el logro 'Racha Ganadora'",
      fecha: "10/06/2025",
      resultado: null,
    },
    {
      id: 7,
      tipo: "pronostico",
      descripcion: "Pronosticaste Milan 2-0 Juventus",
      fecha: "09/06/2025",
      resultado: "Fallado (0 pts)",
    },
    {
      id: 8,
      tipo: "pronostico",
      descripcion: "Pronosticaste Dortmund 3-1 Leipzig",
      fecha: "08/06/2025",
      resultado: "Acertado (+10 pts)",
    },
  ];

  // Función para manejar cambios en los datos del usuario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setDatosUsuario({
        ...datosUsuario,
        [parent]: {
          ...datosUsuario[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      });
    } else {
      setDatosUsuario({
        ...datosUsuario,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  // Función para guardar cambios
  const guardarCambios = () => {
    // Aquí iría la lógica para guardar los cambios en el servidor
    setModoEdicion(false);
    alert("Cambios guardados correctamente");
  };

  // Función para renderizar el icono según el tipo de actividad
  const renderIconoActividad = (tipo) => {
    switch (tipo) {
      case "pronostico":
        return <FaChartLine className="text-blue-500" />;
      case "ranking":
        return <FaTrophy className="text-yellow-500" />;
      case "logro":
        return <FaMedal className="text-purple-500" />;
      default:
        return <FaHistory className="text-gray-500" />;
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
              {datosUsuario.nombre.charAt(0)}
            </div>
            <span className="text-gray-700 font-medium">
              Hola, {datosUsuario.nombre.split(" ")[0]}
            </span>
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
              <FaUser className="text-blue-500" /> Mi Perfil
            </h1>
            <p className="text-gray-600 mt-1">
              Gestiona tu información personal y preferencias
            </p>
          </div>

          <div>
            {modoEdicion ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setModoEdicion(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarCambios}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <FaSave />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setModoEdicion(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FaEdit />
                <span>Editar Perfil</span>
              </button>
            )}
          </div>
        </div>

        {/* Contenido del perfil */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Columna izquierda - Información del perfil */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* Tarjeta de perfil */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-white/20">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-green-400 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    {datosUsuario.nombre.charAt(0)}
                  </div>
                  {modoEdicion && (
                    <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                      <FaCamera />
                    </button>
                  )}
                </div>

                {modoEdicion ? (
                  <input
                    type="text"
                    name="nombre"
                    value={datosUsuario.nombre}
                    onChange={handleChange}
                    className="text-xl font-bold text-center w-full bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none mb-1"
                  />
                ) : (
                  <h2 className="text-xl font-bold mb-1">
                    {datosUsuario.nombre}
                  </h2>
                )}

                <div className="flex items-center gap-2 text-gray-500 mb-4">
                  <span>@{datosUsuario.usuario}</span>
                  <div className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    Premium
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {estadisticas.puntosTotales}
                    </span>
                    <span className="text-xs text-gray-500">Puntos</span>
                  </div>
                  <div className="h-10 border-r border-gray-200"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-green-600">
                      #{estadisticas.posicionRanking}
                    </span>
                    <span className="text-xs text-gray-500">Ranking</span>
                  </div>
                  <div className="h-10 border-r border-gray-200"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-purple-600">
                      {estadisticas.precision}%
                    </span>
                    <span className="text-xs text-gray-500">Precisión</span>
                  </div>
                </div>

                <div className="w-full border-t border-gray-200 pt-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <FaEnvelope className="text-gray-400" />
                      {modoEdicion ? (
                        <input
                          type="email"
                          name="email"
                          value={datosUsuario.email}
                          onChange={handleChange}
                          className="flex-1 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                        />
                      ) : (
                        <span>{datosUsuario.email}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <FaGlobe className="text-gray-400" />
                      {modoEdicion ? (
                        <input
                          type="text"
                          name="sitioWeb"
                          value={datosUsuario.sitioWeb}
                          onChange={handleChange}
                          className="flex-1 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                        />
                      ) : (
                        <span>{datosUsuario.sitioWeb}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <FaFacebook className="text-blue-600" />
                      {modoEdicion ? (
                        <input
                          type="text"
                          name="redes.facebook"
                          value={datosUsuario.redes.facebook}
                          onChange={handleChange}
                          className="flex-1 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                        />
                      ) : (
                        <span>{datosUsuario.redes.facebook}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <FaTwitter className="text-blue-400" />
                      {modoEdicion ? (
                        <input
                          type="text"
                          name="redes.twitter"
                          value={datosUsuario.redes.twitter}
                          onChange={handleChange}
                          className="flex-1 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                        />
                      ) : (
                        <span>{datosUsuario.redes.twitter}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <FaInstagram className="text-pink-600" />
                      {modoEdicion ? (
                        <input
                          type="text"
                          name="redes.instagram"
                          value={datosUsuario.redes.instagram}
                          onChange={handleChange}
                          className="flex-1 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                        />
                      ) : (
                        <span>{datosUsuario.redes.instagram}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Biografía */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-white/20">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Biografía
              </h3>
              {modoEdicion ? (
                <textarea
                  name="biografia"
                  value={datosUsuario.biografia}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-white/50 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              ) : (
                <p className="text-gray-600">{datosUsuario.biografia}</p>
              )}
            </div>

            {/* Acciones rápidas */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-white/20">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Acciones Rápidas
              </h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <FaLock className="text-blue-500" />
                    <span>Cambiar contraseña</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>

                <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <FaBell className="text-blue-500" />
                    <span>Preferencias de notificaciones</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>

                <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <FaCog className="text-blue-500" />
                    <span>Configuración de la cuenta</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>

                <button className="w-full flex items-center justify-between p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <FaExclamationTriangle className="text-red-500" />
                    <span className="text-red-600">Eliminar cuenta</span>
                  </div>
                  <span className="text-red-400">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Columna derecha - Pestañas de contenido */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/20 overflow-hidden">
              {/* Tabs de navegación */}
              <div className="flex border-b">
                <button
                  onClick={() => setPestanaActiva("general")}
                  className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
                    pestanaActiva === "general"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FaChartLine />
                    <span>Estadísticas</span>
                  </div>
                </button>
                <button
                  onClick={() => setPestanaActiva("logros")}
                  className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
                    pestanaActiva === "logros"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FaTrophy />
                    <span>Logros</span>
                  </div>
                </button>
                <button
                  onClick={() => setPestanaActiva("historial")}
                  className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
                    pestanaActiva === "historial"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FaHistory />
                    <span>Historial</span>
                  </div>
                </button>
                <button
                  onClick={() => setPestanaActiva("ajustes")}
                  className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
                    pestanaActiva === "ajustes"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FaCog />
                    <span>Ajustes</span>
                  </div>
                </button>
              </div>

              {/* Contenido de las pestañas */}
              <div className="p-6">
                {/* Estadísticas */}
                {pestanaActiva === "general" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Mis Estadísticas
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">
                            Precisión
                          </span>
                          <span className="text-sm font-medium">
                            {estadisticas.precision}%
                          </span>
                        </div>
                        <div className="w-full bg-blue-100 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${estadisticas.precision}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">
                            Aciertos
                          </span>
                          <span className="text-sm font-medium">
                            {estadisticas.aciertos}/
                            {estadisticas.partidosPronosticados}
                          </span>
                        </div>
                        <div className="w-full bg-green-100 rounded-full h-2.5">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{
                              width: `${(estadisticas.aciertos / estadisticas.partidosPronosticados) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                      <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {estadisticas.puntosTotales}
                        </div>
                        <div className="text-xs text-gray-500">
                          Puntos Totales
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          #{estadisticas.posicionRanking}
                        </div>
                        <div className="text-xs text-gray-500">
                          Posición Ranking
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {estadisticas.rachaActual}
                        </div>
                        <div className="text-xs text-gray-500">
                          Racha Actual
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {estadisticas.mejorRacha}
                        </div>
                        <div className="text-xs text-gray-500">Mejor Racha</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-3">
                          Competiciones Favoritas
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium">1</span>
                              </div>
                              <span>{estadisticas.competicionFavorita}</span>
                            </div>
                            <span className="text-sm font-medium">
                              85% precisión
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium">2</span>
                              </div>
                              <span>Premier League</span>
                            </div>
                            <span className="text-sm font-medium">
                              78% precisión
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium">3</span>
                              </div>
                              <span>Champions League</span>
                            </div>
                            <span className="text-sm font-medium">
                              72% precisión
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-3">
                          Equipos Más Acertados
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium">1</span>
                              </div>
                              <span>{estadisticas.equipoMasAcertado}</span>
                            </div>
                            <span className="text-sm font-medium">
                              90% aciertos
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium">2</span>
                              </div>
                              <span>Bayern Munich</span>
                            </div>
                            <span className="text-sm font-medium">
                              85% aciertos
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium">3</span>
                              </div>
                              <span>Manchester City</span>
                            </div>
                            <span className="text-sm font-medium">
                              80% aciertos
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Logros */}
                {pestanaActiva === "logros" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Mis Logros
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {logros.map((logro) => (
                        <div
                          key={logro.id}
                          className={`rounded-lg p-4 border ${
                            logro.completado
                              ? "bg-gradient-to-br from-blue-50 to-green-50 border-blue-200"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 flex-shrink-0 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">
                              {logro.icono}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-800">
                                  {logro.nombre}
                                </h4>
                                {logro.completado && (
                                  <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                                    <FaCheck />
                                    <span>{logro.fecha}</span>
                                  </div>
                                )}
                              </div>

                              <p className="text-sm text-gray-600 mt-1">
                                {logro.descripcion}
                              </p>

                              {!logro.completado && (
                                <div className="mt-2">
                                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                    <span>Progreso</span>
                                    <span>
                                      {logro.progreso}/{logro.total}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{
                                        width: `${(logro.progreso / logro.total) * 100}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Historial */}
                {pestanaActiva === "historial" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Historial de Actividad
                    </h3>

                    <div className="space-y-4">
                      {historialActividad.map((actividad) => (
                        <div key={actividad.id} className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                            {renderIconoActividad(actividad.tipo)}
                          </div>

                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                              <p className="text-gray-800">
                                {actividad.descripcion}
                              </p>
                              <span className="text-xs text-gray-500">
                                {actividad.fecha}
                              </span>
                            </div>

                            {actividad.resultado && (
                              <div
                                className={`text-sm mt-1 ${
                                  actividad.resultado.includes("Acertado")
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {actividad.resultado}
                              </div>
                            )}

                            <div className="mt-3 border-b border-gray-100"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ajustes */}
                {pestanaActiva === "ajustes" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Ajustes de Cuenta
                    </h3>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-3">
                          Notificaciones
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">
                              Notificaciones por email
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name="notificaciones.email"
                                checked={datosUsuario.notificaciones.email}
                                onChange={handleChange}
                                className="sr-only peer"
                                disabled={!modoEdicion}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">
                              Notificaciones push
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name="notificaciones.push"
                                checked={datosUsuario.notificaciones.push}
                                onChange={handleChange}
                                className="sr-only peer"
                                disabled={!modoEdicion}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">
                              Resultados de partidos
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name="notificaciones.resultados"
                                checked={datosUsuario.notificaciones.resultados}
                                onChange={handleChange}
                                className="sr-only peer"
                                disabled={!modoEdicion}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">
                              Nuevos partidos disponibles
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name="notificaciones.nuevosPartidos"
                                checked={
                                  datosUsuario.notificaciones.nuevosPartidos
                                }
                                onChange={handleChange}
                                className="sr-only peer"
                                disabled={!modoEdicion}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">
                              Actualizaciones de ranking
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name="notificaciones.actualizacionesRanking"
                                checked={
                                  datosUsuario.notificaciones
                                    .actualizacionesRanking
                                }
                                onChange={handleChange}
                                className="sr-only peer"
                                disabled={!modoEdicion}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-3">
                          Privacidad
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">
                              Perfil público
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={true}
                                className="sr-only peer"
                                disabled={!modoEdicion}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">
                              Mostrar mis pronósticos
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={true}
                                className="sr-only peer"
                                disabled={!modoEdicion}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">
                              Compartir estadísticas
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={false}
                                className="sr-only peer"
                                disabled={!modoEdicion}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-3">
                          Tema
                        </h4>
                        <div className="flex gap-3">
                          <button className="w-full p-3 bg-white border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                            <FaSun className="text-yellow-500" />
                            <span>Claro</span>
                          </button>

                          <button className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center gap-2 text-white hover:bg-gray-700 transition-colors">
                            <FaMoon className="text-blue-400" />
                            <span>Oscuro</span>
                          </button>

                          <button className="w-full p-3 bg-gradient-to-r from-blue-50 to-gray-800 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                            <FaStar className="text-yellow-500" />
                            <span>Auto</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
