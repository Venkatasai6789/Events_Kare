import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import {
  UPCOMING_EVENTS,
  JOB_APPLICATIONS,
  STUDENT_PROFILE,
  HOD_PROFILE,
} from "./constants";
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

// FA Components (formerly HOD)
import HODDashboard from "./components/hod/HODDashboard";
import HODODApprovals from "./components/hod/HODODApprovals";
import HostelPermission from "./components/hod/HostelPermission";

// Admin Components
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminEvents from "./components/admin/AdminEvents";
import AdminAttendance from "./components/admin/AdminAttendance";
import AdminCertificates from "./components/admin/AdminCertificates";
import AdminVacancies from "./components/admin/AdminVacancies";

const App: React.FC = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";
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

  // Events Filter State (Lifted Up)
  const [eventsActiveTab, setEventsActiveTab] = useState("All");

  // Data State
  const [eventsList, setEventsList] = useState<Event[]>(UPCOMING_EVENTS);
  const [applications, setApplications] =
    useState<JobApplication[]>(JOB_APPLICATIONS);

  // FA State (formerly HOD)
  const [odRequests, setOdRequests] = useState([
    {
      id: "od-1",
      studentName: "Alex Thompson",
      rollNumber: "2023CS101",
      section: "A",
      eventId: "1",
      eventName: "AI & Machine Learning Masterclass",
      date: "2024-10-12",
      status: "Pending",
    },
    {
      id: "od-2",
      studentName: "Sarah Jenkins",
      rollNumber: "2023CS105",
      section: "B",
      eventId: "2",
      eventName: "Blockchain & Web3 Summit",
      date: "2024-10-15",
      status: "Pending",
    },
    {
      id: "od-3",
      studentName: "Michael Scott",
      rollNumber: "2022CS204",
      section: "A",
      eventId: "3",
      eventName: "UX Design Sprint: Mobile First",
      date: "2024-10-20",
      status: "Pending",
    },
    {
      id: "od-4",
      studentName: "Pam Beesly",
      rollNumber: "2023CS112",
      section: "A",
      eventId: "5",
      eventName: "Cyber Security Essentials",
      date: "2024-11-05",
      status: "Pending",
    },
  ]);

  const [hostelPermissionRequests, setHostelPermissionRequests] = useState([
    {
      id: "hp-1",
      studentName: "Ananya Sharma",
      registerNumber: "2023CS118",
      section: "A",
      eventName: "24-Hour Hackathon",
      eventDateTime: "2024-11-16 18:00 - 2024-11-17 18:00",
      eventDuration: "24 hours",
      hostelName: "Girls Hostel - Block A",
      status: "Pending",
      sentToHostelHead: false,
    },
    {
      id: "hp-2",
      studentName: "Meera Iyer",
      registerNumber: "2022CS207",
      section: "A",
      eventName: "Overnight UI/UX Design Sprint",
      eventDateTime: "2024-12-03 20:00 - 2024-12-04 08:00",
      eventDuration: "12 hours",
      hostelName: "Girls Hostel - Block B",
      status: "Approved",
      sentToHostelHead: true,
    },
    {
      id: "hp-3",
      studentName: "Kavya Nair",
      registerNumber: "2023CS141",
      section: "B",
      eventName: "Night Cybersecurity CTF",
      eventDateTime: "2024-11-28 21:00 - 2024-11-29 03:00",
      eventDuration: "6 hours",
      hostelName: "Girls Hostel - Block A",
      status: "Rejected",
      sentToHostelHead: true,
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

  const handleAdminEventClick = (event: Event) => {
    setSelectedEvent(event);
    setView("admin-event-detail");
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
        ? "fa-dashboard"
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

  const sendHostelPermissionToHead = (requestId: string) => {
    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/fa/hostel-permissions/${encodeURIComponent(
            requestId
          )}/send`,
          { method: "POST" }
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to send permission request");
        }

        await fetchHostelPermissions();
        alert("Permission request sent to hostel head");
      } catch (err: any) {
        alert(err?.message || "Failed to send permission request");
      }
    })();
  };

  const fetchHostelPermissions = async () => {
    try {
      const faSection = (HOD_PROFILE as any).section as string | undefined;
      const url = new URL(`${API_BASE}/api/fa/hostel-permissions`);
      if (faSection) url.searchParams.set("section", faSection);

      const res = await fetch(url.toString());
      if (!res.ok) return;
      const data = await res.json();
      const items = (data?.hostel_permissions || []) as any[];

      setHostelPermissionRequests(
        items.map((d) => ({
          id: d.id,
          studentName: d.student_name,
          registerNumber: d.student_id,
          section: d.section,
          eventName: d.event_name,
          eventDateTime: d.event_date,
          eventDuration: d.duration,
          hostelName: d.hostel_name,
          status: d.status,
          sentToHostelHead: !!d.requested_by_fa,
        }))
      );
    } catch {
      // Keep existing in-memory state if backend isn't reachable.
    }
  };

  useEffect(() => {
    if (
      !(
        isLoggedIn &&
        userRole === "hod" &&
        currentView === "fa-hostel-permission"
      )
    )
      return;

    let cancelled = false;
    const run = async () => {
      if (cancelled) return;
      await fetchHostelPermissions();
    };

    run();
    const interval = window.setInterval(run, 8000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [API_BASE, currentView, isLoggedIn, userRole]);

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
              activeTab={
                eventsActiveTab === "Registered" ? "All" : eventsActiveTab
              }
              onTabChange={(tab) =>
                setEventsActiveTab(tab === "Registered" ? "All" : tab)
              }
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
        studentId={
          userRole === "student" ? STUDENT_PROFILE.registerNumber : undefined
        }
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
            activeTab={eventsActiveTab}
            onTabChange={setEventsActiveTab}
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

        {userRole === "admin" &&
          currentView === "admin-event-detail" &&
          selectedEvent && (
            <EventDetail
              event={selectedEvent}
              onBack={() => setView("admin-events")}
            />
          )}

        {/* FA VIEWS */}
        {userRole === "hod" && currentView === "fa-dashboard" && (
          <HODDashboard
            setView={setView}
            eventsList={eventsList}
            odRequests={odRequests}
            externalProposals={externalProposals}
          />
        )}
        {userRole === "hod" && currentView === "fa-od-approvals" && (
          <HODODApprovals
            setView={setView}
            odRequests={odRequests}
            setOdRequests={setOdRequests}
          />
        )}
        {userRole === "hod" && currentView === "fa-hostel-permission" && (
          <HostelPermission
            setView={setView}
            requests={hostelPermissionRequests}
            onSendToHostelHead={sendHostelPermissionToHead}
          />
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
          <AdminEvents
            eventsList={eventsList}
            setEventsList={setEventsList}
            onEventClick={handleAdminEventClick}
          />
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
