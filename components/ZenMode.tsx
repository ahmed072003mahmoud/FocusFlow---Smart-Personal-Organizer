
import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Icons } from '../constants';

export const ZenMode: React.FC = () => {
  const { isZenModeActive, zenTaskId, tasks, toggleZenMode, toggleTask } = useApp();
  const [seconds, setSeconds] = useState(0);
  const [exitCode, setExitCode] = useState('');
  const [targetCode] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());
  const [showExitDialog, setShowExitDialog] = useState(false);

  const task = tasks.find(t => t.id === zenTaskId);

  useEffect(() => {
    let interval: any;
    if (isZenModeActive) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isZenModeActive]);

  if (!isZenModeActive || !task) return null;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m}:${rs.toString().padStart(2, '0')}`;
  };

  const handleExit = () => {
    if (exitCode === targetCode) {
      toggleZenMode();
      setExitCode('');
      setShowExitDialog(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#F6F7F8] dark:bg-darkBg z-[1000] flex flex-col items-center justify-center p-8 animate-in fade-in duration-1000">
      
      <div className="absolute top-12 left-12">
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">ZEN MODE ACTIVE</span>
      </div>

      <div className="text-center space-y-12 max-w-lg w-full">
         <div className="space-y-4">
            <h1 className="text-4xl font-black text-[#2B3A67] dark:text-white tracking-tight leading-tight">{task.title}</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{task.category}</p>
         </div>

         <div className="text-8xl font-thin tracking-tighter text-[#2B3A67] dark:text-white/20">
            {formatTime(seconds)}
         </div>

         <div className="pt-24 space-y-6">
            <button 
              onClick={() => { toggleTask(task.id); toggleZenMode(); }}
              className="px-12 py-5 bg-[#E63946] text-white font-black rounded-[24px] uppercase tracking-widest text-xs shadow-2xl shadow-[#E63946]/30 hover:scale-105 active:scale-95 transition-all"
            >
              COMPLETE & EXIT
            </button>
            <br/>
            <button 
              onClick={() => setShowExitDialog(true)}
              className="text-slate-300 font-bold uppercase tracking-[0.3em] text-[8px] hover:text-slate-500 transition-colors"
            >
              EXIT TO DASHBOARD
            </button>
         </div>
      </div>

      {showExitDialog && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-xl z-[1001] flex items-center justify-center p-6">
           <div className="w-full max-w-sm text-center space-y-8">
              <h2 className="text-xl font-black text-[#2B3A67]">Intentional Exit</h2>
              <p className="text-slate-500 text-sm font-medium">To prevent distraction, enter the code below to exit focus lock.</p>
              <div className="text-4xl font-black tracking-[0.5em] text-slate-200">{targetCode}</div>
              <input 
                type="text" 
                maxLength={4} 
                value={exitCode}
                onChange={e => setExitCode(e.target.value)}
                autoFocus
                className="w-full text-center text-3xl font-black bg-slate-50 border-b-4 border-slate-200 py-4 focus:outline-none focus:border-[#2B3A67] transition-all"
              />
              <div className="flex gap-4">
                <button onClick={() => setShowExitDialog(false)} className="flex-1 py-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Back to Focus</button>
                <button onClick={handleExit} className="flex-1 bg-[#2B3A67] text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest">Confirm Exit</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
