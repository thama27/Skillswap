import React, { useState } from 'react';
import {
  Briefcase,
  Sparkles,
  Check,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Target,
  BookOpen,
  UserCheck,
  Compass,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import CareerCard from '../components/CareerCard';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Badge from '../components/Badge';
import SkillChip from '../components/SkillChip';
import { mockCareerPaths } from '../data/mockData';
import { getCareerRecommendations } from '../services/careerService';
import type { CareerPath } from '../types';

export const Career: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCareer, setSelectedCareer] = useState<CareerPath | null>(null);
  const [careers, setCareers] = useState<CareerPath[]>(mockCareerPaths);
  const [userCurrentSkills, setUserCurrentSkills] = useState<string[]>(['Python', 'Java', 'SQL']);
  const [userCurrentInterests, setUserCurrentInterests] = useState<string[]>(['AI', 'Web Development']);

  React.useEffect(() => {
    getCareerRecommendations().then((res) => {
      if (res.data && res.data.length > 0) {
        setCareers(res.data);
      }
      if (res.userCurrentSkills?.length) {
        setUserCurrentSkills(res.userCurrentSkills);
      }
      if (res.userCurrentInterests?.length) {
        setUserCurrentInterests(res.userCurrentInterests);
      }
    });
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-white/[0.05]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Career Recommendations
              </h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-medium">
                AI Advisory
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Explore career roles based on your verified skills and interests.
            </p>
          </div>

          <span className="text-xs text-slate-400">
            Advisory career planning
          </span>
        </div>

        {/* YOUR SKILLS & YOUR INTERESTS (Section 11 Requirement) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* YOUR SKILLS */}
          <div className="bg-[#11141D] border border-white/[0.07] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Your Skills
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Recognized proficiencies in your profile:
            </p>
            <div className="flex flex-wrap gap-2">
              {userCurrentSkills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-brand-purple/15 text-brand-purple border border-brand-purple/30 shadow-glow-sm"
                >
                  <Check className="w-3.5 h-3.5 text-brand-purple" />
                  <span>{s}</span>
                </span>
              ))}
            </div>
          </div>

          {/* YOUR INTERESTS */}
          <div className="bg-[#11141D] border border-white/[0.07] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Your Interests
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Domains guiding our career recommendation models:
            </p>
            <div className="flex flex-wrap gap-2">
              {userCurrentInterests.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>{interest}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RECOMMENDED ROLES SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-wide uppercase">
              Recommended Roles & Gap Analysis
            </h2>
            <span className="text-xs text-slate-400">
              Ranked by weighted vector affinity
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careers.map((career) => (
              <CareerCard
                key={career.id}
                career={career}
                onViewDetails={(c) => setSelectedCareer(c)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CAREER DETAILS & ROADMAP MODAL */}
      {selectedCareer && (
        <Modal
          isOpen={!!selectedCareer}
          onClose={() => setSelectedCareer(null)}
          title={`Career Details • ${selectedCareer.title}`}
          subtitle={`${selectedCareer.matchPercentage}% Alignment • Recommended Pathway`}
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-400">
                Demand: <strong className="text-emerald-400">{selectedCareer.demandLevel || 'High'}</strong>
              </span>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedCareer(null);
                  navigate('/skill-match');
                }}
                icon={<UserCheck className="w-3.5 h-3.5" />}
              >
                Find Mentors for Skill Gaps
              </Button>
            </div>
          }
        >
          <div className="space-y-5">
            {/* Description */}
            <div className="p-4 rounded-xl bg-[#0D0F14] border border-white/[0.06]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Role Overview
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed">
                {selectedCareer.description}
              </p>
            </div>

            {/* Why This Role */}
            <div className="p-4 rounded-xl bg-brand-purple/10 border border-brand-purple/30">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-purple mb-1">
                Why this role fits you
              </p>
              <p className="text-xs text-slate-200 leading-relaxed">
                {selectedCareer.whyRecommended}
              </p>
            </div>

            {/* Comparison: Skills vs Gaps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-[#0D0F14] border border-white/[0.05]">
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Skills You Have</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCareer.userSkillsMatched.map((s) => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {s} ✓
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0D0F14] border border-white/[0.05]">
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Skills To Acquire</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCareer.skillGaps.map((sg) => (
                    <span key={sg} className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {sg}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Strategic Bridge Roadmap */}
            {selectedCareer.roadmap && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-brand-purple" />
                  <span>Skill-Bridge Roadmap</span>
                </h4>
                <div className="space-y-2">
                  {selectedCareer.roadmap.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#0D0F14] border border-white/[0.05] flex items-start gap-3 text-xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-brand-purple/20 text-brand-purple flex items-center justify-center shrink-0 font-bold font-mono text-[10px]">
                        {idx + 1}
                      </span>
                      <p className="text-slate-300 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default Career;
