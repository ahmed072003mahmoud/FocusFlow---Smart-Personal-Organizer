
import React, { useMemo, useEffect, useState } from 'react';
import { useApp } from '../AppContext';
import { Icons } from '../constants';
import { ProductivityDNA } from '../components/ProductivityDNA';

const StatsScreen: React.FC = () => {
  const { tasks, t, generateEncouragement } = useApp();
  const [wisdom, setWisdom] = useState<string>('Loading AI Wisdom...');

  useEffect(() => {
    generateEncouragement().then(setWisdom);
  }, []);

  return (
    <div className="p-6 space-y-12 pb-32 relative no-scrollbar bg-[#F8F9FA] dark:bg-darkBg min-h-screen">
      <header className="pt-8">
        <h1 className="text-3xl font-black text-[#2B3A67] dark:text-white tracking-tight leading-tight">Your Essence</h1>
        <p className="text-slate-500 font-medium italic opacity-70">Behavioral Evolution</p>
      </header>

      <section className="flex flex-col items-center justify-center p-12 bg-white dark:bg-darkBg/50 rounded-[48px] shadow-sm border border-slate-50 dark:border-white/5 space-y-8 animate-in zoom-in-95 duration-1000">
         <ProductivityDNA tasks={tasks} />
         <div className="text-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-2">Productivity DNA</h2>
            <p className="text-sm font-bold text-[#2B3A67] dark:text-white">Fluid Patterns of Growth</p>
         </div>
      </section>

      <section className="bg-[#2B3A67] p-8 rounded-[40px] text-white shadow-xl shadow-[#2B3A67]/20 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-10"><Icons.AI /></div>
         <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Words of Wisdom</h2>
         <p className="text-lg font-bold leading-relaxed italic">"{wisdom}"</p>
         <div className="mt-6 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-white/20">
            <Icons.AI /> Generated from your weekly data
         </div>
      </section>

      <section className="space-y-6">
         <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-300 px-2">Reflections</h2>
         <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-slate-50 dark:border-white/5 shadow-sm text-center">
               <span className="text-2xl mb-2 block">✨</span>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deep Hours</p>
               <p className="text-2xl font-black text-[#2B3A67] dark:text-white mt-1">12.5h</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-slate-50 dark:border-white/5 shadow-sm text-center">
               <span className="text-2xl mb-2 block">🎯</span>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Streak</p>
               <p className="text-2xl font-black text-[#2B3A67] dark:text-white mt-1">4 Days</p>
            </div>
         </div>
      </section>

      <div className="text-center py-8">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">
           Growth is a quiet revolution. <br/> Keep nurturing your potential.
        </p>
      </div>
    </div>
  );
};

export default StatsScreen;
