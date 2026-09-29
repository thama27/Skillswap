import React from 'react';
import { X, Check } from 'lucide-react';

interface SkillChipProps {
  name: string;
  proficiency?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  selected?: boolean;
  selectable?: boolean;
  onSelect?: (name: string) => void;
  onRemove?: () => void;
  variant?: 'default' | 'glow' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const SkillChip: React.FC<SkillChipProps> = ({
  name,
  proficiency,
  selected = false,
  selectable = false,
  onSelect,
  onRemove,
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-xs px-3 py-1.5 gap-2',
  };

  const getVariantStyles = () => {
    if (selectable) {
      if (selected) {
        return 'bg-indigo-600 text-white border-indigo-500 cursor-pointer font-medium';
      }
      return 'bg-[#151924] text-slate-300 border-white/[0.08] hover:border-white/20 hover:text-white cursor-pointer';
    }

    return 'bg-[#151924] text-slate-200 border-white/[0.08]';
  };

  return (
    <span
      onClick={() => selectable && onSelect && onSelect(name)}
      className={`inline-flex items-center rounded-lg font-medium border transition-colors select-none ${sizeStyles[size]} ${getVariantStyles()} ${className}`}
    >
      {selectable && selected && <Check className="w-3 h-3 text-white shrink-0" />}
      <span className="truncate">{name}</span>
      {proficiency && (
        <span className="text-[10px] text-slate-400 bg-black/30 px-1.5 py-0.5 rounded">
          {proficiency}
        </span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:text-rose-400 p-0.5 rounded transition-colors"
          title={`Remove ${name}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

export default SkillChip;
