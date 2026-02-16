
import React from 'react';
import { useApp } from '../AppContext';

const SettingsScreen: React.FC = () => {
  const { isDarkMode, dispatch, userName, t } = useApp();

  return (
    <div className="p-6 space-y-12 pb-32 bg-[#F8F9FA] min-h-screen">
      <header className="pt-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Studio</h1>
        <p className="text-slate-400 font-medium">Fine-tune your focus.</p>
      </header>

      <section className="bg-white rounded-[40px] p-2 space-y-1 shadow-sm border border-slate-50 overflow-hidden">
         <div className="flex items-center justify-between p-6">
            <span className="text-sm font-bold text-slate-800">Dark Mode</span>
            <button 
              onClick={() => dispatch({ type: 'TOGGLE_ZEN', payload: null })} // just a mock toggle for UI
              className={`w-12 h-6 rounded-full relative transition-all ${isDarkMode ? 'bg-indigo-500' : 'bg-slate-200'}`}
            >
               <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'left-7' : 'left-1'}`} />
            </button>
         </div>
         <div className="h-px bg-slate-50 mx-6" />
         <button 
          onClick={() => dispatch({ type: 'DETOX_TASKS' })}
          className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
         >
            <div className="text-left">
               <span className="text-sm font-bold text-slate-800">Task Detox</span>
               <p className="text-[8px] font-black text-slate-300 uppercase mt-1">Clear clutter > 2 weeks old</p>
            </div>
            <span className="text-rose-500 font-black text-[10px] uppercase">Detox Now</span>
         </button>
      </section>

      <section className="space-y-4">
         <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300 px-2">Data Integrity</h3>
         <button className="w-full bg-slate-900 text-white p-6 rounded-[32px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3">
            📥 Export Behavioral Log (JSON)
         </button>
      </section>

      <div className="text-center">
         <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-200">NEXUS STUDIO • V5.0</p>
      </div>
    </div>
  );
};

export default SettingsScreen;
