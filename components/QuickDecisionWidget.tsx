
import React from 'react';
import { Category, Priority } from '../types';
import { SmartSuggester, Suggestion } from '../utils/SmartSuggester';
import { useApp } from '../AppContext';

interface QuickDecisionWidgetProps {
  category: Category;
  onSelect: (suggestion: Suggestion) => void;
}

const QuickDecisionWidget: React.FC<QuickDecisionWidgetProps> = ({ category, onSelect }) => {
  const { currentWeekMode } = useApp();
  const suggestions = SmartSuggester.getSuggestions(category, currentWeekMode);

  if (suggestions.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Smart Suggestions</p>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 px-1">
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(s)}
            className="flex-shrink-0 flex items-center gap-2 bg-zinc-50 border border-zinc-100 hover:border-zinc-300 hover:bg-zinc-100 px-4 py-2.5 rounded-2xl transition-all active:scale-95 group"
          >
            <span className="text-sm group-hover:scale-110 transition-transform">{s.icon}</span>
            <div className="text-left">
              <p className="text-[11px] font-black text-zinc-900 leading-none">{s.label}</p>
              <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-tighter mt-1">{s.duration}m</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickDecisionWidget;
