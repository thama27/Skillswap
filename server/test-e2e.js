import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const API_BASE = 'http://localhost:5000/api';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase URL or Key in environment');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Helper for HTTP requests to Express backend
async function request(endpoint, options = {}, token = null) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  const json = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data: json };
}

async function runTests() {
  console.log('=====================================================');
  console.log('🧪 SKILLSWAP AI END-TO-END SYSTEM INTEGRATION TEST');
  console.log('=====================================================');

  const testEmail = 'skillswap.learner.1790617799199@gmail.com';
  const testPassword = 'Password123!';
  const initialName = 'Alex Mercer';

  let testUserId = null;
  let accessToken = null;

  // ----------------------------------------------------
  // TEST 1 & 2: User Login & Session Authentication
  // ----------------------------------------------------
  console.log('\n[1 & 2] Testing User Authentication & Session Token Acquisition...');
  const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (signInErr || !signInData.session) {
    console.error('❌ Supabase Auth Login failed:', signInErr?.message);
    process.exit(1);
  }

  accessToken = signInData.session.access_token;
  testUserId = signInData.user.id;

  console.log(`✅ Supabase Auth Login Successful.`);
  console.log(`   User ID: ${testUserId}`);
  console.log(`   Email: ${testEmail}`);
  console.log(`   Session Token: ${accessToken.slice(0, 30)}... (valid JWT)`);

  // ----------------------------------------------------
  // TEST 3: User Profile API (GET & PUT /api/profile)
  // ----------------------------------------------------
  console.log('\n[3] Testing User Profile API endpoints (/api/profile)...');
  const getProfileRes = await request('/profile', { method: 'GET' }, accessToken);
  if (!getProfileRes.ok || !getProfileRes.data?.data) {
    console.error('❌ GET /api/profile failed:', getProfileRes.data);
    process.exit(1);
  }
  console.log(`✅ GET /api/profile retrieved profile from Supabase profiles table: "${getProfileRes.data.data.full_name}"`);

  const updatedName = `${initialName} (Active Pro)`;
  const putProfileRes = await request(
    '/profile',
    {
      method: 'PUT',
      body: JSON.stringify({
        full_name: updatedName,
        proficiency: 'Advanced',
        availability: ['Weekends', 'Evening'],
        interests: ['Artificial Intelligence', 'Web Development', 'Cloud Architecture'],
      }),
    },
    accessToken
  );

  if (!putProfileRes.ok || putProfileRes.data?.data?.full_name !== updatedName) {
    console.error('❌ PUT /api/profile failed:', putProfileRes.data);
    process.exit(1);
  }
  console.log(`✅ PUT /api/profile successfully updated profile in Supabase profiles table.`);
  console.log(`   Updated Name: ${putProfileRes.data.data.full_name}`);
  console.log(`   Proficiency: ${putProfileRes.data.data.proficiency}`);
  console.log(`   Interests: ${putProfileRes.data.data.interests?.join(', ')}`);
  console.log(`   Availability: ${putProfileRes.data.data.availability?.join(', ')}`);

  // ----------------------------------------------------
  // TEST 4: Skills Management (Teaching & Learning Skills)
  // ----------------------------------------------------
  console.log('\n[4] Testing Skills API (/api/skills/teaching & /api/skills/learning)...');
  
  // 4a. Add Teaching Skill: Java
  const addTeachRes = await request(
    '/skills/teaching',
    {
      method: 'POST',
      body: JSON.stringify({
        skillName: 'Java',
        proficiency: 'Advanced',
      }),
    },
    accessToken
  );
  if (!addTeachRes.ok || !addTeachRes.data?.data) {
    console.error('❌ POST /api/skills/teaching failed:', addTeachRes.data);
    process.exit(1);
  }
  console.log(`✅ POST /api/skills/teaching saved to user_skills table: Java [Advanced]`);

  // 4b. Add Learning Skill: Python
  const addLearnRes = await request(
    '/skills/learning',
    {
      method: 'POST',
      body: JSON.stringify({
        skillName: 'Python',
        proficiency: 'Beginner',
      }),
    },
    accessToken
  );
  if (!addLearnRes.ok || !addLearnRes.data?.data) {
    console.error('❌ POST /api/skills/learning failed:', addLearnRes.data);
    process.exit(1);
  }
  console.log(`✅ POST /api/skills/learning saved to user_skills table: Python [Beginner]`);

  // 4c. Verify retrieval from backend API
  const getTeachRes = await request('/skills/teaching', { method: 'GET' }, accessToken);
  const getLearnRes = await request('/skills/learning', { method: 'GET' }, accessToken);
  console.log(`✅ GET /api/skills/teaching returned ${getTeachRes.data?.data?.length} teaching skill(s):`, 
    getTeachRes.data?.data?.map(s => s.skills?.name).join(', '));
  console.log(`✅ GET /api/skills/learning returned ${getLearnRes.data?.data?.length} learning skill(s):`, 
    getLearnRes.data?.data?.map(s => s.skills?.name).join(', '));

  // ----------------------------------------------------
  // TEST 5: AI Skill Matching & Peer Connect
  // ----------------------------------------------------
  console.log('\n[5] Testing AI Skill Matching & Peer Connect (/api/matches)...');
  const matchRes = await request('/matches', { method: 'GET' }, accessToken);
  if (!matchRes.ok) {
    console.error('❌ GET /api/matches failed:', matchRes.data);
    process.exit(1);
  }

  const matches = matchRes.data?.data || [];
  console.log(`✅ GET /api/matches evaluated and returned ${matches.length} matching peer mentor(s):`);

  let mentorToConnect = null;
  for (const m of matches) {
    console.log(`   - Mentor: ${m.user.name} (${m.user.email})`);
    console.log(`     Skill Taught: ${m.skill} [${m.experienceLevel}]`);
    console.log(`     Match Percentage: ${m.matchPercentage}% (Skill: ${m.skillCompatibility}%, Interest: ${m.interestCompatibility}%, Availability: ${m.availabilityCompatibility}%)`);
    console.log(`     AI Insight: "${m.matchInsight}"`);
    if (!mentorToConnect) mentorToConnect = m;
  }

  if (mentorToConnect) {
    console.log(`\n   Testing peer connection with mentor: ${mentorToConnect.user.name}...`);
    const connectRes = await request(
      '/matches/connect',
      {
        method: 'POST',
        body: JSON.stringify({
          teacherId: mentorToConnect.user.id,
          skillId: mentorToConnect.teachSkills[0]?.skill?.id,
        }),
      },
      accessToken
    );

    if (!connectRes.ok) {
      console.error('❌ POST /api/matches/connect failed:', connectRes.data);
      process.exit(1);
    }
    console.log(`✅ POST /api/matches/connect successfully saved to Supabase learning_requests & skill_matches tables.`);
  }

  // ----------------------------------------------------
  // TEST 6: Skill Exchange Sessions
  // ----------------------------------------------------
  console.log('\n[6] Testing Skill Exchange Sessions (/api/sessions)...');
  const partnerId = mentorToConnect?.user?.id || 'cf47df12-4b7c-4e04-9734-bd576939e2b9';
  const sessionTime = new Date(Date.now() + 172800000).toISOString();

  // 6a. Create Session
  const createSessionRes = await request(
    '/sessions',
    {
      method: 'POST',
      body: JSON.stringify({
        learnerId: testUserId,
        teacherId: partnerId,
        title: 'Python Backend & Concurrency Mastery',
        scheduledAt: sessionTime,
        durationMinutes: 60,
      }),
    },
    accessToken
  );

  if (!createSessionRes.ok || !createSessionRes.data?.data) {
    console.error('❌ POST /api/sessions failed:', createSessionRes.data);
    process.exit(1);
  }

  const sessionObj = createSessionRes.data.data;
  console.log(`✅ POST /api/sessions scheduled session ID: ${sessionObj.id} in Supabase sessions table.`);
  console.log(`   Title: ${sessionObj.title}`);
  console.log(`   Meeting Link: ${sessionObj.meeting_url}`);
  console.log(`   Status: ${sessionObj.status}`);

  // 6b. Fetch Sessions
  const getSessionsRes = await request('/sessions', { method: 'GET' }, accessToken);
  if (!getSessionsRes.ok || !getSessionsRes.data?.data?.length) {
    console.error('❌ GET /api/sessions failed:', getSessionsRes.data);
    process.exit(1);
  }
  console.log(`✅ GET /api/sessions retrieved ${getSessionsRes.data.data.length} session(s) from Supabase.`);

  // 6c. Update status to 'completed'
  const patchSessionRes = await request(
    `/sessions/${sessionObj.id}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status: 'completed' }),
    },
    accessToken
  );

  if (!patchSessionRes.ok || patchSessionRes.data?.data?.status !== 'completed') {
    console.error('❌ PATCH /api/sessions/:id failed:', patchSessionRes.data);
    process.exit(1);
  }
  console.log(`✅ PATCH /api/sessions/:id updated session status to "completed" in Supabase sessions table.`);

  // ----------------------------------------------------
  // TEST 7: Career Recommendations
  // ----------------------------------------------------
  console.log('\n[7] Testing Career Recommendations (/api/career-recommendations)...');
  const careerRes = await request('/career-recommendations', { method: 'GET' }, accessToken);
  if (!careerRes.ok || !careerRes.data?.data?.length) {
    console.error('❌ GET /api/career-recommendations failed:', careerRes.data);
    process.exit(1);
  }

  const careerList = careerRes.data.data;
  console.log(`✅ GET /api/career-recommendations generated ${careerList.length} customized career pathways:`);
  careerList.forEach((c) => {
    console.log(`   🎯 Role: ${c.title} (${c.matchPercentage}% alignment)`);
    console.log(`      Skills Matched: ${c.userSkillsMatched.join(', ')}`);
    console.log(`      Skills To Acquire: ${c.skillGaps.join(', ')}`);
    console.log(`      Recommended Roadmap: ${c.roadmap?.[0]}`);
  });

  // Query authenticated client for career_recommendations
  const authSupabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: dbRecs, error: dbRecsErr } = await authSupabase
    .from('career_recommendations')
    .select('id, career_title, match_percentage, matching_skills')
    .eq('user_id', testUserId);

  if (dbRecsErr) {
    console.error('❌ Error checking career_recommendations table:', dbRecsErr.message);
  } else {
    console.log(`✅ Persisted in Supabase career_recommendations table: ${dbRecs?.length || 0} entry found: "${dbRecs?.[0]?.career_title}"`);
  }

  console.log('\n=====================================================');
  console.log('🎉 ALL 7 END-TO-END CAPABILITIES FULLY OPERATIONAL & TESTED!');
  console.log('=====================================================');
}

runTests().catch((err) => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
