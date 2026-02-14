
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../constants';
import { Language } from '../types';

const SettingsScreen: React.FC = () => {
  const { 
    userName, 
    notificationsEnabled, 
    setNotificationsEnabled, 
    isDarkMode, 
    toggleDarkMode, 
    language, 
    setLanguage, 
    clearAllData, 
    t, 
    tasks 
  } = useApp();
  
  const navigate = useNavigate();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const totalDone = tasks.filter(t => t.isCompleted).length;
  const userLevel = Math.floor(totalDone / 10) + 1;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-4 mb-8">
      <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-8">{title}</h2>
      <div className="bg-white rounded-[48px] overflow-hidden border border-slate-50 shadow-sm">
        <div className="divide-y divide-slate-50">
          {children}
        </div>
      </div>
    </div>
  );

  const SettingRow: React.FC<{ 
    icon: React.ReactNode; 
    title: string; 
    subtitle?: string; 
    action?: React.ReactNode; 
    destructive?: boolean; 
    onClick?: () => void 
  }> = ({ icon, title, subtitle, action, destructive, onClick }) => (
    <div 
      onClick={onClick}
      className={`flex items-center gap-4 px-8 py-6 transition-colors ${onClick ? 'cursor-pointer active:bg-slate-50' : ''}`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${destructive ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-[#2B3A67]'}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={`text-sm font-bold truncate ${destructive ? 'text-rose-500' : 'text-[#2B3A67]'}`}>{title}</h3>
        {subtitle && <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">{subtitle}</p>}
      </div>
      {action ? action : (
        <div className={`text-slate-200 ${language === 'ar' ? 'rotate-180' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      )}
    </div>
  );

  const handleExport = () => {
    showToast("Data exported to CSV (Simulated) 📤");
  };

  const handleLangChange = (code: Language) => {
    setLanguage(code);
    setShowLangPicker(false);
    showToast(code === 'ar' ? "تم تغيير اللغة" : "Language changed");
  };

  return (
    <div className={`p-6 min-h-full pb-32 transition-colors duration-500 ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-[#F1FAEE]'}`}>
      <header className="pt-8 mb-8 px-2 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-400 hover:text-[#2B3A67] transition-colors">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="text-3xl font-black text-[#2B3A67] tracking-tight">{t('settings')}</h1>
      </header>

      {/* SECTION 1: ACCOUNT */}
      <div 
        onClick={() => navigate('/profile')}
        className="bg-[#2B3A67] rounded-[48px] p-8 text-white mb-8 shadow-2xl shadow-[#2B3A67]/20 active:scale-[0.98] transition-all cursor-pointer group flex items-center gap-6"
      >
        <div className="w-20 h-20 bg-white/20 rounded-[32px] flex items-center justify-center text-3xl font-black">
          {userName ? userName.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-black tracking-tight truncate">{userName || 'User'}</h2>
          <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mt-1">Mastery Level {userLevel}</p>
        </div>
        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-all">
          <svg className={language === 'ar' ? 'rotate-180' : ''} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>

      {/* SECTION 2: GENERAL */}
      <Section title="General Preference">
        <SettingRow 
          icon={<Icons.Home />} 
          title="Dark Mode" 
          subtitle={isDarkMode ? "Enabled" : "Disabled"}
          action={
            <button 
              onClick={toggleDarkMode}
              className={`w-14 h-8 rounded-full transition-all relative ${isDarkMode ? 'bg-[#E63946]' : 'bg-slate-100'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${isDarkMode ? 'left-7' : 'left-1'}`} />
            </button>
          }
        />
        <SettingRow 
          icon={<Icons.People />} 
          title={t('language')} 
          subtitle={language === 'en' ? "English" : "العربية"}
          onClick={() => setShowLangPicker(true)}
        />
        <SettingRow 
          icon={<Icons.Tips />} 
          title="Notifications" 
          subtitle={notificationsEnabled ? "On" : "Off"}
          action={
            <button 
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-14 h-8 rounded-full transition-all relative ${notificationsEnabled ? 'bg-[#2B3A67]' : 'bg-slate-100'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${notificationsEnabled ? 'left-7' : 'left-1'}`} />
            </button>
          }
        />
      </Section>

      {/* SECTION 3: DATA MANAGEMENT */}
      <Section title="Data Engine">
        <SettingRow 
          icon={<Icons.Share />} 
          title="Export Data" 
          subtitle="Generate CSV Report" 
          onClick={handleExport}
        />
        <SettingRow 
          icon={<Icons.Tasks />} 
          title="Reset App Data" 
          subtitle="Nuclear Wipe" 
          destructive
          onClick={() => setShowResetConfirm(true)}
        />
      </Section>

      {/* SECTION 4: ABOUT */}
      <div className="text-center space-y-2 py-8 px-4 opacity-40">
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">FocusFlow v1.0.0</p>
        <p className="text-[10px] font-bold">Refined for high-performance students</p>
        <p className="text-[9px] font-medium pt-4">Made with ❤️ by Ahmed</p>
      </div>

      {/* LANGUAGE PICKER BOTTOMSHEET */}
      {showLangPicker && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[300] flex items-end justify-center">
           <div className="bg-white w-full max-w-md rounded-t-[48px] p-10 animate-in slide-in-from-bottom duration-300">
              <header className="mb-8">
                 <h2 className="text-2xl font-black text-[#2B3A67] tracking-tight">{t('language')}</h2>
                 <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mt-2">Select your preference</p>
              </header>

              <div className="space-y-4">
                 <button 
                  onClick={() => handleLangChange('en')}
                  className={`w-full p-6 rounded-[24px] flex items-center justify-between border-2 transition-all ${language === 'en' ? 'bg-[#2B3A67] border-[#2B3A67] text-white shadow-xl' : 'bg-zinc-50 border-zinc-50 text-zinc-600'}`}
                 >
                   <span className="font-bold">English</span>
                   {language === 'en' && <Icons.Check />}
                 </button>
                 <button 
                  onClick={() => handleLangChange('ar')}
                  className={`w-full p-6 rounded-[24px] flex items-center justify-between border-2 transition-all ${language === 'ar' ? 'bg-[#2B3A67] border-[#2B3A67] text-white shadow-xl' : 'bg-zinc-50 border-zinc-50 text-zinc-600'}`}
                 >
                   <span className="font-bold">العربية</span>
                   {language === 'ar' && <Icons.Check />}
                 </button>
              </div>

              <button 
                onClick={() => setShowLangPicker(false)}
                className="w-full mt-6 py-4 text-zinc-400 font-bold uppercase tracking-widest text-[10px]"
              >
                {t('cancel')}
              </button>
           </div>
        </div>
      )}

      {/* RESET CONFIRMATION MODAL */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-rose-900/40 backdrop-blur-xl z-[200] flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-sm rounded-[48px] p-10 animate-in zoom-in-95 duration-300 shadow-2xl text-center">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Are you sure?</h2>
              <p className="text-slate-500 text-sm mt-3 font-medium leading-relaxed">
                 This action is irreversible. All tasks, habits, stats, and victory logs will be permanently deleted.
              </p>
              
              <div className="space-y-3 mt-8">
                 <button 
                  onClick={clearAllData}
                  className="w-full bg-rose-500 text-white font-black py-5 rounded-[24px] shadow-lg shadow-rose-200 active:scale-95 transition-all text-xs uppercase tracking-widest"
                 >
                   Yes, Nuclear Reset
                 </button>
                 <button 
                  onClick={() => setShowResetConfirm(false)}
                  className="w-full py-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]"
                 >
                   {t('cancel')}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl animate-in slide-in-from-bottom-6 z-[300]">
          {toast}
        </div>
      )}
    </div>
  );
};

export default SettingsScreen;
