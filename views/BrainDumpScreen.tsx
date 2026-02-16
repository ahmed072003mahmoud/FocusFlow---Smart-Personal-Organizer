
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Icons } from '../constants';
import { Idea } from '../types';

const BrainDumpScreen: React.FC = () => {
  const { ideas, addIdea, deleteIdea, convertIdeaToTask, t } = useApp();
  const [inputValue, setInputValue] = useState('');
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      setSelectedIdea(null);
      return;
    }

    setIsProcessing(true);
    try {
      await convertIdeaToTask(selectedIdea.id, mode as any);
      setSelectedIdea(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#FDFDFE]">
      <header className="pt-16 px-8 pb-6 border-b border-slate-50 bg-white/50 backdrop-blur-md sticky top-0 z-20">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('inboxTitle')}</h1>
        <p className="text-slate-400 text-sm mt-1">{t('inboxSubtitle')}</p>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-8 space-y-6 no-scrollbar pb-40">
        {ideas.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
            <div className="w-20 h-20 bg-slate-100 rounded-[40px] flex items-center justify-center text-4xl">💭</div>
            <p className="text-xs font-black uppercase tracking-[0.4em]">{t('mindClear')}</p>
          </div>
        ) : (
          ideas.map((idea) => (
            <div 
              key={idea.id} 
              onClick={() => setSelectedIdea(idea)} 
              className="bg-white border border-slate-100 p-6 rounded-[32px] rounded-br-none shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all animate-in slide-in-from-right duration-300"
            >
              <p className="text-slate-800 font-medium leading-relaxed">{idea.text}</p>
              <div className="mt-4 flex justify-between items-center text-[8px] font-black text-slate-300 uppercase tracking-widest">
                <span>{new Date(idea.capturedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="text-[#2B3A67] opacity-0 group-hover:opacity-100 transition-opacity">تجهيز المهمة ←</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Persistent Input Bar */}
      <div className="fixed bottom-10 left-0 right-0 px-8 z-30">
        <form onSubmit={handleAdd} className="max-w-2xl mx-auto relative group">
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('dumpThought')}
            className="w-full bg-slate-900 text-white rounded-[35px] px-10 py-6 pr-10 pl-20 font-bold focus:outline-none focus:ring-4 ring-slate-900/10 transition-all shadow-2xl"
          />
          <button 
            type="submit"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-lg active:scale-90 transition-all"
          >
            <Icons.Plus />
          </button>
        </form>
      </div>

      {/* Idea Processing Modal */}
      {selectedIdea && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-[100] flex items-end justify-center">
          <div className="bg-white w-full max-w-xl rounded-t-[50px] p-10 animate-in slide-in-from-bottom duration-500 shadow-2xl">
            {isProcessing && (
              <div className="absolute inset-0 bg-white/80 z-50 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-[#2B3A67] rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">معالجة بالذكاء الاصطناعي...</p>
              </div>
            )}
            
            <header className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 mb-2">{t('processIdea')}</h2>
              <div className="p-6 bg-slate-50 rounded-[30px] italic text-slate-600 font-bold border border-slate-100">
                "{selectedIdea.text}"
              </div>
            </header>

            <div className="grid grid-cols-1 gap-3">
              <button onClick={() => handleProcess('pro')} className="w-full bg-[#2B3A67] text-white py-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                <Icons.AI />
                {t('aiRefine')} (Gemini Pro)
              </button>
              <button onClick={() => handleProcess('local')} className="w-full bg-slate-100 text-slate-600 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-widest">
                {t('localConvert')}
              </button>
              <div className="flex gap-3 mt-4">
                <button onClick={() => handleProcess('delete')} className="flex-1 bg-rose-50 text-rose-500 py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest">
                  {t('discard')}
                </button>
                <button onClick={() => setSelectedIdea(null)} className="flex-1 text-slate-400 font-black text-[9px] uppercase tracking-widest">
                  {t('cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrainDumpScreen;
