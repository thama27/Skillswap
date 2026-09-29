import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginAsDemo } = useAuth();

  const [email, setEmail] = useState('thamayanthi@skillswap.ai');
  const [password, setPassword] = useState('demo1234');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    loginAsDemo();
    navigate('/dashboard');
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
          Welcome Back
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Enter your credentials to access your skill matches and sessions
        </p>
      </div>

      {/* Centered Dark Login Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#11131A] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="thamayanthi@skillswap.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-[#0D0F14] text-brand-purple focus:ring-brand-purple/20"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => alert('Demo project mode: Use password demo1234 or One-Click Demo Login below!')}
                className="text-brand-purple hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Login
              </Button>
            </div>
          </form>

          {/* Quick Demo Sign In Button for Project Presentation */}
          <div className="pt-2 border-t border-white/[0.08]">
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="w-full"
              onClick={handleDemoSignIn}
              icon={<UserCheck className="w-4 h-4 text-brand-purple" />}
            >
              Sign In as Demo User (Thamayanthi)
            </Button>
            <p className="text-[11px] text-center text-slate-500 mt-2">
              Instant login loaded with sample matches, sessions & certificates
            </p>
          </div>

          {/* Bottom Register & Home Links */}
          <div className="text-center pt-3 border-t border-white/[0.08] space-y-2">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-purple hover:underline font-bold ml-1">
                Create Account →
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
        </div>
      </div>
    </div>
  );
};

export default Login;
