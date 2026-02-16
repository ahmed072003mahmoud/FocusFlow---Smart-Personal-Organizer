
import React, { useMemo } from 'react';
import { useApp } from '../AppContext';
import { Priority } from '../types';
import { AIStrategicCue } from '../components/AIStrategicCue';

const DashboardScreen: React.FC = () => {
  const { tasks, toggleZenMode, load, lastStrategicCue, setState, t } = useApp();

  const currentTask = useMemo(() => {
    return tasks
      .filter(t => !t.isCompleted)
      .sort((a, b) => {
        // High priority first
        if (a.priority === Priority.HIGH && b.priority !== Priority.HIGH) return -1;
        if (a.priority !== Priority.HIGH && b.priority === Priority.HIGH) return 1;
        // Then by postponed count (overdue feeling)
        return b.postponedCount - a.postponedCount;
      })[0];
  }, [tasks]);

  const isUrgent = currentTask?.priority === Priority.HIGH;
  const isOverdue = currentTask && currentTask.postponedCount > 2;

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-[#C7C7C7] flex flex-col items-center justify-center p-8 overflow-hidden">
      {/* Load Indicator - Subtle line with color shifting */}
      <div className="fixed top-0 left-0 w-full h-1 bg-[#252525] z-[100]">
        <div 
          className="h-full transition-all duration-1000 shadow-[0_0_8px_rgba(255,255,255,0.1)]" 
          style={{ 
            width: `${Math.min(load, 100)}%`,
            backgroundColor: load > 85 ? '#F44336' : load > 60 ? '#FF9800' : '#C7C7C7'
          }} 
        />
      </div>

      <main className="w-full max-w-lg text-center space-y-16 animate-in fade-in duration-1000">
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
              <span className={`text-[10px] font-black uppercase tracking-[0.5em] ${isUrgent ? 'text-[#FF9800]' : isOverdue ? 'text-[#F44336]' : 'text-[#717171]'}`}>
                {isUrgent ? t('urgent') : isOverdue ? 'متأخر جداً' : t('topPriorityShort')}
              </span>
              <h1 className="text-5xl font-light tracking-tighter leading-tight text-white animate-in zoom-in duration-700">
                {currentTask.title}
              </h1>
            </header>

            <button 
              onClick={() => toggleZenMode(currentTask.id)}
              className="group relative inline-flex items-center justify-center"
            >
              <div className={`absolute inset-0 rounded-full blur-3xl opacity-5 transition-all duration-1000 ${isUrgent ? 'bg-[#FF9800]' : 'bg-white'}`} />
              <div className={`relative w-44 h-44 border rounded-full flex items-center justify-center transition-all duration-700 ${isUrgent ? 'border-[#FF9800]/20 hover:border-[#FF9800]' : 'border-white/5 hover:border-white/40'}`}>
                <div className={`w-2 h-2 rounded-full animate-ping ${isUrgent ? 'bg-[#FF9800]' : 'bg-[#C7C7C7]'}`} />
              </div>
            </button>
          </div>
        ) : (
          <div className="opacity-20 space-y-6 py-20">
            <h1 className="text-4xl font-light italic tracking-widest">{t('justBreathe')}</h1>
            <p className="system-caption">{t('listClear')}</p>
          </div>
        )}
      </main>

      <footer className="fixed bottom-32 text-[8px] font-black uppercase tracking-[0.4em] text-[#333333] transition-opacity hover:opacity-100 opacity-60">
        FocusFlow • Monochrome Logic • V12
      </footer>
    </div>
  );
};

export default DashboardScreen;
