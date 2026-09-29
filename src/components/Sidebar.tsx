import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Video,
  Award,
  Briefcase,
  User,
  Settings,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Avatar from './Avatar';

export const Sidebar: React.FC = () => {
  const { user, userSkills } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/skill-match', label: 'Skill Match', icon: <Users className="w-4 h-4" />, badge: '5' },
    { to: '/sessions', label: 'Sessions', icon: <Video className="w-4 h-4" />, badge: '1' },
    { to: '/certificates', label: 'Certificates', icon: <Award className="w-4 h-4" /> },
    { to: '/career', label: 'Career', icon: <Briefcase className="w-4 h-4" /> },
  ];

  const secondaryItems = [
    { to: '/profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { to: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-60 shrink-0 hidden lg:flex flex-col justify-between min-h-[calc(100vh-3.5rem)] p-4 bg-[#090A0F] border-r border-white/[0.07]">
      <div className="space-y-6">
        {/* User Mini Profile Header */}
        {user && (
          <div className="p-3 rounded-xl bg-[#11141D] border border-white/[0.07]">
            <div className="flex items-center gap-3">
              <Avatar
                src={user.avatar}
                name={user.name}
                size="sm"
                verified={user.verified}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <p className="text-[11px] text-slate-400 truncate">
                  {user.education || 'B.Tech IT'}
                </p>
              </div>
            </div>

            <div className="mt-2.5 pt-2.5 border-t border-white/[0.05] grid grid-cols-3 gap-1 text-center text-xs">
              <div>
                <p className="font-bold text-white">{userSkills.length || 8}</p>
                <p className="text-[10px] text-slate-500">Skills</p>
              </div>
              <div>
                <p className="font-bold text-indigo-400">5</p>
                <p className="text-[10px] text-slate-500">Matches</p>
              </div>
              <div>
                <p className="font-bold text-slate-300">2</p>
                <p className="text-[10px] text-slate-500">Certs</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Platform
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                  isActive
                    ? 'bg-white/[0.08] text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <span className="text-slate-400">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-medium">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Secondary Account Navigation */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Preferences
          </p>
          {secondaryItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                  isActive
                    ? 'bg-white/[0.08] text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                }`
              }
            >
              <span className="text-slate-400">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Clean Compact Mentorship Card */}
      <div className="p-3 rounded-xl bg-[#11141D] border border-white/[0.06] text-xs">
        <div className="flex items-center gap-2 mb-1 text-indigo-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-semibold text-[11px] text-white">AI Skill Matching</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">
          Priya is ready to exchange Python for React.
        </p>
        <NavLink
          to="/skill-match"
          className="block text-center text-[11px] font-medium py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white transition-colors"
        >
          View Match
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
