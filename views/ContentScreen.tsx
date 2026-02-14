
import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { Icons } from '../constants';

type TabType = 'All' | 'Study' | 'Faith/Habits';

interface Tip {
  id: string;
  category: 'Study' | 'Faith' | 'Habits';
  title: string;
  shortDesc: string;
  fullContent: string;
  icon: React.ReactNode;
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
  },
  {
    id: '4',
    category: 'Study',
    title: 'Active Recall',
    shortDesc: 'Test yourself rather than re-reading.',
    fullContent: 'Instead of passively reading notes, try to explain a concept from memory or use flashcards. Active recall strengthens neural pathways and ensures long-term retention of information.',
    icon: <Icons.Tasks />
  },
  {
    id: '5',
    category: 'Faith',
    title: 'Mindfulness in Prayer',
    shortDesc: 'Achieving Khushu in daily rituals.',
    fullContent: 'Khushu is the state of humility and focus in prayer. To improve it, try to understand the meanings of the verses you recite and slow down your movements during the ritual.',
    icon: <Icons.AI />
  },
  {
    id: '6',
    category: 'Habits',
    title: 'Sleep Hygiene',
    shortDesc: 'Better sleep for a more productive tomorrow.',
    fullContent: 'Consistency is key. Try to go to bed and wake up at the same time every day, even on weekends. Avoid screens at least 30 minutes before sleep to allow your melatonin levels to rise.',
    icon: <Icons.Flame />
  }
];

const ContentScreen: React.FC = () => {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);
  const [showContributeDialog, setShowContributeDialog] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const filteredTips = useMemo(() => {
    if (activeTab === 'All') return MOCK_TIPS;
    if (activeTab === 'Study') return MOCK_TIPS.filter(t => t.category === 'Study');
    return MOCK_TIPS.filter(t => t.category === 'Faith' || t.category === 'Habits');
  }, [activeTab]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    showToast('Content shared with community!');
  };

  return (
    <div className="p-6 space-y-6 relative min-h-full pb-32">
      <header className="pt-8">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Resources</h1>
        <p className="text-zinc-500 mt-1 font-medium">Tips for a focused life.</p>
      </header>

      {/* Top Tab Bar */}
      <div className="flex gap-2 bg-zinc-100 p-1.5 rounded-2xl sticky top-2 z-10">
        {(['All', 'Study', 'Faith/Habits'] as TabType[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content List */}
      <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {filteredTips.map((tip) => (
          <div 
            key={tip.id}
            onClick={() => setSelectedTip(tip)}
            className="bg-white border border-zinc-100 p-5 rounded-[32px] shadow-sm hover:border-zinc-300 transition-all active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-900 flex-shrink-0">
                {tip.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                   <h3 className="font-bold text-zinc-900 text-sm truncate pr-2">{tip.title}</h3>
                   <button 
                    onClick={handleShare}
                    className="p-2 text-zinc-300 hover:text-zinc-900 transition-colors"
                   >
                     <Icons.Share />
                   </button>
                </div>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">{tip.shortDesc}</p>
                <div className="mt-3 flex items-center gap-2">
                   <span className="text-[8px] font-black uppercase tracking-tighter bg-zinc-100 px-2 py-0.5 rounded text-zinc-500">
                    {tip.category}
                   </span>
                   <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Read More →</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAB: Contribute */}
      <button 
        onClick={() => setShowContributeDialog(true)}
        className="fixed bottom-28 right-6 flex items-center gap-2 bg-zinc-900 text-white px-6 py-4 rounded-3xl shadow-2xl shadow-zinc-900/40 z-40 active:scale-95 transition-all group"
      >
        <Icons.Plus />
        <span className="text-sm font-black uppercase tracking-widest overflow-hidden transition-all duration-300 max-w-0 group-hover:max-w-xs group-hover:ml-1">Contribute</span>
      </button>

      {/* Read More Dialog / Bottom Sheet */}
      {selectedTip && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center">
                     {selectedTip.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-zinc-900">{selectedTip.title}</h2>
                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">{selectedTip.category}</span>
                  </div>
               </div>
              <button onClick={() => setSelectedTip(null)} className="text-zinc-400 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            <div className="space-y-4 mb-8">
              <p className="text-zinc-600 leading-relaxed font-medium">
                {selectedTip.fullContent}
              </p>
            </div>

            <button 
              onClick={() => setSelectedTip(null)}
              className="w-full bg-zinc-900 text-white font-black py-5 rounded-[24px] active:scale-95 transition-all uppercase tracking-widest"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Contribute Dialog */}
      {showContributeDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 animate-in zoom-in-95 duration-300">
            <header className="text-center space-y-2 mb-8">
               <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-zinc-50 text-zinc-900 rounded-full flex items-center justify-center scale-125">
                     <Icons.AI />
                  </div>
               </div>
               <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Contribute</h2>
               <p className="text-sm text-zinc-500">Submit your tip to the community.</p>
            </header>

            <div className="space-y-4">
               <input 
                type="text" 
                placeholder="Tip Title" 
                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 focus:outline-none font-bold"
               />
               <textarea 
                placeholder="Write your advice here..." 
                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 focus:outline-none h-32 resize-none text-sm font-medium"
               />
            </div>

            <div className="flex gap-4 mt-8">
               <button 
                onClick={() => setShowContributeDialog(false)}
                className="flex-1 py-4 text-zinc-400 font-black uppercase tracking-widest text-xs"
               >
                 Cancel
               </button>
               <button 
                onClick={() => {
                  setShowContributeDialog(false);
                  showToast('Tip submitted for review!');
                }}
                className="flex-1 bg-zinc-900 text-white font-black py-4 rounded-[20px] shadow-xl active:scale-95 transition-all text-xs uppercase tracking-widest"
               >
                 Submit
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl animate-in slide-in-from-bottom-6 z-[60]">
          {toast}
        </div>
      )}
    </div>
  );
};

export default ContentScreen;
