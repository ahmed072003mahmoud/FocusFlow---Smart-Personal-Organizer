
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Icons } from '../constants';
import { GoogleGenAI } from "@google/genai";

const ContentScreen: React.FC = () => {
  const { t } = useApp();
  const [isSearching, setIsSearching] = useState(false);
  const [tips, setTips] = useState<any[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const fetchLiveTips = async () => {
    setIsSearching(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "أعطني أهم 3 تقنيات دراسية أثبتت فعاليتها في عام 2024 بناءً على أحدث الأبحاث العلمية. اذكر المصادر.",
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const text = response.text || "";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = chunks.filter((c: any) => c.web).map((c: any) => ({
        uri: c.web.uri,
        title: c.web.title
      }));

      const newTip = {
        id: Date.now(),
        content: text,
        sources: sources
      };

      setTips([newTip, ...tips]);
      setToast("تم تحديث المعلومات من الويب بنجاح ✨");
    } catch (e) {
      console.error(e);
      setToast("فشل البحث المباشر، يرجى المحاولة لاحقاً.");
    } finally {
      setIsSearching(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="p-8 space-y-12 pb-32">
      <header className="pt-16">
        <h1 className="text-4xl font-black text-zinc-900 tracking-tight">مختبر المعرفة</h1>
        <p className="text-zinc-500 mt-2 font-medium">بيانات حية، دراسة أذكى.</p>
      </header>

      <button 
        onClick={fetchLiveTips}
        disabled={isSearching}
        className={`w-full py-6 rounded-[32px] border-2 border-dashed flex items-center justify-center gap-4 transition-all ${isSearching ? 'bg-zinc-50 border-zinc-200' : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:border-indigo-400'}`}
      >
        {isSearching ? <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /> : <Icons.AI />}
        <span className="text-xs font-black uppercase tracking-widest">{isSearching ? "جاري البحث..." : "تحديث المعلومات من الويب"}</span>
      </button>

      <div className="space-y-8">
        {tips.map((tip) => (
          <div key={tip.id} className="bg-white border border-zinc-100 p-10 rounded-[48px] shadow-sm animate-in slide-in-from-bottom duration-500">
            <div className="prose prose-slate max-w-none">
              <p className="text-zinc-700 leading-relaxed font-medium whitespace-pre-wrap">{tip.content}</p>
            </div>
            
            {tip.sources && tip.sources.length > 0 && (
              <div className="mt-8 pt-8 border-t border-zinc-50 space-y-3">
                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">المصادر المستخدمة</p>
                {tip.sources.map((s: any, i: number) => (
                  <a key={i} href={s.uri} target="_blank" className="block text-xs font-bold text-indigo-500 hover:underline truncate">
                    {s.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {toast && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl z-[100] animate-in slide-in-from-bottom-6">
          {toast}
        </div>
      )}
    </div>
  );
};

export default ContentScreen;
