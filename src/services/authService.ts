import { supabase } from '../lib/supabaseClient';
import type { User as SupabaseAuthUser, Session } from '@supabase/supabase-js';
import type { User } from '../types';

export interface AuthResponse {
  success: boolean;
  user?: User;
  session?: Session | null;
  error?: string;
  isConfirmationRequired?: boolean;
}

/**
 * Maps a Supabase user and optional database profile record to the application's User type.
 */
export function mapSupabaseUserToAppUser(
  supabaseUser: SupabaseAuthUser,
  profile?: { full_name?: string | null; email?: string | null; created_at?: string | null } | null
): User {
  const name =
    profile?.full_name ||
    supabaseUser.user_metadata?.full_name ||
    supabaseUser.email?.split('@')[0] ||
    'Member';

  return {
    id: supabaseUser.id,
    name,
    email: supabaseUser.email || profile?.email || '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    role: 'SkillSwap Member',
    education: 'B.Tech IT',
    currentRole: 'Learner & Mentor',
    careerGoal: 'Software Developer',
    bio: 'SkillSwap community member learning and sharing skills.',
    verified: true,
    createdAt: profile?.created_at || supabaseUser.created_at || new Date().toISOString(),
  };
}

/**
 * Retrieve user profile from the public.profiles table.
 */
export async function fetchProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('[authService] Error fetching profile:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error('[authService] Unexpected error fetching profile:', err);
    return null;
  }
}

import { addUserSkillsByNames } from './skillService';

/**
 * Upsert user profile into public.profiles table.
 */
export async function upsertProfile(
  userId: string,
  fullName: string,
  email: string,
  extra?: { interests?: string[]; proficiency?: string; availability?: string[] }
) {
  try {
    const payload: any = {
      id: userId,
      full_name: fullName,
      email: email,
      updated_at: new Date().toISOString(),
    };
    if (extra?.interests) payload.interests = extra.interests;
    if (extra?.proficiency) payload.proficiency = extra.proficiency;
    if (extra?.availability) payload.availability = extra.availability;

    const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('[authService] Error upserting profile:', error.message);
    }
  } catch (err) {
    console.error('[authService] Unexpected error upserting profile:', err);
  }
}

export interface RegisterOptions {
  fullName: string;
  email: string;
  password: string;
  interests?: string[];
  proficiency?: string;
  availability?: string[];
  teachSkills?: string[];
  learnSkills?: string[];
}

/**
 * Register a new user with Supabase Auth (email/password) and save profile and skills information.
 */
export async function registerWithSupabase(options: RegisterOptions): Promise<AuthResponse> {
  const {
    fullName,
    email,
    password,
    interests = [],
    proficiency = 'Intermediate',
    availability = [],
    teachSkills = [],
    learnSkills = [],
  } = options;

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          interests,
          proficiency,
          availability,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Registration failed. No user was returned.' };
    }

    // Save/update the complete profile record in public.profiles table
    await upsertProfile(data.user.id, fullName.trim(), email.trim(), {
      interests,
      proficiency,
      availability,
    });

    // If a session exists right away, persist teaching and learning skills into user_skills
    if (data.session) {
      if (teachSkills.length > 0) {
        await addUserSkillsByNames(data.user.id, teachSkills, 'teach', proficiency);
      }
      if (learnSkills.length > 0) {
        await addUserSkillsByNames(data.user.id, learnSkills, 'learn', proficiency);
      }
    }

    const appUser = mapSupabaseUserToAppUser(data.user, {
      full_name: fullName.trim(),
      email: email.trim(),
      created_at: data.user.created_at,
    });

    const isConfirmationRequired = !data.session;

    return {
      success: true,
      user: appUser,
      session: data.session,
      isConfirmationRequired,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'An unexpected error occurred during registration.',
    };
  }
}

/**
 * Login a user with Supabase Auth (email/password).
 */
export async function loginWithSupabase(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Login failed. No user returned.' };
    }

    // Fetch existing profile if available
    const profile = await fetchProfile(data.user.id);
    const appUser = mapSupabaseUserToAppUser(data.user, profile);

    return {
      success: true,
      user: appUser,
      session: data.session,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'An unexpected error occurred during login.',
    };
  }
}

/**
 * Logout from Supabase.
 */
export async function logoutFromSupabase(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn('[authService] Error signing out from Supabase:', err);
  }
}

/**
 * Get the current Supabase session and user if active.
 */
export async function getInitialSession(): Promise<{ user: User | null; session: Session | null }> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session?.user) {
      return { user: null, session: null };
    }

    const profile = await fetchProfile(session.user.id);
    const appUser = mapSupabaseUserToAppUser(session.user, profile);

    return { user: appUser, session };
  } catch (err) {
    console.error('[authService] Error retrieving initial session:', err);
    return { user: null, session: null };
  }
}
