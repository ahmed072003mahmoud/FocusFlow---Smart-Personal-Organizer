
import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../AppContext';
import { Priority, Category, Task } from '../types';
import { Icons } from '../constants';

const TasksScreen: React.FC = () => {
  const { tasks, toggleTask, addTask, updateTask, deleteTask, undoDeleteTask, clearCompletedTasks, t } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [reasonModalTask, setReasonModalTask] = useState<Task | null>(null); 
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');
  const [filterPriority, setFilterPriority] = useState<Priority | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Todo' | 'Done'>('All');
  const [showFilters, setShowFilters] = useState(false);

  const FAILURE_REASONS = [
    { id: 'time', label: t('reason_time'), value: 'Not enough time' },
    { id: 'energy', label: t('reason_energy'), value: 'Low Energy' },
    { id: 'procrastination', label: t('reason_procrastination'), value: 'Procrastination' },
    { id: 'unclear', label: t('reason_unclear'), value: 'Task Unclear' },
    { id: 'importance', label: t('reason_not_important'), value: 'Not important' },
  ];

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const catMatch = filterCategory === 'All' || t.category === filterCategory;
      const prioMatch = filterPriority === 'All' || t.priority === filterPriority;
      const statusMatch = filterStatus === 'All' || 
                         (filterStatus === 'Todo' && !t.isCompleted) || 
                         (filterStatus === 'Done' && t.isCompleted);
      return catMatch && prioMatch && statusMatch;
    });
  }, [tasks, filterCategory, filterPriority, filterStatus]);

  const handleDeleteTaskRequest = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    if (task.isCompleted) deleteTask(id);
    else setReasonModalTask(task);
  };

  const confirmDeleteWithReason = (reason: string) => {
    if (reasonModalTask) {
      deleteTask(reasonModalTask.id);
      setReasonModalTask(null);
    }
  };

  return (
    <div className="p-6 space-y-6 relative min-h-full pb-32">
      <header className="pt-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">{t('tasks')}</h1>
          <p className="text-zinc-500 mt-1 font-medium italic opacity-70">{t('focusOutput')}</p>
        </div>
      </header>

      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div key={task.id} className="flex items-center gap-4 p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm">
            <button 
              onClick={() => toggleTask(task.id)}
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                task.isCompleted ? 'bg-zinc-900 border-zinc-900' : 'bg-white border-zinc-200'
              }`}
            >
              {task.isCompleted && <Icons.Check />}
            </button>
            <div className="flex-1">
              <h3 className={`font-medium text-sm ${task.isCompleted ? 'line-through text-zinc-400' : 'text-zinc-900'}`}>{task.title}</h3>
              <p className="text-[10px] text-zinc-400 font-medium">{task.category}</p>
            </div>
            <button onClick={() => handleDeleteTaskRequest(task.id)} className="text-rose-500 p-2">
              <Icons.Plus />
            </button>
          </div>
        ))}
        {filteredTasks.length === 0 && <p className="text-center text-zinc-400 py-10">{t('listClear')}</p>}
      </div>

      {reasonModalTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-end justify-center">
           <div className="bg-white w-full max-w-md rounded-t-[48px] p-8 animate-in slide-in-from-bottom duration-400">
              <h2 className="text-2xl font-black text-zinc-900 mb-2">{t('whyTrackerTitle')}</h2>
              <p className="text-zinc-500 text-sm mb-8">{t('whyTrackerDesc')}</p>
              <div className="space-y-3 mb-10">
                 {FAILURE_REASONS.map(reason => (
                    <button key={reason.id} onClick={() => confirmDeleteWithReason(reason.value)} className="w-full text-left bg-zinc-50 border p-5 rounded-[24px] font-bold text-sm text-zinc-800">
                      {reason.label}
                    </button>
                 ))}
              </div>
              <button onClick={() => setReasonModalTask(null)} className="w-full py-4 text-zinc-400 font-bold uppercase tracking-widest text-[10px]">{t('cancel')}</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default TasksScreen;
