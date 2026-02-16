
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
      relative p-6 rounded-[35px] glass-card transition-all duration-500 flex items-center gap-6 group glow-border
      ${task.isCompleted ? 'opacity-30 grayscale scale-[0.98]' : 'hover:scale-[1.02] hover:bg-white/5'}
    `}>
      {/* Checkbox Interface */}
      <button 
        onClick={() => onToggle(task.id)}
        className={`
          w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all border-2
          ${task.isCompleted ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-transparent border-white/10 group-hover:border-indigo-500/50'}
        `}
      >
        {task.isCompleted ? <Icons.Check /> : <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-indigo-400 transition-colors" />}
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${categoryConfig.bg} ${categoryConfig.color}`}>
            {categoryConfig.icon} {categoryConfig.label}
          </span>
          {task.priority === Priority.HIGH && (
            <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400">
              عاجل
            </span>
          )}
        </div>
        
        <h3 className={`text-lg font-black text-white/90 truncate tracking-tight transition-all ${task.isCompleted ? 'line-through text-slate-500' : ''}`}>
          {task.title}
        </h3>
        
        <div className="flex items-center gap-3 mt-1.5 text-slate-500">
           <p className="text-[10px] font-bold uppercase tracking-widest">{task.time || '09:00 AM'}</p>
           <span className="text-white/10">•</span>
           <p className="text-[10px] font-bold uppercase tracking-widest">{task.estimatedMinutes} دقيقة</p>
        </div>
      </div>

      {/* Focus Action */}
      {!task.isCompleted && (
        <button 
          onClick={() => onZen(task.id)}
          className="w-11 h-11 rounded-[20px] bg-white/5 text-slate-400 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all shadow-inner active:scale-90"
        >
          <Icons.AI />
        </button>
      )}
    </div>
  );
};

export default TaskCard;
