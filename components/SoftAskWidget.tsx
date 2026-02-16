
import React from 'react';
import { Card } from './ui/Card';
import { useApp } from '../AppContext';

export const SoftAskWidget: React.FC = () => {
  const { activeSoftPrompt, logBehavior, setState } = useApp() as any;

  if (!activeSoftPrompt) return null;

  const handleResponse = (option: string) => {
    // Log the choice as a behavior event
    logBehavior('idle_exit', { 
      promptId: activeSoftPrompt.id, 
      userChoice: option 
    });
    
    // Clear prompt and update last prompt time
    setState((prev: any) => ({
      ...prev,
      activeSoftPrompt: null,
      lastPromptTime: new Date().toISOString()
    }));
  };

  return (
    <div className="animate-in slide-in-from-right duration-500">
      <Card className="p-4 bg-primary-50/50 border-primary-100 dark:bg-primary-900/10 dark:border-primary-800/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs flex-shrink-0">
            ?
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-primary-700 dark:text-primary-300 mb-3 leading-relaxed">
              {activeSoftPrompt.question}
            </p>
            <div className="flex gap-2">
              {activeSoftPrompt.options.map(option => (
                <button
                  key={option}
                  onClick={() => handleResponse(option)}
                  className="px-4 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-primary-500 hover:border-primary-500 transition-all shadow-sm active:scale-95"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <button 
            onClick={() => setState((prev: any) => ({ ...prev, activeSoftPrompt: null }))}
            className="text-zinc-300 hover:text-zinc-500 transition-colors"
          >
            ✕
          </button>
        </div>
      </Card>
    </div>
  );
};
