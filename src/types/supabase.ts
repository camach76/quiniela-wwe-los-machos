export interface Database {
  public: {
    Tables: {
      bets: {
        Row: {
          id: string;
          user_id: string;
          match_id: string;
          prediccion_a: number | null;
          prediccion_b: number | null;
          puntos_obtenidos: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          match_id: string;
          prediccion_a?: number | null;
          prediccion_b?: number | null;
          puntos_obtenidos?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          match_id?: string;
          prediccion_a?: number | null;
          prediccion_b?: number | null;
          puntos_obtenidos?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          role: 'admin' | 'user';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: 'admin' | 'user';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'admin' | 'user';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
