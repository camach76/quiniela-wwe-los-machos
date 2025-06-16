export interface Bet {
  id: number;
  userId: string;
  matchId: number;
  prediccionA: number;
  prediccionB: number;
  puntosObtenidos: number;
  createdAt: string;
  updatedAt: string;
}
