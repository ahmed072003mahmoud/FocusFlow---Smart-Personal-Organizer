
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Icons } from '../constants';
import { GoogleGenAI } from "@google/genai";

const ContentScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      // REQUIREMENT: Use gemini-3-flash-preview for web search
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `أنا طالب أبحث عن معلومات موثقة حول: "${query}". قدم ملخصاً أكاديمياً دقيقاً.`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const text = response.text || "";
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      setResults({ text, sources });
    } catch (e) {
      setResults({ text: "تعذر الوصول للبيانات الحية. تأكد من اتصالك.", sources: [] });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="p-8 pt-24 space-y-12 pb-40">
      <header>
        <h1 className="heading-title text-4xl text-white">مختبر المعرفة</h1>
        <p className="text-zinc-600 mt-2 font-medium italic">بيانات Google الحية بين يديك.</p>
      </header>

      <div className="space-y-6">
        <div className="relative">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="ابحث عن مادة، تقنية دراسية، أو حدث..."
            className="w-full bg-zinc-950 border border-white/5 rounded-full px-10 py-6 text-white font-bold outline-none focus:border-white/20 transition-all"
          />
          <button onClick={handleSearch} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-zinc-500 hover:text-white">
            {isSearching ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Icons.AI />}
          </button>
        </div>

        {results && (
          <div className="bg-zinc-900 border border-white/5 p-10 rounded-[50px] space-y-8 animate-in zoom-in duration-500">
            <p className="text-zinc-300 leading-relaxed font-bold whitespace-pre-wrap">{results.text}</p>
            
            {results.sources.length > 0 && (
              <div className="pt-8 border-t border-white/5">
                <p className="system-caption text-zinc-600 mb-4">المصادر الموثقة</p>
                <div className="flex flex-wrap gap-3">
                  {results.sources.map((s: any, i: number) => s.web && (
                    <a key={i} href={s.web.uri} target="_blank" rel="noreferrer" className="text-[10px] font-black text-zinc-500 hover:text-white transition-colors bg-zinc-950 px-4 py-2 rounded-full border border-white/5">
                      {s.web.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentScreen;
