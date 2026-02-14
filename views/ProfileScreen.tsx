
import React, { useMemo } from 'react';
import { useApp } from '../AppContext';
import { Icons } from '../constants';
import { useNavigate } from 'react-router-dom';

const ProfileScreen: React.FC = () => {
  const { userName, tasks, habits, challenges, successLogs, t } = useApp();
  const navigate = useNavigate();

  const totalDone = useMemo(() => tasks.filter(t => t.isCompleted).length, [tasks]);
  
  // Level Logic
  const userLevel = Math.floor(totalDone / 10) + 1;
  const nextLevelProgress = (totalDone % 10) / 10;
  
  const userTitle = useMemo(() => {
    if (userLevel <= 5) return "Novice Planner";
    if (userLevel <= 15) return "Productivity Ninja";
    return "Master of Focus";
  }, [userLevel]);

  const maxHabitStreak = useMemo(() => {
    if (habits.length === 0) return 0;
    return Math.max(...habits.map(h => h.streakCount));
  }, [habits]);

  const challengesWon = useMemo(() => challenges.filter(c => c.isCompleted).length, [challenges]);

  return (
    <div className="p-6 space-y-8 pb-32 min-h-full bg-white animate-in fade-in duration-500">
      <header className="pt-8 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-zinc-400 hover:text-zinc-900 transition-colors">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="text-xl font-black text-zinc-900 tracking-tight uppercase">Mastery Profile</h1>
        <div className="w-8" /> 
      </header>

      {/* HEADER SECTION */}
      <section className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="w-28 h-28 bg-zinc-900 rounded-[40px] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-zinc-900/20">
            {userName ? userName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white border-4 border-zinc-50 p-2 rounded-2xl shadow-lg">
             <Icons.Check />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight">{userName || 'Explorer'}</h2>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-1">{userTitle}</p>
        </div>
      </section>

      {/* LEVEL BAR */}
      <section className="bg-zinc-50 border border-zinc-100 p-8 rounded-[40px] space-y-4">
        <div className="flex justify-between items-end">
           <span className="text-sm font-black text-zinc-900">Level {userLevel}</span>
           <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{totalDone % 10}/10 Tasks for Level {userLevel + 1}</span>
        </div>
        <div className="w-full h-4 bg-zinc-200 rounded-full overflow-hidden shadow-inner">
           <div 
             className="h-full bg-zinc-900 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.15)] transition-all duration-1000" 
             style={{ width: `${nextLevelProgress * 100}%` }}
           />
        </div>
      </section>

      {/* STATS GRID */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-zinc-100 p-4 rounded-[28px] text-center space-y-1 shadow-sm">
           <div className="text-orange-500 mb-2 flex justify-center"><Icons.Flame /></div>
           <p className="text-lg font-black">{maxHabitStreak}</p>
           <p className="text-[8px] font-black text-zinc-400 uppercase tracking-tighter">Day Streak</p>
        </div>
        <div className="bg-white border border-zinc-100 p-4 rounded-[28px] text-center space-y-1 shadow-sm">
           <div className="text-zinc-900 mb-2 flex justify-center"><Icons.Tasks /></div>
           <p className="text-lg font-black">{totalDone}</p>
           <p className="text-[8px] font-black text-zinc-400 uppercase tracking-tighter">Tasks Done</p>
        </div>
        <div className="bg-white border border-zinc-100 p-4 rounded-[28px] text-center space-y-1 shadow-sm">
           <div className="text-amber-500 mb-2 flex justify-center"><Icons.Trophy /></div>
           <p className="text-lg font-black">{challengesWon}</p>
           <p className="text-[8px] font-black text-zinc-400 uppercase tracking-tighter">Challenges</p>
        </div>
      </div>

      {/* VICTORY ARCHIVE SECTION */}
      <section className="space-y-6 pt-4">
         <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
               <span className="text-amber-500">🌟</span>
               <h2 className="text-xl font-black text-zinc-900 tracking-tight">Victory Archive</h2>
            </div>
            <span className="bg-amber-100 text-amber-700 text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">
               {successLogs.length} Wins
            </span>
         </div>

         <div className="space-y-4">
            {successLogs.length === 0 ? (
               <div className="text-center py-10 bg-zinc-50 border border-zinc-100 border-dashed rounded-[32px]">
                  <p className="text-xs font-bold text-zinc-400 px-8">No victories archived yet. Crush 80% of your day to log a win!</p>
               </div>
            ) : (
               successLogs.map(log => (
                  <div key={log.id} className="bg-gradient-to-br from-white to-amber-50/50 border border-amber-100 p-6 rounded-[32px] shadow-sm flex items-center justify-between">
                     <div className="flex-1">
                        <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest mb-1">
                           {new Date(log.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <h3 className="text-sm font-black text-[#2B3A67]">{log.tasksCompleted} Tasks Crushed</h3>
                        <p className="text-xs text-slate-500 mt-1 font-medium italic">"Fueled by: {log.secretSauce}"</p>
                     </div>
                     <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-400/20 text-white">
                        <Icons.Check />
                     </div>
                  </div>
               ))
            )}
         </div>
         {successLogs.length > 0 && (
           <p className="text-center text-[9px] font-black text-amber-600/40 uppercase tracking-widest">Keep doing what works to repeat success!</p>
         )}
      </section>

      {/* TROPHY ROOM */}
      <section className="space-y-6 pt-4">
         <div className="flex items-center gap-2 px-2">
            <h2 className="text-xl font-black text-zinc-900 tracking-tight">Trophy Room</h2>
         </div>

         <div className="grid grid-cols-3 gap-4">
            {challenges.map(c => (
              <div 
                key={c.id}
                className={`aspect-square rounded-[32px] border flex flex-col items-center justify-center p-4 transition-all ${
                  c.isCompleted 
                  ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl shadow-zinc-900/10' 
                  : 'bg-zinc-50 border-zinc-100 text-zinc-200 border-dashed'
                }`}
              >
                 <div className={c.isCompleted ? 'scale-110' : 'opacity-30'}>
                    <Icons.Trophy />
                 </div>
                 {c.isCompleted && (
                   <span className="text-[7px] font-black uppercase tracking-widest mt-2 text-center leading-tight">
                     {c.title.split(' ')[0]}
                   </span>
                 )}
              </div>
            ))}
         </div>
      </section>

      <div className="pt-8 text-center">
         <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.2em] leading-relaxed">
            Continuity is the mother of mastery. <br/>
            Your productivity DNA is evolving.
         </p>
      </div>
    </div>
  );
};

export default ProfileScreen;
