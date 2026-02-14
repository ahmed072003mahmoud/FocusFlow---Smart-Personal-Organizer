
import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { Habit } from '../types';
import { Icons } from '../constants';

type SortOption = 'streak' | 'name' | 'recent';

const HabitsScreen: React.FC = () => {
  const { habits, toggleHabit, addHabit, updateHabit, deleteHabit, isSurvivalMode, t } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [detailHabit, setDetailHabit] = useState<Habit | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  // Form State
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

  const openAddModal = () => {
    setEditingHabit(null);
    setFormName('');
    setFormDesc('');
    setIsModalOpen(true);
  };

  const openEditModal = (e: React.MouseEvent, habit: Habit) => {
    e.stopPropagation();
    setEditingHabit(habit);
    setFormName(habit.name);
    setFormDesc(habit.description);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim()) return;
    if (editingHabit) {
      updateHabit({ ...editingHabit, name: formName, description: formDesc });
    } else {
      addHabit({ name: formName, description: formDesc });
    }
    setIsModalOpen(false);
  };

  const HabitCard: React.FC<{ habit: Habit }> = ({ habit }) => (
    <div 
      className={`relative p-6 rounded-[32px] flex items-center justify-between shadow-lg shadow-slate-200/50 transition-all cursor-pointer border ${
        habit.isCompletedToday 
          ? 'bg-gradient-to-br from-[#2B3A67] to-[#496A9A] text-white border-transparent' 
          : 'bg-white border-slate-50 text-slate-900'
      }`}
      onClick={() => setDetailHabit(habit)}
    >
      <div className="flex items-center gap-4">
        {/* CHECKBOX / PROGRESS RING LOOK */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleHabit(habit.id);
          }}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 ${
            habit.isCompletedToday 
              ? 'bg-[#E63946] text-white shadow-lg shadow-[#E63946]/40 rotate-12' 
              : 'bg-slate-50 text-slate-300 border border-slate-100'
          }`}
        >
          {habit.isCompletedToday ? <Icons.Check /> : <Icons.Plus />}
        </button>
        <div>
          <h3 className={`font-black text-sm tracking-tight ${habit.isCompletedToday ? 'text-white' : 'text-[#2B3A67]'}`}>
            {habit.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
             <div className={`w-1 h-1 rounded-full ${habit.isCompletedToday ? 'bg-white/50' : 'bg-[#E63946]'}`} />
             <p className={`text-[10px] font-black uppercase tracking-widest ${habit.isCompletedToday ? 'text-white/60' : 'text-slate-400'}`}>
                {habit.streakCount} Day Streak
             </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
         <button onClick={(e) => openEditModal(e, habit)} className={`p-2 transition-colors ${habit.isCompletedToday ? 'text-white/30 hover:text-white' : 'text-slate-200 hover:text-slate-400'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
         </button>
         <div className={habit.isCompletedToday ? 'text-white' : 'text-[#E63946]'}>
            <Icons.Flame />
         </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8 relative min-h-full pb-32">
      <header className="pt-8">
        <div className="flex items-center gap-3 mb-1">
           <div className="w-1 h-6 bg-[#E63946] rounded-full" />
           <h1 className="text-3xl font-black text-[#2B3A67] tracking-tight">Habits</h1>
        </div>
        <p className="text-slate-500 font-medium">Build your ritual.</p>
      </header>

      {/* TABS */}
      {!isSurvivalMode && (
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
          {(['recent', 'streak', 'name'] as SortOption[]).map(option => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                sortBy === option ? 'bg-white text-[#2B3A67] shadow-sm' : 'text-slate-400'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {/* LIST */}
      <div className="space-y-4">
        {sortedHabits.map(h => <HabitCard key={h.id} habit={h} />)}
        {sortedHabits.length === 0 && (
          <div className="text-center py-20 opacity-30 flex flex-col items-center">
             <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mb-4"><Icons.AI /></div>
             <p className="text-xs font-black uppercase tracking-widest text-slate-400">Void detected</p>
          </div>
        )}
      </div>

      {!isSurvivalMode && (
        <button 
          onClick={openAddModal}
          className="fixed bottom-32 right-8 w-16 h-16 bg-[#2B3A67] text-white rounded-[24px] flex items-center justify-center shadow-2xl z-40 active:scale-90 transition-transform"
        >
          <Icons.Plus />
        </button>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#2B3A67]/60 backdrop-blur-md z-[100] flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-[48px] p-8 animate-in slide-in-from-bottom duration-300">
            <h2 className="text-2xl font-black text-[#2B3A67] mb-8 tracking-tight">New Ritual</h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase px-1">Label</label>
                <input 
                  autoFocus
                  type="text" 
                  value={formName} 
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Morning Prayer"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold focus:outline-none"
                />
              </div>

              <div className="flex gap-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Back</button>
                <button 
                  onClick={handleSave}
                  className="flex-[2] bg-[#2B3A67] text-white font-black py-4 rounded-[20px] shadow-lg"
                >
                  Create Habit
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
