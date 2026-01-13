
import React, { useState } from 'react';
import { AppProvider, useApp } from './store';
import { View } from './types';
import Aviator from './components/Aviator';
import Ludo from './components/Ludo';
import Wallet from './components/Wallet';
import Support from './components/Support';
import AdminDashboard from './components/AdminDashboard';
import Layout from './components/Layout';

const MainContent: React.FC = () => {
  const { currentUser, adminLoggedIn } = useApp();
  const [currentView, setCurrentView] = useState<View>(View.USER_HOME);

  const renderView = () => {
    switch (currentView) {
      case View.USER_HOME:
        return (
          <div className="p-4 space-y-6">
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-white">Welcome, {currentUser?.username}</h1>
                <p className="text-gray-400 text-sm">Let's win big today!</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Wallet Balance</p>
                <p className="text-xl font-bold text-green-400">৳ {currentUser?.balance.toLocaleString()}</p>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Aviator Card */}
              <div 
                onClick={() => setCurrentView(View.AVIATOR)}
                className="relative overflow-hidden group cursor-pointer bg-gradient-to-br from-red-600 to-red-900 rounded-2xl h-48 flex items-center justify-center transition-all hover:scale-[1.02]"
              >
                <i className="fa-solid fa-plane-up absolute -right-4 -top-4 text-9xl text-white/10 group-hover:rotate-12 transition-transform"></i>
                <div className="text-center z-10">
                  <h2 className="text-3xl font-orbitron text-white">AVIATOR</h2>
                  <p className="text-red-200 text-sm">CRASH GAME • REAL TIME</p>
                </div>
              </div>

              {/* Ludo Card */}
              <div 
                onClick={() => setCurrentView(View.LUDO)}
                className="relative overflow-hidden group cursor-pointer bg-gradient-to-br from-blue-600 to-indigo-900 rounded-2xl h-48 flex items-center justify-center transition-all hover:scale-[1.02]"
              >
                <i className="fa-solid fa-dice absolute -right-4 -top-4 text-9xl text-white/10 group-hover:rotate-12 transition-transform"></i>
                <div className="text-center z-10">
                  <h2 className="text-3xl font-orbitron text-white">LUDO KING</h2>
                  <p className="text-blue-200 text-sm">MULTIPLAYER • BATTLE</p>
                </div>
              </div>
            </div>

            <section className="mt-8">
              <h3 className="text-lg font-semibold mb-4 border-l-4 border-yellow-500 pl-3">Recent Transactions</h3>
              <div className="bg-[#1a1a2e] rounded-xl overflow-hidden divide-y divide-gray-800">
                <div className="p-4 flex justify-between items-center">
                  <span className="text-gray-400 text-sm italic">Connect your local gateway to start playing...</span>
                  <button 
                    onClick={() => setCurrentView(View.WALLET)}
                    className="text-yellow-500 text-sm font-semibold hover:underline"
                  >
                    Go to Wallet
                  </button>
                </div>
              </div>
            </section>
          </div>
        );
      case View.AVIATOR:
        return <Aviator onBack={() => setCurrentView(View.USER_HOME)} />;
      case View.LUDO:
        return <Ludo onBack={() => setCurrentView(View.USER_HOME)} />;
      case View.WALLET:
        return <Wallet onBack={() => setCurrentView(View.USER_HOME)} />;
      case View.SUPPORT:
        return <Support onBack={() => setCurrentView(View.USER_HOME)} />;
      case View.ADMIN_DASHBOARD:
        return adminLoggedIn ? <AdminDashboard onBack={() => setCurrentView(View.USER_HOME)} /> : <AdminLogin onAccess={() => setCurrentView(View.ADMIN_DASHBOARD)} />;
      default:
        return null;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

const AdminLogin: React.FC<{ onAccess: () => void }> = ({ onAccess }) => {
  const { setAdminLoggedIn } = useApp();
  const [pass, setPass] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === 'admin123') { // Simple mock admin pass
      setAdminLoggedIn(true);
      onAccess();
    } else {
      alert('Invalid Credentials');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
      <div className="bg-[#1a1a2e] p-8 rounded-2xl w-full max-w-md border border-gray-800">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Command Center</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Passkey</label>
            <input 
              type="password" 
              value={pass} 
              onChange={(e) => setPass(e.target.value)}
              className="w-full bg-[#0b0b14] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500"
              placeholder="Enter admin password"
            />
          </div>
          <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold transition-colors">
            ACCESS TERMINAL
          </button>
        </form>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
