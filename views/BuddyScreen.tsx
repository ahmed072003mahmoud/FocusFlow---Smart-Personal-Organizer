
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Icons } from '../constants';
import { useNavigate } from 'react-router-dom';

const BuddyScreen: React.FC = () => {
  const { tasks, t } = useApp();
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const myCompletions = tasks.filter(t => t.isCompleted).length;
  const myTotal = tasks.length;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleNudge = () => {
    showToast("You nudged Omar! He'll get a notification. 👋");
  };

  const handleSendReport = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setShowSuccess(true);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-8 pb-32 min-h-full bg-white">
      <header className="pt-8 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 text-zinc-400">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Partner Center</h1>
          <p className="text-zinc-500 mt-1 font-medium">Synced with Omar 👨‍💻</p>
        </div>
      </header>

      {/* PARTNER PROGRESS CARD */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-zinc-900 rounded-[40px] p-8 text-white space-y-8 shadow-2xl shadow-zinc-900/40 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Icons.People />
           </div>

           <header>
              <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Partner's Day</h2>
              <h3 className="text-2xl font-black tracking-tight">Omar is crushing it.</h3>
           </header>

           <div className="space-y-4">
              <div className="flex justify-between items-end">
                 <span className="text-sm font-bold">85% Completed</span>
                 <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Focus Mode 🌙</span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: '85%' }} />
              </div>
           </div>

           <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3">
              <div className="text-orange-500"><Icons.Flame /></div>
              <p className="text-xs font-medium">Top Habit: <span className="font-black">Early Rising</span> (12d Streak)</p>
           </div>

           <button 
            onClick={handleNudge}
            className="w-full bg-white text-zinc-900 font-black py-4 rounded-[20px] shadow-lg active:scale-95 transition-all text-xs uppercase tracking-widest"
           >
             👋 Nudge Omar
           </button>
        </div>
      </section>

      {/* MY STATS & SHARING */}
      <section className="space-y-6 pt-4">
         <h2 className="text-xl font-black text-zinc-900 tracking-tight">Share My Progress</h2>
         
         <div className="bg-zinc-50 border border-zinc-100 p-6 rounded-[32px] space-y-6">
            <div className="flex items-center justify-between">
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">My Productivity</p>
                  <p className="text-lg font-black mt-1">{myCompletions} / {myTotal} Tasks Done</p>
               </div>
               <div className="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center">
                  <Icons.Check />
               </div>
            </div>

            <button 
              onClick={handleSendReport}
              className="w-full bg-zinc-900 text-white font-black py-5 rounded-[24px] shadow-xl active:scale-[0.98] transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-3"
            >
              🚀 Send Daily Report
            </button>
         </div>
      </section>

      <div className="text-center py-8">
        <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest leading-relaxed">
           FocusFlow Buddies are private. <br/>
           No chat, just pure accountability.
        </p>
      </div>

      {/* SENDING LOADER */}
      {isSending && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center">
           <div className="bg-white p-10 rounded-[48px] flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300">
              <div className="w-12 h-12 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin" />
              <p className="text-sm font-black uppercase tracking-widest text-zinc-500">Syncing Data...</p>
           </div>
        </div>
      )}

      {/* SUCCESS DIALOG */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-sm rounded-[48px] p-8 animate-in zoom-in-95 duration-300 shadow-2xl text-center">
              <div className="w-20 h-20 bg-zinc-900 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                 <Icons.Check />
              </div>
              <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Report Sent!</h2>
              <p className="text-zinc-500 text-sm mt-2 font-medium leading-relaxed">
                 Success! Omar can now see that you completed {myCompletions} units of work today. Keep the fire burning! 🔥
              </p>
              <button 
                onClick={() => setShowSuccess(false)}
                className="w-full bg-zinc-900 text-white font-black py-5 rounded-[24px] mt-8 active:scale-95 transition-all text-xs uppercase tracking-widest"
              >
                 Great!
              </button>
           </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-zinc-900 text-white px-6 py-4 rounded-[24px] shadow-2xl animate-in slide-in-from-bottom-6 z-[250] flex items-center justify-between">
          <span className="text-xs font-bold tracking-wide">{toast}</span>
          <Icons.People />
        </div>
      )}
    </div>
  );
};

export default BuddyScreen;
