
import React from 'react';
import { useApp } from '../AppContext';
import { BadgeComponent } from '../components/BadgeComponent';

const StatsScreen: React.FC = () => {
  const { tasks, badges, behaviorHistory } = useApp();
  
  const completedCount = tasks.filter(t => t.isCompleted).length;
  const activeBadges = badges.filter(b => !b.isLocked);

  return (
    <div className="min-h-screen bg-black p-8 pt-24 pb-40 space-y-16">
      <header className="space-y-2">
        <h1 className="text-3xl font-light text-white tracking-tighter">الهوية السلوكية</h1>
        <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-black">تحليل المسار غير المنحاز</p>
      </header>

      {/* Behavioral DNA - Abstract Grid */}
      <section className="grid grid-cols-7 gap-1 h-32">
        {Array.from({ length: 28 }).map((_, i) => {
          const hasActivity = behaviorHistory.length > i;
          return (
            <div 
              key={i} 
              className={`rounded-sm transition-all duration-1000 ${hasActivity ? 'bg-zinc-200' : 'bg-zinc-900'}`} 
            />
          );
        })}
      </section>

      {/* Identity Badges - Minimalist list */}
      <section className="space-y-8">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">أوسمة الإتقان</h3>
        <div className="grid grid-cols-1 gap-4">
          {badges.map(badge => (
            <div 
              key={badge.id} 
              className={`flex items-center gap-6 p-6 rounded-3xl border transition-all ${badge.isLocked ? 'border-zinc-900 opacity-20' : 'border-white/5 bg-zinc-950'}`}
            >
              <span className="text-3xl">{badge.icon}</span>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">{badge.title}</h4>
                <p className="text-[10px] text-zinc-500 font-medium">{badge.description}</p>
              </div>
              {!badge.isLocked && <div className="w-1 h-1 bg-white rounded-full" />}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-950 p-8 rounded-[40px] border border-white/5 space-y-4">
        <p className="text-xs text-zinc-400 leading-relaxed italic">
          "تم رصد نمط إنجاز صباحي ثابت. قدرتك على الاستعادة بعد الانقطاعات تحسنت بنسبة 14% هذا الشهر."
        </p>
      </section>
    </div>
  );
};

export default StatsScreen;
