import express from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// All profile endpoints require authentication
router.use(requireAuth);

/**
 * GET /api/profile
 * Get authenticated user's profile from the profiles table.
 */
router.get('/', async (req, res) => {
  try {
    const client = req.supabaseClient;
    const userId = req.user.id;

    const { data: profile, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    if (!profile) {
      // Fallback: create basic profile record if missing
      const { data: newProfile, error: createErr } = await client
        .from('profiles')
        .insert({
          id: userId,
          email: req.user.email,
          full_name: req.user.user_metadata?.full_name || req.user.email?.split('@')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createErr) {
        return res.status(400).json({ success: false, error: createErr.message });
      }
      return res.json({ success: true, data: newProfile });
    }

    return res.json({ success: true, data: profile });
  } catch (err) {
    console.error('[GET /api/profile] Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

/**
 * PUT /api/profile
 * Update user's profile information in the profiles table.
 */
router.put('/', async (req, res) => {
  try {
    const client = req.supabaseClient;
    const userId = req.user.id;
    const { full_name, interests, proficiency, availability } = req.body;

    const updatePayload = {
      updated_at: new Date().toISOString(),
    };
    if (full_name !== undefined) updatePayload.full_name = full_name;
    if (interests !== undefined) updatePayload.interests = interests;
    if (proficiency !== undefined) updatePayload.proficiency = proficiency;
    if (availability !== undefined) updatePayload.availability = availability;

    const { data: updated, error } = await client
      .from('profiles')
      .update(updatePayload)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updated,
    });
  } catch (err) {
    console.error('[PUT /api/profile] Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

export default router;
