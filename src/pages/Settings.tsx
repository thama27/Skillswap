import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Bell,
  Palette,
  Shield,
  Lock,
  LogOut,
  CheckCircle2,
  Save,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/Button';
import Input from '../components/Input';
import Badge from '../components/Badge';
import Modal from '../components/Modal';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState<'account' | 'notifications' | 'appearance' | 'privacy' | 'security'>('account');
  const [name, setName] = useState(user?.name || 'Thamayanthi');
  const [email, setEmail] = useState(user?.email || 'thamayanthi@skillswap.ai');

  // Notification toggles
  const [notifMatches, setNotifMatches] = useState(true);
  const [notifSessions, setNotifSessions] = useState(true);
  const [notifCerts, setNotifCerts] = useState(true);

  // Appearance
  const [selectedAccent, setSelectedAccent] = useState('purple');

  // Privacy toggles
  const [publicProfile, setPublicProfile] = useState(true);
  const [showEmail, setShowEmail] = useState(false);

  // Logout modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email });
    triggerToast('Account settings saved successfully!');
  };

  const handleLogoutConfirm = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-[#11131A] border border-emerald-500/50 shadow-2xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="pb-2 border-b border-white/[0.05]">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Settings
            </h1>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-medium">
              Preferences
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure your account settings, notification preferences, privacy, and security.
          </p>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#11141D] border border-white/[0.07] rounded-lg">
          <button
            onClick={() => setActiveSubTab('account')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeSubTab === 'account'
                ? 'bg-white/[0.08] text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Account</span>
          </button>

          <button
            onClick={() => setActiveSubTab('notifications')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeSubTab === 'notifications'
                ? 'bg-white/[0.08] text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Notifications</span>
          </button>

          <button
            onClick={() => setActiveSubTab('appearance')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeSubTab === 'appearance'
                ? 'bg-white/[0.08] text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Appearance</span>
          </button>

          <button
            onClick={() => setActiveSubTab('privacy')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeSubTab === 'privacy'
                ? 'bg-white/[0.08] text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Privacy</span>
          </button>

          <button
            onClick={() => setActiveSubTab('security')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeSubTab === 'security'
                ? 'bg-white/[0.08] text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Security</span>
          </button>
        </div>

        {/* SETTINGS CONTENT CARDS */}
        <div className="space-y-6">
          {/* 1. ACCOUNT CARD */}
          {activeSubTab === 'account' && (
            <div className="bg-[#11131A] border border-white/[0.08] rounded-2xl p-6 shadow-card space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Account Information</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update your contact email and display name for mentorship sessions
                </p>
              </div>

              <form onSubmit={handleSaveAccount} className="space-y-4 max-w-md">
                <Input
                  label="Display Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Button
                  type="submit"
                  size="sm"
                  icon={<Save className="w-3.5 h-3.5" />}
                >
                  Save Changes
                </Button>
              </form>
            </div>
          )}

          {/* 2. NOTIFICATIONS CARD */}
          {activeSubTab === 'notifications' && (
            <div className="bg-[#11131A] border border-white/[0.08] rounded-2xl p-6 shadow-card space-y-5">
              <div>
                <h3 className="text-base font-bold text-white">Notification Preferences</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select which activity events trigger notifications
                </p>
              </div>

              <div className="divide-y divide-white/[0.06] space-y-3">
                <div className="flex items-center justify-between pt-3">
                  <div>
                    <h5 className="text-xs font-bold text-white">New AI Skill Matches</h5>
                    <p className="text-[11px] text-slate-400">Get notified when high-compatibility mentors are discovered</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifMatches}
                    onChange={(e) => setNotifMatches(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-purple bg-[#0D0F14] border-white/20"
                  />
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <h5 className="text-xs font-bold text-white">Session Reminders</h5>
                    <p className="text-[11px] text-slate-400">Receive alerts 30 minutes before video learning calls</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifSessions}
                    onChange={(e) => setNotifSessions(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-purple bg-[#0D0F14] border-white/20"
                  />
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <h5 className="text-xs font-bold text-white">Certificate Issuance</h5>
                    <p className="text-[11px] text-slate-400">Alerts when newly earned credentials have been verified</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifCerts}
                    onChange={(e) => setNotifCerts(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-purple bg-[#0D0F14] border-white/20"
                  />
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => triggerToast('Notification preferences updated!')}
              >
                Save Preferences
              </Button>
            </div>
          )}

          {/* 3. APPEARANCE CARD */}
          {activeSubTab === 'appearance' && (
            <div className="bg-[#11131A] border border-white/[0.08] rounded-2xl p-6 shadow-card space-y-5">
              <div>
                <h3 className="text-base font-bold text-white">Interface Appearance</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Theme settings and accent highlights
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Theme Mode
                </p>
                <div className="inline-flex items-center gap-2 p-1.5 rounded-xl bg-[#0D0F14] border border-white/10">
                  <span className="px-4 py-1.5 rounded-lg bg-brand-purple/20 text-white font-semibold text-xs border border-brand-purple/40">
                    Dark SaaS Mode (Active)
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Accent Color
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedAccent('purple')}
                    className={`w-9 h-9 rounded-xl bg-purple-600 border-2 transition-all ${
                      selectedAccent === 'purple' ? 'border-white scale-110 shadow-glow' : 'border-transparent opacity-70'
                    }`}
                  />
                  <button
                    onClick={() => setSelectedAccent('cyan')}
                    className={`w-9 h-9 rounded-xl bg-cyan-500 border-2 transition-all ${
                      selectedAccent === 'cyan' ? 'border-white scale-110 shadow-glow-cyan' : 'border-transparent opacity-70'
                    }`}
                  />
                  <button
                    onClick={() => setSelectedAccent('blue')}
                    className={`w-9 h-9 rounded-xl bg-blue-600 border-2 transition-all ${
                      selectedAccent === 'blue' ? 'border-white scale-110' : 'border-transparent opacity-70'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. PRIVACY CARD */}
          {activeSubTab === 'privacy' && (
            <div className="bg-[#11131A] border border-white/[0.08] rounded-2xl p-6 shadow-card space-y-5">
              <div>
                <h3 className="text-base font-bold text-white">Privacy & Visibility</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage how your profile appears to other learners
                </p>
              </div>

              <div className="divide-y divide-white/[0.06] space-y-3">
                <div className="flex items-center justify-between pt-3">
                  <div>
                    <h5 className="text-xs font-bold text-white">Discoverable in Skill Match</h5>
                    <p className="text-[11px] text-slate-400">Allow other students to find you based on skills you teach</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={publicProfile}
                    onChange={(e) => setPublicProfile(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-purple bg-[#0D0F14] border-white/20"
                  />
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <h5 className="text-xs font-bold text-white">Show Email to Matched Mentors</h5>
                    <p className="text-[11px] text-slate-400">Display your email address to confirmed connections</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={showEmail}
                    onChange={(e) => setShowEmail(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-purple bg-[#0D0F14] border-white/20"
                  />
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => triggerToast('Privacy settings saved!')}
              >
                Save Privacy Settings
              </Button>
            </div>
          )}

          {/* 5. SECURITY CARD */}
          {activeSubTab === 'security' && (
            <div className="bg-[#11131A] border border-white/[0.08] rounded-2xl p-6 shadow-card space-y-5">
              <div>
                <h3 className="text-base font-bold text-white">Security Settings</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update password and account protection
                </p>
              </div>

              <div className="space-y-4 max-w-md">
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="••••••••"
                />
                <Input
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                />
                <Button
                  size="sm"
                  onClick={() => triggerToast('Password updated successfully!')}
                >
                  Update Password
                </Button>
              </div>
            </div>
          )}

          {/* LOGOUT DANGER CARD (Always accessible at bottom) */}
          <div className="bg-[#11131A] border border-rose-500/20 rounded-2xl p-6 shadow-card flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-rose-400">Sign Out of SkillSwap AI</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                End your active session on this device
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowLogoutModal(true)}
              icon={<LogOut className="w-3.5 h-3.5" />}
            >
              Log Out
            </Button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <Modal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          title="Confirm Sign Out"
          subtitle="Are you sure you want to log out?"
          maxWidth="sm"
          footer={
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleLogoutConfirm}>
                Yes, Sign Out
              </Button>
            </div>
          }
        >
          <p className="text-xs text-slate-300">
            You will be redirected to the login screen. You can log right back in anytime using 1-Click Demo Login.
          </p>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default Settings;
