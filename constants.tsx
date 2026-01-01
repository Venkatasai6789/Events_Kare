
import { CreditGroup, Event, UserStats, Achievement, Club, Activity, LeaderboardEntry, ClubTeamMember, JobApplication, AdminStats, DashboardActivity } from './types';

export const CREDIT_GROUPS: CreditGroup[] = [
  { id: 'group-2', name: 'Group 2 (Certs)', earned: 3, total: 7, color: '#EC4899' },
  { id: 'group-3', name: 'Group 3 (Certs)', earned: 2, total: 7, color: '#8B5CF6' },
  { id: 'ee', name: 'EE Credits (Points)', earned: 6, total: 8, color: '#F59E0B' },
];

export const STUDENT_PROFILE = {
  name: "Alex Thompson",
  registerNumber: "2023CS101",
  department: "CSE (AI & ML)",
  academicYear: "3rd Year",
  batch: "2021-2025"
};

export const HOD_PROFILE = {
  name: "Dr. Richard Branson",
  department: "Computer Science & Engineering",
  employeeId: "HOD-CSE-2024-001"
};

export const UPCOMING_EVENTS: Event[] = [
  {
    id: '1',
    title: 'AI & Machine Learning Masterclass',
    subtitle: 'Building the next generation of intelligent systems.',
    startDate: '2024-10-12',
    endDate: '2024-10-12',
    startTime: '10:00',
    endTime: '16:00',
    location: 'Main Auditorium, Building A',
    category: 'Workshop',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
    organizer: 'Tech Innovators Guild',
    status: 'Upcoming',
    description: 'Join us for a high-intensity session where we break down the core pillars of modern Artificial Intelligence and Machine Learning. This masterclass is designed for students who want to move beyond theory and build practical, real-world models.',
    registrationFees: 'Free',
    registrationUrl: 'https://example.com/register/ai-masterclass',
    registered: 105,
    maxCapacity: 150,
    seatsRemaining: 45,
    guests: [
      { 
        name: 'Dr. Sarah Jenkins', 
        role: 'AI Principal Researcher', 
        image: 'https://picsum.photos/seed/dr/200', 
        bio: 'Expert in Neural Networks and AI Ethics.', 
        socials: { twitter: '#', linkedin: '#', github: '#' } 
      }
    ],
    rules: ["Bring your own laptop.", "Pre-registration mandatory."]
  },
  {
    id: '2',
    title: 'Blockchain & Web3 Summit',
    subtitle: 'Decentralizing the future of the internet',
    startDate: '2024-10-15',
    endDate: '2024-10-15',
    startTime: '09:00',
    endTime: '17:00',
    location: 'Convention Center, Hall B',
    category: 'Seminar',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200',
    organizer: 'Finance & Crypto Club',
    status: 'Upcoming',
    description: 'A deep dive into the world of decentralized finance, smart contracts, and the evolving Web3 ecosystem with industry leaders.',
    registrationFees: '₹150',
    registrationUrl: 'https://example.com/register/web3',
    registered: 240,
    maxCapacity: 300,
    seatsRemaining: 60
  },
  {
    id: '3',
    title: 'UX Design Sprint: Mobile First',
    subtitle: 'Design thinking for the mobile generation',
    startDate: '2024-10-20',
    endDate: '2024-10-20',
    startTime: '14:00',
    endTime: '18:00',
    location: 'Design Lab, Building C',
    category: 'Workshop',
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=1200',
    organizer: 'Design Dynamics',
    status: 'Upcoming',
    description: 'Fast-paced design sprint focusing on accessibility and user journey mapping for mobile applications.',
    registrationFees: 'Free',
    registrationUrl: 'https://example.com/register/ux-sprint',
    registered: 45,
    maxCapacity: 50,
    seatsRemaining: 5
  },
  {
    id: 'hack-2023',
    title: 'Annual Hackathon 2023',
    subtitle: 'Celebrating excellence, innovation, and breakthrough solutions',
    startDate: '2023-10-23',
    endDate: '2023-10-24',
    startTime: '09:00',
    endTime: '09:00',
    location: 'Innovation Hub',
    category: 'Hackathon',
    image: 'https://images.unsplash.com/photo-1614064641938-3e8211d936e7?auto=format&fit=crop&q=80&w=1200',
    organizer: 'Tech Innovators Guild',
    status: 'Completed',
    description: 'The biggest coding marathon on campus returns. Solve real-world challenges, network with mentors, and win prizes worth ₹2,00,000.',
    registrationFees: '₹200',
    registrationUrl: 'https://example.com/register/hackathon',
    registered: 500,
    maxCapacity: 500,
    isRegistered: true,
    leaderboard: [
      { rank: 1, team: 'InnovateX', problem: 'AI-powered Academic Assistant', score: 950, prize: '₹50,000', avatar: 'https://images.unsplash.com/photo-1522071823991-b96765511281?auto=format&fit=crop&w=100&q=80' },
      { rank: 2, team: 'DataMiners', problem: 'Data Analytics for Campus', score: 920, prize: '₹30,000', avatar: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=100&q=80' },
      { rank: 3, team: 'CodeCrafters', problem: 'Automated Scheduling System', score: 890, prize: '₹15,000', avatar: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=100&q=80' },
    ]
  },
  {
    id: '5',
    title: 'Cyber Security Essentials',
    subtitle: 'Protecting digital assets in an interconnected world',
    startDate: '2024-11-05',
    endDate: '2024-11-05',
    startTime: '11:00',
    endTime: '13:00',
    location: 'IT Hall, Building D',
    category: 'Networking',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
    organizer: 'Cyber Watchers',
    status: 'Upcoming',
    description: 'Learn the fundamentals of ethical hacking, network security, and data encryption from industry professionals.',
    registrationFees: 'Free',
    registrationUrl: 'https://example.com/register/cyber',
    registered: 180,
    maxCapacity: 200,
    seatsRemaining: 20
  },
  {
    id: '6',
    title: 'Eco-Sustainability Forum',
    subtitle: 'Towards a greener campus and future',
    startDate: '2024-11-12',
    endDate: '2024-11-12',
    startTime: '15:00',
    endTime: '17:00',
    location: 'Green Plaza',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?auto=format&fit=crop&q=80&w=1200',
    organizer: 'Eco Club',
    status: 'Upcoming',
    description: 'A panel discussion on climate change, sustainable living, and university-wide waste reduction strategies.',
    registrationFees: 'Free',
    registrationUrl: 'https://example.com/register/eco',
    registered: 90,
    maxCapacity: 150,
    seatsRemaining: 60
  }
];

export const CAMPUS_CLUBS: Club[] = [
  {
    id: 'club-1',
    name: 'Tech Innovators Guild',
    description: 'Leading the frontier of software engineering, cloud computing, and product development within the campus community.',
    members: 1420,
    openPositions: 4,
    established: '2015',
    tags: ['Development', 'Cloud', 'Open Source'],
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=300',
    banner: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200',
    mission: 'To foster a collaborative environment where students can build industry-grade software and learn emerging technologies.',
    vision: 'To become the premier hub for technical excellence and innovation, bridging the gap between academia and industry.',
    whatWeDo: 'We organize weekly hack-sessions, contribute to major open-source repositories, and collaborate on multi-disciplinary projects that solve real campus problems. From mobile apps to complex web systems, we build it all.',
    projects: [
      { id: 'p1', title: 'Campus Map AR', description: 'An augmented reality navigation system for first-year students to navigate the complex building layouts.', image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=400', year: '2023', badge: 'High Impact' },
      { id: 'p2', title: 'Smart Laundry Bot', description: 'IoT integrated application to check real-time availability of laundry machines in student hostels.', image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb9f?auto=format&fit=crop&q=80&w=400', year: '2024', badge: 'Active' }
    ],
    roles: [
      { id: 'r1', title: 'Frontend Developer', skills: ['React', 'TypeScript', 'Tailwind'], openings: 2 },
      { id: 'r2', title: 'Content Lead', skills: ['Copywriting', 'SEO', 'Strategy'], openings: 1 }
    ],
    interview: {
      venue: 'Innovation Lab, Block C-402',
      date: 'Oct 28, 2024',
      time: '02:00 PM - 05:00 PM'
    }
  },
  {
    id: 'club-2',
    name: 'Design Dynamics',
    description: 'A creative collective focusing on UI/UX research, brand identity, and visual storytelling for the digital age.',
    members: 850,
    openPositions: 3,
    established: '2018',
    tags: ['UI/UX', 'Branding', 'Motion'],
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=300',
    banner: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1200',
    mission: 'To advocate for human-centered design principles and empower every student project with professional aesthetics.',
    vision: 'To redefine how campus initiatives communicate through powerful visual and experiential design.',
    whatWeDo: 'We conduct design sprints, run Figma workshops, and provide end-to-end design solutions for university festivals, clubs, and research posters. Our members master the art of empathy-driven design.',
    projects: [
      { id: 'p3', title: 'Festival Rebrand 24', description: 'Complete visual identity system for the upcoming Annual Cultural Festival.', image: 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?auto=format&fit=crop&q=80&w=400', year: '2024', badge: 'Creative' },
      { id: 'p4', title: 'UX Audit Portal', description: 'Comprehensive usability review of the existing student registration portal.', image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=400', year: '2023', badge: 'Research' }
    ],
    roles: [
      { id: 'r3', title: 'UI Designer', skills: ['Figma', 'Prototyping', 'Visuals'], openings: 2 },
      { id: 'r4', title: 'UX Researcher', skills: ['User Interviews', 'Case Studies'], openings: 1 }
    ],
    interview: {
      venue: 'Design Studio, Fine Arts Wing',
      date: 'Nov 02, 2024',
      time: '11:00 AM - 01:00 PM'
    }
  },
  {
    id: 'club-3',
    name: 'Marketing Mavericks',
    description: 'Building brands and mastering communication strategies for the modern digital economy.',
    members: 620,
    openPositions: 5,
    established: '2019',
    tags: ['Marketing', 'Social Media', 'Ads'],
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=300',
    banner: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
    mission: 'To equip students with modern marketing tools and creative storytelling techniques.',
    vision: 'Developing future CMOs who understand the pulse of the market.',
    whatWeDo: 'We manage campus campaigns, run ads for university events, and analyze student engagement data to optimize communication.',
    projects: [
      { id: 'p5', title: 'Alumni Network Growth', description: 'Digital campaign that increased alumni engagement by 40% in six months.', image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=400', year: '2024', badge: 'Growth' }
    ],
    roles: [
      { id: 'r5', title: 'Social Media Manager', skills: ['Instagram', 'Analytics', 'Canva'], openings: 2 }
    ],
    interview: {
      venue: 'Business Center, Hall A',
      date: 'Nov 10, 2024',
      time: '01:00 PM - 04:00 PM'
    }
  },
  {
    id: 'club-4',
    name: 'Entrepreneurship Cell',
    description: 'Turning student ideas into scalable startups through mentorship, funding, and networking.',
    members: 1100,
    openPositions: 2,
    established: '2014',
    tags: ['Startup', 'VC', 'Pitching'],
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=300',
    banner: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200',
    mission: 'To ignite the entrepreneurial spirit on campus and provide the resources needed for student founders.',
    vision: 'Creating a unicorn factory within the university walls.',
    whatWeDo: 'We host pitch fests, invite angel investors for talks, and run an in-house incubator for early-stage student projects.',
    projects: [
      { id: 'p6', title: 'Startup Weekend 24', description: 'A 54-hour event that launched 12 student-led micro-startups.', image: 'https://images.unsplash.com/photo-1475721027187-4024733924f7?auto=format&fit=crop&q=80&w=400', year: '2024', badge: 'Flagship' }
    ],
    roles: [
      { id: 'r6', title: 'Venture Analyst', skills: ['Finance', 'Research', 'Excel'], openings: 1 }
    ],
    interview: {
      venue: 'Incubation Center, Block B',
      date: 'Nov 15, 2024',
      time: '10:00 AM - 02:00 PM'
    }
  }
];

export const MY_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach-1', title: 'UX Design Fundamentals', date: 'Oct 10, 2024', venue: 'Google Tech Center', type: 'Certificate', category: 'Group 3', status: 'Verified', credits: 1 },
  { id: 'ach-2', title: 'Cloud Architect Associate', date: 'Sep 22, 2024', venue: 'AWS Academy', type: 'Certificate', category: 'Group 2', status: 'Verified', credits: 2 },
  { id: 'ach-3', title: 'Python for Data Science', date: 'Aug 15, 2024', venue: 'Coursera / Campus', type: 'Certificate', category: 'EE', status: 'Verified', credits: 1 },
  { id: 'ach-4', title: 'Summer Internship 2024', date: 'Jun 01, 2024', venue: 'Remote / HQ', type: 'Offer Letter', category: 'Career', status: 'Verified', organization: 'TechFlow Systems', role: 'Product Designer' },
  { id: 'ach-5', title: 'Winter Hackathon Winner', date: 'Dec 15, 2023', venue: 'Innovation Hub', type: 'Certificate', category: 'Group 2', status: 'Verified', credits: 1 },
  { id: 'ach-6', title: 'Machine Learning Advanced', date: 'Nov 02, 2023', venue: 'Microsoft Learn', type: 'Certificate', category: 'EE', status: 'Verified', credits: 2 },
  { id: 'ach-7', title: 'Creative Writing Workshop', date: 'Oct 05, 2023', venue: 'Arts Hall', type: 'Certificate', category: 'Group 3', status: 'Verified', credits: 1 },
  { id: 'ach-8', title: 'Campus Lead Offer', date: 'Sep 30, 2023', venue: 'Student Council', type: 'Offer Letter', category: 'Career', status: 'Verified', organization: 'Student Connect', role: 'Regional Lead' }
];

export const USER_STATS: UserStats = {
  events: 12,
  certificates: 5,
  days: 2,
  credits: 24
};

// Admin Mock Data
export const CLUB_TEAM: ClubTeamMember[] = [
  { id: 'm1', name: 'Alex Thompson', role: 'President', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80' },
  { id: 'm2', name: 'Sarah Chen', role: 'Vice President', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
  { id: 'm3', name: 'Mike Ross', role: 'Event Coordinator', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { id: 'm4', name: 'Priya Patel', role: 'Technical Lead', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80' },
];

export const JOB_APPLICATIONS: JobApplication[] = [
  { id: 'j1', studentName: 'John Doe', rollNumber: '2022CS101', year: '3rd Year', roleApplied: 'Frontend Developer', experience: '1 Year React', status: 'Pending', cgpa: '9.2' },
  { id: 'j2', studentName: 'Jane Smith', rollNumber: '2023EC204', year: '2nd Year', roleApplied: 'Content Writer', experience: 'College Magazine', status: 'Shortlisted', cgpa: '8.8' },
  { id: 'j3', studentName: 'Robert Brown', rollNumber: '2021ME055', year: '4th Year', roleApplied: 'Event Manager', experience: 'Fest Organizer', status: 'Rejected', cgpa: '7.5' },
];

export const ADMIN_STATS: AdminStats = {
  totalParticipants: 1420,
  activeEvents: 3,
  openVacancies: 4,
  totalMembers: 45
};

export const ADMIN_DASHBOARD_ACTIVITY: DashboardActivity[] = [
  { id: 'a1', type: 'application', message: 'John Doe applied for Frontend Developer', time: '2 hours ago', highlight: true },
  { id: 'a2', type: 'event', message: 'AI Masterclass registration limit reached (150/150)', time: '5 hours ago', highlight: true },
  { id: 'a3', type: 'system', message: 'Weekly engagement report is ready', time: '1 day ago' },
  { id: 'a4', type: 'alert', message: 'Venue change request pending for Web3 Summit', time: '1 day ago' },
  { id: 'a5', type: 'application', message: 'Jane Smith applied for Content Writer', time: '2 days ago' },
];

// Legacy placeholders
export const CLUBS: Club[] = [];
export const ACTIVITIES: Activity[] = [];
export const LEADERBOARD: LeaderboardEntry[] = [];
