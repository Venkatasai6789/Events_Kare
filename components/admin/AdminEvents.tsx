
import React, { useState } from 'react';
import { Plus, FileText, Calendar, Rocket } from 'lucide-react';
import EventCard from '../EventCard';
import { Event } from '../../types';

interface AdminEventsProps {
  eventsList: Event[];
  setEventsList: (events: Event[]) => void;
}

const AdminEvents: React.FC<AdminEventsProps> = ({ eventsList, setEventsList }) => {
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

  const categories = ['Workshop', 'Hackathon', 'Seminar', 'Networking', 'Cultural', 'Sports'];

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

  return (
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
};

export default AdminEvents;
