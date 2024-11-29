export interface User {
  id: string;
  telegram_id: string;
  first_name?: string | null;
  last_name?: string | null;
  username: string; 
  photo_url?: string | null;
  language_code?: string | null;
  points: number;
}

export interface AuthResponse {
  message: null;
  data: {
    token: string;
    user: User;
  };
}