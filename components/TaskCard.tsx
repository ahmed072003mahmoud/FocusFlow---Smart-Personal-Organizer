
import React from 'react';
import { Task, Priority, Category } from '../types';
import { Icons } from '../constants';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onZen: (id: string) => void;
  onDefer: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onZen, onDefer }) => {
  const categoryConfig = {
    [Category.STUDY]: { color: 'text-indigo-400', bg: 'bg-indigo-400/10', icon: '🧠', label: 'دراسة' },
    [Category.PRAYER]: { color: 'text-emerald-400', bg: 'bg-emerald-400/10', icon: '🕌', label: 'عبادة' },
    [Category.HABIT]: { color: 'text-amber-400', bg: 'bg-amber-400/10', icon: '🎯', label: 'عادة' },
    [Category.WORK]: { color: 'text-violet-400', bg: 'bg-violet-400/10', icon: '💼', label: 'عمل' },
    [Category.OTHER]: { color: 'text-slate-400', bg: 'bg-slate-400/10', icon: '✨', label: 'أخرى' },
  }[task.category] || { color: 'text-slate-400', bg: 'bg-slate-400/10', icon: '•', label: 'غير محدد' };

  return (
    <div className={`
      relative p-7 rounded-[40px] glass-panel transition-all duration-700 flex items-center gap-7 group premium-card
      ${task.isCompleted ? 'opacity-30 grayscale scale-[0.98]' : 'hover:bg-white/[0.04]'}
    `}>
      {/* Precision Checkbox */}
      <button 
        onClick={() => onToggle(task.id)}
        className={`
          w-14 h-14 rounded-[22px] flex items-center justify-center flex-shrink-0 transition-all border-2
          ${task.isCompleted ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-transparent border-white/10 group-hover:border-indigo-500/40'}
        `}
      >
        {task.isCompleted ? <Icons.Check /> : <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-indigo-400 transition-colors animate-pulse" />}
      </button>

      {/* Task Meta & Title */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2.5">
          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border border-white/5 ${categoryConfig.bg} ${categoryConfig.color}`}>
            {categoryConfig.icon} {categoryConfig.label}
          </span>
          {task.priority === Priority.HIGH && (
            <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              أولوية قصوى
            </span>
          )}
        </div>
        
        <h3 className={`text-xl font-bold text-white/95 truncate tracking-tight transition-all ${task.isCompleted ? 'line-through text-slate-600' : ''}`}>
          {task.title}
        </h3>
        
        <div className="flex items-center gap-4 mt-2.5 text-slate-500">
           <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{task.time || 'إيقاع حر'}</span>
           </div>
           <span className="text-white/10 text-xs">•</span>
           <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{task.estimatedMinutes} دقيقة</span>
           </div>
        </div>
      </div>

      {/* Deep Focus Trigger */}
      {!task.isCompleted && (
        <button 
          onClick={() => onZen(task.id)}
          className="w-12 h-12 rounded-[22px] bg-white/[0.03] text-slate-500 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all shadow-inner active:scale-90 border border-white/5"
        >
          <Icons.AI />
        </button>
      )}
    </div>
  );
};

export default TaskCard;
