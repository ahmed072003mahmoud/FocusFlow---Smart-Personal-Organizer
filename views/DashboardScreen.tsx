
import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Icons } from '../constants';
import { Category, Task, Priority, WeekMode } from '../types';
import { useNavigate } from 'react-router-dom';
import TaskCard from '../components/TaskCard';
import { MindfulBreak } from '../components/MindfulBreak';

const DashboardScreen: React.FC = () => {
  const { 
    tasks, toggleTask, toggleTaskTimer, addTask, 
    organizeMyDay, t, dailyIntention, isSurvivalMode, isBadDayMode,
    toggleBadDayMode, currentWeekMode, weekStartDate, victoryDayPending,
    dismissVictory, dailyAvailableMinutes, setDailyIntention,
    milestone, clearMilestone, autoBalance, overloadInfo, toggleZenMode,
    isFlowStateActive, toggleFlowState
  } = useApp();
  
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrganizing, setIsOrganizing] = useState(false);
  const [showBreak, setShowBreak] = useState(false);
  const [formTitle, setFormTitle] = useState('');

  // Auto-break logic
  useEffect(() => {
    const interval = setInterval(() => {
      const activeTimer = tasks.find(t => t.isRunning);
      if (activeTimer) {
        const start = new Date(activeTimer.timerStartedAt!).getTime();
        const now = new Date().getTime();
        if ((now - start) >= 2700000) { // 45 mins
          setShowBreak(true);
        }
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [tasks]);

  const { energyPercent } = useMemo(() => {
    const uncompletedTasks = tasks.filter(t => !t.isCompleted);
    const totalLoad = uncompletedTasks.reduce((acc, task) => {
      const weight = task.priority === Priority.HIGH ? 1.5 : 1.0;
      return acc + (task.estimatedMinutes * weight);
    }, 0);
    const percent = Math.max(0, ((dailyAvailableMinutes - totalLoad) / dailyAvailableMinutes) * 100);
    return { energyPercent: Math.round(percent) };
  }, [tasks, dailyAvailableMinutes]);

  const sortedTasks = useMemo(() => {
    let base = [...tasks];
    if (isBadDayMode) return base.filter(t => t.isWorship || t.priority === Priority.HIGH || t.isCompleted);
    return base;
  }, [tasks, isBadDayMode]);

  const handleSave = () => {
    if (!formTitle.trim()) return;
    addTask({ title: formTitle, isCompleted: false, category: Category.OTHER, estimatedMinutes: 30, priority: Priority.NORMAL, deadline: new Date().toISOString() });
    setIsModalOpen(false);
    setFormTitle('');
  };

  if (showBreak) return <MindfulBreak onComplete={() => setShowBreak(false)} />;

  return (
    <div className={`min-h-full pb-32 transition-all duration-1000 ${isBadDayMode ? 'bg-orange-50' : 'bg-[#F8F9FA] dark:bg-darkBg'}`}>
      
      {milestone && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top duration-500">
           <div className="bg-[#2B3A67] text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-4">
              <Icons.AI />
              <span className="text-sm font-bold">{milestone}</span>
              <button onClick={clearMilestone} className="ml-2 opacity-50">✕</button>
           </div>
        </div>
      )}

      <header className="relative pt-16 pb-24 px-6 bg-[#2B3A67] rounded-b-[48px] shadow-lg parallax-bg">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-start mb-4">
             <div className="flex-1">
                <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
                  {isFlowStateActive ? "You're in Flow State" : (isBadDayMode ? t('justBreathe') : t('goodMorning'))}
                </h1>
                <p className="text-white/50 text-[10px] font-bold mt-2 tracking-wide italic opacity-80 uppercase">
                  {isFlowStateActive ? "Time is an illusion. Focus on the output." : currentWeekMode + " Mode"}
                </p>
             </div>
             <div className="flex gap-2">
               <button onClick={toggleFlowState} className={`p-3 glass rounded-2xl transition-all ${isFlowStateActive ? 'bg-emerald-500/20 text-emerald-300' : 'text-white'}`}>
                  {isFlowStateActive ? '🧘' : '🌊'}
               </button>
               <button onClick={() => toggleBadDayMode(!isBadDayMode)} className={`p-3 glass rounded-2xl transition-all ${isBadDayMode ? 'text-amber-400 bg-amber-400/20' : 'text-white'}`}><Icons.Coffee /></button>
             </div>
          </div>
        </div>

        {!isFlowStateActive && (
          <div className="absolute -bottom-10 left-6 right-6 glass p-6 rounded-[32px] shadow-xl flex flex-col items-center text-center max-w-xl mx-auto">
            <h2 className="text-sm font-bold italic text-white line-clamp-1">"{dailyIntention || t('whatIsFocus')}"</h2>
          </div>
        )}
      </header>

      <div className="px-6 mt-20 space-y-12 max-w-4xl mx-auto">
        {!isFlowStateActive && (
          <section className="animate-in fade-in duration-700">
            <div className={`p-6 rounded-[32px] border-2 transition-all ${overloadInfo.isOverloaded ? 'bg-rose-50 border-rose-100 shadow-rose-100/50' : 'bg-white dark:bg-zinc-900 border-slate-50 dark:border-white/5 shadow-sm'}`}>
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300">{t('energyMeter')}</h3>
                 <span className="text-lg font-black text-[#2B3A67] dark:text-white">{energyPercent}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${energyPercent < 25 ? 'bg-[#E63946]' : 'bg-emerald-500'}`} style={{ width: `${energyPercent}%` }} />
              </div>
              {overloadInfo.isOverloaded && (
                <button onClick={() => autoBalance()} className="mt-4 w-full bg-[#E63946] text-white py-3 rounded-2xl text-[8px] font-black uppercase tracking-widest">BALANCE NOW</button>
              )}
            </div>
          </section>
        )}

        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black text-[#2B3A67] dark:text-white tracking-tight">Timeline</h2>
            {!isFlowStateActive && (
              <button onClick={() => organizeMyDay()} className="bg-[#2B3A67] text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">AI Optimize</button>
            )}
          </div>
          
          <div className="space-y-4">
            {sortedTasks.length === 0 ? (
               <div className="text-center py-20 opacity-30">
                  <span className="text-4xl">🌤️</span>
                  <p className="mt-4 font-black uppercase tracking-widest text-[10px]">All clear. Enjoy your peace.</p>
               </div>
            ) : (
              sortedTasks.map((task) => (
                <TaskCard key={task.id} task={task} onToggle={toggleTask} onTimer={toggleTaskTimer} onZen={toggleZenMode} t={t} />
              ))
            )}
          </div>
        </section>
      </div>

      <div className="fixed bottom-10 right-8 z-[80]">
           <button onClick={() => setIsModalOpen(true)} className="w-18 h-18 bg-[#E63946] text-white rounded-[24px] flex items-center justify-center shadow-2xl shadow-[#E63946]/40 hover:scale-110 active:scale-90 transition-transform"><Icons.Plus /></button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 animate-in slide-in-from-bottom duration-300">
            <h2 className="text-2xl font-black text-[#2B3A67] mb-6">Capture</h2>
            <input autoFocus type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold focus:outline-none" />
            <div className="flex gap-4 pt-8">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Cancel</button>
              <button onClick={handleSave} className="flex-[2] bg-[#E63946] text-white font-black py-5 rounded-[24px] shadow-xl uppercase text-[10px] tracking-widest">Commit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardScreen;
