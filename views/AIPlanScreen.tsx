
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Icons } from '../constants';
import { AIOrchestrationLayer } from '../utils/AIOrchestrationLayer';

const AIPlanScreen: React.FC = () => {
  const { isFeatureUnlocked, logBehavior } = useApp();
  const [problem, setProblem] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleDeepThought = async () => {
    if (!problem.trim()) return;
    setIsThinking(true);
    logBehavior('use_ai', { type: 'deep_strategic_pivot' });
    
    try {
      const plan = await AIOrchestrationLayer.deepThinkStrategicPivot(problem);
      setResult(plan);
    } catch (e) {
      setResult("تعذر الوصول لعمق التفكير حالياً. حاول صياغة العائق بشكل أوضح.");
    } finally {
      setIsThinking(false);
    }
  };

  if (!isFeatureUnlocked('ai_lab')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-12 text-center opacity-20">
        <Icons.AI />
        <h2 className="heading-title text-xl text-white mt-8">المختبر قيد المزامنة</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 pt-24 bg-[#000] pb-40">
      <header className="mb-12">
        <h1 className="heading-title text-4xl text-white">العقل الإستراتيجي</h1>
        <p className="text-zinc-600 font-medium mt-2 italic">حلل المعضلات بـ 32K من ميزانية التفكير.</p>
      </header>

      <div className="space-y-10">
        <div className="relative">
          <textarea 
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="ما هي المعضلة الدراسية التي تستنزف طاقتك؟"
            className="w-full bg-zinc-950 border border-white/5 rounded-[40px] p-8 text-lg font-bold text-white shadow-inner focus:border-white/10 outline-none h-64 resize-none transition-all placeholder:text-zinc-900"
          />
          {isThinking && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl rounded-[40px] flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
              <span className="system-caption text-white animate-pulse">جاري التفكير العميق...</span>
            </div>
          )}
        </div>

        {!result && (
          <button 
            onClick={handleDeepThought}
            disabled={isThinking || !problem.trim()}
            className="w-full bg-white text-black font-black py-6 rounded-full shadow-2xl disabled:opacity-10 active:scale-95 transition-all text-[10px] uppercase tracking-widest"
          >
            تفعيل التحليل العميق
          </button>
        )}

        {result && (
          <div className="bg-zinc-900/50 border border-white/5 p-10 rounded-[50px] animate-in slide-in-from-bottom-8 duration-700">
             <h3 className="system-caption text-zinc-500 mb-8">خارطة الطريق الإستراتيجية</h3>
             <p className="text-zinc-300 leading-relaxed font-bold whitespace-pre-wrap">{result}</p>
             <button onClick={() => setResult(null)} className="mt-10 text-[8px] font-black text-zinc-700 uppercase tracking-widest">تفكير جديد</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPlanScreen;
