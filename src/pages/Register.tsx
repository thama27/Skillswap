import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getAllSkills } from '../services/skillService';
import Input from '../components/Input';
import Button from '../components/Button';
import SkillChip from '../components/SkillChip';

const DEFAULT_SKILLS = [
  'Java',
  'Python',
  'React',
  'JavaScript',
  'UI/UX',
  'SQL',
  'Machine Learning',
  'Data Science',
];

const AVAILABLE_INTERESTS = [
  'Artificial Intelligence',
  'Web Development',
  'UI/UX Design',
  'Data Analytics',
  'Cloud Computing',
];

const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const AVAILABILITY_OPTIONS = ['Weekdays', 'Weekends', 'Morning', 'Afternoon', 'Evening'];

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [availableSkillsList, setAvailableSkillsList] = useState<string[]>(DEFAULT_SKILLS);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [teachSkills, setTeachSkills] = useState<string[]>(['Python', 'Java']);
  const [learnSkills, setLearnSkills] = useState<string[]>(['Machine Learning', 'React']);
  const [interests, setInterests] = useState<string[]>(['Artificial Intelligence', 'Web Development']);
  const [proficiency, setProficiency] = useState('Intermediate');
  const [availability, setAvailability] = useState<string[]>(['Weekends', 'Evening']);

  useEffect(() => {
    async function loadSkills() {
      const res = await getAllSkills();
      if (res.data && res.data.length > 0) {
        setAvailableSkillsList(res.data.map((s) => s.name));
      }
    }
    loadSkills();
  }, []);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleTeachSkill = (skill: string) => {
    setTeachSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleLearnSkill = (skill: string) => {
    setLearnSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleAvailability = (item: string) => {
    setAvailability((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (teachSkills.length === 0) {
      newErrors.teachSkills = 'Select at least one skill you can teach';
    }
    if (learnSkills.length === 0) {
      newErrors.learnSkills = 'Select at least one skill you want to learn';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setGeneralError('Please resolve the highlighted form errors.');
      return;
    }

    setErrors({});
    setGeneralError('');
    setIsLoading(true);

    try {
      const res = await register({
        name: fullName.trim(),
        email: email.trim(),
        password,
        teachSkills,
        learnSkills,
        interests,
        proficiency,
        availability,
      });

      if (res.isConfirmationRequired) {
        setSuccessMessage('Registration successful! Please check your email to confirm your account or sign in.');
      } else {
        setSuccessMessage('Registration successful! Setting up your profile and redirecting to Dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      }
    } catch (err: any) {
      setGeneralError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090D] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-brand-purple/30 selection:text-white">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-purple/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purpleDark to-cyan-400 p-[1px] shadow-glow-sm">
            <div className="w-full h-full bg-[#0D0F14] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-purple group-hover:text-cyan-400 transition-colors" />
            </div>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            SkillSwap <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-cyan-400">AI</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Create Your SkillSwap Account
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Join the intelligent peer learning and skill exchange network
        </p>
      </div>

      {/* Centered Dark Form Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
        <div className="bg-[#11131A] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-card">
          {generalError && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
              {generalError}
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Credentials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="e.g. Thamayanthi"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={errors.fullName}
                icon={<User className="w-4 h-4" />}
                required
              />

              <Input
                label="Email"
                type="email"
                placeholder="thamayanthi@skillswap.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                icon={<Mail className="w-4 h-4" />}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                icon={<Lock className="w-4 h-4" />}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                icon={<Lock className="w-4 h-4" />}
                required
              />
            </div>

            {/* Section Divider */}
            <div className="border-t border-white/[0.08] pt-5">
              <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                <span>Skill Exchange Preferences</span>
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Our AI uses these attributes to calculate match compatibility
              </p>

              {/* Skills I Can Teach */}
              <div className="space-y-2 mb-5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Skills I Can Teach
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSkillsList.map((skill) => (
                    <SkillChip
                      key={skill}
                      name={skill}
                      selectable
                      selected={teachSkills.includes(skill)}
                      onSelect={() => toggleTeachSkill(skill)}
                      size="sm"
                    />
                  ))}
                </div>
                {errors.teachSkills && (
                  <p className="text-xs text-rose-400">{errors.teachSkills}</p>
                )}
              </div>

              {/* Skills I Want To Learn */}
              <div className="space-y-2 mb-5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Skills I Want To Learn
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSkillsList.map((skill) => (
                    <SkillChip
                      key={skill}
                      name={skill}
                      selectable
                      selected={learnSkills.includes(skill)}
                      onSelect={() => toggleLearnSkill(skill)}
                      size="sm"
                    />
                  ))}
                </div>
                {errors.learnSkills && (
                  <p className="text-xs text-rose-400">{errors.learnSkills}</p>
                )}
              </div>

              {/* Proficiency Level */}
              <div className="space-y-2 mb-5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Proficiency Level
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {PROFICIENCY_LEVELS.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setProficiency(level)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                        proficiency === level
                          ? 'bg-brand-purple/20 text-brand-purple border-brand-purple shadow-glow-sm'
                          : 'bg-[#0D0F14] text-slate-400 border-white/10 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Availability
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABILITY_OPTIONS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleAvailability(item)}
                      className={`py-1.5 px-3 rounded-xl text-xs font-medium border transition-all ${
                        availability.includes(item)
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                          : 'bg-[#0D0F14] text-slate-400 border-white/10 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {availability.includes(item) && '✓ '}
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Create Account
              </Button>
            </div>

            {/* Bottom Login & Home Links */}
            <div className="text-center pt-3 border-t border-white/[0.08] space-y-2">
              <p className="text-xs text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="text-brand-purple hover:underline font-bold ml-1">
                  Login here →
                </Link>
              </p>
              <div className="flex items-center justify-center gap-3 text-xs text-slate-500 pt-1">
                <Link to="/" className="hover:text-slate-300 transition-colors">
                  ← Back to Home
                </Link>
                <span>•</span>
                <Link to="/dashboard" className="hover:text-slate-300 transition-colors">
                  Go to Dashboard →
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
