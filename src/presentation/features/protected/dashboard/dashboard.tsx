"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useUserSession } from "@/presentation/hooks/useUserSession";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useLogout } from "@/presentation/features/auth/logout/hooks/useLogout";
import { toast } from "react-hot-toast";
import { FaFutbol, FaTable, FaUser, FaSignOutAlt, FaListOl, FaBell, FaTrophy, FaCalendarAlt } from "react-icons/fa";

export default function Dashboard() {
  const { user } = useUserSession();
  const { mutate: logout } = useLogout();
  const supabase = createClientComponentClient();
  const [userName, setUserName] = useState("Usuario");
  const [activeTab, setActiveTab] = useState("proximos");
  
  // Estados para partidos
  const [proximosPartidos, setProximosPartidos] = useState<any[]>([]);
  const [partidosRecientes, setPartidosRecientes] = useState<any[]>([]);
  const [loadingPartidos, setLoadingPartidos] = useState(true);
  
  // Estados para el ranking
  const [topJugadores, setTopJugadores] = useState<any[]>([]);
  const [loadingRanking, setLoadingRanking] = useState(true);

  // Cargar datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();

          if (data?.username) {
            setUserName(data.username);
          } else if (user.email) {
            setUserName(user.email.split('@')[0]);
          }
        } catch (error) {
          console.error("Error al cargar el perfil:", error);
          if (user.email) {
            setUserName(user.email.split('@')[0]);
          }
        }
      }
    };

    fetchUserData();
  }, [user, supabase]);

  // Efecto para depurar peticiones
  useEffect(() => {
    console.log('Efecto principal se ejecutó');
    return () => console.log('Efecto principal se limpió');
  }, []);

  // Cargar partidos próximos
  useEffect(() => {
    console.log('Iniciando fetchProximosPartidos');
    let isMounted = true;
    
    const fetchProximosPartidos = async () => {
      if (!isMounted) return;
      console.log('Ejecutando fetchProximosPartidos');
      try {
        setLoadingPartidos(true);
        
        const response = await fetch('/api/match/upcoming');
        
        if (!response.ok) {
          throw new Error('Error al cargar los partidos próximos');
        }
        
        const partidosData = await response.json();
        
        // Formatear próximos partidos
        const partidosProximos = partidosData.map((partido: any) => {
          const fecha = new Date(partido.fecha);
          return {
            id: partido.id,
            local: {
              nombre: partido.club_a?.nombre || 'Equipo Local',
              logo: partido.club_a?.logo_url || '/images/placeholder-team.png',
            },
            visitante: {
              nombre: partido.club_b?.nombre || 'Equipo Visitante',
              logo: partido.club_b?.logo_url || '/images/placeholder-team.png',
            },
            fecha: fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
            hora: fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            competicion: partido.competicion || 'Mundial de clubes',
            estadio: partido.estadio || 'Estadio no especificado',
            // Agregamos los resultados para usarlos en caso de que el partido ya haya comenzado
            resultado_a: partido.resultado_a,
            resultado_b: partido.resultado_b
          };
        });
        
        setProximosPartidos(partidosProximos);
        
        // Para propósitos de demostración, usaremos los mismos partidos como recientes
        // En una implementación real, deberías tener un endpoint separado para partidos pasados
        const ahora = new Date();
        const partidosPasados = partidosData
          .filter((p: any) => new Date(p.fecha) < ahora)
          .map((partido: any) => {
            const fecha = new Date(partido.fecha);
            return {
              id: partido.id,
              local: {
                nombre: partido.club_a?.nombre || 'Equipo Local',
                logo: partido.club_a?.logo_url || '/images/placeholder-team.png',
              },
              visitante: {
                nombre: partido.club_b?.nombre || 'Equipo Visitante',
                logo: partido.club_b?.logo_url || '/images/placeholder-team.png',
              },
              resultado_a: partido.resultado_a || 0, // Usar 0 si no hay resultado
              resultado_b: partido.resultado_b || 0, // Usar 0 si no hay resultado
              fecha: fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
              hora: fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
              competicion: partido.competicion || 'Mundial de clubes',
              estadio: partido.estadio || 'Estadio no especificado'
            };
          });
        
        setPartidosRecientes(partidosPasados);
        
      } catch (error) {
        console.error('Error al cargar los partidos:', error);
        toast.error('Error al cargar los partidos');
      } finally {
        if (isMounted) {
          setLoadingPartidos(false);
        }
      }
    };

    fetchProximosPartidos();
    
    return () => {
      console.log('Limpiando fetchProximosPartidos');
      isMounted = false;
    };
  }, []); // Array de dependencias vacío para que solo se ejecute una vez

  // Cargar ranking
  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoadingRanking(true);
        const res = await fetch(`/api/ranking?userId=${user?.id || 'anonymous'}`);
        const data = await res.json();
        
        const top5 = data
          .sort((a: any, b: any) => b.puntos - a.puntos)
          .slice(0, 5)
          .map((j: any, i: number) => ({
            ...j,
            posicion: i + 1,
            esUsuario: j.id === user?.id
          }));
          
        setTopJugadores(top5);
      } catch (error) {
        console.error('Error al cargar el ranking:', error);
      } finally {
        setLoadingRanking(false);
      }
    };

    fetchRanking();
  }, [user?.id]);

  // Estadísticas del usuario (ejemplo)
  const estadisticas = {
    posicion: 1,
    puntos: 150,
    pronosticosAcertados: 12,
    partidosPronosticados: 15
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10 flex items-center justify-between px-4 lg:px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <Image src="/images/logo.png" alt="Logo" fill className="object-contain rounded-full" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Quiniela WWE
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-600 hover:text-gray-900">
            <FaBell className="text-xl" />
          </button>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden md:inline text-sm font-medium">{userName}</span>
          </div>
          <button 
            onClick={() => logout()}
            className="p-2 text-gray-600 hover:text-red-600"
            title="Cerrar sesión"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </nav>

      <main className="w-full px-4 lg:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Columna izquierda - Estadísticas y accesos rápidos */}
          <div className="w-full lg:w-1/4 space-y-6">
            {/* Tarjeta de estadísticas */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-5 border border-white/20">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Mis Estadísticas</h2>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-blue-600">{estadisticas.posicion}°</p>
                  <p className="text-xs text-gray-600">Posición</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-purple-600">{estadisticas.puntos}</p>
                  <p className="text-xs text-gray-600">Puntos</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-amber-600">
                    {Math.round((estadisticas.pronosticosAcertados / estadisticas.partidosPronosticados) * 100)}%
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
                <span className="font-medium text-sm text-center">Mi Quiniela</span>
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
                <span className="font-medium text-sm text-center">Resultados</span>
              </Link>
              <Link
                href="/perfil"
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-lg transition-all border-t-4 border-purple-600"
              >
                <FaUser className="text-2xl text-purple-600 mb-2" />
                <span className="font-medium text-sm text-center">Perfil</span>
              </Link>
            </div>

            {/* Ranking de jugadores */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-5 border border-white/20">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaTrophy className="text-yellow-500" />
                <span>Ranking</span>
              </h2>
              {loadingRanking ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {topJugadores.map((jugador) => (
                    <div key={jugador.id} className={`flex items-center justify-between p-2 rounded-lg ${
                      jugador.esUsuario ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          jugador.posicion === 1 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : jugador.posicion === 2 
                              ? 'bg-gray-200 text-gray-700' 
                              : jugador.posicion === 3 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-gray-100 text-gray-600'
                        }`}>
                          {jugador.posicion}
                        </span>
                        <span className={`font-medium ${jugador.esUsuario ? 'text-blue-700' : 'text-gray-800'}`}>
                          {jugador.nombre}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-700">{jugador.puntos} pts</span>
                    </div>
                  ))}
                </div>
              )}
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
                    {loadingPartidos ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : proximosPartidos.length > 0 ? (
                      proximosPartidos.map((partido) => (
                        <div
                          key={partido.id}
                          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="p-4">
                            {/* Encabezado - Competición y Fecha */}
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                {partido.competicion}
                              </span>
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center px-2 h-7 bg-gray-50 rounded-md border border-gray-100">
                                  <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span className="text-sm font-medium text-gray-700">
                                    {partido.fecha}
                                  </span>
                                </div>
                                <div className="flex items-center justify-center w-14 h-7 bg-blue-50 rounded-full border border-blue-100">
                                  <svg className="w-3.5 h-3.5 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="text-sm font-semibold text-blue-600">
                                    {partido.hora}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Equipos y resultado */}
                            <div className="flex items-center justify-between px-2 py-3">
                              {/* Equipo local */}
                              <div className="flex-1 flex items-center justify-end gap-3 text-right">
                                <div>
                                  <p className="font-medium text-gray-900">{partido.local.nombre}</p>
                                </div>
                                <div className="w-10 h-10 relative">
                                  <Image
                                    src={partido.local.logo}
                                    alt={partido.local.nombre}
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = '/images/logo.png';
                                      target.onerror = null; // Prevenir bucles adicionales
                                    }}
                                    unoptimized={true} // Evitar optimización que podría causar problemas
                                  />
                                </div>
                              </div>

                              {/* Marcador */}
                              <div className="mx-4 px-4 py-1 bg-gray-50 rounded-md">
                                <span className="font-mono text-lg font-bold">VS</span>
                              </div>

                              {/* Equipo visitante */}
                              <div className="flex-1 flex items-center gap-3">
                                <div className="w-10 h-10 relative">
                                  <Image
                                    src={partido.visitante.logo}
                                    alt={partido.visitante.nombre}
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = '/images/logo.png';
                                      target.onerror = null;
                                    }}
                                    unoptimized={true}
                                  />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{partido.visitante.nombre}</p>
                                </div>
                              </div>
                            </div>

                            {/* Estadio */}
                            <div className="mt-2 flex justify-center">
                              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 border border-green-200 text-green-800 text-xs font-medium">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7.5v2.25a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25V7.5m9 3H9m6-3h1.125c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125H7.875C7.253 19.5 7 19.08 7 18.625v-9.75c0-.621.504-1.125 1.125-1.125H9m6-3h-6a2.25 2.25 0 00-2.25 2.25v9.75c0 .621.504 1.125 1.125 1.125h9a2.25 2.25 0 002.25-2.25V7.5a2.25 2.25 0 00-2.25-2.25z" />
                                </svg>
                                {partido.estadio}
                              </div>
                            </div>
                            
                            {/* Acciones */}
                            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-center">
                              <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-sm font-medium rounded-full hover:opacity-90 transition-opacity">
                                Hacer pronóstico
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No hay partidos próximos programados
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "recientes" && (
                  <div className="space-y-4">
                    {loadingPartidos ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : partidosRecientes.length > 0 ? (
                      partidosRecientes.map((partido) => (
                        <div
                          key={partido.id}
                          className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-500">
                              {partido.competicion}
                            </span>
                            <span className="text-xs text-gray-400">
                              {partido.fecha}
                            </span>
                          </div>

                          <div className="flex items-center justify-between py-2">
                            {/* Equipo local */}
                            <div className="flex-1 flex items-center justify-end gap-3">
                              <p className="font-medium text-right">
                                {partido.local.nombre}
                              </p>
                              <div className="w-8 h-8 relative">
                                <Image
                                  src={partido.local.logo}
                                  alt={partido.local.nombre}
                                  width={32}
                                  height={32}
                                  className="object-contain"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/images/placeholder-team.png';
                                    target.onerror = null;
                                  }}
                                  unoptimized={true}
                                />
                              </div>
                            </div>

                            {/* Resultado */}
                            <div className="mx-3 px-3 py-1 bg-gray-50 rounded-md">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-800 w-4 text-center">
                                  {partido.resultado_a}
                                </span>
                                <span className="text-gray-400">-</span>
                                <span className="font-bold text-gray-800 w-4 text-center">
                                  {partido.resultado_b}
                                </span>
                              </div>
                            </div>

                            {/* Equipo visitante */}
                            <div className="flex-1 flex items-center gap-3">
                              <div className="w-8 h-8 relative">
                                <Image
                                  src={partido.visitante.logo}
                                  alt={partido.visitante.nombre}
                                  fill
                                  className="object-contain"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/images/placeholder-team.png';
                                  }}
                                />
                              </div>
                              <p className="font-medium">
                                {partido.visitante.nombre}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                            <p className="text-xs text-gray-500">
                              {partido.estadio}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No hay resultados recientes para mostrar
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Columna derecha - Notificaciones o información adicional */}
          <div className="w-full lg:w-1/4 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-5 border border-white/20">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaBell className="text-blue-500" />
                <span>Notificaciones</span>
              </h2>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">¡Nuevo partido disponible para pronóstico!</p>
                  <p className="text-xs text-blue-600 mt-1">Hace 2 horas</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-800">Tu pronóstico ha sido registrado correctamente</p>
                  <p className="text-xs text-gray-500 mt-1">Ayer</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-800">¡Has subido al puesto #3 en el ranking!</p>
                  <p className="text-xs text-gray-500 mt-1">Ayer</p>
                </div>
              </div>
              <button className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                Ver todas las notificaciones
              </button>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-5 border border-white/20">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Próximamente</h2>
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                  <p className="text-sm font-medium text-amber-800">Nueva temporada</p>
                  <p className="text-xs text-amber-600 mt-1">Inicia el 15 de agosto</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                  <p className="text-sm font-medium text-purple-800">Torneo especial</p>
                  <p className="text-xs text-purple-600 mt-1">Inscripciones abiertas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
