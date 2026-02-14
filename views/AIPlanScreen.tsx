
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Icons } from '../constants';
import { Category, Priority, Task } from '../types';

type PlannerStep = 'form' | 'loading' | 'result';
type Mood = 'Energetic' | 'Tired' | 'Focused' | 'Stressed';
type Focus = 'Study' | 'Worship' | 'Health';

const AIPlanScreen: React.FC = () => {
  const { addTask, t } = useApp();
  
  // Planner State
  const [step, setStep] = useState<PlannerStep>('form');
  const [mood, setMood] = useState<Mood>('Focused');
  const [focus, setFocus] = useState<Focus>('Study');
  const [hours, setHours] = useState<number>(4);
  const [generatedTasks, setGeneratedTasks] = useState<Partial<Task>[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const simulateGeneration = () => {
    setStep('loading');
    
    let tasks: Partial<Task>[] = [];
    
    setTimeout(() => {
      if (mood === 'Tired') {
        tasks = [
          { title: "15 min Meditation", time: "09:00 AM", priority: Priority.NORMAL, category: Category.HABIT },
          { title: "Light Reading", time: "10:30 AM", priority: Priority.NORMAL, category: Category.STUDY },
          { title: "Listen to Quran", time: "08:00 PM", priority: Priority.NORMAL, category: Category.PRAYER },
        ];
      } else if (mood === 'Energetic' && focus === 'Study') {
        tasks = [
          { title: "Math Chapter 1 Review", time: "09:00 AM", priority: Priority.HIGH, category: Category.STUDY },
          { title: "Solve Physics Problems", time: "11:00 AM", priority: Priority.HIGH, category: Category.STUDY },
          { title: "Group Study Sync", time: "02:00 PM", priority: Priority.NORMAL, category: Category.STUDY },
        ];
      } else if (focus === 'Worship') {
        tasks = [
          { title: "Read Surah Al-Kahf", time: "06:00 AM", priority: Priority.HIGH, category: Category.PRAYER },
          { title: "Afternoon Athkar", time: "04:30 PM", priority: Priority.NORMAL, category: Category.PRAYER },
          { title: "Night Prayer (Tahajjud)", time: "03:30 AM", priority: Priority.HIGH, category: Category.PRAYER },
        ];
      } else if (mood === 'Stressed') {
        tasks = [
          { title: "Deep Breathing Session", time: "09:00 AM", priority: Priority.HIGH, category: Category.HABIT },
          { title: "Digital Detox (1 Hour)", time: "02:00 PM", priority: Priority.NORMAL, category: Category.HABIT },
          { title: "Journaling Thoughts", time: "09:00 PM", priority: Priority.NORMAL, category: Category.HABIT },
        ];
      } else if (mood === 'Focused') {
        tasks = [
          { title: "Deep Work Session (2H)", time: "10:00 AM", priority: Priority.HIGH, category: Category.STUDY },
          { title: "Critical Task Audit", time: "03:00 PM", priority: Priority.NORMAL, category: Category.STUDY },
        ];
      } else if (focus === 'Health') {
        tasks = [
          { title: "HIIT Workout", time: "07:30 AM", priority: Priority.HIGH, category: Category.HABIT },
          { title: "Meal Prep for Week", time: "11:00 AM", priority: Priority.NORMAL, category: Category.HABIT },
          { title: "Drink 500ml Water", time: "01:00 PM", priority: Priority.NORMAL, category: Category.HABIT },
        ];
      } else {
        tasks = [
          { title: "Review Tomorrow's Plan", time: "09:00 PM", priority: Priority.NORMAL, category: Category.HABIT },
          { title: "Tidy Workspace", time: "08:00 PM", priority: Priority.NORMAL, category: Category.HABIT },
        ];
      }

      setGeneratedTasks(tasks);
      setStep('result');
    }, 2000);
  };

  const handleAddTask = (task: Partial<Task>) => {
    // Added deadline and estimatedMinutes to satisfy Task interface requirements
    addTask({
      title: task.title!,
      isCompleted: false,
      priority: task.priority!,
      time: task.time!,
      category: task.category!,
      deadline: new Date().toISOString(),
      estimatedMinutes: 30,
    });
    
    setToast(t('addToMyDay'));
    setTimeout(() => setToast(null), 2500);
  };

  const Chip: React.FC<{ label: string, selected: boolean, onClick: () => void }> = ({ label, selected, onClick }) => (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-2xl text-[13px] font-bold transition-all border ${
        selected 
          ? 'bg-zinc-900 text-white border-transparent shadow-md' 
          : 'bg-zinc-50 text-zinc-500 border-zinc-200 hover:border-zinc-300'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-32">
        <header className="pt-8 mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">{t('aiPlan')}</h1>
          <p className="text-zinc-500 mt-1">{t('smartRoutines')}</p>
        </header>

        {step === 'form' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="space-y-4">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">{t('howFeel')}</label>
              <div className="flex flex-wrap gap-2.5">
                <Chip label={t('moodEnergetic')} selected={mood === 'Energetic'} onClick={() => setMood('Energetic')} />
                <Chip label={t('moodTired')} selected={mood === 'Tired'} onClick={() => setMood('Tired')} />
                <Chip label={t('moodFocused')} selected={mood === 'Focused'} onClick={() => setMood('Focused')} />
                <Chip label={t('moodStressed')} selected={mood === 'Stressed'} onClick={() => setMood('Stressed')} />
              </div>
            </section>

            <section className="space-y-4">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">{t('topPriority')}</label>
              <div className="flex flex-wrap gap-2.5">
                <Chip label={t('prioStudy')} selected={focus === 'Study'} onClick={() => setFocus('Study')} />
                <Chip label={t('prioWorship')} selected={focus === 'Worship'} onClick={() => setFocus('Worship')} />
                <Chip label={t('prioHealth')} selected={focus === 'Health'} onClick={() => setFocus('Health')} />
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('availHours')}</label>
                <span className="text-xl font-bold text-zinc-900">{hours}h</span>
              </div>
              <input 
                type="range" 
                min="1" max="12" 
                value={hours} 
                onChange={(e) => setHours(parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
              />
            </section>

            <button 
              onClick={simulateGeneration}
              className="w-full bg-zinc-900 text-white font-bold py-5 rounded-[24px] shadow-xl active:scale-95 transition-all text-lg flex items-center justify-center gap-3"
            >
              <Icons.AI />
              {t('generateSchedule')}
            </button>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center py-24 space-y-6 animate-in fade-in duration-500">
            <div className="w-14 h-14 border-[5px] border-zinc-100 border-t-zinc-900 rounded-full animate-spin"></div>
            <p className="text-zinc-400 font-bold text-sm tracking-wide animate-pulse">{t('thinking')}</p>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
              {generatedTasks.map((task, idx) => (
                <div key={idx} className="bg-white border border-zinc-100 p-5 rounded-[28px] shadow-sm flex items-center gap-4 group hover:border-zinc-300 transition-colors">
                  <button 
                    onClick={() => handleAddTask(task)}
                    className="w-10 h-10 bg-zinc-50 text-zinc-900 rounded-xl flex items-center justify-center hover:bg-zinc-900 hover:text-white active:scale-90 transition-all flex-shrink-0"
                  >
                    <Icons.Plus />
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-zinc-900 truncate">{task.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5 opacity-60">
                      <span className="text-[9px] font-bold uppercase tracking-widest">{task.time}</span>
                      <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">{task.category}</span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-tighter ${
                    task.priority === Priority.HIGH ? 'bg-red-50 text-red-500' : 'bg-zinc-50 text-zinc-400'
                  }`}>
                    {task.priority}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button 
                onClick={() => setStep('form')}
                className="w-full bg-zinc-100 text-zinc-600 font-bold py-5 rounded-[24px] active:scale-95 transition-all"
              >
                {t('resetPlanner')}
              </button>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-6 py-3 rounded-full text-xs font-bold shadow-2xl animate-in slide-in-from-bottom-6 z-[60]">
          {toast}
        </div>
      )}
    </div>
  );
};

export default AIPlanScreen;