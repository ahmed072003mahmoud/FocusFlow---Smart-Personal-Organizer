
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Card } from '../components/ui/Card';
import { Priority, Category } from '../types';

const Dashboard: React.FC = () => {
  const { tasks, toggleTask, deferTask, persona, load, suggestion, addTask } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const importantTask = tasks.find(t => !t.isCompleted && t.priority === Priority.HIGH) || tasks.find(t => !t.isCompleted);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    addTask({
      title: newTitle,
      category: Category.OTHER,
      priority: Priority.NORMAL,
      estimatedMinutes: 30,
      deadline: new Date().toISOString(),
      isCompleted: false
    });
    setNewTitle('');
    setShowAdd(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 space-y-12">
      {/* Header Info */}
      <section className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">{new Date().toDateString()}</h2>
          <div className="mt-4 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-primary rounded-full"></div>
              <p className="text-lg font-black tracking-tight">Today's Load</p>
            </div>
            <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
               <div 
                 className={`h-full transition-all duration-1000 ${load > 80 ? 'bg-softRed' : 'bg-primary'}`} 
                 style={{ width: `${load}%` }}
               />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{load}% Capacity</p>
          </div>
        </div>
        <div className="text-right">
           <p className="text-xs font-bold text-gray-400 italic">"{persona.dailyIntention || 'Set your focus'}"</p>
        </div>
      </section>

      {/* Suggestion Notification */}
      {suggestion && (
        <div className="p-4 bg-primary/5 border border-primary/10 rounded-card flex items-center justify-between gap-4 animate-slide-up">
           <p className="text-xs font-medium text-primary leading-relaxed">💡 {suggestion}</p>
           <button className="text-[10px] font-black uppercase tracking-widest text-primary opacity-50">Dismiss</button>
        </div>
      )}

      {/* Most Important Now */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Most Important Now</h3>
        {importantTask ? (
          <Card className="p-10 text-center space-y-8 animate-slide-up group">
             <div className="space-y-2">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{importantTask.category}</span>
                <h1 className="text-3xl font-black text-gray-900 leading-tight group-hover:scale-105 transition-transform">{importantTask.title}</h1>
             </div>
             <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={() => toggleTask(importantTask.id)}
                  className="px-10 py-4 bg-primary text-white font-black rounded-btn shadow-2xl shadow-primary/30 uppercase tracking-[0.2em] text-xs hover:scale-110 active:scale-95 transition-all"
                >
                  Complete
                </button>
                <button 
                  onClick={() => deferTask(importantTask.id)}
                  className="px-8 py-4 bg-gray-50 text-gray-400 font-bold rounded-btn uppercase tracking-[0.2em] text-[10px] hover:bg-gray-100 transition-all"
                >
                  Defer
                </button>
             </div>
          </Card>
        ) : (
          <div className="text-center py-20 space-y-4 opacity-40">
             <div className="text-4xl">🕊️</div>
             <h4 className="text-lg font-black tracking-tight">All clear. Enjoy your peace.</h4>
          </div>
        )}
      </section>

      {/* Timeline */}
      <section className="space-y-6">
         <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Timeline</h3>
         <div className="space-y-3">
            {tasks.filter(t => !t.isCompleted).map(t => (
              <Card key={t.id} className="p-6 flex items-center justify-between group hover:border-primary/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${t.priority === Priority.HIGH ? 'bg-primary' : 'bg-gray-200'}`}></div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{t.title}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.estimatedMinutes} Mins</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleTask(t.id)}
                  className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white"
                >
                  ✓
                </button>
              </Card>
            ))}
         </div>
      </section>

      {/* Quick Add FAB */}
      <div className="fixed bottom-12 right-12 z-50">
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="w-16 h-16 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center text-3xl hover:scale-110 active:scale-95 transition-all"
        >
          {showAdd ? '×' : '+'}
        </button>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/10 backdrop-blur-sm p-6">
           <Card className="w-full max-w-md p-8 animate-slide-up">
              <h4 className="text-lg font-black mb-6">Capture Task</h4>
              <form onSubmit={handleQuickAdd} className="space-y-4">
                 <input 
                   autoFocus
                   type="text" 
                   placeholder="What's in your mind?"
                   value={newTitle}
                   onChange={(e) => setNewTitle(e.target.value)}
                   className="w-full px-5 py-4 bg-gray-50 rounded-btn text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                 />
                 <div className="flex gap-2">
                    <button type="submit" className="flex-1 py-4 bg-primary text-white font-black rounded-btn text-xs uppercase tracking-widest">Add</button>
                    <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 font-bold rounded-btn text-xs uppercase tracking-widest">Cancel</button>
                 </div>
              </form>
           </Card>
        </div>
      )}

      {load > 100 && (
        <div className="text-center">
           <p className="text-[10px] font-bold text-softRed uppercase tracking-widest">⚠️ You've planned over 8 hours. Start small.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
