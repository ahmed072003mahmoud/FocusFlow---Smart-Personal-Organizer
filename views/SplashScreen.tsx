
import React, { useEffect, useState } from 'react';

const SplashScreen: React.FC = () => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#1E1E1E] overflow-hidden">
      {/* Central Pulsing Nucleus */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="w-16 h-16 bg-[#252525] border border-white/5 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.4)] animate-in zoom-in duration-1000">
          <div className="w-2 h-2 bg-[#C7C7C7] rounded-full animate-ping" />
        </div>
      </div>

      <div className={`mt-16 transition-all duration-1000 flex flex-col items-center ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h1 className="text-xl font-black text-white tracking-[0.4em] uppercase">FocusFlow</h1>
        <div className="mt-4 flex items-center gap-4">
           <div className="w-8 h-px bg-[#333333]" />
           <p className="text-[9px] font-black text-[#717171] uppercase tracking-[0.5em]">الوعي الإنتاجي</p>
           <div className="w-8 h-px bg-[#333333]" />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
