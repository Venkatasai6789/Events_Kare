
import React, { useState, useMemo } from 'react';
import { Calendar, Code, Music } from 'lucide-react';
import EventCard from '../EventCard';
import { Event } from '../../types';

interface StudentEventsProps {
  eventsList: Event[];
  searchQuery: string;
  onEventClick: (event: Event) => void;
}

const StudentEvents: React.FC<StudentEventsProps> = ({ eventsList, searchQuery, onEventClick }) => {
  const [activeTab, setActiveTab] = useState('All');

  const filteredEvents = useMemo(() => {
    let filtered = eventsList;
    if (searchQuery) {
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        e.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (activeTab === 'Internal') filtered = filtered.filter(e => parseInt(e.id) % 2 === 0);
    else if (activeTab === 'External') filtered = filtered.filter(e => parseInt(e.id) % 2 !== 0);
    else if (activeTab === 'Registered') filtered = filtered.filter(e => e.isRegistered);
    
    return filtered;
  }, [activeTab, searchQuery, eventsList]);

  const technicalEvents = useMemo(() => filteredEvents.filter(e => ['Workshop', 'Hackathon', 'Seminar'].includes(e.category)), [filteredEvents]);
  const nonTechnicalEvents = useMemo(() => filteredEvents.filter(e => ['Cultural', 'Sports', 'Networking'].includes(e.category)), [filteredEvents]);

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Events Directory</h1>
            <p className="text-slate-500 font-medium text-sm">Discover and Join</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-1.5 rounded-full flex overflow-x-auto hide-scrollbar shadow-sm">
          {['All', 'Internal', 'External', 'Registered'].map(t => (
            <button 
              key={t} 
              onClick={() => setActiveTab(t)} 
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-black uppercase transition-all ${activeTab === t ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {t === 'All' ? 'All Events' : `${t} Events`}
            </button>
          ))}
        </div>
      </div>
      
      {technicalEvents.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><Code className="w-5 h-5" /></div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Technical Events</h2>
            <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full border">{technicalEvents.length} Found</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technicalEvents.map(e => <EventCard key={e.id} event={e} onClick={onEventClick} />)}
          </div>
        </section>
      )}
      
      {nonTechnicalEvents.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-xl"><Music className="w-5 h-5" /></div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Non-Technical Events</h2>
            <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full border">{nonTechnicalEvents.length} Found</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {nonTechnicalEvents.map(e => <EventCard key={e.id} event={e} onClick={onEventClick} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default StudentEvents;
