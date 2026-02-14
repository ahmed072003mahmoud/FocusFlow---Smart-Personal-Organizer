
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icons } from '../constants';
import { Language } from '../types';

const SettingsScreen: React.FC = () => {
  const { 
    userName, notificationsEnabled, setNotificationsEnabled, isDarkMode, 
    toggleDarkMode, language, setLanguage, clearAllData, t, tasks 
  } = useApp();
  
  const navigate = useNavigate();
  const location = useLocation();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const totalDone = tasks.filter(t => t.isCompleted).length;
  const userLevel = Math.floor(totalDone / 10) + 1;

  // Stability Fix: Ensure back button always has a destination
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-4 mb-8">
      <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-8">{title}</h2>
      <div className="bg-white rounded-[32px] overflow-hidden border border-slate-50 shadow-sm mx-4">
        <div className="divide-y divide-slate-50">{children}</div>
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
    <div onClick={onClick} className={`flex items-center gap-4 px-8 py-5 transition-colors ${onClick ? 'cursor-pointer active:bg-slate-50' : ''}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${destructive ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-[#2B3A67]'}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={`text-sm font-bold truncate ${destructive ? 'text-rose-500' : 'text-[#2B3A67]'}`}>{title}</h3>
        {subtitle && <p className="text-[9px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">{subtitle}</p>}
      </div>
      {action ? action : <div className="text-slate-200">→</div>}
    </div>
  );

  return (
    <div className="p-6 min-h-full pb-32 bg-[#F8F9FA]">
      <header className="pt-8 mb-8 flex items-center gap-4 px-2">
        <button onClick={handleBack} className="p-2 -ml-2 text-slate-400">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="text-2xl font-black text-[#2B3A67] tracking-tight">{t('settings')}</h1>
      </header>

      <div onClick={() => navigate('/profile')} className="bg-[#2B3A67] rounded-[32px] p-6 text-white mb-8 shadow-xl mx-4 flex items-center gap-4">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-black">
          {userName?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-black truncate">{userName || 'User'}</h2>
          <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mt-1">Level {userLevel}</p>
        </div>
      </div>

      <Section title="Preference">
        <SettingRow 
          icon={<Icons.Home />} 
          title="Dark Mode" 
          subtitle={isDarkMode ? "On" : "Off"}
          action={
            <button onClick={toggleDarkMode} className={`w-12 h-6 rounded-full relative transition-all ${isDarkMode ? 'bg-[#E63946]' : 'bg-slate-100'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'left-7' : 'left-1'}`} />
            </button>
          }
        />
        <SettingRow icon={<Icons.People />} title={t('language')} subtitle={language === 'en' ? "English" : "العربية"} onClick={() => setShowLangPicker(true)} />
      </Section>

      <Section title="Data">
        <SettingRow icon={<Icons.Tasks />} title="Reset All Data" destructive onClick={() => setShowResetConfirm(true)} />
      </Section>

      {showLangPicker && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[300] flex items-end justify-center">
           <div className="bg-white w-full max-w-md rounded-t-[40px] p-10 animate-in slide-in-from-bottom duration-300">
              <h2 className="text-xl font-black text-[#2B3A67] mb-6">{t('language')}</h2>
              <div className="space-y-4 mb-8">
                 <button onClick={() => { setLanguage('en'); setShowLangPicker(false); }} className={`w-full p-5 rounded-2xl border-2 ${language === 'en' ? 'bg-[#2B3A67] text-white' : 'bg-zinc-50 text-zinc-600'}`}>English</button>
                 <button onClick={() => { setLanguage('ar'); setShowLangPicker(false); }} className={`w-full p-5 rounded-2xl border-2 ${language === 'ar' ? 'bg-[#2B3A67] text-white' : 'bg-zinc-50 text-zinc-600'}`}>العربية</button>
              </div>
           </div>
        </div>
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[300] flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-sm rounded-[40px] p-10 text-center animate-in zoom-in-95 duration-300">
              <h2 className="text-xl font-black mb-4">Are you sure?</h2>
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
