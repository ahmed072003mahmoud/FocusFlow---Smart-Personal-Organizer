
import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { Priority, Task } from '../types';
import { useBehaviorEngine } from '../hooks/useBehaviorEngine';

const DashboardScreen: React.FC = () => {
  const { 
    tasks, toggleTask, toggleZenMode, persona, load,
    dispatch, userName, setState
  } = useApp();
  const { trackAction } = useBehaviorEngine();
  
  const [isCommitting, setIsCommitting] = useState(false);
  const [microWin, setMicroWin] = useState('');

  // Behavioral Engine: Filter the "One True Task"
  const currentTask = useMemo(() => {
    return tasks.filter(t => !t.isCompleted)
      .sort((a, b) => (b.priority === Priority.HIGH ? 1 : -1))[0];
  }, [tasks]);

  const upcomingCount = tasks.filter(t => !t.isCompleted && t.id !== currentTask?.id).length;

  const handleStartCommitment = () => {
    if (!currentTask) return;
    setIsCommitting(true);
  };

  const confirmCommitment = () => {
    trackAction('zen_mode_enter', { taskId: currentTask?.id, microWin });
    toggleZenMode(currentTask?.id || null);
    setIsCommitting(false);
    setMicroWin('');
  };

  return (
    <div className="min-h-screen px-8 pt-24 max-w-md mx-auto flex flex-col items-center animate-in fade-in duration-1000">
      
      {/* State A: The Nucleus (Decision Point) */}
      {!isCommitting ? (
        <section className="w-full flex flex-col items-center text-center space-y-16">
          <header className="space-y-3">
             <h3 className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-600">الأولوية القصوى حالياً</h3>
             {currentTask ? (
               <h1 className="text-5xl font-black text-white tracking-tighter leading-none px-4">
                 {currentTask.title}
               </h1>
             ) : (
               <h1 className="text-4xl font-black text-zinc-800 tracking-tighter">هدوء تام...</h1>
             )}
          </header>

          {currentTask && (
            <div className="w-full space-y-12">
              <button 
                onClick={handleStartCommitment}
                className="w-full py-8 bg-zinc-100 text-zinc-900 rounded-[40px] font-black text-sm uppercase tracking-[0.3em] shadow-[0_30px_60px_-15px_rgba(255,255,255,0.1)] hover:scale-[1.03] active:scale-95 transition-all"
              >
                ابدأ الالتزام
              </button>
              
              <div className="flex flex-col items-center gap-4 opacity-30 hover:opacity-100 transition-opacity">
                 <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em]">
                   {upcomingCount} مهام في الانتظار
                 </p>
                 <div className="w-px h-12 bg-gradient-to-b from-zinc-500 to-transparent" />
              </div>
            </div>
          )}
        </section>
      ) : (
        /* State B: The Commitment Bridge (Implementation Intention) */
        <section className="w-full space-y-12 animate-in slide-in-from-bottom-12 duration-500">
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-black text-white tracking-tight">ما هي أول دقيقتين؟</h2>
            <p className="text-sm text-zinc-500 font-medium leading-relaxed">
              التسويف ينتهي بالبداية المجهرية. اكتب أول فعل بسيط ستقوم به الآن (مثلاً: فتح الكتاب).
            </p>
          </div>

          <div className="relative">
            <input 
              autoFocus
              type="text"
              value={microWin}
              onChange={(e) => setMicroWin(e.target.value)}
              placeholder="مثلاً: فتح ملف البحث..."
              className="w-full bg-zinc-900 border-b-2 border-zinc-700 focus:border-white py-6 text-xl font-bold text-white placeholder:text-zinc-800 outline-none transition-all"
            />
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setIsCommitting(false)}
              className="flex-1 py-5 text-[10px] font-black text-zinc-600 uppercase tracking-widest"
            >
              تراجع
            </button>
            <button 
              onClick={confirmCommitment}
              disabled={!microWin.trim()}
              className="flex-[2] py-5 bg-white text-zinc-900 rounded-2xl font-black text-[10px] uppercase tracking-widest disabled:opacity-20"
            >
              دخول وضع التركيز
            </button>
          </div>
        </section>
      )}

      {/* Psychological Load (Silent Feedback) */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-10 opacity-20">
         <div className="flex flex-col items-center">
            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">الحمل</span>
            <span className="text-xs font-bold text-zinc-300">{load}%</span>
         </div>
         <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
         <div className="flex flex-col items-center">
            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">الوضوح</span>
            <span className="text-xs font-bold text-zinc-300">{100 - load}%</span>
         </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
