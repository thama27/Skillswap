import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  Clock,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  MessageSquare,
  Users,
  Settings,
  Sparkles,
  Award,
  CheckCircle2,
  FileText,
  Plus,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  getUserSessions,
  createSession,
  updateSessionStatus,
} from '../services/sessionService';
import { supabase } from '../lib/supabaseClient';
import DashboardLayout from '../components/DashboardLayout';
import SessionCard from '../components/SessionCard';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Avatar from '../components/Avatar';
import Modal from '../components/Modal';
import Input from '../components/Input';
import EmptyState from '../components/EmptyState';
import { mockSessions } from '../data/mockData';
import type { Session } from '../types';

export const Sessions: React.FC = () => {
  const { user } = useAuth();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [activeMeetingSession, setActiveMeetingSession] = useState<Session | null>(null);

  // Schedule Session Modal State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleTitle, setScheduleTitle] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleDuration, setScheduleDuration] = useState(45);
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [availablePartners, setAvailablePartners] = useState<Array<{ id: string; name: string }>>([]);
  const [isScheduling, setIsScheduling] = useState(false);
  const [actionToast, setActionToast] = useState<string | null>(null);

  // Video call control states for the UI placeholder
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [meetingChatInput, setMeetingChatInput] = useState('');
  const [meetingMessages, setMeetingMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'Peer Mentor', text: 'Welcome to your collaborative skill session! Ready to get started?', time: '5:00 PM' },
    { sender: 'You', text: 'Yes, looking forward to the hands-on session!', time: '5:01 PM' },
  ]);

  const isSupabaseUser = user?.id && !user.id.startsWith('u_demo_') && !user.id.startsWith('u_thamayanthi');

  const loadSessionsData = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      if (isSupabaseUser) {
        const res = await getUserSessions(user.id);
        if (res.error) {
          setErrorMessage(res.error);
        }

        // Also fetch potential session partners from profiles table
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .neq('id', user.id)
          .limit(10);

        if (profiles && profiles.length > 0) {
          const partners = profiles.map((p) => ({
            id: p.id,
            name: p.full_name || p.email?.split('@')[0] || 'Peer Mentor',
          }));
          setAvailablePartners(partners);
          if (partners[0] && !selectedPartnerId) {
            setSelectedPartnerId(partners[0].id);
          }
        }

        if (res.data && res.data.length > 0) {
          setSessions(res.data);
        } else {
          // If no sessions yet in database, fall back to mock for presentation
          setSessions(mockSessions);
        }
      } else {
        setSessions(mockSessions);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to load sessions');
      setSessions(mockSessions);
    } finally {
      setIsLoading(false);
    }
  }, [user, isSupabaseUser, selectedPartnerId]);

  useEffect(() => {
    loadSessionsData();
  }, [loadSessionsData]);

  const upcomingSessions = sessions.filter((s) => s.status === 'Upcoming');
  const completedSessions = sessions.filter((s) => s.status === 'Completed');

  const handleJoinSession = (session: Session) => {
    setActiveMeetingSession(session);
  };

  const handleEndSession = async () => {
    if (activeMeetingSession && isSupabaseUser) {
      try {
        await updateSessionStatus(activeMeetingSession.id, 'completed');
        await loadSessionsData();
      } catch (err) {
        console.error('Error completing session:', err);
      }
    }
    setActiveMeetingSession(null);
  };

  const handleCreateSessionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !selectedPartnerId) return;

    setIsScheduling(true);
    try {
      const scheduledDateTime = scheduleDate ? new Date(scheduleDate).toISOString() : new Date(Date.now() + 86400000).toISOString();

      if (isSupabaseUser) {
        const res = await createSession({
          learnerId: user.id,
          teacherId: selectedPartnerId,
          title: scheduleTitle || 'Skill Mentorship Session',
          scheduledAt: scheduledDateTime,
          durationMinutes: scheduleDuration,
        });

        if (res.error) {
          setErrorMessage(res.error);
        } else {
          setActionToast('Learning session scheduled successfully in Supabase!');
          setTimeout(() => setActionToast(null), 3500);
          setShowScheduleModal(false);
          setScheduleTitle('');
          await loadSessionsData();
        }
      } else {
        // demo fallback
        const newDemoSession: Session = {
          id: `s_demo_${Date.now()}`,
          title: scheduleTitle || 'Skill Mentorship Session',
          mentorId: selectedPartnerId,
          learnerId: user.id,
          mentorName: availablePartners.find((p) => p.id === selectedPartnerId)?.name || 'Priya (Mentor)',
          learnerName: user.name,
          mentorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
          skillName: 'Python & AI',
          date: new Date(scheduledDateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: '4:00 PM',
          durationMinutes: scheduleDuration,
          status: 'Upcoming',
          meetingLink: `https://meet.skillswap.ai/session-${Date.now().toString(36)}`,
          notes: 'Peer learning and code exchange.',
        };
        setSessions((prev) => [newDemoSession, ...prev]);
        setShowScheduleModal(false);
        setActionToast('Learning session scheduled!');
        setTimeout(() => setActionToast(null), 3500);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to schedule session');
    } finally {
      setIsScheduling(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (meetingChatInput.trim()) {
      setMeetingMessages((prev) => [
        ...prev,
        { sender: user?.name || 'You', text: meetingChatInput.trim(), time: 'Just now' },
      ]);
      setMeetingChatInput('');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Toast Alert */}
        {actionToast && (
          <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-[#11131A] border border-emerald-500/50 shadow-2xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionToast}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-white/[0.05]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Learning Sessions
              </h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-medium">
                Mentorship
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Scheduled video mentorship meetings and completed session history.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowScheduleModal(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Schedule Session
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => upcomingSessions[0] && handleJoinSession(upcomingSessions[0])}
              icon={<Video className="w-3.5 h-3.5" />}
            >
              Quick Join
            </Button>
          </div>
        </div>

        {/* Tabs: Upcoming vs Completed */}
        <div className="flex items-center gap-1.5 p-1 bg-[#11141D] border border-white/[0.07] rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-white/[0.08] text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Upcoming ({upcomingSessions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'completed'
                ? 'bg-white/[0.08] text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed ({completedSessions.length})</span>
          </button>
        </div>

        {/* Sessions Grid or Loading */}
        {isLoading ? (
          <div className="bg-[#11131A] border border-white/[0.08] rounded-2xl p-16 text-center shadow-card">
            <Loader2 className="w-7 h-7 text-brand-purple animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-300 font-semibold">Loading sessions from Supabase...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTab === 'upcoming' ? (
              upcomingSessions.length > 0 ? (
                upcomingSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onJoin={handleJoinSession}
                  />
                ))
              ) : (
                <div className="col-span-full">
                  <EmptyState
                    title="No Upcoming Sessions"
                    description="You have no scheduled video learning calls right now. Click 'Schedule Session' above to plan one with a mentor."
                    actionLabel="Schedule Session"
                    onAction={() => setShowScheduleModal(true)}
                  />
                </div>
              )
            ) : (
              completedSessions.length > 0 ? (
                completedSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onViewDetails={(s) => alert(`Session notes for "${s.title}": ${s.notes}`)}
                  />
                ))
              ) : (
                <div className="col-span-full">
                  <EmptyState
                    title="No Completed Sessions Yet"
                    description="Your completed sessions and verified records will be logged here."
                  />
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* SCHEDULE SESSION MODAL */}
      {showScheduleModal && (
        <Modal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          title="Schedule Learning Session"
          subtitle="Set up a 1-on-1 video exchange session with a peer mentor"
          footer={
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCreateSessionSubmit}
                isLoading={isScheduling}
              >
                Schedule Call
              </Button>
            </div>
          }
        >
          <form onSubmit={handleCreateSessionSubmit} className="space-y-4">
            <Input
              label="Session Title"
              placeholder="e.g. Python Async Programming Mentorship"
              value={scheduleTitle}
              onChange={(e) => setScheduleTitle(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Select Mentor / Peer Partner
              </label>
              <select
                value={selectedPartnerId}
                onChange={(e) => setSelectedPartnerId(e.target.value)}
                className="w-full bg-[#0D0F14] text-xs text-slate-100 rounded-xl border border-white/10 p-2.5 outline-none focus:border-brand-purple"
                required
              >
                {availablePartners.length > 0 ? (
                  availablePartners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))
                ) : (
                  <option value="default_partner">Priya (Mentor - Python & AI)</option>
                )}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full bg-[#0D0F14] text-xs text-slate-100 rounded-xl border border-white/10 p-2.5 outline-none focus:border-brand-purple"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Duration (Minutes)
                </label>
                <select
                  value={scheduleDuration}
                  onChange={(e) => setScheduleDuration(Number(e.target.value))}
                  className="w-full bg-[#0D0F14] text-xs text-slate-100 rounded-xl border border-white/10 p-2.5 outline-none focus:border-brand-purple"
                >
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* CLEAN VIDEO MEETING INTERFACE PLACEHOLDER (Section 9 Requirement) */}
      {activeMeetingSession && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 sm:p-6 animate-fadeIn">
          {/* Top Meeting Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 text-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center">
                <Video className="w-5 h-5 text-brand-purple" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-tight">
                  {activeMeetingSession.title}
                </h3>
                <p className="text-xs text-slate-400">
                  Mentor: <strong className="text-slate-200">{activeMeetingSession.mentorName}</strong> • {activeMeetingSession.skillName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Session
              </span>
              <button
                onClick={() => setActiveMeetingSession(null)}
                className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20"
              >
                Minimize
              </button>
            </div>
          </div>

          {/* Meeting Stage & Video Grid */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 py-4 min-h-0">
            {/* Left 8/12: Video Feed Stage */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Peer / Mentor Video Screen */}
                <div className="relative rounded-2xl bg-[#11131A] border border-white/10 overflow-hidden flex flex-col items-center justify-center p-6 shadow-2xl">
                  <Avatar
                    src={activeMeetingSession.mentorAvatar}
                    name={activeMeetingSession.mentorName}
                    size="xl"
                    verified={true}
                  />
                  <h4 className="text-sm font-bold text-white mt-3">
                    {activeMeetingSession.mentorName} (Mentor)
                  </h4>
                  <p className="text-xs text-brand-purple">Speaking • {activeMeetingSession.skillName}</p>

                  <div className="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-[11px] text-white font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{activeMeetingSession.mentorName}</span>
                  </div>
                </div>

                {/* Current User Video Screen */}
                <div className="relative rounded-2xl bg-[#11131A] border border-white/10 overflow-hidden flex flex-col items-center justify-center p-6 shadow-2xl">
                  {isCameraOn ? (
                    <div className="flex flex-col items-center">
                      <Avatar
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
                        name={user?.name || 'You'}
                        size="xl"
                        verified={true}
                      />
                      <h4 className="text-sm font-bold text-white mt-3">
                        {user?.name || 'You'} (Learner)
                      </h4>
                      <p className="text-xs text-slate-400">Active</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-slate-500">
                      <VideoOff className="w-12 h-12 mb-2" />
                      <p className="text-xs">Camera is Off</p>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-[11px] text-white font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-purple" />
                    <span>You</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4/12: Session Chat & Notes */}
            <div className="lg:col-span-4 bg-[#11131A] border border-white/10 rounded-2xl flex flex-col overflow-hidden">
              <div className="p-3.5 border-b border-white/[0.08] flex items-center gap-2 text-white">
                <MessageSquare className="w-4 h-4 text-brand-purple" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Session Chat & Notes</h4>
              </div>

              <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
                {meetingMessages.map((msg, i) => (
                  <div key={i} className="text-xs space-y-0.5">
                    <div className="flex items-center justify-between text-slate-400 text-[10px]">
                      <span className="font-semibold text-slate-300">{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="text-slate-200 bg-[#0D0F14] p-2.5 rounded-xl border border-white/[0.05]">
                      {msg.text}
                    </p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-3 border-t border-white/[0.08] flex gap-2">
                <input
                  type="text"
                  value={meetingChatInput}
                  onChange={(e) => setMeetingChatInput(e.target.value)}
                  placeholder="Type a message or code snippet..."
                  className="flex-1 bg-[#0D0F14] text-xs text-slate-100 rounded-xl border border-white/10 px-3 py-2 outline-none focus:border-brand-purple"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-brand-purple hover:bg-brand-purpleDark text-white text-xs font-semibold"
                >
                  Send
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Meeting Controls Bar */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-4">
            {/* Microphone Toggle */}
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3.5 rounded-2xl border transition-all ${
                isMicOn
                  ? 'bg-[#161922] text-white border-white/15 hover:border-white/30'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
              }`}
              title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            {/* Camera Toggle */}
            <button
              onClick={() => setIsCameraOn(!isCameraOn)}
              className={`p-3.5 rounded-2xl border transition-all ${
                isCameraOn
                  ? 'bg-[#161922] text-white border-white/15 hover:border-white/30'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
              }`}
              title={isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
            >
              {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            {/* Screen Share Toggle */}
            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-3.5 rounded-2xl border transition-all ${
                isScreenSharing
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-[#161922] text-white border-white/15 hover:border-white/30'
              }`}
              title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
            >
              <Monitor className="w-5 h-5" />
            </button>

            {/* End Session Button */}
            <button
              onClick={handleEndSession}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 transition-all"
            >
              <PhoneOff className="w-4 h-4" />
              <span>End Session</span>
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Sessions;
