
import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Icons } from '../constants';
import { Category, Task, Priority } from '../types';
import { useNavigate } from 'react-router-dom';
import { SmartTaskParser } from '../utils/SmartTaskParser';

const VICTORY_CHIPS = [
  "😴 Good Sleep",
  "📵 No Social Media",
  "🌅 Early Start",
  "🧘 Focused Mind",
  "⚡ High Energy",
  "☕ Perfect Caffeine"
];

const DashboardScreen: React.FC = () => {
  const { 
    userName, tasks, toggleTask, toggleTaskTimer, addTask, updateTask, 
    organizeMyDay, overloadInfo, autoBalance, toggleSurvivalMode, 
    isSurvivalMode, isBadDayMode, toggleBadDayMode, t, dailyIntention, 
    setDailyIntention, realityCheck, clearRealityCheck, 
    victoryDayPending, saveSuccessLog, dismissVictory
  } = useApp();
  
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickInput, setQuickInput] = useState('');
  
  const [isIntentionModalOpen, setIsIntentionModalOpen] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isBalanceDialogOpen, setIsBalanceDialogOpen] = useState(false);
  const [isBadDayConfirmOpen, setIsBadDayConfirmOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [athkarTask, setAthkarTask] = useState<Task | null>(null);
  const [toast, setToast] = useState<{ message: string; action?: () => void; actionLabel?: string } | null>(null);
  const [quickWinTask, setQuickWinTask] = useState<Task | null>(null);
  
  const [formTitle, setFormTitle] = useState('');
  const [formDeadline, setFormDeadline] = useState(new Date().toISOString().slice(0, 16));
  const [formCategory, setFormCategory] = useState<Category>(Category.STUDY);
  const [formDuration, setFormDuration] = useState(30);
  const [intentionInput, setIntentionInput] = useState(dailyIntention || '');

  // Responsive state
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 800);
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 800);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sortedTasks = useMemo(() => {
    let base = [...tasks].sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
      if (a.scheduledTime && b.scheduledTime) {
        return new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();
      }
      return b.priorityScore - a.priorityScore;
    });

    if (isBadDayMode) return base.filter(t => t.isWorship || t.priorityScore > 80 || t.isCompleted);
    if (isSurvivalMode) {
      const uncompleted = base.filter(t => !t.isCompleted).slice(0, 3);
      const completed = base.filter(t => t.isCompleted);
      return [...uncompleted, ...completed];
    }
    return base;
  }, [tasks, isSurvivalMode, isBadDayMode]);

  const todoCount = tasks.filter(t => !t.isCompleted).length;

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleQuickWin = () => {
    const uncompleted = tasks.filter(t => !t.isCompleted);
    if (uncompleted.length === 0) {
      showToast("You're free! Enjoy your time ☕");
      return;
    }
    const sorted = [...uncompleted].sort((a, b) => a.estimatedMinutes - b.estimatedMinutes);
    setQuickWinTask(sorted[0]);
  };

  const handleOrganize = async () => {
    setIsOptimizing(true);
    await organizeMyDay();
    setIsOptimizing(false);
    showToast("Day optimized! 🚀");
  };

  const handleAutoBalance = () => {
    autoBalance(overloadInfo.suggestedToPostpone);
    setIsBalanceDialogOpen(false);
    showToast("Schedule balanced. Breathe! 🧘");
  };

  const handleSaveIntention = () => {
    setDailyIntention(intentionInput);
    setIsIntentionModalOpen(false);
    showToast("Focus set for today.");
  };

  const handleMagicParse = () => {
    if (!quickInput.trim()) return;
    const parsed = SmartTaskParser.parse(quickInput);
    setFormTitle(parsed.title || '');
    setFormDeadline(new Date(parsed.deadline || new Date().toISOString()).toISOString().slice(0, 16));
    setFormCategory(parsed.category || Category.OTHER);
    setFormDuration(parsed.estimatedMinutes || 30);
    setEditingTask(null);
    setIsQuickAddOpen(false);
    setIsModalOpen(true);
    setQuickInput('');
  };

  const handleSave = () => {
    if (!formTitle.trim()) return;
    const taskData = {
      title: formTitle,
      isCompleted: false,
      deadline: new Date(formDeadline).toISOString(),
      category: formCategory,
      estimatedMinutes: formDuration,
    };

    if (editingTask) {
      updateTask({ ...editingTask, ...taskData });
    } else {
      addTask(taskData);
    }
    
    setIsModalOpen(false);
    setFormTitle('');
  };

  const getPriorityTag = (score: number) => {
    if (score > 70) return { label: '🔥 Urgent', class: 'bg-rose-50 text-rose-600' };
    if (score > 40) return { label: '⚡ Important', class: 'bg-amber-50 text-amber-700' };
    return { label: '📝 Normal', class: 'bg-slate-50 text-slate-500' };
  };

  const formatScheduledTime = (iso?: string) => {
    if (!iso) return null;
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const excessHours = (overloadInfo.excessMinutes / 60).toFixed(1);

  return (
    <div className={`min-h-full pb-32 transition-colors duration-1000 ${
      isBadDayMode ? 'bg-[#FAF3E0]' : isSurvivalMode ? 'bg-[#F1FAEE]/50' : 'bg-transparent'
    }`}>
      
      {/* VICTORY LOG MODAL */}
      {victoryDayPending && (
        <div className="fixed inset-0 bg-[#2B3A67]/90 backdrop-blur-2xl z-[500] flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-sm rounded-[48px] p-10 animate-in zoom-in-95 duration-500 shadow-2xl text-center border-4 border-amber-400">
              <header className="mb-8">
                 <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl shadow-xl animate-bounce">
                    🎉
                 </div>
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight">You were on fire! 🔥</h2>
                 <p className="text-slate-500 text-sm mt-3 font-medium">
                    You've crushed 80%+ of your day. What was your secret sauce today?
                 </p>
              </header>

              <div className="flex flex-wrap gap-2 justify-center mb-10">
                 {VICTORY_CHIPS.map(chip => (
                   <button 
                    key={chip}
                    onClick={() => saveSuccessLog(chip)}
                    className="px-4 py-2.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 active:scale-95 transition-all shadow-sm"
                   >
                    {chip}
                   </button>
                 ))}
                 <button 
                  onClick={() => saveSuccessLog("Pure Grit")}
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 active:scale-95 transition-all"
                 >
                   Other...
                 </button>
              </div>

              <button 
                onClick={dismissVictory}
                className="w-full py-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]"
              >
                 Don't log this time
              </button>
           </div>
        </div>
      )}

      {/* REALITY CHECK MODAL */}
      {realityCheck && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[400] flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-sm rounded-[48px] p-8 animate-in zoom-in-95 duration-500 shadow-2xl text-center">
              <header className="mb-8">
                 <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                    {realityCheck.type === 'fallacy' ? '🐢' : '🚀'}
                 </div>
                 <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {realityCheck.type === 'fallacy' ? 'Planning Fallacy!' : 'Efficiency Beast!'}
                 </h2>
                 <p className="text-slate-500 text-sm mt-2 font-medium">
                    {realityCheck.type === 'fallacy' 
                       ? `You took ${realityCheck.actual}m instead of ${realityCheck.estimated}m. Next time, let's plan for more buffer.`
                       : `Speedy! You finished in ${realityCheck.actual}m, saving ${realityCheck.estimated - realityCheck.actual}m.`
                    }
                 </p>
              </header>
              <button 
                onClick={clearRealityCheck}
                className="w-full bg-slate-900 text-white font-black py-5 rounded-[24px] shadow-xl active:scale-[0.98] transition-all text-[10px] uppercase tracking-widest"
              >
                 I'll Adjust
              </button>
           </div>
        </div>
      )}

      {/* PREMIUM HEADER */}
      <header className={`relative transition-all duration-1000 pt-16 pb-24 px-6 ${
        isBadDayMode 
          ? 'bg-gradient-to-br from-[#8D99AE] to-[#ADC178]' 
          : 'bg-gradient-to-br from-[#2B3A67] to-[#496A9A]'
      } ${isDesktop ? 'rounded-[48px] mt-6 mx-6 mb-12 shadow-2xl' : 'rounded-b-[48px] shadow-lg'} shadow-[0_20px_40px_rgba(43,58,103,0.2)]`}>
        <div className={`flex justify-between items-start mb-4 max-w-5xl mx-auto`}>
          <div className="animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className={`${isDesktop ? 'text-4xl' : 'text-3xl'} font-black text-white tracking-tight leading-tight`}>
              {isBadDayMode 
                ? "It's okay to have a slow day. Just breathe. 🍃" 
                : `${t('dashboard_title')}, ${userName || 'Friend'}`}
            </h1>
            <div className="flex gap-2 mt-4">
              <button 
                onClick={toggleSurvivalMode}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full glass transition-all ${
                  isSurvivalMode ? 'bg-white/20' : 'bg-transparent hover:bg-white/10'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
                  {isSurvivalMode ? '🌱 Survival Mode' : '🌊 Flow State'}
                </span>
              </button>
              {isBadDayMode && (
                <button 
                  onClick={() => toggleBadDayMode(false)}
                  className="px-4 py-1.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-widest"
                >
                  Exit Slow Mode
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsBadDayConfirmOpen(true)}
              className={`p-3 glass rounded-2xl text-white transition-all ${isBadDayMode ? 'bg-white/30 border-white/40 shadow-inner scale-95' : 'hover:bg-white/20'}`}
            >
              <Icons.Coffee />
            </button>
            <button 
              onClick={() => navigate('/settings')} 
              className={`p-3 glass rounded-2xl text-white hover:bg-white/20 transition-all`}
            >
              <Icons.Gear />
            </button>
            {!isDesktop && (
               <button onClick={() => navigate('/buddy')} className="p-3 glass rounded-2xl text-white hover:bg-white/20 transition-all">
                  <Icons.People />
               </button>
            )}
            <button 
              onClick={() => navigate('/profile')} 
              className={`p-1 glass rounded-2xl shadow-lg active:scale-95 transition-all ${isDesktop ? 'hover:scale-105' : ''}`}
            >
              <div className="w-10 h-10 flex items-center justify-center font-black text-white bg-[#E63946] rounded-xl shadow-lg">
                {userName?.charAt(0).toUpperCase() || 'U'}
              </div>
            </button>
          </div>
        </div>

        {/* FLOATING INTENTION CARD */}
        <div 
          onClick={() => { setIntentionInput(dailyIntention || ''); setIsIntentionModalOpen(true); }}
          className={`absolute -bottom-10 left-6 right-6 glass p-6 rounded-[32px] shadow-xl cursor-pointer group flex flex-col items-center text-center space-y-2 hover:scale-[1.02] transition-transform max-w-xl mx-auto`}
        >
          <span className="text-xl">{dailyIntention ? '🧘' : '✨'}</span>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">Daily Focus</p>
          <h2 className="text-sm font-bold italic tracking-tight text-white line-clamp-1 px-4">
            {dailyIntention ? `"${dailyIntention}"` : 'What is your focus today?'}
          </h2>
        </div>
      </header>

      <div className={`px-6 mt-20 space-y-8 ${isDesktop ? 'max-w-4xl mx-auto' : ''}`}>
        
        {/* DECISION BREAKER BUTTON */}
        {todoCount > 1 && !isBadDayMode && (
          <div className="flex justify-center animate-in zoom-in-95 fade-in duration-700 delay-300">
            <button 
              onClick={handleQuickWin}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-full shadow-sm hover:shadow-md active:scale-95 transition-all group"
            >
              <span className="text-lg group-hover:rotate-12 transition-transform">🤷‍♂️</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#2B3A67]">{t('tasks')}?</span>
            </button>
          </div>
        )}

        {/* OVERLOAD WARNING */}
        {overloadInfo.isOverloaded && !isSurvivalMode && !isBadDayMode && (
          <section className="animate-in zoom-in-95 fade-in duration-500">
            <div className="bg-[#E63946]/5 border border-[#E63946]/10 rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="flex items-start gap-4 flex-1">
                  <div className="p-4 bg-white rounded-2xl text-[#E63946] shadow-sm animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                  </div>
                  <div>
                    <h3 className="text-[#E63946] font-black text-sm uppercase tracking-tight">System Overload</h3>
                    <p className="text-slate-500 text-xs font-medium mt-1 leading-relaxed">
                      You are over by <b>{excessHours}h</b>. Let's optimize to restore flow.
                    </p>
                  </div>
              </div>
              <button 
                onClick={() => setIsBalanceDialogOpen(true)}
                className="w-full md:w-auto px-8 bg-[#E63946] text-white font-black py-4 rounded-[20px] shadow-lg shadow-[#E63946]/20 active:scale-[0.98] transition-all text-[10px] uppercase tracking-widest"
              >
                Auto-Balance
              </button>
            </div>
          </section>
        )}

        {/* TIMELINE SECTION */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-8 rounded-full ${isBadDayMode ? 'bg-[#ADC178]' : 'bg-[#E63946]'}`} />
            <h2 className={`${isDesktop ? 'text-3xl' : 'text-2xl'} font-black text-[#2B3A67] tracking-tight`}>
              {isBadDayMode ? 'Essential Focus Only' : isSurvivalMode ? 'Survival Focus' : t('timeline')}
            </h2>
          </div>
          
          <div className="space-y-4">
            {sortedTasks.map((task) => {
              const tag = getPriorityTag(task.priorityScore);
              const scheduled = formatScheduledTime(task.scheduledTime);
              const isWorship = task.isWorship;

              return (
                <div key={task.id} className="group relative">
                  <div 
                    onClick={() => {
                      if (isWorship && !task.isCompleted) {
                         setAthkarTask(task);
                      } else {
                        setEditingTask(task);
                        setFormTitle(task.title);
                        setFormDeadline(new Date(task.deadline).toISOString().slice(0, 16));
                        setFormCategory(task.category);
                        setFormDuration(task.estimatedMinutes);
                        setIsModalOpen(true);
                      }
                    }}
                    className={`p-6 rounded-[32px] bg-white shadow-lg border-2 transition-all cursor-pointer flex justify-between items-center ${
                      task.isRunning 
                        ? 'border-emerald-500 shadow-emerald-200/50 scale-[1.02]' 
                        : 'border-transparent shadow-slate-200/50 hover:shadow-xl hover:scale-[1.01]'
                    } ${task.isCompleted ? 'opacity-40 grayscale scale-95 origin-left' : ''}`}
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2 mb-2">
                        {task.isRunning && (
                          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Recording Focus
                          </span>
                        )}
                        {!task.isRunning && isWorship ? (
                          <span className="text-teal-600"><Icons.Mosque /></span>
                        ) : (
                          !task.isRunning && <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${tag.class}`}>
                            {tag.label}
                          </span>
                        )}
                        {scheduled && !task.isCompleted && (
                          <span className="text-[8px] font-black px-2 py-0.5 rounded-md uppercase bg-slate-100 text-[#2B3A67]">
                            {scheduled}
                          </span>
                        )}
                      </div>
                      <h3 className={`font-bold text-lg truncate text-[#2B3A67]`}>
                        {task.title}
                      </h3>
                      <p className="text-[10px] font-black mt-1 text-slate-400 uppercase tracking-widest">
                        {task.actualMinutes > 0 ? `${task.actualMinutes}m / ` : ''}{task.estimatedMinutes}m • {task.category}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {!task.isCompleted && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleTaskTimer(task.id); }}
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                            task.isRunning 
                              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
                              : 'bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-500'
                          }`}
                        >
                          {task.isRunning ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                          )}
                        </button>
                      )}
                      
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if (isWorship && !task.isCompleted) setAthkarTask(task);
                          else toggleTask(task.id); 
                        }}
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                          task.isCompleted 
                            ? isBadDayMode ? 'bg-[#ADC178] border-[#ADC178]' : 'bg-[#E63946] border-[#E63946]'
                            : 'border-slate-200 bg-white hover:border-[#E63946]/50'
                        }`}
                      >
                        {task.isCompleted ? (
                          <Icons.Check />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {isBadDayMode && (
          <div className="bg-[#ADC178]/10 border border-[#ADC178]/20 p-6 rounded-[32px] text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ADC178]">
                Notifications silenced. Focus on yourself.
             </p>
          </div>
        )}
      </div>

      {/* FABs */}
      {!isSurvivalMode && !isBadDayMode && (
        <div className={`fixed ${isDesktop ? 'bottom-8 right-8' : 'bottom-32 right-8'} flex flex-col gap-4 items-center z-40`}>
           <button 
            onClick={() => { setQuickInput(''); setIsQuickAddOpen(true); }}
            className="w-14 h-14 bg-white text-[#2B3A67] border border-slate-200 rounded-[20px] flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-transform"
           >
              <Icons.AI />
           </button>
           <button 
            onClick={() => { setEditingTask(null); setFormTitle(''); setIsModalOpen(true); }}
            className="w-18 h-18 bg-[#E63946] text-white rounded-[24px] flex items-center justify-center shadow-2xl shadow-[#E63946]/30 hover:scale-110 active:scale-90 transition-transform"
           >
            <Icons.Plus />
           </button>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className={`fixed ${isDesktop ? 'bottom-8 left-1/2' : 'bottom-32 left-1/2'} -translate-x-1/2 w-[90%] max-w-sm bg-zinc-900 text-white px-6 py-5 rounded-[24px] shadow-2xl animate-in slide-in-from-bottom-6 z-[120] flex items-center justify-between`}>
          <span className="text-xs font-bold tracking-wide">{toast.message}</span>
          <Icons.Check />
        </div>
      )}
    </div>
  );
};

export default DashboardScreen;
