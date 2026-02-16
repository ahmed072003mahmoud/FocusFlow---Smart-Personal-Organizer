
import React from 'react';
import { Habit } from '../types';

interface HabitHeatmapProps {
  habit: Habit;
}

export const HabitHeatmap: React.FC<HabitHeatmapProps> = ({ habit }) => {
  const today = new Date();
  const daysInMonth = 30;
  const history = habit.history || {};

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
         <span className="system-caption text-[8px] text-[#555]">الالتزام الأخير</span>
         <span className="text-[10px] font-bold text-white">{habit.streakCount} يوم متواصل</span>
      </div>
      <div className="grid grid-cols-10 gap-1.5">
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const d = new Date();
          d.setDate(today.getDate() - (daysInMonth - 1 - i));
          const dateStr = d.toISOString().split('T')[0];
          const isCompleted = !!history[dateStr];
          
          return (
            <div 
              key={i} 
              className={`aspect-square rounded-sm transition-all duration-700 ${isCompleted ? 'bg-[#4CAF50]' : 'bg-[#252525] border border-white/5'}`}
              title={dateStr}
            />
          );
        })}
      </div>
    </div>
  );
};
