import { Match } from "../../domain/entities/MatchesEntity";
import { MatchRepository } from "../../domain/repositories/MatchesRepository";

export class SupabaseMatchRepository implements MatchRepository {
  constructor(private supabase: any) {}

  async getAll(): Promise<Match[]> {
    const { data, error } = await this.supabase
      .from("matches")
      .select("*")
      .order("fecha", { ascending: true });

    if (error) throw new Error(error.message);

    return data as Match[];
  }

  async getById(id: number): Promise<Match | null> {
    const { data, error } = await this.supabase
      .from("matches")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    return data as Match;
  }

  async getUpcoming(): Promise<Match[]> {
    const now = new Date().toISOString();
    const { data, error } = await this.supabase
      .from("matches")
      .select("*")
      .gte("fecha", now)
      .order("fecha", { ascending: true });

    if (error) throw new Error(error.message);

    return data as Match[];
  }

  async getCompleted(): Promise<Match[]> {
    console.log('Iniciando getCompleted...');
    try {
      console.log('Realizando consulta a Supabase...');
      const { data, error } = await this.supabase
        .from("matches")
        .select(`
          *,
          club_a:club_a_id(*),
          club_b:club_b_id(*)
        `)
        .eq('isComplete', true)
        .order("fecha", { ascending: false });
      
      console.log('Respuesta de Supabase:', { data, error });
      
      if (error) {
        console.error('Error en la consulta Supabase:', error);
        throw error;
      }
      
      // Si no hay datos, devolvemos un array vacío
      if (!data) {
        console.log('No se encontraron partidos completados');
        return [];
      }
      
      console.log(`Se encontraron ${data.length} partidos completados`);
      
      // Mapeamos los datos para asegurar que tengan el formato correcto
      const mappedData = data.map((match: any) => {
        try {
          console.log('Procesando partido:', match.id);
          const mappedMatch = {
            ...match,
            // Mantenemos compatibilidad con código existente
            clubAId: match.club_a_id,
            clubBId: match.club_b_id,
            resultadoA: match.resultado_a,
            resultadoB: match.resultado_b,
            isComplete: match.isComplete,
            createdAt: match.created_at,
            // Incluimos los datos de los clubes si están disponibles
            clubA: match.club_a ? {
              id: match.club_a.id,
              nombre: match.club_a.nombre,
              logo_url: match.club_a.logo_url,
              fondo_url: match.club_a.fondo_url || '/images/bgFifa.jpg'
            } : null,
            clubB: match.club_b ? {
              id: match.club_b.id,
              nombre: match.club_b.nombre,
              logo_url: match.club_b.logo_url,
              fondo_url: match.club_b.fondo_url || '/images/bgFifa.jpg'
            } : null
          };
          console.log('Partido mapeado:', mappedMatch);
          return mappedMatch;
        } catch (mapError) {
          console.error('Error mapeando partido:', match, mapError);
          return null;
        }
      }).filter((match: Match | null): match is Match => match !== null);
      
      console.log('Datos mapeados:', mappedData);
      return mappedData;
    } catch (error) {
      console.error('Error en getCompleted:', {
        error,
        message: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }
}
