
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../AppContext';

export const ZenMode: React.FC = () => {
  const { isZenModeActive, zenTaskId, tasks, toggleZenMode, toggleTask } = useApp();
  const [seconds, setSeconds] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [exitCode, setExitCode] = useState('');
  const [targetCode, setTargetCode] = useState('');
  const wakeLock = useRef<any>(null);

  const task = tasks.find(t => t.id === zenTaskId);

  useEffect(() => {
    let interval: any;
    
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator) {
        try {
          wakeLock.current = await (navigator as any).wakeLock.request('screen');
          console.log('Wake Lock is active');
        } catch (err: any) {
          console.warn(`${err.name}, ${err.message}: Wake Lock failed (likely permissions policy).`);
        }
      }
    };

    const releaseWakeLock = async () => {
      if (wakeLock.current) {
        try {
          await wakeLock.current.release();
          wakeLock.current = null;
        } catch (err) {
          console.error('Failed to release wake lock:', err);
        }
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
    <div className="fixed inset-0 bg-[#FDFDFE] z-[1000] flex flex-col items-center justify-center p-12 overflow-hidden animate-in fade-in duration-1000">
      {/* Visual Breathing Guide */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <div className="w-[80vw] h-[80vw] bg-[#2B3A67] rounded-full animate-zen-breath" />
      </div>

      <div className="relative z-10 text-center space-y-16 max-w-lg">
        <header className="space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">نظام التركيز العميق</span>
          <h1 className="text-4xl font-black text-slate-900 leading-tight">{task.title}</h1>
        </header>

        <div className="text-[120px] font-thin tracking-tighter text-slate-100 select-none">
          {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
        </div>

        <div className="space-y-8">
          {!isExiting ? (
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => { toggleTask(task.id); toggleZenMode(null); }}
                className="bg-[#2B3A67] text-white px-12 py-5 rounded-[25px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-[#2B3A67]/20 active:scale-95 transition-all"
              >
                إنجاز المهمة والعودة
              </button>
              <button 
                onClick={() => setIsExiting(true)}
                className="text-[10px] font-bold text-slate-300 uppercase tracking-widest hover:text-slate-500 transition-colors"
              >
                إنهاء الجلسة مبكراً
              </button>
            </div>
          ) : (
            <div className="bg-white p-10 rounded-[45px] shadow-2xl border border-slate-50 animate-in slide-in-from-bottom duration-500 space-y-6">
              <p className="text-xs font-bold text-slate-400">أدخل الرمز لفك التركيز:</p>
              <div className="text-4xl font-black tracking-[0.4em] text-[#E63946] mb-4">{targetCode}</div>
              <input 
                autoFocus
                maxLength={4}
                value={exitCode}
                onChange={e => setExitCode(e.target.value)}
                className="w-full text-center text-3xl font-black bg-slate-50 border-none rounded-2xl py-4 focus:ring-0"
              />
              <div className="flex gap-4">
                <button onClick={() => setIsExiting(false)} className="flex-1 py-4 text-[10px] font-black text-slate-300 uppercase">عودة</button>
                <button onClick={handleExitConfirm} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase">فك القفل</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes zen-breath {
          0%, 100% { transform: scale(1); opacity: 0.03; }
          50% { transform: scale(1.5); opacity: 0.1; }
        }
        .animate-zen-breath {
          animation: zen-breath 8s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};
