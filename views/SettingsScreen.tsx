
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../constants';

const SettingsScreen: React.FC = () => {
  const { 
    userName, isDarkMode, toggleDarkMode, taskDetox, clearAllData, t, tasks
  } = useApp();
  
  const navigate = useNavigate();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const totalDone = tasks.filter(t => t.isCompleted).length;
  const userLevel = Math.floor(totalDone / 10) + 1;

  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-4 mb-12">
      <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-8">{title}</h2>
      <div className="bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden border border-slate-50 dark:border-white/5 shadow-sm mx-4">
        <div className="divide-y divide-slate-50 dark:divide-white/5">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="p-6 min-h-full pb-32 bg-[#F8F9FA] dark:bg-darkBg">
      <header className="pt-8 mb-8 flex items-center gap-4 px-2">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-400">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="text-2xl font-black text-[#2B3A67] dark:text-white tracking-tight">Settings</h1>
      </header>

      <section className="bg-[#2B3A67] rounded-[32px] p-6 text-white mb-12 shadow-xl mx-4 flex items-center gap-4">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-black">
          {userName?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-black">{userName || 'User'}</h2>
          <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mt-1">Level {userLevel}</p>
        </div>
      </section>

      <Section title="Interface">
        <div className="flex items-center justify-between px-8 py-5">
           <span className="text-sm font-bold text-[#2B3A67] dark:text-white">Dark Mode</span>
           <button onClick={toggleDarkMode} className={`w-12 h-6 rounded-full relative transition-all ${isDarkMode ? 'bg-[#E63946]' : 'bg-slate-100'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'left-7' : 'left-1'}`} />
           </button>
        </div>
      </Section>

      <Section title="Maintenance">
        <button onClick={taskDetox} className="w-full flex items-center gap-4 px-8 py-5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
           <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">🌿</div>
           <div className="text-left">
              <h3 className="text-sm font-bold text-emerald-600">Task Detox</h3>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Clear tasks older than 14 days</p>
           </div>
        </button>
        <button onClick={() => setShowResetConfirm(true)} className="w-full flex items-center gap-4 px-8 py-5 hover:bg-rose-50 dark:hover:bg-white/5 transition-colors">
           <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center text-lg">🔥</div>
           <div className="text-left">
              <h3 className="text-sm font-bold text-rose-500">Reset All Data</h3>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Permanent deletion</p>
           </div>
        </button>
      </Section>

      <div className="text-center opacity-30 pb-12">
         <p className="text-[8px] font-black uppercase tracking-[0.5em]">Nexus Studio • PWA READY</p>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[300] flex items-center justify-center p-6 text-center">
           <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[40px] p-10 animate-in zoom-in-95 duration-300 shadow-2xl">
              <h2 className="text-xl font-black mb-4 dark:text-white">Are you sure?</h2>
              <p className="text-slate-500 text-sm mb-8">This will wipe all your progress permanently.</p>
              <button onClick={clearAllData} className="w-full bg-rose-500 text-white font-black py-4 rounded-2xl mb-4 uppercase text-xs">Reset Everything</button>
              <button onClick={() => setShowResetConfirm(false)} className="w-full text-slate-400 font-bold uppercase text-xs">Cancel</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default SettingsScreen;
