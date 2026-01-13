
import React from 'react';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  setView: (view: View) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  const navItems = [
    { id: View.USER_HOME, icon: 'fa-house', label: 'Home' },
    { id: View.WALLET, icon: 'fa-wallet', label: 'Wallet' },
    { id: View.SUPPORT, icon: 'fa-headset', label: 'Support' },
    { id: View.ADMIN_DASHBOARD, icon: 'fa-lock', label: 'Admin' },
  ];

  // Hide nav on game screens to maximize space
  const hideNav = currentView === View.AVIATOR || currentView === View.LUDO;

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto betting-gradient relative">
      <main className="flex-1 pb-24">
        {children}
      </main>

      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-[#1a1a2e] border-t border-gray-800 py-3 px-6 flex justify-between items-center z-50">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center space-y-1 transition-colors ${
                currentView === item.id ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              <i className={`fa-solid ${item.icon} text-xl`}></i>
              <span className="text-[10px] uppercase font-bold tracking-tighter">{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
};

export default Layout;
