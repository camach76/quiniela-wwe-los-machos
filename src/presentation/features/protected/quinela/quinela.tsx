"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
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
  FaSpinner,
  FaExclamationTriangle
} from "react-icons/fa"

import { Competition, Match as MatchType, useUpcomingMatches } from '@/presentation/hooks/useUpcomingMatches';

type Pronostico = {
  local: number | null;
  visitante: number | null;
}

type PartidoConJornada = MatchType & {
  jornada: string;
  competicion: string;
}

export default function MiQuinela() {
  const userName = "Usuario"
  const [tabActiva, setTabActiva] = useState("pendientes")
  const [jornadas, setJornadas] = useState<Record<string, boolean>>({})
  const { matches: partidos, loading: cargando, error: errorApi } = useUpcomingMatches();
  const [partidosPendientes, setPartidosPendientes] = useState<PartidoConJornada[]>([]);
  const [pronosticos, setPronosticos] = useState<Record<string, Pronostico>>({})
  const [error, setError] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (partidos.length > 0) {
      // Procesar los partidos para agregar jornada y formatear datos
      const partidosProcesados = partidos.map(partido => {
        // Extraer la fecha del partido
        const fecha = new Date(partido.fecha);
        // Crear un identificador de jornada (ej: "Jornada 1 - 15 Jun")
        const jornada = `Fecha ${fecha.getDate()} - ${fecha.toLocaleString('es-ES', { month: 'short' })}`;
        
        return {
          ...partido,
          jornada,
          competicion: partido.competition?.name || 'Amistoso'
        };
      });

      setPartidosPendientes(partidosProcesados);
      const jornadasTemp: Record<string, boolean> = {};
      partidosProcesados.forEach(partido => {
        if (partido.jornada) {
          jornadasTemp[partido.jornada] = true;
        }
      });
      
      setJornadas(jornadasTemp);
    }
  }, [partidos]);

  const toggleJornada = (jornada: string) => {
    setJornadas(prev => ({
      ...prev,
      [jornada]: !prev[jornada],
    }))
  }

  const actualizarPronostico = (partidoId: string, equipo: 'local' | 'visitante', valor: string) => {
    // Si el valor está vacío, lo establecemos como null, de lo contrario lo convertimos a número
    const valorNumerico = valor === "" ? null : Number.parseInt(valor, 10);
    
    // Si el valor no es un número válido, lo establecemos como null
    const valorFinal = (valorNumerico !== null && !isNaN(valorNumerico)) ? valorNumerico : null;

    setPronosticos(prev => ({
      ...prev,
      [partidoId]: {
        ...(prev[partidoId] || { local: null, visitante: null }),
        [equipo]: valorFinal,
      },
    }));
  }

  const guardarPronosticos = async () => {
    if (Object.keys(pronosticos).length === 0) {
      alert("No hay pronósticos para guardar");
      return;
    }

    setGuardando(true);
    
    try {
      // Preparar los datos para enviar al backend
      const pronosticosParaGuardar = Object.entries(pronosticos).map(([partidoId, pronostico]) => ({
        matchId: partidoId,
        homeScore: pronostico.local,
        awayScore: pronostico.visitante,
        // Agregar más datos según sea necesario para tu backend
      }));

      // Aquí iría la lógica para guardar en el backend
      const response = await fetch('/api/bets', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // Agregar token de autenticación si es necesario
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: "usuario_actual_id", // Deberías obtener esto de tu sistema de autenticación
          pronosticos: pronosticosParaGuardar
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al guardar los pronósticos');
      }
      
      const result = await response.json();
      console.log("Pronósticos guardados:", result);
      
      // Mostrar mensaje de éxito
      alert("¡Tus pronósticos se han guardado correctamente!");
      
      // Opcional: Actualizar la UI para reflejar que los pronósticos están guardados
      // Por ejemplo, podrías marcar los partidos como pronosticados
      
    } catch (error: unknown) {
      let errorMessage = 'No se pudieron guardar los pronósticos. Intenta de nuevo más tarde.';
      
      if (error instanceof Error) {
        console.error("Error al guardar pronósticos:", error);
        errorMessage = error.message || errorMessage;
      } else if (typeof error === 'string') {
        console.error("Error al guardar pronósticos:", error);
        errorMessage = error;
      } else {
        console.error("Error desconocido al guardar pronósticos:", error);
      }
      
      setError(`Error al guardar: ${errorMessage}`);
      
      // Mostrar notificación de error
      alert(`Error: ${errorMessage}`);
    } finally {
      setGuardando(false);
    }
  };

  // Función para formatear la fecha
  const formatearFecha = (fechaString: string) => {
    if (!fechaString) return 'Fecha por definir';
    
    try {
      const fecha = new Date(fechaString);
      
      // Verificar si la fecha es válida
      if (isNaN(fecha.getTime())) {
        console.error('Fecha inválida:', fechaString);
        return 'Fecha inválida';
      }
      
      return fecha.toLocaleString('es-ES', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace(',', ' •');
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha inválida';
    }
  }

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-100">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando partidos...</p>
        </div>
      </div>
    )
  }

  if (errorApi || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-100">
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full mx-4 text-center">
          <div className="text-red-500 mb-4">
            <FaExclamationTriangle className="text-4xl mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">¡Ups! Algo salió mal</h2>
          <p className="text-gray-600 mb-6">{errorApi || error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

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
                priority 
              />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              WWE Los Machos
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button 
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors relative"
            aria-label="Notificaciones"
          >
            <FaBell className="text-gray-600" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-700 font-medium">Hola, {userName}</span>
          </div>
          <button 
            className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium transition-colors"
            aria-label="Cerrar sesión"
          >
            <FaSignOutAlt />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </nav>

      <main className="w-full px-4 lg:px-6 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaFutbol className="text-blue-500" /> Mi Quinela
            </h1>
            <p className="text-gray-600 mt-1">Gestiona tus pronósticos para los próximos partidos</p>
          </div>

          {tabActiva === "pendientes" && (
            <button
              onClick={guardarPronosticos}
              disabled={Object.keys(pronosticos).length === 0 || guardando}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                Object.keys(pronosticos).length === 0 || guardando
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {guardando ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Guardar Pronósticos</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="mb-6 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex">
            {['pendientes', 'pronosticados', 'completados'].map(tab => {
              const Icon = tab === 'pendientes' 
                ? FaCalendarAlt 
                : tab === 'pronosticados' 
                ? FaCheck 
                : FaHistory
                
              return (
                <button
                  key={tab}
                  onClick={() => setTabActiva(tab)}
                  className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
                    tabActiva === tab
                      ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                  aria-current={tabActiva === tab ? 'page' : undefined}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icon className={tabActiva === tab ? 'text-blue-600' : 'text-gray-500'} />
                    <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {tabActiva === "pendientes" && (
          <div className="space-y-4">
            {Object.entries(jornadas).map(([jornada, abierta]) => {
              const partidosJornada = partidosPendientes.filter(p => p.jornada === jornada)
              if (partidosJornada.length === 0) return null
              
              return (
                <div
                  key={jornada}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <div
                    className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleJornada(jornada)}
                    aria-expanded={abierta}
                  >
                    <h3 className="font-semibold text-gray-800">
                      {jornada.replace('jornada', 'Jornada ')}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {partidosJornada.length} partido{partidosJornada.length !== 1 ? 's' : ''}
                      </span>
                      {abierta ? (
                        <FaChevronUp className="text-gray-500" />
                      ) : (
                        <FaChevronDown className="text-gray-500" />
                      )}
                    </div>
                  </div>
                  {abierta && (
                    <div className="divide-y divide-gray-100">
                      {partidosJornada.map(partido => (
                        <div key={partido.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {partido.competicion}
                            </span>
                            <span className="text-xs font-medium text-gray-500">
                              {formatearFecha(partido.fecha)}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            {/* Equipo Local */}
                            <div className="flex-1 flex items-center gap-3">
                              <div className="relative w-12 h-12 flex-shrink-0">
                                <div 
                                  className="absolute inset-0 rounded-full" 
                                  style={{ backgroundColor: partido.club_a?.color || '#e5e7eb' }}
                                ></div>
                                <Image
                                  src={partido.club_a?.logo || "/placeholder.svg"}
                                  alt={partido.club_a?.nombre || 'Equipo local'}
                                  width={48}
                                  height={48}
                                  className="relative z-10 object-contain p-1"
                                />
                              </div>
                              <span className="font-medium text-gray-800">
                                {partido.club_a?.nombre || 'Local'}
                              </span>
                            </div>

                            {/* Marcador */}
                            <div className="flex items-center gap-2 mx-2">
                              <input
                                type="number"
                                min="0"
                                max="99"
                                className="w-14 h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                value={pronosticos[partido.id]?.local ?? ""}
                                onChange={(e) => actualizarPronostico(partido.id, 'local', e.target.value)}
                                aria-label={`Goles de ${partido.club_a?.nombre || partido.home_team || 'local'}`}
                                disabled={guardando}
                              />
                              <span className="text-gray-400 font-bold text-xl">-</span>
                              <input
                                type="number"
                                min="0"
                                max="99"
                                className="w-14 h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                value={pronosticos[partido.id]?.visitante ?? ""}
                                onChange={(e) => actualizarPronostico(partido.id, 'visitante', e.target.value)}
                                aria-label={`Goles de ${partido.club_b?.nombre || partido.away_team || 'visitante'}`}
                                disabled={guardando}
                              />
                            </div>

                            {/* Equipo Visitante */}
                            <div className="flex-1 flex items-center gap-3 justify-end">
                              <span className="font-medium text-gray-800 text-right">
                                {partido.club_b?.nombre || 'Visitante'}
                              </span>
                              <div className="relative w-12 h-12 flex-shrink-0">
                                <div 
                                  className="absolute inset-0 rounded-full" 
                                  style={{ backgroundColor: partido.club_b?.color || '#e5e7eb' }}
                                ></div>
                                <Image
                                  src={partido.club_b?.logo || "/placeholder.svg"}
                                  alt={partido.club_b?.nombre || 'Equipo visitante'}
                                  width={48}
                                  height={48}
                                  className="relative z-10 object-contain p-1"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
