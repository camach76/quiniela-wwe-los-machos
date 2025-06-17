import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export interface Bet {
  id?: number;
  match_id: number;
  user_id: string;
  prediccion_a: number;
  prediccion_b: number;
  puntos?: number;
  created_at?: string;
  updated_at?: string;
}

export class BetService {
  private supabase = createClientComponentClient();

  async getBetByMatchAndUser(matchId: number, userId: string): Promise<Bet | null> {
    const { data, error } = await this.supabase
      .from('bets')
      .select('*')
      .eq('match_id', matchId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error al obtener la apuesta:', error);
      throw new Error('Error al cargar la apuesta');
    }

    return data || null;
  }

  async createBet(bet: Omit<Bet, 'id' | 'puntos' | 'created_at' | 'updated_at'>): Promise<Bet> {
    const { data, error } = await this.supabase
      .from('bets')
      .insert([{
        ...bet,
        puntos: 0
      }])
      .select()
      .single();

    if (error) {
      console.error('Error al crear la apuesta:', error);
      throw new Error('Error al guardar la apuesta');
    }

    return data;
  }

  async updateBet(betId: number, updates: Partial<Bet>): Promise<Bet> {
    const { data, error } = await this.supabase
      .from('bets')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', betId)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar la apuesta:', error);
      throw new Error('Error al actualizar la apuesta');
    }

    return data;
  }

  async getByUser(userId: string): Promise<Bet[]> {
    const { data, error } = await this.supabase
      .from('bets')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error al obtener las apuestas del usuario:', error);
      throw new Error('Error al cargar las apuestas');
    }

    return data || [];
  }
}

export const betService = new BetService();
