
import React from 'react';
import { useApp } from '../AppContext';

const SettingsScreen: React.FC = () => {
  const { isDarkMode, toggleDarkMode, language, setLanguage, userName, email, t } = useApp();

  return (
    <div className="min-h-screen bg-black p-8 pt-24 pb-40 space-y-12 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-light text-white tracking-tighter leading-none">Studio</h1>
        <p className="system-caption text-zinc-600 mt-2">نظام التحكم الإدراكي</p>
      </header>

      <section className="bg-zinc-950 border border-white/5 rounded-[40px] p-2 space-y-1 overflow-hidden">
         {/* Theme */}
         <div className="flex items-center justify-between p-8">
            <span className="text-sm font-bold text-zinc-300">الوضع الليلي</span>
            <button 
              onClick={toggleDarkMode}
              className={`w-12 h-6 rounded-full relative transition-all ${isDarkMode ? 'bg-white' : 'bg-zinc-800'}`}
            >
               <div className={`absolute top-1 w-4 h-4 bg-zinc-900 rounded-full transition-all ${isDarkMode ? 'left-7' : 'left-1'}`} />
            </button>
         </div>

         <div className="h-px bg-white/5 mx-8" />

         {/* Language Selector */}
         <div className="p-8 space-y-4">
            <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">اللغة | Language</span>
            <div className="grid grid-cols-2 gap-3">
               <button 
                 onClick={() => setLanguage('ar')}
                 className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${language === 'ar' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-600'}`}
               >
                 العربية
               </button>
               <button 
                 onClick={() => setLanguage('en')}
                 className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${language === 'en' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-600'}`}
               >
                 English
               </button>
            </div>
         </div>
      </section>

      <section className="space-y-6">
         <h3 className="system-caption text-zinc-700 px-2">الذكاء الاصطناعي</h3>
         <div className="bg-zinc-950 border border-white/5 rounded-[40px] p-8 space-y-8">
            <div className="flex items-center justify-between">
               <div className="space-y-1">
                  <p className="text-sm font-bold text-white">تحسين التفكير</p>
                  <p className="text-[9px] text-zinc-600 font-medium leading-none">تفعيل ميزانية تفكير Gemini 3 Pro القصوى</p>
               </div>
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div className="flex items-center justify-between">
               <div className="space-y-1">
                  <p className="text-sm font-bold text-white">البحث الموثق</p>
                  <p className="text-[9px] text-zinc-600 font-medium leading-none">تفعيل Google Search Grounding</p>
               </div>
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
         </div>
      </section>

      <footer className="text-center pt-12 space-y-4">
         <p className="system-caption text-zinc-800 tracking-[0.8em]">FOCUSFLOW V12.0</p>
         <button className="text-[10px] font-black text-rose-900 uppercase tracking-widest hover:text-rose-500 transition-colors">خروج من النظام</button>
      </footer>
    </div>
  );
};

export default SettingsScreen;
