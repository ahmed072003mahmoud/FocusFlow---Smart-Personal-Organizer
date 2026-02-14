
import React, { useMemo, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Icons } from '../constants';
import { generateProductivityDNA } from '../utils/InsightEngine';

const StatsScreen: React.FC = () => {
  const { tasks, habits, challenges, joinChallenge, t, milestone, clearMilestone } = useApp();

  const dna = useMemo(() => generateProductivityDNA(tasks), [tasks]);

  useEffect(() => {
    if (milestone) {
      const timer = setTimeout(() => clearMilestone(), 6000);
      return () => clearTimeout(timer);
    }
  }, [milestone]);

  // Mock Weekly Data
  const weeklyData = [
    { label: 'Mon', value: 40 },
    { label: 'Tue', value: 80 },
    { label: 'Wed', value: 20 },
    { label: 'Thu', value: 90 },
    { label: 'Fri', value: 50 },
    { label: 'Sat', value: 30 },
    { label: 'Sun', value: 60 },
  ];

  const currentDay = 'Fri';

  return (
    <div className="p-6 space-y-8 pb-32 relative no-scrollbar">
      <header className="pt-8">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">{t('stats')}</h1>
        <p className="text-zinc-500 mt-1 font-medium">{t('visualize')}</p>
      </header>

      {/* MILESTONE NOTIFICATION */}
      {milestone && (
        <div className="bg-zinc-900 text-white p-6 rounded-[32px] flex items-center justify-between shadow-2xl animate-in slide-in-from-top-4 duration-500 mb-6 border border-white/10">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                 <Icons.Flame />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Milestone Unlocked</h3>
                <p className="text-sm font-bold mt-0.5">{milestone}</p>
              </div>
           </div>
           <button onClick={() => clearMilestone()} className="p-2 opacity-50">
              <Icons.Check />
           </button>
        </div>
      )}

      {/* PRODUCTIVITY DNA CARD */}
      <section className="animate-in fade-in duration-700">
        {dna.isLocked ? (
          <div className="bg-zinc-50 border-2 border-dashed border-zinc-200 p-8 rounded-[40px] flex flex-col items-center text-center space-y-6">
             <div className="w-14 h-14 bg-white border border-zinc-100 rounded-2xl flex items-center justify-center text-zinc-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
             </div>
             <div>
                <h2 className="text-xl font-black text-zinc-900 tracking-tight">Productivity DNA Locked</h2>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-2">Complete {5 - dna.completionCount} more tasks to unlock</p>
             </div>
             <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
                <div className="h-full bg-zinc-900 transition-all duration-1000" style={{ width: `${(dna.completionCount / 5) * 100}%` }} />
             </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 rounded-[40px] text-white space-y-8 shadow-2xl shadow-zinc-900/40 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 rotate-12 transition-transform group-hover:rotate-45 duration-1000">
                <Icons.AI />
             </div>

             <header>
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-6 h-[2px] bg-zinc-500" />
                   <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">My Productivity DNA</h2>
                </div>
                <h3 className="text-2xl font-black tracking-tight">The {dna.temporalProfile}</h3>
             </header>

             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                   <p className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-500">Peak Performance</p>
                   <p className="text-sm font-bold">{dna.peakDay}s</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-500">Focus Archetype</p>
                   <p className="text-sm font-bold">{dna.focusStyle}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-500">Core Domain</p>
                   <p className="text-sm font-bold">{dna.topCategory}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-500">Total Mastery</p>
                   <p className="text-sm font-bold">{dna.completionCount} Units</p>
                </div>
             </div>
             
             <div className="pt-4 flex items-center gap-2 text-[9px] font-bold text-zinc-500 italic opacity-60">
                <Icons.AI />
                Insights derived from your unique behavioral patterns.
             </div>
          </div>
        )}
      </section>

      {/* CHALLENGES SECTION */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Icons.Trophy />
          <h2 className="text-xl font-black text-zinc-900 tracking-tight">Active Challenges</h2>
        </div>

        <div className="space-y-4">
          {challenges.map((challenge) => {
            const progress = (challenge.currentStreak / challenge.targetDays) * 100;
            return (
              <div 
                key={challenge.id} 
                className={`p-6 rounded-[32px] border transition-all ${
                  challenge.isCompleted 
                    ? 'bg-amber-50 border-amber-200' 
                    : challenge.isActive 
                      ? 'bg-white border-zinc-200 shadow-lg' 
                      : 'bg-zinc-50 border-zinc-100'
                }`}
              >
                <header className="flex justify-between items-start mb-4">
                   <div className="flex-1 pr-4">
                      <h3 className={`font-black text-base ${challenge.isCompleted ? 'text-amber-900' : 'text-zinc-900'}`}>
                        {challenge.title}
                      </h3>
                      <p className="text-xs text-zinc-500 font-medium mt-1 leading-relaxed">
                        {challenge.description}
                      </p>
                   </div>
                   {challenge.isCompleted && <div className="text-amber-500"><Icons.Trophy /></div>}
                </header>

                {challenge.isActive || challenge.isCompleted ? (
                   <div className="space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                         <span className={challenge.isCompleted ? 'text-amber-600' : 'text-zinc-400'}>
                           {challenge.isCompleted ? 'Challenge Master' : `Day ${challenge.currentStreak} of ${challenge.targetDays}`}
                         </span>
                         <span className={challenge.isCompleted ? 'text-amber-600' : 'text-zinc-900'}>
                           {Math.round(progress)}%
                         </span>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${challenge.isCompleted ? 'bg-amber-100' : 'bg-zinc-100'}`}>
                         <div 
                          className={`h-full transition-all duration-1000 ${challenge.isCompleted ? 'bg-amber-500' : 'bg-zinc-900'}`} 
                          style={{ width: `${progress}%` }} 
                         />
                      </div>
                   </div>
                ) : (
                   <button 
                    onClick={() => joinChallenge(challenge.id)}
                    className="w-full bg-white border border-zinc-200 text-zinc-900 font-black py-3 rounded-2xl text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-sm"
                   >
                     Join Challenge
                   </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Weekly Activity */}
      <section className="bg-white p-6 rounded-[32px] border border-zinc-100 shadow-sm space-y-6">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t('weeklyActivity')}</h2>
        <div className="flex items-end justify-between h-40 pt-4 px-2">
          {weeklyData.map((day) => {
            const isToday = day.label === currentDay;
            return (
              <div key={day.label} className="flex flex-col items-center gap-3 w-8">
                <div className="w-full bg-zinc-50 rounded-lg relative h-32 overflow-hidden">
                  <div 
                    className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-out rounded-lg ${
                      isToday ? 'bg-zinc-900 shadow-lg' : 'bg-zinc-200'
                    }`}
                    style={{ height: `${day.value}%` }}
                  />
                </div>
                <span className={`text-[10px] font-bold ${isToday ? 'text-zinc-900' : 'text-zinc-400'}`}>
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <div className="text-center py-4">
        <p className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest">Keep pushing forward.</p>
      </div>
    </div>
  );
};

export default StatsScreen;
