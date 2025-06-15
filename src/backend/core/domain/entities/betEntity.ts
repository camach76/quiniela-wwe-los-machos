export interface Bet {
  id: number;
  userId: string;
  matchId: number;
  prediccion_a: number;
  prediccion_b: number;
  puntosObtenidos: number;
  createdAt: string;
  updatedAt: string;
}
