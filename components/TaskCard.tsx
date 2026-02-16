
import React from 'react';
import { Task } from '../types';
import { Icons } from '../constants';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onZen: (id: string) => void;
  onDefer: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onZen }) => {
  return (
    <div className="p-5 rounded-[30px] glass-panel border-white/[0.02] flex items-center gap-5 group hover:bg-white/[0.02] transition-all">
      <button 
        onClick={() => onToggle(task.id)}
        className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center transition-all group-hover:border-zinc-600"
      >
        <div className="w-1 h-1 rounded-full bg-zinc-800 group-hover:bg-zinc-600" />
      </button>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-zinc-400 truncate tracking-tight group-hover:text-zinc-200">
          {task.title}
        </h3>
      </div>

      <button 
        onClick={() => onZen(task.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600 hover:text-zinc-100"
      >
        <Icons.AI />
      </button>
    </div>
  );
};

export default TaskCard;
