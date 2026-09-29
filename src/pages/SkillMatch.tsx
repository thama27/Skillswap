import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sparkles, CheckCircle2, Send, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  getSkillMatchesForUser,
  sendConnectionRequest,
  getUserRequestedSkillIds,
} from '../services/matchService';
import DashboardLayout from '../components/DashboardLayout';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import MatchCard from '../components/MatchCard';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import SkillChip from '../components/SkillChip';
import EmptyState from '../components/EmptyState';
import { mockSkillMatches } from '../data/mockData';
import type { MatchResult } from '../types';

export const SkillMatch: React.FC = () => {
  const { user } = useAuth();

  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [proficiencyFilter, setProficiencyFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [interestFilter, setInterestFilter] = useState('');

  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);
  const [connectedIds, setConnectedIds] = useState<string[]>([]);
  const [connectionMessage, setConnectionMessage] = useState('');
  const [requestSentToast, setRequestSentToast] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const isSupabaseUser = user?.id && !user.id.startsWith('u_demo_') && !user.id.startsWith('u_thamayanthi');

  const loadMatches = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      if (isSupabaseUser) {
        const [matchRes, requestedSkillIds] = await Promise.all([
          getSkillMatchesForUser(user.id),
          getUserRequestedSkillIds(user.id),
        ]);

        if (matchRes.error) {
          setErrorMessage(matchRes.error);
        }

        // If real database matches exist, display them; otherwise fallback to mock for presentation
        if (matchRes.data && matchRes.data.length > 0) {
          setMatches(matchRes.data);
          // Prepopulate connected IDs based on requested skill IDs
          const alreadyRequestedMatchIds = matchRes.data
            .filter((m) => requestedSkillIds.includes(m.teachSkills[0]?.skill?.id))
            .map((m) => m.id);
          setConnectedIds(alreadyRequestedMatchIds);
        } else {
          setMatches(mockSkillMatches);
        }
      } else {
        setMatches(mockSkillMatches);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to load skill matches');
      setMatches(mockSkillMatches);
    } finally {
      setIsLoading(false);
    }
  }, [user, isSupabaseUser]);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  // Filter logic
  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesName = match.user.name.toLowerCase().includes(query);
        const matchesSkill = match.teachSkills.some((s) => s.skill.name.toLowerCase().includes(query));
        const matchesRole = (match.user.role || '').toLowerCase().includes(query);
        if (!matchesName && !matchesSkill && !matchesRole) return false;
      }

      // Skill filter
      if (skillFilter) {
        const hasSkill = match.teachSkills.some((ts) =>
          ts.skill.name.toLowerCase().includes(skillFilter.toLowerCase())
        );
        if (!hasSkill) return false;
      }

      // Proficiency filter
      if (proficiencyFilter && match.experienceLevel !== proficiencyFilter) {
        return false;
      }

      // Availability filter
      if (availabilityFilter) {
        if (!match.availabilityDays.toLowerCase().includes(availabilityFilter.toLowerCase())) {
          return false;
        }
      }

      // Interest filter
      if (interestFilter) {
        const hasInterest = match.interests.some((i) =>
          i.name.toLowerCase().includes(interestFilter.toLowerCase())
        );
        if (!hasInterest) return false;
      }

      return true;
    });
  }, [matches, searchTerm, skillFilter, proficiencyFilter, availabilityFilter, interestFilter]);

  const hasActiveFilters = Boolean(
    searchTerm || skillFilter || proficiencyFilter || availabilityFilter || interestFilter
  );

  const handleResetFilters = () => {
    setSearchTerm('');
    setSkillFilter('');
    setProficiencyFilter('');
    setAvailabilityFilter('');
    setInterestFilter('');
  };

  const handleConnect = async (match: MatchResult) => {
    if (!user?.id) return;

    if (connectedIds.includes(match.id)) {
      setConnectedIds((prev) => prev.filter((id) => id !== match.id));
      return;
    }

    if (isSupabaseUser && match.teachSkills[0]?.skill?.id) {
      setIsConnecting(true);
      try {
        const res = await sendConnectionRequest({
          learnerId: user.id,
          teacherId: match.user.id,
          skillId: match.teachSkills[0].skill.id,
        });

        if (res.isDuplicate) {
          setRequestSentToast(`Connection request already sent to ${match.user.name}.`);
        } else {
          setRequestSentToast(`Connected with ${match.user.name}! Request recorded.`);
        }
        setConnectedIds((prev) => [...prev, match.id]);
      } catch (err: any) {
        setRequestSentToast(`Failed to send request: ${err.message}`);
      } finally {
        setIsConnecting(false);
        setTimeout(() => setRequestSentToast(null), 3500);
      }
    } else {
      setConnectedIds((prev) => [...prev, match.id]);
      setRequestSentToast(`Connected with ${match.user.name}!`);
      setTimeout(() => setRequestSentToast(null), 3500);
    }
  };

  const handleSendConnectionRequestModal = async () => {
    if (!selectedMatch || !user?.id) return;

    if (isSupabaseUser && selectedMatch.teachSkills[0]?.skill?.id) {
      setIsConnecting(true);
      try {
        const res = await sendConnectionRequest({
          learnerId: user.id,
          teacherId: selectedMatch.user.id,
          skillId: selectedMatch.teachSkills[0].skill.id,
        });

        if (res.isDuplicate) {
          setRequestSentToast(`Connection request already pending for ${selectedMatch.user.name}.`);
        } else {
          setRequestSentToast(`Connection request sent to ${selectedMatch.user.name}!`);
        }
        if (!connectedIds.includes(selectedMatch.id)) {
          setConnectedIds((prev) => [...prev, selectedMatch.id]);
        }
      } catch (err: any) {
        setRequestSentToast(`Error sending request: ${err.message}`);
      } finally {
        setIsConnecting(false);
        setTimeout(() => setRequestSentToast(null), 3500);
        setSelectedMatch(null);
        setConnectionMessage('');
      }
    } else {
      if (!connectedIds.includes(selectedMatch.id)) {
        setConnectedIds((prev) => [...prev, selectedMatch.id]);
      }
      setRequestSentToast(`Connection request sent to ${selectedMatch.user.name}!`);
      setTimeout(() => setRequestSentToast(null), 3500);
      setSelectedMatch(null);
      setConnectionMessage('');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Toast Alert */}
        {requestSentToast && (
          <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-[#11131A] border border-emerald-500/50 shadow-2xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{requestSentToast}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Page Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-white/[0.05]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Find Your Skill Match
              </h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-medium">
                AI Powered
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Connect with vetted mentors and peer learners ranked by learning compatibility.
            </p>
          </div>

          <span className="text-xs text-slate-400">
            <strong className="text-white">{filteredMatches.length}</strong> matches found
          </span>
        </div>

        {/* Search Bar */}
        <div className="w-full">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search for a skill (e.g. Python, Java, SQL, React)..."
          />
        </div>

        {/* Filters Bar */}
        <FilterBar
          skillFilter={skillFilter}
          onSkillChange={setSkillFilter}
          proficiencyFilter={proficiencyFilter}
          onProficiencyChange={setProficiencyFilter}
          availabilityFilter={availabilityFilter}
          onAvailabilityChange={setAvailabilityFilter}
          interestFilter={interestFilter}
          onInterestChange={setInterestFilter}
          hasActiveFilters={hasActiveFilters}
          onReset={handleResetFilters}
        />

        {/* Matches Grid or Loading State */}
        {isLoading ? (
          <div className="bg-[#11131A] border border-white/[0.08] rounded-2xl p-16 text-center shadow-card">
            <Loader2 className="w-7 h-7 text-brand-purple animate-spin mx-auto mb-2.5" />
            <p className="text-xs text-slate-300 font-semibold">Finding matching peers in Supabase...</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Comparing skills, proficiencies, interests, and schedules</p>
          </div>
        ) : filteredMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                isConnected={connectedIds.includes(match.id)}
                onViewProfile={(m) => setSelectedMatch(m)}
                onConnect={handleConnect}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Matches Found"
            description="Try loosening your search term or adjusting filter options to find more skill peers."
            actionLabel="Reset Filters"
            onAction={handleResetFilters}
          />
        )}
      </div>

      {/* MATCH DETAILS MODAL (Section 8 Requirement) */}
      {selectedMatch && (
        <Modal
          isOpen={!!selectedMatch}
          onClose={() => setSelectedMatch(null)}
          title={`Match Details • ${selectedMatch.user.name}`}
          subtitle={`${selectedMatch.user.role || 'Skill Mentor'} • ${selectedMatch.matchPercentage}% Compatibility`}
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-400">
                Status: {connectedIds.includes(selectedMatch.id) ? 'Connected' : 'Not Connected'}
              </span>
              <Button
                variant={connectedIds.includes(selectedMatch.id) ? 'outline' : 'primary'}
                size="sm"
                onClick={handleSendConnectionRequestModal}
                isLoading={isConnecting}
                icon={<Send className="w-3.5 h-3.5" />}
              >
                {connectedIds.includes(selectedMatch.id) ? 'Request Already Sent' : 'Send Connection Request'}
              </Button>
            </div>
          }
        >
          <div className="space-y-5">
            {/* Profile Overview Card */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0D0F14] border border-white/[0.06]">
              <Avatar
                src={selectedMatch.user.avatar}
                name={selectedMatch.user.name}
                size="lg"
                verified={selectedMatch.user.verified}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-white truncate">{selectedMatch.user.name}</h4>
                  {selectedMatch.user.verified && (
                    <span className="text-[10px] text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded-full border border-brand-purple/30">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-brand-purple font-medium">{selectedMatch.user.education || 'Master of Technology'}</p>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{selectedMatch.user.bio}</p>
              </div>
            </div>

            {/* Why This Match Works */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-brand-purple/15 to-brand-500/10 border border-brand-purple/30">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-purple mb-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
                <span>Why This Match Works</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed italic">
                "{selectedMatch.matchInsight}"
              </p>
            </div>

            {/* Compatibility Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="p-2.5 rounded-xl bg-[#0D0F14] border border-white/[0.05]">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Overall Match</p>
                <p className="text-base font-extrabold text-brand-purple mt-0.5">{selectedMatch.matchPercentage}%</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0D0F14] border border-white/[0.05]">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Skills Fit</p>
                <p className="text-base font-extrabold text-cyan-400 mt-0.5">{selectedMatch.skillCompatibility || 95}%</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0D0F14] border border-white/[0.05]">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Interests</p>
                <p className="text-base font-extrabold text-emerald-400 mt-0.5">{selectedMatch.interestCompatibility || 92}%</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0D0F14] border border-white/[0.05]">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Availability</p>
                <p className="text-base font-extrabold text-amber-400 mt-0.5">{selectedMatch.availabilityCompatibility || 90}%</p>
              </div>
            </div>

            {/* Skills & Experience */}
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Skills Offered (Teaching)
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedMatch.teachSkills.map((ts) => (
                    <SkillChip
                      key={ts.id}
                      name={ts.skill.name}
                      proficiency={ts.proficiency}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Interests
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMatch.interests.map((int) => (
                    <Badge key={int.id} color="purple" size="sm">
                      {int.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Availability Schedule
                </p>
                <p className="text-xs text-slate-300 font-medium">
                  {selectedMatch.availabilityDays}
                </p>
              </div>
            </div>

            {/* Optional Intro Message */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Personalized Message (Optional)
              </label>
              <textarea
                value={connectionMessage}
                onChange={(e) => setConnectionMessage(e.target.value)}
                placeholder={`Hi ${selectedMatch.user.name}, I would love to connect for ${selectedMatch.skill} collaborative learning!`}
                rows={2}
                className="w-full bg-[#0D0F14] text-xs text-slate-100 rounded-xl border border-white/10 p-3 outline-none focus:border-brand-purple resize-none"
              />
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default SkillMatch;
