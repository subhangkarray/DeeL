
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Transaction, Bet } from './types';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  bets: Bet[];
  setBets: React.Dispatch<React.SetStateAction<Bet[]>>;
  rtp: number;
  setRtp: (val: number) => void;
  adminLoggedIn: boolean;
  setAdminLoggedIn: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([
    { id: '1', username: 'ProGamer99', balance: 5000, totalWinnings: 12000, totalBets: 45, isBanned: false },
    { id: '2', username: 'LuckyJack', balance: 1500, totalWinnings: 3000, totalBets: 20, isBanned: false },
    { id: '3', username: 'RiskyBoi', balance: 500, totalWinnings: 100, totalBets: 50, isBanned: false },
  ]);
  
  const [currentUser, setCurrentUser] = useState<User | null>(users[0]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [rtp, setRtp] = useState<number>(95);
  const [adminLoggedIn, setAdminLoggedIn] = useState<boolean>(false);

  // Sync current user with users list
  useEffect(() => {
    if (currentUser) {
      const updatedUser = users.find(u => u.id === currentUser.id);
      if (updatedUser && updatedUser.balance !== currentUser.balance) {
        setCurrentUser(updatedUser);
      }
    }
  }, [users]);

  return (
    <AppContext.Provider value={{ 
      currentUser, setCurrentUser, users, setUsers, transactions, 
      setTransactions, bets, setBets, rtp, setRtp, adminLoggedIn, setAdminLoggedIn 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
