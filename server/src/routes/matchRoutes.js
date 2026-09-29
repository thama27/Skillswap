import express from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

/**
 * Deterministic calculation of skill match compatibility between learner and teacher.
 */
function calculateMatchScore(params) {
  const {
    learnerSkillName = '',
    teacherSkillName = '',
    learnerProficiency = 'Intermediate',
    teacherProficiency = 'Intermediate',
    learnerInterests = [],
    teacherInterests = [],
    learnerAvailability = [],
    teacherAvailability = [],
  } = params;

  // 1. Skill compatibility
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
 * GET /api/matches
 * Find peer mentors matching the authenticated user's learning skills.
 * Queries `user_skills`, `profiles`, `skills`, and persists/updates `skill_matches`.
 */
router.get('/', async (req, res) => {
  try {
    const client = req.supabaseClient;
    const userId = req.user.id;

    // 1. Fetch current user's profile and learning skills
    const [profileRes, learnSkillsRes] = await Promise.all([
      client.from('profiles').select('*').eq('id', userId).maybeSingle(),
      client
        .from('user_skills')
        .select('*, skills(id, name, category)')
        .eq('user_id', userId)
        .eq('skill_type', 'learn'),
    ]);

    const learnerProfile = profileRes.data;
    const learnerLearningSkills = learnSkillsRes.data || [];
    const learnerInterests = learnerProfile?.interests || [];
    const learnerAvailability = learnerProfile?.availability || [];
    const learnerProficiency = learnerProfile?.proficiency || 'Intermediate';

    // 2. Fetch all teaching skills of other users
    const { data: teachersSkills, error: teachersErr } = await client
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
      return res.status(400).json({ success: false, error: teachersErr.message });
    }

    if (!teachersSkills || teachersSkills.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // 3. Match calculation for each teacher offering a skill
    const matches = [];

    for (const record of teachersSkills) {
      const teacher = record.profiles;
      const skill = record.skills;
      if (!teacher || !skill) continue;

      const teacherSkillName = skill.name;
      const teacherInterests = teacher.interests || [];
      const teacherAvailability = teacher.availability || ['Weekends'];
      const teacherProficiency = record.proficiency || 'Intermediate';

      // Find matching learning skill for user, or use first available
      const matchedLearningSkill = learnerLearningSkills.find(
        (ls) => ls.skills?.name?.toLowerCase() === teacherSkillName.toLowerCase()
      );

      const targetSkillName = matchedLearningSkill
        ? matchedLearningSkill.skills?.name
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

      // Upsert into skill_matches table
      let dbMatchId = null;
      try {
        const { data: existingMatch } = await client
          .from('skill_matches')
          .select('id, status')
          .eq('learner_id', userId)
          .eq('teacher_id', teacher.id)
          .eq('skill_id', skill.id)
          .maybeSingle();

        dbMatchId = existingMatch?.id;

        if (!existingMatch) {
          const { data: newMatch } = await client
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
        console.warn('[Match upsert notice]:', upsertErr.message);
      }

      const matchItem = {
        id: dbMatchId || `sm_${teacher.id}_${skill.id}`,
        dbMatchId: dbMatchId || undefined,
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
            proficiency: teacherProficiency,
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
        experienceLevel: teacherProficiency,
        skillCompatibility: scoreCalc.skillScore,
        interestCompatibility: scoreCalc.interestScore,
        availabilityCompatibility: scoreCalc.availabilityScore,
      };

      matches.push(matchItem);
    }

    // Sort by match percentage descending
    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return res.json({ success: true, data: matches });
  } catch (err) {
    console.error('[GET /api/matches] Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

/**
 * POST /api/matches/connect
 * Connect with a peer mentor. Creates `learning_requests` and records status in `skill_matches`.
 */
router.post('/connect', async (req, res) => {
  try {
    const client = req.supabaseClient;
    const learnerId = req.user.id;
    const { teacherId, skillId } = req.body;

    if (!teacherId || !skillId) {
      return res.status(400).json({ success: false, error: 'teacherId and skillId are required' });
    }

    // 1. Check for existing learning_request to avoid duplicate requests
    const { data: existingRequest } = await client
      .from('learning_requests')
      .select('id, status')
      .eq('learner_id', learnerId)
      .eq('skill_id', skillId)
      .maybeSingle();

    if (existingRequest) {
      return res.json({ success: true, isDuplicate: true, message: 'Request already exists' });
    }

    // 2. Insert into learning_requests
    const { data: requestData, error: reqErr } = await client
      .from('learning_requests')
      .insert({
        learner_id: learnerId,
        skill_id: skillId,
        status: 'pending',
      })
      .select()
      .single();

    if (reqErr) {
      return res.status(400).json({ success: false, error: reqErr.message });
    }

    // 3. Upsert or update skill_matches status to 'pending'
    const { data: existingMatch } = await client
      .from('skill_matches')
      .select('id')
      .eq('learner_id', learnerId)
      .eq('teacher_id', teacherId)
      .eq('skill_id', skillId)
      .maybeSingle();

    if (existingMatch) {
      await client
        .from('skill_matches')
        .update({ status: 'pending' })
        .eq('id', existingMatch.id);
    } else {
      await client.from('skill_matches').insert({
        learner_id: learnerId,
        teacher_id: teacherId,
        skill_id: skillId,
        match_percentage: 90,
        match_reason: 'Peer learning request sent via SkillSwap AI.',
        status: 'pending',
      });
    }

    return res.status(201).json({
      success: true,
      isDuplicate: false,
      message: 'Connection request sent successfully',
      data: requestData,
    });
  } catch (err) {
    console.error('[POST /api/matches/connect] Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

/**
 * GET /api/matches/requested-skill-ids
 * Get all skill IDs for which the authenticated user has learning requests.
 */
router.get('/requested-skill-ids', async (req, res) => {
  try {
    const client = req.supabaseClient;
    const userId = req.user.id;

    const { data, error } = await client
      .from('learning_requests')
      .select('skill_id')
      .eq('learner_id', userId);

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    const skillIds = (data || []).map((r) => r.skill_id);
    return res.json({ success: true, data: skillIds });
  } catch (err) {
    console.error('[GET /api/matches/requested-skill-ids] Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

export default router;
