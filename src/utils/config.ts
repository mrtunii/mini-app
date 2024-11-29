export const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  gameId: import.meta.env.VITE_GAME_ID,
  botName: import.meta.env.VITE_BOT_NAME,
} as const;

export const isProduction = import.meta.env.PROD;