import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, UserSkill, UserLearningSkill, Interest, LearningGoal, Availability } from '../types';
import {
  currentDemoUser,
  currentDemoUserSkills,
  currentDemoLearningSkills,
  currentDemoInterests,
  currentDemoGoals,
  currentDemoAvailability,
  mockMentors,
} from '../data/mockData';
import { supabase } from '../lib/supabaseClient';
import {
  registerWithSupabase,
  loginWithSupabase,
  logoutFromSupabase,
  fetchProfile,
  upsertProfile,
  mapSupabaseUserToAppUser,
} from '../services/authService';

interface RegisterData {
  name: string;
  email: string;
  password?: string;
  teachSkills?: string[];
  learnSkills?: string[];
  interests?: string[];
  proficiency?: string;
  availability?: string | string[];
}

interface AuthContextType {
  user: User | null;
  userSkills: UserSkill[];
  learningSkills: UserLearningSkill[];
  interests: Interest[];
  learningGoals: LearningGoal[];
  availability: Availability[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  loginAsDemo: () => void;
  register: (userData: RegisterData) => Promise<{ success: boolean; isConfirmationRequired?: boolean }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  addSkill: (skillName: string, proficiency?: 'Beginner' | 'Intermediate' | 'Advanced') => void;
  removeSkill: (skillId: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('skillswap_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [userSkills, setUserSkillsState] = useState<UserSkill[]>(() => {
    const saved = localStorage.getItem('skillswap_user_skills');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return currentDemoUserSkills;
      }
    }
    return currentDemoUserSkills;
  });

  const [learningSkills, setLearningSkillsState] = useState<UserLearningSkill[]>(() => {
    return currentDemoLearningSkills;
  });

  const [interests, setInterestsState] = useState<Interest[]>(() => {
    return currentDemoInterests;
  });

  const [learningGoals, setLearningGoalsState] = useState<LearningGoal[]>(() => {
    return currentDemoGoals;
  });

  const [availability, setAvailabilityState] = useState<Availability[]>(() => {
    return currentDemoAvailability;
  });

  // Detect and restore Supabase authentication session on mount
  useEffect(() => {
    let mounted = true;

    async function initSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('[AuthContext] Error getting Supabase session:', error.message);
        }

        if (session?.user && mounted) {
          const profile = await fetchProfile(session.user.id);
          const appUser = mapSupabaseUserToAppUser(session.user, profile);
          setUser(appUser);
          localStorage.setItem('skillswap_user', JSON.stringify(appUser));
        } else if (!localStorage.getItem('skillswap_user') && mounted) {
          // No active session and no saved demo user
          setUser(null);
        }
      } catch (err) {
        console.error('[AuthContext] Unexpected error checking auth session:', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initSession();

    // Listen for auth state changes (e.g. sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await fetchProfile(session.user.id);
          const appUser = mapSupabaseUserToAppUser(session.user, profile);
          setUser(appUser);
          localStorage.setItem('skillswap_user', JSON.stringify(appUser));
        } else if (event === 'SIGNED_OUT') {
          // If signed out from Supabase, remove user unless demo mode was deliberately requested
          const saved = localStorage.getItem('skillswap_user');
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (parsed.id?.startsWith('u_demo_') || parsed.id === 'u_thamayanthi') {
                return;
              }
            } catch {
              // ignore
            }
          }
          setUser(null);
          localStorage.removeItem('skillswap_user');
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loginAsDemo = useCallback(() => {
    setUser(currentDemoUser);
    setUserSkillsState(currentDemoUserSkills);
    localStorage.setItem('skillswap_user', JSON.stringify(currentDemoUser));
    localStorage.setItem('skillswap_user_skills', JSON.stringify(currentDemoUserSkills));
  }, []);

  const login = useCallback(async (email: string, password?: string): Promise<boolean> => {
    // If logging in via demo helper or no password provided, fall back to mock demo user
    if ((email.toLowerCase().includes('thamayanthi') && password === 'demo1234') || !password) {
      loginAsDemo();
      return true;
    }

    const res = await loginWithSupabase(email, password);
    if (!res.success) {
      throw new Error(res.error || 'Invalid credentials or user not found');
    }

    if (res.user) {
      setUser(res.user);
      localStorage.setItem('skillswap_user', JSON.stringify(res.user));
    }
    return true;
  }, [loginAsDemo]);

  const register = useCallback(async (userData: RegisterData): Promise<{ success: boolean; isConfirmationRequired?: boolean }> => {
    if (!userData.password) {
      throw new Error('Password is required for registration.');
    }

    const availArray = Array.isArray(userData.availability)
      ? userData.availability
      : userData.availability
      ? [userData.availability]
      : [];

    const res = await registerWithSupabase({
      fullName: userData.name,
      email: userData.email,
      password: userData.password,
      interests: userData.interests || [],
      proficiency: userData.proficiency || 'Intermediate',
      availability: availArray,
      teachSkills: userData.teachSkills || [],
      learnSkills: userData.learnSkills || [],
    });

    if (!res.success) {
      throw new Error(res.error || 'Registration failed');
    }

    if (res.user) {
      setUser(res.user);
      localStorage.setItem('skillswap_user', JSON.stringify(res.user));

      // Populate initial user skills selected during registration
      const newSkills: UserSkill[] = (userData.teachSkills || ['Python', 'Java']).map((skillName, index) => ({
        id: `us_reg_${index}_${Date.now()}`,
        userId: res.user!.id,
        skill: { id: `s_${index}`, name: skillName },
        proficiency: (userData.proficiency as any) || 'Intermediate',
        verified: true,
      }));

      setUserSkillsState(newSkills);
      localStorage.setItem('skillswap_user_skills', JSON.stringify(newSkills));
    }

    return {
      success: true,
      isConfirmationRequired: res.isConfirmationRequired,
    };
  }, []);

  const logout = useCallback(async () => {
    await logoutFromSupabase();
    setUser(null);
    localStorage.removeItem('skillswap_user');
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem('skillswap_user', JSON.stringify(updated));

      // If user has Supabase ID (valid UUID / not demo), update profiles table in Supabase
      if (updated.id && !updated.id.startsWith('u_')) {
        upsertProfile(updated.id, updated.name, updated.email);
      }

      return updated;
    });
  }, []);

  const addSkill = useCallback((skillName: string, proficiency: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate') => {
    const newSkill: UserSkill = {
      id: `us_${Date.now()}`,
      userId: user?.id || 'u_user',
      skill: { id: `s_${Date.now()}`, name: skillName },
      proficiency,
      verified: false,
    };
    setUserSkillsState(prev => {
      const updated = [...prev, newSkill];
      localStorage.setItem('skillswap_user_skills', JSON.stringify(updated));
      return updated;
    });
  }, [user]);

  const removeSkill = useCallback((skillId: string) => {
    setUserSkillsState(prev => {
      const updated = prev.filter(s => s.id !== skillId);
      localStorage.setItem('skillswap_user_skills', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userSkills,
        learningSkills,
        interests,
        learningGoals,
        availability,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginAsDemo,
        register,
        logout,
        updateProfile,
        addSkill,
        removeSkill,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
