import React, { useEffect, useMemo, useState } from "react";
import { Calendar, Code, Music } from "lucide-react";
import EventCard from "../EventCard";
import { Event } from "../../types";

interface StudentEventsProps {
  eventsList: Event[];
  searchQuery: string;
  onEventClick: (event: Event) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const StudentEvents: React.FC<StudentEventsProps> = ({
  eventsList,
  searchQuery,
  onEventClick,
  activeTab,
  onTabChange,
}) => {
  const [serverEvents, setServerEvents] = useState<Event[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/student/events");
        const data = await res.json();
        if (!res.ok) return;

        const mapped: Event[] = (data?.events || []).map((e: any) => ({
          id:
            e.event_id ||
            `${e.club_name || "club"}-${e.event_name || "event"}-${
              e.date || ""
            }-${e.time_from || ""}`,
          title: e.event_name || "Untitled Event",
          subtitle: "",
          startDate: e.date || "",
          endDate: e.date || "",
          startTime: e.time_from || "",
          endTime: e.time_to || "",
          location: e.location || "",
          organizer: e.club_name || "Unknown Club",
          description: e.description || "",
          registrationFees: "Free",
          registrationUrl: "#",
          registered: 0,
          maxCapacity: 50,
          status: "Upcoming",
          type: e.category,
          category: (e.event_type === "Technical"
            ? "Technical Event"
            : "Cultural") as any,
          image: "",
        }));

        if (!cancelled) setServerEvents(mapped);
      } catch {
        // If the backend is unavailable, fall back to props.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const effectiveEvents = useMemo(() => {
    if (!serverEvents || serverEvents.length === 0) return eventsList;
    const merged = new Map<string, Event>();
    // Keep existing list (includes external events), then overlay server events.
    for (const ev of eventsList) merged.set(ev.id, ev);
    for (const ev of serverEvents) merged.set(ev.id, ev);
    return Array.from(merged.values());
  }, [eventsList, serverEvents]);

  const filteredEvents = useMemo(() => {
    let filtered = effectiveEvents;
    if (searchQuery) {
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeTab === "Internal")
      filtered = filtered.filter((e) => e.type !== "External");
    else if (activeTab === "External")
      filtered = filtered.filter((e) => e.type === "External");
    else if (activeTab === "Registered")
      filtered = filtered.filter((e) => e.isRegistered);

    return filtered;
  }, [activeTab, searchQuery, effectiveEvents]);

  const technicalEvents = useMemo(
    () =>
      filteredEvents.filter(
        (e) =>
          [
            "Workshop",
            "Hackathon",
            "Seminar",
            "Faculty Development Program",
            "Internship",
            "Short Term Course",
            "Conference",
            "Symposium",
            "Guest Lecture",
            "Technical Fest",
            "Webinar",
            "Online Course",
            "Project Contest",
            "Paper Presentation",
            "Value Added Course",
            "Training",
            "Events",
            "Technical Event",
          ].includes(e.category) ||
          (![
            "Cultural",
            "Sports",
            "Networking",
            "Cultural Fest",
            "Management Fest",
            "Sports Event",
          ].includes(e.category) &&
            e.type === "External")
      ),
    [filteredEvents]
  );

  const nonTechnicalEvents = useMemo(
    () =>
      filteredEvents.filter((e) =>
        [
          "Cultural",
          "Sports",
          "Networking",
          "Cultural Fest",
          "Management Fest",
          "Sports Event",
        ].includes(e.category)
      ),
    [filteredEvents]
  );

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
              Events Directory
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              Discover and Join
            </p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-1.5 rounded-full flex overflow-x-auto hide-scrollbar shadow-sm">
          {["All", "Internal", "External", "Registered"].map((t) => (
            <button
              key={t}
              onClick={() => onTabChange(t)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                activeTab === t
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {t === "All" ? "All Events" : `${t} Events`}
            </button>
          ))}
        </div>
      </div>

      {technicalEvents.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <Code className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Technical Events
            </h2>
            <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full border">
              {technicalEvents.length} Found
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technicalEvents.map((e) => (
              <EventCard key={e.id} event={e} onClick={onEventClick} />
            ))}
          </div>
        </section>
      )}

      {nonTechnicalEvents.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
              <Music className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Non-Technical Events
            </h2>
            <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full border">
              {nonTechnicalEvents.length} Found
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {nonTechnicalEvents.map((e) => (
              <EventCard key={e.id} event={e} onClick={onEventClick} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default StudentEvents;
