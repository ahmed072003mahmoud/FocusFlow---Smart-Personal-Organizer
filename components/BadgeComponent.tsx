
import React from 'react';
import { Badge, BadgeTier } from '../types';
import { Icons } from '../constants';

interface BadgeComponentProps {
  badge: Badge;
  size?: number;
}

export const BadgeComponent: React.FC<BadgeComponentProps> = ({ badge, size = 64 }) => {
  const IconComponent = (Icons as any)[badge.icon] || Icons.AI;
  
  // Fixed: Mapping BadgeTier to respective visualization colors
  const tierColors: Record<BadgeTier, string> = {
    stability: 'border-[#CD7F32]', // Bronze-like for initial consistency
    recovery: 'border-[#C0C0C0]',  // Silver-like for resilience
    restraint: 'border-[#FFD700]'  // Gold-like for advanced wisdom
  };

  const isGold = badge.tier === 'restraint';
  const radius = (size / 2) - 4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (badge.progress / 100) * circumference;

  return (
    <div 
      className={`relative flex items-center justify-center rounded-full transition-all duration-500 ease-in-out
        ${badge.isJustUnlocked ? 'scale-110' : 'scale-100'}
        ${badge.isLocked ? 'grayscale opacity-50' : 'grayscale-0 opacity-100'}
      `}
      style={{ width: size, height: size }}
    >
      {/* Progress Ring */}
      <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-100" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out text-[#5B7C8D]"
        />
      </svg>

      {/* Badge Body */}
      <div 
        className={`w-[85%] h-[85%] rounded-full bg-white border-2 flex items-center justify-center z-10 overflow-hidden relative
          ${!badge.isLocked ? tierColors[badge.tier] : 'border-slate-100'}
        `}
      >
        {!badge.isLocked && isGold && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />}
        <div className={`${badge.isLocked ? 'blur-[1px]' : ''}`}>
           <IconComponent />
        </div>
      </div>

      {badge.isLocked && (
        <div className="absolute -bottom-6 flex flex-col items-center w-full">
           <div className="w-8 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-slate-300" style={{ width: `${badge.progress}%` }} />
           </div>
           <span className="text-[6px] font-black text-slate-300 uppercase mt-1">{Math.round(badge.progress)}%</span>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
