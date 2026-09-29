import { supabase } from '../lib/supabaseClient';
import { api } from './apiClient';
import type { Session } from '../types';

export interface CreateSessionParams {
  matchId?: string;
  learnerId: string;
  teacherId: string;
  title: string;
  scheduledAt: string;
  durationMinutes?: number;
  meetingUrl?: string;
  notes?: string;
}

/**
 * Fetch all sessions for a user from Express backend /api/sessions
 * with fallback to Supabase sessions table.
 */
export async function getUserSessions(userId: string): Promise<{ data: Session[]; error?: string }> {
  try {
    // 1. Try Express backend API route
    const apiRes = await api.get<Session[]>('/sessions');
    if (apiRes.success && apiRes.data) {
      return { data: apiRes.data };
    }

    // 2. Fallback to direct Supabase query
    const { data, error } = await supabase
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
      return { data: [], error: error.message };
    }

    const mappedSessions: Session[] = (data || []).map((s: any) => {
      const scheduled = s.scheduled_at ? new Date(s.scheduled_at) : new Date();
      const teacherName = s.teacher?.full_name || s.teacher?.email?.split('@')[0] || 'Peer Mentor';
      const learnerName = s.learner?.full_name || s.learner?.email?.split('@')[0] || 'Learner';
      const skillName = s.match?.skill?.name || 'Skill Exchange';

      const isTeacher = s.teacher_id === userId;
      const partnerName = isTeacher ? learnerName : teacherName;

      const statusNormalized: 'Upcoming' | 'Completed' | 'Cancelled' =
        s.status?.toLowerCase() === 'completed'
          ? 'Completed'
          : s.status?.toLowerCase() === 'cancelled'
          ? 'Cancelled'
          : 'Upcoming';

      return {
        id: s.id,
        title: s.title || `${skillName} Mentorship Session`,
        mentorId: s.teacher_id,
        learnerId: s.learner_id,
        mentorName: partnerName,
        learnerName,
        mentorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        skillName,
        date: scheduled.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: scheduled.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        durationMinutes: s.duration_minutes || 45,
        status: statusNormalized,
        meetingLink: s.meeting_url || `https://meet.skillswap.ai/session-${s.id.slice(0, 8)}`,
        notes: `Peer mentorship session covering ${skillName}.`,
      };
    });

    return { data: mappedSessions };
  } catch (err: any) {
    return { data: [], error: err?.message || 'Failed to fetch sessions' };
  }
}

/**
 * Create a new learning session via Express backend /api/sessions
 * with fallback to Supabase sessions table.
 */
export async function createSession(params: CreateSessionParams): Promise<{ data: any; error?: string }> {
  try {
    const meetingUrl = params.meetingUrl || `https://meet.skillswap.ai/session-${Date.now().toString(36)}`;

    // Try Express backend API first
    const apiRes = await api.post('/sessions', {
      ...params,
      meetingUrl,
    });

    if (apiRes.success && apiRes.data) {
      return { data: apiRes.data };
    }

    // Direct Supabase fallback
    const { data, error } = await supabase
      .from('sessions')
      .insert({
        match_id: params.matchId || null,
        learner_id: params.learnerId,
        teacher_id: params.teacherId,
        title: params.title,
        scheduled_at: params.scheduledAt,
        duration_minutes: params.durationMinutes || 45,
        meeting_url: meetingUrl,
        status: 'scheduled',
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to create session' };
  }
}

/**
 * Update session status via Express backend /api/sessions/:id
 * with fallback to Supabase sessions table.
 */
export async function updateSessionStatus(
  sessionId: string,
  status: 'scheduled' | 'completed' | 'cancelled'
): Promise<{ success: boolean; error?: string }> {
  try {
    const apiRes = await api.patch(`/sessions/${sessionId}`, { status });
    if (apiRes.success) {
      return { success: true };
    }

    const { error } = await supabase
      .from('sessions')
      .update({ status })
      .eq('id', sessionId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update session' };
  }
}
