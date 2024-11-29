import axios, { AxiosError } from 'axios';
import { AuthResponse, User } from '../types/user';
import { TasksResponse } from '../types/task';
import { GameResponse } from '../types/game';
import { ReferralsResponse } from '../types/referral';
import { LeaderboardResponse } from '../types/leaderboard';
import { TransactionsResponse } from '../types/transaction';

const BASE_URL = import.meta.env.VITE_API_URL;
const GAME_ID = import.meta.env.VITE_GAME_ID;

const api = axios.create({
  baseURL: `${BASE_URL}/games/${GAME_ID}`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper function to extract error message from API response
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    // If the error response contains a message, use it
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    // If there are validation errors, combine them
    if (error.response?.data?.errors) {
      return Object.values(error.response.data.errors).flat().join('\n');
    }
  }
  return 'An unexpected error occurred';
};

export const verifyTelegramAuth = async (initData: string) => {
  try {
    const response = await axios.post<AuthResponse>(
      `${BASE_URL}/games/${GAME_ID}/users/verify`,
      { initData }
    );
    return {
      token: response.data.data.token,
      user: response.data.data.user
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getGameConfig = async (): Promise<GameResponse> => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getTasks = async (): Promise<TasksResponse> => {
  try {
    const response = await api.get('/tasks');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const completeTask = async (taskId: string): Promise<void> => {
  try {
    await api.post(`/tasks/${taskId}/complete`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getCurrentUser = async (): Promise<{ data: User }> => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getReferrals = async (): Promise<ReferralsResponse> => {
  try {
    const response = await api.get('/users/referrals');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getLeaderboard = async (): Promise<LeaderboardResponse> => {
  try {
    const response = await api.get('/leaderboard');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getTransactions = async (): Promise<TransactionsResponse> => {
  try {
    const response = await api.get('/users/transactions/platform');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updatePoints = async (points: number): Promise<void> => {
  try {
    await api.post('/points', { points });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};