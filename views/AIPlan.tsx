
import React from 'react';
import { useApp } from '../AppContext';
import { Card } from '../components/ui/Card';
import { PlanningMood } from '../types';

const AIPlan: React.FC = () => {
  const { persona, updateMood, tasks, deferTask } = useApp();

  const moods: PlanningMood[] = ['Energetic', 'Focused', 'Tired'];

  const delayedTasks = tasks.filter(t => !t.isCompleted && t.postponedCount > 0);

  return (
    <div className="max-w-3xl mx-auto px-6 space-y-12 animate-slide-up">
      <header className="space-y-2">
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">AI Strategic Plan</h2>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">How's your energy?</h1>
      </header>

      <section className="flex gap-4">
        {moods.map(m => (
          <button 
            key={m}
            onClick={() => updateMood(m)}
            className={`flex-1 p-6 rounded-card border-2 transition-all text-center space-y-2 ${persona.currentMood === m ? 'border-primary bg-primary/5 shadow-lg' : 'border-gray-100 bg-white hover:border-gray-200'}`}
          >
            <div className="text-2xl">{m === 'Energetic' ? '⚡' : m === 'Focused' ? '🎯' : '☕'}</div>
            <p className="text-xs font-black uppercase tracking-widest">{m}</p>
          </button>
        ))}
      </section>

      {persona.currentMood === 'Tired' && (
        <div className="p-6 bg-primary/5 rounded-card border border-primary/20 flex gap-4 animate-slide-up">
           <div className="text-2xl">💡</div>
           <div className="space-y-1">
             <h4 className="text-sm font-black text-primary uppercase">Restorative Suggestion</h4>
             <p className="text-xs text-gray-600 leading-relaxed">Your energy is low. I've highlighted only 1-2 small habits. Feel free to defer everything else to tomorrow.</p>
           </div>
        </div>
      )}

      {delayedTasks.length > 0 && (
        <section className="space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Rescheduling</h3>
              <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Push All to Tomorrow</button>
           </div>
           <div className="space-y-3">
              {delayedTasks.map(t => (
                <div key={t.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-btn">
                   <p className="text-xs font-bold text-gray-600">{t.title}</p>
                   <span className="text-[10px] font-bold text-gray-400 italic">Delayed {t.postponedCount}x</span>
                </div>
              ))}
           </div>
        </section>
      )}

      <Card className="p-8 space-y-4">
         <h4 className="text-sm font-black uppercase tracking-widest text-primary">Optimization Logic</h4>
         <p className="text-xs text-gray-500 leading-relaxed">
           Based on your behavior, you are most productive in the <b>{persona.isMorningPerson ? 'Morning' : 'Evening'}</b>.
           I suggest scheduling deep focus tasks before 11:00 AM.
         </p>
      </Card>
    </div>
  );
};

export default AIPlan;
