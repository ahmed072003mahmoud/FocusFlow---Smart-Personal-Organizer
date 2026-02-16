
import React, { useMemo } from 'react';
import { useApp } from '../AppContext';
import { Icons } from '../constants';
import { useNavigate } from 'react-router-dom';

const ProfileScreen: React.FC = () => {
  const { userName, tasks, habits, challenges, successLogs, t } = useApp();
  const navigate = useNavigate();

  const totalDone = useMemo(() => tasks.filter(t => t.isCompleted).length, [tasks]);
  const userLevel = Math.floor(totalDone / 10) + 1;
  const nextLevelProgress = (totalDone % 10) / 10;
  
  const userTitle = useMemo(() => {
    if (userLevel <= 5) return t('novicePlanner');
    if (userLevel <= 15) return t('productivityNinja');
    return t('masterFocus');
  }, [userLevel, t]);

  const maxHabitStreak = useMemo(() => {
    if (habits.length === 0) return 0;
    return Math.max(...habits.map(h => h.streakCount));
  }, [habits]);

  return (
    <div className="min-h-screen bg-black p-8 pt-24 pb-40 space-y-12 animate-in fade-in duration-500 overflow-y-auto no-scrollbar">
      <header className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-zinc-600 hover:text-white transition-colors">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="system-caption text-zinc-500">{t('masteryProfile')}</h1>
        <div className="w-8" />
      </header>

      <section className="flex flex-col items-center text-center space-y-6">
        <div className="w-32 h-32 rounded-[50px] bg-zinc-900 border border-white/5 flex items-center justify-center text-5xl font-light text-white shadow-2xl relative">
          {userName?.charAt(0)}
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-black shadow-lg">
             <Icons.Check />
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-4xl font-light text-white tracking-tighter">{userName}</h2>
          <p className="system-caption text-zinc-600">{userTitle}</p>
        </div>
      </section>

      <section className="bg-zinc-950 border border-white/5 p-8 rounded-[40px] space-y-4 shadow-inner">
         <div className="flex justify-between items-end">
            <span className="text-sm font-bold text-white">{t('level')} {userLevel}</span>
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{(totalDone % 10)}/10 {t('units')}</span>
         </div>
         <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-1000 shadow-[0_0_15px_white]" 
              style={{ width: `${nextLevelProgress * 100}%` }}
            />
         </div>
      </section>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t('streak'), val: maxHabitStreak, icon: <Icons.Flame />, color: 'text-zinc-400' },
          { label: t('tasksDone'), val: totalDone, icon: <Icons.Tasks />, color: 'text-zinc-400' },
          { label: t('challengesWon'), val: challenges.filter(c => c.isCompleted).length, icon: <Icons.Trophy />, color: 'text-zinc-400' }
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-950 border border-white/5 p-6 rounded-[32px] text-center space-y-2">
            <div className={`mx-auto w-6 h-6 ${stat.color}`}>{stat.icon}</div>
            <p className="text-xl font-light text-white">{stat.val}</p>
            <p className="text-[8px] font-black text-zinc-700 uppercase tracking-tighter">{stat.label}</p>
          </div>
        ))}
      </div>

      <section className="space-y-8 pt-4">
         <h2 className="system-caption text-zinc-600 px-2">{t('victoryArchive')}</h2>
         <div className="space-y-4">
            {successLogs.length === 0 ? (
               <div className="p-12 text-center border border-zinc-900 border-dashed rounded-[40px] opacity-20 italic text-sm">
                  لا توجد انتصارات مؤرشفة بعد.
               </div>
            ) : (
               successLogs.map(log => (
                  <div key={log.id} className="bg-zinc-950 border border-white/5 p-8 rounded-[40px] flex items-center justify-between group hover:border-white/10 transition-all">
                     <div>
                        <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-2">
                           {new Date(log.date).toLocaleDateString()}
                        </p>
                        <h3 className="text-lg font-light text-white leading-none">{log.tasksCompleted} مهمة منجزة</h3>
                        <p className="text-xs text-zinc-500 mt-2 italic">"{log.secretSauce}"</p>
                     </div>
                     <div className="text-zinc-800 group-hover:text-white transition-colors">
                        <Icons.Check />
                     </div>
                  </div>
               ))
            )}
         </div>
      </section>
    </div>
  );
};

export default ProfileScreen;
