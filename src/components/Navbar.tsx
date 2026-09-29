import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  LayoutDashboard,
  Users,
  Video,
  Award,
  Briefcase,
  Bell,
  Menu,
  X,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut,
  ChevronDown,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockNotifications } from '../data/mockData';
import Avatar from './Avatar';
import Badge from './Badge';

export const Navbar: React.FC = () => {
  const { user, logout, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { to: '/skill-match', label: 'Skill Match', icon: <Users className="w-3.5 h-3.5" /> },
    { to: '/sessions', label: 'Sessions', icon: <Video className="w-3.5 h-3.5" /> },
    { to: '/certificates', label: 'Certificates', icon: <Award className="w-3.5 h-3.5" /> },
    { to: '/career', label: 'Career', icon: <Briefcase className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#090A0F]/90 backdrop-blur-md border-b border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left: Brand Logo & Title */}
          <div className="flex items-center gap-8">
            <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-brand-purple flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1">
                SkillSwap <span className="text-brand-purple font-extrabold">AI</span>
              </span>
            </Link>

            {/* Desktop Center Navigation Links */}
            {user && (
              <nav className="hidden md:flex items-center space-x-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-white/[0.08] text-white font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                      }`
                    }
                  >
                    <span>{link.label}</span>
                  </NavLink>
                ))}
              </nav>
            )}
          </div>

          {/* Right: Clean, Minimal Action Controls */}
          <div className="flex items-center gap-2.5">
            {!user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-xs font-medium text-slate-300 hover:text-white transition-colors px-2 py-1"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-1.5 rounded-lg shadow-sm transition-colors"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <>
                {/* Notifications Bell */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative w-8 h-8 rounded-lg bg-transparent hover:bg-white/[0.06] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    )}
                  </button>

                  {/* Minimalist Popover */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-[#11141D] border border-white/[0.09] rounded-xl shadow-xl overflow-hidden z-50 animate-scaleUp">
                      <div className="p-3 border-b border-white/[0.06] flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="text-[11px] text-indigo-400 hover:underline"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-72 overflow-y-auto divide-y divide-white/[0.04] p-1.5">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-2 rounded-lg text-xs transition-colors ${
                              n.read ? 'opacity-60' : 'bg-white/[0.03] text-slate-200'
                            }`}
                          >
                            <p className="font-semibold text-white text-[11px]">{n.title}</p>
                            <p className="text-slate-400 text-[11px] mt-0.5">{n.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Badge Pill */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-white/[0.05] transition-colors"
                  >
                    <Avatar
                      src={user.avatar}
                      name={user.name}
                      size="sm"
                      verified={user.verified}
                    />
                    <span className="hidden sm:inline text-xs font-medium text-slate-200">
                      {user.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Clean Profile Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-[#11141D] border border-white/[0.09] rounded-xl shadow-xl p-1 z-50 animate-scaleUp text-xs">
                      <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                        <p className="font-semibold text-white">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to="/settings"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>Settings</span>
                      </Link>

                      <div className="my-1 border-t border-white/[0.06]" />

                      <Link
                        to="/login"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <LogIn className="w-3.5 h-3.5 text-slate-400" />
                        <span>Switch Account</span>
                      </Link>

                      <Link
                        to="/register"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-slate-400" />
                        <span>Register New</span>
                      </Link>

                      <div className="my-1 border-t border-white/[0.06]" />

                      <button
                        type="button"
                        onClick={async () => {
                          await logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden w-8 h-8 rounded-lg text-slate-400 hover:text-white flex items-center justify-center"
                >
                  {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D0F16] border-b border-white/[0.08] px-4 py-4 space-y-2 animate-fadeIn text-xs">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-medium ${
                  isActive ? 'bg-white/[0.08] text-white' : 'text-slate-300 hover:bg-white/[0.04]'
                }`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
          <div className="pt-2 border-t border-white/[0.06] space-y-1">
            <Link to="/login" className="block px-3 py-1.5 text-slate-300 hover:text-white">
              Log in / Switch Account
            </Link>
            <Link to="/register" className="block px-3 py-1.5 text-indigo-400 font-medium">
              Create New Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
