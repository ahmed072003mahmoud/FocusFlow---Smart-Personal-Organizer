
import React from 'react';
import { WeekMode } from '../types';
import { useApp } from '../AppContext';

interface WeeklySetupDialogProps {
  onComplete: () => void;
}

const WeeklySetupDialog: React.FC<WeeklySetupDialogProps> = ({ onComplete }) => {
  const { currentWeekMode, setWeekMode, t } = useApp();

  const RHYTHMS = [
    { id: WeekMode.STANDARD, title: t('mode_standard'), desc: t('mode_battle_standard'), icon: '⚖️', color: 'bg-slate-100', active: 'border-slate-400 bg-slate-50' },
    { id: WeekMode.LIGHT, title: t('mode_light'), desc: t('mode_battle_light'), icon: '🧘', color: 'bg-emerald-50', active: 'border-emerald-400 bg-emerald-100/50' },
    { id: WeekMode.CRUNCH, title: t('mode_crunch'), desc: t('mode_battle_crunch'), icon: '⚔️', color: 'bg-rose-50', active: 'border-rose-400 bg-rose-100/50' },
    { id: WeekMode.REVIEW, title: t('mode_review'), desc: t('mode_battle_review'), icon: '🔍', color: 'bg-indigo-50', active: 'border-indigo-400 bg-indigo-100/50' },
  ];

  return (
    <div className="fixed inset-0 bg-[#F1FAEE] z-[999] flex flex-col p-8 overflow-y-auto no-scrollbar animate-in fade-in duration-500">
      <header className="mt-12 mb-10">
        <h1 className="text-4xl font-black text-[#2B3A67] tracking-tight leading-tight">{t('newWeekTitle')}</h1>
        <p className="text-slate-500 font-medium mt-3">{t('setRhythm')}</p>
      </header>

      <div className="grid gap-4 flex-1">
        {RHYTHMS.map((r) => (
          <button
            key={r.id}
            onClick={() => setWeekMode(r.id)}
            className={`text-left p-6 rounded-[32px] border-2 transition-all flex items-center gap-5 ${
              currentWeekMode === r.id ? r.active : 'bg-white border-transparent shadow-sm'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${r.color}`}>{r.icon}</div>
            <div className="flex-1">
              <h3 className="font-black text-base text-slate-900">{r.title}</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-tight mt-0.5">{r.desc}</p>
            </div>
            {currentWeekMode === r.id && (
              <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-10 pb-12">
        <button onClick={onComplete} className="w-full bg-[#2B3A67] text-white font-black py-5 rounded-[24px] shadow-2xl text-sm uppercase tracking-[0.2em]">
          {t('beginJourney')}
        </button>
      </div>
    </div>
  );
};

export default WeeklySetupDialog;
