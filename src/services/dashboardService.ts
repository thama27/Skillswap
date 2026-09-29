import { supabase } from '../lib/supabaseClient';

export interface DashboardStatsData {
  skillsCount: number;
  matchesCount: number;
  sessionsCount: number;
  certificatesCount: number;
}

export interface UpcomingSessionData {
  id: string;
  title: string | null;
  scheduled_at: string | null;
  duration_minutes: number | null;
  meeting_url: string | null;
  status: string | null;
  mentorName: string;
  date: string;
  time: string;
}

/**
 * Fetch real aggregate statistics for the dashboard.
 */
export async function getDashboardStats(userId: string): Promise<DashboardStatsData> {
  try {
    // 1. Skills count from user_skills
    const skillsRes = await supabase
      .from('user_skills')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // 2. Matches count from skill_matches (where user is learner or teacher)
    const matchesRes = await supabase
      .from('skill_matches')
      .select('*', { count: 'exact', head: true })
      .or(`learner_id.eq.${userId},teacher_id.eq.${userId}`);

    // 3. Sessions count from sessions (where user is learner or teacher)
    const sessionsRes = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .or(`learner_id.eq.${userId},teacher_id.eq.${userId}`);

    // 4. Certificates count from certificates
    const certsRes = await supabase
      .from('certificates')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    return {
      skillsCount: skillsRes.count || 0,
      matchesCount: matchesRes.count || 0,
      sessionsCount: sessionsRes.count || 0,
      certificatesCount: certsRes.count || 0,
    };
  } catch (err) {
    console.error('[dashboardService] Error fetching dashboard stats:', err);
    return {
      skillsCount: 0,
      matchesCount: 0,
      sessionsCount: 0,
      certificatesCount: 0,
    };
  }
}

/**
 * Fetch real upcoming sessions for the user.
 */
export async function getUpcomingSession(userId: string): Promise<UpcomingSessionData | null> {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        id,
        title,
        scheduled_at,
        duration_minutes,
        meeting_url,
        status,
        teacher:profiles!sessions_teacher_id_fkey(full_name),
        learner:profiles!sessions_learner_id_fkey(full_name)
      `)
      .or(`learner_id.eq.${userId},teacher_id.eq.${userId}`)
      .order('scheduled_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const scheduledDate = data.scheduled_at ? new Date(data.scheduled_at) : new Date();
    const isTeacher = (data as any).teacher_id === userId;
    const partnerName = isTeacher
      ? (data.learner as any)?.full_name || 'Student'
      : (data.teacher as any)?.full_name || 'Mentor';

    return {
      id: data.id,
      title: data.title || 'Skill Swap Learning Session',
      scheduled_at: data.scheduled_at,
      duration_minutes: data.duration_minutes || 45,
      meeting_url: data.meeting_url,
      status: data.status || 'scheduled',
      mentorName: partnerName,
      date: scheduledDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: scheduledDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };
  } catch (err) {
    console.error('[dashboardService] Error fetching upcoming session:', err);
    return null;
  }
}
