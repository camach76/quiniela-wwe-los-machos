import { useState, useEffect } from 'react';
import { Bet } from '@/backend/core/domain/entities/betEntity';
import { BetRepository } from '@/backend/core/domain/repositories/BetRepository';
import { SupabaseBetRepository } from '@/backend/core/infra/repositories/SupabaseBetRepository';
import { supabase } from '@/presentation/utils/supabase/client';

export function useBets(userId: string) {
  const [bets, setBets] = useState<Record<string, Bet>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [betRepo] = useState<BetRepository>(new SupabaseBetRepository(supabase));

  // Cargar las apuestas del usuario
  const loadUserBets = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const userBets = await betRepo.getByUser(userId);
      
      // Convertir el array a un objeto con matchId como clave para un acceso más rápido
      const betsMap = userBets.reduce<Record<string, Bet>>((acc, bet) => {
        acc[bet.matchId] = bet;
        return acc;
      }, {});
      
      setBets(betsMap);
      setError(null);
    } catch (err) {
      console.error('Error loading user bets:', err);
      setError('Error al cargar las apuestas');
    } finally {
      setLoading(false);
    }
  };

  // Guardar o actualizar una apuesta
  const saveBet = async (matchId: number, prediccionA: number, prediccionB: number) => {
    try {
      setLoading(true);
      
      const betData = {
        userId,
        matchId,
        prediccionA,
        prediccionB,
        puntosObtenidos: 0, // Se actualizará cuando se calcule el resultado
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Verificar si ya existe una apuesta para este partido
      const existingBet = Object.values(bets).find(bet => bet.matchId === matchId);
      
      if (existingBet) {
        // Actualizar apuesta existente
        await betRepo.update({
          id: existingBet.id,
          userId: existingBet.userId,
          matchId: existingBet.matchId,
          prediccionA,
          prediccionB,
          puntosObtenidos: existingBet.puntosObtenidos,
          updatedAt: new Date().toISOString(),
        });
      } else {
        // Crear nueva apuesta
        await betRepo.create(betData);
      }
      
      // Recargar las apuestas
      await loadUserBets();
      return true;
    } catch (err) {
      console.error('Error saving bet:', err);
      setError('Error al guardar la apuesta');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cargar las apuestas al montar el componente
  useEffect(() => {
    loadUserBets();
  }, [userId]);

  return {
    bets,
    loading,
    error,
    saveBet,
    loadUserBets,
  };
}
