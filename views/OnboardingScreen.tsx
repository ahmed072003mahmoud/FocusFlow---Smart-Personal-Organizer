
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Logo } from '../components/Logo';

const OnboardingScreen: React.FC = () => {
  const { completeOnboarding, addTask } = useApp();
  const [firstTask, setFirstTask] = useState('');

  const handleStart = () => {
    if (firstTask.trim()) {
      addTask({
        title: firstTask,
        category: 'Study',
        priority: 'High',
        estimatedMinutes: 30,
        deadline: new Date().toISOString()
      });
    }
    completeOnboarding();
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#09090B] px-8 text-center">
      <div className="w-full max-w-md space-y-16 animate-in fade-in zoom-in duration-1000">
        <div className="space-y-6">
          <Logo size={64} className="mx-auto" />
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-white tracking-tighter">ابدأ بشيء بسيط</h1>
            <p className="text-zinc-500 font-medium leading-relaxed">
              لا نحتاج لتفسيرات. ما هو أهم شيء يدور في ذهنك الآن؟
            </p>
          </div>
        </div>

        <div className="relative w-full group">
          <input 
            autoFocus
            type="text"
            value={firstTask}
            onChange={(e) => setFirstTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            placeholder="مثلاً: مراجعة فصل الفيزياء..."
            className="w-full bg-zinc-900/50 border-b-2 border-zinc-800 focus:border-white py-6 text-xl font-bold text-white text-center outline-none transition-all placeholder:text-zinc-800"
          />
        </div>

        <button 
          onClick={handleStart}
          className="w-full py-5 bg-white text-black font-black rounded-[25px] shadow-2xl uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all"
        >
          أدخل وضع التدفق (Flow)
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen;
