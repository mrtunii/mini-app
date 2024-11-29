export interface Transaction {
  type: 'task' | 'referral_bonus';
  points: number;
  created_at: string;
}

export interface TransactionsResponse {
  message: null;
  data: Transaction[];
}