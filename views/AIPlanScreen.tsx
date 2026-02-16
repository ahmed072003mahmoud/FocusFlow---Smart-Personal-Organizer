
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Icons } from '../constants';
import { Category, Priority, Task } from '../types';
import { GoogleGenAI } from "@google/genai";

type PlannerStep = 'form' | 'loading' | 'result';
type Mood = 'Energetic' | 'Tired' | 'Focused' | 'Stressed';
type Focus = 'Study' | 'Worship' | 'Health' | 'Social';

const extractJson = (text: string) => {
  try {
    const jsonMatch = text.match(/```json?([\s\S]*?)```/);
    const cleanText = jsonMatch ? jsonMatch[1] : text;
    const firstBracket = cleanText.indexOf('[');
    const lastBracket = cleanText.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1) {
      return JSON.parse(cleanText.substring(firstBracket, lastBracket + 1));
    }
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("JSON Parse Error:", e);
    throw new Error("Failed to parse AI response");
  }
};

const AIPlanScreen: React.FC = () => {
  const { addTask, t } = useApp();
  
  const [step, setStep] = useState<PlannerStep>('form');
  const [mood, setMood] = useState<Mood>('Focused');
  const [focus, setFocus] = useState<Focus>('Study');
  const [hours, setHours] = useState<number>(4);
  const [generatedTasks, setGeneratedTasks] = useState<Partial<Task>[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const generateWithAI = async () => {
    setStep('loading');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Act as a senior academic productivity strategist. Create a high-performance student schedule.
      Context:
      - Mood: ${mood}
      - Main Focus: ${focus}
      - Available Window: ${hours} hours
      
      Requirements:
      1. Use student energy-cycle principles (Deep work first if energetic, light work if tired).
      2. Return a JSON array of task objects.
      3. Fields: title (string), time (e.g., "10:30 AM"), category (Study, Habit, Prayer, Work, Other), priority (High, Normal), estimatedMinutes (integer).
      
      Return ONLY the JSON array.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 32768 }
        }
      });

      const tasks = extractJson(response.text);
      
      if (Array.isArray(tasks)) {
        setGeneratedTasks(tasks);
        setStep('result');
      } else {
        throw new Error("Invalid format");
      }
    } catch (e) {
      console.error("AI Generation failed:", e);
      setToast("AI reasoning failed. Check connectivity.");
      setStep('form');
    }
  };

  const handleAddTask = (task: Partial<Task>) => {
    addTask({
      title: task.title!,
      isCompleted: false,
      priority: (task.priority as Priority) || Priority.NORMAL,
      time: task.time!,
      category: (task.category as Category) || Category.OTHER,
      deadline: new Date().toISOString(),
      estimatedMinutes: task.estimatedMinutes || 30,
    });
    
    setToast(`${task.title} added to timeline! 🚀`);
    setTimeout(() => setToast(null), 2500);
  };

  const Chip: React.FC<{ label: string, selected: boolean, onClick: () => void }> = ({ label, selected, onClick }) => (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all border-2 ${
        selected 
          ? 'bg-[#2B3A67] text-white border-transparent shadow-xl' 
          : 'bg-white text-[#2B3A67]/40 border-slate-100 hover:border-slate-300'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] relative">
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-32">
        <header className="pt-8 mb-8">
          <h1 className="text-3xl font-black text-[#2B3A67] tracking-tight">{t('aiPlan')}</h1>
          <p className="text-slate-500 mt-1 font-medium italic opacity-70">Deep Reasoning Planner</p>
        </header>

        {step === 'form' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
            <section className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Internal State</label>
              <div className="flex flex-wrap gap-3">
                <Chip label="Energetic" selected={mood === 'Energetic'} onClick={() => setMood('Energetic')} />
                <Chip label="Tired" selected={mood === 'Tired'} onClick={() => setMood('Tired')} />
                <Chip label="Focused" selected={mood === 'Focused'} onClick={() => setMood('Focused')} />
                <Chip label="Stressed" selected={mood === 'Stressed'} onClick={() => setMood('Stressed')} />
              </div>
            </section>

            <section className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Top Priority</label>
              <div className="flex flex-wrap gap-3">
                <Chip label="Study" selected={focus === 'Study'} onClick={() => setFocus('Study')} />
                <Chip label="Worship" selected={focus === 'Worship'} onClick={() => setFocus('Worship')} />
                <Chip label="Health" selected={focus === 'Health'} onClick={() => setFocus('Health')} />
                <Chip label="Social" selected={focus === 'Social'} onClick={() => setFocus('Social')} />
              </div>
            </section>

            <section className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50 space-y-8">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Block Size</label>
                <div className="flex flex-col items-end">
                   <span className="text-2xl font-black text-[#2B3A67]">{hours}h</span>
                   <span className="text-[8px] font-black text-slate-300 uppercase">Available Time</span>
                </div>
              </div>
              <input 
                type="range" 
                min="1" max="12" 
                value={hours} 
                onChange={(e) => setHours(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#E63946]"
              />
            </section>

            <button 
              onClick={generateWithAI}
              className="w-full bg-[#2B3A67] text-white font-black py-6 rounded-[32px] shadow-2xl shadow-[#2B3A67]/20 active:scale-95 transition-all text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-[#1E2A4A]"
            >
              <Icons.AI />
              Run Deep Strategy
            </button>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center py-24 space-y-8 animate-in fade-in duration-500">
            <div className="relative">
               <div className="w-20 h-20 border-[6px] border-[#2B3A67]/10 border-t-[#2B3A67] rounded-full animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center text-[#2B3A67] animate-pulse">
                  <Icons.AI />
               </div>
            </div>
            <div className="text-center">
               <p className="text-[#2B3A67] font-black text-lg tracking-tight mb-2">Analyzing your energy patterns...</p>
               <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em]">Using Gemini Pro Thinking</p>
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
            <div className="bg-emerald-50 text-emerald-700 px-6 py-4 rounded-[24px] text-xs font-bold text-center border border-emerald-100 mb-8">
               High-impact schedule generated. Tap tasks to commit.
            </div>
            <div className="space-y-4">
              {generatedTasks.map((task, idx) => (
                <div key={idx} className="bg-white border border-slate-50 p-6 rounded-[32px] shadow-sm flex items-center gap-5 group hover:border-[#2B3A67]/20 transition-all hover:shadow-xl hover:translate-x-2">
                  <button 
                    onClick={() => handleAddTask(task)}
                    className="w-12 h-12 bg-slate-50 text-[#2B3A67] rounded-2xl flex items-center justify-center hover:bg-[#2B3A67] hover:text-white active:scale-90 transition-all flex-shrink-0"
                  >
                    <Icons.Plus />
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#2B3A67] text-lg truncate tracking-tight">{task.title}</h3>
                    <div className="flex items-center gap-3 mt-1 opacity-60">
                      <span className="text-[9px] font-black uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">{task.time}</span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#E63946]">{task.category}</span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{task.estimatedMinutes}m</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-8">
              <button 
                onClick={() => setStep('form')}
                className="w-full py-5 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] border-2 border-dashed border-slate-200 rounded-[32px] hover:bg-slate-50 transition-colors"
              >
                Reset & Plan Again
              </button>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-[#2B3A67] text-white px-8 py-4 rounded-full text-xs font-bold shadow-2xl animate-in slide-in-from-bottom-6 z-[60]">
          {toast}
        </div>
      )}
    </div>
  );
};

export default AIPlanScreen;
