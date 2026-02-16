
import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Priority, Category, Task } from '../types';
import TaskCard from '../components/TaskCard';

const TasksScreen: React.FC = () => {
  const { tasks, toggleTask, deleteTask, deferTask, toggleZenMode, t } = useApp();
  const [deletedTaskId, setDeletedTaskId] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    let interval: any;
    if (deletedTaskId) {
      setTimer(5);
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            deleteTask(deletedTaskId);
            setDeletedTaskId(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [deletedTaskId]);

  const handleRequestDelete = (id: string) => setDeletedTaskId(id);
  const handleUndo = () => setDeletedTaskId(null);

  const sortedTasks = useMemo(() => {
    return [...tasks].filter(t => t.id !== deletedTaskId).sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
      if (a.priority !== b.priority) return a.priority === Priority.HIGH ? -1 : 1;
      return b.postponedCount - a.postponedCount;
    });
  }, [tasks, deletedTaskId]);

  return (
    <div className="p-8 space-y-12 relative min-h-screen bg-[#1E1E1E] pb-40 overflow-y-auto no-scrollbar">
      <header className="pt-12">
        <h1 className="heading-title text-4xl">المسار الذهني</h1>
        <p className="text-[#717171] mt-2 font-medium text-sm">التزام صامت بالأهداف اليومية.</p>
      </header>

      <div className="space-y-4">
        {sortedTasks.map((task) => (
          <TaskCard 
            key={task.id}
            task={task}
            onToggle={toggleTask}
            onZen={toggleZenMode}
            onDefer={deferTask}
            onDelete={handleRequestDelete}
          />
        ))}

        {deletedTaskId && (
          <div className="p-5 bg-[#333333] border border-white/5 rounded-[24px] flex items-center justify-between animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center">
                <span className="text-[10px] font-black text-[#C7C7C7]">{timer}</span>
              </div>
              <p className="text-[10px] font-bold text-[#C7C7C7] uppercase tracking-wider">تم الحذف</p>
            </div>
            <button 
              onClick={handleUndo}
              className="px-4 py-2 bg-[#C7C7C7] text-black rounded-full font-black text-[9px] uppercase tracking-widest"
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
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#717171]">Monochrome Mode • Subtle Balance</span>
      </div>
    </div>
  );
};

export default TasksScreen;
