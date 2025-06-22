import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { Match, MatchWithClubs } from '../types/match';

const supabase = createClientComponentClient<Database>();

export const matchAdminService = {
  // Obtener todos los partidos con información de los clubes
  async getMatches(): Promise<MatchWithClubs[]> {
    const { data: matches, error } = await supabase
      .from('matches')
      .select(`
        *,
        club_a:club_a_id (id, nombre, logo_url),
        club_b:club_b_id (id, nombre, logo_url)
      `)
      .order('fecha', { ascending: true });

    if (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }

    // Mapear los datos para que coincidan con nuestro tipo
    return matches.map(match => ({
      ...match,
      club_a_id: match.club_a_id,
      club_b_id: match.club_b_id,
      club_a_nombre: match.club_a?.nombre || 'Equipo A',
      club_b_nombre: match.club_b?.nombre || 'Equipo B',
      club_a_escudo: match.club_a?.logo_url || '/default-shield.png',
      club_b_escudo: match.club_b?.logo_url || '/default-shield.png',
      resultado_a: match.resultado_a,
      resultado_b: match.resultado_b,
      is_complete: match.is_complete,
      created_at: match.created_at,
      updated_at: match.updated_at || new Date().toISOString()
    }));
  },

  // Actualizar el resultado de un partido
  async updateMatchResult(
    matchId: number,
    resultado_a: number | null,
    resultado_b: number | null
  ): Promise<Match> {
    try {
      // Crear objeto con los campos a actualizar
      const updateData = {
        resultado_a,
        resultado_b,
        isComplete: resultado_a !== null && resultado_b !== null
      };
      
      console.log('Actualizando partido con datos:', { matchId, updateData });
      
      const { data, error } = await supabase
        .from('matches')
        .update(updateData)
        .eq('id', matchId)
        .select('*')
        .single();

      if (error) {
        console.error('Error en la respuesta de Supabase:', error);
        throw new Error(`Error al actualizar el partido: ${error.message}`);
      }

      console.log('Partido actualizado exitosamente:', data);
      return data;
    } catch (error) {
      console.error('Error en updateMatchResult:', error);
      throw error;
    }
  },

  // Reiniciar el resultado de un partido
  async resetMatchResult(matchId: number): Promise<Match> {
    try {
      const updateData = {
        resultado_a: null,
        resultado_b: null,
        isComplete: false
      };
      
      console.log('Reiniciando partido con datos:', { matchId, updateData });
      
      const { data, error } = await supabase
        .from('matches')
        .update(updateData)
        .eq('id', matchId)
        .select('*')
        .single();

      if (error) {
        console.error('Error en la respuesta de Supabase (reset):', error);
        throw new Error(`Error al reiniciar el partido: ${error.message}`);
      }

      console.log('Partido reiniciado exitosamente:', data);
      return data;
    } catch (error) {
      console.error('Error en resetMatchResult:', error);
      throw error;
    }
  },

  // Actualizar solo el estado de completado de un partido
  async updateMatchCompletion(matchId: number, isComplete: boolean): Promise<Match> {
    try {
      console.log('Actualizando estado de completado:', { matchId, isComplete });
      
      const { data, error } = await supabase
        .from('matches')
        .update({ isComplete })
        .eq('id', matchId)
        .select('*')
        .single();

      if (error) {
        console.error('Error en la respuesta de Supabase (update completion):', error);
        throw new Error(`Error al actualizar el estado del partido: ${error.message}`);
      }

      console.log('Estado de completado actualizado exitosamente:', data);
      return data;
    } catch (error) {
      console.error('Error en updateMatchCompletion:', error);
      throw error;
    }
  }
};
