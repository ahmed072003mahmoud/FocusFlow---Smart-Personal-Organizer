
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white dark:bg-darkBg rounded-card border border-gray-100 dark:border-gray-800 transition-all ${className}`}
  >
    {children}
  </div>
);
