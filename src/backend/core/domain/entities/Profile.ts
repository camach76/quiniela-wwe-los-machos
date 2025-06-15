export interface Profile {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  location: string | null;
  bio: string | null;
  website: string | null;
  created_at: string;
  updated_at: string | null;
  aciertos: number | null;
  precision: number | null;
  puntos: number | null;
  racha: number | null;
  total_apostados: number | null;
  role: string;
  
  // Redes sociales
  facebook_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  
  // Preferencias de notificación
  notifications_email: boolean;
  notifications_push: boolean;
  notifications_results: boolean;
  notifications_new_matches: boolean;
  notifications_ranking_updates: boolean;
}
