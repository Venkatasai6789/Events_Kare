import React from "react";
import {
  ChevronLeft,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Building2,
  Users,
  Info,
  CreditCard,
  ExternalLink,
  Mail,
  Phone,
} from "lucide-react";
import { Event } from "../../types";

interface EventDetailProps {
  event: Event;
  onBack: () => void;
}

const EventDetail: React.FC<EventDetailProps> = ({ event, onBack }) => {
  // Format dates
  const startDate = event.startDate
    ? new Date(event.startDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date TBA";

  const venueText = (event.venueAddress || event.location || "").trim();
  const eventTypeLabel =
    event.eventType ||
    (event.category === "Technical Event"
      ? "Technical"
      : event.category
      ? "Non-Technical"
      : "");
  const eventCategoryLabel = event.eventCategory || event.type || "";

  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isTagsExpanded, setIsTagsExpanded] = React.useState(false);

  return (
    <div className="animate-in slide-in-from-bottom-8 duration-500">
      {/* Hero Section - Matching ClubDetail */}
      <div className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden mb-8 group bg-slate-900">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-blue-900/50">
              {event.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/20">
              {event.status}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight max-w-4xl">
            {event.title}
          </h1>
        </div>

        <button
          onClick={onBack}
          className="absolute top-8 left-8 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white hover:text-slate-900 transition-all shadow-lg border border-white/20 group-hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Content Grid - 2/3 + 1/3 Layout */}
      <div className="grid lg:grid-cols-3 gap-8 pb-20">
        {/* Main Content (Left) */}
        <div className="lg:col-span-2 space-y-10">
          {/* About */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Info className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">About Event</h3>
            </div>
            <div
              className={`prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line break-words font-medium text-base relative ${
                !isExpanded ? "max-h-48 overflow-hidden" : ""
              }`}
            >
              {event.description}
              {!isExpanded && (
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/90 to-transparent flex items-end justify-center pb-2" />
              )}
            </div>
            {event.description && event.description.trim().length > 0 && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="px-6 py-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 flex items-center gap-2"
                >
                  {isExpanded ? "Show Less" : "Show Full Description"}
                </button>
              </div>
            )}
          </section>

          {/* Registration Details / Fees - Only show if valid content exists */}
          {(event.feeDetails || event.registrationFees) &&
            event.feeDetails !== "N/A" &&
            event.registrationFees !== "N/A" && (
              <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    Registration Details
                  </h3>
                </div>
                <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-line font-medium bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  {event.feeDetails || event.registrationFees}
                </div>
              </section>
            )}

          {/* Departments / Who can apply */}
          {event.departments && event.departments.length > 0 && (
            <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  Who Can Apply
                </h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {event.departments
                  .slice(0, isTagsExpanded ? undefined : 15)
                  .map((dept, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-slate-100 rounded-xl text-slate-600 text-[11px] font-black uppercase tracking-wider hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-default border border-transparent hover:border-purple-100"
                    >
                      {dept}
                    </span>
                  ))}

                {!isTagsExpanded && event.departments.length > 15 && (
                  <button
                    onClick={() => setIsTagsExpanded(true)}
                    className="px-4 py-2 bg-slate-50 rounded-xl text-slate-500 text-[11px] font-black uppercase tracking-wider hover:bg-slate-100 border border-slate-200 transition-all active:scale-95"
                  >
                    + {event.departments.length - 15} More
                  </button>
                )}

                {isTagsExpanded && (
                  <button
                    onClick={() => setIsTagsExpanded(false)}
                    className="px-4 py-2 bg-slate-50 rounded-xl text-slate-500 text-[11px] font-black uppercase tracking-wider hover:bg-slate-100 border border-slate-200 transition-all active:scale-95"
                  >
                    Show Less
                  </button>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar (Right) */}
        <div className="space-y-8">
          {/* Registration Card (Dark Style like Recruitment Drive) */}
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-2">Registration</h3>

              <div className="mb-8 mt-6">
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-2">
                  FEE
                </p>
                <div className="text-4xl font-black text-white tracking-tight">
                  {event.feeShort === "Free" ? (
                    <span className="text-emerald-400">FREE</span>
                  ) : (
                    event.feeShort || "Paid"
                  )}
                </div>
              </div>

              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all active:scale-95 shadow-lg group-hover:shadow-blue-900/20"
              >
                Register Now <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Info Card */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
            {/* Date & Time */}
            <div>
              <div className="flex items-center gap-3 mb-3 text-slate-900">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-black text-sm">Date & Time</span>
              </div>
              <div className="space-y-2 pl-8">
                <p className="text-slate-600 text-sm font-medium">
                  {event.startDate &&
                  event.endDate &&
                  event.startDate !== event.endDate ? (
                    <>
                      {new Date(event.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                      {" - "}
                      {new Date(event.endDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </>
                  ) : (
                    startDate
                  )}
                </p>
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wide">
                  <Clock className="w-3 h-3" /> {event.startTime} -{" "}
                  {event.endTime}
                </div>

                {/* Registration Deadline */}
                {event.deadline && (
                  <div className="mt-2 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg inline-block border border-rose-100">
                    Last Date: {event.deadline}
                  </div>
                )}
              </div>
            </div>

            {/* Organizer */}
            <div>
              <div className="flex items-center gap-3 mb-3 text-slate-900">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <span className="font-black text-sm">Organizer</span>
              </div>
              <p className="text-slate-600 text-sm pl-8 font-medium leading-snug">
                {event.organizer}
              </p>
            </div>

            {/* Event Type & Category */}
            {(eventTypeLabel || eventCategoryLabel) && (
              <div>
                <div className="flex items-center gap-3 mb-3 text-slate-900">
                  <Info className="w-5 h-5 text-blue-600" />
                  <span className="font-black text-sm">Event Info</span>
                </div>
                <div className="pl-8 space-y-1">
                  {eventTypeLabel && (
                    <p className="text-slate-600 text-sm font-medium leading-snug break-words">
                      Type: {eventTypeLabel}
                    </p>
                  )}
                  {eventCategoryLabel && (
                    <p className="text-slate-600 text-sm font-medium leading-snug break-words">
                      Category: {eventCategoryLabel}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Venue */}
            {venueText && venueText !== "N/A" && (
              <div>
                <div className="flex items-center gap-3 mb-3 text-slate-900">
                  <MapPin className="w-5 h-5 text-rose-600" />
                  <span className="font-black text-sm">Venue</span>
                </div>
                <div className="pl-8">
                  <p className="text-slate-600 text-sm font-medium leading-snug break-words">
                    {venueText}
                  </p>
                  {event.venueMapUrl && (
                    <a
                      href={event.venueMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" /> View on Google Maps
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Contact */}
            {event.contactInfo && event.contactInfo !== "N/A" && (
              <div>
                <div className="flex items-center gap-3 mb-3 text-slate-900">
                  <Phone className="w-5 h-5 text-emerald-600" />
                  <span className="font-black text-sm">Contact</span>
                </div>
                <div className="pl-8">
                  {/* Primitive parsing for contact info to split emails/phones if they are messy */}
                  {event.contactInfo.split(/(?:,|\n|&|and)\s+/).map(
                    (line, i) =>
                      line.trim().length > 3 && (
                        <p
                          key={i}
                          className="text-slate-600 text-sm font-medium leading-relaxed break-words mb-1"
                        >
                          {line.trim()}
                        </p>
                      )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
