
import React from 'react';
import { Task, Priority } from '../types';
import { Icons } from '../constants';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onTimer: (id: string) => void;
  onZen: (id: string) => void;
  t: (key: string) => string;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onTimer, onZen, t }) => {
  const isOverdue = task.postponedCount >= 3;

  return (
    <div className={`p-6 rounded-[32px] bg-white shadow-lg border-2 transition-all flex justify-between items-center relative overflow-hidden ${task.isRunning ? 'border-emerald-500 scale-105' : 'border-transparent'} ${task.isCompleted ? 'opacity-40 grayscale scale-95' : 'hover:scale-[1.01]'}`}>
      
      {/* AI Whisper Dot */}
      {isOverdue && !task.isCompleted && (
        <div className="absolute top-2 right-2 flex items-center gap-1 group">
           <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
           <span className="text-[7px] font-black text-blue-500 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">AI Whisper: Re-evaluate?</span>
        </div>
      )}

      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-2 mb-2">
          {task.isRunning && <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest animate-pulse">{t('recordingFocus')}</span>}
          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${task.priority === Priority.HIGH ? 'bg-rose-50 text-[#E63946]' : 'bg-slate-50 text-slate-400'}`}>{task.priority}</span>
        </div>
        <h3 className="font-bold text-lg truncate text-[#2B3A67]">{task.title}</h3>
        <p className="text-[10px] font-black mt-1 text-slate-400 uppercase tracking-widest">
          {task.category} • {task.estimatedMinutes}m
        </p>
      </div>

      <div className="flex items-center gap-3">
        {!task.isCompleted && (
          <>
            <button onClick={() => onZen(task.id)} className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all">
              🧘
            </button>
            <button onClick={() => onTimer(task.id)} className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${task.isRunning ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-50 text-slate-300 hover:text-slate-500'}`}>
              {task.isRunning ? <div className="w-3 h-3 bg-white rounded-sm animate-pulse" /> : <Icons.AI />}
            </button>
          </>
        )}
        <button onClick={() => onToggle(task.id)} className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${task.isCompleted ? 'bg-[#E63946] border-[#E63946] shadow-lg shadow-[#E63946]/20' : 'border-slate-200 hover:border-[#E63946]'}`}>
          {task.isCompleted ? <Icons.Check /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
