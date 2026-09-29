import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive?: boolean;
  };
  color?: 'purple' | 'cyan' | 'blue' | 'emerald' | 'amber';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-[#11141D] border border-white/[0.07] hover:border-white/20 rounded-xl p-4 transition-colors ${
        onClick ? 'cursor-pointer hover:bg-[#151924]' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <div className="w-7 h-7 rounded-lg bg-white/[0.04] text-slate-300 border border-white/[0.06] flex items-center justify-center">
          {icon}
        </div>
      </div>

      <div className="mt-2.5">
        <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
        {subtext && (
          <p className="mt-0.5 text-[11px] text-slate-500 truncate">{subtext}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
