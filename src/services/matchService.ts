import { supabase } from '../lib/supabaseClient';
import { api } from './apiClient';
import type { MatchResult, UserSkill, Interest } from '../types';

export interface CalculatedMatch {
  id: string;
  dbMatchId?: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  teacherAvatar: string;
  teacherEducation: string;
  teacherBio: string;
  teacherVerified: boolean;
  skillId: string;
  skillName: string;
  skillCategory?: string;
  teacherProficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  learnerProficiency: string;
  matchPercentage: number;
  skillCompatibility: number;
  interestCompatibility: number;
  availabilityCompatibility: number;
  matchInsight: string;
  availabilityDays: string;
  interests: Interest[];
  teachSkills: UserSkill[];
  learnSkills: any[];
  status: string;
}

/**
 * Deterministic calculation of skill match compatibility between learner and teacher.
 */
export function calculateMatchScore(params: {
  learnerSkillName: string;
  teacherSkillName: string;
  learnerProficiency: string;
  teacherProficiency: string;
  learnerInterests: string[];
  teacherInterests: string[];
  learnerAvailability: string[];
  teacherAvailability: string[];
}): {
  overallPercentage: number;
  skillScore: number;
  interestScore: number;
  availabilityScore: number;
  insight: string;
} {
  const {
    learnerSkillName,
    teacherSkillName,
    learnerProficiency,
    teacherProficiency,
    learnerInterests,
    teacherInterests,
    learnerAvailability,
    teacherAvailability,
  } = params;

  // 1. Skill overlap base: 50%
  let skillScore = 70;
  if (learnerSkillName.toLowerCase() === teacherSkillName.toLowerCase()) {
    skillScore = 95;
  }

  // Proficiency complementarity
  if (
    (teacherProficiency === 'Advanced' || teacherProficiency === 'Expert') &&
    (learnerProficiency === 'Beginner' || learnerProficiency === 'Intermediate')
  ) {
    skillScore += 5;
  }

  // 2. Interest compatibility
  let interestScore = 75;
  const commonInterests = learnerInterests.filter((li) =>
    teacherInterests.some((ti) => ti.toLowerCase() === li.toLowerCase())
  );
  if (commonInterests.length > 0) {
    interestScore = Math.min(98, 80 + commonInterests.length * 8);
  }

  // 3. Availability compatibility
  let availabilityScore = 75;
  const commonAvail = learnerAvailability.filter((la) =>
    teacherAvailability.some((ta) => ta.toLowerCase() === la.toLowerCase())
  );
  if (commonAvail.length > 0) {
    availabilityScore = Math.min(96, 85 + commonAvail.length * 5);
  }

  // Weighted average: 50% skill + 25% interest + 25% availability
  const overallPercentage = Math.round(
    skillScore * 0.5 + interestScore * 0.25 + availabilityScore * 0.25
  );

  const interestText =
    commonInterests.length > 0
      ? `Shares interests in ${commonInterests.slice(0, 2).join(' & ')}.`
      : 'Aligned on technical growth.';

  const insight = `Teaches ${teacherSkillName} at ${teacherProficiency} level. ${interestText} Schedule overlaps on ${
    commonAvail[0] || teacherAvailability[0] || 'weekends'
  }.`;

  return {
    overallPercentage: Math.min(99, Math.max(65, overallPercentage)),
    skillScore: Math.min(99, skillScore),
    interestScore: Math.min(99, interestScore),
    availabilityScore: Math.min(99, availabilityScore),
    insight,
  };
}

/**
 * Fetch matches for the authenticated learner via Express backend /api/matches
 * with fallback to direct Supabase query.
 */
export async function getSkillMatchesForUser(userId: string): Promise<{ data: MatchResult[]; error?: string }> {
  try {
    // 1. Try Express backend API route first
    const apiRes = await api.get<MatchResult[]>('/matches');
    if (apiRes.success && apiRes.data) {
      return { data: apiRes.data };
    }

    // 2. Fallback to direct Supabase data query
    const [profileRes, learnSkillsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('user_skills').select('*, skills(id, name, category)').eq('user_id', userId).eq('skill_type', 'learn'),
    ]);

    const learnerProfile = profileRes.data;
    const learnerLearningSkills = learnSkillsRes.data || [];
    const learnerInterests = learnerProfile?.interests || [];
    const learnerAvailability = learnerProfile?.availability || [];
    const learnerProficiency = learnerProfile?.proficiency || 'Intermediate';

    const { data: teachersSkills, error: teachersErr } = await supabase
      .from('user_skills')
      .select(`
        id,
        user_id,
        skill_id,
        skill_type,
        proficiency,
        skills (id, name, category),
        profiles:profiles!user_skills_user_id_fkey (
          id,
          full_name,
          email,
          interests,
          proficiency,
          availability
        )
      `)
      .eq('skill_type', 'teach')
      .neq('user_id', userId);

    if (teachersErr) {
      return { data: [], error: teachersErr.message };
    }

    if (!teachersSkills || teachersSkills.length === 0) {
      return { data: [] };
    }

    const matches: MatchResult[] = [];

    for (const record of teachersSkills) {
      const teacher = (record as any).profiles;
      const skill = (record as any).skills;
      if (!teacher || !skill) continue;

      const teacherSkillName = skill.name;
      const teacherInterests: string[] = teacher.interests || [];
      const teacherAvailability: string[] = teacher.availability || ['Weekends'];
      const teacherProficiency = record.proficiency || 'Intermediate';

      const matchedLearningSkill = learnerLearningSkills.find(
        (ls: any) => ls.skills?.name?.toLowerCase() === teacherSkillName.toLowerCase()
      );

      const targetSkillName = matchedLearningSkill
        ? (matchedLearningSkill as any).skills?.name
        : learnerLearningSkills[0]?.skills?.name || teacherSkillName;

      const scoreCalc = calculateMatchScore({
        learnerSkillName: targetSkillName,
        teacherSkillName,
        learnerProficiency,
        teacherProficiency,
        learnerInterests,
        teacherInterests,
        learnerAvailability,
        teacherAvailability,
      });

      let dbMatchId: string | undefined;
      try {
        const { data: existingMatch } = await supabase
          .from('skill_matches')
          .select('id, status')
          .eq('learner_id', userId)
          .eq('teacher_id', teacher.id)
          .eq('skill_id', skill.id)
          .maybeSingle();

        dbMatchId = existingMatch?.id;

        if (!existingMatch) {
          const { data: newMatch } = await supabase
            .from('skill_matches')
            .insert({
              learner_id: userId,
              teacher_id: teacher.id,
              skill_id: skill.id,
              match_percentage: scoreCalc.overallPercentage,
              match_reason: scoreCalc.insight,
              status: 'pending',
            })
            .select('id')
            .maybeSingle();

          dbMatchId = newMatch?.id;
        }
      } catch (upsertErr) {
        console.warn('[matchService] Match upsert notice:', upsertErr);
      }

      const matchItem: MatchResult = {
        id: dbMatchId || `sm_${teacher.id}_${skill.id}`,
        user: {
          id: teacher.id,
          name: teacher.full_name || teacher.email?.split('@')[0] || 'Peer Mentor',
          email: teacher.email || '',
          avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80`,
          role: 'Peer Mentor',
          education: 'B.Tech IT',
          currentRole: 'Mentor',
          careerGoal: 'Software Engineering',
          bio: `Experienced in ${teacherSkillName}. Ready to collaborate and mentor peers.`,
          verified: true,
          createdAt: new Date().toISOString(),
        },
        teachSkills: [
          {
            id: record.id,
            userId: teacher.id,
            skill: { id: skill.id, name: skill.name, category: skill.category },
            proficiency: teacherProficiency as any,
            verified: true,
          },
        ],
        learnSkills: [],
        interests: teacherInterests.map((t, idx) => ({ id: `ti_${idx}`, name: t })),
        matchPercentage: scoreCalc.overallPercentage,
        matchInsight: scoreCalc.insight,
        skill: teacherSkillName,
        skillCategory: skill.category || 'Technical',
        roleStatus: 'Mentor',
        availabilityDays: teacherAvailability.join(', ') || 'Weekends',
        experienceLevel: teacherProficiency as any,
        skillCompatibility: scoreCalc.skillScore,
        interestCompatibility: scoreCalc.interestScore,
        availabilityCompatibility: scoreCalc.availabilityScore,
      };

      matches.push(matchItem);
    }

    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
    return { data: matches };
  } catch (err: any) {
    console.error('[matchService] Error finding matches:', err);
    return { data: [], error: err?.message || 'Error finding skill matches' };
  }
}

/**
 * Handle Connect action via Express backend /api/matches/connect
 * with fallback to direct Supabase mutation.
 */
export async function sendConnectionRequest(params: {
  learnerId: string;
  teacherId: string;
  skillId: string;
}): Promise<{ success: boolean; isDuplicate: boolean; error?: string }> {
  const { learnerId, teacherId, skillId } = params;

  try {
    // 1. Try Express backend route first
    const apiRes = await api.post('/matches/connect', { teacherId, skillId });
    if (apiRes.success) {
      return {
        success: true,
        isDuplicate: Boolean((apiRes as any).isDuplicate),
      };
    }

    // 2. Direct Supabase fallback
    const { data: existingRequest } = await supabase
      .from('learning_requests')
      .select('id, status')
      .eq('learner_id', learnerId)
      .eq('skill_id', skillId)
      .maybeSingle();

    if (existingRequest) {
      return { success: true, isDuplicate: true };
    }

    const { error: reqErr } = await supabase.from('learning_requests').insert({
      learner_id: learnerId,
      skill_id: skillId,
      status: 'pending',
    });

    if (reqErr) {
      return { success: false, isDuplicate: false, error: reqErr.message };
    }

    const { data: existingMatch } = await supabase
      .from('skill_matches')
      .select('id')
      .eq('learner_id', learnerId)
      .eq('teacher_id', teacherId)
      .eq('skill_id', skillId)
      .maybeSingle();

    if (existingMatch) {
      await supabase
        .from('skill_matches')
        .update({ status: 'pending' })
        .eq('id', existingMatch.id);
    } else {
      await supabase.from('skill_matches').insert({
        learner_id: learnerId,
        teacher_id: teacherId,
        skill_id: skillId,
        match_percentage: 90,
        match_reason: 'Peer learning request sent.',
        status: 'pending',
      });
    }

    return { success: true, isDuplicate: false };
  } catch (err: any) {
    return { success: false, isDuplicate: false, error: err?.message || 'Connection failed' };
  }
}

/**
 * Get all skill IDs for which the user has pending/active learning requests.
 */
export async function getUserRequestedSkillIds(userId: string): Promise<string[]> {
  try {
    const apiRes = await api.get<string[]>('/matches/requested-skill-ids');
    if (apiRes.success && apiRes.data) {
      return apiRes.data;
    }

    const { data } = await supabase
      .from('learning_requests')
      .select('skill_id')
      .eq('learner_id', userId);

    return (data || []).map((r) => r.skill_id);
  } catch (err) {
    return [];
  }
}
