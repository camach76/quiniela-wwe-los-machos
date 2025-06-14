export interface Match {
  id: number;
  clubAId: number;
  clubBId: number;
  fecha: string; // o Date si preferís trabajar con objetos
  estadio: string;
  resultadoA: number | null;
  resultadoB: number | null;
  createdAt: string;
}
