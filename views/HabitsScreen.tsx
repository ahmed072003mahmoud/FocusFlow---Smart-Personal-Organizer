
import React from 'react';
import { useApp } from '../AppContext';
import { Icons } from '../constants';

const HabitsScreen: React.FC = () => {
  const { habits, toggleHabit, t } = useApp();

  return (
    <div className="min-h-screen p-8 pt-24 bg-[#F8F9FA] pb-40">
      <header className="mb-16">
        <h1 className="text-4xl font-black text-zinc-900 tracking-tighter">DNA الطقوس</h1>
        <p className="text-zinc-400 font-bold uppercase tracking-[0.3em] text-[8px] mt-2">نظام الأتمتة السلوكي</p>
      </header>

      <div className="grid gap-6">
        {habits.map((habit) => (
          <div 
            key={habit.id}
            className={`group relative p-10 rounded-[50px] border transition-all duration-700 overflow-hidden ${
              habit.isCompletedToday 
                ? 'bg-zinc-900 border-transparent shadow-2xl' 
                : 'bg-white border-zinc-100 shadow-sm'
            }`}
          >
            {/* Visual Blob Background */}
            <div 
              className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 transition-transform duration-1000 ${habit.isCompletedToday ? 'scale-150 bg-white' : 'scale-50 bg-zinc-900'}`} 
            />

            <div className="relative z-10 flex items-center justify-between">
              <div className="space-y-2">
                <h3 className={`text-2xl font-black tracking-tight ${habit.isCompletedToday ? 'text-white' : 'text-zinc-900'}`}>
                  {habit.name}
                </h3>
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${habit.isCompletedToday ? 'text-zinc-500' : 'text-zinc-300'}`}>
                    سلسلة {habit.streakCount} أيام
                  </span>
                  <div className={`w-1 h-1 rounded-full ${habit.isCompletedToday ? 'bg-zinc-700' : 'bg-zinc-100'}`} />
                  <span className={`text-[9px] font-bold ${habit.isCompletedToday ? 'text-zinc-400' : 'text-zinc-400'}`}>
                    {habit.description}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => toggleHabit(habit.id)}
                className={`w-20 h-20 rounded-[35px] flex items-center justify-center transition-all duration-500 ${
                  habit.isCompletedToday 
                    ? 'bg-zinc-800 text-white rotate-12 scale-110 shadow-lg' 
                    : 'bg-zinc-50 text-zinc-200 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                {habit.isCompletedToday ? <Icons.Check /> : <Icons.Flame />}
              </button>
            </div>
          </div>
        ))}

        {habits.length === 0 && (
          <div className="text-center py-40 opacity-20">
             <Icons.Flame />
             <p className="text-[10px] font-black uppercase tracking-widest mt-6">لا يوجد طقوس نشطة</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitsScreen;
