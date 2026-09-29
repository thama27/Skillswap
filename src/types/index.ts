export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  role?: string;
  bio?: string;
  education?: string;
  currentRole?: string;
  careerGoal?: string;
  verified: boolean;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category?: string;
}

export interface UserSkill {
  id: string;
  userId: string;
  skill: Skill;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  verified: boolean;
}

export interface UserLearningSkill {
  id: string;
  userId: string;
  skill: Skill;
  priority?: number;
  status: 'Exploring' | 'In Progress' | 'Completed';
}

export interface Interest {
  id: string;
  name: string;
}

export interface LearningGoal {
  id: string;
  name: string;
}

export interface Availability {
  id: string;
  userId: string;
  day: string;
  startTime: string;
  endTime: string;
}

export interface UserProfile {
  user: User;
  teachSkills: UserSkill[];
  learnSkills: UserLearningSkill[];
  interests: Interest[];
  learningGoals: LearningGoal[];
  availability: Availability[];
}

export interface MatchResult {
  id: string;
  user: User;
  teachSkills: UserSkill[];
  learnSkills: UserLearningSkill[];
  interests: Interest[];
  matchPercentage: number;
  matchInsight: string;
  skill: string;
  skillCategory?: string;
  roleStatus: 'Teaching' | 'Learning' | 'Mentor' | 'Peer';
  availabilityDays: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  skillCompatibility?: number;
  interestCompatibility?: number;
  proficiencyCompatibility?: number;
  goalCompatibility?: number;
  availabilityCompatibility?: number;
}

export interface Connection {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  createdAt: string;
}

export interface Session {
  id: string;
  title: string;
  mentorId: string;
  learnerId: string;
  mentorName: string;
  learnerName: string;
  mentorAvatar?: string;
  skillName: string;
  date: string;
  time: string;
  durationMinutes: number;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  meetingLink?: string;
  notes?: string;
}

export interface SessionMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderName: string;
  message: string;
  createdAt: string;
}

export interface Certificate {
  id: string;
  userId: string;
  mentorId?: string;
  skillId?: string;
  userName: string;
  mentorName: string;
  skillName: string;
  certificateId: string;
  issuedAt: string;
  completionDate: string;
  grade?: string;
  verificationCode: string;
  description: string;
}

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  matchPercentage: number;
  whyRecommended: string;
  requiredSkills: string[];
  userSkillsMatched: string[];
  skillGaps: string[];
  avgSalary?: string;
  demandLevel?: 'High' | 'Medium' | 'Low';
  roadmap?: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'match' | 'connection' | 'session' | 'certificate' | 'career' | 'info';
  read: boolean;
  createdAt: string;
}

export interface DashboardStats {
  skillsCount: number;
  matchesCount: number;
  sessionsCount: number;
  certificatesCount: number;
}

export interface ActivityItem {
  id: string;
  type: 'registration' | 'match' | 'session' | 'certificate' | 'connection';
  title: string;
  description: string;
  timestamp: string;
  color?: string;
}
