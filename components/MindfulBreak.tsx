
import React, { useState, useEffect } from 'react';

export const MindfulBreak: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    if (timeLeft <= 0) onComplete();
    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  useEffect(() => {
    const cycle = setInterval(() => {
      setPhase(p => p === 'in' ? 'hold' : p === 'hold' ? 'out' : 'in');
    }, 4000);
    return () => clearInterval(cycle);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#F6F7F8] dark:bg-darkBg z-[2000] flex flex-col items-center justify-center p-12">
      <h2 className="text-xl font-black text-[#2B3A67] dark:text-white uppercase tracking-[0.5em] mb-24">Mindful Break</h2>
      
      <div className="relative flex items-center justify-center">
        <div 
          className={`w-48 h-48 bg-[#5B7C8D]/10 border-4 border-[#5B7C8D] rounded-full transition-all duration-[4000ms] ease-in-out flex items-center justify-center
            ${phase === 'in' ? 'scale-[2.5] opacity-100' : phase === 'hold' ? 'scale-[2.5] opacity-50' : 'scale-100 opacity-20'}
          `}
        >
          <span className="text-xs font-black uppercase tracking-widest text-[#2B3A67] dark:text-white transition-opacity duration-1000">
            {phase === 'in' ? 'Breathe In' : phase === 'hold' ? 'Hold' : 'Breathe Out'}
          </span>
        </div>
      </div>

      <div className="mt-48 text-slate-300 font-bold uppercase tracking-widest text-xs">
         {timeLeft}s remaining
      </div>
      
      <button onClick={onComplete} className="mt-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Skip Break</button>
    </div>
  );
};
