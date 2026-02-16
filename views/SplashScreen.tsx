
import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-white dark:bg-darkBg">
      <div className="w-24 h-24 bg-primary rounded-[32px] flex items-center justify-center animate-breathing shadow-2xl shadow-primary/40">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.99 7.99 0 0121 13a8.003 8.003 0 01-3.343 5.657z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
      </div>
      <h1 className="mt-8 text-2xl font-black text-primary tracking-tighter">FocusFlow</h1>
      <p className="mt-2 text-gray-400 text-xs font-bold uppercase tracking-[0.4em]">Deep Intelligence</p>
    </div>
  );
};

export default SplashScreen;
