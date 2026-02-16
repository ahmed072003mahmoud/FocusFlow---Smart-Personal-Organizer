
import React, { useMemo } from 'react';
import { useApp } from '../AppContext';
import { HabitHeatmap } from '../components/HabitHeatmap';

const StatsScreen: React.FC = () => {
  const { tasks, habits, focusSessions, behaviorHistory } = useApp();
  
  const completedCount = tasks.filter(t => t.isCompleted).length;
  const totalFocusMinutes = useMemo(() => {
    return Math.round(focusSessions.reduce((acc, s) => acc + s.actualSeconds, 0) / 60);
  }, [focusSessions]);

  const avgSessionLength = useMemo(() => {
    if (focusSessions.length === 0) return 0;
    return Math.round(totalFocusMinutes / focusSessions.length);
  }, [focusSessions, totalFocusMinutes]);

  return (
    <div className="min-h-screen bg-[#1E1E1E] p-8 pt-24 pb-40 space-y-16 overflow-y-auto no-scrollbar">
      <header className="space-y-2">
        <h1 className="text-4xl font-light text-white tracking-tighter">تحليل الأداء</h1>
        <p className="text-[#717171] text-[10px] uppercase tracking-widest font-black">بصمتك الإنتاجية الرقمية</p>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#252525] p-6 rounded-[32px] border border-white/5 space-y-1">
           <p className="system-caption text-[8px] text-[#717171]">إجمالي التركيز</p>
           <p className="text-2xl font-light text-white tracking-tighter">{totalFocusMinutes} <span className="text-[10px] font-bold">دقيقة</span></p>
        </div>
        <div className="bg-[#252525] p-6 rounded-[32px] border border-white/5 space-y-1">
           <p className="system-caption text-[8px] text-[#717171]">متوسط الجلسة</p>
           <p className="text-2xl font-light text-white tracking-tighter">{avgSessionLength} <span className="text-[10px] font-bold">دقيقة</span></p>
        </div>
      </div>

      {/* Habit DNA */}
      <section className="space-y-8">
        <h3 className="system-caption text-[10px] font-black uppercase tracking-[0.3em] text-[#717171]">خرائط العادات</h3>
        <div className="space-y-8">
          {habits.map(habit => (
            <div key={habit.id} className="bg-[#252525]/50 p-8 rounded-[40px] border border-white/5 space-y-6">
               <h4 className="text-sm font-bold text-white">{habit.name}</h4>
               <HabitHeatmap habit={habit} />
            </div>
          ))}
        </div>
      </section>

      {/* Behavioral ActivityDNA - Abstract Grid */}
      <section className="space-y-4">
        <h3 className="system-caption text-[#717171]">كثافة النشاط</h3>
        <div className="grid grid-cols-7 gap-1 h-32">
          {Array.from({ length: 28 }).map((_, i) => {
            const hasActivity = behaviorHistory.length > i;
            return (
              <div 
                key={i} 
                className={`rounded-sm transition-all duration-1000 ${hasActivity ? 'bg-white opacity-40' : 'bg-[#252525]'}`} 
              />
            );
          })}
        </div>
      </section>

      <section className="bg-white/5 p-8 rounded-[40px] border border-white/5 space-y-4">
        <p className="text-xs text-[#C7C7C7] leading-relaxed italic opacity-80">
          "تلاحظ الخوارزمية تحسناً في قدرتك على الحفاظ على تركيز ثابت. جلساتك المسائية أصبحت أكثر عمقاً بنسبة 12%."
        </p>
      </section>
    </div>
  );
};

export default StatsScreen;
