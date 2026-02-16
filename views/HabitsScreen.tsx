
import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { Habit } from '../types';
import { Icons } from '../constants';

type SortOption = 'streak' | 'name' | 'recent';

const HabitsScreen: React.FC = () => {
  const { habits, toggleHabit, addHabit, updateHabit, deleteHabit, isSurvivalMode, t } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');

  const sortedHabits = useMemo(() => {
    let base = [...habits].sort((a, b) => {
      if (sortBy === 'streak') return b.streakCount - a.streakCount;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    if (isSurvivalMode) {
      const topHabit = [...habits].sort((a, b) => b.streakCount - a.streakCount)[0];
      return topHabit ? [topHabit] : [];
    }

    return base;
  }, [habits, sortBy, isSurvivalMode]);

  const handleSave = () => {
    if (!formName.trim()) return;
    if (editingHabit) {
      updateHabit({ ...editingHabit, name: formName, description: formDesc });
    } else {
      addHabit({ name: formName, description: formDesc });
    }
    setIsModalOpen(false);
    setFormName('');
    setFormDesc('');
  };

  const HabitCard: React.FC<{ habit: Habit }> = ({ habit }) => (
    <div 
      className={`relative p-8 rounded-[40px] flex items-center justify-between transition-all duration-500 border ${
        habit.isCompletedToday 
          ? 'bg-[#2B3A67] text-white border-transparent shadow-2xl' 
          : 'bg-white border-slate-50 text-slate-900 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-6">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleHabit(habit.id);
          }}
          className={`w-16 h-16 rounded-[28px] flex items-center justify-center transition-all flex-shrink-0 ${
            habit.isCompletedToday 
              ? 'bg-[#E63946] text-white shadow-xl shadow-[#E63946]/30 rotate-12 scale-110' 
              : 'bg-slate-50 text-slate-200 hover:text-[#E63946] hover:bg-[#E63946]/5'
          }`}
        >
          {habit.isCompletedToday ? <Icons.Check /> : <Icons.Flame />}
        </button>
        <div>
          <h3 className={`font-black text-xl tracking-tight leading-none ${habit.isCompletedToday ? 'text-white' : 'text-[#2B3A67]'}`}>
            {habit.name}
          </h3>
          <p className={`text-[10px] font-black uppercase tracking-[0.3em] mt-2 ${habit.isCompletedToday ? 'text-white/40' : 'text-slate-300'}`}>
            {habit.streakCount} Day Sequence
          </p>
        </div>
      </div>
      
      <button 
        onClick={() => {
          setEditingHabit(habit);
          setFormName(habit.name);
          setFormDesc(habit.description);
          setIsModalOpen(true);
        }}
        className={`p-3 transition-colors ${habit.isCompletedToday ? 'text-white/20 hover:text-white' : 'text-slate-100 hover:text-slate-300'}`}
      >
        <Icons.Gear />
      </button>
    </div>
  );

  return (
    <div className="p-8 space-y-12 relative min-h-screen">
      <header className="pt-16 flex justify-between items-end">
        <div className="space-y-2">
           <h1 className="text-4xl font-black text-[#2B3A67] tracking-tight">Ritual DNA</h1>
           <p className="text-slate-400 font-medium">Define your automated discipline.</p>
        </div>
        <button 
          onClick={() => { setEditingHabit(null); setIsModalOpen(true); }}
          className="w-14 h-14 bg-[#2B3A67] text-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-105 active:scale-90 transition-all"
        >
          <Icons.Plus />
        </button>
      </header>

      <div className="space-y-6">
        <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl">
          {(['recent', 'streak', 'name'] as SortOption[]).map(option => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                sortBy === option ? 'bg-white text-[#2B3A67] shadow-sm' : 'text-slate-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {sortedHabits.map(h => <HabitCard key={h.id} habit={h} />)}
          {sortedHabits.length === 0 && (
            <div className="text-center py-32 opacity-20 flex flex-col items-center">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6"><Icons.Flame /></div>
               <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Zero Sequences Active</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[#2B3A67]/80 backdrop-blur-xl z-[200] flex items-end justify-center">
          <div className="bg-white w-full max-w-lg rounded-t-[50px] p-10 animate-in slide-in-from-bottom duration-500 shadow-2xl">
            <header className="flex justify-between items-start mb-10">
               <div>
                  <h2 className="text-3xl font-black text-[#2B3A67] tracking-tight">Define Ritual</h2>
                  <p className="text-slate-400 text-sm mt-1">High-performance automation</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-300">✕</button>
            </header>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-2">Label</label>
                <input 
                  autoFocus
                  type="text" 
                  value={formName} 
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Deep Reflection"
                  className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-8 py-5 font-black text-[#2B3A67] placeholder:text-slate-200 outline-none focus:ring-4 ring-[#2B3A67]/5 transition-all"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={handleSave}
                  className="flex-1 bg-[#2B3A67] text-white font-black py-6 rounded-[28px] shadow-2xl shadow-[#2B3A67]/20 uppercase tracking-[0.3em] text-[10px] hover:bg-[#1E2A4A] transition-all"
                >
                  Confirm Ritual
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitsScreen;
