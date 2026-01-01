
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import CreditCard from './components/CreditCard';
import RecommendedSection from './components/RecommendedSection';
import EventCard from './components/EventCard';
import { CREDIT_GROUPS, UPCOMING_EVENTS, USER_STATS, MY_ACHIEVEMENTS, CAMPUS_CLUBS, CLUB_TEAM, ADMIN_STATS, JOB_APPLICATIONS, ADMIN_DASHBOARD_ACTIVITY } from './constants';
import { 
  Sparkles, Zap, Award, Users, Search, Target, ChevronRight, Calendar, 
  MapPin, CheckCircle, Download, Share2, ArrowRight, User, Medal, X, 
  ExternalLink, Info, Instagram, Twitter, Linkedin, Trophy, Filter, 
  ChevronDown, ChevronLeft, CreditCard as PaymentIcon, Smartphone, Building, Wallet,
  CalendarPlus, Mail, AlertTriangle, Globe, School, Github, MessageSquare, AlertCircle,
  TrendingUp, Clock, Compass, BookOpen, Code, Music, Briefcase, GraduationCap, LayoutGrid, Monitor, Mic,
  SlidersHorizontal, Check, HelpCircle, Inbox, Briefcase as VacancyIcon, Eye, FileText, Rocket, Heart,
  QrCode, UserPlus, Upload, FileCheck, ClipboardList, PenTool, Plus, Activity, ArrowUpRight, MoreHorizontal,
  RefreshCw, Settings, Trash2, FileText as DocumentIcon, Shield, BarChart3, ChevronUp, DownloadCloud, Link as LinkIcon, DollarSign, Image as ImageIcon,
  Lock, LogIn, Paperclip, Printer, Star, Send, UploadCloud, Edit2, Copy, CheckCircle2, LayoutDashboard, FileCheck2, ClipboardCheck, BarChart, Flag, Layers, PieChart as PieIcon, LogOut, FileSearch
} from 'lucide-react';
import { Event, Guest, RegistrationFormData, Achievement, Club, Project, OpenRole, JobApplication, DashboardActivity } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'admin' | 'hod'>('student');
  const [currentView, setView] = useState('discover');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [showRegModal, setShowRegModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Data State
  const [eventsList, setEventsList] = useState<Event[]>(UPCOMING_EVENTS);
  const [applications, setApplications] = useState<JobApplication[]>(JOB_APPLICATIONS);

  // HOD State
  const [activeApprovalTab, setActiveApprovalTab] = useState<'Proposals' | 'Certificates'>('Proposals');

  // HOD Mock Data
  const [odRequests, setOdRequests] = useState([
    { id: 'od-1', studentName: 'Alex Thompson', rollNumber: '2023CS101', eventName: 'AI & ML Masterclass', date: '2024-10-12', status: 'Pending' },
    { id: 'od-2', studentName: 'Sarah Jenkins', rollNumber: '2023CS105', eventName: 'Blockchain Summit', date: '2024-10-15', status: 'Pending' },
    { id: 'od-3', studentName: 'Michael Scott', rollNumber: '2022CS204', eventName: 'UX Design Sprint', date: '2024-10-20', status: 'Pending' },
    { id: 'od-4', studentName: 'Pam Beesly', rollNumber: '2023CS112', eventName: 'Cyber Security Essentials', date: '2024-11-05', status: 'Pending' },
  ]);

  const [externalProposals, setExternalProposals] = useState([
    { id: 'ep-1', clubName: 'Tech Innovators Guild', eventName: 'Regional Code-A-Thon', date: '2024-11-20', venue: 'Convention Center', type: 'Technical' },
    { id: 'ep-2', clubName: 'Design Dynamics', eventName: 'State Design Expo', date: '2024-11-25', venue: 'National Arts Gallery', type: 'Exhibition' },
    { id: 'ep-3', clubName: 'Marketing Mavericks', eventName: 'Startup Pitch 2024', date: '2024-12-02', venue: 'Tech Park Auditorium', type: 'Networking' },
    { id: 'ep-4', clubName: 'Eco Club', eventName: 'Global Green Summit', date: '2024-12-10', venue: 'Green City Hub', type: 'Conference' },
  ]);

  const [externalCertificates, setExternalCertificates] = useState([
    { id: 'ec-1', studentName: 'Alex Thompson', rollNumber: '2023CS101', eventName: 'AWS Cloud Foundations', date: '2024-09-15', proof: 'aws_cert_01.pdf', status: 'Pending' },
    { id: 'ec-2', studentName: 'Sarah Jenkins', rollNumber: '2023CS105', eventName: 'Google HashCode 2024', date: '2024-10-01', proof: 'hashcode_rank.png', status: 'Pending' },
    { id: 'ec-3', studentName: 'Michael Scott', rollNumber: '2022CS204', eventName: 'UI/UX Design Masterclass', date: '2024-09-28', proof: 'design_cert.pdf', status: 'Pending' },
    { id: 'ec-4', studentName: 'Jim Halpert', rollNumber: '2023CS120', eventName: 'Ethical Hacking Workshop', date: '2024-10-10', proof: 'cyber_security.pdf', status: 'Pending' },
  ]);

  const clubSummaryData = [
    { name: 'Tech Innovators Guild', total: 12, tech: 10, nonTech: 2, color: 'bg-blue-500' },
    { name: 'Design Dynamics', total: 8, tech: 5, nonTech: 3, color: 'bg-indigo-500' },
    { name: 'Marketing Mavericks', total: 6, tech: 1, nonTech: 5, color: 'bg-rose-500' },
    { name: 'Eco Club', total: 5, tech: 2, nonTech: 3, color: 'bg-emerald-500' },
    { name: 'Entrepreneurship Cell', total: 4, tech: 2, nonTech: 2, color: 'bg-amber-500' },
  ];

  // Certificates View State (Student)
  const [activeCertificateFilter, setActiveCertificateFilter] = useState('All');
  const [selectedInboxItem, setSelectedInboxItem] = useState<Achievement | null>(MY_ACHIEVEMENTS[0]);

  // Added state for events directory filtering (Student)
  const [activeTab, setActiveTab] = useState('All');
  const [activeFilter, setActiveFilter] = useState('All Events');

  // Admin Specific State
  const [activityFilter, setActivityFilter] = useState<'All' | 'Alerts' | 'System' | 'Apps'>('All');
  const [showActivityMenu, setShowActivityMenu] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isCreditDropdownOpen, setIsCreditDropdownOpen] = useState(false);
  
  // Certificate Preview State
  const [previewAchievement, setPreviewAchievement] = useState<Achievement | null>(null);

  // Admin Event Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    subtitle: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    category: 'Workshop',
    creditType: 'None',
    description: '',
    image: '',
    maxCapacity: 50,
    registrationFees: '',
    registrationUrl: '',
  });

  // Mock Profiles
  const STUDENT_PROFILE = {
    name: "Alex Thompson",
    registerNumber: "2023CS101",
    department: "CSE (AI & ML)",
    academicYear: "3rd Year",
    batch: "2021-2025"
  };

  const HOD_PROFILE = {
    name: "Dr. Richard Branson",
    department: "Computer Science & Engineering",
    employeeId: "HOD-CSE-2024-001"
  };

  const CREDITS_DATA = {
    group2: { completed: 3, required: 7 },
    group3: { completed: 2, required: 7 },
    ee: { completed: 6, required: 8 }
  };

  // Memoized filters
  const filteredAchievements = useMemo(() => {
    if (activeCertificateFilter === 'All') return MY_ACHIEVEMENTS;
    const filter = activeCertificateFilter === 'Offer Letters' ? 'Career' : activeCertificateFilter;
    return MY_ACHIEVEMENTS.filter(a => a.category === filter);
  }, [activeCertificateFilter]);

  const filteredEvents = useMemo(() => {
    let filtered = eventsList;
    if (searchQuery) {
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        e.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    const effectiveFilter = activeTab !== 'All' ? activeTab : activeFilter.replace(' Events', '');
    if (effectiveFilter === 'Internal') filtered = filtered.filter(e => parseInt(e.id) % 2 === 0);
    else if (effectiveFilter === 'External') filtered = filtered.filter(e => parseInt(e.id) % 2 !== 0);
    else if (effectiveFilter === 'Registered') filtered = filtered.filter(e => e.isRegistered);
    return filtered;
  }, [activeTab, activeFilter, searchQuery, eventsList]);

  const technicalEvents = useMemo(() => filteredEvents.filter(e => ['Workshop', 'Hackathon', 'Seminar'].includes(e.category)), [filteredEvents]);
  const nonTechnicalEvents = useMemo(() => filteredEvents.filter(e => ['Cultural', 'Sports', 'Networking'].includes(e.category)), [filteredEvents]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setView('event-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClubClick = (club: Club) => {
    setSelectedClub(club);
    setView('club-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setView(userRole === 'admin' ? 'admin-dashboard' : userRole === 'hod' ? 'hod-dashboard' : 'discover');
  };

  const handleLogoutRequest = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('student');
    setView('discover');
    setSearchQuery('');
    setShowLogoutConfirm(false);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const eventToAdd: Event = {
      id: Math.random().toString(36).substr(2, 9),
      ...newEvent,
      organizer: 'Tech Innovators Guild',
      status: 'Upcoming',
      registered: 0,
      category: newEvent.category as any,
      creditType: newEvent.creditType as any,
      maxCapacity: newEvent.maxCapacity || 50,
      registrationFees: newEvent.registrationFees || 'Free',
      registrationUrl: newEvent.registrationUrl,
    };
    setEventsList([eventToAdd, ...eventsList]);
    alert('Event Created Successfully!');
    setNewEvent({ title: '', subtitle: '', startDate: '', endDate: '', startTime: '', endTime: '', location: '', category: 'Workshop', creditType: 'None', description: '', image: '', maxCapacity: 50, registrationFees: '', registrationUrl: '', });
  };

  const categories = ['Workshop', 'Hackathon', 'Seminar', 'Networking', 'Cultural', 'Sports'];
  const creditTypes = ['Group 2', 'Group 3', 'EE', 'None'];

  // --- REUSABLE COMPONENTS ---
  const ClubCard: React.FC<{ club: Club }> = ({ club }) => (
    <div className="bg-white rounded-[2rem] border border-slate-200 p-8 flex flex-col md:flex-row gap-8 items-center md:items-start group hover:shadow-2xl hover:shadow-slate-200/50 hover:border-blue-200 transition-all duration-300">
      <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden flex-shrink-0 shadow-lg border border-slate-100 bg-slate-50">
        <img src={club.image} alt={club.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="flex-grow flex flex-col justify-center text-center md:text-left">
        <h2 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors tracking-tight">{club.name}</h2>
        <p className="text-slate-500 font-medium mb-6 line-clamp-2 max-w-2xl leading-relaxed">{club.description}</p>
        <div className="flex items-center justify-center md:justify-start gap-6 mb-6">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-bold"><Users className="w-4 h-4 text-blue-500" /> {club.members} Members</div>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-bold"><Target className="w-4 h-4 text-rose-500" /> {club.openPositions} Open Positions</div>
        </div>
        <div className="flex flex-wrap justify-center md:justify-start gap-2">
          {club.tags.map(tag => <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-wider border border-slate-100">{tag}</span>)}
        </div>
      </div>
      <div className="flex-shrink-0 md:self-center">
        <button onClick={() => handleClubClick(club)} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-blue-600 transition-all active:scale-95 shadow-md shadow-slate-200">View Details <ArrowRight className="w-4 h-4" /></button>
      </div>
    </div>
  );

  const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
    <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden group hover:shadow-xl transition-all h-full flex flex-col">
      <div className="h-48 overflow-hidden relative">
        <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-slate-100 shadow-sm text-[10px] font-black uppercase tracking-wider text-blue-600">{project.badge}</div>
      </div>
      <div className="p-8 flex-grow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-black text-slate-900">{project.title}</h3>
          <span className="text-[10px] font-black text-slate-400">{project.year}</span>
        </div>
        <p className="text-slate-500 text-sm font-medium leading-relaxed">{project.description}</p>
      </div>
    </div>
  );

  const RoleCard: React.FC<{ role: OpenRole }> = ({ role }) => (
    <div className="bg-white border border-slate-200 rounded-[2rem] p-8 hover:border-blue-200 hover:shadow-lg transition-all shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-black text-slate-900 mb-1 leading-tight">{role.title}</h3>
          <p className="text-sm font-bold text-blue-600">{role.openings} Open Position{role.openings > 1 ? 's' : ''}</p>
        </div>
        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl flex-shrink-0"><Rocket className="w-6 h-6" /></div>
      </div>
      <div className="space-y-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Required Skills</p>
        <div className="flex flex-wrap gap-2">
          {role.skills.map(skill => <span key={skill} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-black border border-slate-100 uppercase tracking-wide">{skill}</span>)}
        </div>
      </div>
      <button className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg active:scale-95">Apply Now</button>
    </div>
  );

  // --- HOD VIEWS ---
  const renderHODDashboard = () => (
    <div className="animate-in fade-in duration-700 pb-20">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">Department Overview</span>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Academic <span className="text-blue-600">Oversight</span>
          </h1>
        </div>
        <div className="flex gap-3">
           <button onClick={() => setView('hod-od-approvals')} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95">
             <ClipboardCheck className="w-4 h-4" /> Review ODs
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-1">
          <div className="bg-[#1e293b] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl h-full flex flex-col justify-center">
            <div className="flex justify-between items-start mb-10">
                <span className="bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2">
                    <Shield className="w-3 h-3 text-blue-400" /> Faculty Lead
                </span>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10"><User className="w-6 h-6" /></div>
            </div>
            <div className="space-y-8 relative z-10">
                <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Head of Department</p><p className="text-2xl font-black tracking-tight">{HOD_PROFILE.name}</p></div>
                <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Department</p><p className="text-xl font-bold text-blue-400">{HOD_PROFILE.department}</p></div>
                <div className="pt-8 border-t border-white/10"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Employee Identification</p><p className="font-black text-lg font-mono tracking-wider">{HOD_PROFILE.employeeId}</p></div>
            </div>
            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>
          </div>
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-xl transition-all group flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
               <div className="p-4 bg-blue-50 text-blue-600 rounded-3xl group-hover:scale-110 transition-transform"><Users className="w-8 h-8" /></div>
               <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-full border border-blue-100">Total Dept Clubs</span>
            </div>
            <div><p className="text-5xl font-black text-slate-900 tracking-tighter mb-1">12</p><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Registered Societies</p></div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-emerald-200 hover:shadow-xl transition-all group flex flex-col justify-between">
             <div className="flex justify-between items-start mb-6">
               <div className="p-4 bg-emerald-50 text-emerald-600 rounded-3xl group-hover:scale-110 transition-transform"><Activity className="w-8 h-8" /></div>
               <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full border border-emerald-100">Live Status</span>
            </div>
            <div><p className="text-5xl font-black text-slate-900 tracking-tighter mb-1">04</p><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ongoing Events Today</p></div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-amber-200 hover:shadow-xl transition-all group flex flex-col justify-between">
             <div className="flex justify-between items-start mb-6">
               <div className="p-4 bg-amber-50 text-amber-600 rounded-3xl group-hover:scale-110 transition-transform"><Clock className="w-8 h-8" /></div>
               <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black rounded-full border border-amber-100">Action Required</span>
            </div>
            <div><p className="text-5xl font-black text-slate-900 tracking-tighter mb-1">{odRequests.length}</p><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending OD Requests</p></div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-rose-200 hover:shadow-xl transition-all group flex flex-col justify-between">
             <div className="flex justify-between items-start mb-6">
               <div className="p-4 bg-rose-50 text-rose-600 rounded-3xl group-hover:scale-110 transition-transform"><ExternalLink className="w-8 h-8" /></div>
               <span className="px-3 py-1 bg-rose-50 text-rose-700 text-[10px] font-black rounded-full border border-rose-100">Quality Check</span>
            </div>
            <div><p className="text-5xl font-black text-slate-900 tracking-tighter mb-1">{externalProposals.length}</p><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">External Event Approvals</p></div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3"><LayoutDashboard className="w-5 h-5 text-blue-600" /> Recent OD Activity</h3>
              <button onClick={() => setView('hod-od-approvals')} className="text-blue-600 font-bold text-xs uppercase tracking-wider hover:underline">View All</button>
           </div>
           <div className="space-y-4">
              {odRequests.slice(0, 3).map(req => (
                <div key={req.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-white hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors shadow-sm"><User className="w-6 h-6" /></div>
                    <div><p className="font-bold text-slate-900">{req.studentName}</p><p className="text-xs text-slate-500 font-medium">3rd Year • {req.eventName}</p></div>
                  </div>
                  <div className="text-right"><span className="text-[10px] font-black text-amber-600 uppercase bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">Pending</span><p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">2h ago</p></div>
                </div>
              ))}
           </div>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
           <div className="flex justify-between items-center mb-8"><h3 className="text-xl font-black text-slate-900 flex items-center gap-3"><BarChart className="w-5 h-5 text-purple-600" /> Dept Participation</h3><button onClick={() => setView('hod-summary')} className="text-blue-600 font-bold text-xs uppercase tracking-wider hover:underline">Analytics</button></div>
           <div className="space-y-6">
              {[ { label: 'Technical Events', val: '85%' }, { label: 'Workshops', val: '62%' }, { label: 'Cultural / Extra', val: '45%' } ].map((item, i) => (
                <div key={i}><div className="flex justify-between text-sm mb-2"><span className="font-bold text-slate-700 uppercase tracking-widest text-[10px]">{item.label}</span><span className="font-black text-slate-900">{item.val}</span></div><div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden"><div className={`h-full rounded-full ${i===0?'bg-blue-600':i===1?'bg-purple-600':'bg-emerald-500'}`} style={{ width: item.val }} /></div></div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );

  const renderHODODApprovals = () => (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="mb-10 flex items-center gap-4">
        <button onClick={() => setView('hod-dashboard')} className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all"><ChevronLeft className="w-5 h-5 text-slate-600" /></button>
        <div><h1 className="text-3xl font-black text-slate-900 tracking-tight">On-Duty Approvals</h1><p className="text-slate-500 font-medium mt-1">Review and verify student OD requests for technical events.</p></div>
      </div>
      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Student Details</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Event Name</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Event Date</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {odRequests.map((request) => (
                <tr key={request.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-100">{request.studentName.charAt(0)}</div><div><p className="font-bold text-slate-900">{request.studentName}</p><p className="text-xs text-slate-400 font-black uppercase tracking-tight">{request.rollNumber}</p></div></div></td>
                  <td className="px-8 py-6"><p className="font-bold text-slate-700 text-sm">{request.eventName}</p><span className="text-[10px] font-black text-blue-500 uppercase bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">Technical</span></td>
                  <td className="px-8 py-6"><div className="flex items-center gap-2 text-slate-500 font-medium text-sm"><Calendar className="w-4 h-4" />{request.date}</div></td>
                  <td className="px-8 py-6"><div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => { setOdRequests(odRequests.filter(r => r.id !== request.id)); alert('Request Approved Successfully'); }} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 font-black text-[10px] uppercase tracking-wider border border-emerald-100 transition-all active:scale-95">Approve</button>
                       <button onClick={() => { setOdRequests(odRequests.filter(r => r.id !== request.id)); alert('Request Rejected'); }} className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 font-black text-[10px] uppercase tracking-wider border border-rose-100 transition-all active:scale-95">Reject</button>
                    </div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {odRequests.length === 0 && <div className="py-20 text-center flex flex-col items-center"><div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4"><ClipboardCheck className="w-8 h-8 text-slate-300" /></div><h3 className="text-lg font-bold text-slate-900">All caught up!</h3><p className="text-slate-500 text-sm">No pending OD requests.</p></div>}
        </div>
      </div>
    </div>
  );

  const renderHODExternalApprovals = () => (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('hod-dashboard')} className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">External Event Controls</h1>
            <p className="text-slate-500 font-medium mt-1">Manage club participation and student-led achievements outside campus.</p>
          </div>
        </div>
        
        {/* Tab Switcher */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex border border-slate-200">
           <button 
            onClick={() => setActiveApprovalTab('Proposals')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${activeApprovalTab === 'Proposals' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
           >
             <Flag className="w-3.5 h-3.5" /> Club Proposals
           </button>
           <button 
            onClick={() => setActiveApprovalTab('Certificates')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${activeApprovalTab === 'Certificates' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
           >
             <Award className="w-3.5 h-3.5" /> Student Certificates
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {activeApprovalTab === 'Proposals' ? (
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Club Proposing</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Event & Type</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Schedule & Venue</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {externalProposals.map((proposal) => (
                  <tr key={proposal.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold text-xs border border-purple-100">
                            <Users className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="font-bold text-slate-900">{proposal.clubName}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Active Club</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-700 text-sm">{proposal.eventName}</p>
                      <span className="text-[10px] font-black text-purple-600 uppercase bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">{proposal.type}</span>
                    </td>
                    <td className="px-8 py-6 text-sm">
                      <div className="flex items-center gap-2 text-slate-700 font-bold mb-1">
                         <Calendar className="w-3.5 h-3.5 text-slate-400" />
                         {proposal.date}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 font-medium">
                         <MapPin className="w-3.5 h-3.5" />
                         {proposal.venue}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                          onClick={() => {
                            setExternalProposals(externalProposals.filter(p => p.id !== proposal.id));
                            alert('External Event Approved');
                          }}
                          className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 font-black text-[10px] uppercase tracking-wider border border-emerald-100 transition-all active:scale-95"
                         >
                           Approve
                         </button>
                         <button 
                          onClick={() => {
                            setExternalProposals(externalProposals.filter(p => p.id !== proposal.id));
                            alert('External Event Rejected');
                          }}
                          className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 font-black text-[10px] uppercase tracking-wider border border-rose-100 transition-all active:scale-95"
                         >
                           Reject
                         </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Student Details</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Achievement / Event</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Proof</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {externalCertificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs border border-blue-100 shadow-sm">
                            {cert.studentName.charAt(0)}
                         </div>
                         <div>
                            <p className="font-bold text-slate-900">{cert.studentName}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-tight">{cert.rollNumber}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-700 text-sm mb-1">{cert.eventName}</p>
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase">
                        <Calendar className="w-3 h-3" /> {cert.date}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-black uppercase text-slate-500 hover:bg-white hover:text-blue-600 hover:border-blue-200 transition-all group/proof">
                        <FileSearch className="w-3.5 h-3.5 group-hover/proof:scale-110 transition-transform" />
                        View Document
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                          onClick={() => {
                            setExternalCertificates(externalCertificates.filter(c => c.id !== cert.id));
                            alert('Certificate Verified & Approved');
                          }}
                          className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 font-black text-[10px] uppercase tracking-wider border border-emerald-100 transition-all active:scale-95"
                         >
                           Verify
                         </button>
                         <button 
                          onClick={() => {
                            setExternalCertificates(externalCertificates.filter(c => c.id !== cert.id));
                            alert('Certificate Rejected');
                          }}
                          className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 font-black text-[10px] uppercase tracking-wider border border-rose-100 transition-all active:scale-95"
                         >
                           Reject
                         </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          {(activeApprovalTab === 'Proposals' ? externalProposals.length : externalCertificates.length) === 0 && (
            <div className="py-20 text-center flex flex-col items-center">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <FileCheck2 className="w-8 h-8 text-slate-300" />
               </div>
               <h3 className="text-lg font-bold text-slate-900">All caught up!</h3>
               <p className="text-slate-500 text-sm">No pending {activeApprovalTab.toLowerCase()} to review.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderHODSummary = () => (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('hod-dashboard')} className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Events Summary</h1>
            <p className="text-slate-500 font-medium mt-1">Holistic view of departmental event participation and impact.</p>
          </div>
        </div>
        <div className="flex gap-2">
           <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-all">
              <Download className="w-4 h-4" /> Export Report
           </button>
        </div>
      </div>

      {/* High-Level Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all group">
          <div className="flex justify-between items-start mb-6">
             <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform"><Layers className="w-8 h-8" /></div>
             <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full border border-blue-100 uppercase tracking-widest">Year 2024</span>
          </div>
          <div>
            <p className="text-5xl font-black text-slate-900 tracking-tighter mb-1">35</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Events Conducted</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all group">
          <div className="flex justify-between items-start mb-6">
             <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl group-hover:scale-110 transition-transform"><Code className="w-8 h-8" /></div>
             <span className="px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-black rounded-full border border-purple-100 uppercase tracking-widest">Technical</span>
          </div>
          <div>
            <p className="text-5xl font-black text-slate-900 tracking-tighter mb-1">22</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tech-Oriented Sessions</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all group">
          <div className="flex justify-between items-start mb-6">
             <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl group-hover:scale-110 transition-transform"><Music className="w-8 h-8" /></div>
             <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-black rounded-full border border-rose-100 uppercase tracking-widest">Non-Tech</span>
          </div>
          <div>
            <p className="text-5xl font-black text-slate-900 tracking-tighter mb-1">13</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cultural & Soft Skills</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <Building className="w-6 h-6 text-blue-600" /> Club Performance Distribution
            </h2>
            
            <div className="space-y-10">
              {clubSummaryData.map((club, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <h4 className="font-bold text-slate-900">{club.name}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {club.tech} Technical • {club.nonTech} Non-Technical
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-slate-900 leading-none">{club.total}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Events</p>
                    </div>
                  </div>
                  <div className="relative h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <div 
                      className={`absolute top-0 left-0 h-full ${club.color} transition-all duration-1000`} 
                      style={{ width: `${(club.total / 15) * 100}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-[#0f172a] text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden h-full">
              <div className="relative z-10">
                 <div className="p-4 bg-white/10 rounded-2xl w-fit mb-8 border border-white/10">
                    <PieIcon className="w-8 h-8 text-blue-400" />
                 </div>
                 <h3 className="text-2xl font-black mb-4">Quick Insights</h3>
                 <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">Monthly trends showing participation levels and credit allocation efficiency across the department.</p>
                 
                 <div className="space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="w-2 h-2 rounded-full bg-blue-500" />
                       <div className="flex-1">
                          <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-widest">
                             <span>Student Engagement</span>
                             <span className="text-blue-400">+15%</span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                             <div className="h-full bg-blue-500" style={{ width: '82%' }} />
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-2 h-2 rounded-full bg-emerald-500" />
                       <div className="flex-1">
                          <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-widest">
                             <span>Credit Completion</span>
                             <span className="text-emerald-400">+8%</span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-500" style={{ width: '64%' }} />
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-2 h-2 rounded-full bg-rose-500" />
                       <div className="flex-1">
                          <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-widest">
                             <span>External Approval Rate</span>
                             <span className="text-rose-400">Stable</span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                             <div className="h-full bg-rose-500" style={{ width: '45%' }} />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
           </div>
        </div>
      </div>
    </div>
  );

  // --- ADMIN VIEWS ---
  const renderAdminAttendance = () => (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="mb-10"><h1 className="text-3xl font-black text-slate-900 tracking-tight">Event Check-in</h1><p className="text-slate-500 font-medium mt-2">Scan QR codes or manually check in attendees.</p></div>
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="p-6 bg-slate-50 rounded-full mb-6"><QrCode className="w-12 h-12 text-slate-400" /></div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">QR Scanner</h3><p className="text-slate-500 max-w-md mb-8">Camera access is required to scan attendee tickets.</p>
        <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">Launch Scanner</button>
      </div>
    </div>
  );

  const renderAdminDiscover = () => {
    const nextEvent = eventsList.find(e => e.status === 'Upcoming');
    const expandedActivity: DashboardActivity[] = [ ...ADMIN_DASHBOARD_ACTIVITY, { id: 'a6', type: 'system', message: 'Database maintenance scheduled', time: '3 days ago' }, ];
    const filteredActivity = expandedActivity.filter(item => activityFilter === 'All' || (activityFilter === 'Alerts' && item.type === 'alert') || (activityFilter === 'Apps' && item.type === 'application'));

    return (
      <div className="animate-in fade-in duration-700 pb-20">
        <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2"><span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">Club Admin Console</span><span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span></div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">Tech Innovators <span className="text-blue-600">Guild</span></h1>
          </div>
          <div className="flex gap-3"><button onClick={() => setView('admin-events')} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"><Plus className="w-4 h-4" /> Create New</button></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[ { label: 'Total Reach', val: ADMIN_STATS.totalParticipants, ic: <Users className="w-6 h-6" />, col: 'blue' }, { label: 'Upcoming Events', val: eventsList.filter(e => e.status === 'Upcoming').length, ic: <Calendar className="w-6 h-6" />, col: 'indigo' }, { label: 'Open Roles', val: ADMIN_STATS.openVacancies, ic: <Briefcase className="w-6 h-6" />, col: 'rose' }, { label: 'Core Members', val: ADMIN_STATS.totalMembers, ic: <Target className="w-6 h-6" />, col: 'purple' } ].map((s, i) => (
            <div key={i} className={`bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:border-${s.col}-200 hover:shadow-md transition-all group`}>
              <div className="flex justify-between items-start mb-4"><div className={`p-3 bg-${s.col}-50 text-${s.col}-600 rounded-2xl group-hover:scale-110 transition-transform`}>{s.ic}</div>{i===0 && <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg border border-emerald-100">+12% <ArrowUpRight className="w-3 h-3" /></span>}</div>
              <p className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{s.val}</p><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
             <section><h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">Control Center</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {[ { label: 'New Event', sub: 'Publish', ic: <Plus className="w-6 h-6" />, col: 'blue', v: 'admin-events' }, { label: 'Check-in', sub: 'Scan QR', ic: <QrCode className="w-6 h-6" />, col: 'emerald', v: 'admin-attendance' }, { label: 'Recruit', sub: 'Hiring', ic: <UserPlus className="w-6 h-6" />, col: 'rose', v: 'admin-vacancies' }, { label: 'Issue Certs', sub: 'Credential', ic: <Award className="w-6 h-6" />, col: 'purple', v: 'admin-certificates' } ].map((act, i) => (
                      <button key={i} onClick={() => setView(act.v)} className={`group flex flex-col items-start p-5 bg-white border border-slate-200 rounded-[2rem] hover:border-${act.col}-200 hover:shadow-lg hover:shadow-${act.col}-50 transition-all`}>
                         <div className={`w-12 h-12 bg-${act.col}-50 rounded-2xl flex items-center justify-center text-${act.col}-600 mb-4 group-hover:scale-110 transition-transform`}>{act.ic}</div>
                         <p className="font-bold text-slate-900 text-sm">{act.label}</p><p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wide">{act.sub}</p>
                      </button>
                   ))}
                </div>
             </section>
            {nextEvent && (
              <section><h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">Priority Focus</h2>
                 <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm flex flex-col md:flex-row group hover:shadow-xl transition-all">
                    <div className="md:w-5/12 h-64 md:h-auto relative overflow-hidden"><img src={nextEvent.image} alt={nextEvent.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /><div className="absolute top-6 left-6 bg-white/95 backdrop-blur-xl rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-blue-600 border border-white/50 shadow-sm">Up Next</div></div>
                    <div className="p-8 md:p-10 flex flex-col justify-center flex-1">
                       <div className="flex items-center gap-3 mb-3 text-slate-500 text-xs font-bold uppercase tracking-widest"><span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {nextEvent.startDate}</span><span className="w-1 h-1 bg-slate-300 rounded-full" /><span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {nextEvent.startTime}</span></div>
                       <h3 className="text-3xl font-black text-slate-900 mb-6 leading-tight">{nextEvent.title}</h3>
                       <div className="flex items-center gap-8 mb-8 pb-8 border-b border-slate-100">
                          <div><p className="text-3xl font-black text-slate-900">{nextEvent.registered}</p><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Registered</p></div><div className="w-px h-10 bg-slate-100" /><div><p className="text-3xl font-black text-slate-900">{nextEvent.maxCapacity}</p><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Capacity</p></div><div className="w-px h-10 bg-slate-100" /><div><p className="text-3xl font-black text-emerald-500">{nextEvent.seatsRemaining}</p><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Left</p></div>
                       </div>
                       <div className="flex gap-4"><button onClick={() => { setSelectedEvent(nextEvent); setView('event-detail'); }} className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95">Manage Details</button><button className="px-8 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-all active:scale-95">Edit Event</button></div>
                    </div>
                 </div>
              </section>
            )}
          </div>
          <div className="lg:col-span-1 h-full">
             <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col h-[calc(100vh-200px)] min-h-[600px] sticky top-24 overflow-hidden">
                <div className="p-6 pb-0 bg-white"><div className="flex justify-between items-center mb-6"><h2 className="text-xl font-black text-slate-900 flex items-center gap-2">Activity Log</h2><button onClick={() => setShowActivityMenu(!showActivityMenu)} className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-5 h-5" /></button></div>
                   <div className="flex p-1 bg-slate-100/80 rounded-xl mb-4">{['All', 'Alerts', 'Apps'].map(f => (<button key={f} onClick={() => setActivityFilter(f as any)} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activityFilter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{f}</button>))}</div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 pt-0 custom-scrollbar relative"><div className="absolute left-[2.25rem] top-4 bottom-4 w-px bg-slate-100" />
                   <div className="space-y-4">
                   {filteredActivity.length > 0 ? filteredActivity.map((activity, idx) => (
                        <div key={idx} className="relative pl-12 py-1 group"><div className={`absolute left-0 top-1.5 w-9 h-9 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10 transition-transform group-hover:scale-110 ${activity.type === 'alert' ? 'bg-rose-100 text-rose-600' : activity.type === 'application' ? 'bg-blue-100 text-blue-600' : activity.type === 'event' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>{activity.type === 'application' && <UserPlus className="w-4 h-4" />}{activity.type === 'event' && <Calendar className="w-4 h-4" />}{activity.type === 'alert' && <AlertCircle className="w-4 h-4" />}{activity.type === 'system' && <Zap className="w-4 h-4" />}</div>
                           <div className="bg-white p-4 rounded-2xl border border-slate-100 group-hover:border-slate-200 group-hover:shadow-md transition-all"><div className="flex justify-between items-start mb-1.5"><span className={`text-[10px] font-black uppercase tracking-wider ${activity.type === 'alert' ? 'text-rose-500' : 'text-slate-400'}`}>{activity.type}</span><span className="text-[10px] font-bold text-slate-300">{activity.time}</span></div><p className={`text-sm font-medium leading-snug ${activity.highlight ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>{activity.message}</p></div>
                        </div>
                     )) : <div className="flex flex-col items-center justify-center h-48 text-slate-400 mt-10"><Inbox className="w-10 h-10 mb-2 opacity-20" /><p className="text-xs font-bold">No recent activity</p></div>}
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAdminEvents = () => (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="mb-10 flex justify-between items-end"><div><h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Events</h1><p className="text-slate-500 font-medium mt-2">Create new events and manage registrations.</p></div></div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 sticky top-24"><h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-blue-600" /> Create Event</h2>
            <form onSubmit={handleAddEvent} className="space-y-6">
              <div className="space-y-4"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><FileText className="w-3 h-3" /> Basic Details</p>
                 <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label><input required type="text" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" /></div>
                 <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label><select value={newEvent.category} onChange={e => setNewEvent({...newEvent, category: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm">{categories.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
              </div>
              <div className="space-y-4"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Calendar className="w-3 h-3" /> Schedule</p>
                 <div className="grid grid-cols-2 gap-4"><div><label className="block text-[10px] font-bold text-slate-500 mb-1">Date</label><input type="date" value={newEvent.startDate} onChange={e => setNewEvent({...newEvent, startDate: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl text-xs" /></div><div><label className="block text-[10px] font-bold text-slate-500 mb-1">Time</label><input type="time" value={newEvent.startTime} onChange={e => setNewEvent({...newEvent, startTime: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl text-xs" /></div></div>
              </div>
              <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2"><Rocket className="w-5 h-5" /> Publish Event</button>
            </form>
          </div>
        </div>
        <div className="lg:col-span-2"><h2 className="text-xl font-black text-slate-900 mb-6">Published Events</h2><div className="grid md:grid-cols-2 gap-6">{eventsList.map(e => <EventCard key={e.id} event={e} />)}</div></div>
      </div>
    </div>
  );

  const renderAdminVacancies = () => (
     <div className="animate-in fade-in duration-500 pb-20">
      <div className="mb-10"><h1 className="text-3xl font-black text-slate-900 tracking-tight">Recruitment Portal</h1><p className="text-slate-500 font-medium mt-2">Post roles and review candidate applications.</p></div>
      <div className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8"><h2 className="text-2xl font-black text-slate-900 flex items-center gap-3"><ClipboardList className="w-5 h-5" />Applications</h2>
            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden"><table className="w-full text-left"><thead className="bg-slate-50 border-b"><tr><th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Student</th><th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Role</th><th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Action</th></tr></thead>
                   <tbody className="divide-y">{applications.map(app => (<tr key={app.id} className="hover:bg-slate-50"><td className="px-6 py-4"><p className="font-bold">{app.studentName}</p><p className="text-xs text-slate-500">{app.rollNumber}</p></td><td className="px-6 py-4 text-sm font-medium">{app.roleApplied}</td><td className="px-6 py-4"><div className="flex gap-2"><button className="p-2 bg-green-50 text-green-600 rounded-lg"><Check className="w-4 h-4" /></button><button className="p-2 bg-red-50 text-red-600 rounded-lg"><X className="w-4 h-4" /></button></div></td></tr>))}</tbody></table></div>
         </div>
      </div>
     </div>
  );

  const renderAdminCertificates = () => (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="mb-10"><h1 className="text-3xl font-black text-slate-900 tracking-tight">Credential Management</h1><p className="text-slate-500 font-medium mt-2">Issue certificates and verify external achievements.</p></div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1"><div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 sticky top-24"><h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2"><Award className="w-5 h-5 text-blue-600" /> Issue</h2><form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Certificates Issued!'); }}><input type="text" className="w-full p-3 bg-slate-50 border rounded-xl text-sm" placeholder="Event Name" /><button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold">Issue Certificates</button></form></div></div>
        <div className="lg:col-span-2 space-y-8"><div><h2 className="text-xl font-black text-slate-900 mb-6">Pending Verification</h2><div className="space-y-4">{[1, 2].map((i) => (<div key={i} className="bg-white p-6 rounded-[2rem] border flex items-center gap-6"><FileText className="w-8 h-8 text-slate-400" /><div className="flex-1"><h4 className="font-bold">External Certificate</h4><p className="text-sm text-slate-500">Student Name</p></div><div className="flex gap-2"><button className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">Approve</button><button className="p-3 bg-rose-50 text-rose-600 rounded-xl">Reject</button></div></div>))}</div></div></div>
      </div>
    </div>
  );

  const renderInbox = () => (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12"><div className="flex items-center gap-5"><div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><Medal className="w-7 h-7" /></div><div><h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Credential Center</h1><p className="text-slate-500 font-medium text-sm">Manage Achievements</p></div></div><div className="bg-white border border-slate-200 p-1.5 rounded-full flex overflow-x-auto hide-scrollbar">{['All', 'Group 2', 'Group 3', 'EE', 'Offer Letters'].map(f => (<button key={f} onClick={() => setActiveCertificateFilter(f)} className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${activeCertificateFilter === f ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>{f}</button>))}</div></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{filteredAchievements.map(ach => (<div key={ach.id} className="bg-white rounded-[2rem] p-8 border border-slate-100 flex flex-col hover:shadow-xl transition-all group"><div className="flex justify-between items-start mb-6"><div className={`w-12 h-12 rounded-full flex items-center justify-center ${ach.category === 'Career' ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'}`}>{ach.category === 'Career' ? <Briefcase className="w-5 h-5" /> : <Award className="w-5 h-5" />}</div><span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">VERIFIED</span></div><div className="flex-grow space-y-2 mb-8"><h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{ach.title}</h3><p className="text-sm font-bold text-slate-400 uppercase">{ach.organization || ach.venue}</p></div><div className="flex gap-3 pt-6 border-t border-slate-50"><button onClick={() => setPreviewAchievement(ach)} className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-black">View</button><button className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-xs font-black">Download</button></div></div>))}</div>
      <button onClick={() => setShowUploadModal(true)} className="fixed bottom-10 right-10 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-40"><Plus className="w-6 h-6" /></button>
    </div>
  );

  const renderClubsListing = () => (
    <div className="animate-in fade-in duration-500 pb-20"><div className="mb-10"><h1 className="text-3xl font-black text-slate-900 tracking-tight">Campus Clubs & Roles</h1><p className="text-slate-500 font-medium mt-2">Join a community, build projects, and accelerate your career.</p></div><div className="space-y-8">{CAMPUS_CLUBS.map(club => <ClubCard key={club.id} club={club} />)}</div></div>
  );

  const renderClubDetailPage = () => {
    if (!selectedClub) return null;
    return (
      <div className="animate-in slide-in-from-bottom-8 duration-500"><div className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden mb-8 group"><img src={selectedClub.banner} alt={selectedClub.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" /><div className="absolute bottom-0 left-0 p-8 md:p-12"><div className="flex items-center gap-4 mb-4"><img src={selectedClub.image} className="w-16 h-16 rounded-2xl border-2 border-white/20 shadow-xl" /><h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">{selectedClub.name}</h1></div></div><button onClick={() => setView('vacancies')} className="absolute top-8 left-8 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white hover:text-slate-900 transition-all shadow-lg border border-white/20"><ChevronLeft className="w-5 h-5" /></button></div><div className="grid lg:grid-cols-3 gap-8 pb-20"><div className="lg:col-span-2 space-y-10"><section className="bg-white p-8 rounded-[2.5rem] border"><h3 className="text-xl font-black text-slate-900 mb-4">Our Mission</h3><p className="text-slate-600 leading-relaxed font-medium">{selectedClub.mission}</p></section><section><h3 className="text-2xl font-black text-slate-900 mb-6">Key Projects</h3><div className="grid md:grid-cols-2 gap-6">{selectedClub.projects.map(p => <ProjectCard key={p.id} project={p} />)}</div></section><section><h3 className="text-2xl font-black text-slate-900 mb-6">Open Positions</h3><div className="grid gap-6">{selectedClub.roles.map(r => <RoleCard key={r.id} role={r} />)}</div></section></div><div className="space-y-8"><div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl"><h3 className="text-xl font-black mb-2">Recruitment Drive</h3><div className="space-y-6 mt-8"><div className="flex items-start gap-4"><MapPin className="w-5 h-5" /><div><p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Venue</p><p className="font-bold">{selectedClub.interview.venue}</p></div></div></div></div></div></div></div>
    );
  };

  const renderLogin = () => (
    <div className="min-h-screen flex bg-white font-['Poppins']">
        <div className="hidden lg:flex w-1/2 bg-[#0f172a] relative items-center justify-center overflow-hidden"><div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-20" /><div className="relative z-20 p-12 text-white max-w-lg"><div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl"><span className="font-black text-3xl">C</span></div><h1 className="text-6xl font-black mb-6 tracking-tight leading-tight">Campus<br/>Connect.</h1><p className="text-xl text-slate-300 leading-relaxed font-medium">Your entire university life, organized in one place.</p></div></div>
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white"><div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-700"><div className="text-center lg:text-left mb-10"><h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Welcome Back</h2><p className="text-slate-500 font-medium">Sign in to your portal</p></div>
              <div className="bg-slate-100 p-1.5 rounded-xl flex mb-8">
                 <button onClick={() => setUserRole('student')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${userRole === 'student' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Student</button>
                 <button onClick={() => setUserRole('admin')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${userRole === 'admin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Admin</button>
              </div>
              <form onSubmit={handleLogin} className="space-y-5">
                 <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email</label><div className="relative"><input type="email" className="w-full p-4 pl-12 bg-slate-50 border rounded-xl" placeholder="name@university.edu" /><Mail className="w-5 h-5 text-slate-400 absolute left-4 top-4" /></div></div>
                 <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Password</label><div className="relative"><input type="password" className="w-full p-4 pl-12 bg-slate-50 border rounded-xl" placeholder="••••••••" /><Lock className="w-5 h-5 text-slate-400 absolute left-4 top-4" /></div></div>
                 <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 rounded border-slate-300" /><span className="text-sm font-bold text-slate-500">Remember me</span></label>
                    <a href="#" className="text-sm font-bold text-blue-600 hover:underline">Forgot?</a>
                 </div>
                 <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 mt-4"><LogIn className="w-5 h-5" />Sign in as {userRole === 'admin' ? 'Admin' : userRole === 'hod' ? 'HOD' : 'Student'}</button>
                 
                 {/* Enhanced HOD Login Section */}
                 <div className="flex justify-center pt-6">
                    <button 
                      type="button" 
                      onClick={() => { 
                        setUserRole('hod'); 
                        setIsLoggedIn(true); 
                        setView('hod-dashboard'); 
                      }} 
                      className="flex items-center gap-2 px-6 py-2.5 border border-slate-200 rounded-full text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all hover:border-slate-300 active:scale-95 shadow-sm"
                    >
                      <Shield className="w-4 h-4 text-blue-600" />
                      HOD Login
                    </button>
                 </div>
              </form>
           </div></div>
    </div>
  );

  if (!isLoggedIn) return renderLogin();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900 font-['Poppins']">
      <Header currentView={currentView} setView={setView} searchQuery={searchQuery} setSearchQuery={setSearchQuery} userType={userRole} onLogout={handleLogoutRequest} />
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8">
        {userRole === 'student' && currentView === 'discover' && (
          <div className="animate-in fade-in duration-700 pb-20">
            {/* New Welcome Header Section */}
            <div className="flex flex-col xl:flex-row gap-8 items-start xl:items-center justify-between mb-8">
              <div className="space-y-2 max-w-xl">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome, <span className="text-blue-600">Alex</span> 👋</h1>
                <p className="text-slate-500 font-medium text-lg leading-relaxed">Track your activity credits, registered events, upcoming, ongoing events and club vacancies.</p>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap gap-4 w-full xl:w-auto">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center flex-1 min-w-[140px] py-6">
                   <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3">
                     <CheckCircle2 className="w-6 h-6" />
                   </div>
                   <p className="text-3xl font-black text-emerald-600 mb-1">12</p>
                   <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Completed Events</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center flex-1 min-w-[140px] py-6">
                   <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
                     <Clock className="w-6 h-6" />
                   </div>
                   <p className="text-3xl font-black text-blue-600 mb-1">4</p>
                   <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Upcoming Events</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center flex-1 min-w-[140px] py-6">
                   <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-3">
                     <Zap className="w-6 h-6" />
                   </div>
                   <p className="text-3xl font-black text-amber-500 mb-1">11</p>
                   <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total Credits Earned</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  {/* Updated Student ID Card */}
                  <div className="bg-[#1e293b] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
                     <div className="flex justify-between items-start mb-8 relative z-10">
                        <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2">
                           <User className="w-3 h-3" /> Student ID
                        </span>
                        <button className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                           <Edit2 className="w-4 h-4 text-white" />
                        </button>
                     </div>
                     <div className="space-y-6 relative z-10">
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</p>
                           <p className="text-2xl font-black tracking-tight">{STUDENT_PROFILE.name}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Registration No.</p>
                           <div className="flex items-center gap-2">
                              <p className="text-xl font-black tracking-wider font-mono">{STUDENT_PROFILE.registerNumber}</p>
                              <Copy className="w-4 h-4 text-slate-500 cursor-pointer hover:text-white" />
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Dept</p>
                              <p className="font-bold text-sm">{STUDENT_PROFILE.department}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Year</p>
                              <p className="font-bold text-sm">{STUDENT_PROFILE.academicYear}</p>
                           </div>
                        </div>
                     </div>
                     <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
                     <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
                  </div>

                  {/* Updated QR Card */}
                  <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col items-center text-center">
                     <div className="flex items-center gap-2 mb-2 text-blue-600">
                        <QrCode className="w-5 h-5" />
                        <h3 className="font-black text-lg text-slate-900">Attendance QR</h3>
                     </div>
                     <p className="text-slate-500 text-xs font-bold mb-6">Scan at event entrance</p>
                     <div className="bg-white p-2 border-2 border-slate-100 rounded-2xl mb-8 shadow-inner">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${STUDENT_PROFILE.registerNumber}`} className="w-48 h-48 mix-blend-multiply opacity-90" />
                     </div>
                     <div className="flex gap-4 w-full">
                        <button className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                           <Download className="w-4 h-4" /> Save
                        </button>
                        <button className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                           <Share2 className="w-4 h-4" /> Share
                        </button>
                     </div>
                  </div>
                </div>

                <div className="lg:col-span-2 h-full">
                   <div className="bg-white rounded-[2rem] p-10 border border-slate-200 shadow-sm h-full">
                      <div className="mb-8">
                         <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                               <BookOpen className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900">Academic Progress</h2>
                         </div>
                         <p className="text-slate-500 font-medium ml-11">Track your progress towards graduation requirements</p>
                      </div>

                      <div className="space-y-6">
                         {CREDIT_GROUPS.map((group, index) => {
                            let icon = <Award className="w-5 h-5" />;
                            let bgColor = 'bg-pink-50';
                            let textColor = 'text-pink-600';
                            
                            if (index === 0) { // Group 2
                               bgColor = 'bg-emerald-50';
                               textColor = 'text-emerald-600';
                               icon = <Award className="w-5 h-5" />;
                            } else if (index === 1) { // Group 3
                               bgColor = 'bg-amber-50';
                               textColor = 'text-amber-600';
                               icon = <Zap className="w-5 h-5" />;
                            } else { // EE
                               bgColor = 'bg-purple-50';
                               textColor = 'text-purple-600';
                               icon = <BookOpen className="w-5 h-5" />;
                            }

                            return (
                               <div key={group.id} className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100 hover:border-slate-200 transition-all">
                                  <div className="flex justify-between items-start mb-6">
                                     <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bgColor} ${textColor}`}>
                                           {icon}
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900">{group.name.replace(' (Certs)', '').replace(' (Points)', '')} <span className="text-slate-400 font-bold text-sm">({group.id.includes('ee') ? 'Credits' : 'Certificates'})</span></h3>
                                     </div>
                                     <div className="text-xl font-black text-slate-900">
                                        {group.earned}<span className="text-slate-400">/{group.total}</span>
                                     </div>
                                  </div>
                                  
                                  <div className="w-full bg-slate-200 rounded-full h-3 mb-3 overflow-hidden">
                                     <div 
                                        className="h-full rounded-full transition-all duration-1000 ease-out" 
                                        style={{ 
                                           width: `${(group.earned/group.total)*100}%`, 
                                           backgroundColor: group.color 
                                        }} 
                                     />
                                  </div>
                                  
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                     {group.id.includes('ee') ? 'EE' : 'GROUP'}
                                  </p>
                               </div>
                            );
                         })}
                      </div>
                   </div>
                </div>
            </div>
          </div>
        )}
        
        {userRole === 'student' && currentView === 'events' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12"><div className="flex items-center gap-5"><div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><Calendar className="w-7 h-7" /></div><div><h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Events Directory</h1><p className="text-slate-500 font-medium text-sm">Discover and Join</p></div></div><div className="bg-white border border-slate-200 p-1.5 rounded-full flex overflow-x-auto hide-scrollbar shadow-sm">{['All', 'Internal', 'External', 'Registered'].map(t => (<button key={t} onClick={() => setActiveTab(t)} className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-black uppercase transition-all ${activeTab === t ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>{t === 'All' ? 'All Events' : `${t} Events`}</button>))}</div></div>
            {technicalEvents.length > 0 && (<section className="mb-16"><div className="flex items-center gap-3 mb-8 px-2"><div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><Code className="w-5 h-5" /></div><h2 className="text-2xl font-black text-slate-900 tracking-tight">Technical Events</h2><span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full border">{technicalEvents.length} Found</span></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{technicalEvents.map(e => <EventCard key={e.id} event={e} onClick={handleEventClick} />)}</div></section>)}
            {nonTechnicalEvents.length > 0 && (<section><div className="flex items-center gap-3 mb-8 px-2"><div className="p-2 bg-rose-100 text-rose-600 rounded-xl"><Music className="w-5 h-5" /></div><h2 className="text-2xl font-black text-slate-900 tracking-tight">Non-Technical Events</h2><span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full border">{nonTechnicalEvents.length} Found</span></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{nonTechnicalEvents.map(e => <EventCard key={e.id} event={e} onClick={handleEventClick} />)}</div></section>)}
          </div>
        )}
        
        {userRole === 'student' && currentView === 'inbox' && renderInbox()}
        {userRole === 'student' && currentView === 'vacancies' && renderClubsListing()}
        {currentView === 'club-detail' && renderClubDetailPage()}

        {/* HOD VIEW */}
        {userRole === 'hod' && currentView === 'hod-dashboard' && renderHODDashboard()}
        {userRole === 'hod' && currentView === 'hod-od-approvals' && renderHODODApprovals()}
        {userRole === 'hod' && currentView === 'hod-external-approvals' && renderHODExternalApprovals()}
        {userRole === 'hod' && currentView === 'hod-summary' && renderHODSummary()}

        {/* ADMIN VIEWS */}
        {userRole === 'admin' && currentView === 'admin-dashboard' && renderAdminDiscover()}
        {userRole === 'admin' && currentView === 'admin-attendance' && renderAdminAttendance()}
        {userRole === 'admin' && currentView === 'admin-certificates' && renderAdminCertificates()}
        {userRole === 'admin' && currentView === 'admin-events' && renderAdminEvents()}
        {userRole === 'admin' && currentView === 'admin-vacancies' && renderAdminVacancies()}
      </main>
      
      {/* Modals & Overlays */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setShowLogoutConfirm(false)} />
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm p-8 relative z-10 animate-in zoom-in-95 duration-200 text-center">
                <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <LogOut className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Confirm Logout</h3>
                <p className="text-slate-500 mb-8 font-medium">Are you sure you want to logout? You will need to sign in again to access your dashboard.</p>
                
                <div className="flex flex-col gap-3">
                    <button 
                      onClick={handleLogout}
                      className="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all shadow-lg active:scale-95"
                    >
                      Yes, Logout
                    </button>
                    <button 
                      onClick={() => setShowLogoutConfirm(false)}
                      className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
                    >
                      Cancel
                    </button>
                </div>
            </div>
        </div>
      )}

      {previewAchievement && (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><div className="fixed inset-0 bg-slate-900/80 backdrop-blur-lg" onClick={() => setPreviewAchievement(null)}></div><div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] p-12 text-center animate-in zoom-in-95 duration-300"><h2 className="text-3xl font-black mb-8">Certificate Preview</h2><div className="aspect-video w-full border-[12px] border-slate-900 rounded-lg p-16 bg-slate-50 flex flex-col items-center justify-between"><p className="text-blue-600 font-black tracking-widest uppercase">Certificate of Achievement</p><h3 className="text-4xl font-black">{previewAchievement.title}</h3><p className="text-slate-500 italic">Issued to: ALEX THOMPSON</p></div><button onClick={() => setPreviewAchievement(null)} className="mt-8 px-12 py-4 bg-slate-900 text-white rounded-xl font-bold">Close Preview</button></div></div>)}
      {currentView === 'event-detail' && selectedEvent && (<div className="absolute top-[80px] left-0 right-0 z-10 bg-white min-h-screen"><div className="animate-in fade-in duration-500 pb-20 bg-slate-50"><div className="w-full h-[400px] relative"><img src={selectedEvent.image} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" /><button onClick={() => setView('events')} className="absolute top-8 left-8 bg-white/20 backdrop-blur-xl border p-3 rounded-full text-white"><ChevronLeft className="w-5 h-5" /></button><div className="absolute bottom-12 left-12"><h1 className="text-5xl font-black text-white">{selectedEvent.title}</h1></div></div><div className="max-w-7xl mx-auto px-8 py-12 -mt-10 relative z-20 grid lg:grid-cols-3 gap-8"><div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border shadow-xl"><h3 className="text-xl font-black mb-6">About Event</h3><p className="text-slate-600 text-lg leading-relaxed">{selectedEvent.description}</p></div><div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border shadow-2xl h-fit"><p className="text-3xl font-black mb-8">{selectedEvent.registrationFees}</p><a href={selectedEvent.registrationUrl} target="_blank" className="block w-full py-4 bg-slate-900 text-white text-center rounded-2xl font-bold mb-4">Register Now</a></div></div></div></div>)}
    </div>
  );
};

export default App;
