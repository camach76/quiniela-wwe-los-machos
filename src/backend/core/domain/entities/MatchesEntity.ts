export interface Match {
  id: number;
  club_a_id: number;
  club_b_id: number;
  fecha: string;
  estadio: string;
  resultado_a: number | null;
  resultado_b: number | null;
  is_complete: boolean;
  created_at: string;
  
  // Propiedades opcionales para compatibilidad
  clubAId?: number;
  clubBId?: number;
  resultadoA?: number | null;
  resultadoB?: number | null;
  isComplete?: boolean;
  createdAt?: string;
}
