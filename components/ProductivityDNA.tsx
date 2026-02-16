
import React, { useMemo } from 'react';
import { Task, Category } from '../types';

export const ProductivityDNA: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  const completed = tasks.filter(t => t.isCompleted);
  
  const dominantColor = useMemo(() => {
    if (completed.length === 0) return '#cbd5e1';
    const counts = completed.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const top = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    
    switch (top) {
      case Category.STUDY: return '#6366f1'; // indigo
      case Category.PRAYER: return '#10b981'; // emerald
      case Category.HABIT: return '#f59e0b'; // amber
      case Category.WORK: return '#ef4444'; // rose
      default: return '#64748b';
    }
  }, [completed]);

  return (
    <div className="relative flex items-center justify-center w-64 h-64 blob-container">
       <div 
         className="absolute inset-0 rounded-full transition-all duration-[4000ms] animate-pulse blur-3xl opacity-20"
         style={{ backgroundColor: dominantColor }}
       />
       <svg viewBox="0 0 200 200" className="w-full h-full relative z-10 drop-shadow-2xl">
          <path 
            fill={dominantColor}
            d="M45.7,-78.3C58.9,-71.4,69.1,-58.5,76.5,-44.6C83.9,-30.7,88.4,-15.3,87.6,-0.5C86.7,14.4,80.5,28.8,72.4,41.4C64.3,54,54.3,64.8,42.2,72.7C30.1,80.6,15.1,85.5,-0.5,86.4C-16,87.3,-32.1,84.1,-46.3,77.5C-60.5,70.9,-72.9,60.8,-80.4,48.2C-87.9,35.5,-90.4,20.3,-89.1,5.6C-87.7,-9.1,-82.4,-23.4,-74.6,-36.2C-66.8,-49,-56.4,-60.3,-43.8,-67.6C-31.1,-74.8,-15.6,-78,0.3,-78.6C16.1,-79.1,32.4,-85.1,45.7,-78.3Z"
            transform="translate(100 100)"
            className="animate-[morph_15s_infinite_ease-in-out]"
          />
       </svg>
       <style>{`
         @keyframes morph {
           0%, 100% { d: path("M45.7,-78.3C58.9,-71.4,69.1,-58.5,76.5,-44.6C83.9,-30.7,88.4,-15.3,87.6,-0.5C86.7,14.4,80.5,28.8,72.4,41.4C64.3,54,54.3,64.8,42.2,72.7C30.1,80.6,15.1,85.5,-0.5,86.4C-16,87.3,-32.1,84.1,-46.3,77.5C-60.5,70.9,-72.9,60.8,-80.4,48.2C-87.9,35.5,-90.4,20.3,-89.1,5.6C-87.7,-9.1,-82.4,-23.4,-74.6,-36.2C-66.8,-49,-56.4,-60.3,-43.8,-67.6C-31.1,-74.8,-15.6,-78,0.3,-78.6C16.1,-79.1,32.4,-85.1,45.7,-78.3Z"); }
           33% { d: path("M42.2,-73.4C54.9,-67.1,65.6,-56,73.5,-42.8C81.4,-29.6,86.5,-14.8,85.8,-0.4C85,14,78.4,28.1,69.8,40.1C61.2,52.1,50.6,62,38.3,70C26,78.1,13,84.3,-0.6,85.4C-14.2,86.4,-28.4,82.4,-41.2,74.9C-54,67.4,-65.4,56.5,-73.1,43.5C-80.8,30.5,-84.8,15.3,-85,0.1C-85.2,-15,-81.6,-30,-73.8,-43C-66,-56.1,-54,-67.1,-40.7,-73C-27.4,-78.9,-13.7,-79.6,0.3,-80.1C14.3,-80.6,29.5,-79.7,42.2,-73.4Z"); }
           66% { d: path("M47.7,-79.8C60.8,-73.4,70,-59.5,76.1,-45C82.1,-30.5,85,-15.3,84.5,-0.3C84.1,14.7,80.3,29.4,72,42C63.8,54.6,51.1,65.1,37.1,73.1C23.1,81.1,7.7,86.6,-7.7,86.6C-23,86.6,-38.4,81.1,-52.1,72.4C-65.8,63.7,-77.8,51.8,-84.9,37.9C-91.9,24,-94,8.1,-91.6,-7.2C-89.2,-22.6,-82.3,-37.4,-72.1,-49.6C-61.9,-61.8,-48.3,-71.4,-34.2,-77.3C-20.1,-83.2,-5.4,-85.4,9.6,-87C24.7,-88.6,40.1,-86.2,47.7,-79.8Z"); }
         }
       `}</style>
    </div>
  );
};
