import React from 'react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading data...',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 space-y-3 ${className}`}>
      <div className="relative w-10 h-10">
        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-brand-purple animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
        </div>
      </div>
      <p className="text-xs font-medium text-slate-400 animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingState;
