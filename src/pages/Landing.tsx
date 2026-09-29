import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Users,
  Video,
  Award,
  Briefcase,
  CheckCircle,
  ShieldCheck,
  Calendar,
  Code,
  Palette,
  ExternalLink,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Avatar from '../components/Avatar';
import Modal from '../components/Modal';
import { mockCertificates } from '../data/mockData';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCert, setSelectedCert] = useState<typeof mockCertificates[0] | null>(null);

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col font-sans selection:bg-indigo-600/30 selection:text-white">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-indigo-300 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI-Powered Skill Exchange</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
                Learn. Teach. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200">
                  Grow Together.
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                SkillSwap AI connects learners with people who can teach the skills they want to master,
                using AI-based matching based on skills, interests, goals, proficiency and availability.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
                <Button
                  size="md"
                  onClick={() => navigate('/skill-match')}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Find Your Skill Match
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => navigate('/dashboard')}
                >
                  Explore Skills
                </Button>
              </div>

              {/* Minimal Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
                  Verified Profiles
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
                  Smart AI Matching
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
                  Verified Certificates
                </span>
              </div>
            </div>

            {/* Right Hero Visual: Clean Minimal Preview */}
            <div className="lg:col-span-5">
              <div className="bg-[#11141D] border border-white/[0.08] rounded-xl p-5 shadow-xl space-y-4 max-w-sm mx-auto">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-xs">
                  <span className="font-semibold text-slate-300">Live AI Match</span>
                  <Badge color="purple" size="sm">95% Match</Badge>
                </div>

                {/* Match Progress */}
                <div className="p-3 rounded-lg bg-[#0D0F16] border border-white/[0.05] space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Compatibility Score</span>
                    <span className="font-bold text-indigo-400">95%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full w-[95%] rounded-full" />
                  </div>
                </div>

                {/* Mentor Preview */}
                <div className="p-3 rounded-lg bg-[#0D0F16] border border-white/[0.05] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80"
                      name="Priya"
                      size="sm"
                      verified={true}
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">Priya</h4>
                      <p className="text-[11px] text-slate-400">Python Mentor</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400">Weekends</span>
                </div>

                {/* Quick Indicators */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#0D0F16] border border-white/[0.05]">
                    <span className="text-[10px] text-slate-500 block">Recommended</span>
                    <span className="font-semibold text-white">Python & AI</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0D0F16] border border-white/[0.05]">
                    <span className="text-[10px] text-slate-500 block">Target Role</span>
                    <span className="font-semibold text-white">Software Dev</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION (4 CARDS) ===== */}
      <section className="py-16 bg-[#0B0D14] border-y border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
              Core Capabilities
            </h2>
            <h3 className="text-2xl font-bold text-white">
              Platform Features
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-[#11141D] border border-white/[0.07] rounded-xl p-5 hover:border-white/20 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-3.5">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">1. AI Skill Matching</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect learners with suitable skill partners based on mutual goals and availability.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#11141D] border border-white/[0.07] rounded-xl p-5 hover:border-white/20 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-3.5">
                <Video className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">2. Learning Sessions</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect matched users for online learning sessions with schedule tracking.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#11141D] border border-white/[0.07] rounded-xl p-5 hover:border-white/20 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-3.5">
                <Award className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">3. Digital Certificates</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive verified certificates after completing peer learning activities.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#11141D] border border-white/[0.07] rounded-xl p-5 hover:border-white/20 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-3.5">
                <Briefcase className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">4. Career Recommendations</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Get suitable career role suggestions based on verified skills and interests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS (4 STEPS) ===== */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
              Process
            </h2>
            <h3 className="text-2xl font-bold text-white">
              How It Works
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#11141D] border border-white/[0.07] rounded-xl p-5">
              <span className="text-xs font-bold text-indigo-400 font-mono block mb-2">01</span>
              <h4 className="text-sm font-bold text-white mb-1">Create Profile</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Set up your student profile and availability.
              </p>
            </div>

            <div className="bg-[#11141D] border border-white/[0.07] rounded-xl p-5">
              <span className="text-xs font-bold text-indigo-400 font-mono block mb-2">02</span>
              <h4 className="text-sm font-bold text-white mb-1">Add Skills & Interests</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                List skills you can teach and topics you want to learn.
              </p>
            </div>

            <div className="bg-[#11141D] border border-white/[0.07] rounded-xl p-5">
              <span className="text-xs font-bold text-indigo-400 font-mono block mb-2">03</span>
              <h4 className="text-sm font-bold text-white mb-1">Get AI Skill Matches</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Review compatibility scores and connect with matched peers.
              </p>
            </div>

            <div className="bg-[#11141D] border border-white/[0.07] rounded-xl p-5">
              <span className="text-xs font-bold text-indigo-400 font-mono block mb-2">04</span>
              <h4 className="text-sm font-bold text-white mb-1">Learn, Certify & Grow</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Participate in learning sessions and earn credentials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CAREER SECTION ===== */}
      <section className="py-16 bg-[#0B0D14] border-y border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
              Career Recommendations
            </h2>
            <h3 className="text-2xl font-bold text-white mb-1">
              Role Guidance
            </h3>
            <p className="text-xs text-slate-500">
              Personalized career guidance feature (not a job application board).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {/* Example 1 */}
            <div className="bg-[#11141D] border border-white/[0.07] rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Software Developer</span>
                <Badge color="purple" size="sm">92% Match</Badge>
              </div>
              <p className="text-xs text-slate-400">
                <strong className="text-slate-300">Your Skills:</strong> Python, Java, SQL
              </p>
              <div className="p-3 rounded-lg bg-[#0D0F16] border border-white/[0.05] text-xs text-slate-300 leading-relaxed">
                <strong>Why:</strong> Your programming skills and technical interests align with software development roles.
              </div>
            </div>

            {/* Example 2 */}
            <div className="bg-[#11141D] border border-white/[0.07] rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">UI/UX Designer</span>
                <Badge color="cyan" size="sm">84% Match</Badge>
              </div>
              <p className="text-xs text-slate-400">
                <strong className="text-slate-300">Your Skills:</strong> UI/UX, Figma, Design Interest
              </p>
              <div className="p-3 rounded-lg bg-[#0D0F16] border border-white/[0.05] text-xs text-slate-300 leading-relaxed">
                <strong>Why:</strong> Your visual design interest and prototyping skills fit UI/UX product design pathways.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CERTIFICATION SECTION ===== */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
              Verified Credential
            </h2>
            <h3 className="text-2xl font-bold text-white">
              Digital Certificates
            </h3>
          </div>

          <div className="max-w-md mx-auto">
            {/* Clean Certificate Preview Card */}
            <div className="bg-[#11141D] border border-white/[0.08] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-xs">
                <span className="font-bold text-white">SkillSwap AI</span>
                <span className="text-[11px] text-slate-400">Certificate of Completion</span>
              </div>

              <div className="py-2 text-center space-y-1">
                <p className="text-[11px] text-slate-400">Awarded to</p>
                <h4 className="text-lg font-bold text-white">Thamayanthi</h4>
                <p className="text-[11px] text-slate-400">Skill: <strong className="text-slate-200">Python Programming</strong></p>
                <p className="text-[11px] font-mono text-indigo-400">ID: SSA-2026-001</p>
              </div>

              <div className="pt-2 border-t border-white/[0.06] text-center">
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-full"
                  onClick={() => setSelectedCert(mockCertificates[0])}
                  icon={<ExternalLink className="w-3.5 h-3.5" />}
                >
                  View Certificate
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-16 bg-[#0B0D14] border-t border-white/[0.06] text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Start Learning With the Right Skill Partner.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
            Join the community of students and mentors exchanging practical knowledge.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Button
              size="md"
              onClick={() => navigate('/register')}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Get Started
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-8 bg-[#090A0F] border-t border-white/[0.06] text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-white">SkillSwap AI</span>
            <span className="mx-2">•</span>
            <span>Learn. Teach. Grow Together.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/skill-match" className="hover:text-white transition-colors">Skill Match</Link>
            <Link to="/certificates" className="hover:text-white transition-colors">Certificates</Link>
            <Link to="/career" className="hover:text-white transition-colors">Career</Link>
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </footer>

      {/* Certificate Modal */}
      {selectedCert && (
        <Modal
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
          title="Certificate of Completion"
          subtitle={`Certificate ID: ${selectedCert.certificateId}`}
          maxWidth="md"
          footer={
            <Button size="sm" onClick={() => setSelectedCert(null)}>
              Close
            </Button>
          }
        >
          <div className="p-6 rounded-xl bg-[#0D0F16] border border-white/[0.07] text-center space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              SkillSwap AI Verified
            </span>
            <div className="space-y-1">
              <p className="text-xs text-slate-400">Awarded to</p>
              <h3 className="text-xl font-bold text-white">{selectedCert.userName}</h3>
              <p className="text-xs text-slate-400">For mastering</p>
              <h4 className="text-sm font-semibold text-slate-200">{selectedCert.skillName}</h4>
            </div>

            <p className="text-xs text-slate-400 italic">
              "{selectedCert.description}"
            </p>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/[0.06] text-xs">
              <div>
                <p className="text-slate-500 text-[10px]">Mentor</p>
                <p className="text-white font-medium">{selectedCert.mentorName}</p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px]">Completion</p>
                <p className="text-white font-medium">{selectedCert.completionDate}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Landing;
