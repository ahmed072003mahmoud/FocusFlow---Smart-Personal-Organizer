
import React from 'react';
import { useApp } from '../AppContext';

const OnboardingScreen: React.FC = () => {
  const { completeOnboarding } = useApp();

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-white px-8 text-center">
      <div className="w-full max-w-sm space-y-12">
        <div className="space-y-4">
           <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Focus on what matters</h1>
           <p className="text-gray-500 font-medium leading-relaxed">
             The smart way to organize your studies, rituals, and thoughts. 
             Powered by deep intelligence.
           </p>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="h-1 bg-primary rounded-full"></div>
          <div className="h-1 bg-gray-100 rounded-full"></div>
          <div className="h-1 bg-gray-100 rounded-full"></div>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={completeOnboarding}
            className="w-full py-5 bg-primary text-white font-black rounded-btn shadow-2xl shadow-primary/30 uppercase tracking-[0.2em] text-xs hover:scale-[1.02] transition-all"
          >
            Start Journey
          </button>
          <button 
            onClick={completeOnboarding}
            className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
