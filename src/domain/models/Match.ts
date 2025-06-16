export interface Club {
  id: number;
  nombre: string;
  logo_url: string;
  fondo_url: string;
}

export interface Match {
  id: number;
  clubAId: number;
  clubBId: number;
  fecha: string;
  estadio: string;
  resultadoA: number | null;
  resultadoB: number | null;
  isComplete: boolean;
  createdAt: string;
  clubA?: Club;
  clubB?: Club;
}
