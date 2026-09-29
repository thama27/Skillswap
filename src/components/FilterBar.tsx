import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  skillFilter: string;
  onSkillChange: (skill: string) => void;
  proficiencyFilter: string;
  onProficiencyChange: (proficiency: string) => void;
  availabilityFilter: string;
  onAvailabilityChange: (avail: string) => void;
  interestFilter: string;
  onInterestChange: (interest: string) => void;
  onReset?: () => void;
  hasActiveFilters?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  skillFilter,
  onSkillChange,
  proficiencyFilter,
  onProficiencyChange,
  availabilityFilter,
  onAvailabilityChange,
  interestFilter,
  onInterestChange,
  onReset,
  hasActiveFilters,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 p-3.5 bg-[#0D0F14] border border-white/[0.08] rounded-2xl">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 px-1">
        <Filter className="w-3.5 h-3.5 text-brand-purple" />
        <span className="hidden sm:inline">Filters:</span>
      </div>

      {/* Skill Category Filter */}
      <select
        value={skillFilter}
        onChange={(e) => onSkillChange(e.target.value)}
        className="bg-[#11131A] text-slate-200 text-xs rounded-xl border border-white/10 px-3 py-2 outline-none focus:border-brand-purple hover:border-white/20"
      >
        <option value="">All Skills</option>
        <option value="Python">Python</option>
        <option value="Java">Java</option>
        <option value="SQL">SQL</option>
        <option value="UI/UX">UI/UX & Figma</option>
        <option value="Git">Git & DevOps</option>
        <option value="React">React</option>
        <option value="Machine Learning">Machine Learning</option>
      </select>

      {/* Proficiency Filter */}
      <select
        value={proficiencyFilter}
        onChange={(e) => onProficiencyChange(e.target.value)}
        className="bg-[#11131A] text-slate-200 text-xs rounded-xl border border-white/10 px-3 py-2 outline-none focus:border-brand-purple hover:border-white/20"
      >
        <option value="">All Levels</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>

      {/* Availability Filter */}
      <select
        value={availabilityFilter}
        onChange={(e) => onAvailabilityChange(e.target.value)}
        className="bg-[#11131A] text-slate-200 text-xs rounded-xl border border-white/10 px-3 py-2 outline-none focus:border-brand-purple hover:border-white/20"
      >
        <option value="">Any Availability</option>
        <option value="Weekends">Weekends</option>
        <option value="Weekdays">Weekdays</option>
        <option value="Weekday Evenings">Weekday Evenings</option>
        <option value="Saturday">Saturday</option>
      </select>

      {/* Interest Filter */}
      <select
        value={interestFilter}
        onChange={(e) => onInterestChange(e.target.value)}
        className="bg-[#11131A] text-slate-200 text-xs rounded-xl border border-white/10 px-3 py-2 outline-none focus:border-brand-purple hover:border-white/20"
      >
        <option value="">All Interests</option>
        <option value="AI">AI & Machine Learning</option>
        <option value="Web Development">Web Development</option>
        <option value="Design">UI/UX Design</option>
        <option value="DevOps">DevOps & Cloud</option>
        <option value="Data Analytics">Data Analytics</option>
      </select>

      {/* Reset Filter Button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="ml-auto inline-flex items-center gap-1.5 text-xs text-brand-purple hover:text-brand-300 transition-colors px-2 py-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
};

export default FilterBar;
