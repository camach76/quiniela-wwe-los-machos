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

  const actualizarPronostico = (partidoId: string, tipo: 'local' | 'visitante', valor: string | number | null) => {
    console.log(`Actualizando pronóstico - Partido: ${partidoId}, ${tipo}:`, valor);
    
    // Convertir el valor a número o null
    let valorNumerico: number | null = null;
    if (valor !== null && valor !== '' && valor !== undefined) {
      // Si es un string, convertirlo a número, si no, usar el valor directamente
      valorNumerico = typeof valor === 'string' ? parseInt(valor, 10) : valor;
      // Si el resultado es NaN (por ejemplo, si el string no es un número), usar null
      if (isNaN(valorNumerico)) {
        valorNumerico = null;
      }
    }
    
    console.log(`Valor convertido para ${tipo}:`, valorNumerico);
    
    setPronosticos(prev => {
      const nuevoEstado = {
        ...prev,
        [partidoId]: {
          ...prev[partidoId],
          [tipo]: valorNumerico
        }
      };
      console.log('Nuevo estado de pronosticos:', nuevoEstado);
      return nuevoEstado;
    });
    
    setPronosticosEditados(prev => {
      const nuevoEstado = {
        ...prev,
        [partidoId]: {
          ...prev[partidoId],
          [tipo]: valorNumerico
        }
      };
      console.log('Nuevo estado de pronosticosEditados:', nuevoEstado);
      return nuevoEstado;
    });
    
    setCambiosPendientes(prev => ({
      ...prev,
      [partidoId]: true
    }));
    
    console.log(`Marcado partido ${partidoId} con cambios pendientes`);
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
    console.log('Iniciando guardarPronostico para partido:', partidoId);
    console.log('pronosticosEditados:', pronosticosEditados);
    
    const pronostico = pronosticosEditados[partidoId];
    console.log('Pronóstico a guardar (antes de validar):', pronostico);
    
    if (!pronostico) {
      const errorMsg = "No hay cambios para guardar";
      console.error(errorMsg);
      setError(errorMsg);
      return false;
    }
    
    if (!user?.id) {
      const errorMsg = "Debes iniciar sesión para guardar pronósticos";
      console.error(errorMsg);
      setError(errorMsg);
      router.push('/auth/login');
      return false;
    }
    
    // Función para convertir valores a número o null
    const parseScore = (value: any): number | null => {
      if (value === null || value === undefined || value === '') {
        return null;
      }
      const num = Number(value);
      return isNaN(num) ? null : Math.max(0, Math.floor(num));
    };
    
    // Obtener los valores convertidos
    const local = parseScore(pronostico.local);
    const visitante = parseScore(pronostico.visitante);
    
    console.log('Valores procesados para guardar:', { local, visitante });
    
    // Validar que ambos pronósticos tengan valor
    if (local === null || visitante === null) {
      const errorMsg = `Debes ingresar un valor válido para ambos equipos`;
      console.error(errorMsg);
      setError(errorMsg);
      return false;
    }
    
    // Verificar si ya existe una apuesta para este partido y usuario
    const matchId = parseInt(partidoId, 10);
    if (isNaN(matchId)) {
      const errorMsg = `ID de partido inválido: ${partidoId}`;
      console.error(errorMsg);
      setError(errorMsg);
      return false;
    }
    
    console.log('Validaciones pasadas, procediendo a guardar...');
    
    // Actualizar el estado de guardado para este partido
    setGuardando(prev => ({
      ...prev,
      [partidoId]: true
    }));
    
    setError(null);
    
    try {
      console.log('Obteniendo sesión de Supabase...');
      // Obtener la sesión actual
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error al obtener la sesión:', sessionError);
        throw sessionError;
      }
      
      if (!session) {
        const errorMsg = 'No se pudo obtener la sesión del usuario';
        console.error(errorMsg);
        throw new Error(errorMsg);
      }
      
      // Verificar si ya existe un pronóstico para este partido
      const existingBetResponse = await fetch(`/api/bets?matchId=${matchId}&userId=${user.id}`);
      let response, responseData;
      
      if (existingBetResponse.ok) {
        const existingBet = await existingBetResponse.json();
        
        if (existingBet) {
          // Actualizar pronóstico existente
          console.log('Actualizando pronóstico existente:', existingBet.id);
          response = await fetch(`/api/bets/${existingBet.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prediccion_a: local,
              prediccion_b: visitante
            })
          });
        } else {
          // Crear nuevo pronóstico
          console.log('Creando nuevo pronóstico');
          response = await fetch('/api/bets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              match_id: matchId,
              user_id: user.id,
              prediccion_a: local,
              prediccion_b: visitante,
              puntos: 0
            })
          });
        }
        
        responseData = await response.json();
        console.log('Respuesta del servidor:', responseData);
        
        if (!response.ok) {
          const errorMsg = responseData?.error || 'Error al guardar el pronóstico';
          console.error('Error en la respuesta del servidor:', errorMsg);
          throw new Error(errorMsg);
        }
        
        console.log('Pronóstico guardado exitosamente, actualizando estado local...');
        
        // Actualizar el estado local con el nuevo pronóstico
        setPronosticos(prev => ({
          ...prev,
          [partidoId]: {
            local,
            visitante
          }
        }));
        
        // Limpiar los cambios pendientes para este partido
        setCambiosPendientes(prev => ({
          ...prev,
          [partidoId]: false
        }));
        
        // Limpiar el estado de edición para este partido
        setPronosticosEditados(prev => {
          const newState = { ...prev };
          delete newState[partidoId];
          return newState;
        });
        
        console.log('Estado actualizado correctamente');
        return true;
      } else {
        throw new Error('No se pudo verificar el pronóstico existente');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido al guardar el pronóstico';
      console.error('Error en guardarPronostico:', error);
      setError(errorMsg);
      
      // Limpiar el error después de 5 segundos
      setTimeout(() => {
        setError(null);
      }, 5000);
      
      return false;
    } finally {
      // Restablecer el estado de guardado
      setGuardando(prev => ({
        ...prev,
        [partidoId]: false
      }));
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
  };

  // Verifica si un partido ya comenzó comparando la fecha actual con la fecha del partido
  const partidoYaComenzo = (fechaPartido: string) => {
    const ahora = new Date();
    const fechaPartidoObj = new Date(fechaPartido);
    return ahora >= fechaPartidoObj;
  };

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
              onClick={() => {
                // Guardar todos los pronósticos con cambios pendientes
                const promises = Object.entries(pronosticosEditados).map(([partidoId]) => 
                  guardarPronostico(partidoId)
                );
                
                Promise.allSettled(promises)
                  .then(results => {
                    const errores = results.filter(r => r.status === 'rejected');
                    if (errores.length > 0) {
                      console.error('Algunos pronósticos no se pudieron guardar:', errores);
                      setError('Algunos pronósticos no se pudieron guardar. Por favor, inténtalo de nuevo.');
                    } else {
                      console.log('Todos los pronósticos se guardaron correctamente');
                    }
                  });
              }}
              disabled={Object.keys(pronosticosEditados).length === 0 || Object.values(guardando).some(v => v)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                Object.keys(pronosticosEditados).length === 0 || Object.values(guardando).some(v => v)
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
                                className={`w-14 h-12 text-center text-lg font-bold border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                                  partidoYaComenzo(partido.fecha) 
                                    ? 'border-gray-200 bg-gray-50 text-gray-400' 
                                    : 'border-gray-300 text-gray-800'
                                }`}
                                value={pronosticos[partido.id]?.local ?? ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  actualizarPronostico(
                                    partido.id, 
                                    'local', 
                                    value === "" ? null : value
                                  );
                                }}
                                onFocus={(e) => e.target.select()}
                                aria-label={`Goles de ${partido.club_a?.nombre || 'local'}`}
                                disabled={guardando[partido.id] || partidoYaComenzo(partido.fecha)}
                              />
                              
                              <span className="text-xl font-bold w-4 text-center">-</span>
                              
                              <input
                                type="number"
                                min="0"
                                className={`w-14 h-12 text-center text-lg font-bold border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                                  partidoYaComenzo(partido.fecha) 
                                    ? 'border-gray-200 bg-gray-50 text-gray-400' 
                                    : 'border-gray-300 text-gray-800'
                                }`}
                                value={pronosticos[partido.id]?.visitante ?? ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  actualizarPronostico(
                                    partido.id, 
                                    'visitante', 
                                    value === "" ? null : value
                                  );
                                }}
                                onFocus={(e) => e.target.select()}
                                aria-label={`Goles de ${partido.club_b?.nombre || 'visitante'}`}
                                disabled={guardando[partido.id] || partidoYaComenzo(partido.fecha)}
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
                            <div className="flex justify-center w-full mb-1 gap-2">
                              <span className="text-xs font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                                {partido.competicion}
                              </span>
                              {partidoYaComenzo(partido.fecha) && (
                                <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-200">
                                  En juego / Terminado
                                </span>
                              )}
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
                              {partidoYaComenzo(partido.fecha) ? (
                                <>
                                  <div className="w-14 h-12 flex items-center justify-center text-lg font-bold bg-blue-50 rounded-lg">
                                    {pronosticos[partido.id]?.local ?? '-'}
                                  </div>
                                  <span className="text-xl font-bold w-4 text-center">-</span>
                                  <div className="w-14 h-12 flex items-center justify-center text-lg font-bold bg-blue-50 rounded-lg">
                                    {pronosticos[partido.id]?.visitante ?? '-'}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <input
                                    type="number"
                                    min="0"
                                    className="w-14 h-12 text-center text-lg font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    value={pronosticos[partido.id]?.local ?? ''}
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
                                    value={pronosticos[partido.id]?.visitante ?? ''}
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
                                </>
                              )}
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
                          
                          <div className="mt-3 flex justify-end">
                            {!partidoYaComenzo(partido.fecha) ? (
                              <button
                                onClick={async () => {
                                  console.log('Iniciando onClick del botón de guardar');
                                  
                                  // Crear el objeto de pronóstico actualizado
                                  const pronosticoActualizado = {
                                    local: pronosticos[partido.id]?.local ?? null,
                                    visitante: pronosticos[partido.id]?.visitante ?? null
                                  };
                                  
                                  console.log('Actualizando pronosticosEditados con:', pronosticoActualizado);
                                  
                                  // Actualizar pronosticosEditados
                                  setPronosticosEditados(prev => ({
                                    ...prev,
                                    [partido.id]: pronosticoActualizado
                                  }));
                                  
                                  // Marcar cambios como pendientes
                                  setCambiosPendientes(prev => ({
                                    ...prev,
                                    [partido.id]: true
                                  }));
                                  
                                  // Esperar a que se actualice el estado
                                  await new Promise(resolve => setTimeout(resolve, 0));
                                  
                                  // Llamar a guardarPronostico
                                  console.log('Llamando a guardarPronostico...');
                                  const resultado = await guardarPronostico(partido.id);
                                  console.log('Resultado de guardarPronostico:', resultado);
                                }}
                                disabled={guardando[partido.id]}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  guardando[partido.id]
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                              >
                                {guardando[partido.id] ? (
                                  <span className="flex items-center gap-2">
                                    <FaSpinner className="animate-spin" />
                                    Guardando...
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-2">
                                    <FaSave />
                                    Guardar cambios
                                  </span>
                                )}
                              </button>
                            ) : (
                              <div className="text-sm text-gray-500 italic">
                                No se pueden modificar los pronósticos una vez iniciado el partido
                              </div>
                            )}
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
