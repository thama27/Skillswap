import React from 'react';
import { Bell, Sparkles, Calendar, Award, Briefcase, Info, Check } from 'lucide-react';
import type { Notification as NotificationType } from '../types';

interface NotificationProps {
  notification: NotificationType;
  onMarkRead?: (id: string) => void;
  onClick?: () => void;
}

export const NotificationItem: React.FC<NotificationProps> = ({
  notification,
  onMarkRead,
  onClick,
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'match':
        return <Sparkles className="w-4 h-4 text-brand-purple" />;
      case 'session':
        return <Calendar className="w-4 h-4 text-cyan-400" />;
      case 'certificate':
        return <Award className="w-4 h-4 text-emerald-400" />;
      case 'career':
        return <Briefcase className="w-4 h-4 text-amber-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-3.5 rounded-xl border transition-all duration-150 flex items-start gap-3 cursor-pointer ${
        notification.read
          ? 'bg-[#0D0F14] border-white/[0.05] text-slate-400'
          : 'bg-[#11131A] border-brand-purple/30 text-slate-200 hover:border-brand-purple/50'
      }`}
    >
      <div className="w-8 h-8 rounded-lg bg-[#161922] border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h5 className="text-xs font-bold text-white truncate">{notification.title}</h5>
          <span className="text-[10px] text-slate-400 shrink-0">{notification.createdAt}</span>
        </div>
        <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
          {notification.message}
        </p>
      </div>

      {!notification.read && onMarkRead && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMarkRead(notification.id);
          }}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/5 transition-colors"
          title="Mark as read"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default NotificationItem;
