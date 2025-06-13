export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      bets: {
        Row: {
          created_at: string;
          id: number;
          match_id: number;
          prediccion_a: number;
          prediccion_b: number;
          puntos_obtenidos: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          match_id: number;
          prediccion_a: number;
          prediccion_b: number;
          puntos_obtenidos?: number | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          match_id?: number;
          prediccion_a?: number;
          prediccion_b?: number;
          puntos_obtenidos?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bets_match_id_fkey";
            columns: ["match_id"];
            isOneToOne: false;
            referencedRelation: "matches";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bets_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      club_ranking: {
        Row: {
          dg: number | null;
          e: number | null;
          forma: string[] | null;
          g: number | null;
          gc: number | null;
          gf: number | null;
          p: number | null;
          pj: number | null;
          pts: number | null;
          puntaje_total: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          dg?: number | null;
          e?: number | null;
          forma?: string[] | null;
          g?: number | null;
          gc?: number | null;
          gf?: number | null;
          p?: number | null;
          pj?: number | null;
          pts?: number | null;
          puntaje_total?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          dg?: number | null;
          e?: number | null;
          forma?: string[] | null;
          g?: number | null;
          gc?: number | null;
          gf?: number | null;
          p?: number | null;
          pj?: number | null;
          pts?: number | null;
          puntaje_total?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ranking_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      clubs: {
        Row: {
          id: number;
          logo_url: string;
          nombre: string;
          pais: string;
        };
        Insert: {
          id?: number;
          logo_url: string;
          nombre: string;
          pais: string;
        };
        Update: {
          id?: number;
          logo_url?: string;
          nombre?: string;
          pais?: string;
        };
        Relationships: [];
      };
      matches: {
        Row: {
          club_a_id: number;
          club_b_id: number;
          created_at: string;
          estadio: string;
          fecha: string;
          id: number;
          resultado_a: number | null;
          resultado_b: number | null;
        };
        Insert: {
          club_a_id: number;
          club_b_id: number;
          created_at?: string;
          estadio: string;
          fecha: string;
          id?: number;
          resultado_a?: number | null;
          resultado_b?: number | null;
        };
        Update: {
          club_a_id?: number;
          club_b_id?: number;
          created_at?: string;
          estadio?: string;
          fecha?: string;
          id?: number;
          resultado_a?: number | null;
          resultado_b?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "matches_club_a_id_fkey";
            columns: ["club_a_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matches_club_b_id_fkey";
            columns: ["club_b_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          aciertos: number | null;
          created_at: string;
          email: string;
          id: string;
          precision: number | null;
          puntos: number | null;
          racha: number | null;
          role: string;
          total_apostados: number | null;
          username: string;
        };
        Insert: {
          aciertos?: number | null;
          created_at?: string;
          email: string;
          id?: string;
          precision?: number | null;
          puntos?: number | null;
          racha?: number | null;
          role?: string;
          total_apostados?: number | null;
          username: string;
        };
        Update: {
          aciertos?: number | null;
          created_at?: string;
          email?: string;
          id?: string;
          precision?: number | null;
          puntos?: number | null;
          racha?: number | null;
          role?: string;
          total_apostados?: number | null;
          username?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
