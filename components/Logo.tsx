
import React from 'react';

export const Logo: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Main Fluid Shape */}
        <path 
          d="M50 10 C 25 10 10 35 10 60 C 10 85 30 90 50 90 C 70 90 90 85 90 60 C 90 35 75 10 50 10 Z" 
          fill="url(#logoGrad)"
          filter="url(#glow)"
        />
        
        {/* Core Focus Ring */}
        <circle cx="50" cy="55" r="15" fill="none" stroke="white" strokeWidth="4" strokeDasharray="60 40" />
        
        {/* Inner Pulse Dot */}
        <circle cx="50" cy="55" r="5" fill="#ADFF2F" className="animate-pulse" />
      </svg>
    </div>
  );
};
