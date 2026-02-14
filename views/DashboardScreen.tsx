
import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Icons } from '../constants';
import { Category, Task, Priority, WeekMode } from '../types';
import { useNavigate } from 'react-router-dom';
import { SmartTaskParser } from '../utils/SmartTaskParser';
import QuickDecisionWidget from '../components/QuickDecisionWidget';
import { Suggestion } from '../utils/SmartSuggester';
import WeeklySetupDialog from '../components/WeeklySetupDialog';

const DashboardScreen: React.FC = () => {
  const { 
    userName, tasks, toggleTask, toggleTaskTimer, addTask, updateTask, 
    organizeMyDay, overloadInfo, autoBalance, toggleSurvivalMode, 
    isSurvivalMode, isBadDayMode, toggleBadDayMode, t, dailyIntention, 
    setDailyIntention, realityCheck, clearRealityCheck, 
    victoryDayPending, saveSuccessLog, dismissVictory,
    currentWeekMode, weekStartDate 
  } = useApp();
  
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWeeklySetup, setShowWeeklySetup] = useState(false); 
  
  const [isIntentionModalOpen, setIsIntentionModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [athkarTask, setAthkarTask] = useState<Task | null>(null);
  const [quickWinTask, setQuickWinTask] = useState<Task | null>(null);
  
  const [formTitle, setFormTitle] = useState('');
  const [formDeadline, setFormDeadline] = useState(new Date().toISOString().slice(0, 16));
  const [formCategory, setFormCategory] = useState<Category>(Category.STUDY);
  const [formDuration, setFormDuration] = useState(30);
  const [formPriority, setFormPriority] = useState<Priority>(Priority.NORMAL);
  const [intentionInput, setIntentionInput] = useState(dailyIntention || '');

  const VICTORY_CHIPS = [
    { id: 'chip_sleep', label: t('chip_sleep') },
    { id: 'chip_no_social', label: t('chip_no_social') },
    { id: 'chip_early', label: t('chip_early') },
    { id: 'chip_mind', label: t('chip_mind') },
    { id: 'chip_energy', label: t('chip_energy') },
    { id: 'chip_coffee', label: t('chip_coffee') }
  ];

  const MODE_BATTLE_CRYS: Record<WeekMode, string> = {
    [WeekMode.STANDARD]: t('mode_battle_standard'),
    [WeekMode.CRUNCH]: t('mode_battle_crunch'),
    [WeekMode.LIGHT]: t('mode_battle_light'),
    [WeekMode.REVIEW]: t('mode_battle_review')
  };

  useEffect(() => {
    if (!weekStartDate) {
      setShowWeeklySetup(true);
      return;
    }
    const diffTime = Math.abs(new Date().getTime() - new Date(weekStartDate).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 7) setShowWeeklySetup(true);
  }, [weekStartDate]);

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

  const handleQuickWin = () => {
    const uncompleted = tasks.filter(t => !t.isCompleted);
    if (uncompleted.length === 0) return;
    const sorted = [...uncompleted].sort((a, b) => a.estimatedMinutes - b.estimatedMinutes);
    setQuickWinTask(sorted[0]);
  };

  const handleApplySuggestion = (s: Suggestion) => {
    setFormDuration(s.duration);
    setFormPriority(s.priority);
    setFormTitle(s.titleSuffix ? `${s.label} (${s.titleSuffix})` : s.label);
  };

  const handleSave = () => {
    if (!formTitle.trim()) return;
    const taskData = {
      title: formTitle,
      isCompleted: false,
      deadline: new Date(formDeadline).toISOString(),
      category: formCategory,
      estimatedMinutes: formDuration,
      priority: formPriority,
    };
    if (editingTask) updateTask({ ...editingTask, ...taskData });
    else addTask(taskData);
    setIsModalOpen(false);
    setFormTitle('');
  };

  const getPriorityTag = (score: number) => {
    if (score > 70) return { label: t('urgent'), class: 'bg-rose-50 text-rose-600' };
    if (score > 40) return { label: t('important'), class: 'bg-amber-50 text-amber-700' };
    return { label: t('normal'), class: 'bg-slate-50 text-slate-500' };
  };

  if (showWeeklySetup) return <WeeklySetupDialog onComplete={() => setShowWeeklySetup(false)} />;

  return (
    <div className={`min-h-full pb-32 transition-colors duration-1000 ${
      isBadDayMode ? 'bg-[#FAF3E0]' : isSurvivalMode ? 'bg-[#F1FAEE]/50' : 'bg-transparent'
    }`}>
      
      {/* VICTORY LOG MODAL */}
      {victoryDayPending && (
        <div className="fixed inset-0 bg-[#2B3A67]/90 backdrop-blur-2xl z-[500] flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-sm rounded-[48px] p-10 animate-in zoom-in-95 duration-500 shadow-2xl text-center border-4 border-amber-400">
              <header className="mb-8">
                 <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl animate-bounce">🎉</div>
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t('victoryTitle')}</h2>
                 <p className="text-slate-500 text-sm mt-3 font-medium">{t('victoryDesc')}</p>
              </header>
              <div className="flex flex-wrap gap-2 justify-center mb-10">
                 {VICTORY_CHIPS.map(chip => (
                   <button key={chip.id} onClick={() => saveSuccessLog(chip.label)} className="px-4 py-2.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-all">
                    {chip.label}
                   </button>
                 ))}
                 <button onClick={() => saveSuccessLog(t('chip_grit'))} className="px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest">{t('chip_grit')}</button>
              </div>
              <button onClick={dismissVictory} className="w-full py-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">{t('cancel')}</button>
           </div>
        </div>
      )}

      {/* PREMIUM HEADER */}
      <header className={`relative transition-all duration-1000 pt-16 pb-24 px-6 ${
        isBadDayMode ? 'bg-gradient-to-br from-[#8D99AE] to-[#ADC178]' : 'bg-gradient-to-br from-[#2B3A67] to-[#496A9A]'
      } ${isDesktop ? 'rounded-[48px] mt-6 mx-6 mb-12 shadow-2xl' : 'rounded-b-[48px] shadow-lg'}`}>
        <div className="flex justify-between items-start mb-4 max-w-5xl mx-auto">
          <div className="animate-in fade-in slide-in-from-top-4 duration-700 flex-1">
            <div className="flex items-center gap-3 mb-3">
               <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 bg-white/10 text-white`}>
                 <span className={`w-1.5 h-1.5 rounded-full bg-white`} />
                 {t('mode_standard')}: {currentWeekMode}
               </span>
               <span className="text-white/40 text-[8px] font-black uppercase tracking-widest">{new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
            </div>
            <h1 className={`${isDesktop ? 'text-4xl' : 'text-3xl'} font-black text-white tracking-tight leading-tight`}>
              {isBadDayMode ? t('justBreathe') : t('goodMorning')}
            </h1>
            <p className="text-white/50 text-[10px] font-bold mt-2 tracking-wide max-w-xs leading-relaxed italic opacity-80">
              {MODE_BATTLE_CRYS[currentWeekMode]}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => toggleBadDayMode(!isBadDayMode)} className={`p-3 glass rounded-2xl text-white transition-all`}><Icons.Coffee /></button>
            <button onClick={() => navigate('/settings')} className={`p-3 glass rounded-2xl text-white hover:bg-white/20 transition-all`}><Icons.Gear /></button>
          </div>
        </div>

        {/* FLOATING INTENTION CARD */}
        <div onClick={() => setIsIntentionModalOpen(true)} className="absolute -bottom-10 left-6 right-6 glass p-6 rounded-[32px] shadow-xl cursor-pointer group flex flex-col items-center text-center space-y-2 max-w-xl mx-auto">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">{t('dailyFocus')}</p>
          <h2 className="text-sm font-bold italic tracking-tight text-white line-clamp-1 px-4">{dailyIntention ? `"${dailyIntention}"` : t('whatIsFocus')}</h2>
        </div>
      </header>

      <div className={`px-6 mt-20 space-y-8 ${isDesktop ? 'max-w-4xl mx-auto' : ''}`}>
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-8 rounded-full ${isBadDayMode ? 'bg-[#ADC178]' : 'bg-[#E63946]'}`} />
            <h2 className={`${isDesktop ? 'text-3xl' : 'text-2xl'} font-black text-[#2B3A67] tracking-tight`}>
              {isBadDayMode ? t('essentialFocus') : isSurvivalMode ? t('survivalFocus') : t('timeline')}
            </h2>
          </div>
          
          <div className="space-y-4">
            {sortedTasks.map((task) => {
              const tag = getPriorityTag(task.priorityScore);
              return (
                <div key={task.id} className="group relative">
                  <div 
                    onClick={() => {
                      setEditingTask(task); setFormTitle(task.title); setFormDeadline(new Date(task.deadline).toISOString().slice(0, 16));
                      setFormCategory(task.category); setFormDuration(task.estimatedMinutes); setFormPriority(task.priority || Priority.NORMAL);
                      setIsModalOpen(true);
                    }}
                    className={`p-6 rounded-[32px] bg-white shadow-lg border-2 transition-all flex justify-between items-center ${
                      task.isRunning ? 'border-emerald-500' : 'border-transparent'
                    } ${task.isCompleted ? 'opacity-40 grayscale scale-95' : ''}`}
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2 mb-2">
                        {task.isRunning && <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">{t('recordingFocus')}</span>}
                        {!task.isRunning && <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${tag.class}`}>{tag.label}</span>}
                      </div>
                      <h3 className={`font-bold text-lg truncate text-[#2B3A67]`}>{task.title}</h3>
                      <p className="text-[10px] font-black mt-1 text-slate-400 uppercase tracking-widest">{task.estimatedMinutes}m • {task.category}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {!task.isCompleted && (
                        <button onClick={(e) => { e.stopPropagation(); toggleTaskTimer(task.id); }} className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${task.isRunning ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400'}`}>
                          {task.isRunning ? <Icons.Check /> : <Icons.AI />}
                        </button>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }} className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${task.isCompleted ? 'bg-[#E63946] border-[#E63946]' : 'border-slate-200'}`}>
                        {task.isCompleted ? <Icons.Check /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className={`fixed bottom-10 right-8 flex flex-col gap-4 items-center z-40`}>
           <button onClick={() => { setEditingTask(null); setFormTitle(''); setIsModalOpen(true); }} className="w-18 h-18 bg-[#E63946] text-white rounded-[24px] flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-transform"><Icons.Plus /></button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 animate-in slide-in-from-bottom duration-300">
            <h2 className="text-2xl font-bold text-[#2B3A67] mb-6">{editingTask ? t('editTask') : t('newTask')}</h2>
            <div className="space-y-6">
              <QuickDecisionWidget category={formCategory} onSelect={handleApplySuggestion} />
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest px-1">{t('label')}</label>
                <input autoFocus type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest px-1">{t('minutes')}</label><input type="number" value={formDuration} onChange={(e) => setFormDuration(parseInt(e.target.value))} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold" /></div>
                <div><label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest px-1">{t('priority')}</label><select value={formPriority} onChange={(e) => setFormPriority(e.target.value as Priority)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 font-bold appearance-none">{Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}</select></div>
              </div>
              <button onClick={handleSave} className="w-full bg-[#E63946] text-white font-black py-5 rounded-[24px] uppercase tracking-widest">{editingTask ? t('save') : t('startTask')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardScreen;
