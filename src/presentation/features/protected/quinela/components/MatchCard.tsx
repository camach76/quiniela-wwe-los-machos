import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Match } from '../../../../../presentation/hooks/useCompletedMatches';
import { useBets } from '../hooks/useBets';
import { betService } from '../services/betService';

interface MatchCardProps {
  match: Match;
  userId: string;
  onBetSaved?: () => void;
}

export function MatchCard({ match, userId, onBetSaved }: MatchCardProps) {
  const [local, setLocal] = useState(0);
  const [visitante, setVisitante] = useState(0);
  const { saveBet, isSaving, error } = useBets(userId);

  // Cargar apuesta existente si existe
  useEffect(() => {
    const loadExistingBet = async () => {
      try {
        const bet = await betService.getBetByMatchAndUser(match.id, userId);
        if (bet) {
          setLocal(bet.prediccion_a);
          setVisitante(bet.prediccion_b);
        }
      } catch (err) {
        console.error('Error al cargar apuesta existente:', err);
      }
    };

    if (userId) {
      loadExistingBet();
    }
  }, [match.id, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const savedBet = await saveBet(match.id, local, visitante);
    if (savedBet && onBetSaved) {
      onBetSaved();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-center flex-1">
          <div className="font-semibold">{match.clubA?.nombre || 'Equipo Local'}</div>
          <div className="relative h-16 w-16 mx-auto my-2">
            <Image 
              src={match.clubA?.logo_url || '/images/default-logo.png'} 
              alt={match.clubA?.nombre || 'Local'} 
              fill
              className="object-contain"
              sizes="4rem"
            />
          </div>
        </div>
        
        <div className="text-2xl font-bold mx-4">VS</div>
        
        <div className="text-center flex-1">
          <div className="font-semibold">{match.clubB?.nombre || 'Equipo Visitante'}</div>
          <div className="relative h-16 w-16 mx-auto my-2">
            <Image 
              src={match.clubB?.logo_url || '/images/default-logo.png'} 
              alt={match.clubB?.nombre || 'Visitante'} 
              fill
              className="object-contain"
              sizes="4rem"
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex justify-center items-center gap-4 mb-4">
          <input
            type="number"
            min="0"
            value={local}
            onChange={(e) => setLocal(parseInt(e.target.value) || 0)}
            className="w-16 h-12 text-center border rounded"
            disabled={isSaving}
          />
          <span className="text-xl">-</span>
          <input
            type="number"
            min="0"
            value={visitante}
            onChange={(e) => setVisitante(parseInt(e.target.value) || 0)}
            className="w-16 h-12 text-center border rounded"
            disabled={isSaving}
          />
        </div>
        
        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? 'Guardando...' : 'Guardar Pronóstico'}
        </button>
        
        {error && (
          <div className="mt-2 text-red-600 text-sm">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
