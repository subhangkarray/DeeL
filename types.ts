
export enum View {
  USER_HOME = 'USER_HOME',
  AVIATOR = 'AVIATOR',
  LUDO = 'LUDO',
  WALLET = 'WALLET',
  SUPPORT = 'SUPPORT',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD'
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  method: 'Bkash' | 'Nagad';
  status: 'pending' | 'approved' | 'rejected';
  timestamp: number;
  txId?: string;
}

export interface User {
  id: string;
  username: string;
  balance: number;
  totalWinnings: number;
  totalBets: number;
  isBanned: boolean;
}

export interface Bet {
  id: string;
  userId: string;
  amount: number;
  multiplier?: number;
  status: 'pending' | 'won' | 'lost';
  game: 'Aviator' | 'Ludo';
  timestamp: number;
}
