
import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Priority, Category, Task } from '../types';
import { Icons } from '../constants';

const TasksScreen: React.FC = () => {
  const { tasks, toggleTask, deleteTask, t } = useApp();
  const [deletedTaskId, setDeletedTaskId] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(0);

  // Ghost Undo Effect
  useEffect(() => {
    let interval: any;
    if (deletedTaskId) {
      setTimer(5);
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setDeletedTaskId(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [deletedTaskId]);

  const handleRequestDelete = (id: string) => {
    setDeletedTaskId(id);
  };

  const handleUndo = () => {
    setDeletedTaskId(null);
  };

  const confirmPermanentDelete = (id: string) => {
    deleteTask(id);
    setDeletedTaskId(null);
  };

  return (
    <div className="p-8 space-y-12 relative min-h-full pb-40">
      <header className="pt-12">
        <h1 className="heading-title text-4xl text-white">المسار الذهني</h1>
        <p className="text-zinc-600 mt-2 font-medium">كل فكرة لها مكانها الصحيح.</p>
      </header>

      <div className="space-y-4">
        {tasks.filter(t => t.id !== deletedTaskId).map((task) => (
          <div key={task.id} className="group flex items-center gap-6 p-6 bg-zinc-950 border border-white/5 rounded-[32px] hover:border-white/10 transition-all">
            <button 
              onClick={() => toggleTask(task.id)}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                task.isCompleted ? 'bg-white border-white' : 'bg-transparent border-zinc-800 group-hover:border-zinc-600'
              }`}
            >
              {task.isCompleted && <Icons.Check />}
            </button>
            
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-sm truncate ${task.isCompleted ? 'line-through text-zinc-700' : 'text-zinc-300'}`}>
                {task.title}
              </h3>
              <p className="system-caption text-[8px] mt-1">{task.category}</p>
            </div>

            <button 
              onClick={() => handleRequestDelete(task.id)} 
              className="opacity-0 group-hover:opacity-40 hover:opacity-100 transition-opacity p-2 text-zinc-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        ))}

        {/* Ghost Undo UI */}
        {deletedTaskId && (
          <div className="p-6 bg-zinc-900 border border-white/5 rounded-[32px] flex items-center justify-between animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full border-2 border-zinc-800 flex items-center justify-center">
                <span className="text-[10px] font-black text-zinc-500">{timer}</span>
              </div>
              <p className="text-xs font-bold text-zinc-400">تم الإزالة من المسار</p>
            </div>
            <button 
              onClick={handleUndo}
              className="px-6 py-2 bg-white text-black rounded-full system-caption text-[8px]"
            >
              تراجع
            </button>
          </div>
        )}

        {tasks.length === 0 && (
          <div className="py-40 text-center opacity-10">
            <h2 className="heading-title text-2xl">عقلك صافٍ تماماً.</h2>
          </div>
        )}
      </div>

      <div className="fixed bottom-32 left-1/2 -translate-x-1/2 flex items-center gap-4 ui-stealth">
        <span className="system-caption text-[8px]">الحد الأقصى للمهام النشطة: 3</span>
      </div>
    </div>
  );
};

export default TasksScreen;
