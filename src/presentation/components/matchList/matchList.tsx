import React, { useEffect, useMemo } from 'react';
import { useUpcomingMatches } from '@/presentation/hooks/useUpcomingMatches';
import { toast } from 'react-hot-toast';
import { MatchCard } from '../matchCard/matchCard';

interface MatchesListProps {
  className?: string;
  tipo?: 'proximos' | 'completados';
  soloHoy?: boolean;
  maxItems?: number;
}

export const MatchesList: React.FC<MatchesListProps> = ({
  className = '',
  tipo = 'proximos',
  soloHoy = false,
  maxItems = Infinity
}) => {
  const fechaFiltro = soloHoy ? new Date() : undefined;
  const { matches, loading, error } = useUpcomingMatches(fechaFiltro);

  // Debug: Mostrar datos recibidos
  useEffect(() => {
    console.log('Datos de partidos recibidos:', matches);
  }, [matches]);

  // Filtrar partidos según el tipo (solo si no estamos en modo soloHoy)
  const partidosFiltrados = useMemo(() => {
    if (!matches || matches.length === 0) {
      console.log('No hay partidos o matches es undefined');
      return [];
    }

    console.log('Filtrando partidos. Tipo:', tipo, 'Total partidos:', matches.length);
    
    // Si es modo soloHoy, filtramos por la fecha de hoy
    if (soloHoy) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      const partidosHoy = matches.filter(partido => {
        try {
          const fechaPartido = new Date(partido.fecha);
          return (
            fechaPartido.getFullYear() === hoy.getFullYear() &&
            fechaPartido.getMonth() === hoy.getMonth() &&
            fechaPartido.getDate() === hoy.getDate()
          );
        } catch (err) {
          console.error('Error al procesar partido:', partido, err);
          return false;
        }
      });
      
      console.log('Partidos de hoy:', partidosHoy.length);
      return partidosHoy.sort((a, b) => 
        new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      );
    }

    // Si no es modo soloHoy, aplicamos el filtro por tipo (próximos o completados)
    const ahora = new Date();
    const partidosFiltrados = matches.filter(partido => {
      try {
        if (!partido.fecha) {
          console.warn('Partido sin fecha:', partido);
          return false;
        }
        const fechaPartido = new Date(partido.fecha);
        return tipo === 'proximos' 
          ? fechaPartido >= ahora 
          : fechaPartido < ahora;
      } catch (err) {
        console.error('Error al procesar partido:', partido, err);
        return false;
      }
    });
    
    console.log(`Partidos ${tipo}:`, partidosFiltrados.length);
    return partidosFiltrados.sort((a, b) => 
      new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );
  }, [matches, tipo, soloHoy]);

  // Aplicar límite de items
  const partidosAMostrar = useMemo(() => {
    console.log('Partidos a mostrar (antes de limitar):', partidosFiltrados);
    const resultado = partidosFiltrados.slice(0, maxItems);
    console.log('Partidos a mostrar (después de limitar):', resultado);
    return resultado;
  }, [partidosFiltrados, maxItems]);

  // Mostrar errores
  useEffect(() => {
    if (error) {
      console.error('Error en MatchesList:', error);
      toast.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(Math.min(3, maxItems))].map((_, i) => (
          <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!matches) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error al cargar los partidos</p>
      </div>
    );
  }

  if (partidosFiltrados.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          {soloHoy
            ? 'No hay partidos programados para hoy'
            : tipo === 'proximos' 
              ? 'No hay partidos próximos programados' 
              : 'No hay partidos recientes para mostrar'}
        </p>
        <div className="text-sm text-gray-400 mt-2 space-y-1">
          <p>Total de partidos cargados: {matches.length}</p>
          <p>Partidos filtrados: {partidosFiltrados.length}</p>
          <p>Hora actual: {new Date().toISOString()}</p>
        </div>
        <div className="mt-4 text-left max-w-md mx-auto p-4 bg-gray-50 rounded-lg">
          <p className="font-medium mb-2">Primeros 3 partidos:</p>
          {matches.slice(0, 3).map((p, i) => (
            <div key={i} className="text-xs text-gray-600 mb-1">
              {p.clubA?.nombre || 'Equipo Local'} vs {p.clubB?.nombre || 'Equipo Visitante'} - {new Date(p.fecha).toLocaleString()}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {partidosAMostrar.map((partido) => {
        try {
          // Transformar los datos al formato que espera MatchCard
          const datosPartido = {
            id: partido.id,
            fecha: partido.fecha,
            estadio: partido.estadio || 'Estadio no especificado',
            local: {
              nombre: partido.clubA?.nombre || 'Equipo Local',
              logo: partido.clubA?.logo_url || '/images/placeholder-team.png',
              fondo: partido.clubA?.fondo_url || '/images/bgFifa.jpg'
            },
            visitante: {
              nombre: partido.clubB?.nombre || 'Equipo Visitante',
              logo: partido.clubB?.logo_url || '/images/placeholder-team.png',
              fondo: partido.clubB?.fondo_url || '/images/bgFifa.jpg'
            },
            resultado: {
              local: partido.resultadoA,
              visitante: partido.resultadoB
            }
          };

          return <MatchCard key={partido.id} {...datosPartido} />;
        } catch (err) {
          console.error('Error al renderizar partido:', partido, err);
          return null;
        }
      })}
    </div>
  );
};