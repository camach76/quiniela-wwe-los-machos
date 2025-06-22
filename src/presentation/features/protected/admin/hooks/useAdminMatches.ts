import { useState, useEffect, useCallback } from 'react';
import { matchAdminService } from '../services/matchAdminService';
import { Match, MatchWithClubs } from '../types/match';

export const useAdminMatches = () => {
  const [matches, setMatches] = useState<MatchWithClubs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMatch, setEditingMatch] = useState<MatchWithClubs | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar partidos
  const loadMatches = useCallback(async () => {
    try {
      setLoading(true);
      const data = await matchAdminService.getMatches();
      setMatches(data);
      setError(null);
    } catch (err) {
      console.error('Error loading matches:', err);
      setError('Error al cargar los partidos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  // Actualizar resultado de un partido
  const updateMatchResult = useCallback(async (
    matchId: number,
    resultado_a: number | null,
    resultado_b: number | null
  ) => {
    try {
      console.log('Iniciando actualización de partido:', { matchId, resultado_a, resultado_b });
      setIsSubmitting(true);
      
      const updatedMatch = await matchAdminService.updateMatchResult(
        matchId,
        resultado_a,
        resultado_b
      );
      
      console.log('Partido actualizado en servicio, actualizando estado local...');
      
      setMatches(prev => {
        const updated = prev.map(match => 
          match.id === matchId 
            ? { 
                ...match, 
                ...updatedMatch, 
                isComplete: resultado_a !== null && resultado_b !== null 
              } 
            : match
        );
        console.log('Estado local actualizado:', updated);
        return updated;
      });
      
      setEditingMatch(null);
      console.log('Actualización completada exitosamente');
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al actualizar el partido';
      console.error('Error actualizando partido:', errorMessage, err);
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Reiniciar resultado de un partido
  const resetMatchResult = useCallback(async (matchId: number) => {
    try {
      console.log('Iniciando reinicio de partido:', { matchId });
      setIsSubmitting(true);
      
      const updatedMatch = await matchAdminService.resetMatchResult(matchId);
      
      console.log('Partido reiniciado en servicio, actualizando estado local...');
      
      setMatches(prev => {
        const updated = prev.map(match => 
          match.id === matchId 
            ? { 
                ...match, 
                resultado_a: null, 
                resultado_b: null, 
                isComplete: false 
              } 
            : match
        );
        console.log('Estado local actualizado (reinicio):', updated);
        return updated;
      });
      
      console.log('Reinicio completado exitosamente');
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al reiniciar el partido';
      console.error('Error reiniciando partido:', errorMessage, err);
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Refrescar la lista de partidos
  const refreshMatches = useCallback(async () => {
    await loadMatches();
  }, [loadMatches]);

  // Actualizar el estado de completado de un partido
  const toggleMatchCompletion = useCallback(async (matchId: number, isComplete: boolean) => {
    try {
      console.log('Cambiando estado de completado:', { matchId, isComplete });
      const updatedMatch = await matchAdminService.updateMatchCompletion(matchId, isComplete);
      
      setMatches(prev => 
        prev.map(match => 
          match.id === matchId 
            ? { ...match, isComplete } 
            : match
        )
      );
      
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al actualizar el estado del partido';
      console.error('Error actualizando estado de completado:', errorMessage, err);
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }, []);

  return {
    matches,
    loading,
    error,
    editingMatch,
    isSubmitting,
    setEditingMatch,
    updateMatchResult,
    resetMatchResult,
    toggleMatchCompletion,
    refreshMatches,
  };
};
