
import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white text-zinc-900 animate-in fade-in duration-700">
      <div className="w-24 h-24 bg-zinc-900 rounded-[32px] flex items-center justify-center mb-8 shadow-2xl animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      </div>
      <h1 className="text-4xl font-black tracking-tighter">FocusFlow</h1>
      <p className="text-zinc-400 mt-2 text-sm font-medium uppercase tracking-[0.2em]">Efficiency Reimagined</p>
    </div>
  );
};

export default SplashScreen;
