import { supabase } from '../lib/supabaseClient';
import { api } from './apiClient';

export interface DatabaseProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  interests: string[] | null;
  proficiency: string | null;
  availability: string[] | null;
  created_at: string;
  updated_at: string | null;
}

export interface ProfileUpdates {
  full_name?: string;
  interests?: string[];
  proficiency?: string;
  availability?: string[];
}

/**
 * Fetch profile data for a specific user ID from Express backend /api/profile
 * with fallback to Supabase profiles table.
 */
export async function getProfile(userId: string): Promise<{ data: DatabaseProfile | null; error?: string }> {
  try {
    // Try backend API first
    const apiRes = await api.get<DatabaseProfile>('/profile');
    if (apiRes.success && apiRes.data) {
      return { data: apiRes.data };
    }

    // Graceful fallback to Supabase client
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to fetch user profile' };
  }
}

/**
 * Update user profile in Express backend /api/profile
 * with fallback to Supabase profiles table.
 */
export async function updateProfile(
  userId: string,
  updates: ProfileUpdates
): Promise<{ data: DatabaseProfile | null; error?: string }> {
  try {
    // Try backend API first
    const apiRes = await api.put<DatabaseProfile>('/profile', updates);
    if (apiRes.success && apiRes.data) {
      return { data: apiRes.data };
    }

    // Graceful fallback to Supabase client
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to update profile' };
  }
}
