
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Icons } from '../constants';
import { Idea } from '../types';

const BrainDumpScreen: React.FC = () => {
  const { ideas, addIdea, deleteIdea, convertIdeaToTask } = useApp();
  const [inputValue, setInputValue] = useState('');
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    addIdea(inputValue.trim());
    setInputValue('');
  };

  const startVoiceCapture = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
    };
    recognition.onerror = () => setIsListening(false);

    recognition.start();
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [ideas]);

  const handleProcess = async (action: 'convert' | 'ai' | 'delete') => {
    if (!selectedIdea) return;
    
    if (action === 'delete') {
      deleteIdea(selectedIdea.id);
      showToast("Idea discarded.");
      setSelectedIdea(null);
      return;
    }

    setIsProcessing(true);
    try {
      if (action === 'ai') {
        await convertIdeaToTask(selectedIdea.id, true);
        showToast("AI Refined & Synchronized! ✨");
      } else {
        await convertIdeaToTask(selectedIdea.id, false);
        showToast("Fast-Converted to Task! 🚀");
      }
      setSelectedIdea(null);
    } catch (e) {
      showToast("Processing failed. Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      {/* BACKGROUND CLOUD DECORATION WITH ANIMATION */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center overflow-hidden">
         <div className="animate-bounce-slow">
           <svg className="w-[120%] h-auto text-zinc-900" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.5,19c-3.037,0-5.5-2.463-5.5-5.5c0-0.101,0.003-0.201,0.009-0.3c-1.144,0.485-2.394,0.762-3.709,0.783 C7.14,14.008,6.046,14.155,5,14.444C2.179,15.257,0,17.876,0,21c0,1.657,1.343,3,3,3h18c1.657,0,3-1.343,3-3 C24,17.134,21.09,14,17.5,14c-0.369,0-0.724,0.032-1.071,0.091C16.891,15.111,17.5,16.485,17.5,18L17.5,19z M12.5,1c-2.485,0-4.5,2.015-4.5,4.5c0,0.518,0.087,1.014,0.246,1.478C7.145,7.114,6.082,7.317,5,7.581 C2.179,8.324,0,10.865,0,13.889C0,15.546,1.343,16.889,3,16.889h18c1.657,0,3-1.343,3-3c0-3.313-2.687-6-6-6 c-0.569,0-1.111,0.082-1.624,0.232C15.719,3.153,14.285,1,12.5,1z"/>
           </svg>
         </div>
      </div>

      <header className="pt-8 px-6 pb-4 relative z-10">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Brain Dump</h1>
        <p className="text-zinc-500 mt-1 font-medium italic opacity-70">Capture everything, worry later.</p>
      </header>

      {/* IDEA LIST */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-4 pt-4 pb-24 relative z-10"
      >
        {ideas.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-4">
             <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center">
                <Icons.Inbox />
             </div>
             <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Your mind is clear.</p>
          </div>
        ) : (
          ideas.map((idea, index) => (
            <div 
              key={idea.id}
              onClick={() => setSelectedIdea(idea)}
              className="animate-bubble-in"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="bg-white/80 backdrop-blur-sm border border-zinc-100 hover:border-zinc-300 p-6 rounded-[28px] rounded-bl-none shadow-sm transition-all cursor-pointer group active:scale-[0.98]">
                 <p className="text-sm font-bold text-zinc-800 leading-relaxed">
                   {idea.text}
                 </p>
                 <div className="mt-4 flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                    <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">
                       {new Date(idea.capturedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-[8px] font-black text-zinc-900 uppercase tracking-widest">Tap to refine</span>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CHAT-STYLE INPUT FOOTER */}
      <div className="p-6 bg-white border-t border-zinc-50 fixed bottom-0 left-0 right-0 z-40 md:relative md:border-none">
         <form 
          onSubmit={handleAdd}
          className="bg-zinc-100 rounded-[28px] flex items-center px-4 py-2 shadow-inner focus-within:bg-white focus-within:ring-2 focus-within:ring-zinc-900/5 transition-all"
         >
            <button 
              type="button"
              onClick={startVoiceCapture}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isListening ? 'bg-red-500 text-white animate-pulse' : 'text-zinc-400 hover:text-zinc-900'
              }`}
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
            </button>

            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isListening ? "Listening..." : "Dump a thought..."}
              className="flex-1 bg-transparent border-none outline-none font-bold text-zinc-900 placeholder:text-zinc-400 py-3 px-4"
            />
            
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className="w-10 h-10 bg-zinc-900 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-20 ml-2"
            >
               <Icons.Plus />
            </button>
         </form>
      </div>

      {/* PROCESS IDEA MODAL */}
      {selectedIdea && (
        <div className="fixed inset-0 bg-[#2B3A67]/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-sm rounded-[48px] p-10 animate-in zoom-in-95 duration-300 shadow-2xl relative overflow-hidden">
              {isProcessing && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
                   <div className="w-10 h-10 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">AI is Refinement...</p>
                </div>
              )}

              <header className="mb-8">
                 <h2 className="text-2xl font-black text-[#2B3A67] tracking-tight">Process Idea</h2>
                 <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mt-2">Raw Mental Data</p>
                 <div className="mt-4 bg-zinc-50 p-6 rounded-[24px] border border-zinc-100 italic text-zinc-700 font-bold text-sm leading-relaxed">
                    "{selectedIdea.text}"
                 </div>
              </header>

              <div className="space-y-3">
                 <button 
                  onClick={() => handleProcess('ai')}
                  className="w-full bg-[#2B3A67] text-white font-black py-5 rounded-[20px] shadow-xl active:scale-[0.98] transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 group"
                 >
                   <span className="group-hover:rotate-12 transition-transform"><Icons.AI /></span>
                   AI Refine & Sync
                 </button>
                 <button 
                  onClick={() => handleProcess('convert')}
                  className="w-full bg-white border-2 border-zinc-100 text-[#2B3A67] font-black py-5 rounded-[20px] active:scale-[0.98] transition-all text-[10px] uppercase tracking-widest"
                 >
                   Fast Local Convert
                 </button>
                 <button 
                  onClick={() => handleProcess('delete')}
                  className="w-full bg-rose-50 text-rose-500 font-black py-4 rounded-[20px] active:scale-[0.98] transition-all text-[9px] uppercase tracking-widest"
                 >
                   Discard Thought
                 </button>
                 <button 
                  onClick={() => setSelectedIdea(null)}
                  className="w-full py-4 text-zinc-300 font-bold uppercase tracking-widest text-[9px] hover:text-zinc-500 transition-colors"
                 >
                   Leave for later
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl animate-in slide-in-from-bottom-6 z-[60]">
          {toast}
        </div>
      )}

      <style>{`
        @keyframes bubble-in {
          0% { opacity: 0; transform: translateY(20px) scale(0.9); }
          60% { transform: translateY(-5px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-bubble-in {
          animation: bubble-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          opacity: 0;
        }
        .animate-bounce-slow {
          animation: bounce-slow 10s infinite ease-in-out;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) scale(1.1) rotate(0deg); }
          50% { transform: translateY(-20px) scale(1.2) rotate(3deg); }
        }
      `}</style>
    </div>
  );
};

export default BrainDumpScreen;
