"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { TeamLogo } from "@/presentation/components/TeamLogo"
import { 
  FaSignOutAlt,
  FaBell,
  FaFutbol,
  FaCheck,
  FaCheckCircle,
  FaCalendarAlt,
  FaHistory,
  FaChevronDown,
  FaChevronUp,
  FaSave,
  FaSpinner,
  FaExclamationTriangle,
  FaUser
} from "react-icons/fa"
import { useUserSession } from "@/presentation/hooks/useUserSession";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { user, loading: cargandoUsuario } = useUserSession();
  const [userName, setUserName] = useState("Usuario");
  
  const [tabActiva, setTabActiva] = useState("pendientes");
  const [jornadas, setJornadas] = useState<Record<string, boolean>>({});
  const { matches: partidos, loading: cargandoPartidos, error: errorApi } = useUpcomingMatches();
  const [partidosPendientes, setPartidosPendientes] = useState<PartidoConJornada[]>([]);
  const [partidosPronosticados, setPartidosPronosticados] = useState<PartidoConJornada[]>([]);
  const [partidosCompletados, setPartidosCompletados] = useState<PartidoConJornada[]>([]);
  
  // Estados para manejar los pronósticos
  const [pronosticos, setPronosticos] = useState<Record<string, Pronostico>>({});
  const [cambiosPendientes, setCambiosPendientes] = useState<Record<string, boolean>>({});
  const [pronosticosEditados, setPronosticosEditados] = useState<Record<string, Pronostico>>({});
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState<Record<string, boolean>>({});
  const [cargando, setCargando] = useState(false);
  
  // Estado para controlar la carga inicial
  const [cargandoInicial, setCargandoInicial] = useState(true);
  
  // Función para renderizar el botón de guardar
  const renderBotonGuardar = (partidoId: string) => {
    const estaGuardando = guardando[partidoId] || false;
    const tieneCambios = cambiosPendientes[partidoId] || false;
    
    if (!tieneCambios) return null;
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      guardarPronostico(partidoId);
    };
    
    return (
      <button
        onClick={handleClick}
        disabled={estaGuardando}
        className={`ml-2 px-3 py-1 rounded-md text-sm font-medium ${
          estaGuardando 
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {estaGuardando ? (
          <span className="flex items-center gap-2">
            <FaSpinner className="animate-spin" />
            Guardando...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <FaSave />
            Guardar
          </span>
        )}
      </button>
    );
  };

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const cargarDatosUsuario = async () => {
      if (!user?.id) {
        setCargandoInicial(false);
        return;
      }
      
      try {
        // Usar el email como nombre por defecto
        const nombrePorDefecto = user.email?.split('@')[0] || 'Usuario';
        console.log('Configurando nombre por defecto:', nombrePorDefecto);
        setUserName(nombrePorDefecto);
        
        try {
          console.log('Intentando cargar perfil para el usuario ID:', user.id);
          // Verificar si existe el perfil
          const { data: perfil, error: errorPerfil } = await supabase
            .from('profiles')
            .select('nombre')
            .eq('id', user.id)
            .maybeSingle(); // Usamos maybeSingle en lugar de single para evitar errores 404
            
          if (errorPerfil) {
            console.warn('Error al cargar el perfil del usuario:', errorPerfil);
            // Continuar con el flujo aunque falle la carga del perfil
            setCargandoInicial(false);
            return;
          }
          
          console.log('Perfil cargado:', perfil);
          
          if (perfil?.nombre) {
            console.log('Estableciendo nombre del perfil:', perfil.nombre);
            setUserName(perfil.nombre);
          }
          
        } catch (error) {
          console.warn('Error al intentar cargar el perfil:', error);
          // Continuar con el nombre por defecto si hay un error
          console.log('Usando email como nombre:', nombrePorDefecto);
        } finally {
          // Asegurarse de que siempre se quite el estado de carga inicial
          setCargandoInicial(false);
        }
      } catch (error) {
        console.error('Error al cargar perfil:', error);
        setCargandoInicial(false);
      }
    };
    
    cargarDatosUsuario();
  }, [user?.id]);

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

      // Separar partidos en categorías
      const pendientes: PartidoConJornada[] = [];
      const pronosticados: PartidoConJornada[] = [];
      const completados: PartidoConJornada[] = [];
      
      partidosProcesados.forEach(partido => {
        const pronosticoExistente = pronosticos[partido.id];
        const partidoTerminado = partido.status === 'FINISHED' || partido.status === 'IN_PLAY' || partido.status === 'PAUSED';
        const tienePronostico = pronosticoExistente && 
          (pronosticoExistente.local !== null || pronosticoExistente.visitante !== null);
        
        if (partidoTerminado) {
          completados.push(partido);
        } else if (tienePronostico) {
          pronosticados.push(partido);
        } else {
          pendientes.push(partido);
        }
      });
      
      setPartidosPendientes(pendientes);
      setPartidosPronosticados(pronosticados);
      setPartidosCompletados(completados);
      
      // Actualizar jornadas para cada categoría
      const actualizarJornadas = (partidos: PartidoConJornada[]) => {
        const tempJornadas: Record<string, boolean> = {};
        partidos.forEach(p => {
          if (p.jornada) tempJornadas[p.jornada] = true;
        });
        return tempJornadas;
      };
      
      setJornadas(actualizarJornadas(pendientes));
    }
  }, [partidos]);

  const toggleJornada = (jornada: string) => {
    setJornadas(prev => ({
      ...prev,
      [jornada]: !prev[jornada],
    }))
  }



  const renderPartido = (partido: PartidoConJornada) => {
    const pronosticoActual = pronosticos[partido.id] || { local: null, visitante: null };
    const [pronosticoEditado, setPronosticoEditado] = useState<Pronostico>({
      local: pronosticoActual.local,
      visitante: pronosticoActual.visitante
    });
    
    const estaGuardando = guardando[partido.id] || false;
    const tieneCambios = cambiosPendientes[partido.id] || false;
    
    const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value === '' ? null : parseInt(e.target.value, 10);
      actualizarPronostico(partido.id, 'local', value);
    };
    
    const handleVisitanteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value === '' ? null : parseInt(e.target.value, 10);
      actualizarPronostico(partido.id, 'visitante', value);
    };
    
    const handleGuardarClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      guardarPronostico(partido.id);
    };
    
    return (
      <div key={partido.id} className="p-4 border-b border-gray-100 last:border-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-500 truncate">
                  {partido.competition?.name || 'Partido'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-medium text-gray-900">
                    {partido.home_team}
                  </span>
                  <span className="text-gray-400">vs</span>
                  <span className="font-medium text-gray-900">
                    {partido.away_team}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={pronosticoEditado.local?.toString() || ''}
                onChange={handleLocalChange}
                className="w-16 h-10 text-center border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={estaGuardando}
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                min="0"
                value={pronosticoEditado.visitante?.toString() || ''}
                onChange={handleVisitanteChange}
                className="w-16 h-10 text-center border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={estaGuardando}
              />
            </div>
            
            {tieneCambios && (
              <button
                onClick={handleGuardarClick}
                disabled={estaGuardando}
                className={`px-3 h-10 rounded-md text-sm font-medium ${
                  estaGuardando
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {estaGuardando ? (
                  <span className="flex items-center gap-2">
                    <FaSpinner className="animate-spin" />
                    Guardando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FaSave />
                    Guardar
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          {formatearFecha(partido.fecha)}
        </div>
      </div>
    );
  };

  const actualizarPronostico = (partidoId: string, campo: 'local' | 'visitante', valor: number | null) => {
    // Validar que el valor sea un número o null
    const valorNumerico = valor === null ? null : Number(valor);
    
    // Actualizar directamente el estado de los pronósticos
    setPronosticos(prev => ({
      ...prev,
      [partidoId]: {
        ...prev[partidoId],
        [campo]: valorNumerico
      }
    }));

    // Marcar que hay cambios pendientes
    setCambiosPendientes(prev => ({
      ...prev,
      [partidoId]: true
    }));
  };

  // Cargar pronósticos existentes del usuario
  useEffect(() => {
    const cargarPronosticos = async () => {
      if (!user?.id) {
        console.log('No hay usuario autenticado para cargar pronósticos');
        return;
      }
      
      console.log('Cargando pronósticos para el usuario:', user.id);
      
      try {
        // Usar el endpoint de la API para obtener los pronósticos
        const response = await fetch(`/api/bets/${user.id}/`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error en la respuesta del servidor:', {
            status: response.status,
            statusText: response.statusText,
            errorText
          });
          
          // Si el error es 404, puede que el usuario no tenga pronósticos aún
          if (response.status === 404) {
            console.log('El usuario no tiene pronósticos guardados aún');
            setPronosticos({});
            return;
          }
          
          throw new Error(`Error al cargar pronósticos: ${response.status} ${response.statusText}`);
        }
        
        let pronosticosUsuario;
        try {
          pronosticosUsuario = await response.json();
          console.log('Respuesta del servidor:', pronosticosUsuario);
        } catch (jsonError) {
          console.error('Error al parsear la respuesta JSON:', jsonError);
          throw new Error('La respuesta del servidor no es un JSON válido');
        }
        
        // Convertir los pronósticos al formato esperado
        const pronosticosMap: Record<string, Pronostico> = {};
        
        if (Array.isArray(pronosticosUsuario)) {
          pronosticosUsuario.forEach(p => {
            if (p?.matchId) {
              pronosticosMap[p.matchId] = {
                local: p.prediccionA || null,
                visitante: p.prediccionB || null
              };
            }
          });
          console.log('Pronósticos cargados:', pronosticosMap);
        } else {
          console.log('La respuesta no es un array:', pronosticosUsuario);
        }
        
        setPronosticos(pronosticosMap);
      } catch (error) {
        console.error('Error al cargar pronósticos:', error);
        setError('No se pudieron cargar los pronósticos. Intenta recargar la página.');
      }
    };
    
    cargarPronosticos();
  }, [user?.id]);

  const guardarPronostico = async (partidoId: string) => {
    const pronostico = pronosticosEditados[partidoId];
    
    if (!pronostico) {
      setError("No hay cambios para guardar");
      return false;
    }
    
    if (!user?.id) {
      setError("Debes iniciar sesión para guardar pronósticos");
      router.push('/auth/login');
      return false;
    }
    
    // Validar que ambos pronósticos tengan valor
    if (pronostico.local === null || pronostico.visitante === null) {
      setError("Debes ingresar un valor para ambos equipos");
      return false;
    }
    
    // Validar que los valores sean números enteros no negativos
    if (!Number.isInteger(pronostico.local) || !Number.isInteger(pronostico.visitante) || 
        pronostico.local < 0 || pronostico.visitante < 0) {
      setError("Los goles deben ser números enteros no negativos");
      return false;
    }
    
    // Actualizar el estado de guardado para este partido
    setGuardando(prev => ({
      ...prev,
      [partidoId]: true
    }));
    
    setError(null);
    
    try {
      // Obtener la sesión actual
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No se pudo obtener la sesión del usuario');
      }
      
      // Usar el ID de usuario como parte del identificador de sesión
      const sessionId = `${user.id}-${Date.now()}`;
      
      const response = await fetch('/api/bets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          match_id: parseInt(partidoId, 10),
          user_id: user.id,
          session_id: sessionId, // Usamos un identificador único basado en el usuario y timestamp
          prediccion_local: pronostico.local,
          prediccion_visitante: pronostico.visitante,
          puntos: 0, // Valor por defecto hasta que termine el partido
          created_at: new Date().toISOString()
        })
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Error al guardar el pronóstico');
      }
      
      // Actualizar el estado local con el nuevo pronóstico
      setPronosticos(prev => ({
        ...prev,
        [partidoId]: {
          local: pronostico.local,
          visitante: pronostico.visitante
        }
      }));
      
      // Limpiar el estado de cambios pendientes
      setCambiosPendientes(prev => ({
        ...prev,
        [partidoId]: false
      }));
      
      // Actualizar los pronósticos editados para que coincidan con los guardados
      setPronosticosEditados(prev => ({
        ...prev,
        [partidoId]: {
          local: pronostico.local,
          visitante: pronostico.visitante
        }
      }));
      
      return true;
    } catch (error) {
      console.error('Error al guardar pronóstico:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido al guardar el pronóstico');
      return false;
    } finally {
      // Restablecer el estado de guardado para este partido
      setGuardando(prev => ({
        ...prev,
        [partidoId]: false
      }));
    }
  };
  
  const guardarPronosticos = async () => {
    if (Object.keys(pronosticos).length === 0) {
      alert("No hay pronósticos para guardar");
      return;
    }

    setCargando(true);
    
    try {
      // Guardar cada pronóstico individualmente
      const resultados = await Promise.allSettled(
        Object.entries(pronosticosEditados).map(([partidoId, pronostico]) => 
          guardarPronostico(partidoId)
        )
      );
      
      // Verificar si hubo algún error
      const errores = resultados.filter(
        (result): result is PromiseRejectedResult => result.status === 'rejected'
      );
      
      if (errores.length > 0) {
        console.error('Errores al guardar pronósticos:', errores);
        throw new Error('Algunos pronósticos no se pudieron guardar');
      }
      
      // Mostrar mensaje de éxito
      alert("¡Tus pronósticos se han guardado correctamente!");
      
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
      setCargando(false);
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

  const cargandoTotal = cargandoInicial || cargandoPartidos;
  
  if (cargandoTotal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-100">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando partidos...</p>
        </div>
      </div>
    )
  }

  // Redirigir si no hay usuario autenticado
  if (!cargandoUsuario && !user) {
    router.push('/auth/login');
    return null;
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

  // Función para manejar el cierre de sesión
  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await supabase.auth.signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setError('Error al cerrar sesión. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10 flex items-center justify-between px-4 lg:px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/images/logo.png"
                alt="Logo Quiniela"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Quiniela WWE
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-sm font-medium text-gray-700">
            Hola, {user?.user_metadata?.full_name || 'Usuario'}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <FaSignOutAlt />
            <span>Cerrar sesión</span>
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
              disabled={Object.keys(pronosticos).length === 0 || Object.values(guardando).some(v => v)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                Object.keys(pronosticos).length === 0 || Object.values(guardando).some(v => v)
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {Object.values(guardando).some(v => v) ? (
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
              const partidosJornada = partidosPendientes.filter(p => p.jornada === jornada);
              if (partidosJornada.length === 0) return null;
              
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
                          <div className="flex flex-col items-center mb-3">
                            <div className="flex justify-center w-full mb-1">
                              <span className="text-xs font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                                {partido.competicion}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400">
                              {formatearFecha(partido.fecha)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-12 gap-2 items-center">
                            {/* Equipo Local */}
                            <div className="col-span-4 flex items-center gap-2 justify-end">
                              <TeamLogo 
                                name={partido.club_a?.nombre || 'Local'}
                                logoUrl={partido.club_a?.logo}
                                bgColor={partido.club_a?.color}
                                size={40}
                              />
                              <span className="font-medium text-gray-800 truncate">
                                {partido.club_a?.nombre || 'Local'}
                              </span>
                            </div>
                            
                            {/* Inputs de goles */}
                            <div className="col-span-4 flex items-center justify-center gap-2">
                              <input
                                type="number"
                                min="0"
                                className="w-14 h-12 text-center text-lg font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                value={pronosticos[partido.id]?.local ?? ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  actualizarPronostico(
                                    partido.id, 
                                    'local', 
                                    value === "" ? null : parseInt(value, 10)
                                  );
                                }}
                                onFocus={(e) => e.target.select()}
                                aria-label={`Goles de ${partido.club_a?.nombre || 'local'}`}
                                disabled={guardando[partido.id] || false}
                              />
                              
                              <span className="text-xl font-bold w-4 text-center">-</span>
                              
                              <input
                                type="number"
                                min="0"
                                className="w-14 h-12 text-center text-lg font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                value={pronosticos[partido.id]?.visitante ?? ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  actualizarPronostico(
                                    partido.id, 
                                    'visitante', 
                                    value === "" ? null : parseInt(value, 10)
                                  );
                                }}
                                onFocus={(e) => e.target.select()}
                                aria-label={`Goles de ${partido.club_b?.nombre || 'visitante'}`}
                                disabled={guardando[partido.id] || false}
                              />
                            </div>
                            
                            {/* Equipo Visitante */}
                            <div className="col-span-4 flex items-center gap-2">
                              <span className="font-medium text-gray-800 truncate text-right">
                                {partido.club_b?.nombre || 'Visitante'}
                              </span>
                              <TeamLogo 
                                name={partido.club_b?.nombre || 'Visitante'}
                                logoUrl={partido.club_b?.logo}
                                bgColor={partido.club_b?.color}
                                size={40}
                                className="flex-shrink-0"
                              />
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

        {tabActiva === "pronosticados" && (
          <div className="space-y-4">
            {partidosPronosticados.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
                <FaCheckCircle className="mx-auto text-gray-300 text-4xl mb-3" />
                <p>No hay partidos pronosticados</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(partidosPronosticados.reduce((acc, partido) => {
                  if (!acc[partido.jornada]) {
                    acc[partido.jornada] = [];
                  }
                  acc[partido.jornada].push(partido);
                  return acc;
                }, {} as Record<string, PartidoConJornada[]>)).map(([jornada, partidosJornada]) => (
                  <div key={jornada} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div 
                      className="bg-gray-50 px-4 py-3 cursor-pointer"
                      onClick={() => toggleJornada(jornada)}
                      aria-expanded={jornadas[jornada]}
                    >
                      <h3 className="font-semibold text-gray-800">
                        {jornada}
                      </h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {partidosJornada.map(partido => (
                        <div key={partido.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col items-center mb-3">
                            <div className="flex justify-center w-full mb-1">
                              <span className="text-xs font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                                {partido.competicion}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400">
                              {formatearFecha(partido.fecha)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-4 flex items-center gap-2 justify-end">
                              <TeamLogo 
                                name={partido.club_a?.nombre || 'Local'}
                                logoUrl={partido.club_a?.logo}
                                bgColor={partido.club_a?.color}
                                size={40}
                              />
                              <span className="font-medium text-gray-800 truncate">
                                {partido.club_a?.nombre || 'Local'}
                              </span>
                            </div>
                            
                            <div className="col-span-4 flex items-center justify-center gap-2">
                              <div className="w-14 h-12 flex items-center justify-center text-lg font-bold bg-blue-50 rounded-lg">
                                {pronosticos[partido.id]?.local ?? '-'}
                              </div>
                              <span className="text-xl font-bold w-4 text-center">-</span>
                              <div className="w-14 h-12 flex items-center justify-center text-lg font-bold bg-blue-50 rounded-lg">
                                {pronosticos[partido.id]?.visitante ?? '-'}
                              </div>
                            </div>
                            
                            <div className="col-span-4 flex items-center gap-2">
                              <span className="font-medium text-gray-800 truncate text-right">
                                {partido.club_b?.nombre || 'Visitante'}
                              </span>
                              <TeamLogo 
                                name={partido.club_b?.nombre || 'Visitante'}
                                logoUrl={partido.club_b?.logo}
                                bgColor={partido.club_b?.color}
                                size={40}
                                className="flex-shrink-0"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
