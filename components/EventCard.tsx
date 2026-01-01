
import React from 'react';
import { Calendar, MapPin, Clock, ArrowRight, Building, Zap } from 'lucide-react';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
  compact?: boolean;
  onClick?: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, compact = false, onClick }) => {
  // Parse startDate string for day and month
  const startDate = new Date(event.startDate);
  const month = startDate.toLocaleString('default', { month: 'short' });
  const day = startDate.getDate();

  const handleODApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert("OD request submitted successfully.");
  };

  return (
    <div 
      onClick={() => onClick?.(event)} 
      className="group relative bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 hover:border-blue-200 transition-all duration-300 flex flex-col h-full cursor-pointer hover:-translate-y-1"
    >
      {/* Image Area */}
      <div className={`${compact ? 'h-48' : 'h-56'} relative overflow-hidden`}>
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        {/* Date Badge */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 text-center min-w-[60px] shadow-sm border border-white/50">
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">{month}</p>
            <p className="text-xl font-black text-slate-900 leading-none">{day}</p>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
            <span className={`px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm ${
              event.status === 'Ongoing' ? 'bg-emerald-600/80' : 
              event.status === 'Upcoming' ? 'bg-blue-600/80' : 
              'bg-slate-600/80'
            }`}>
              {event.status}
            </span>
            {event.creditType && event.creditType !== 'None' && (
              <span className="px-3 py-1.5 rounded-full backdrop-blur-md bg-amber-500/80 border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Zap className="w-3 h-3" /> {event.creditType} Credits
              </span>
            )}
        </div>

        {/* Fees Tag (Bottom Right of Image) */}
        <div className="absolute bottom-4 right-4">
          {event.registrationFees === 'Free' ? (
              <span className="px-3 py-1 rounded-lg bg-emerald-500 text-white text-[10px] font-bold shadow-lg tracking-wide border border-emerald-400">FREE</span>
          ) : (
              <span className="px-3 py-1 rounded-lg bg-white text-slate-900 text-[10px] font-bold shadow-lg tracking-wide">{event.registrationFees}</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow relative">
        {/* Organizer Info */}
        <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-[10px] border border-slate-100 text-slate-400">
              <Building className="w-3 h-3" />
            </div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide truncate max-w-[200px]">{event.organizer}</p>
        </div>

        <h3 className={`font-black text-slate-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 ${compact ? 'text-lg' : 'text-xl'}`}>
            {event.title}
        </h3>

        {/* Meta Details */}
        <div className="space-y-2.5 mb-6">
            <div className="flex items-center gap-2.5 text-slate-500 text-sm font-medium">
              <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><Clock className="w-3.5 h-3.5" /></div>
              <span className="truncate">{event.startTime} - {event.endTime}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-500 text-sm font-medium">
              <div className="p-1.5 bg-rose-50 rounded-lg text-rose-600"><MapPin className="w-3.5 h-3.5" /></div>
              <span className="truncate">{event.location}</span>
            </div>
        </div>

        {/* OD Action for Registered Events */}
        {event.isRegistered && (
          <button 
            onClick={handleODApply}
            className="w-full mb-6 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
          >
            Apply OD
          </button>
        )}

        {/* Footer / Link */}
        <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1 text-blue-600 text-xs font-bold uppercase tracking-wide">
               {event.isRegistered ? 'Registered' : 'Tap to Register'}
            </div>
            
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <ArrowRight className="w-4 h-4" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
