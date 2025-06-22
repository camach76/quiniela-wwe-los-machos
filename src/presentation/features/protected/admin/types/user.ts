export interface UserWithPoints {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  points: number;
  correct_predictions: number;
  total_predictions: number;
  created_at?: string;
  updated_at?: string;
}

export interface UserPrediction {
  id: string;
  user_id: string;
  match_id: string;
  predicted_winner: 'A' | 'B' | 'draw';
  predicted_score_a: number;
  predicted_score_b: number;
  points_earned: number | null;
  is_correct: boolean | null;
  created_at: string;
  updated_at: string;
}

import { Match } from './match';

export interface UserMatchWithPrediction extends Match {
  prediction?: UserPrediction;
}
