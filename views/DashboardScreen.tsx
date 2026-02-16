
import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { Icons } from '../constants';
import { Category, Priority } from '../types';
import TaskCard from '../components/TaskCard';
import { useBehaviorEngine } from '../hooks/useBehaviorEngine';
import { Logo } from '../components/Logo';

const DashboardScreen: React.FC = () => {
  const { 
    tasks, toggleTask, toggleZenMode, persona, load, t,
    isFlowStateActive, dispatch, userName, setState
  } = useApp();
  const { trackAction } = useBehaviorEngine();
  
  const [intention, setIntention] = useState(persona.dailyIntention || '');

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 5) return "ليلة هادئة";
    if (hour < 12) return "صباح مشرق";
    if (hour < 18) return "يوم مليء بالإنجاز";
    return "مساء هادئ";
  }, []);

  const displayedTasks = useMemo(() => {
    const active = tasks.filter(t => !t.isCompleted);
    if (load > 85) {
      return active.filter(t => t.priority === Priority.HIGH || t.category === Category.PRAYER);
    }
    return active.sort((a, b) => (b.priority === Priority.HIGH ? 1 : -1));
  }, [tasks, load]);

  const handleIntentionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intention.trim()) return;
    setState({ persona: { ...persona, dailyIntention: intention } });
    trackAction('session_start' as any, { intention });
  };

  return (
    <div className="min-h-screen px-4 md:px-6 pt-12 md:pt-16 max-w-2xl mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Dynamic Header */}
      <header className="flex justify-between items-center bg-white/[0.03] p-6 rounded-[40px] border border-white/5 backdrop-blur-3xl glow-border">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <Logo size={56} className="relative z-10" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black text-white heading-title">
              {greeting}، <span className="text-indigo-400">{userName.split(' ')[0]}</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">
              {new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
        <button 
          onClick={() => dispatch({ type: 'TOGGLE_FLOW' })}
          className="w-12 h-12 glass-panel rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-all premium-card"
        >
          <Icons.Settings />
        </button>
      </header>

      {/* Mental Capacity Monitor */}
      <section className="glass-panel p-10 rounded-[48px] border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] rounded-full -mr-16 -mt-16"></div>
        
        <div className="flex justify-between items-start mb-10 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${load > 80 ? 'bg-rose-500' : 'bg-indigo-500'}`}></span>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">مؤشر السعة الذهنية</h3>
            </div>
            <p className="text-xl font-black text-white/90 leading-relaxed max-w-[280px]">
              {load > 85 ? 'تجاوزت حد الأمان. ركز على الضروريات فقط.' : load > 60 ? 'يوم منتج، حافظ على وتيرتك.' : 'لديك متسع من الطاقة للإبداع.'}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-6xl font-black tracking-tighter ${load > 85 ? 'text-rose-400' : 'text-indigo-400'}`}>
              {load}<span className="text-xl opacity-30 ml-1">%</span>
            </div>
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mt-1">Mental Load</span>
          </div>
        </div>
        
        <div className="relative h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/[0.02]">
          <div 
            className={`h-full rounded-full transition-all duration-[2500ms] cubic-bezier(0.16, 1, 0.3, 1) shadow-[0_0_20px_rgba(99,102,241,0.4)] ${load > 85 ? 'bg-gradient-to-l from-rose-500 to-rose-400' : 'bg-gradient-to-l from-indigo-500 to-violet-500'}`}
            style={{ width: `${load}%` }}
          />
        </div>
      </section>

      {/* Intention Input */}
      <section className="animate-in slide-in-from-bottom-6 duration-1000 delay-200">
        <form onSubmit={handleIntentionSubmit} className="relative group">
          <div className="absolute right-7 top-1/2 -translate-y-1/2 text-indigo-500/40 group-focus-within:text-indigo-400 transition-colors">
            <Icons.Plus />
          </div>
          <input 
            type="text"
            placeholder="ما هي نيتك الأساسية الآن؟"
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            className="w-full glass-panel bg-white/[0.02] border-white/5 focus:border-indigo-500/30 rounded-[35px] px-16 py-7 font-bold text-white placeholder:text-slate-600 outline-none transition-all text-lg shadow-inner focus:bg-white/[0.04]"
          />
        </form>
      </section>

      {/* Task Roadmap */}
      <section className="space-y-10 pb-20">
        <div className="flex items-center justify-between px-3">
          <div className="flex items-center gap-5">
             <div className="w-1.5 h-10 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
             <h2 className="text-2xl font-black text-white tracking-tight">خارطة اليوم</h2>
          </div>
          <button 
            onClick={() => dispatch({ type: 'TOGGLE_FLOW' })}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${isFlowStateActive ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-600/20' : 'bg-white/5 text-slate-500 border-white/5 hover:bg-white/10'}`}
          >
            {isFlowStateActive ? 'وضع التدفق: نشط' : 'بدء التدفق العميق'}
          </button>
        </div>

        <div className="grid gap-6">
          {displayedTasks.length === 0 ? (
            <div className="py-28 text-center space-y-6 opacity-20 group">
               <div className="text-7xl group-hover:scale-110 transition-transform duration-1000">🌌</div>
               <p className="text-sm font-black uppercase tracking-[0.4em] text-slate-400">الفضاء الذهني خالٍ تماماً</p>
            </div>
          ) : (
            displayedTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggle={toggleTask} 
                onZen={toggleZenMode} 
                onDefer={(id) => trackAction('task_postpone', { id })}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardScreen;
