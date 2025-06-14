export interface Club {
  id: string;
  nombre: string;
  logo: string;
  color?: string;
  pais?: string;
}

export interface Partido {
  id: string;
  fecha: string;
  status: string;
  estadio?: string;
  club_a: Club;
  club_b: Club;
  goles_local?: number | null;
  goles_visitante?: number | null;
}
