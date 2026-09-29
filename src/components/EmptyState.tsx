import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`bg-[#11131A] border border-white/[0.08] rounded-2xl p-10 text-center flex flex-col items-center justify-center max-w-md mx-auto ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 text-brand-purple border border-brand-purple/20 flex items-center justify-center mb-4">
        {icon || <Sparkles className="w-6 h-6" />}
      </div>

      <h4 className="text-base font-bold text-white mb-1.5">{title}</h4>
      <p className="text-xs text-slate-400 max-w-xs mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="sm"
          onClick={onAction}
          icon={<ArrowRight className="w-3.5 h-3.5" />}
          iconPosition="right"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
