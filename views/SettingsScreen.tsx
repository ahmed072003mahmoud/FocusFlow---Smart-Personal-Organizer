
import React, { useRef } from 'react';
import { useApp } from '../AppContext';

const SettingsScreen: React.FC = () => {
  const { isDarkMode, toggleDarkMode, language, setLanguage, exportBackup, importBackup, t } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importBackup(file);
        alert('تمت استعادة البيانات بنجاح.');
      } catch (err) {
        alert('خطأ في استيراد الملف.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] p-8 pt-24 pb-40 space-y-12 animate-in fade-in duration-500 overflow-y-auto no-scrollbar">
      <header>
        <h1 className="text-4xl font-light text-white tracking-tighter leading-none">الإعدادات</h1>
        <p className="system-caption text-[#717171] mt-2">نظام التحكم الإدراكي</p>
      </header>

      <section className="bg-[#252525] border border-white/5 rounded-[40px] p-2 space-y-1 overflow-hidden">
         {/* Theme */}
         <div className="flex items-center justify-between p-8">
            <span className="text-sm font-bold text-[#C7C7C7]">الوضع الليلي</span>
            <button 
              onClick={toggleDarkMode}
              className={`w-12 h-6 rounded-full relative transition-all ${isDarkMode ? 'bg-white' : 'bg-[#333333]'}`}
            >
               <div className={`absolute top-1 w-4 h-4 bg-black rounded-full transition-all ${isDarkMode ? 'left-7' : 'left-1'}`} />
            </button>
         </div>

         <div className="h-px bg-white/5 mx-8" />

         {/* Language Selector */}
         <div className="p-8 space-y-4">
            <span className="text-[10px] font-black text-[#717171] uppercase tracking-widest">اللغة | Language</span>
            <div className="grid grid-cols-2 gap-3">
               <button 
                 onClick={() => setLanguage('ar')}
                 className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${language === 'ar' ? 'bg-white text-black' : 'bg-[#1a1a1a] text-[#717171]'}`}
               >
                 العربية
               </button>
               <button 
                 onClick={() => setLanguage('en')}
                 className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${language === 'en' ? 'bg-white text-black' : 'bg-[#1a1a1a] text-[#717171]'}`}
               >
                 English
               </button>
            </div>
         </div>
      </section>

      <section className="space-y-6">
         <h3 className="system-caption text-[#717171] px-2">البيانات والخصوصية</h3>
         <div className="bg-[#252525] border border-white/5 rounded-[40px] p-8 space-y-6">
            <button 
              onClick={exportBackup}
              className="w-full text-right flex items-center justify-between group"
            >
               <span className="text-sm font-bold text-white group-hover:text-[#C7C7C7] transition-colors">تصدير نسخة احتياطية (JSON)</span>
               <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px]">↓</div>
            </button>
            <div className="h-px bg-white/5" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full text-right flex items-center justify-between group"
            >
               <span className="text-sm font-bold text-white group-hover:text-[#C7C7C7] transition-colors">استيراد بيانات سابقة</span>
               <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px]">↑</div>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".json" 
              onChange={handleFileChange} 
            />
         </div>
      </section>

      <footer className="text-center pt-12 space-y-4">
         <p className="system-caption text-[#333333] tracking-[0.8em]">FOCUSFLOW V12.0</p>
         <button className="text-[10px] font-black text-rose-900 uppercase tracking-widest hover:text-rose-500 transition-colors">خروج من النظام</button>
      </footer>
    </div>
  );
};

export default SettingsScreen;
