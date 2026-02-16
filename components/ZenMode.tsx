
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../AppContext';

export const ZenMode: React.FC = () => {
  const { isZenModeActive, zenTaskId, tasks, toggleZenMode, toggleTask, behaviorHistory } = useApp();
  const [seconds, setSeconds] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [exitCode, setExitCode] = useState('');
  const [targetCode, setTargetCode] = useState('');
  const wakeLock = useRef<any>(null);

  const task = tasks.find(t => t.id === zenTaskId);
  
  // Get the micro-win from behavior history
  const latestEvent = behaviorHistory.filter(h => h.type === 'zen_mode_enter' as any).pop();
  const microWin = latestEvent?.metadata?.microWin;

  useEffect(() => {
    let interval: any;
    
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator) {
        try {
          wakeLock.current = await (navigator as any).wakeLock.request('screen');
        } catch (err: any) {
          console.warn(`${err.name}, ${err.message}: Wake Lock failed.`);
        }
      }
    };

    const releaseWakeLock = async () => {
      if (wakeLock.current) {
        try {
          await wakeLock.current.release();
          wakeLock.current = null;
        } catch (err) {}
      }
    };

    if (isZenModeActive) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
      setTargetCode(Math.floor(1000 + Math.random() * 9000).toString());
      requestWakeLock();
    } else {
      setSeconds(0);
      setIsExiting(false);
      releaseWakeLock();
    }

    return () => {
      if (interval) clearInterval(interval);
      releaseWakeLock();
    };
  }, [isZenModeActive]);

  if (!isZenModeActive || !task) return null;

  const handleExitConfirm = () => {
    if (exitCode === targetCode) {
      toggleZenMode(null);
      setExitCode('');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000] z-[1000] flex flex-col items-center justify-center p-12 overflow-hidden animate-in fade-in duration-1000">
      {/* Background Breathing Pulse */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`
          w-[60vw] h-[60vw] rounded-full transition-all duration-[4000ms] ease-in-out border border-white/5
          ${seconds % 8 < 4 ? 'scale-150 opacity-10' : 'scale-100 opacity-5'}
        `} />
      </div>

      <div className="relative z-10 text-center space-y-20 max-w-lg">
        <header className="space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-700">المهمة الكبيرة</span>
            <h1 className="text-3xl font-black text-white leading-tight opacity-40">{task.title}</h1>
          </div>
          
          {seconds < 120 && microWin && (
            <div className="animate-in fade-in zoom-in duration-1000">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">ابدأ بـ</span>
               <h2 className="text-2xl font-black text-white italic mt-2">"{microWin}"</h2>
            </div>
          )}
        </header>

        <div className="text-[140px] font-thin tracking-tighter text-zinc-900 select-none">
          {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
        </div>

        <div className="space-y-8">
          {!isExiting ? (
            <button 
              onClick={() => { toggleTask(task.id); toggleZenMode(null); }}
              className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.6em] hover:text-white transition-colors"
            >
              تم الإنجاز (خروج)
            </button>
          ) : (
            <div className="bg-zinc-900/50 p-10 rounded-[50px] border border-white/5 animate-in slide-in-from-bottom duration-500 space-y-6">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">أدخل {targetCode} للفك</span>
              <input 
                autoFocus
                maxLength={4}
                value={exitCode}
                onChange={e => setExitCode(e.target.value)}
                className="w-full text-center text-4xl font-black bg-transparent text-white border-none focus:ring-0"
              />
              <button onClick={handleExitConfirm} className="w-full py-4 text-[10px] font-black text-zinc-300 uppercase">فك الحصار الذهني</button>
            </div>
          )}
          
          {!isExiting && (
            <button 
              onClick={() => setIsExiting(true)}
              className="block mx-auto opacity-10 hover:opacity-100 text-[8px] text-white uppercase tracking-widest transition-opacity mt-10"
            >
              إنهاء اضطراري
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ZenMode;
