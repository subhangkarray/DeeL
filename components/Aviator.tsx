
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store';

interface AviatorProps {
  onBack: () => void;
}

const Aviator: React.FC<AviatorProps> = ({ onBack }) => {
  const { currentUser, setUsers, rtp } = useApp();
  const [multiplier, setMultiplier] = useState(1.00);
  const [isFlying, setIsFlying] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [betAmount, setBetAmount] = useState(100);
  const [hasBet, setHasBet] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [cashoutAmount, setCashoutAmount] = useState(0);
  const [crashPoint, setCrashPoint] = useState(0);
  const [history, setHistory] = useState<number[]>([1.2, 5.5, 1.0, 12.3, 2.1]);

  const intervalRef = useRef<number | null>(null);

  const startNewGame = () => {
    // Determine crash point based on RTP
    // A simplified house edge logic: 100/RTP * random. 
    // Higher RTP = longer flights on average.
    const randomSeed = Math.random();
    const calculatedCrash = 1 + (0.01 / (1 - randomSeed)) * (rtp / 100);
    setCrashPoint(calculatedCrash);
    
    setMultiplier(1.00);
    setIsFlying(true);
    setCrashed(false);
    setCashedOut(false);
    
    intervalRef.current = window.setInterval(() => {
      setMultiplier(prev => {
        const next = prev + (prev * 0.005) + 0.005;
        if (next >= calculatedCrash) {
          handleCrash();
          return calculatedCrash;
        }
        return next;
      });
    }, 50);
  };

  const handleCrash = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsFlying(false);
    setCrashed(true);
    setHasBet(false);
    setHistory(prev => [parseFloat(multiplier.toFixed(2)), ...prev].slice(0, 10));
    
    // Auto-restart after 5 seconds
    setTimeout(() => {
        if (!isFlying) setCrashed(false);
    }, 4000);
  };

  const placeBet = () => {
    if (!currentUser || currentUser.balance < betAmount) return;
    
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, balance: u.balance - betAmount } : u));
    setHasBet(true);
    if (!isFlying && !crashed) startNewGame();
  };

  const cashOut = () => {
    if (!isFlying || !hasBet || cashedOut) return;
    
    const winAmount = betAmount * multiplier;
    setCashoutAmount(winAmount);
    setCashedOut(true);
    setHasBet(false);
    
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, balance: u.balance + winAmount } : u));
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0b14]">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-[#1a1a2e]">
        <button onClick={onBack} className="text-gray-400 hover:text-white">
          <i className="fa-solid fa-chevron-left text-xl"></i>
        </button>
        <div className="font-orbitron text-red-500 font-bold text-lg tracking-widest">AVIATOR</div>
        <div className="bg-[#0b0b14] px-3 py-1 rounded-full border border-gray-800 text-green-400 font-bold">
          ৳ {currentUser?.balance.toFixed(0)}
        </div>
      </div>

      {/* History */}
      <div className="flex space-x-2 px-4 py-2 bg-[#0b0b14] overflow-x-auto border-b border-gray-900 scrollbar-hide">
        {history.map((val, i) => (
          <span key={i} className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${val > 2 ? 'bg-blue-900 text-blue-300' : 'bg-gray-800 text-gray-400'}`}>
            {val.toFixed(2)}x
          </span>
        ))}
      </div>

      {/* Main Game Screen */}
      <div className="relative flex-1 bg-[#121221] overflow-hidden m-4 rounded-3xl border border-gray-800 shadow-2xl">
        {/* Graph/Plane simulation */}
        <div className="absolute inset-0 flex items-end p-12">
           <div className={`transition-all duration-50 font-orbitron text-7xl font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 ${crashed ? 'text-red-500' : 'text-white'}`}>
             {multiplier.toFixed(2)}x
             {crashed && <div className="text-lg text-center text-gray-400 mt-2">FLEW AWAY!</div>}
           </div>

           {/* Simple Plane Anim */}
           {isFlying && (
             <div 
                className="absolute text-red-500 transition-all duration-75" 
                style={{ 
                    bottom: `${Math.min(multiplier * 15, 70)}%`, 
                    left: `${Math.min(multiplier * 10, 80)}%`,
                    transform: `rotate(-${Math.min(multiplier * 2, 20)}deg)`
                }}
             >
                <i className="fa-solid fa-plane-up text-5xl drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]"></i>
             </div>
           )}
        </div>

        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        ></div>
      </div>

      {/* Betting Controls */}
      <div className="p-4 bg-[#1a1a2e] rounded-t-3xl border-t border-gray-800 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 bg-[#0b0b14] rounded-xl p-3 border border-gray-800 flex flex-col justify-center">
            <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Bet Amount</div>
            <div className="flex justify-between items-center">
              <button onClick={() => setBetAmount(Math.max(10, betAmount - 50))} className="text-gray-400 hover:text-white px-2">
                <i className="fa-solid fa-minus"></i>
              </button>
              <span className="text-xl font-bold">৳ {betAmount}</span>
              <button onClick={() => setBetAmount(betAmount + 50)} className="text-gray-400 hover:text-white px-2">
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex gap-2">
            {[100, 200, 500].map(val => (
              <button 
                key={val}
                onClick={() => setBetAmount(val)}
                className={`flex-1 rounded-lg text-xs font-bold border transition-colors ${betAmount === val ? 'bg-red-600 border-red-500 text-white' : 'bg-[#0b0b14] border-gray-800 text-gray-400'}`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {hasBet && isFlying && !cashedOut ? (
          <button 
            onClick={cashOut}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-5 rounded-2xl font-black text-2xl shadow-lg shadow-yellow-500/20 active:scale-95 transition-all"
          >
            CASH OUT<br/>
            <span className="text-sm">{(betAmount * multiplier).toFixed(2)} ৳</span>
          </button>
        ) : (
          <button 
            disabled={hasBet || cashedOut}
            onClick={placeBet}
            className={`w-full py-5 rounded-2xl font-black text-2xl shadow-lg active:scale-95 transition-all ${
              hasBet ? 'bg-gray-700 text-gray-400' : 'bg-green-600 hover:bg-green-500 text-white shadow-green-500/20'
            }`}
          >
            {hasBet ? 'WAITING NEXT ROUND...' : 'PLACE BET'}
          </button>
        )}

        {cashedOut && (
          <div className="text-center text-green-400 font-bold animate-pulse">
            YOU WON ৳ {cashoutAmount.toFixed(2)}!
          </div>
        )}
      </div>
    </div>
  );
};

export default Aviator;
