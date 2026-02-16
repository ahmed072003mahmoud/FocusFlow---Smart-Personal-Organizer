
import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { Icons } from '../constants';
import { GoogleGenAI } from "@google/genai";

type TabType = 'All' | 'Study' | 'Faith/Habits';

interface Source {
  uri: string;
  title: string;
}

interface Tip {
  id: string;
  category: 'Study' | 'Faith' | 'Habits' | 'AI';
  title: string;
  shortDesc: string;
  fullContent: string;
  icon: React.ReactNode;
  isAI?: boolean;
  sources?: Source[];
}

const MOCK_TIPS: Tip[] = [
  {
    id: '1',
    category: 'Study',
    title: 'Pomodoro Technique',
    shortDesc: 'Work 25min, Rest 5min.',
    fullContent: 'The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. It uses a kitchen timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. Each interval is known as a pomodoro.',
    icon: <Icons.Tasks />
  },
  {
    id: '2',
    category: 'Faith',
    title: 'Morning Athkar Benefits',
    shortDesc: 'Start your day with spiritual protection and focus.',
    fullContent: 'Reciting the morning Athkar (remembrances) provides a spiritual shield and grounds your mind before the day\'s stresses begin. It fosters mindfulness and connects your daily tasks to a higher purpose.',
    icon: <Icons.AI />
  },
  {
    id: '3',
    category: 'Habits',
    title: 'Hydration & Focus',
    shortDesc: 'Why water is important for cognitive performance.',
    fullContent: 'Even mild dehydration can impair concentration, memory, and energy levels. Aim to drink a glass of water every 90 minutes to keep your brain firing at optimal speeds.',
    icon: <Icons.Flame />
  }
];

const ContentScreen: React.FC = () => {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [aiTips, setAiTips] = useState<Tip[]>([]);

  const filteredTips = useMemo(() => {
    const combined = [...MOCK_TIPS, ...aiTips];
    if (activeTab === 'All') return combined;
    if (activeTab === 'Study') return combined.filter(t => t.category === 'Study' || t.category === 'AI');
    return combined.filter(t => t.category === 'Faith' || t.category === 'Habits');
  }, [activeTab, aiTips]);

  const handleGetLiveTip = async () => {
    setIsSearching(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Give me one high-quality, up-to-date study tip based on recent research or trending productivity methods. Format the response clearly. Make it insightful for a university student.",
        config: {
          tools: [{ googleSearch: {} }]
        }
      });
      
      const text = response.text || "";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources: Source[] = chunks
        .filter((c: any) => c.web)
        .map((c: any) => ({
          uri: c.web.uri,
          title: c.web.title
        }));

      const lines = text.split('\n').filter(l => l.trim());
      const newTip: Tip = {
        id: Math.random().toString(),
        category: 'AI',
        title: lines[0]?.replace(/^#*\s*/, '') || "Live AI Insight",
        shortDesc: lines[1] || "Fetched from recent research.",
        fullContent: text,
        icon: <Icons.AI />,
        isAI: true,
        sources: sources.length > 0 ? sources : undefined
      };
      setAiTips(prev => [newTip, ...prev]);
      setToast("New tip discovered via AI! ✨");
    } catch (e) {
      console.error(e);
      setToast("Failed to fetch live data.");
    } finally {
      setIsSearching(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="p-6 space-y-6 relative min-h-full pb-32">
      <header className="pt-8">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">{t('tips')}</h1>
        <p className="text-zinc-500 mt-1 font-medium">Verified methods for mastery.</p>
      </header>

      <div className="flex gap-2 bg-zinc-100 p-1.5 rounded-2xl sticky top-2 z-10">
        {(['All', 'Study', 'Faith/Habits'] as TabType[]).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400'}`}>
            {tab}
          </button>
        ))}
      </div>

      <button 
        onClick={handleGetLiveTip}
        disabled={isSearching}
        className={`w-full py-5 rounded-[28px] border-2 border-dashed flex items-center justify-center gap-3 transition-all ${isSearching ? 'bg-slate-50 border-slate-200' : 'bg-indigo-50 border-indigo-200 hover:border-indigo-400 text-indigo-700'}`}
      >
        {isSearching ? <div className="w-5 h-5 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /> : <Icons.AI />}
        <span className="text-xs font-black uppercase tracking-widest">{isSearching ? t('aiSearching') : t('getLiveTip')}</span>
      </button>

      <div className="grid gap-4">
        {filteredTips.map((tip) => (
          <div key={tip.id} onClick={() => setSelectedTip(tip)} className={`p-6 rounded-[32px] border transition-all cursor-pointer ${tip.isAI ? 'bg-indigo-50/30 border-indigo-100' : 'bg-white border-zinc-100'}`}>
            <div className="flex gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${tip.isAI ? 'bg-indigo-600 text-white' : 'bg-zinc-50 text-zinc-900'}`}>
                {tip.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                   <h3 className="font-bold text-zinc-900 text-sm truncate">{tip.title}</h3>
                   {tip.isAI && <span className="text-[7px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-black uppercase tracking-widest">{t('searchResult')}</span>}
                </div>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">{tip.shortDesc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTip && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto no-scrollbar">
            <header className="flex justify-between items-start mb-6">
               <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedTip.isAI ? 'bg-indigo-600 text-white' : 'bg-zinc-900 text-white'}`}>
                     {selectedTip.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-zinc-900">{selectedTip.title}</h2>
                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">{selectedTip.category}</span>
                  </div>
               </div>
              <button onClick={() => setSelectedTip(null)} className="text-zinc-400 p-2">✕</button>
            </header>
            <div className="space-y-4 mb-8">
              <p className="text-zinc-600 leading-relaxed font-medium whitespace-pre-wrap">{selectedTip.fullContent}</p>
              
              {selectedTip.isAI && selectedTip.sources && (
                <div className="pt-6 border-t border-zinc-100">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">{t('sources')}</h4>
                  <div className="space-y-2">
                    {selectedTip.sources.map((source, i) => (
                      <a 
                        key={i} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl group hover:bg-indigo-50 transition-colors"
                      >
                        <span className="text-xs font-bold text-zinc-700 truncate pr-4 group-hover:text-indigo-700">{source.title}</span>
                        <span className="text-[8px] font-black uppercase text-indigo-500 whitespace-nowrap">{t('visitSource')}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => setSelectedTip(null)} className="w-full bg-zinc-900 text-white font-black py-5 rounded-[24px] uppercase tracking-widest">{t('done')}</button>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl z-[60] animate-in slide-in-from-bottom-6">
          {toast}
        </div>
      )}
    </div>
  );
};

export default ContentScreen;
