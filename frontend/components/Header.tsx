import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Bell,
  Search,
  User,
  Lock,
  LogOut,
  ChevronDown,
  Shield,
} from "lucide-react";

interface HeaderProps {
  currentView: string;
  setView: (view: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  userType: "student" | "admin" | "hod";
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentView,
  setView,
  searchQuery,
  setSearchQuery,
  userType,
  onLogout,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-focus input when expanding
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const studentNavItems = [
    { name: "Dashboard", id: "discover" },
    { name: "Events", id: "events" },
    { name: "Credential Center", id: "inbox" },
    { name: "Vacancies", id: "vacancies" },
  ];

  const adminNavItems = [
    { name: "Dashboard", id: "admin-dashboard" },
    { name: "Events", id: "admin-events" },
    { name: "Check-in", id: "admin-attendance" },
    { name: "Credentials", id: "admin-certificates" },
    { name: "Recruitment", id: "admin-vacancies" },
  ];

  const hodNavItems = [
    { name: "Dashboard", id: "hod-dashboard" },
    { name: "OD Approvals", id: "hod-od-approvals" },
    { name: "External Events Approval", id: "hod-external-approvals" },
    { name: "Events Summary", id: "hod-summary" },
  ];

  const navItems =
    userType === "admin"
      ? adminNavItems
      : userType === "hod"
      ? hodNavItems
      : studentNavItems;

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      if (userType === "student" && currentView === "discover")
        setView("events");
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm"
          : "bg-white border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          onClick={() =>
            setView(
              userType === "admin"
                ? "admin-dashboard"
                : userType === "hod"
                ? "hod-dashboard"
                : "discover"
            )
          }
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 ${
              userType === "admin" || userType === "hod"
                ? "bg-slate-900 shadow-slate-200"
                : "bg-blue-600 shadow-blue-200"
            }`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900 leading-none tracking-tight">
              Campus
            </span>
            <span
              className={`text-lg font-bold leading-none tracking-tight ${
                userType === "admin" || userType === "hod"
                  ? "text-slate-600"
                  : "text-blue-600"
              }`}
            >
              Connect
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav
          className={`hidden md:flex items-center bg-slate-50 px-2 py-1.5 rounded-full border border-slate-200/50 transition-opacity duration-300 ${
            isSearchOpen
              ? "opacity-0 pointer-events-none absolute"
              : "opacity-100 relative"
          }`}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                currentView === item.id ||
                (userType === "student" &&
                  currentView === "event-detail" &&
                  item.id === "events")
                  ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-100"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Expanding Search Bar */}
          <div
            className={`flex items-center ${
              isSearchOpen ? "bg-slate-100" : ""
            } rounded-full transition-all duration-300 ease-in-out relative`}
          >
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out flex items-center ${
                isSearchOpen ? "w-48 md:w-64 opacity-100 pr-2" : "w-0 opacity-0"
              }`}
            >
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== "events" && userType === "student")
                    setView("events");
                  if (userType === "admin" && currentView !== "admin-events")
                    setView("admin-events");
                }}
                placeholder={
                  userType === "admin"
                    ? "Search candidates, events..."
                    : "Search events..."
                }
                className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-700 pl-4 h-10 placeholder:text-slate-400"
              />
            </div>
            <button
              onClick={toggleSearch}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                isSearchOpen
                  ? "text-slate-900 bg-white shadow-sm"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              {isSearchOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>

          <button className="hidden md:flex w-10 h-10 items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 md:p-2 rounded-full hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 group"
            >
              <div
                className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-white shadow-sm ${
                  userType === "admin" || userType === "hod"
                    ? "bg-slate-900"
                    : "bg-blue-600"
                }`}
              >
                {userType === "admin" || userType === "hod" ? (
                  <Shield className="w-4 h-4" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              <ChevronDown
                className={`hidden md:block w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
                <div className="px-5 py-3 border-b border-slate-50 mb-2">
                  <p className="text-sm font-black text-slate-900 truncate">
                    {userType === "admin"
                      ? "Club Admin Access"
                      : userType === "hod"
                      ? "Department Head"
                      : "Alex Thompson"}
                  </p>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    {userType === "admin"
                      ? "Tech Innovators Guild"
                      : userType === "hod"
                      ? "HOD Access"
                      : "Student Portal"}
                  </p>
                </div>

                <div className="px-2 space-y-1">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    Change Password
                  </button>
                </div>

                <div className="mx-2 mt-3 pt-3 border-t border-slate-50">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-100 text-rose-600">
                      <LogOut className="w-4 h-4" />
                    </div>
                    Logout Account
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-20 bg-white/95 backdrop-blur-xl z-40 md:hidden animate-in fade-in duration-200">
          <div className="p-6 flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  setIsMenuOpen(false);
                }}
                className={`text-left p-4 rounded-xl text-lg font-medium transition-colors ${
                  currentView === item.id
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item.name}
              </button>
            ))}
            <div className="h-px bg-slate-100 my-4" />
            <button
              className="w-full py-4 bg-slate-900 text-white rounded-xl text-base font-bold shadow-lg"
              onClick={() => {
                setIsMenuOpen(false);
                onLogout();
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
