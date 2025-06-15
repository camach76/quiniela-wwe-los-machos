import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { betService } from '../services/betService';
import type { Bet } from '../services/betService';

export const useBets = (userId: string) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveBet = useCallback(async (matchId: number, local: number, visitante: number): Promise<Bet | null> => {
    if (!userId) {
      const errorMsg = 'Usuario no autenticado';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    setIsSaving(true);
    setError(null);

    try {
      // Buscar si ya existe una apuesta para este partido y usuario
      const existingBet = await betService.getBetByMatchAndUser(matchId, userId);
      let result: Bet;

      if (existingBet?.id) {
        // Actualizar apuesta existente
        console.log('Actualizando apuesta existente:', existingBet.id);
        result = await betService.updateBet(existingBet.id, {
          prediccion_a: local,
          prediccion_b: visitante
        });
      } else {
        // Crear nueva apuesta
        console.log('Creando nueva apuesta');
        result = await betService.createBet({
          match_id: matchId,
          user_id: userId,
          prediccion_a: local,
          prediccion_b: visitante
        });
      }

      toast.success('Pronóstico guardado correctamente');
      return result;
    } catch (err) {
      console.error('Error al guardar el pronóstico:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar el pronóstico';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [userId]);

  return {
    saveBet,
    isSaving,
    error
  } as const;
};
