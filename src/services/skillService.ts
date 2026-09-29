import { supabase } from '../lib/supabaseClient';
import { api } from './apiClient';

export interface SkillItem {
  id: string;
  name: string;
  category?: string | null;
  created_at?: string;
}

export interface UserSkillRecord {
  id: string;
  user_id: string;
  skill_id: string;
  skill_type: 'teach' | 'learn';
  proficiency: string | null;
  created_at: string;
  skills?: SkillItem | null;
}

/**
 * Fetch all available skills from Express backend /api/skills
 * with fallback to Supabase skills table.
 */
export async function getAllSkills(): Promise<{ data: SkillItem[]; error?: string }> {
  try {
    const apiRes = await api.get<SkillItem[]>('/skills');
    if (apiRes.success && apiRes.data) {
      return { data: apiRes.data };
    }

    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: data || [] };
  } catch (err: any) {
    return { data: [], error: err?.message || 'Failed to fetch skills' };
  }
}

/**
 * Fetch skills for a specific user, optionally filtered by skill_type ('teach' | 'learn').
 * Uses backend API routes /api/skills/teaching or /api/skills/learning.
 */
export async function getUserSkills(
  userId: string,
  skillType?: 'teach' | 'learn'
): Promise<{ data: UserSkillRecord[]; error?: string }> {
  try {
    if (skillType === 'teach') {
      const apiRes = await api.get<UserSkillRecord[]>('/skills/teaching');
      if (apiRes.success && apiRes.data) {
        return { data: apiRes.data };
      }
    } else if (skillType === 'learn') {
      const apiRes = await api.get<UserSkillRecord[]>('/skills/learning');
      if (apiRes.success && apiRes.data) {
        return { data: apiRes.data };
      }
    }

    // Direct Supabase query fallback
    let query = supabase
      .from('user_skills')
      .select('id, user_id, skill_id, skill_type, proficiency, created_at, skills(id, name, category)')
      .eq('user_id', userId);

    if (skillType) {
      query = query.eq('skill_type', skillType);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: (data as any) || [] };
  } catch (err: any) {
    return { data: [], error: err?.message || 'Failed to fetch user skills' };
  }
}

/**
 * Add a skill to user_skills via Express backend API routes.
 */
export async function addUserSkill(
  userId: string,
  skillId: string,
  skillType: 'teach' | 'learn',
  proficiency: string = 'Intermediate'
): Promise<{ data: UserSkillRecord | null; error?: string; isDuplicate?: boolean }> {
  try {
    const route = skillType === 'teach' ? '/skills/teaching' : '/skills/learning';
    const apiRes = await api.post<UserSkillRecord>(route, {
      skillId,
      proficiency,
    });

    if (apiRes.success && apiRes.data) {
      return { data: apiRes.data, isDuplicate: Boolean((apiRes as any).isDuplicate) };
    }

    // Direct Supabase fallback
    const { data: existing } = await supabase
      .from('user_skills')
      .select('id, user_id, skill_id, skill_type, proficiency, created_at')
      .eq('user_id', userId)
      .eq('skill_id', skillId)
      .eq('skill_type', skillType)
      .maybeSingle();

    if (existing) {
      return { data: existing as UserSkillRecord, isDuplicate: true };
    }

    const { data, error } = await supabase
      .from('user_skills')
      .insert({
        user_id: userId,
        skill_id: skillId,
        skill_type: skillType,
        proficiency,
      })
      .select('id, user_id, skill_id, skill_type, proficiency, created_at, skills(id, name, category)')
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as any };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to add user skill' };
  }
}

/**
 * Helper to ensure a skill exists by name and attach it to user_skills via backend API.
 */
export async function addUserSkillByName(
  userId: string,
  skillName: string,
  skillType: 'teach' | 'learn',
  proficiency: string = 'Intermediate'
): Promise<{ data: UserSkillRecord | null; error?: string }> {
  try {
    const trimmed = skillName.trim();
    if (!trimmed) return { data: null, error: 'Skill name cannot be empty' };

    const route = skillType === 'teach' ? '/skills/teaching' : '/skills/learning';
    const apiRes = await api.post<UserSkillRecord>(route, {
      skillName: trimmed,
      proficiency,
    });

    if (apiRes.success && apiRes.data) {
      return { data: apiRes.data };
    }

    // Fallback logic
    let skillId: string;
    const { data: existingSkill } = await supabase
      .from('skills')
      .select('id')
      .ilike('name', trimmed)
      .maybeSingle();

    if (existingSkill?.id) {
      skillId = existingSkill.id;
    } else {
      const { data: newSkill, error: createSkillErr } = await supabase
        .from('skills')
        .insert({ name: trimmed, category: 'Technical Skills' })
        .select('id')
        .single();

      if (createSkillErr || !newSkill) {
        return { data: null, error: createSkillErr?.message || 'Failed to create skill' };
      }
      skillId = newSkill.id;
    }

    return await addUserSkill(userId, skillId, skillType, proficiency);
  } catch (err: any) {
    return { data: null, error: err?.message || 'Error adding skill by name' };
  }
}

/**
 * Batch add skills by names.
 */
export async function addUserSkillsByNames(
  userId: string,
  skillNames: string[],
  skillType: 'teach' | 'learn',
  proficiency: string = 'Intermediate'
): Promise<void> {
  for (const name of skillNames) {
    if (name?.trim()) {
      await addUserSkillByName(userId, name.trim(), skillType, proficiency);
    }
  }
}

/**
 * Remove a skill from user_skills via Express backend /api/skills/:id
 */
export async function removeUserSkill(userSkillId: string, userId: string): Promise<boolean> {
  try {
    const apiRes = await api.delete(`/skills/${userSkillId}`);
    if (apiRes.success) {
      return true;
    }

    const { error } = await supabase
      .from('user_skills')
      .delete()
      .eq('id', userSkillId)
      .eq('user_id', userId);

    return !error;
  } catch (err) {
    console.error('Error removing user skill:', err);
    return false;
  }
}
