import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { supabase } from '../config/supabase.js';

const router = express.Router();

/**
 * GET /api/skills
 * Fetch all catalog skills from the skills table.
 * Can be accessed publicly or with auth.
 */
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.json({ success: true, data: data || [] });
  } catch (err) {
    console.error('[GET /api/skills] Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// All subsequent routes require user authentication
router.use(requireAuth);

/**
 * GET /api/skills/teaching
 * Fetch authenticated user's teaching skills.
 */
router.get('/teaching', async (req, res) => {
  try {
    const client = req.supabaseClient;
    const userId = req.user.id;

    const { data, error } = await client
      .from('user_skills')
      .select('id, user_id, skill_id, skill_type, proficiency, created_at, skills(id, name, category)')
      .eq('user_id', userId)
      .eq('skill_type', 'teach')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.json({ success: true, data: data || [] });
  } catch (err) {
    console.error('[GET /api/skills/teaching] Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

/**
 * GET /api/skills/learning
 * Fetch authenticated user's learning skills.
 */
router.get('/learning', async (req, res) => {
  try {
    const client = req.supabaseClient;
    const userId = req.user.id;

    const { data, error } = await client
      .from('user_skills')
      .select('id, user_id, skill_id, skill_type, proficiency, created_at, skills(id, name, category)')
      .eq('user_id', userId)
      .eq('skill_type', 'learn')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.json({ success: true, data: data || [] });
  } catch (err) {
    console.error('[GET /api/skills/learning] Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

/**
 * Helper to ensure a skill exists in the `skills` table by ID or name.
 */
async function resolveSkillId(client, skillId, skillName) {
  if (skillId) return skillId;
  if (!skillName || !skillName.trim()) return null;

  const trimmed = skillName.trim();
  const dbClient = client || supabase;

  // Check if exists
  const { data: existing } = await dbClient
    .from('skills')
    .select('id')
    .ilike('name', trimmed)
    .maybeSingle();

  if (existing?.id) return existing.id;

  // Insert new skill using authenticated client
  const { data: inserted, error } = await dbClient
    .from('skills')
    .insert({ name: trimmed, category: 'Technical Skills' })
    .select('id')
    .single();

  if (error || !inserted) {
    throw new Error(error?.message || 'Failed to register skill in catalog');
  }

  return inserted.id;
}

/**
 * POST /api/skills/teaching
 * Add a teaching skill for the authenticated user.
 */
router.post('/teaching', async (req, res) => {
  try {
    const client = req.supabaseClient;
    const userId = req.user.id;
    const { skillId, skillName, proficiency = 'Intermediate' } = req.body;

    const targetSkillId = await resolveSkillId(client, skillId, skillName);
    if (!targetSkillId) {
      return res.status(400).json({ success: false, error: 'Skill ID or Skill Name is required' });
    }

    // Check duplicate
    const { data: existing } = await client
      .from('user_skills')
      .select('id, user_id, skill_id, skill_type, proficiency, created_at, skills(id, name, category)')
      .eq('user_id', userId)
      .eq('skill_id', targetSkillId)
      .eq('skill_type', 'teach')
      .maybeSingle();

    if (existing) {
      return res.json({ success: true, isDuplicate: true, data: existing });
    }

    const { data, error } = await client
      .from('user_skills')
      .insert({
        user_id: userId,
        skill_id: targetSkillId,
        skill_type: 'teach',
        proficiency,
      })
      .select('id, user_id, skill_id, skill_type, proficiency, created_at, skills(id, name, category)')
      .single();

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.status(201).json({ success: true, data });
  } catch (err) {
    console.error('[POST /api/skills/teaching] Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

/**
 * POST /api/skills/learning
 * Add a learning skill for the authenticated user.
 */
router.post('/learning', async (req, res) => {
  try {
    const client = req.supabaseClient;
    const userId = req.user.id;
    const { skillId, skillName, proficiency = 'Intermediate' } = req.body;

    const targetSkillId = await resolveSkillId(client, skillId, skillName);
    if (!targetSkillId) {
      return res.status(400).json({ success: false, error: 'Skill ID or Skill Name is required' });
    }

    // Check duplicate
    const { data: existing } = await client
      .from('user_skills')
      .select('id, user_id, skill_id, skill_type, proficiency, created_at, skills(id, name, category)')
      .eq('user_id', userId)
      .eq('skill_id', targetSkillId)
      .eq('skill_type', 'learn')
      .maybeSingle();

    if (existing) {
      return res.json({ success: true, isDuplicate: true, data: existing });
    }

    const { data, error } = await client
      .from('user_skills')
      .insert({
        user_id: userId,
        skill_id: targetSkillId,
        skill_type: 'learn',
        proficiency,
      })
      .select('id, user_id, skill_id, skill_type, proficiency, created_at, skills(id, name, category)')
      .single();

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.status(201).json({ success: true, data });
  } catch (err) {
    console.error('[POST /api/skills/learning] Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

/**
 * DELETE /api/skills/:userSkillId
 * Remove a user skill entry (teaching or learning).
 */
router.delete('/:userSkillId', async (req, res) => {
  try {
    const client = req.supabaseClient;
    const userId = req.user.id;
    const { userSkillId } = req.params;

    const { error } = await client
      .from('user_skills')
      .delete()
      .eq('id', userSkillId)
      .eq('user_id', userId);

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.json({ success: true, message: 'Skill removed successfully' });
  } catch (err) {
    console.error('[DELETE /api/skills/:userSkillId] Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

export default router;
