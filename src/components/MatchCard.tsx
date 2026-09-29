import React, { useState } from 'react';
import { Calendar, CheckCircle2, UserCheck, ArrowRight } from 'lucide-react';
import type { MatchResult } from '../types';
import Avatar from './Avatar';
import Badge from './Badge';
import SkillChip from './SkillChip';
import Button from './Button';

interface MatchCardProps {
  match: MatchResult;
  onViewProfile: (match: MatchResult) => void;
  onConnect?: (match: MatchResult) => void;
  isConnected?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onViewProfile,
  onConnect,
  isConnected = false,
}) => {
  const [connectedState, setConnectedState] = useState(isConnected);

  const handleConnectClick = () => {
    setConnectedState(!connectedState);
    onConnect?.(match);
  };

  return (
    <div className="bg-[#11141D] border border-white/[0.07] hover:border-white/20 rounded-xl p-4 transition-colors flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <Avatar
              src={match.user.avatar}
              name={match.user.name}
              size="sm"
              verified={match.user.verified}
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-semibold text-white text-sm leading-tight">
                  {match.user.name}
                </h4>
                <Badge color="purple" size="sm">
                  {match.user.role || 'Mentor'}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {match.experienceLevel} • {match.roleStatus}
              </p>
            </div>
          </div>

          {/* AI Match Badge */}
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-[11px] font-semibold">
            {match.matchPercentage}% Match
          </span>
        </div>

        {/* AI Insight Reason */}
        <div className="mt-3 p-2 rounded-lg bg-[#0D0F16] border border-white/[0.04]">
          <p className="text-xs text-slate-300 italic leading-relaxed">
            "{match.matchInsight}"
          </p>
        </div>

        {/* Skills Tag Area */}
        <div className="mt-3">
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1.5">
            Skills Offered
          </p>
          <div className="flex flex-wrap gap-1.5">
            {match.teachSkills.map((ts) => (
              <SkillChip
                key={ts.id}
                name={ts.skill.name}
                proficiency={ts.proficiency}
                size="sm"
              />
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Available: <strong className="text-slate-300 font-medium">{match.availabilityDays}</strong></span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={() => onViewProfile(match)}
          icon={<ArrowRight className="w-3.5 h-3.5" />}
          iconPosition="right"
        >
          View Profile
        </Button>

        <Button
          variant={connectedState ? 'outline' : 'primary'}
          size="sm"
          className="flex-1"
          onClick={handleConnectClick}
          icon={connectedState ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <UserCheck className="w-3.5 h-3.5" />}
        >
          {connectedState ? 'Connected' : 'Connect'}
        </Button>
      </div>
    </div>
  );
};

export default MatchCard;
