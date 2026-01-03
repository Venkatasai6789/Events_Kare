import React, { useState } from "react";
import Header from "./components/Header";
import { UPCOMING_EVENTS, JOB_APPLICATIONS } from "./constants";
import { Event, Achievement, Club, JobApplication } from "./types";
import { LogOut, Plus } from "lucide-react";

// Components
import Login from "./components/auth/Login";

// Student Components
import StudentDashboard from "./components/student/StudentDashboard";
import StudentEvents from "./components/student/StudentEvents";
import StudentInbox from "./components/student/StudentInbox";
import StudentClubs from "./components/student/StudentClubs";
import ClubDetail from "./components/student/ClubDetail";
import EventDetail from "./components/student/EventDetail";

// HOD Components
import HODDashboard from "./components/hod/HODDashboard";
import HODODApprovals from "./components/hod/HODODApprovals";
import HODExternalApprovals from "./components/hod/HODExternalApprovals";
import HODSummary from "./components/hod/HODSummary";

// Admin Components
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminEvents from "./components/admin/AdminEvents";
import AdminAttendance from "./components/admin/AdminAttendance";
import AdminCertificates from "./components/admin/AdminCertificates";
import AdminVacancies from "./components/admin/AdminVacancies";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"student" | "admin" | "hod">(
    "student"
  );
  const [currentView, setView] = useState("events");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Data State
  const [eventsList, setEventsList] = useState<Event[]>(UPCOMING_EVENTS);
  const [applications, setApplications] =
    useState<JobApplication[]>(JOB_APPLICATIONS);

  // HOD State
  const [odRequests, setOdRequests] = useState([
    {
      id: "od-1",
      studentName: "Alex Thompson",
      rollNumber: "2023CS101",
      eventName: "AI & ML Masterclass",
      date: "2024-10-12",
      status: "Pending",
    },
    {
      id: "od-2",
      studentName: "Sarah Jenkins",
      rollNumber: "2023CS105",
      eventName: "Blockchain Summit",
      date: "2024-10-15",
      status: "Pending",
    },
    {
      id: "od-3",
      studentName: "Michael Scott",
      rollNumber: "2022CS204",
      eventName: "UX Design Sprint",
      date: "2024-10-20",
      status: "Pending",
    },
    {
      id: "od-4",
      studentName: "Pam Beesly",
      rollNumber: "2023CS112",
      eventName: "Cyber Security Essentials",
      date: "2024-11-05",
      status: "Pending",
    },
  ]);

  const [externalProposals, setExternalProposals] = useState([
    {
      id: "ep-1",
      clubName: "Tech Innovators Guild",
      eventName: "Regional Code-A-Thon",
      date: "2024-11-20",
      venue: "Convention Center",
      type: "Technical",
    },
    {
      id: "ep-2",
      clubName: "Design Dynamics",
      eventName: "State Design Expo",
      date: "2024-11-25",
      venue: "National Arts Gallery",
      type: "Exhibition",
    },
    {
      id: "ep-3",
      clubName: "Marketing Mavericks",
      eventName: "Startup Pitch 2024",
      date: "2024-12-02",
      venue: "Tech Park Auditorium",
      type: "Networking",
    },
    {
      id: "ep-4",
      clubName: "Eco Club",
      eventName: "Global Green Summit",
      date: "2024-12-10",
      venue: "Green City Hub",
      type: "Conference",
    },
  ]);

  const [externalCertificates, setExternalCertificates] = useState([
    {
      id: "ec-1",
      studentName: "Alex Thompson",
      rollNumber: "2023CS101",
      eventName: "AWS Cloud Foundations",
      date: "2024-09-15",
      proof: "aws_cert_01.pdf",
      status: "Pending",
    },
    {
      id: "ec-2",
      studentName: "Sarah Jenkins",
      rollNumber: "2023CS105",
      eventName: "Google HashCode 2024",
      date: "2024-10-01",
      proof: "hashcode_rank.png",
      status: "Pending",
    },
    {
      id: "ec-3",
      studentName: "Michael Scott",
      rollNumber: "2022CS204",
      eventName: "UI/UX Design Masterclass",
      date: "2024-09-28",
      proof: "design_cert.pdf",
      status: "Pending",
    },
    {
      id: "ec-4",
      studentName: "Jim Halpert",
      rollNumber: "2023CS120",
      eventName: "Ethical Hacking Workshop",
      date: "2024-10-10",
      proof: "cyber_security.pdf",
      status: "Pending",
    },
  ]);

  const clubSummaryData = [
    {
      name: "Tech Innovators Guild",
      total: 12,
      tech: 10,
      nonTech: 2,
      color: "bg-blue-500",
    },
    {
      name: "Design Dynamics",
      total: 8,
      tech: 5,
      nonTech: 3,
      color: "bg-indigo-500",
    },
    {
      name: "Marketing Mavericks",
      total: 6,
      tech: 1,
      nonTech: 5,
      color: "bg-rose-500",
    },
    {
      name: "Eco Club",
      total: 5,
      tech: 2,
      nonTech: 3,
      color: "bg-emerald-500",
    },
    {
      name: "Entrepreneurship Cell",
      total: 4,
      tech: 2,
      nonTech: 2,
      color: "bg-amber-500",
    },
  ];

  // Admin Specific State
  const [activityFilter, setActivityFilter] = useState<
    "All" | "Alerts" | "System" | "Apps"
  >("All");
  const [showActivityMenu, setShowActivityMenu] = useState(false);

  // Certificate Preview State
  const [previewAchievement, setPreviewAchievement] =
    useState<Achievement | null>(null);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setView("event-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClubClick = (club: Club) => {
    setSelectedClub(club);
    setView("club-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogin = (role: "student" | "admin" | "hod") => {
    setUserRole(role);
    setIsLoggedIn(true);
    setView(
      role === "admin"
        ? "admin-dashboard"
        : role === "hod"
        ? "hod-dashboard"
        : "discover"
    );
  };

  const handleLogoutRequest = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole("student");
    setView("discover");
    setSearchQuery("");
    setShowLogoutConfirm(false);
  };

  if (!isLoggedIn) {
    if (currentView === "login") return <Login onLogin={handleLogin} />;
    if (currentView !== "events" && currentView !== "event-detail") {
      return <Login onLogin={handleLogin} />;
    }

    const setPublicView = (view: string) => {
      if (view === "events") return setView("events");
      if (view === "event-detail") return setView("event-detail");
      setView("login");
    };

    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900 font-['Poppins']">
        <Header
          currentView={currentView}
          setView={setPublicView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          userType="student"
          onLogout={() => {}}
          showLoginButton
          onLogin={() => setView("login")}
        />
        <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8">
          {currentView === "event-detail" && selectedEvent ? (
            <EventDetail
              event={selectedEvent}
              onBack={() => setView("events")}
              isPublic
            />
          ) : (
            <StudentEvents
              eventsList={eventsList}
              searchQuery={searchQuery}
              onEventClick={handleEventClick}
              isPublic
            />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900 font-['Poppins']">
      <Header
        currentView={currentView}
        setView={setView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        userType={userRole}
        onLogout={handleLogoutRequest}
      />
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8">
        {/* STUDENT VIEWS */}
        {userRole === "student" && currentView === "discover" && (
          <StudentDashboard setView={setView} />
        )}

        {userRole === "student" && currentView === "events" && (
          <StudentEvents
            eventsList={eventsList}
            searchQuery={searchQuery}
            onEventClick={handleEventClick}
          />
        )}

        {userRole === "student" && currentView === "inbox" && (
          <StudentInbox
            onUploadClick={() => setShowUploadModal(true)}
            setPreviewAchievement={setPreviewAchievement}
          />
        )}

        {userRole === "student" && currentView === "vacancies" && (
          <StudentClubs onClubClick={handleClubClick} />
        )}

        {/* SHARED / DETAIL VIEWS */}
        {currentView === "club-detail" && selectedClub && (
          <ClubDetail club={selectedClub} onBack={() => setView("vacancies")} />
        )}

        {currentView === "event-detail" && selectedEvent && (
          <EventDetail event={selectedEvent} onBack={() => setView("events")} />
        )}

        {/* HOD VIEWS */}
        {userRole === "hod" && currentView === "hod-dashboard" && (
          <HODDashboard
            setView={setView}
            odRequests={odRequests}
            externalProposals={externalProposals}
          />
        )}
        {userRole === "hod" && currentView === "hod-od-approvals" && (
          <HODODApprovals
            setView={setView}
            odRequests={odRequests}
            setOdRequests={setOdRequests}
          />
        )}
        {userRole === "hod" && currentView === "hod-external-approvals" && (
          <HODExternalApprovals
            setView={setView}
            externalProposals={externalProposals}
            setExternalProposals={setExternalProposals}
            externalCertificates={externalCertificates}
            setExternalCertificates={setExternalCertificates}
          />
        )}
        {userRole === "hod" && currentView === "hod-summary" && (
          <HODSummary setView={setView} clubSummaryData={clubSummaryData} />
        )}

        {/* ADMIN VIEWS */}
        {userRole === "admin" && currentView === "admin-dashboard" && (
          <AdminDashboard
            setView={setView}
            eventsList={eventsList}
            setSelectedEvent={setSelectedEvent}
            activityFilter={activityFilter}
            setActivityFilter={setActivityFilter}
            showActivityMenu={showActivityMenu}
            setShowActivityMenu={setShowActivityMenu}
          />
        )}
        {userRole === "admin" && currentView === "admin-attendance" && (
          <AdminAttendance />
        )}
        {userRole === "admin" && currentView === "admin-certificates" && (
          <AdminCertificates />
        )}
        {userRole === "admin" && currentView === "admin-events" && (
          <AdminEvents eventsList={eventsList} setEventsList={setEventsList} />
        )}
        {userRole === "admin" && currentView === "admin-vacancies" && (
          <AdminVacancies applications={applications} />
        )}
      </main>

      {/* Modals & Overlays */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm p-8 relative z-10 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogOut className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">
              Confirm Logout
            </h3>
            <p className="text-slate-500 mb-8 font-medium">
              Are you sure you want to logout? You will need to sign in again to
              access your dashboard.
            </p>

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

      {previewAchievement && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-lg"
            onClick={() => setPreviewAchievement(null)}
          ></div>
          <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] p-12 text-center animate-in zoom-in-95 duration-300">
            <h2 className="text-3xl font-black mb-8">Certificate Preview</h2>
            <div className="aspect-video w-full border-[12px] border-slate-900 rounded-lg p-16 bg-slate-50 flex flex-col items-center justify-between">
              <p className="text-blue-600 font-black tracking-widest uppercase">
                Certificate of Achievement
              </p>
              <h3 className="text-4xl font-black">
                {previewAchievement.title}
              </h3>
              <p className="text-slate-500 italic">Issued to: ALEX THOMPSON</p>
            </div>
            <button
              onClick={() => setPreviewAchievement(null)}
              className="mt-8 px-12 py-4 bg-slate-900 text-white rounded-xl font-bold"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
