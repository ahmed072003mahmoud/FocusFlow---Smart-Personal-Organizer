
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
    if (hour < 18) return "يوم منتج";
    return "مساء هادئ";
  }, []);

  const displayedTasks = useMemo(() => {
    if (load > 90) {
      return tasks.filter(t => t.priority === Priority.HIGH || t.category === Category.PRAYER || t.isCompleted);
    }
    return tasks.filter(t => !t.isCompleted).sort((a, b) => (b.priority === Priority.HIGH ? 1 : -1));
  }, [tasks, load]);

  const handleIntentionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intention.trim()) return;
    setState({ persona: { ...persona, dailyIntention: intention } });
    trackAction('session_start' as any, { intention });
  };

  return (
    <div className="min-h-screen px-6 pt-16 max-w-2xl mx-auto space-y-10 animate-in fade-in duration-1000">
      {/* Premium Header */}
      <header className="flex justify-between items-center bg-white/5 p-6 rounded-[35px] border border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse"></div>
            <Logo size={52} className="relative z-10" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black text-white leading-tight">
              {greeting}، <span className="text-indigo-400">{userName.split(' ')[0]}</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
              {new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
        <button className="w-11 h-11 glass-card rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/30 transition-all">
          <Icons.Settings />
        </button>
      </header>

      {/* Intelligence Gauge - Redesigned */}
      <section className="glass-card p-10 rounded-[45px] relative overflow-hidden group border-white/5">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
        
        <div className="flex justify-between items-start mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">تحليل المجهود الذهني</h3>
            </div>
            <p className="text-xl font-black text-white/90">
              {load > 85 ? 'حالة إجهاد حرجة - توقف!' : load > 60 ? 'يوم مكثف، استمر بذكاء' : 'طاقة ذهنية صافية'}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-5xl font-black tracking-tighter ${load > 85 ? 'text-rose-400' : 'text-indigo-400'}`}>
              {load}<span className="text-xl opacity-40">%</span>
            </div>
          </div>
        </div>
        
        <div className="relative h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
          <div 
            className={`h-full rounded-full transition-all duration-[2000ms] cubic-bezier(0.23, 1, 0.32, 1) shadow-[0_0_20px_rgba(99,102,241,0.4)] ${load > 85 ? 'bg-rose-500' : 'bg-indigo-500'}`}
            style={{ width: `${load}%` }}
          />
        </div>
      </section>

      {/* Modern Intention Form */}
      <section className="animate-in slide-in-from-bottom-6 duration-1000 delay-200">
        <form onSubmit={handleIntentionSubmit} className="relative group">
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-indigo-500/40 group-focus-within:text-indigo-400 transition-colors">
            <Icons.Plus />
          </div>
          <input 
            type="text"
            placeholder="ما هي نيتك الأساسية الآن؟"
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            className="w-full glass-card bg-white/5 border border-white/5 focus:border-indigo-500/30 rounded-[30px] px-14 py-6 font-bold text-white placeholder:text-slate-600 outline-none transition-all text-lg shadow-inner"
          />
        </form>
      </section>

      {/* Task Section - Refined Hierarchy */}
      <section className="space-y-8 pb-12">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-4">
             <div className="w-1.5 h-8 bg-indigo-500 rounded-full"></div>
             <h2 className="text-2xl font-black text-white tracking-tight">المسار الحالي</h2>
          </div>
          <button 
            onClick={() => dispatch({ type: 'TOGGLE_FLOW' })}
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isFlowStateActive ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'}`}
          >
            {isFlowStateActive ? 'وضع التركيز: نشط' : 'بدء التدفق العميق'}
          </button>
        </div>

        <div className="grid gap-5">
          {displayedTasks.length === 0 ? (
            <div className="py-24 text-center space-y-4 opacity-30">
               <div className="text-6xl animate-bounce">✨</div>
               <p className="text-sm font-black uppercase tracking-[0.3em]">الفضاء الذهني صافٍ تماماً</p>
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
