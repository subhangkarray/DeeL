
import React, { useState } from 'react';
import { useApp } from '../store';
import { Transaction } from '../types';

interface WalletProps {
  onBack: () => void;
}

const Wallet: React.FC<WalletProps> = ({ onBack }) => {
  const { currentUser, transactions, setTransactions } = useApp();
  const [method, setMethod] = useState<'Bkash' | 'Nagad'>('Bkash');
  const [amount, setAmount] = useState<string>('');
  const [txId, setTxId] = useState<string>('');
  const [type, setType] = useState<'deposit' | 'withdrawal'>('deposit');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || (type === 'deposit' && !txId)) {
        alert('Please fill all fields');
        return;
    }

    const newTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        userId: currentUser?.id || '',
        amount: parseFloat(amount),
        type,
        method,
        status: 'pending',
        timestamp: Date.now(),
        txId: type === 'deposit' ? txId : undefined
    };

    setTransactions([newTx, ...transactions]);
    alert(`${type === 'deposit' ? 'Deposit' : 'Withdrawal'} request submitted. Please wait for admin approval.`);
    setAmount('');
    setTxId('');
  };

  const userTransactions = transactions.filter(t => t.userId === currentUser?.id);

  return (
    <div className="p-4 bg-[#0b0b14] min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-gray-400 hover:text-white">
          <i className="fa-solid fa-chevron-left text-xl"></i>
        </button>
        <h2 className="text-2xl font-bold">Wallet</h2>
      </div>

      <div className="bg-gradient-to-br from-indigo-900 to-blue-900 p-6 rounded-3xl mb-8 shadow-xl">
        <p className="text-blue-200 text-xs uppercase tracking-widest font-bold opacity-75 mb-1">Available Balance</p>
        <h1 className="text-4xl font-bold font-orbitron">৳ {currentUser?.balance.toLocaleString()}</h1>
      </div>

      <div className="bg-[#1a1a2e] rounded-2xl overflow-hidden mb-8 border border-gray-800">
        <div className="flex border-b border-gray-800">
          <button 
            onClick={() => setType('deposit')}
            className={`flex-1 py-4 font-bold ${type === 'deposit' ? 'bg-[#252545] text-green-400' : 'text-gray-500'}`}
          >
            DEPOSIT
          </button>
          <button 
            onClick={() => setType('withdrawal')}
            className={`flex-1 py-4 font-bold ${type === 'withdrawal' ? 'bg-[#252545] text-red-400' : 'text-gray-500'}`}
          >
            WITHDRAW
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
             <button 
                type="button"
                onClick={() => setMethod('Bkash')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${method === 'Bkash' ? 'bg-[#e2136e] border-[#e2136e] text-white' : 'bg-[#0b0b14] border-gray-800 text-gray-500'}`}
             >
                <i className="fa-solid fa-wallet"></i> Bkash
             </button>
             <button 
                type="button"
                onClick={() => setMethod('Nagad')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${method === 'Nagad' ? 'bg-[#f7941d] border-[#f7941d] text-white' : 'bg-[#0b0b14] border-gray-800 text-gray-500'}`}
             >
                <i className="fa-solid fa-piggy-bank"></i> Nagad
             </button>
          </div>

          <div>
            <label className="block text-xs text-gray-500 font-bold mb-2">AMOUNT (MIN: 100 ৳)</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#0b0b14] border border-gray-800 rounded-xl p-4 text-xl font-bold text-white focus:outline-none focus:border-indigo-500"
              placeholder="0.00"
            />
          </div>

          {type === 'deposit' && (
            <div>
              <label className="block text-xs text-gray-500 font-bold mb-2">TRANSACTION ID (TXID)</label>
              <input 
                type="text" 
                value={txId}
                onChange={(e) => setTxId(e.target.value)}
                className="w-full bg-[#0b0b14] border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500"
                placeholder="Enter TxID from SMS"
              />
            </div>
          )}

          <button className={`w-full py-4 rounded-xl font-black text-lg shadow-lg active:scale-[0.98] transition-all ${type === 'deposit' ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/20' : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20'}`}>
            SUBMIT REQUEST
          </button>
        </form>
      </div>

      <h3 className="text-lg font-bold mb-4 border-l-4 border-yellow-500 pl-3">Transaction History</h3>
      <div className="space-y-2">
        {userTransactions.length === 0 ? (
            <p className="text-gray-500 text-sm italic">No recent transactions.</p>
        ) : (
            userTransactions.map(tx => (
                <div key={tx.id} className="bg-[#1a1a2e] p-4 rounded-xl flex justify-between items-center border border-gray-800">
                    <div>
                        <p className="font-bold text-white uppercase text-xs">{tx.type} via {tx.method}</p>
                        <p className="text-gray-500 text-[10px]">{new Date(tx.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className={`font-bold ${tx.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>
                            {tx.type === 'deposit' ? '+' : '-'} ৳ {tx.amount}
                        </p>
                        <p className={`text-[10px] uppercase font-black ${tx.status === 'pending' ? 'text-yellow-500' : tx.status === 'approved' ? 'text-blue-400' : 'text-red-400'}`}>
                            {tx.status}
                        </p>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Wallet;
