
import React, { useState } from 'react';
import { useApp } from '../AppContext';

const BrainDump: React.FC = () => {
  const { processBrainDump } = useApp();
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMagic = async () => {
    if (!text.trim()) return;
    setIsProcessing(true);
    await processBrainDump(text);
    setIsProcessing(false);
    setText('');
    alert("AI has processed your thoughts into tasks! Check your Timeline.");
  };

  return (
    <div className="h-[calc(100vh-120px)] w-full flex flex-col p-6 animate-slide-up">
      <textarea 
        placeholder="Dump everything here. Thoughts, todos, ideas..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 w-full bg-transparent text-2xl font-black text-gray-900 placeholder:text-gray-100 focus:outline-none resize-none p-10 leading-relaxed no-scrollbar"
      />
      
      <div className="flex justify-center p-8">
        <button 
          onClick={handleMagic}
          disabled={!text || isProcessing}
          className={`px-12 py-5 rounded-btn font-black text-xs uppercase tracking-[0.4em] transition-all flex items-center gap-4 ${isProcessing ? 'bg-gray-200 text-gray-400' : 'bg-primary text-white shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95'}`}
        >
          {isProcessing ? 'Thinking...' : '✨ AI Magic'}
        </button>
      </div>
    </div>
  );
};

export default BrainDump;
