
export interface CreditGroup {
  id: string;
  name: string;
  earned: number;
  total: number;
  color: string;
}

export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  github?: string;
}

export interface Guest {
  name: string;
  role: string;
  image: string;
  bio: string;
  socials: SocialLinks;
}

export interface ProblemStatement {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prize?: string;
  description: string;
  objectives: string[];
}

export interface JudgingCriteria {
  name: string;
  weight: number;
  description: string;
}

export interface LeaderboardEntry {
  rank: number;
  team: string;
  problem: string;
  score: number;
  prize: string;
  avatar: string;
}

export interface Event {
  id: string;
  title: string;
  subtitle?: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  category: 'Workshop' | 'Hackathon' | 'Cultural' | 'Sports' | 'Networking' | 'Seminar' | 'Internship' | 'Conference' | 'Short Term Course' | 'Faculty Development Program' | 'Leadership Fest' | 'Technical Event' | 'National Conference' | 'International Conference' | 'Chess Tournament' | 'Online Training Program' | 'Other';
  eventType?: 'Technical' | 'Non-Technical';
  eventCategory?: 'Internal' | 'External';
  creditType?: 'Group 2' | 'Group 3' | 'EE' | 'None';
  image: string;
  organizer: string;
  description: string;
  registrationFees: string;
  feeShort?: string;
  feeDetails?: string;
  type?: 'Internal' | 'External';
  venueAddress?: string;
  venueMapUrl?: string; // Google Maps Link
  departments?: string[];
  contactInfo?: string;
  deadline?: string; // Registration Deadline
  registrationUrl: string;
  registered: number;
  maxCapacity: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  isEndingSoon?: boolean;
  isRegistered?: boolean;
  seatsRemaining?: number;
  guests?: Guest[];
  problems?: ProblemStatement[];
  rules?: string[];
  judging?: JudgingCriteria[];
  prizes?: string[];
  leaderboard?: LeaderboardEntry[];
}

export interface RegistrationFormData {
  name: string;
  rollNumber: string;
  department: string;
  year: string;
  email: string;
  phone: string;
  hasTeam: boolean;
}

export interface UserStats {
  events: number;
  certificates: number;
  days: number;
  credits: number;
}

export interface Achievement {
  id: string;
  title: string;
  date: string;
  venue: string;
  type: 'Certificate' | 'Offer Letter';
  category: 'Group 2' | 'Group 3' | 'EE' | 'General' | 'Career';
  status: 'Verified' | 'Pending';
  credits?: number;
  organization?: string;
  role?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  year: string;
  badge: string;
}

export interface OpenRole {
  id: string;
  title: string;
  skills: string[];
  openings: number;
}

export interface Vacancy {
  vacancy_id: string;
  club_name: string;
  title: string;
  description: string;
  skills: string[];
  openings: number;
  deadline?: string | null;
  contact?: string | null;
  status: 'Published' | 'Draft';
  created_at: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  members: number;
  openPositions: number;
  established: string;
  tags: string[];
  image: string;
  banner: string;
  mission: string;
  vision: string;
  whatWeDo: string;
  projects: Project[];
  roles: OpenRole[];
  interview: {
    venue: string;
    date: string;
    time: string;
  };
}

export interface Activity {
  id: string;
  type: 'certificate' | 'event' | 'club' | 'achievement';
  title: string;
  detail: string;
  date: string;
}

// Admin Specific Types
export interface ClubTeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface JobApplication {
  id: string;
  studentName: string;
  rollNumber: string;
  year: string;
  roleApplied: string;
  experience: string;
  status: 'Pending' | 'Shortlisted' | 'Rejected';
  cgpa: string;
}

export interface AdminStats {
  totalParticipants: number;
  activeEvents: number;
  openVacancies: number;
  totalMembers: number;
}

export interface DashboardActivity {
  id: string;
  type: 'application' | 'event' | 'system' | 'alert';
  message: string;
  time: string;
  highlight?: boolean;
}
