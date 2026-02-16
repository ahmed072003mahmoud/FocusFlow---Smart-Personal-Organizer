
import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { ProductivityDNA } from '../components/ProductivityDNA';
import { Icons } from '../constants';

const StatsScreen: React.FC = () => {
  const { tasks, generateWeeklySummary } = useApp();
  const [summary, setSummary] = useState('Analyzing behavior...');

  useEffect(() => {
    generateWeeklySummary().then(setSummary);
  }, []);

  return (
    <div className="p-6 space-y-12 pb-32 bg-[#F8F9FA] min-h-screen">
      <header className="pt-8 text-center">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Your Essence</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-2">Behavioral Identity</p>
      </header>

      <section className="flex flex-col items-center justify-center py-12 bg-white rounded-[48px] shadow-sm border border-slate-50 space-y-8">
         <ProductivityDNA tasks={tasks} />
         <div className="text-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Fluid Pattern</h2>
            <p className="text-sm font-bold text-slate-800">Growing through balance</p>
         </div>
      </section>

      <section className="bg-[#2B3A67] p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-10"><Icons.AI /></div>
         <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-4">Mentor Summary</h3>
         <p className="text-lg font-bold leading-relaxed italic">"{summary}"</p>
      </section>

      <section className="space-y-6">
         <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300 px-2">Weekly Reflection</h3>
         <div className="bg-white p-8 rounded-[32px] space-y-8 border border-slate-50 shadow-sm">
            <div className="space-y-2">
               <p className="text-xs font-bold text-slate-400 uppercase">Pride</p>
               <p className="text-sm font-black text-slate-800 italic leading-relaxed">What made you feel most competent this week?</p>
               <textarea className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm mt-2 focus:ring-0" placeholder="Quietly reflect..." />
            </div>
            <div className="space-y-2">
               <p className="text-xs font-bold text-slate-400 uppercase">Growth</p>
               <p className="text-sm font-black text-slate-800 italic leading-relaxed">What task would you approach differently next time?</p>
            </div>
         </div>
      </section>

      <section className="space-y-6">
         <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300 px-2">Time Flow</h3>
         <div className="flex items-end justify-between px-8 py-10 bg-white rounded-[40px] shadow-sm border border-slate-50 h-48">
            {[40, 70, 45, 90, 65, 30, 55].map((h, i) => (
               <div key={i} className="w-4 bg-indigo-100 rounded-full relative group cursor-help">
                  <div className="absolute bottom-0 w-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ height: `${h}%` }} />
               </div>
            ))}
         </div>
      </section>
    </div>
  );
};

export default StatsScreen;
