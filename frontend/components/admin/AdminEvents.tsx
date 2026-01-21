import React, { useState } from "react";
import { Plus, FileText, Calendar, Rocket } from "lucide-react";
import EventCard from "../EventCard";
import { Event } from "../../types";

interface AdminEventsProps {
  eventsList: Event[];
  setEventsList: (events: Event[]) => void;
  onEventClick: (event: Event) => void;
}

const AdminEvents: React.FC<AdminEventsProps> = ({
  eventsList,
  setEventsList,
  onEventClick,
}) => {
  const getAdminAuthHeaders = () => {
    const token = localStorage.getItem("admin_access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const [newEvent, setNewEvent] = useState({
    clubName: "",
    eventName: "",
    eventType: "Technical" as "Technical" | "Non-Technical",
    eventCategory: "Internal" as "Internal" | "External",
    startDate: "",
    endDate: "",
    timeFrom: "",
    timeTo: "",
    location: "",
    description: "",
    contactDetails: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toUiEvent = (apiEventId: string) => {
    const uiCategory =
      newEvent.eventType === "Technical" ? "Technical Event" : "Cultural";
    const eventToAdd: Event = {
      id: apiEventId,
      title: newEvent.eventName,
      subtitle: "",
      startDate: newEvent.startDate,
      endDate: newEvent.endDate,
      startTime: newEvent.timeFrom,
      endTime: newEvent.timeTo,
      location: newEvent.location,
      category: uiCategory as any,
      image: "",
      organizer: newEvent.clubName,
      description: newEvent.description,
      contactInfo: newEvent.contactDetails || undefined,
      registrationFees: "Free",
      registrationUrl: "#",
      registered: 0,
      maxCapacity: 50,
      status: "Upcoming",
      type: newEvent.eventCategory,
    };
    return eventToAdd;
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/admin/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify({
          club_name: newEvent.clubName,
          event_name: newEvent.eventName,
          event_type: newEvent.eventType,
          category: newEvent.eventCategory,
          start_date: newEvent.startDate,
          end_date: newEvent.endDate,
          date: newEvent.startDate,
          time_from: newEvent.timeFrom,
          time_to: newEvent.timeTo,
          location: newEvent.location,
          description: newEvent.description,
          contact_details: newEvent.contactDetails,
          created_by: newEvent.clubName,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        alert(data?.error || "Failed to create event");
        return;
      }

      const apiEventId = data?.event_id || Math.random().toString(36).slice(2);
      setEventsList([toUiEvent(apiEventId), ...eventsList]);
      alert("Event Created Successfully!");
      setNewEvent({
        clubName: "",
        eventName: "",
        eventType: "Technical",
        eventCategory: "Internal",
        startDate: "",
        endDate: "",
        timeFrom: "",
        timeTo: "",
        location: "",
        description: "",
        contactDetails: "",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Manage Events
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Create new events and manage registrations.
          </p>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" /> Create Event
            </h2>
            <form onSubmit={handleAddEvent} className="space-y-6">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-3 h-3" /> Basic Details
                </p>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Club Name
                  </label>
                  <input
                    required
                    type="text"
                    value={newEvent.clubName}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, clubName: e.target.value })
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Event Name
                  </label>
                  <input
                    required
                    type="text"
                    value={newEvent.eventName}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, eventName: e.target.value })
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Event Type
                  </label>
                  <select
                    value={newEvent.eventType}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        eventType: e.target.value as any,
                      })
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Non-Technical">Non-Technical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Event Category
                  </label>
                  <select
                    value={newEvent.eventCategory}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        eventCategory: e.target.value as any,
                      })
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="Internal">Internal</option>
                    <option value="External">External</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> Schedule
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">
                        Event Start Date
                      </label>
                      <input
                        required
                        type="date"
                        value={newEvent.startDate}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            startDate: e.target.value,
                          })
                        }
                        className="w-full p-3 bg-slate-50 border rounded-xl text-xs"
                      />
                    </div>
                    <div className="mt-3">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">
                        Event End Date
                      </label>
                      <input
                        required
                        type="date"
                        value={newEvent.endDate}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, endDate: e.target.value })
                        }
                        className="w-full p-3 bg-slate-50 border rounded-xl text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      Time (From)
                    </label>
                    <input
                      required
                      type="time"
                      value={newEvent.timeFrom}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, timeFrom: e.target.value })
                      }
                      className="w-full p-3 bg-slate-50 border rounded-xl text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      Time (To)
                    </label>
                    <input
                      required
                      type="time"
                      value={newEvent.timeTo}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, timeTo: e.target.value })
                      }
                      className="w-full p-3 bg-slate-50 border rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      Location / Venue
                    </label>
                    <input
                      required
                      type="text"
                      value={newEvent.location}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, location: e.target.value })
                      }
                      className="w-full p-3 bg-slate-50 border rounded-xl text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    Contact Details
                  </label>
                  <textarea
                    value={newEvent.contactDetails}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        contactDetails: e.target.value,
                      })
                    }
                    placeholder="Phone number / Email / Coordinator name"
                    className="w-full p-3 bg-slate-50 border rounded-xl text-xs min-h-[72px]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    Event Description
                  </label>
                  <textarea
                    required
                    value={newEvent.description}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, description: e.target.value })
                    }
                    className="w-full p-3 bg-slate-50 border rounded-xl text-xs min-h-[96px]"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Rocket className="w-5 h-5" /> Create Event
              </button>
            </form>
          </div>
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-xl font-black text-slate-900 mb-6">
            Published Events
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {eventsList.map((e) => (
              <EventCard key={e.id} event={e} onClick={onEventClick} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEvents;
