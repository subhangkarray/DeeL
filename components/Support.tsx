
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';

interface SupportProps {
  onBack: () => void;
}

const Support: React.FC<SupportProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: "Hello! I'm your Zone Assistant. How can I help you today? You can ask about games, deposits, or technical issues." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `You are the friendly support agent for "The Playing Zone", a betting app. 
          Help users with game rules (Aviator, Ludo), deposit/withdrawal issues, and account management. 
          Be encouraging but professional. Always mention that gambling involves risk.
          If they ask about admin approval, tell them it takes 5-10 minutes.`,
        }
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || "I'm having trouble connecting. Try again soon." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Technical error. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0b14]">
      <div className="p-4 bg-[#1a1a2e] flex items-center gap-4">
        <button onClick={onBack} className="text-gray-400">
          <i className="fa-solid fa-chevron-left text-xl"></i>
        </button>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-500 to-red-600 flex items-center justify-center">
                <i className="fa-solid fa-headset text-white"></i>
            </div>
            <div>
                <h3 className="font-bold text-white">Live Support</h3>
                <p className="text-[10px] text-green-400 font-bold uppercase">Online</p>
            </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-[#1a1a2e] text-gray-200 border border-gray-800 rounded-tl-none'}`}>
              <p className="text-sm">{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
            <div className="flex justify-start">
                <div className="bg-[#1a1a2e] p-3 rounded-2xl border border-gray-800 flex gap-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                </div>
            </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-[#1a1a2e] border-t border-gray-800 flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-[#0b0b14] border border-gray-800 rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
        />
        <button className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white">
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
};

export default Support;
