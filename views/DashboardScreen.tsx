
import React, { useMemo } from 'react';
import { useApp } from '../AppContext';
import { Priority } from '../types';
import { AIStrategicCue } from '../components/AIStrategicCue';

const DashboardScreen: React.FC = () => {
  const { tasks, toggleZenMode, load, lastStrategicCue, setState, t } = useApp();

  const currentTask = useMemo(() => {
    return tasks
      .filter(t => !t.isCompleted)
      .sort((a, b) => (b.priority === Priority.HIGH ? 1 : -1))[0];
  }, [tasks]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 overflow-hidden">
      {/* Load Indicator - Subtle Line */}
      <div className="fixed top-0 left-0 w-full h-1 bg-zinc-950 z-[100]">
        <div 
          className="h-full bg-white transition-all duration-1000 shadow-[0_0_10px_white]" 
          style={{ width: `${Math.min(load, 100)}%` }} 
        />
      </div>

      <main className="w-full max-w-lg text-center space-y-12 animate-in fade-in duration-1000">
        {lastStrategicCue && (
          <AIStrategicCue 
            type={lastStrategicCue} 
            onAction={() => setState({ lastStrategicCue: null })}
            onDismiss={() => setState({ lastStrategicCue: null })}
          />
        )}

        {currentTask ? (
          <div className="space-y-12 py-12">
            <header className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700">{t('topPriorityShort')}</span>
              <h1 className="text-5xl font-light tracking-tighter leading-tight animate-in zoom-in duration-700">
                {currentTask.title}
              </h1>
            </header>

            <button 
              onClick={() => toggleZenMode(currentTask.id)}
              className="group relative inline-flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-1000" />
              <div className="relative w-40 h-40 border border-white/5 rounded-full flex items-center justify-center hover:border-white transition-all duration-700">
                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
              </div>
            </button>
          </div>
        ) : (
          <div className="opacity-10 space-y-6 py-20">
            <h1 className="text-4xl font-light italic tracking-widest">{t('justBreathe')}</h1>
            <p className="system-caption">{t('listClear')}</p>
          </div>
        )}
      </main>

      <footer className="fixed bottom-32 text-[8px] font-black uppercase tracking-[0.4em] text-zinc-900 transition-opacity hover:opacity-100 opacity-40">
        نظام الوعي الإدراكي • وضع الاستقرار
      </footer>
    </div>
  );
};

export default DashboardScreen;
