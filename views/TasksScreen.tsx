
import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../AppContext';
import { Priority, Category, Task } from '../types';
import { Icons } from '../constants';

const FAILURE_REASONS = [
  { id: 'time', label: '⏳ Not enough time', value: 'Not enough time' },
  { id: 'energy', label: '😴 Low Energy / Tired', value: 'Low Energy' },
  { id: 'procrastination', label: '🐌 Procrastination', value: 'Procrastination' },
  { id: 'unclear', label: '❓ Task Unclear', value: 'Task Unclear' },
  { id: 'importance', label: '🗑️ Not important', value: 'Not important' },
];

const TasksScreen: React.FC = () => {
  const { tasks, toggleTask, addTask, updateTask, deleteTask, undoDeleteTask, clearCompletedTasks } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [reasonModalTask, setReasonModalTask] = useState<Task | null>(null); // NEW: Track task awaiting failure reason
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');
  const [filterPriority, setFilterPriority] = useState<Priority | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Todo' | 'Done'>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState<{ message: string; action?: () => void; actionLabel?: string } | null>(null);

  // Swipe State
  const [swipedTaskId, setSwipedTaskId] = useState<string | null>(null);
  const touchStartX = useRef<number>(0);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formTime, setFormTime] = useState('09:00 AM');
  const [formCategory, setFormCategory] = useState<Category>(Category.STUDY);
  const [formPriority, setFormPriority] = useState<Priority>(Priority.NORMAL);

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

  const highPriority = filteredTasks.filter(t => t.priority === Priority.HIGH);
  const normalPriority = filteredTasks.filter(t => t.priority === Priority.NORMAL);

  const showToast = (message: string, actionLabel?: string, action?: () => void) => {
    setToast({ message, action, actionLabel });
    setTimeout(() => setToast(null), 5000);
  };

  const openAddModal = () => {
    setEditingTask(null);
    setFormTitle('');
    setFormTime('09:00 AM');
    setFormCategory(Category.STUDY);
    setFormPriority(Priority.NORMAL);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormTime(task.time || '09:00 AM');
    setFormCategory(task.category);
    setFormPriority(task.priority || Priority.NORMAL);
    setIsModalOpen(true);
    setSwipedTaskId(null);
  };

  const handleSave = () => {
    if (!formTitle.trim()) return;

    if (editingTask) {
      updateTask({
        ...editingTask,
        title: formTitle,
        time: formTime,
        category: formCategory,
        priority: formPriority,
      });
      showToast('Task updated');
    } else {
      addTask({
        title: formTitle,
        isCompleted: false,
        priority: formPriority,
        time: formTime,
        category: formCategory,
        deadline: new Date().toISOString(),
        estimatedMinutes: 30,
      });
      showToast('Task added');
    }
    setIsModalOpen(false);
  };

  // UPDATED: handle deletion with interceptor
  const handleDeleteTaskRequest = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // IF COMPLETED: Delete immediately
    if (task.isCompleted) {
      executeDeletion(id);
    } else {
      // IF UNCOMPLETED: Trigger "Why Tracker"
      setReasonModalTask(task);
      setSwipedTaskId(null); // Reset swipe state to show the modal clearly
    }
  };

  const executeDeletion = (id: string) => {
    deleteTask(id);
    showToast('Task deleted', 'Undo', () => undoDeleteTask());
    setSwipedTaskId(null);
  };

  const confirmDeleteWithReason = (reason: string) => {
    if (reasonModalTask) {
      // In a real app, we'd log this reasonModalTask.id + reason to an analytics service
      console.log(`[AI LEARNING] Task "${reasonModalTask.title}" failed because: ${reason}`);
      
      executeDeletion(reasonModalTask.id);
      setReasonModalTask(null);
      
      // Specialist feedback
      setTimeout(() => {
        showToast("Thanks! We'll adjust your future schedule based on this.");
      }, 500);
    }
  };

  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent, id: string) => {
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;

    if (deltaX > 70) {
      setSwipedTaskId(id); 
    } else if (deltaX < -70) {
      setSwipedTaskId(null); 
    }
  };

  const TaskCard: React.FC<{ task: Task }> = ({ task }) => (
    <div 
      className="relative overflow-hidden group"
      onTouchStart={(e) => handleTouchStart(e, task.id)}
      onTouchEnd={(e) => handleTouchEnd(e, task.id)}
    >
      <div className="absolute inset-0 flex items-center justify-end px-6 bg-red-500 text-white rounded-2xl">
         <button 
          onClick={() => handleDeleteTaskRequest(task.id)}
          className="flex flex-col items-center gap-1"
         >
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
           <span className="text-[7px] font-black uppercase tracking-widest">Remove</span>
         </button>
      </div>

      <div 
        className={`flex items-center gap-4 p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm cursor-pointer transition-transform duration-300 ease-out ${swipedTaskId === task.id ? '-translate-x-20' : 'translate-x-0'}`}
        onClick={() => openEditModal(task)}
      >
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleTask(task.id);
          }}
          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
            task.isCompleted ? 'bg-zinc-900 border-zinc-900' : 'bg-white border-zinc-200'
          }`}
        >
          {task.isCompleted && <Icons.Check />}
        </button>
        <div className="flex-1">
          <h3 className={`font-medium text-sm transition-all ${
            task.isCompleted ? 'line-through text-zinc-400' : 'text-zinc-900'
          }`}>
            {task.title}
          </h3>
          <p className="text-[10px] text-zinc-400 font-medium">{task.time} • {task.category}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); openEditModal(task); }}
            className="text-zinc-300 hover:text-zinc-900 p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6 relative min-h-full pb-32">
      <header className="pt-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Tasks</h1>
          <p className="text-zinc-500 mt-1 font-medium italic opacity-70">Focus on the output, not the hours.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => clearCompletedTasks()}
            className="w-10 h-10 bg-zinc-50 border border-zinc-200 text-zinc-500 rounded-xl flex items-center justify-center hover:bg-zinc-100 transition-colors"
            title="Archive Completed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        </div>
      </header>

      <section>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest hover:text-zinc-900 transition-colors mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          Filters {(filterCategory !== 'All' || filterPriority !== 'All' || filterStatus !== 'All') ? '(Active)' : ''}
        </button>

        {showFilters && (
          <div className="bg-zinc-50 p-5 rounded-3xl border border-zinc-200 space-y-5 mb-6 animate-in slide-in-from-top-2 duration-300 shadow-sm">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-zinc-400 uppercase">Status</p>
              <div className="flex gap-2">
                {['All', 'Todo', 'Done'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status as any)}
                    className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition-all border ${
                      filterStatus === status ? 'bg-zinc-900 text-white border-transparent' : 'bg-white text-zinc-500 border-zinc-100 shadow-sm'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-zinc-400 uppercase">Category</p>
              <div className="flex flex-wrap gap-2">
                {['All', ...Object.values(Category)].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat as any)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${
                      filterCategory === cat ? 'bg-zinc-900 text-white border-transparent' : 'bg-white text-zinc-500 border-zinc-100 shadow-sm'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-zinc-400 uppercase">Priority</p>
              <div className="flex gap-2">
                {['All', ...Object.values(Priority)].map(prio => (
                  <button
                    key={prio}
                    onClick={() => setFilterPriority(prio as any)}
                    className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${
                      filterPriority === prio ? 'bg-zinc-900 text-white border-transparent' : 'bg-white text-zinc-500 border-zinc-100 shadow-sm'
                    }`}
                  >
                    {prio}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="space-y-6">
        {highPriority.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              High Priority
            </h2>
            <div className="space-y-3">
              {highPriority.map(t => <TaskCard key={t.id} task={t} />)}
            </div>
          </section>
        )}

        <section className="space-y-3">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
            {highPriority.length > 0 ? 'Normal Tasks' : 'Tasks'}
          </h2>
          <div className="space-y-3">
            {normalPriority.map(t => <TaskCard key={t.id} task={t} />)}
          </div>
          {filteredTasks.length === 0 && (
            <div className="text-center py-12 opacity-30">
              <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">List is clear</p>
            </div>
          )}
        </section>
      </div>

      <button 
        onClick={openAddModal}
        className="fixed bottom-28 right-6 w-14 h-14 bg-zinc-900 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-zinc-900/40 z-40 active:scale-90 transition-transform"
      >
        <Icons.Plus />
      </button>

      {/* WHY TRACKER MODAL (FAILURE REASON ANALYSIS) */}
      {reasonModalTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-end justify-center">
           <div className="bg-white w-full max-w-md rounded-t-[48px] p-8 animate-in slide-in-from-bottom duration-400">
              <header className="mb-8">
                 <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Couldn't finish this?</h2>
                 <p className="text-zinc-500 text-sm mt-2 font-medium leading-relaxed">
                   It's okay. Help us understand why to optimize your future schedule.
                 </p>
              </header>

              <div className="space-y-3 mb-10">
                 {FAILURE_REASONS.map(reason => (
                    <button 
                      key={reason.id}
                      onClick={() => confirmDeleteWithReason(reason.value)}
                      className="w-full text-left bg-zinc-50 border border-zinc-100 hover:border-zinc-300 hover:bg-zinc-100 p-5 rounded-[24px] transition-all flex items-center gap-3 group"
                    >
                      <span className="flex-1 text-sm font-bold text-zinc-800">{reason.label}</span>
                      <svg className="text-zinc-300 group-hover:text-zinc-900 transition-colors" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                 ))}
              </div>

              <button 
                onClick={() => setReasonModalTask(null)}
                className="w-full py-4 text-zinc-400 font-bold uppercase tracking-widest text-[10px]"
              >
                Cancel Deletion
              </button>
           </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
                {editingTask ? 'Edit Task' : 'New Task'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase mb-2 block tracking-widest px-1">Task Title</label>
                <input 
                  autoFocus
                  type="text" 
                  value={formTitle} 
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase mb-2 block tracking-widest px-1">Time</label>
                  <input 
                    type="text" 
                    value={formTime} 
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="e.g. 09:00 AM"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase mb-2 block tracking-widest px-1">Priority</label>
                  <select 
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as Priority)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-4 focus:outline-none appearance-none font-bold"
                  >
                    {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase mb-2 block tracking-widest px-1">Category</label>
                <div className="flex gap-2">
                  {Object.values(Category).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFormCategory(cat)}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${
                        formCategory === cat ? 'bg-zinc-900 text-white border-transparent shadow-lg' : 'bg-white text-zinc-500 border-zinc-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-2 pb-4">
                {editingTask && (
                   <button 
                    onClick={() => { handleDeleteTaskRequest(editingTask.id); setIsModalOpen(false); }}
                    className="flex-1 bg-red-50 text-red-500 font-bold py-5 rounded-3xl active:scale-95 transition-all uppercase tracking-widest text-[10px]"
                   >
                    Remove
                   </button>
                )}
                <button 
                  onClick={handleSave}
                  disabled={!formTitle.trim()}
                  className={`${editingTask ? 'flex-[2]' : 'w-full'} bg-zinc-900 text-white font-bold py-5 rounded-3xl shadow-xl shadow-zinc-900/20 active:scale-95 transition-all disabled:opacity-50 uppercase tracking-widest`}
                >
                  {editingTask ? 'Update' : 'Add Task'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Undo Toast */}
      {toast && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-zinc-900 text-white px-6 py-4 rounded-[20px] shadow-2xl animate-in slide-in-from-bottom-6 z-[120] flex items-center justify-between">
          <span className="text-xs font-bold tracking-wide">{toast.message}</span>
          {toast.action && (
            <button 
              onClick={() => { toast.action?.(); setToast(null); }}
              className="text-white border-b border-white text-[10px] font-black uppercase tracking-widest"
            >
              {toast.actionLabel || 'Action'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TasksScreen;
