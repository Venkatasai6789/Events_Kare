
import React from 'react';
import { Shield, User, Users, Activity, Clock, ExternalLink, ClipboardCheck, LayoutDashboard, BarChart } from 'lucide-react';
import { HOD_PROFILE } from '../../constants';

interface HODDashboardProps {
  setView: (view: string) => void;
  odRequests: any[];
  externalProposals: any[];
}

const HODDashboard: React.FC<HODDashboardProps> = ({ setView, odRequests, externalProposals }) => {
  return (
    <div className="animate-in fade-in duration-700 pb-20">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">Department Overview</span>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Academic <span className="text-blue-600">Oversight</span>
          </h1>
        </div>
        <div className="flex gap-3">
           <button onClick={() => setView('hod-od-approvals')} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95">
             <ClipboardCheck className="w-4 h-4" /> Review ODs
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-1">
          <div className="bg-[#1e293b] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl h-full flex flex-col justify-center">
            <div className="flex justify-between items-start mb-10">
                <span className="bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2">
                    <Shield className="w-3 h-3 text-blue-400" /> Faculty Lead
                </span>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10"><User className="w-6 h-6" /></div>
            </div>
            <div className="space-y-8 relative z-10">
                <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Head of Department</p><p className="text-2xl font-black tracking-tight">{HOD_PROFILE.name}</p></div>
                <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Department</p><p className="text-xl font-bold text-blue-400">{HOD_PROFILE.department}</p></div>
                <div className="pt-8 border-t border-white/10"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Employee Identification</p><p className="font-black text-lg font-mono tracking-wider">{HOD_PROFILE.employeeId}</p></div>
            </div>
            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>
          </div>
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-xl transition-all group flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
               <div className="p-4 bg-blue-50 text-blue-600 rounded-3xl group-hover:scale-110 transition-transform"><Users className="w-8 h-8" /></div>
               <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-full border border-blue-100">Total Dept Clubs</span>
            </div>
            <div><p className="text-5xl font-black text-slate-900 tracking-tighter mb-1">12</p><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Registered Societies</p></div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-emerald-200 hover:shadow-xl transition-all group flex flex-col justify-between">
             <div className="flex justify-between items-start mb-6">
               <div className="p-4 bg-emerald-50 text-emerald-600 rounded-3xl group-hover:scale-110 transition-transform"><Activity className="w-8 h-8" /></div>
               <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full border border-emerald-100">Live Status</span>
            </div>
            <div><p className="text-5xl font-black text-slate-900 tracking-tighter mb-1">04</p><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ongoing Events Today</p></div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-amber-200 hover:shadow-xl transition-all group flex flex-col justify-between">
             <div className="flex justify-between items-start mb-6">
               <div className="p-4 bg-amber-50 text-amber-600 rounded-3xl group-hover:scale-110 transition-transform"><Clock className="w-8 h-8" /></div>
               <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black rounded-full border border-amber-100">Action Required</span>
            </div>
            <div><p className="text-5xl font-black text-slate-900 tracking-tighter mb-1">{odRequests.length}</p><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending OD Requests</p></div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-rose-200 hover:shadow-xl transition-all group flex flex-col justify-between">
             <div className="flex justify-between items-start mb-6">
               <div className="p-4 bg-rose-50 text-rose-600 rounded-3xl group-hover:scale-110 transition-transform"><ExternalLink className="w-8 h-8" /></div>
               <span className="px-3 py-1 bg-rose-50 text-rose-700 text-[10px] font-black rounded-full border border-rose-100">Quality Check</span>
            </div>
            <div><p className="text-5xl font-black text-slate-900 tracking-tighter mb-1">{externalProposals.length}</p><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">External Event Approvals</p></div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3"><LayoutDashboard className="w-5 h-5 text-blue-600" /> Recent OD Activity</h3>
              <button onClick={() => setView('hod-od-approvals')} className="text-blue-600 font-bold text-xs uppercase tracking-wider hover:underline">View All</button>
           </div>
           <div className="space-y-4">
              {odRequests.slice(0, 3).map(req => (
                <div key={req.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-white hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors shadow-sm"><User className="w-6 h-6" /></div>
                    <div><p className="font-bold text-slate-900">{req.studentName}</p><p className="text-xs text-slate-500 font-medium">3rd Year • {req.eventName}</p></div>
                  </div>
                  <div className="text-right"><span className="text-[10px] font-black text-amber-600 uppercase bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">Pending</span><p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">2h ago</p></div>
                </div>
              ))}
           </div>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
           <div className="flex justify-between items-center mb-8"><h3 className="text-xl font-black text-slate-900 flex items-center gap-3"><BarChart className="w-5 h-5 text-purple-600" /> Dept Participation</h3><button onClick={() => setView('hod-summary')} className="text-blue-600 font-bold text-xs uppercase tracking-wider hover:underline">Analytics</button></div>
           <div className="space-y-6">
              {[ { label: 'Technical Events', val: '85%' }, { label: 'Workshops', val: '62%' }, { label: 'Cultural / Extra', val: '45%' } ].map((item, i) => (
                <div key={i}><div className="flex justify-between text-sm mb-2"><span className="font-bold text-slate-700 uppercase tracking-widest text-[10px]">{item.label}</span><span className="font-black text-slate-900">{item.val}</span></div><div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden"><div className={`h-full rounded-full ${i===0?'bg-blue-600':i===1?'bg-purple-600':'bg-emerald-500'}`} style={{ width: item.val }} /></div></div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default HODDashboard;
