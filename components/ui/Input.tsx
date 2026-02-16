
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">
          {label}
        </label>
      )}
      <input
        className={`
          w-full bg-bg-soft dark:bg-zinc-800/50
          border border-zinc-200 dark:border-zinc-700
          rounded-input px-4 py-3 text-sm
          text-text-primary dark:text-dark-text
          placeholder:text-text-muted
          focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
          transition-all duration-200
          ${error ? 'border-status-error' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-[10px] font-semibold text-status-error px-1">
          {error}
        </span>
      )}
    </div>
  );
};
