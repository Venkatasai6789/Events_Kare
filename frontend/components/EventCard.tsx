import React from "react";
import { MapPin, Clock, ArrowRight, Building, Zap } from "lucide-react";
import { Event } from "../types";

interface EventCardProps {
  event: Event;
  compact?: boolean;
  onClick?: (event: Event) => void;
  isPublic?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  compact = false,
  onClick,
  isPublic,
}) => {
  // Parse startDate string for day and month
  // Handle empty or invalid dates gracefully
  const startDate = event.startDate ? new Date(event.startDate) : new Date();
  const month = startDate.toLocaleString("default", { month: "short" });
  const day = startDate.getDate();

  const isExternal =
    event.type === "External" || event.eventCategory === "External";
  const canRegister = !isPublic || isExternal;

  const handleODApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert("OD request submitted successfully.");
  };

  return (
    <div
      onClick={() => onClick?.(event)}
      className="group relative bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] hover:border-blue-100 transition-all duration-300 flex flex-col h-full cursor-pointer hover:-translate-y-1"
    >
      {/* Image Area */}
      <div
        className={`${
          compact ? "h-40" : "h-48"
        } relative overflow-hidden bg-slate-100`}
      >
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <Building className="w-10 h-10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Date Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md rounded-xl p-2 text-center min-w-[50px] shadow-sm ring-1 ring-black/5">
          <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-0.5">
            {month}
          </p>
          <p className="text-lg font-black text-slate-900 leading-none">
            {day}
          </p>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          <span
            className={`px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm ${
              event.status === "Ongoing"
                ? "bg-emerald-500/90"
                : event.status === "Upcoming"
                ? "bg-blue-600/90"
                : "bg-slate-600/90"
            }`}
          >
            {event.status}
          </span>
        </div>

        {/* Fees Tag (Bottom Right) */}
        <div className="absolute bottom-3 right-3">
          {event.feeShort === "Free" || event.registrationFees === "Free" ? (
            <span className="px-3 py-1 rounded-lg bg-emerald-500 text-white text-[10px] font-bold shadow-lg tracking-wide ring-1 ring-white/20">
              FREE
            </span>
          ) : (
            <span className="px-3 py-1 rounded-lg bg-white text-slate-900 text-[10px] font-bold shadow-lg tracking-wide ring-1 ring-black/5 flex items-center gap-1">
              {event.feeShort || event.registrationFees}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow relative">
        {/* Header: Title & Organizer */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2 text-slate-500">
            <Building className="w-3 h-3" />
            <p className="text-[10px] font-bold uppercase tracking-wide truncate">
              {event.organizer || "Unknown Organizer"}
            </p>
          </div>
          <h3
            className={`font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 ${
              compact ? "text-base" : "text-lg"
            }`}
          >
            {event.title}
          </h3>
        </div>

        {/* Meta Details */}
        <div className="space-y-2 mb-6 text-slate-500 text-xs font-medium">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">
              {event.startTime} - {event.endTime}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Action Area */}
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between gap-3 group/action">
          <button className="flex-1 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider border border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600 transition-all hover:bg-blue-50">
            View Details
          </button>

          {canRegister ? (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95"
            >
              Register Now <ArrowRight className="w-3 h-3" />
            </a>
          ) : (
            <div
              onClick={(e) => e.stopPropagation()}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-[10px] font-bold leading-tight text-center max-w-[220px]"
            >
              Registration available for internal students only
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
