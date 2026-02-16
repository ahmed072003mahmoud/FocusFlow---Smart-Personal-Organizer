
import React from 'react';
import { useApp } from '../AppContext';

const Settings: React.FC = () => {
  const { isDarkMode, toggleDarkMode, userName, email } = useApp();

  return (
    <div className="max-w-2xl mx-auto px-6 space-y-12 animate-slide-up">
      <header className="text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center text-3xl font-black text-primary">
          {userName?.charAt(0)}
        </div>
        <h1 className="mt-4 text-2xl font-black tracking-tight">{userName}</h1>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{email}</p>
      </header>

      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">General</h3>
        <div className="bg-white rounded-card divide-y divide-gray-50 border border-gray-100">
           <div className="flex items-center justify-between p-6">
              <span className="text-sm font-bold">Dark Mode</span>
              <button 
                onClick={toggleDarkMode}
                className={`w-12 h-6 rounded-full relative transition-all ${isDarkMode ? 'bg-primary' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'left-7' : 'left-1'}`}></div>
              </button>
           </div>
           <div className="flex items-center justify-between p-6">
              <span className="text-sm font-bold">Usage Mode</span>
              <span className="text-xs font-black text-primary uppercase">Balanced</span>
           </div>
           <div className="flex items-center justify-between p-6">
              <span className="text-sm font-bold">Focus Sounds</span>
              <span className="text-xs font-bold text-gray-400">Off</span>
           </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Advanced</h3>
        <div className="bg-white rounded-card divide-y divide-gray-50 border border-gray-100">
           <button className="w-full text-left p-6 text-sm font-bold hover:bg-gray-50 transition-all">Export Data (JSON)</button>
           <button className="w-full text-left p-6 text-sm font-bold text-softRed hover:bg-softRed/5 transition-all">Sign Out</button>
        </div>
      </section>

      <div className="text-center">
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">FocusFlow v1.0.0</p>
      </div>
    </div>
  );
};

export default Settings;
