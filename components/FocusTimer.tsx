
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../AppContext';
import { FocusSession } from '../types';

interface FocusTimerProps {
  taskId?: string;
  initialMinutes?: number;
  onComplete?: (session: FocusSession) => void;
  onClose: () => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ taskId, initialMinutes = 25, onComplete, onClose }) => {
  const { addFocusSession, t } = useApp();
  const [seconds, setSeconds] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const totalSeconds = initialMinutes * 60;
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isActive && seconds > 0) {
      timerRef.current = setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      handleComplete();
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, seconds]);

  const handleComplete = () => {
    const session: FocusSession = {
      id: Math.random().toString(36).substr(2, 9),
      taskId,
      startTime: new Date().toISOString(),
      durationMinutes: initialMinutes,
      actualSeconds: totalSeconds - seconds,
      completed: seconds === 0
    };
    addFocusSession(session);
    if (onComplete) onComplete(session);
    setIsActive(false);
  };

  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;

  return (
    <div className="fixed inset-0 z-[1001] bg-[#1E1E1E]/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* Progress Circle */}
        <svg className="absolute inset-0 -rotate-90" width="100%" height="100%" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#252525" strokeWidth="2" />
          <circle 
            cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="2"
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * progress) / 100}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        
        <div className="text-center space-y-2">
          <div className="text-6xl font-thin text-white tracking-tighter">
            {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
          </div>
          <p className="system-caption text-[8px] text-[#717171] uppercase tracking-[0.4em]">
            {isActive ? 'قيد التركيز' : 'جاهز؟'}
          </p>
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center gap-6 w-full max-w-xs">
        <button 
          onClick={() => setIsActive(!isActive)}
          className={`w-full py-5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${isActive ? 'bg-[#333333] text-white' : 'bg-white text-black shadow-xl shadow-white/10'}`}
        >
          {isActive ? 'إيقاف مؤقت' : 'بدء الجلسة'}
        </button>
        <button 
          onClick={onClose}
          className="text-[8px] font-black text-[#717171] uppercase tracking-widest hover:text-white"
        >
          إلغاء
        </button>
      </div>
    </div>
  );
};
