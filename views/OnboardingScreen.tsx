
import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';

const OnboardingScreen: React.FC = () => {
  const { completeOnboarding, addTask } = useApp();
  const [task, setTask] = useState('');
  const [stage, setStage] = useState<'intro' | 'empty' | 'action' | 'done'>('intro');

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage('empty'), 2000),
      setTimeout(() => setStage('action'), 4500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleFinish = () => {
    if (task.trim()) {
      addTask({
        title: task,
        category: 'Study',
        priority: 'High',
        estimatedMinutes: 25,
        deadline: new Date().toISOString()
      });
      setStage('done');
      setTimeout(completeOnboarding, 1500);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#000] flex flex-col items-center justify-center p-12 overflow-hidden">
      {/* Intro Stage: Philosophical Hook */}
      {stage === 'intro' && (
        <div className="animate-in fade-in zoom-in duration-1000 text-center space-y-4">
          <h1 className="text-3xl font-black text-white tracking-tight">التركيز ليس مجهوداً..</h1>
          <p className="text-zinc-500 font-medium">بل هو مساحة نصنعها.</p>
        </div>
      )}

      {/* Empty Stage: Mental Clearance */}
      {stage === 'empty' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 text-center">
          <h1 className="text-4xl font-black text-white tracking-tighter">أفرغ ما في رأسك.</h1>
        </div>
      )}

      {/* Action Stage: The Zero-Friction Input */}
      {stage === 'action' && (
        <div className="w-full max-w-md space-y-16 animate-in fade-in zoom-in duration-1000 text-center">
          <div className="space-y-4">
            <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.5em]">المهمة الأولى</span>
            <h2 className="text-3xl font-black text-white tracking-tight">ما هو التحدي الذي يسرق هدوءك الآن؟</h2>
          </div>

          <div className="relative">
            <input 
              autoFocus
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFinish()}
              placeholder="مثلاً: مراجعة فصل الفيزياء..."
              className="w-full bg-transparent border-b-2 border-zinc-900 focus:border-white py-8 text-2xl font-black text-white text-center outline-none transition-all placeholder:text-zinc-900"
            />
            {task && (
               <button 
                onClick={handleFinish}
                className="mt-12 px-12 py-5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4"
               >
                 التزام بالتنفيذ
               </button>
            )}
          </div>
        </div>
      )}

      {/* Done Stage: Positive Reinforcement */}
      {stage === 'done' && (
        <div className="animate-in zoom-in duration-700 text-center space-y-6">
           <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_white/20]">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
           </div>
           <h2 className="text-2xl font-black text-white">تم الوعد. لنبدأ.</h2>
        </div>
      )}
    </div>
  );
};

export default OnboardingScreen;
