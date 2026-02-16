
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Icons } from '../constants';
import { Idea } from '../types';

const BrainDumpScreen: React.FC = () => {
  const { ideas, addIdea, deleteIdea, convertIdeaToTask, t } = useApp();
  const [inputValue, setInputValue] = useState('');
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMode, setProcessingMode] = useState<'flash' | 'pro' | null>(null);
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

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [ideas]);

  const handleProcess = async (mode: 'local' | 'flash' | 'pro' | 'delete') => {
    if (!selectedIdea) return;
    
    if (mode === 'delete') {
      deleteIdea(selectedIdea.id);
      showToast("Thought discarded.");
      setSelectedIdea(null);
      return;
    }

    setProcessingMode(mode === 'pro' ? 'pro' : 'flash');
    setIsProcessing(true);
    try {
      await convertIdeaToTask(selectedIdea.id, mode as any);
      showToast(mode === 'pro' ? "Deep Analysis Complete! ✨" : "Quick Sync Successful! 🚀");
      setSelectedIdea(null);
    } catch (e) {
      showToast("AI reasoning failed. Check connection.");
    } finally {
      setIsProcessing(false);
      setProcessingMode(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] relative overflow-hidden">
      <header className="pt-12 px-6 pb-6 bg-white shadow-sm relative z-10 border-b border-slate-50">
        <div className="flex justify-between items-center max-w-4xl mx-auto w-full">
           <div>
              <h1 className="text-3xl font-black text-[#2B3A67] tracking-tight">{t('inboxTitle')}</h1>
              <p className="text-slate-500 mt-1 font-medium italic opacity-70">Capture & Refine</p>
           </div>
           <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-[#2B3A67] shadow-inner">
              <Icons.Inbox />
           </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-4 pt-6 pb-32 relative z-10 max-w-4xl mx-auto w-full">
        {ideas.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-40 text-center space-y-6 animate-in fade-in duration-1000">
             <div className="w-24 h-24 bg-white rounded-[40px] shadow-sm flex items-center justify-center text-slate-300">
                <Icons.Inbox />
             </div>
             <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">{t('mindClear')}</p>
                <p className="text-[10px] font-bold text-slate-300 mt-2">Dump your thoughts below</p>
             </div>
          </div>
        ) : (
          ideas.map((idea) => (
            <div 
              key={idea.id} 
              onClick={() => setSelectedIdea(idea)} 
              className="bg-white border border-slate-50 p-6 rounded-[32px] rounded-bl-none shadow-sm cursor-pointer group active:scale-[0.98] transition-all max-w-[85%] animate-in slide-in-from-left duration-300 hover:shadow-md"
            >
               <p className="text-sm font-bold text-slate-800 leading-relaxed">{idea.text}</p>
               <div className="mt-4 flex justify-between items-center">
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{new Date(idea.capturedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <div className="flex items-center gap-2">
                     <span className="text-[8px] font-black text-[#2B3A67] uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">Tap to Organize</span>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>

      <div className="p-6 bg-white border-t border-slate-50 fixed bottom-0 left-0 right-0 z-40 md:left-auto md:w-[calc(100%-288px)] flex justify-center">
         <form onSubmit={handleAdd} className="bg-slate-100 rounded-[32px] flex items-center px-6 py-2 border border-slate-100 focus-within:border-[#2B3A67]/20 transition-all max-w-4xl w-full shadow-inner">
            <input 
              type="text" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              placeholder={t('dumpThought')} 
              className="flex-1 bg-transparent border-none outline-none font-bold text-slate-900 placeholder:text-slate-400 py-4" 
            />
            <button 
              type="submit" 
              disabled={!inputValue.trim()} 
              className="w-12 h-12 bg-[#2B3A67] text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-20 ml-2"
            >
               <Icons.Plus />
            </button>
         </form>
      </div>

      {selectedIdea && (
        <div className="fixed inset-0 bg-[#2B3A67]/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-sm rounded-[48px] p-10 animate-in zoom-in-95 duration-300 shadow-2xl relative overflow-hidden">
              {isProcessing && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-6">
                   <div className="relative">
                      <div className={`w-14 h-14 border-4 border-slate-100 border-t-[#E63946] rounded-full animate-spin`} />
                      <div className="absolute inset-0 flex items-center justify-center text-[#2B3A67]">
                         <Icons.AI />
                      </div>
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 animate-pulse">{processingMode === 'pro' ? "GEMINI PRO REASONING..." : "QUICK PARSING..."}</p>
                </div>
              )}

              <header className="mb-8">
                 <h2 className="text-2xl font-black text-[#2B3A67] tracking-tight mb-4">Process Thought</h2>
                 <div className="bg-slate-50 p-6 rounded-[28px] border border-slate-100 italic text-slate-700 font-bold text-sm leading-relaxed max-h-40 overflow-y-auto no-scrollbar shadow-inner">"{selectedIdea.text}"</div>
              </header>

              <div className="space-y-3">
                 <button onClick={() => handleProcess('pro')} className="w-full bg-[#2B3A67] text-white font-black py-5 rounded-[24px] shadow-xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-transform hover:bg-[#1E2A4A]">
                   <Icons.AI />
                   Deep Strategy (Gemini Pro Thinking)
                 </button>
                 <button onClick={() => handleProcess('flash')} className="w-full bg-white border-2 border-slate-100 text-[#2B3A67] font-black py-5 rounded-[24px] text-[10px] uppercase tracking-widest active:scale-95 transition-transform shadow-sm">
                   Quick Sync (Gemini Flash)
                 </button>
                 <button onClick={() => handleProcess('local')} className="w-full bg-slate-50 text-slate-500 font-black py-4 rounded-[24px] text-[9px] uppercase tracking-widest active:scale-95 transition-transform">
                   {t('localConvert')}
                 </button>
                 <div className="h-px bg-slate-100 my-4" />
                 <div className="flex gap-3">
                    <button onClick={() => handleProcess('delete')} className="flex-1 bg-rose-50 text-rose-500 font-black py-4 rounded-[20px] text-[9px] uppercase tracking-widest active:scale-95 transition-transform">
                      {t('discard')}
                    </button>
                    <button onClick={() => setSelectedIdea(null)} className="flex-1 py-4 text-slate-300 font-black uppercase tracking-widest text-[9px]">
                      {t('cancel')}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-[#2B3A67] text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl z-[60] animate-in slide-in-from-bottom-6">
          {toast}
        </div>
      )}
    </div>
  );
};

export default BrainDumpScreen;
