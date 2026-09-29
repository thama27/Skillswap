import express from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

// Comprehensive industry career archetypes
const CAREER_ARCHETYPES = [
  {
    title: 'AI / Machine Learning Engineer',
    description: 'Design and deploy predictive machine learning models, deep neural networks, and scalable generative AI pipelines.',
    requiredSkills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Deep Learning'],
    demandLevel: 'High',
    avgSalary: '$135,000 - $175,000',
    roadmap: [
      'Master fundamental statistical modeling and advanced Python data structures',
      'Deploy deep neural architectures with PyTorch and huggingface models',
      'Optimize latency with tensor inference engines and model quantization',
      'Build end-to-end MLOps deployment pipelines on cloud infrastructure',
    ],
  },
  {
    title: 'Full Stack Web Architect',
    description: 'Architect resilient end-to-end web applications with modern frontend systems and scalable cloud backend services.',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    demandLevel: 'High',
    avgSalary: '$120,000 - $160,000',
    roadmap: [
      'Master modern component state architecture and responsive UX patterns',
      'Build microservice REST and GraphQL backends with Node.js and TypeScript',
      'Design relational schemas, indices, and transactions in PostgreSQL',
      'Implement zero-downtime CI/CD pipelines with containerized workloads',
    ],
  },
  {
    title: 'Cloud & DevOps Specialist',
    description: 'Automate multi-region cloud infrastructures, Kubernetes orchestration, and immutable infrastructure delivery pipelines.',
    requiredSkills: ['Docker', 'Kubernetes', 'Linux', 'AWS', 'Python'],
    demandLevel: 'High',
    avgSalary: '$125,000 - $165,000',
    roadmap: [
      'Deep dive into Linux kernel primitives, networking, and shell automation',
      'Containerize distributed applications and manage Kubernetes manifests',
      'Automate cloud infrastructure using Terraform and Ansible',
      'Configure enterprise observability with Prometheus, Grafana, and OpenTelemetry',
    ],
  },
  {
    title: 'Data Platform Engineer',
    description: 'Build enterprise big data analytics pipelines, streaming distributed transformations, and data lakehouses.',
    requiredSkills: ['SQL', 'Python', 'Apache Spark', 'PostgreSQL', 'Data Modeling'],
    demandLevel: 'High',
    avgSalary: '$115,000 - $155,000',
    roadmap: [
      'Master relational and analytical SQL optimizations and indexing',
      'Develop distributed batch and streaming pipelines using Python and Spark',
      'Implement star/snowflake data warehouse schemas and automated testing',
      'Enforce automated data quality and governance contracts across datasets',
    ],
  },
];

/**
 * GET /api/career-recommendations
 * Generates tailored career pathways based on user skills & interests,
 * records/syncs recommendations in the `career_recommendations` table,
 * and returns rich career roadmaps.
 */
router.get('/', async (req, res) => {
  try {
    const client = req.supabaseClient;
    const userId = req.user.id;

    // 1. Fetch user's profile and skills
    const [profileRes, userSkillsRes] = await Promise.all([
      client.from('profiles').select('*').eq('id', userId).maybeSingle(),
      client
        .from('user_skills')
        .select('*, skills(id, name, category)')
        .eq('user_id', userId),
    ]);

    const profile = profileRes.data;
    const userSkillsList = (userSkillsRes.data || []).map((s) => s.skills?.name).filter(Boolean);
    const interests = profile?.interests || [];

    // Combine skills known by user (fallback to baseline if user hasn't added any yet)
    const effectiveSkills =
      userSkillsList.length > 0 ? userSkillsList : ['Python', 'SQL', 'React'];

    // 2. Score and analyze against archetypes
    const analyzedCareers = CAREER_ARCHETYPES.map((arch) => {
      const matched = arch.requiredSkills.filter((reqSkill) =>
        effectiveSkills.some(
          (userSkill) => userSkill.toLowerCase() === reqSkill.toLowerCase()
        )
      );

      const gaps = arch.requiredSkills.filter(
        (reqSkill) => !matched.some((m) => m.toLowerCase() === reqSkill.toLowerCase())
      );

      // Calculate baseline match percentage based on matched skills
      const skillRatio = matched.length / arch.requiredSkills.length;
      let matchPercentage = Math.round(55 + skillRatio * 40);

      // Check interest bonus
      const matchesInterest = interests.some((interest) =>
        arch.title.toLowerCase().includes(interest.toLowerCase()) ||
        arch.description.toLowerCase().includes(interest.toLowerCase())
      );
      if (matchesInterest) {
        matchPercentage = Math.min(98, matchPercentage + 5);
      }

      return {
        id: `career-${arch.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        title: arch.title,
        description: arch.description,
        matchPercentage,
        whyRecommended: `Matches your skills in ${
          matched.join(', ') || 'foundation technologies'
        } and offers strong career progression in modern engineering.`,
        requiredSkills: arch.requiredSkills,
        userSkillsMatched: matched.length > 0 ? matched : [effectiveSkills[0] || 'Core Tech'],
        skillGaps: gaps.length > 0 ? gaps : ['System Optimization', 'Advanced Architecture'],
        avgSalary: arch.avgSalary,
        demandLevel: arch.demandLevel,
        roadmap: arch.roadmap,
      };
    });

    // Sort by match percentage descending
    analyzedCareers.sort((a, b) => b.matchPercentage - a.matchPercentage);

    // 3. Sync top recommendations with `career_recommendations` table in Supabase
    try {
      const topRole = analyzedCareers[0];
      if (topRole) {
        const { data: existingRec } = await client
          .from('career_recommendations')
          .select('id')
          .eq('user_id', userId)
          .eq('career_title', topRole.title)
          .maybeSingle();

        if (!existingRec) {
          await client.from('career_recommendations').insert({
            user_id: userId,
            career_title: topRole.title,
            description: topRole.description,
            matching_skills: topRole.userSkillsMatched,
            match_percentage: topRole.matchPercentage,
          });
        }
      }
    } catch (dbSyncErr) {
      console.warn('[CareerRecommendations] DB sync notice:', dbSyncErr.message);
    }

    return res.json({
      success: true,
      data: analyzedCareers,
      userCurrentSkills: effectiveSkills,
      userCurrentInterests: interests.length > 0 ? interests : ['Web Development', 'AI'],
    });
  } catch (err) {
    console.error('[GET /api/career-recommendations] Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

export default router;
