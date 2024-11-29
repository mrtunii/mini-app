export interface GameConfig {
  id: string;
  game_id: string;
  primary_color: string;
  referrer_bonus_points: number;
  referral_bonus_points: number;
  referral_bonus_percentage_enabled: boolean;
  referral_bonus_percentage: string;
  referral_bonus_points_cap: number;
  created_at: string;
  updated_at: string;
}

export interface Game {
  id: string;
  name: string;
  description: string | null;
  config: GameConfig;
}

export interface GameResponse {
  message: null;
  data: Game;
}