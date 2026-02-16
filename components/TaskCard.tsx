
import React, { useState } from 'react';
import { Task, Priority } from '../types';
import { Icons } from '../constants';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onZen: (id: string) => void;
  onDefer: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onZen, onDefer, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isHighPriority = task.priority === Priority.HIGH;
  const isOverdue = task.postponedCount > 2;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(task.id);
  };

  return (
    <div 
      onClick={() => setIsExpanded(!isExpanded)}
      className={`relative overflow-hidden rounded-[24px] border transition-all duration-500 cursor-pointer ${
        task.isCompleted 
        ? 'bg-[#1a1a1a] border-transparent opacity-40 scale-[0.98]' 
        : 'bg-[#252525] border-white/5 hover:border-white/10'
      } ${isExpanded ? 'ring-1 ring-white/10' : ''}`}
    >
      {/* Task Summary Row */}
      <div className="p-5 flex items-center gap-5">
        <button 
          onClick={handleToggle}
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 transform active:scale-90 ${
            task.isCompleted 
            ? 'bg-[#4CAF50] border-[#4CAF50] text-black' 
            : 'bg-transparent border-[#333333] group-hover:border-[#C7C7C7]'
          }`}
        >
          {task.isCompleted ? (
            <div className="animate-in zoom-in duration-300">
              <Icons.Check />
            </div>
          ) : (
            <div className={`w-1 h-1 rounded-full ${isHighPriority ? 'bg-[#FF9800]' : 'bg-[#333333]'}`} />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-bold truncate tracking-tight transition-all duration-500 ${
            task.isCompleted ? 'text-[#717171] line-through' : 'text-[#C7C7C7]'
          }`}>
            {task.title}
          </h3>
          {!isExpanded && !task.isCompleted && (
             <div className="flex items-center gap-2 mt-1">
                <span className="text-[8px] font-black uppercase tracking-widest text-[#555]">{task.category}</span>
                {isHighPriority && <div className="w-1 h-1 rounded-full bg-[#FF9800]" />}
                {isOverdue && <div className="w-1 h-1 rounded-full bg-[#F44336]" />}
             </div>
          )}
        </div>

        <div className={`transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`}>
           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div>

      {/* Progressive Disclosure: Expanded Details */}
      <div 
        className={`grid transition-all duration-500 ease-in-out ${
          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pt-2 space-y-6">
            <div className="h-px bg-white/5 w-full" />
            
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                  <p className="system-caption text-[8px] text-[#555]">الفئة</p>
                  <p className="text-[10px] font-bold text-[#C7C7C7]">{task.category}</p>
               </div>
               <div className="space-y-1">
                  <p className="system-caption text-[8px] text-[#555]">المدة المقدرة</p>
                  <p className="text-[10px] font-bold text-[#C7C7C7]">{task.estimatedMinutes} دقيقة</p>
               </div>
               <div className="space-y-1">
                  <p className="system-caption text-[8px] text-[#555]">الأولوية</p>
                  <p className={`text-[10px] font-bold ${isHighPriority ? 'text-[#FF9800]' : 'text-[#C7C7C7]'}`}>
                    {isHighPriority ? 'عالية' : 'عادية'}
                  </p>
               </div>
               <div className="space-y-1">
                  <p className="system-caption text-[8px] text-[#555]">مرات التأجيل</p>
                  <p className={`text-[10px] font-bold ${isOverdue ? 'text-[#F44336]' : 'text-[#C7C7C7]'}`}>
                    {task.postponedCount}
                  </p>
               </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                onClick={(e) => { e.stopPropagation(); onZen(task.id); }}
                className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Icons.AI />
                بدء التركيز
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDefer(task.id); }}
                className="px-4 bg-[#333333] text-[#C7C7C7] rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-[#444] transition-all"
              >
                تأجيل
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                className="px-4 text-[#717171] hover:text-[#F44336] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
