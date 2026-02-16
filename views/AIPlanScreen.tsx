
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Icons } from '../constants';
import { Category, Priority, Task } from '../types';
import { GoogleGenAI } from "@google/genai";

const AIPlanScreen: React.FC = () => {
  const { addTask, tasks, t } = useApp();
  const [step, setStep] = useState<'form' | 'loading' | 'result'>('form');
  const [problem, setProblem] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [plan, setPlan] = useState<string>('');

  const generateDeepPlan = async () => {
    if (!problem.trim()) return;
    setStep('loading');
    setIsThinking(true);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `أنا طالب أواجه المشكلة التالية: "${problem}". 
        بناءً على علم النفس المعرفي، حلل الموقف وقدم لي خطة عمل مجهرية (Micro-action plan) تتكون من 3 خطوات فورية. 
        اجعل الأسلوب محفزاً وعملياً جداً.`,
        config: {
          thinkingConfig: { thinkingBudget: 32768 }
        }
      });

      setPlan(response.text || "لم نتمكن من تحليل الموقف حالياً.");
      setStep('result');
    } catch (e) {
      console.error(e);
      setStep('form');
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-6 pt-24 pb-32">
      <header className="mb-12">
        <h1 className="text-3xl font-black text-[#2B3A67] tracking-tight">التفكير العميق</h1>
        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[8px] mt-2">Gemini 3 Pro Intelligence</p>
      </header>

      {step === 'form' && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <section className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">ما الذي يعيق تقدمك؟</label>
            <textarea 
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="مثلاً: أشعر بالتشتت عند البدء في مادة الرياضيات، وأحتاج لخطة لإنهاء 50 صفحة اليوم..."
              className="w-full bg-white border border-slate-100 rounded-[32px] p-8 text-lg font-medium text-[#2B3A67] placeholder:text-slate-200 outline-none focus:ring-4 ring-[#2B3A67]/5 h-64 resize-none transition-all"
            />
          </section>

          <button 
            onClick={generateDeepPlan}
            className="w-full bg-[#2B3A67] text-white font-black py-7 rounded-[32px] shadow-2xl shadow-[#2B3A67]/20 active:scale-95 transition-all text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4"
          >
            <Icons.AI />
            بدء التحليل الإستراتيجي
          </button>
        </div>
      )}

      {step === 'loading' && (
        <div className="flex flex-col items-center justify-center py-32 space-y-10 animate-in fade-in duration-1000">
          <div className="relative">
            <div className="w-24 h-24 border-[4px] border-[#2B3A67]/10 border-t-[#2B3A67] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-[#2B3A67]">
               <Icons.AI />
            </div>
          </div>
          <div className="text-center space-y-3">
             <p className="text-[#2B3A67] font-black text-xl tracking-tight">الذكاء الاصطناعي يحلل أنماطك...</p>
             <p className="text-[9px] text-slate-400 uppercase tracking-[0.4em]">Gemini Pro is Thinking (32k Budget)</p>
          </div>
        </div>
      )}

      {step === 'result' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
           <div className="bg-white border border-slate-100 p-10 rounded-[48px] shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5"><Icons.AI /></div>
              <div className="prose prose-slate max-w-none">
                 <p className="text-[#2B3A67] leading-relaxed text-lg font-medium whitespace-pre-wrap">
                   {plan}
                 </p>
              </div>
           </div>
           
           <button 
            onClick={() => setStep('form')}
            className="w-full py-5 text-slate-400 font-black uppercase tracking-widest text-[10px] border-2 border-dashed border-slate-200 rounded-[32px]"
           >
             تعديل المدخلات
           </button>
        </div>
      )}
    </div>
  );
};

export default AIPlanScreen;
