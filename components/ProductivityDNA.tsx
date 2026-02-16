
import React, { useMemo } from 'react';
import { Task, Category } from '../types';

interface DNAProps {
  tasks: Task[];
  size?: number;
}

export const ProductivityDNA: React.FC<DNAProps> = ({ tasks, size = 300 }) => {
  const completed = tasks.filter(t => t.isCompleted);
  
  const dominantColor = useMemo(() => {
    if (completed.length === 0) return '#cbd5e1'; // slate-300
    const counts = completed.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const top = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    
    switch (top) {
      case Category.STUDY: return '#3b82f6'; // blue
      case Category.PRAYER: return '#10b981'; // emerald
      case Category.HABIT: return '#f59e0b'; // amber
      default: return '#5B7C8D'; // primary
    }
  }, [completed]);

  return (
    <div className="relative flex items-center justify-center blob-container" style={{ width: size, height: size }}>
       <div 
         className="absolute w-full h-full rounded-full transition-all duration-[3000ms] ease-in-out mix-blend-multiply opacity-70 animate-pulse"
         style={{ 
           backgroundColor: dominantColor,
           borderRadius: `${40 + Math.random()*20}% ${60 - Math.random()*20}% ${50 + Math.random()*30}% ${50 - Math.random()*20}%`,
           transform: `scale(${0.8 + Math.random()*0.4})`
         }}
       />
       <div 
         className="absolute w-[80%] h-[80%] rounded-full transition-all duration-[4000ms] ease-in-out mix-blend-screen opacity-50"
         style={{ 
           backgroundColor: '#E63946',
           borderRadius: `${60 - Math.random()*20}% ${40 + Math.random()*20}% ${30 + Math.random()*30}% ${70 - Math.random()*20}%`,
           transform: `rotate(${Math.random()*360}deg)`
         }}
       />
    </div>
  );
};
