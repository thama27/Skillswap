import type {
  User,
  UserSkill,
  UserLearningSkill,
  Interest,
  LearningGoal,
  Availability,
  MatchResult,
  Session,
  Certificate,
  CareerPath,
  Notification,
  DashboardStats,
  ActivityItem,
  Skill,
} from '../types';

// ===== CURRENT AUTHENTICATED USER (DEMO PRIMARY) =====
export const currentDemoUser: User = {
  id: 'u_thamayanthi',
  name: 'Thamayanthi',
  email: 'thamayanthi@skillswap.ai',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  role: 'Student & Tech Enthusiast',
  education: 'B.Tech IT',
  currentRole: 'Undergraduate Student',
  careerGoal: 'Software Developer & AI Specialist',
  bio: 'Interested in AI, software development and collaborative learning. Actively expanding full-stack engineering and machine learning capabilities.',
  verified: true,
  createdAt: '2026-01-10T08:00:00Z',
};

// User's current verified & active skills
export const currentDemoUserSkills: UserSkill[] = [
  { id: 'us1', userId: 'u_thamayanthi', skill: { id: 's1', name: 'Python', category: 'Programming' }, proficiency: 'Intermediate', verified: true },
  { id: 'us2', userId: 'u_thamayanthi', skill: { id: 's2', name: 'Java', category: 'Programming' }, proficiency: 'Intermediate', verified: true },
  { id: 'us3', userId: 'u_thamayanthi', skill: { id: 's6', name: 'SQL', category: 'Data' }, proficiency: 'Intermediate', verified: true },
  { id: 'us4', userId: 'u_thamayanthi', skill: { id: 's17', name: 'HTML', category: 'Web Development' }, proficiency: 'Advanced', verified: true },
  { id: 'us5', userId: 'u_thamayanthi', skill: { id: 's18', name: 'CSS', category: 'Web Development' }, proficiency: 'Advanced', verified: true },
  { id: 'us6', userId: 'u_thamayanthi', skill: { id: 's3', name: 'React', category: 'Web Development' }, proficiency: 'Intermediate', verified: true },
  { id: 'us7', userId: 'u_thamayanthi', skill: { id: 's7', name: 'Machine Learning', category: 'AI' }, proficiency: 'Beginner', verified: false },
  { id: 'us8', userId: 'u_thamayanthi', skill: { id: 's9', name: 'UI/UX', category: 'Design' }, proficiency: 'Intermediate', verified: true },
];

export const currentDemoLearningSkills: UserLearningSkill[] = [
  { id: 'ls1', userId: 'u_thamayanthi', skill: { id: 's1', name: 'Python (Advanced AI/ML)', category: 'Programming' }, status: 'In Progress', priority: 1 },
  { id: 'ls2', userId: 'u_thamayanthi', skill: { id: 's22', name: 'Git & GitHub Workflows', category: 'Tools' }, status: 'In Progress', priority: 2 },
  { id: 'ls3', userId: 'u_thamayanthi', skill: { id: 's25', name: 'Spring Boot', category: 'Backend' }, status: 'Exploring', priority: 3 },
];

export const currentDemoInterests: Interest[] = [
  { id: 'i1', name: 'Artificial Intelligence' },
  { id: 'i2', name: 'Web Development' },
  { id: 'i3', name: 'UI/UX' },
  { id: 'i4', name: 'Cloud & DevOps' },
];

export const currentDemoGoals: LearningGoal[] = [
  { id: 'g1', name: 'Master AI & Machine Learning pipelines' },
  { id: 'g2', name: 'Prepare for Software Developer campus placements' },
  { id: 'g3', name: 'Collaborate with mentors on live open projects' },
];

export const currentDemoAvailability: Availability[] = [
  { id: 'av1', userId: 'u_thamayanthi', day: 'Saturday', startTime: '10:00 AM', endTime: '06:00 PM' },
  { id: 'av2', userId: 'u_thamayanthi', day: 'Sunday', startTime: '10:00 AM', endTime: '04:00 PM' },
  { id: 'av3', userId: 'u_thamayanthi', day: 'Weekdays (Evening)', startTime: '06:00 PM', endTime: '08:00 PM' },
];

// ===== ALL GENERAL SKILLS & CATALOG =====
export const allSkillsList: Skill[] = [
  { id: 's1', name: 'Python', category: 'Programming' },
  { id: 's2', name: 'Java', category: 'Programming' },
  { id: 's3', name: 'React', category: 'Web Development' },
  { id: 's4', name: 'JavaScript', category: 'Web Development' },
  { id: 's5', name: 'TypeScript', category: 'Web Development' },
  { id: 's6', name: 'SQL', category: 'Data' },
  { id: 's7', name: 'Machine Learning', category: 'AI' },
  { id: 's8', name: 'Data Science', category: 'Data' },
  { id: 's9', name: 'UI/UX', category: 'Design' },
  { id: 's10', name: 'Figma', category: 'Design' },
  { id: 's11', name: 'Node.js', category: 'Backend' },
  { id: 's12', name: 'Spring Boot', category: 'Backend' },
  { id: 's13', name: 'Git', category: 'Tools' },
  { id: 's14', name: 'Docker', category: 'DevOps' },
  { id: 's15', name: 'Cloud Computing', category: 'Cloud' },
  { id: 's16', name: 'Cybersecurity', category: 'Security' },
];

// ===== SAMPLE MENTORS & PEERS =====
export const mockMentors: User[] = [
  {
    id: 'u_priya',
    name: 'Priya',
    email: 'priya.sharma@skillswap.ai',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    role: 'Python Mentor',
    education: 'M.Tech AI & Data Engineering',
    currentRole: 'AI Research Engineer',
    careerGoal: 'Lead AI Scientist',
    bio: 'Passionate Python educator with 4+ years building deep learning and machine learning models. I enjoy mentoring students on real-world projects.',
    verified: true,
    createdAt: '2025-11-12T10:00:00Z',
  },
  {
    id: 'u_rahul',
    name: 'Rahul',
    email: 'rahul.verma@skillswap.ai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    role: 'Java Mentor',
    education: 'B.E. Computer Science',
    currentRole: 'Backend Tech Lead',
    careerGoal: 'Enterprise Architect',
    bio: 'Enterprise Java and Spring Boot architect. Helping aspiring developers build robust microservices and clean object-oriented code.',
    verified: true,
    createdAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'u_arun',
    name: 'Arun',
    email: 'arun.kumar@skillswap.ai',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    role: 'Data Science & SQL Mentor',
    education: 'M.S. Business Analytics',
    currentRole: 'Senior Data Analyst',
    careerGoal: 'Head of Analytics',
    bio: 'Specialized in complex SQL optimizations, ETL pipelines, and business intelligence dashboards.',
    verified: true,
    createdAt: '2026-01-05T10:00:00Z',
  },
  {
    id: 'u_meena',
    name: 'Meena',
    email: 'meena.sundar@skillswap.ai',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    role: 'UI/UX & Product Design Mentor',
    education: 'B.Des Industrial & Interaction Design',
    currentRole: 'Senior Product Designer',
    careerGoal: 'Design Director',
    bio: 'Loves creating human-centered design systems, Figma component architectures, and intuitive micro-interactions.',
    verified: true,
    createdAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'u_karthik',
    name: 'Karthik',
    email: 'karthik.rajan@skillswap.ai',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
    role: 'Cloud & DevOps Specialist',
    education: 'B.Tech Information Technology',
    currentRole: 'DevOps Engineer',
    careerGoal: 'Site Reliability Engineering Lead',
    bio: 'Passionate about CI/CD pipelines, Git workflows, Docker containerization, and AWS serverless infrastructure.',
    verified: true,
    createdAt: '2026-02-14T10:00:00Z',
  },
];

// ===== AI SKILL MATCH RESULTS =====
export const mockSkillMatches: MatchResult[] = [
  {
    id: 'm1',
    user: mockMentors[0], // Priya
    skill: 'Python',
    skillCategory: 'Programming & AI',
    roleStatus: 'Teaching',
    matchPercentage: 95,
    matchInsight: 'Strong match based on your Python learning goal and AI interest. Both users are interested in Python and AI.',
    availabilityDays: 'Saturday & Sunday',
    experienceLevel: 'Advanced',
    teachSkills: [
      { id: 'ts1', userId: 'u_priya', skill: { id: 's1', name: 'Python' }, proficiency: 'Advanced', verified: true },
      { id: 'ts2', userId: 'u_priya', skill: { id: 's7', name: 'Machine Learning' }, proficiency: 'Advanced', verified: true },
    ],
    learnSkills: [
      { id: 'ls10', userId: 'u_priya', skill: { id: 's3', name: 'React' }, status: 'In Progress' }
    ],
    interests: [{ id: 'i1', name: 'AI' }, { id: 'i8', name: 'Machine Learning' }],
    skillCompatibility: 98,
    interestCompatibility: 95,
    proficiencyCompatibility: 92,
    goalCompatibility: 96,
    availabilityCompatibility: 94,
  },
  {
    id: 'm2',
    user: mockMentors[1], // Rahul
    skill: 'Java',
    skillCategory: 'Backend Architecture',
    roleStatus: 'Teaching',
    matchPercentage: 89,
    matchInsight: 'Ideal match to elevate your Java fundamentals into enterprise Spring Boot and backend design patterns.',
    availabilityDays: 'Weekdays & Weekends',
    experienceLevel: 'Advanced',
    teachSkills: [
      { id: 'ts3', userId: 'u_rahul', skill: { id: 's2', name: 'Java' }, proficiency: 'Advanced', verified: true },
      { id: 'ts4', userId: 'u_rahul', skill: { id: 's12', name: 'Spring Boot' }, proficiency: 'Advanced', verified: true },
    ],
    learnSkills: [
      { id: 'ls11', userId: 'u_rahul', skill: { id: 's10', name: 'Figma' }, status: 'Exploring' }
    ],
    interests: [{ id: 'i2', name: 'Web Development' }, { id: 'i9', name: 'DevOps' }],
    skillCompatibility: 90,
    interestCompatibility: 88,
    proficiencyCompatibility: 89,
    goalCompatibility: 90,
    availabilityCompatibility: 88,
  },
  {
    id: 'm3',
    user: mockMentors[2], // Arun
    skill: 'SQL & Data Analytics',
    skillCategory: 'Data Engineering',
    roleStatus: 'Teaching',
    matchPercentage: 87,
    matchInsight: 'Great synergy for database performance tuning, indexing, and end-to-end data pipeline construction.',
    availabilityDays: 'Weekends',
    experienceLevel: 'Advanced',
    teachSkills: [
      { id: 'ts5', userId: 'u_arun', skill: { id: 's6', name: 'SQL' }, proficiency: 'Advanced', verified: true },
      { id: 'ts6', userId: 'u_arun', skill: { id: 's8', name: 'Data Science' }, proficiency: 'Intermediate', verified: true },
    ],
    learnSkills: [
      { id: 'ls12', userId: 'u_arun', skill: { id: 's1', name: 'Python' }, status: 'In Progress' }
    ],
    interests: [{ id: 'i4', name: 'Data Analytics' }, { id: 'i1', name: 'AI' }],
    skillCompatibility: 88,
    interestCompatibility: 86,
    proficiencyCompatibility: 85,
    goalCompatibility: 89,
    availabilityCompatibility: 90,
  },
  {
    id: 'm4',
    user: mockMentors[3], // Meena
    skill: 'UI/UX & Figma',
    skillCategory: 'Design Systems',
    roleStatus: 'Teaching',
    matchPercentage: 85,
    matchInsight: 'Harmonious peer match: exchange your React and frontend skills for expert UI/UX design mentorship.',
    availabilityDays: 'Weekday Evenings',
    experienceLevel: 'Advanced',
    teachSkills: [
      { id: 'ts7', userId: 'u_meena', skill: { id: 's9', name: 'UI/UX' }, proficiency: 'Advanced', verified: true },
      { id: 'ts8', userId: 'u_meena', skill: { id: 's10', name: 'Figma' }, proficiency: 'Advanced', verified: true },
    ],
    learnSkills: [
      { id: 'ls13', userId: 'u_meena', skill: { id: 's3', name: 'React' }, status: 'In Progress' }
    ],
    interests: [{ id: 'i3', name: 'Design' }, { id: 'i2', name: 'Web Development' }],
    skillCompatibility: 86,
    interestCompatibility: 84,
    proficiencyCompatibility: 85,
    goalCompatibility: 87,
    availabilityCompatibility: 82,
  },
  {
    id: 'm5',
    user: mockMentors[4], // Karthik
    skill: 'Git & Cloud DevOps',
    skillCategory: 'Infrastructure',
    roleStatus: 'Teaching',
    matchPercentage: 81,
    matchInsight: 'Fills your critical software developer skill gap in Git version control and deployment automation.',
    availabilityDays: 'Saturday Afternoon',
    experienceLevel: 'Intermediate',
    teachSkills: [
      { id: 'ts9', userId: 'u_karthik', skill: { id: 's13', name: 'Git' }, proficiency: 'Advanced', verified: true },
      { id: 'ts10', userId: 'u_karthik', skill: { id: 's14', name: 'Docker' }, proficiency: 'Intermediate', verified: true },
    ],
    learnSkills: [
      { id: 'ls14', userId: 'u_karthik', skill: { id: 's2', name: 'Java' }, status: 'Exploring' }
    ],
    interests: [{ id: 'i9', name: 'DevOps' }, { id: 'i6', name: 'Cloud' }],
    skillCompatibility: 82,
    interestCompatibility: 80,
    proficiencyCompatibility: 81,
    goalCompatibility: 83,
    availabilityCompatibility: 80,
  },
];

// ===== LEARNING SESSIONS =====
export const mockSessions: Session[] = [
  {
    id: 'ses_1',
    title: 'Python Learning Session',
    mentorId: 'u_priya',
    learnerId: 'u_thamayanthi',
    mentorName: 'Priya',
    learnerName: 'Thamayanthi',
    mentorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    skillName: 'Python Programming',
    date: 'Saturday, 28 September',
    time: '5:00 PM',
    durationMinutes: 60,
    status: 'Upcoming',
    meetingLink: '/sessions/room-py-101',
    notes: 'Focusing on Python OOP concepts, list comprehensions, and introduction to NumPy arrays.',
  },
  {
    id: 'ses_2',
    title: 'Java Enterprise Architecture & Spring Basics',
    mentorId: 'u_rahul',
    learnerId: 'u_thamayanthi',
    mentorName: 'Rahul',
    learnerName: 'Thamayanthi',
    mentorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    skillName: 'Java & Spring Boot',
    date: 'Tuesday, 01 October',
    time: '6:30 PM',
    durationMinutes: 45,
    status: 'Upcoming',
    meetingLink: '/sessions/room-java-204',
    notes: 'Hands-on dependency injection and RESTful API controller design in Spring Boot.',
  },
  {
    id: 'ses_3',
    title: 'SQL Complex Joins and Query Optimization',
    mentorId: 'u_arun',
    learnerId: 'u_thamayanthi',
    mentorName: 'Arun',
    learnerName: 'Thamayanthi',
    mentorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    skillName: 'SQL Database Design',
    date: 'Sunday, 15 September',
    time: '4:00 PM',
    durationMinutes: 60,
    status: 'Completed',
    notes: 'Successfully completed exercises in database normalization, subqueries, and execution plans.',
  },
  {
    id: 'ses_4',
    title: 'UI Design Principles & Figma Component Systems',
    mentorId: 'u_meena',
    learnerId: 'u_thamayanthi',
    mentorName: 'Meena',
    learnerName: 'Thamayanthi',
    mentorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    skillName: 'UI/UX Design',
    date: 'Friday, 08 September',
    time: '7:00 PM',
    durationMinutes: 60,
    status: 'Completed',
    notes: 'Review of wireframing, color contrast accessibility, and responsive typography scales.',
  },
];

// ===== DIGITAL CERTIFICATES =====
export const mockCertificates: Certificate[] = [
  {
    id: 'cert_1',
    userId: 'u_thamayanthi',
    userName: 'Thamayanthi',
    mentorName: 'Priya',
    skillName: 'Python Programming',
    certificateId: 'SSA-2026-001',
    issuedAt: '2026-09-18T10:00:00Z',
    completionDate: 'September 2026',
    grade: 'Excellence (Distinction)',
    verificationCode: 'SSA-VERIFY-882193',
    description: 'Awarded for demonstrating proficiency in Python core fundamentals, data structures, algorithms, and practical problem-solving through SkillSwap AI collaborative learning sessions.',
  },
  {
    id: 'cert_2',
    userId: 'u_thamayanthi',
    userName: 'Thamayanthi',
    mentorName: 'Rahul',
    skillName: 'Web Development & React',
    certificateId: 'SSA-2026-002',
    issuedAt: '2026-08-25T14:30:00Z',
    completionDate: 'August 2026',
    grade: 'Excellence',
    verificationCode: 'SSA-VERIFY-749201',
    description: 'Awarded for successful completion of front-end development milestones including responsive component architecture, state management, and modern Web APIs.',
  },
];

// ===== CAREER RECOMMENDATIONS =====
export const mockCareerPaths: CareerPath[] = [
  {
    id: 'car_1',
    title: 'Software Developer',
    description: 'Design, develop, and maintain robust client-facing and server-side software systems with clean object-oriented architecture.',
    matchPercentage: 92,
    whyRecommended: 'Your programming skills, technical interests and learning activity align with software development roles.',
    requiredSkills: ['Java', 'Python', 'SQL', 'Git', 'Data Structures'],
    userSkillsMatched: ['Python', 'Java', 'SQL'],
    skillGaps: ['Git', 'Spring Boot'],
    avgSalary: '$95,000 - $130,000 / yr',
    demandLevel: 'High',
    roadmap: [
      'Master Git & GitHub collaborative branching strategies (Connect with Karthik)',
      'Build a full-stack Spring Boot REST API backed by PostgreSQL (Connect with Rahul)',
      'Practice data structures and algorithmic complexity for technical interviews',
      'Deploy full-stack projects to cloud infrastructure with automated CI/CD',
    ],
  },
  {
    id: 'car_2',
    title: 'UI/UX Designer',
    description: 'Craft intuitive, accessible, and aesthetically engaging digital experiences through user research and design systems.',
    matchPercentage: 84,
    whyRecommended: 'Your design interests, aesthetic sensibility, and front-end React understanding create strong synergy for product design.',
    requiredSkills: ['Figma', 'UI Design', 'Prototyping', 'User Research', 'Wireframing'],
    userSkillsMatched: ['UI/UX', 'React', 'HTML', 'CSS'],
    skillGaps: ['Advanced Design Systems', 'Figma Auto-Layout & Variants'],
    avgSalary: '$85,000 - $120,000 / yr',
    demandLevel: 'High',
    roadmap: [
      'Deep dive into Figma design tokens and responsive auto-layout systems (Connect with Meena)',
      'Conduct usability testing with peer learners in SkillSwap sessions',
      'Build a high-fidelity interactive case study prototype',
    ],
  },
  {
    id: 'car_3',
    title: 'AI & Data Engineer',
    description: 'Build automated machine learning workflows, big-data pipelines, and intelligent predictive algorithms.',
    matchPercentage: 88,
    whyRecommended: 'Your verified foundations in Python, SQL data queries, and AI interest provide an optimal springboard into data engineering.',
    requiredSkills: ['Python', 'SQL', 'Machine Learning', 'Data Pipelines', 'PyTorch'],
    userSkillsMatched: ['Python', 'SQL', 'Machine Learning'],
    skillGaps: ['PyTorch / TensorFlow', 'Docker Containerization'],
    avgSalary: '$105,000 - $145,000 / yr',
    demandLevel: 'High',
    roadmap: [
      'Complete advanced machine learning model training and hyperparameter tuning (Connect with Priya)',
      'Learn Docker containerization for model deployment (Connect with Karthik)',
      'Build an end-to-end intelligent recommendation service',
    ],
  },
];

// ===== DASHBOARD SUMMARY STATS =====
export const mockDashboardStats: DashboardStats = {
  skillsCount: 8,
  matchesCount: 5,
  sessionsCount: 3,
  certificatesCount: 2,
};

// ===== NOTIFICATIONS =====
export const mockNotifications: Notification[] = [
  {
    id: 'notif_1',
    userId: 'u_thamayanthi',
    title: 'New 95% Match Found',
    message: 'Priya is available to mentor you in Python and Machine Learning.',
    type: 'match',
    read: false,
    createdAt: '10 minutes ago',
  },
  {
    id: 'notif_2',
    userId: 'u_thamayanthi',
    title: 'Upcoming Session Reminder',
    message: 'Python Learning Session with Priya starts this Saturday at 5:00 PM.',
    type: 'session',
    read: false,
    createdAt: '1 hour ago',
  },
  {
    id: 'notif_3',
    userId: 'u_thamayanthi',
    title: 'Digital Certificate Issued',
    message: 'Your certificate SSA-2026-001 for Python Programming is ready to view & download.',
    type: 'certificate',
    read: true,
    createdAt: '2 days ago',
  },
  {
    id: 'notif_4',
    userId: 'u_thamayanthi',
    title: 'Career Recommendation Updated',
    message: 'Software Developer role match increased to 92% based on your recent skill verifications.',
    type: 'career',
    read: true,
    createdAt: '3 days ago',
  },
];

// ===== RECENT ACTIVITY STREAM =====
export const mockRecentActivity: ActivityItem[] = [
  {
    id: 'act_1',
    type: 'session',
    title: 'Session Scheduled with Priya',
    description: 'Python Learning Session booked for Saturday at 5:00 PM',
    timestamp: 'Today, 2:15 PM',
    color: '#8B5CF6',
  },
  {
    id: 'act_2',
    type: 'match',
    title: 'AI Matched with Rahul',
    description: '89% Compatibility in Java & Enterprise Architecture',
    timestamp: 'Yesterday, 4:40 PM',
    color: '#6366F1',
  },
  {
    id: 'act_3',
    type: 'certificate',
    title: 'Earned Certificate SSA-2026-001',
    description: 'Verified completion of Python Programming curriculum',
    timestamp: 'Sep 18, 2026',
    color: '#10B981',
  },
  {
    id: 'act_4',
    type: 'session',
    title: 'Completed Session with Arun',
    description: 'SQL Database Design and query optimization workshop',
    timestamp: 'Sep 15, 2026',
    color: '#3B82F6',
  },
];
