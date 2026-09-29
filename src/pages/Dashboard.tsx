import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code,
  Users,
  Video,
  Award,
  Sparkles,
  Calendar,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  Plus,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  getDashboardStats,
  getUpcomingSession,
  type DashboardStatsData,
  type UpcomingSessionData,
} from '../services/dashboardService';
import {
  getUserSkills,
  addUserSkillByName,
  type UserSkillRecord,
} from '../services/skillService';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import SkillChip from '../components/SkillChip';
import MatchCard from '../components/MatchCard';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import {
  mockSkillMatches,
  mockSessions,
  mockCareerPaths,
  mockDashboardStats,
} from '../data/mockData';
import type { MatchResult } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, userSkills, addSkill } = useAuth();

  const [stats, setStats] = useState<DashboardStatsData>({
    skillsCount: 0,
    matchesCount: 0,
    sessionsCount: 0,
    certificatesCount: 0,
  });
  const [dbUserSkills, setDbUserSkills] = useState<UserSkillRecord[]>([]);
  const [dbUpcomingSession, setDbUpcomingSession] = useState<UpcomingSessionData | null>(null);

  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newSkillProficiency, setNewSkillProficiency] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  const isSupabaseUser = user?.id && !user.id.startsWith('u_demo_') && !user.id.startsWith('u_thamayanthi');

  const loadDashboardData = useCallback(async () => {
    if (!user?.id) return;

    if (isSupabaseUser) {
      const [fetchedStats, fetchedSkills, fetchedSession] = await Promise.all([
        getDashboardStats(user.id),
        getUserSkills(user.id),
        getUpcomingSession(user.id),
      ]);

      setStats(fetchedStats);
      setDbUserSkills(fetchedSkills.data || []);
      setDbUpcomingSession(fetchedSession);
    } else {
      // Demo fallback values
      setStats({
        skillsCount: userSkills.length || mockDashboardStats.skillsCount,
        matchesCount: mockDashboardStats.matchesCount,
        sessionsCount: mockDashboardStats.sessionsCount,
        certificatesCount: mockDashboardStats.certificatesCount,
      });
    }
  }, [user, isSupabaseUser, userSkills]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const defaultMockSession = mockSessions.find((s) => s.status === 'Upcoming') || mockSessions[0];
  const upcomingSession = dbUpcomingSession || defaultMockSession;
  const primaryCareer = mockCareerPaths[0]; // Software Developer

  const handleAddSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSkillInput.trim();
    if (!trimmed || !user?.id) return;

    setIsAddingSkill(true);
    try {
      if (isSupabaseUser) {
        await addUserSkillByName(user.id, trimmed, 'teach', newSkillProficiency);
        await loadDashboardData();
      } else {
        addSkill(trimmed, newSkillProficiency);
      }
      setNewSkillInput('');
      setShowAddSkillModal(false);
    } catch (err) {
      console.error('Error adding skill from dashboard:', err);
    } finally {
      setIsAddingSkill(false);
    }
  };

  // Determine which skills list to display in My Skills section
  const displayedSkills = isSupabaseUser && dbUserSkills.length > 0
    ? dbUserSkills.map((s) => ({
        id: s.id,
        name: s.skills?.name || 'Skill',
        proficiency: s.proficiency || 'Intermediate',
      }))
    : userSkills.map((us) => ({
        id: us.id,
        name: us.skill.name,
        proficiency: us.proficiency,
      }));

  return (
    <DashboardLayout>
      <div className="space-y-7 max-w-6xl">
        {/* Clean Header Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-white/[0.05]">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Good morning, {user?.name || 'Learner'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Here is your SkillSwap learning overview.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAddSkillModal(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Skill
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/skill-match')}
              icon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Find Matches
            </Button>
          </div>
        </div>

        {/* 4 Summary Stat Cards (Section 7) connected to real Supabase counts */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Skills"
            value={stats.skillsCount}
            subtext="In your profile"
            icon={<Code className="w-4 h-4" />}
            color="purple"
            onClick={() => navigate('/profile')}
          />
          <StatCard
            label="Matches"
            value={stats.matchesCount}
            subtext="AI-compatible peers"
            icon={<Users className="w-4 h-4" />}
            color="cyan"
            onClick={() => navigate('/skill-match')}
          />
          <StatCard
            label="Sessions"
            value={stats.sessionsCount}
            subtext={stats.sessionsCount > 0 ? `${stats.sessionsCount} scheduled` : '0 scheduled'}
            icon={<Video className="w-4 h-4" />}
            color="blue"
            onClick={() => navigate('/sessions')}
          />
          <StatCard
            label="Certificates"
            value={stats.certificatesCount}
            subtext="Verified credentials"
            icon={<Award className="w-4 h-4" />}
            color="emerald"
            onClick={() => navigate('/certificates')}
          />
        </div>

        {/* MY SKILLS SECTION */}
        <div className="bg-[#11141D] border border-white/[0.07] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                My Skills ({displayedSkills.length})
              </h3>
            </div>
            <button
              onClick={() => setShowAddSkillModal(true)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {displayedSkills.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No skills added yet. Click "+ Add" above to start!</p>
            ) : (
              displayedSkills.map((us) => (
                <SkillChip
                  key={us.id}
                  name={us.name}
                  proficiency={us.proficiency as any}
                  size="sm"
                />
              ))
            )}
          </div>
        </div>

        {/* 2-COLUMN SECTION: RECOMMENDED MATCHES + UPCOMING/CAREER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: RECOMMENDED MATCHES (8 cols) */}
          <div className="lg:col-span-8 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Recommended Matches
              </h3>
              <button
                onClick={() => navigate('/skill-match')}
                className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>View all ({mockSkillMatches.length})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Recommended match preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mockSkillMatches.slice(0, 2).map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onViewProfile={(m) => setSelectedMatch(m)}
                  onConnect={(m) => alert(`Connection request sent to ${m.user.name}!`)}
                />
              ))}
            </div>
          </div>

          {/* Right Column: UPCOMING SESSION & CAREER RECOMMENDATION (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* UPCOMING SESSION */}
            <div className="bg-[#11141D] border border-white/[0.07] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <Video className="w-3.5 h-3.5 text-indigo-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Upcoming Session
                  </h4>
                </div>
                <Badge color="purple" size="sm">Upcoming</Badge>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white">
                  {upcomingSession.title}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  With <strong className="text-slate-200">{upcomingSession.mentorName}</strong>
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-400 mt-2.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {upcomingSession.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {upcomingSession.time}
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => navigate('/sessions')}
                icon={<Video className="w-3.5 h-3.5" />}
              >
                Join Session
              </Button>
            </div>

            {/* CAREER RECOMMENDATION */}
            <div className="bg-[#11141D] border border-white/[0.07] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Recommended Career
                  </h4>
                </div>
                <Badge color="cyan" size="sm">{primaryCareer.matchPercentage}% Match</Badge>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white">
                  {primaryCareer.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Based on: <strong className="text-slate-200">Python + Java + SQL</strong>
                </p>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                  {primaryCareer.whyRecommended}
                </p>
              </div>

              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => navigate('/career')}
                icon={<ArrowRight className="w-3 h-3" />}
                iconPosition="right"
              >
                View Recommendation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Match Details Modal */}
      {selectedMatch && (
        <Modal
          isOpen={!!selectedMatch}
          onClose={() => setSelectedMatch(null)}
          title={`Match Details • ${selectedMatch.user.name}`}
          subtitle={`${selectedMatch.roleStatus} • ${selectedMatch.experienceLevel} Level`}
          maxWidth="lg"
          footer={
            <div className="flex items-center gap-3 w-full justify-between">
              <span className="text-xs text-slate-400">
                Compatibility: {selectedMatch.matchPercentage}%
              </span>
              <Button
                size="sm"
                onClick={() => {
                  alert(`Connection request sent to ${selectedMatch.user.name}!`);
                  setSelectedMatch(null);
                }}
                icon={<CheckCircle2 className="w-3.5 h-3.5" />}
              >
                Send Connection Request
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#0D0F16] border border-white/[0.05]">
              <Avatar
                src={selectedMatch.user.avatar}
                name={selectedMatch.user.name}
                size="lg"
                verified={selectedMatch.user.verified}
              />
              <div>
                <h4 className="text-base font-bold text-white">{selectedMatch.user.name}</h4>
                <p className="text-xs text-indigo-400 font-medium">{selectedMatch.user.role}</p>
                <p className="text-xs text-slate-400 mt-0.5">{selectedMatch.user.bio}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0D0F16] border border-white/[0.05] text-xs text-slate-300">
              <p className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-1">
                Why this match works
              </p>
              <p className="italic text-slate-300">"{selectedMatch.matchInsight}"</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Skills Offered
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedMatch.teachSkills.map((ts) => (
                  <SkillChip
                    key={ts.id}
                    name={ts.skill.name}
                    proficiency={ts.proficiency}
                    size="sm"
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-[#0D0F16] border border-white/[0.05]">
                <p className="text-slate-500 uppercase font-semibold text-[10px]">Availability</p>
                <p className="font-semibold text-white mt-0.5">{selectedMatch.availabilityDays}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0D0F16] border border-white/[0.05]">
                <p className="text-slate-500 uppercase font-semibold text-[10px]">Match Score</p>
                <p className="font-semibold text-indigo-400 mt-0.5">{selectedMatch.matchPercentage}%</p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Skill Modal */}
      {showAddSkillModal && (
        <Modal
          isOpen={showAddSkillModal}
          onClose={() => setShowAddSkillModal(false)}
          title="Add a Skill"
          subtitle="Add a skill you wish to teach or exchange"
          footer={
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowAddSkillModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddSkillSubmit}
                isLoading={isAddingSkill}
              >
                Save Skill
              </Button>
            </div>
          }
        >
          <form onSubmit={handleAddSkillSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Skill Name
              </label>
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="e.g. Next.js, Docker, Kubernetes"
                className="w-full bg-[#0D0F14] text-slate-100 text-xs rounded-lg border border-white/10 px-3 py-2 outline-none focus:border-indigo-500"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Proficiency Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setNewSkillProficiency(lvl)}
                    className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      newSkillProficiency === lvl
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-[#0D0F14] text-slate-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
