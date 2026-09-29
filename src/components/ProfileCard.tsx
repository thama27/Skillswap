import React from 'react';
import { Mail, GraduationCap, Calendar, Award, Edit3, ShieldCheck } from 'lucide-react';
import type { User, UserSkill, Interest } from '../types';
import Avatar from './Avatar';
import Badge from './Badge';
import SkillChip from './SkillChip';
import Button from './Button';

interface ProfileCardProps {
  user: User;
  skills: UserSkill[];
  interests: Interest[];
  proficiency?: string;
  availability?: string;
  onEdit?: () => void;
  isCurrentUser?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  skills,
  interests,
  proficiency = 'Intermediate',
  availability = 'Weekends',
  onEdit,
  isCurrentUser = false,
}) => {
  return (
    <div className="bg-[#11131A] border border-white/[0.08] rounded-2xl p-6 shadow-card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-4">
          <Avatar
            src={user.avatar}
            name={user.name}
            size="xl"
            verified={user.verified}
          />
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              {user.verified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-purple bg-brand-purple/15 px-2 py-0.5 rounded-full border border-brand-purple/30">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-400">
              {user.education && (
                <span className="inline-flex items-center gap-1.5 text-slate-300">
                  <GraduationCap className="w-3.5 h-3.5 text-brand-purple" />
                  {user.education}
                </span>
              )}
              {user.email && (
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  {user.email}
                </span>
              )}
            </div>
          </div>
        </div>

        {onEdit && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onEdit}
            icon={<Edit3 className="w-3.5 h-3.5" />}
          >
            Edit Profile
          </Button>
        )}
      </div>

      {/* Bio */}
      {user.bio && (
        <div className="py-4 border-b border-white/[0.08]">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            About & Learning Goal
          </p>
          <p className="text-sm text-slate-200 leading-relaxed">{user.bio}</p>
        </div>
      )}

      {/* Key Attributes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3 p-3 bg-[#0D0F14] rounded-xl border border-white/[0.05]">
          <div className="w-9 h-9 rounded-lg bg-brand-purple/15 text-brand-purple border border-brand-purple/30 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Proficiency Level
            </p>
            <p className="text-sm font-bold text-white">{proficiency}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-[#0D0F14] rounded-xl border border-white/[0.05]">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Availability
            </p>
            <p className="text-sm font-bold text-white">{availability}</p>
          </div>
        </div>
      </div>

      {/* Skills Area */}
      <div className="pt-4 space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Verified Skills ({skills.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <SkillChip
                key={s.id}
                name={s.skill.name}
                proficiency={s.proficiency}
              />
            ))}
          </div>
        </div>

        {interests.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Interests & Focus Areas
            </p>
            <div className="flex flex-wrap gap-1.5">
              {interests.map((int) => (
                <Badge key={int.id} color="purple" variant="subtle">
                  {int.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
