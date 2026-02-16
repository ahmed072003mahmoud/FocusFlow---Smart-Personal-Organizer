
import React, { useMemo } from 'react';
import { useApp } from '../AppContext';
import { Priority } from '../types';

const DashboardScreen: React.FC = () => {
  const { tasks, toggleZenMode, load } = useApp();

  const currentTask = useMemo(() => {
    return tasks
      .filter(t => !t.isCompleted)
      .sort((a, b) => (b.priority === Priority.HIGH ? 1 : -1))[0];
  }, [tasks]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      {/* Load Indicator - Subtle Line */}
      <div className="fixed top-0 left-0 w-full h-1 bg-zinc-900">
        <div 
          className="h-full bg-white transition-all duration-1000" 
          style={{ width: `${Math.min(load, 100)}%` }} 
        />
      </div>

      <main className="w-full max-w-lg text-center space-y-24">
        {currentTask ? (
          <div className="space-y-12 animate-in fade-in zoom-in duration-1000">
            <header className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">المهمة الحالية</span>
              <h1 className="text-5xl font-light tracking-tighter leading-tight">
                {currentTask.title}
              </h1>
            </header>

            <button 
              onClick={() => toggleZenMode(currentTask.id)}
              className="group relative inline-flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all" />
              <div className="relative w-32 h-32 border border-white/10 rounded-full flex items-center justify-center hover:border-white transition-all">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            </button>
          </div>
        ) : (
          <div className="opacity-20 space-y-4">
            <h1 className="text-4xl font-light italic">سكون.</h1>
            <p className="text-[10px] uppercase tracking-widest">لا توجد التزامات نشطة</p>
          </div>
        )}
      </main>

      {/* Implicit Signal - Status */}
      <footer className="fixed bottom-32 text-[8px] font-black uppercase tracking-[0.4em] text-zinc-800">
        نظام الوعي الإدراكي • وضع الاستقرار
      </footer>
    </div>
  );
};

export default DashboardScreen;
