
import React from 'react';
import { Badge, BadgeTier } from '../types';
import { Icons } from '../constants';

interface BadgeComponentProps {
  badge: Badge;
  size?: number;
}

export const BadgeComponent: React.FC<BadgeComponentProps> = ({ badge, size = 64 }) => {
  const IconComponent = (Icons as any)[badge.icon] || Icons.AI;
  
  const tierColors: Record<BadgeTier, string> = {
    bronze: 'border-[#CD7F32]',
    silver: 'border-[#C0C0C0]',
    gold: 'border-[#FFD700]'
  };

  const tierGlow: Record<BadgeTier, string> = {
    bronze: 'shadow-[0_0_10px_rgba(205,127,50,0.3)]',
    silver: 'shadow-[0_0_15px_rgba(192,192,192,0.4)]',
    gold: 'shadow-[0_0_20px_rgba(255,215,0,0.5)]'
  };

  const radius = (size / 2) - 4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (badge.progress / 100) * circumference;

  return (
    <div 
      className={`relative flex items-center justify-center rounded-full transition-all duration-500 ease-in-out
        ${badge.isJustUnlocked ? 'scale-110' : 'scale-100'}
        ${badge.isLocked ? 'grayscale opacity-50' : `grayscale-0 opacity-100 ${tierGlow[badge.tier]}`}
      `}
      style={{ width: size, height: size }}
    >
      {/* Progress Ring */}
      <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          className="text-zinc-100 dark:text-zinc-800"
        />
        {(badge.progress > 0 || !badge.isLocked) && (
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
            className={`transition-all duration-1000 ease-out ${
              badge.isLocked ? 'text-zinc-300' : 'text-primary-500'
            }`}
          />
        )}
      </svg>

      {/* Badge Body */}
      <div 
        className={`w-[85%] h-[85%] rounded-full bg-white dark:bg-zinc-900 border-2 flex items-center justify-center z-10 
          ${!badge.isLocked ? tierColors[badge.tier] : 'border-zinc-100 dark:border-zinc-800'}
        `}
      >
        <div className={`${badge.isLocked ? 'blur-[1px]' : ''}`}>
           <IconComponent />
        </div>
      </div>

      {/* Unlock Shine Effect */}
      {badge.isJustUnlocked && (
        <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-20 pointer-events-none" />
      )}
    </div>
  );
};
