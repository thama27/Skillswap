import React from 'react';
import { Calendar, Clock, Video, User, CheckCircle, FileText } from 'lucide-react';
import type { Session } from '../types';
import Avatar from './Avatar';
import Badge from './Badge';
import Button from './Button';

interface SessionCardProps {
  session: Session;
  onJoin?: (session: Session) => void;
  onViewDetails?: (session: Session) => void;
  compact?: boolean;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onJoin,
  onViewDetails,
  compact = false,
}) => {
  const isUpcoming = session.status === 'Upcoming';

  return (
    <div className="bg-[#11131A] border border-white/[0.08] hover:border-brand-purple/40 rounded-2xl p-5 shadow-card hover:shadow-glow transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-white text-base leading-tight">
              {session.title || session.skillName}
            </h4>
          </div>
          <p className="text-xs text-brand-purple font-medium">
            {session.skillName}
          </p>
        </div>

        <Badge
          color={isUpcoming ? 'purple' : 'emerald'}
          variant="subtle"
          dot={isUpcoming}
        >
          {session.status}
        </Badge>
      </div>

      {/* Mentor Info */}
      <div className="mt-4 flex items-center gap-3 p-2.5 rounded-xl bg-[#0D0F14] border border-white/[0.05]">
        <Avatar
          src={session.mentorAvatar}
          name={session.mentorName}
          size="sm"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs text-slate-400">Mentor</p>
          <p className="text-sm font-semibold text-white truncate">{session.mentorName}</p>
        </div>
      </div>

      {/* Date & Time */}
      <div className="mt-3.5 flex flex-wrap items-center gap-4 text-xs text-slate-300">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-brand-purple" />
          <span>{session.date}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{session.time} ({session.durationMinutes}m)</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-4 pt-3.5 border-t border-white/[0.06] flex items-center gap-2.5">
        {isUpcoming ? (
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            onClick={() => onJoin?.(session)}
            icon={<Video className="w-3.5 h-3.5" />}
          >
            Join Session
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => onViewDetails?.(session)}
            icon={<FileText className="w-3.5 h-3.5" />}
          >
            View Notes & Certificate
          </Button>
        )}
      </div>
    </div>
  );
};

export default SessionCard;
