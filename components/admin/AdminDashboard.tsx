
import React from 'react';
import { Plus, Users, Calendar, Briefcase, Target, ArrowUpRight, QrCode, UserPlus, Award, Clock, MoreHorizontal, Inbox, AlertCircle, Zap } from 'lucide-react';
import { ADMIN_STATS, ADMIN_DASHBOARD_ACTIVITY } from '../../constants';
import { Event, DashboardActivity } from '../../types';

interface AdminDashboardProps {
  setView: (view: string) => void;
  eventsList: Event[];
  setSelectedEvent: (event: Event) => void;
  activityFilter: 'All' | 'Alerts' | 'System' | 'Apps';
  setActivityFilter: (filter: 'All' | 'Alerts' | 'System' | 'Apps') => void;
  showActivityMenu: boolean;
  setShowActivityMenu: (show: boolean) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  setView, 
  eventsList, 
  setSelectedEvent, 
  activityFilter, 
  setActivityFilter,
  showActivityMenu,
  setShowActivityMenu
}) => {
  const nextEvent = eventsList.find(e => e.status === 'Upcoming');
  const expandedActivity: DashboardActivity[] = [ ...ADMIN_DASHBOARD_ACTIVITY, { id: 'a6', type: 'system', message: 'Database maintenance scheduled', time: '3 days ago' }, ];
  const filteredActivity = expandedActivity.filter(item => activityFilter === 'All' || (activityFilter === 'Alerts' && item.type === 'alert') || (activityFilter === 'Apps' && item.type === 'application'));

  return (
    <div className="animate-in fade-in duration-700 pb-20">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2"><span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">Club Admin Console</span><span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span></div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">Tech Innovators <span className="text-blue-600">Guild</span></h1>
        </div>
        <div className="flex gap-3"><button onClick={() => setView('admin-events')} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"><Plus className="w-4 h-4" /> Create New</button></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[ { label: 'Total Reach', val: ADMIN_STATS.totalParticipants, ic: <Users className="w-6 h-6" />, col: 'blue' }, { label: 'Upcoming Events', val: eventsList.filter(e => e.status === 'Upcoming').length, ic: <Calendar className="w-6 h-6" />, col: 'indigo' }, { label: 'Open Roles', val: ADMIN_STATS.openVacancies, ic: <Briefcase className="w-6 h-6" />, col: 'rose' }, { label: 'Core Members', val: ADMIN_STATS.totalMembers, ic: <Target className="w-6 h-6" />, col: 'purple' } ].map((s, i) => (
          <div key={i} className={`bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:border-${s.col}-200 hover:shadow-md transition-all group`}>
            <div className="flex justify-between items-start mb-4"><div className={`p-3 bg-${s.col}-50 text-${s.col}-600 rounded-2xl group-hover:scale-110 transition-transform`}>{s.ic}</div>{i===0 && <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg border border-emerald-100">+12% <ArrowUpRight className="w-3 h-3" /></span>}</div>
            <p className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{s.val}</p><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <section><h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">Control Center</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {[ { label: 'New Event', sub: 'Publish', ic: <Plus className="w-6 h-6" />, col: 'blue', v: 'admin-events' }, { label: 'Check-in', sub: 'Scan QR', ic: <QrCode className="w-6 h-6" />, col: 'emerald', v: 'admin-attendance' }, { label: 'Recruit', sub: 'Hiring', ic: <UserPlus className="w-6 h-6" />, col: 'rose', v: 'admin-vacancies' }, { label: 'Issue Certs', sub: 'Credential', ic: <Award className="w-6 h-6" />, col: 'purple', v: 'admin-certificates' } ].map((act, i) => (
                    <button key={i} onClick={() => setView(act.v)} className={`group flex flex-col items-start p-5 bg-white border border-slate-200 rounded-[2rem] hover:border-${act.col}-200 hover:shadow-lg hover:shadow-${act.col}-50 transition-all`}>
                       <div className={`w-12 h-12 bg-${act.col}-50 rounded-2xl flex items-center justify-center text-${act.col}-600 mb-4 group-hover:scale-110 transition-transform`}>{act.ic}</div>
                       <p className="font-bold text-slate-900 text-sm">{act.label}</p><p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wide">{act.sub}</p>
                    </button>
                 ))}
              </div>
           </section>
          {nextEvent && (
            <section><h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">Priority Focus</h2>
               <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm flex flex-col md:flex-row group hover:shadow-xl transition-all">
                  <div className="md:w-5/12 h-64 md:h-auto relative overflow-hidden"><img src={nextEvent.image} alt={nextEvent.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /><div className="absolute top-6 left-6 bg-white/95 backdrop-blur-xl rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-blue-600 border border-white/50 shadow-sm">Up Next</div></div>
                  <div className="p-8 md:p-10 flex flex-col justify-center flex-1">
                     <div className="flex items-center gap-3 mb-3 text-slate-500 text-xs font-bold uppercase tracking-widest"><span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {nextEvent.startDate}</span><span className="w-1 h-1 bg-slate-300 rounded-full" /><span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {nextEvent.startTime}</span></div>
                     <h3 className="text-3xl font-black text-slate-900 mb-6 leading-tight">{nextEvent.title}</h3>
                     <div className="flex items-center gap-8 mb-8 pb-8 border-b border-slate-100">
                        <div><p className="text-3xl font-black text-slate-900">{nextEvent.registered}</p><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Registered</p></div><div className="w-px h-10 bg-slate-100" /><div><p className="text-3xl font-black text-slate-900">{nextEvent.maxCapacity}</p><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Capacity</p></div><div className="w-px h-10 bg-slate-100" /><div><p className="text-3xl font-black text-emerald-500">{nextEvent.seatsRemaining}</p><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Left</p></div>
                     </div>
                     <div className="flex gap-4"><button onClick={() => { setSelectedEvent(nextEvent); setView('event-detail'); }} className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95">Manage Details</button><button className="px-8 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-all active:scale-95">Edit Event</button></div>
                  </div>
               </div>
            </section>
          )}
        </div>
        <div className="lg:col-span-1 h-full">
           <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col h-[calc(100vh-200px)] min-h-[600px] sticky top-24 overflow-hidden">
              <div className="p-6 pb-0 bg-white"><div className="flex justify-between items-center mb-6"><h2 className="text-xl font-black text-slate-900 flex items-center gap-2">Activity Log</h2><button onClick={() => setShowActivityMenu(!showActivityMenu)} className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-5 h-5" /></button></div>
                 <div className="flex p-1 bg-slate-100/80 rounded-xl mb-4">{['All', 'Alerts', 'Apps'].map(f => (<button key={f} onClick={() => setActivityFilter(f as any)} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activityFilter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{f}</button>))}</div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 pt-0 custom-scrollbar relative"><div className="absolute left-[2.25rem] top-4 bottom-4 w-px bg-slate-100" />
                 <div className="space-y-4">
                 {filteredActivity.length > 0 ? filteredActivity.map((activity, idx) => (
                      <div key={idx} className="relative pl-12 py-1 group"><div className={`absolute left-0 top-1.5 w-9 h-9 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10 transition-transform group-hover:scale-110 ${activity.type === 'alert' ? 'bg-rose-100 text-rose-600' : activity.type === 'application' ? 'bg-blue-100 text-blue-600' : activity.type === 'event' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>{activity.type === 'application' && <UserPlus className="w-4 h-4" />}{activity.type === 'event' && <Calendar className="w-4 h-4" />}{activity.type === 'alert' && <AlertCircle className="w-4 h-4" />}{activity.type === 'system' && <Zap className="w-4 h-4" />}</div>
                         <div className="bg-white p-4 rounded-2xl border border-slate-100 group-hover:border-slate-200 group-hover:shadow-md transition-all"><div className="flex justify-between items-start mb-1.5"><span className={`text-[10px] font-black uppercase tracking-wider ${activity.type === 'alert' ? 'text-rose-500' : 'text-slate-400'}`}>{activity.type}</span><span className="text-[10px] font-bold text-slate-300">{activity.time}</span></div><p className={`text-sm font-medium leading-snug ${activity.highlight ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>{activity.message}</p></div>
                      </div>
                   )) : <div className="flex flex-col items-center justify-center h-48 text-slate-400 mt-10"><Inbox className="w-10 h-10 mb-2 opacity-20" /><p className="text-xs font-bold">No recent activity</p></div>}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
