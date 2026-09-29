import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: 'purple' | 'blue' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'slate';
  variant?: 'subtle' | 'solid' | 'outline';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  color = 'purple',
  variant = 'subtle',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  const colorStyles = {
    purple: {
      subtle: 'bg-brand-purple/15 text-purple-300 border border-brand-purple/30',
      solid: 'bg-brand-purple text-white',
      outline: 'border border-brand-purple text-purple-300',
      dotColor: 'bg-brand-purple',
    },
    blue: {
      subtle: 'bg-brand-500/15 text-indigo-300 border border-brand-500/30',
      solid: 'bg-brand-500 text-white',
      outline: 'border border-brand-500 text-indigo-300',
      dotColor: 'bg-brand-500',
    },
    cyan: {
      subtle: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
      solid: 'bg-cyan-500 text-slate-900',
      outline: 'border border-cyan-500 text-cyan-300',
      dotColor: 'bg-cyan-400',
    },
    emerald: {
      subtle: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
      solid: 'bg-emerald-500 text-slate-900',
      outline: 'border border-emerald-500 text-emerald-300',
      dotColor: 'bg-emerald-400',
    },
    amber: {
      subtle: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
      solid: 'bg-amber-500 text-slate-900',
      outline: 'border border-amber-500 text-amber-300',
      dotColor: 'bg-amber-400',
    },
    rose: {
      subtle: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
      solid: 'bg-rose-500 text-white',
      outline: 'border border-rose-500 text-rose-300',
      dotColor: 'bg-rose-400',
    },
    slate: {
      subtle: 'bg-slate-800 text-slate-300 border border-white/10',
      solid: 'bg-slate-700 text-white',
      outline: 'border border-slate-600 text-slate-300',
      dotColor: 'bg-slate-400',
    },
  };

  const currentStyles = colorStyles[color];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full select-none ${sizeStyles[size]} ${currentStyles[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${currentStyles.dotColor}`} />}
      {children}
    </span>
  );
};

export default Badge;
