export interface LeaderboardUser {
  full_name: string;
  username: string;
  points: number;
}

export interface LeaderboardResponse {
  message: null;
  data: {
    total: number;
    top_users: LeaderboardUser[];
  };
}