import { useState, useEffect } from 'react';
import { Bet } from '@/backend/core/domain/entities/betEntity';
import { BetRepository } from '@/backend/core/domain/repositories/BetRepository';
import { SupabaseBetRepository } from '@/backend/core/infra/repositories/SupabaseBetRepository';

export function useBets(userId: string) {
  const [bets, setBets] = useState<Record<string, Bet>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [betRepo] = useState<BetRepository>(new SupabaseBetRepository());

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
      
      const now = new Date().toISOString();
      const betData: Bet = {
        id: 0, // Se generará automáticamente en la base de datos
        userId,
        matchId,
        prediccionA,
        prediccionB,
        puntosObtenidos: 0, // Se actualizará cuando se calcule el resultado
        createdAt: now,
        updatedAt: now,
      };
      
      // Verificar si ya existe una apuesta para este partido
      const existingBet = Object.values(bets).find(bet => bet.matchId === matchId);
      
      if (existingBet) {
        // Actualizar apuesta existente
        const updatedBet: Bet = {
          ...existingBet, // Mantener todas las propiedades existentes
          prediccionA,
          prediccionB,
          updatedAt: new Date().toISOString(),
        };
        await betRepo.update(updatedBet);
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
