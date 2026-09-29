import express from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

/**
 * GET /api/sessions
 * Fetch all sessions where the user is either the learner or the teacher.
 */
router.get('/', async (req, res) => {
  try {
    const client = req.supabaseClient;
    const userId = req.user.id;

    const { data, error } = await client
      .from('sessions')
      .select(`
        id,
        match_id,
        learner_id,
        teacher_id,
        title,
        scheduled_at,
        duration_minutes,
        meeting_url,
        status,
        created_at,
        teacher:profiles!sessions_teacher_id_fkey(id, full_name, email),
        learner:profiles!sessions_learner_id_fkey(id, full_name, email),
        match:skill_matches(id, skill:skills(id, name))
      `)
      .or(`learner_id.eq.${userId},teacher_id.eq.${userId}`)
      .order('scheduled_at', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    const mappedSessions = (data || []).map((s) => {
      const scheduled = s.scheduled_at ? new Date(s.scheduled_at) : new Date();
      const teacherName = s.teacher?.full_name || s.teacher?.email?.split('@')[0] || 'Peer Mentor';
      const learnerName = s.learner?.full_name || s.learner?.email?.split('@')[0] || 'Learner';
      const skillName = s.match?.skill?.name || 'Skill Exchange';

      const isTeacher = s.teacher_id === userId;
      const partnerName = isTeacher ? learnerName : teacherName;

      const statusNormalized =
        s.status?.toLowerCase() === 'completed'
          ? 'Completed'
          : s.status?.toLowerCase() === 'cancelled'
          ? 'Cancelled'
          : 'Upcoming';

      return {
        id: s.id,
        matchId: s.match_id,
        title: s.title || `${skillName} Mentorship Session`,
        mentorId: s.teacher_id,
        learnerId: s.learner_id,
        mentorName: partnerName,
        learnerName,
        mentorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        skillName,
        date: scheduled.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: scheduled.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        scheduledAt: s.scheduled_at,
        durationMinutes: s.duration_minutes || 45,
        status: statusNormalized,
        meetingLink: s.meeting_url || `https://meet.skillswap.ai/session-${s.id.slice(0, 8)}`,
        notes: `Peer mentorship session covering ${skillName}.`,
      };
    });

    return res.json({ success: true, data: mappedSessions });
  } catch (err) {
    console.error('[GET /api/sessions] Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

/**
 * POST /api/sessions
 * Schedule a new learning session.
 */
router.post('/', async (req, res) => {
  try {
    const client = req.supabaseClient;
    const userId = req.user.id;
    const {
      matchId,
      learnerId = userId,
      teacherId,
      title,
      scheduledAt,
      durationMinutes = 45,
      meetingUrl,
    } = req.body;

    if (!teacherId || !scheduledAt || !title) {
      return res.status(400).json({
        success: false,
        error: 'teacherId, scheduledAt, and title are required',
      });
    }

    const meetingLink =
      meetingUrl || `https://meet.skillswap.ai/session-${Date.now().toString(36)}`;

    const { data, error } = await client
      .from('sessions')
      .insert({
        match_id: matchId || null,
        learner_id: learnerId,
        teacher_id: teacherId,
        title,
        scheduled_at: scheduledAt,
        duration_minutes: durationMinutes,
        meeting_url: meetingLink,
        status: 'scheduled',
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.status(201).json({
      success: true,
      message: 'Session scheduled successfully',
      data,
    });
  } catch (err) {
    console.error('[POST /api/sessions] Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

/**
 * PATCH /api/sessions/:id
 * Update status of an existing session (e.g., 'completed', 'scheduled', 'cancelled').
 */
router.patch('/:id', async (req, res) => {
  try {
    const client = req.supabaseClient;
    const userId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required' });
    }

    // Verify session belongs to user (as teacher or learner)
    const { data, error } = await client
      .from('sessions')
      .update({ status: status.toLowerCase() })
      .eq('id', id)
      .or(`learner_id.eq.${userId},teacher_id.eq.${userId}`)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.json({
      success: true,
      message: `Session updated to ${status}`,
      data,
    });
  } catch (err) {
    console.error('[PATCH /api/sessions/:id] Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

export default router;
