import React from 'react';
import { Briefcase, Check, AlertCircle, ArrowRight, TrendingUp } from 'lucide-react';
import type { CareerPath } from '../types';
import Button from './Button';
import Badge from './Badge';

interface CareerCardProps {
  career: CareerPath;
  onViewDetails: (career: CareerPath) => void;
}

export const CareerCard: React.FC<CareerCardProps> = ({
  career,
  onViewDetails,
}) => {
  return (
    <div className="bg-[#11131A] border border-white/[0.08] hover:border-brand-purple/40 rounded-2xl p-6 shadow-card hover:shadow-glow transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header: Role Title + Match % */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-purple/20 to-brand-500/20 border border-brand-purple/30 text-brand-purple flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">
                {career.title}
              </h3>
              {career.avgSalary && (
                <p className="text-xs text-slate-400 mt-0.5">
                  Est. Salary: <span className="text-slate-300 font-medium">{career.avgSalary}</span>
                </p>
              )}
            </div>
          </div>

          <Badge color="purple" size="md">
            {career.matchPercentage}% Match
          </Badge>
        </div>

        {/* Why this role? */}
        <div className="mt-4 p-3 rounded-xl bg-[#0D0F14] border border-white/[0.05]">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-purple mb-1">
            Why This Role?
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            {career.whyRecommended}
          </p>
        </div>

        {/* Required Skills & Status Comparison */}
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Your Verified Skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {career.userSkillsMatched.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                >
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>{s}</span>
                </span>
              ))}
            </div>
          </div>

          {career.skillGaps.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Recommended Skill Gap to Bridge
              </p>
              <div className="flex flex-wrap gap-1.5">
                {career.skillGaps.map((sg) => (
                  <span
                    key={sg}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30"
                  >
                    <AlertCircle className="w-3 h-3 text-amber-400" />
                    <span>{sg}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Button */}
      <div className="mt-6 pt-4 border-t border-white/[0.06]">
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={() => onViewDetails(career)}
          icon={<ArrowRight className="w-3.5 h-3.5" />}
          iconPosition="right"
        >
          View Career Details & Mentors
        </Button>
      </div>
    </div>
  );
};

export default CareerCard;
