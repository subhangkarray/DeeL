
import React, { useState } from 'react';
import { useApp } from '../store';

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const { users, setUsers, transactions, setTransactions, rtp, setRtp } = useApp();
  const [tab, setTab] = useState<'users' | 'payments' | 'settings'>('users');

  const approvePayment = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    // Update Transaction
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'approved' } : t));
    
    // Update User Balance
    setUsers(prev => prev.map(u => u.id === tx.userId ? { 
        ...u, 
        balance: tx.type === 'deposit' ? u.balance + tx.amount : u.balance - tx.amount 
    } : u));
  };

  const toggleBan = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isBanned: !u.isBanned } : u));
  };

  return (
    <div className="p-4 bg-[#0b0b14] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-red-500 font-orbitron">COMMAND CENTER</h2>
          <p className="text-gray-500 text-xs">Admin Terminal v2.4</p>
        </div>
        <button onClick={onBack} className="bg-gray-800 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-700">
          LOGOUT
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1a1a2e] p-4 rounded-xl border border-gray-800">
           <p className="text-gray-500 text-[10px] font-bold">TOTAL USERS</p>
           <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="bg-[#1a1a2e] p-4 rounded-xl border border-gray-800">
           <p className="text-gray-500 text-[10px] font-bold">TOTAL DEPOSITS</p>
           <p className="text-2xl font-bold text-green-500">৳ {transactions.filter(t => t.type === 'deposit' && t.status === 'approved').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</p>
        </div>
        <div className="bg-[#1a1a2e] p-4 rounded-xl border border-gray-800">
           <p className="text-gray-500 text-[10px] font-bold">CURRENT RTP</p>
           <p className="text-2xl font-bold text-yellow-500">{rtp}%</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-800">
        {(['users', 'payments', 'settings'] as const).map(t => (
            <button 
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 font-bold text-sm uppercase transition-colors ${tab === t ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500'}`}
            >
                {t}
            </button>
        ))}
      </div>

      {tab === 'users' && (
        <div className="bg-[#1a1a2e] rounded-xl border border-gray-800 overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#252545] text-gray-400 uppercase">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Balance</th>
                <th className="p-3">Activity</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map(u => (
                <tr key={u.id} className={u.isBanned ? 'opacity-50 grayscale' : ''}>
                  <td className="p-3 font-bold">{u.username}</td>
                  <td className="p-3 text-green-400 font-bold">৳ {u.balance.toLocaleString()}</td>
                  <td className="p-3 text-gray-500">{u.totalBets} Bets / {u.totalWinnings.toLocaleString()} Won</td>
                  <td className="p-3">
                    <button 
                        onClick={() => toggleBan(u.id)}
                        className={`px-2 py-1 rounded font-bold ${u.isBanned ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}
                    >
                        {u.isBanned ? 'UNBAN' : 'BAN'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'payments' && (
        <div className="space-y-3">
          {transactions.filter(t => t.status === 'pending').length === 0 ? (
            <p className="text-center text-gray-500 italic py-10">No pending requests.</p>
          ) : (
            transactions.filter(t => t.status === 'pending').map(tx => (
                <div key={tx.id} className="bg-[#1a1a2e] p-4 rounded-xl flex justify-between items-center border border-gray-800">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tx.type === 'deposit' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                                {tx.type.toUpperCase()}
                            </span>
                            <span className="text-gray-500 text-[10px]">{tx.method}</span>
                        </div>
                        <p className="font-bold text-white">৳ {tx.amount.toLocaleString()}</p>
                        {tx.txId && <p className="text-[10px] text-indigo-400 mt-1">TxID: {tx.txId}</p>}
                        <p className="text-[10px] text-gray-500">User ID: {tx.userId}</p>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => approvePayment(tx.id)}
                            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-xs"
                        >
                            APPROVE
                        </button>
                        <button className="bg-gray-800 hover:bg-gray-700 text-gray-400 px-4 py-2 rounded-lg font-bold text-xs">
                            REJECT
                        </button>
                    </div>
                </div>
            ))
          )}
        </div>
      )}

      {tab === 'settings' && (
        <div className="bg-[#1a1a2e] p-6 rounded-xl border border-gray-800 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Game Profit Control (RTP %)</label>
            <div className="flex items-center gap-4">
                <input 
                    type="range" min="50" max="100" value={rtp} 
                    onChange={(e) => setRtp(parseInt(e.target.value))}
                    className="flex-1 accent-red-500"
                />
                <span className="text-xl font-bold font-orbitron text-red-500 w-16 text-right">{rtp}%</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-2 italic">Lower RTP increases house profit by making Aviator plane crash sooner and reducing win probability in simulations.</p>
          </div>

          <div className="pt-6 border-t border-gray-800">
            <h4 className="text-sm font-bold text-red-500 mb-4">Manual Crash Control</h4>
            <div className="grid grid-cols-2 gap-3">
                <button className="bg-red-900/50 border border-red-600 text-red-400 py-3 rounded-lg font-bold text-xs uppercase hover:bg-red-900">
                    Force Next Crash 1.01x
                </button>
                <button className="bg-blue-900/50 border border-blue-600 text-blue-400 py-3 rounded-lg font-bold text-xs uppercase hover:bg-blue-900">
                    Enable Bonus Mode
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
