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

    // Si es modo soloHoy, ya están filtrados por fecha, solo ordenamos
    if (soloHoy) {
      return [...matches].sort((a, b) => 
        new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      );
    }

    // Si no es modo soloHoy, aplicamos el filtro por fecha
    const ahora = new Date();
    return matches
      .filter(partido => {
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
      })
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }, [matches, tipo, soloHoy]);

  // Aplicar límite de items
  const partidosAMostrar = useMemo(() => {
    return partidosFiltrados.slice(0, maxItems);
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
        {!soloHoy && (
          <p className="text-sm text-gray-400 mt-2">
            Total de partidos cargados: {matches.length}
          </p>
        )}
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