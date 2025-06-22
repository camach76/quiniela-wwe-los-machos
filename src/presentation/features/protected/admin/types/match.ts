export interface Match {
  id: number;
  club_a_id: number;
  club_b_id: number;
  fecha: string;
  estadio: string;
  resultado_a: number | null;
  resultado_b: number | null;
  isComplete: boolean;
  created_at: string;
  
  // Propiedades opcionales para compatibilidad
  clubAId?: number;
  clubBId?: number;
  resultadoA?: number | null;
  resultadoB?: number | null;
  // Mantenemos is_complete como opcional para compatibilidad hacia atrás
  is_complete?: boolean;
  updated_at?: string;
  
  // Propiedades para la UI
  club_a_nombre?: string;
  club_b_nombre?: string;
  club_a_escudo?: string;
  club_b_escudo?: string;
}

export type MatchStatus = 'scheduled' | 'completed';

export interface MatchWithClubs extends Match {
  club_a_nombre: string;
  club_b_nombre: string;
  club_a_escudo: string;
  club_b_escudo: string;
}
