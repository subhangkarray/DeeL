
import React, { useState } from 'react';
import { useApp } from '../store';

interface LudoProps {
  onBack: () => void;
}

const AVATARS = [
  { id: 'av1', icon: 'fa-user-ninja', color: 'text-red-500', bg: 'bg-red-500/20' },
  { id: 'av2', icon: 'fa-user-astronaut', color: 'text-blue-500', bg: 'bg-blue-500/20' },
  { id: 'av3', icon: 'fa-user-tie', color: 'text-green-500', bg: 'bg-green-500/20' },
  { id: 'av4', icon: 'fa-user-graduate', color: 'text-yellow-500', bg: 'bg-yellow-500/20' },
  { id: 'av5', icon: 'fa-robot', color: 'text-purple-500', bg: 'bg-purple-500/20' },
  { id: 'av6', icon: 'fa-ghost', color: 'text-gray-400', bg: 'bg-gray-400/20' },
];

const Ludo: React.FC<LudoProps> = ({ onBack }) => {
  const { currentUser } = useApp();
  const [matching, setMatching] = useState(false);
  const [entryFee, setEntryFee] = useState(100);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [gameStarted, setGameStarted] = useState(false);
  const [opponents, setOpponents] = useState<typeof AVATARS>([]);

  const startMatch = () => {
    setMatching(true);
    // Simulate finding opponents with random avatars
    const randomOpponents = [...AVATARS]
      .filter(a => a.id !== selectedAvatar.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    setOpponents(randomOpponents);

    setTimeout(() => {
      setMatching(false);
      setGameStarted(true);
    }, 3000);
  };

  if (gameStarted) {
    const allPlayers = [selectedAvatar, ...opponents];
    return (
      <div className="p-4 bg-[#0b0b14] min-h-screen flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setGameStarted(false)} className="text-gray-400 hover:text-white">
              <i className="fa-solid fa-chevron-left text-xl"></i>
            </button>
            <h2 className="text-xl font-bold font-orbitron">BATTLE ARENA</h2>
          </div>
          <div className="bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/50 text-yellow-500 font-bold text-xs">
            PRIZE: ৳ {entryFee * 3.6}
          </div>
        </div>

        <div className="relative aspect-square w-full max-w-md mx-auto bg-[#1a1a2e] rounded-3xl border-4 border-indigo-900 shadow-2xl overflow-hidden grid grid-cols-15 grid-rows-15">
          {/* Ludo Board Sections (Simplified Layout) */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            {/* Red Base */}
            <div className="bg-red-600/20 border-r border-b border-indigo-900/50 flex items-center justify-center p-4">
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center border-4 border-white/20 shadow-lg">
                <i className={`fa-solid ${allPlayers[0].icon} text-3xl text-white`}></i>
              </div>
            </div>
            {/* Green Base */}
            <div className="bg-green-600/20 border-b border-indigo-900/50 flex items-center justify-center p-4">
              <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center border-4 border-white/20 shadow-lg opacity-80">
                <i className={`fa-solid ${allPlayers[1].icon} text-3xl text-white`}></i>
              </div>
            </div>
            {/* Yellow Base */}
            <div className="bg-yellow-500/20 border-r border-indigo-900/50 flex items-center justify-center p-4">
              <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center border-4 border-white/20 shadow-lg opacity-80">
                <i className={`fa-solid ${allPlayers[2].icon} text-3xl text-white`}></i>
              </div>
            </div>
            {/* Blue Base */}
            <div className="bg-blue-600/20 flex items-center justify-center p-4">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center border-4 border-white/20 shadow-lg opacity-80">
                <i className={`fa-solid ${allPlayers[3].icon} text-3xl text-white`}></i>
              </div>
            </div>
          </div>

          {/* Center Hub */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#1a1a2e] border-4 border-indigo-900 rotate-45 flex items-center justify-center overflow-hidden">
             <div className="-rotate-45 grid grid-cols-2 grid-rows-2 w-full h-full opacity-50">
                <div className="bg-red-500"></div>
                <div className="bg-green-500"></div>
                <div className="bg-yellow-500"></div>
                <div className="bg-blue-500"></div>
             </div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-12 h-12 rounded-xl shadow-2xl flex items-center justify-center text-black z-10 cursor-pointer active:scale-90 transition-transform">
             <i className="fa-solid fa-dice text-3xl text-indigo-900 animate-pulse"></i>
          </div>
        </div>

        <div className="mt-8 bg-[#1a1a2e] rounded-2xl p-4 border border-gray-800">
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-400 text-xs uppercase tracking-widest">Live Players</h3>
              <span className="text-green-500 text-[10px] font-black animate-pulse uppercase">Match in progress</span>
           </div>
           <div className="grid grid-cols-2 gap-3">
              {allPlayers.map((p, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-[#0b0b14] p-2 rounded-xl border border-gray-800">
                   <div className={`w-8 h-8 rounded-full ${idx === 0 ? 'bg-indigo-600' : 'bg-gray-800'} flex items-center justify-center`}>
                      <i className={`fa-solid ${p.icon} text-sm text-white`}></i>
                   </div>
                   <div className="overflow-hidden">
                      <p className="text-white font-bold text-xs truncate">{idx === 0 ? currentUser?.username : `Player_${Math.floor(Math.random()*1000)}`}</p>
                      <p className="text-[9px] text-gray-500 uppercase">{idx === 0 ? 'YOU' : 'Opponent'}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <button 
          onClick={() => alert('Real-time dice rolling and piece movement logic is being synchronized with the server. Stay tuned!')}
          className="mt-6 w-full bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl font-black shadow-lg"
        >
          QUIT MATCH
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#0b0b14] min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="text-gray-400 hover:text-white">
          <i className="fa-solid fa-chevron-left text-xl"></i>
        </button>
        <h2 className="text-2xl font-bold font-orbitron">LUDO KING</h2>
      </div>

      {/* Avatar Selection */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Choose Your Fighter</h3>
        <div className="grid grid-cols-3 gap-3">
          {AVATARS.map((av) => (
            <button
              key={av.id}
              onClick={() => setSelectedAvatar(av)}
              className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all active:scale-95 ${
                selectedAvatar.id === av.id 
                  ? 'border-indigo-500 bg-indigo-500/10' 
                  : 'border-gray-800 bg-[#1a1a2e] grayscale hover:grayscale-0'
              }`}
            >
              <i className={`fa-solid ${av.icon} text-3xl mb-1 ${av.color}`}></i>
              {selectedAvatar.id === av.id && (
                <div className="absolute -top-2 -right-2 bg-indigo-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] border-2 border-[#0b0b14]">
                  <i className="fa-solid fa-check"></i>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="relative aspect-square bg-[#1a1a2e] rounded-3xl border-8 border-indigo-900 shadow-2xl flex items-center justify-center p-4">
        {matching ? (
          <div className="text-center space-y-6 w-full px-6">
            <div className="relative">
                <div className="w-24 h-24 border-4 border-t-indigo-500 border-indigo-900/30 rounded-full animate-spin mx-auto"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <i className={`fa-solid ${selectedAvatar.icon} text-3xl text-indigo-400`}></i>
                </div>
            </div>
            <div className="space-y-2">
                <p className="text-indigo-400 font-bold uppercase tracking-widest text-lg">MATCHING...</p>
                <div className="flex justify-center gap-2">
                    {opponents.map((opp, i) => (
                        <div key={i} className="w-10 h-10 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center animate-pulse">
                            <i className={`fa-solid ${opp.icon} text-xs text-gray-500`}></i>
                        </div>
                    ))}
                    {Array.from({ length: 3 - opponents.length }).map((_, i) => (
                        <div key={i} className="w-10 h-10 rounded-full bg-gray-900 border-2 border-gray-800 flex items-center justify-center">
                            <i className="fa-solid fa-question text-xs text-gray-700"></i>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 w-full">
             <div className="h-24 bg-red-600/30 rounded-xl flex items-center justify-center border border-red-500/20"><i className="fa-solid fa-shield-halved text-3xl text-red-500/50"></i></div>
             <div className="h-24 bg-green-600/30 rounded-xl flex items-center justify-center border border-green-500/20"><i className="fa-solid fa-shield-halved text-3xl text-green-500/50"></i></div>
             <div className="h-24 bg-yellow-500/30 rounded-xl flex items-center justify-center border border-yellow-500/20"><i className="fa-solid fa-shield-halved text-3xl text-yellow-500/50"></i></div>
             <div className="h-24 bg-blue-600/30 rounded-xl flex items-center justify-center border border-blue-500/20"><i className="fa-solid fa-shield-halved text-3xl text-blue-500/50"></i></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-12 h-12 rounded shadow-lg flex items-center justify-center text-black font-bold text-xl">
               <i className="fa-solid fa-dice text-2xl text-indigo-900"></i>
             </div>
          </div>
        )}
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex gap-2">
          {[100, 250, 500, 1000].map(val => (
            <button 
              key={val}
              disabled={matching}
              onClick={() => setEntryFee(val)}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${entryFee === val ? 'bg-indigo-600 ring-2 ring-indigo-400' : 'bg-gray-800 text-gray-500'}`}
            >
              ৳ {val}
            </button>
          ))}
        </div>

        <button 
          disabled={matching}
          onClick={startMatch}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 py-4 rounded-2xl font-black text-xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50"
        >
          {matching ? 'SEARCHING...' : `JOIN BATTLE (WIN ৳ ${entryFee * 3.6})`}
        </button>

        <p className="text-center text-gray-500 text-[10px] italic px-6 uppercase tracking-tighter">
          4-PLAYER DEATHMATCH • WINNER TAKES ALL (MINUS 10% FEE)
        </p>
      </div>
    </div>
  );
};

export default Ludo;
