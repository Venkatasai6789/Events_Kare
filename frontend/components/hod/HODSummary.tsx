
import React from 'react';
import { ChevronLeft, Download, Layers, Code, Music, Building, PieChart as PieIcon } from 'lucide-react';

interface HODSummaryProps {
  setView: (view: string) => void;
  clubSummaryData: any[];
}

const HODSummary: React.FC<HODSummaryProps> = ({ setView, clubSummaryData }) => {
  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('hod-dashboard')} className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Events Summary</h1>
            <p className="text-slate-500 font-medium mt-1">Holistic view of departmental event participation and impact.</p>
          </div>
        </div>
        <div className="flex gap-2">
           <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-all">
              <Download className="w-4 h-4" /> Export Report
           </button>
        </div>
      </div>

      {/* High-Level Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all group">
          <div className="flex justify-between items-start mb-6">
             <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform"><Layers className="w-8 h-8" /></div>
             <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full border border-blue-100 uppercase tracking-widest">Year 2024</span>
          </div>
          <div>
            <p className="text-5xl font-black text-slate-900 tracking-tighter mb-1">35</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Events Conducted</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all group">
          <div className="flex justify-between items-start mb-6">
             <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl group-hover:scale-110 transition-transform"><Code className="w-8 h-8" /></div>
             <span className="px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-black rounded-full border border-purple-100 uppercase tracking-widest">Technical</span>
          </div>
          <div>
            <p className="text-5xl font-black text-slate-900 tracking-tighter mb-1">22</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tech-Oriented Sessions</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all group">
          <div className="flex justify-between items-start mb-6">
             <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl group-hover:scale-110 transition-transform"><Music className="w-8 h-8" /></div>
             <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-black rounded-full border border-rose-100 uppercase tracking-widest">Non-Tech</span>
          </div>
          <div>
            <p className="text-5xl font-black text-slate-900 tracking-tighter mb-1">13</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cultural & Soft Skills</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <Building className="w-6 h-6 text-blue-600" /> Club Performance Distribution
            </h2>
            
            <div className="space-y-10">
              {clubSummaryData.map((club, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <h4 className="font-bold text-slate-900">{club.name}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {club.tech} Technical • {club.nonTech} Non-Technical
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-slate-900 leading-none">{club.total}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Events</p>
                    </div>
                  </div>
                  <div className="relative h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <div 
                      className={`absolute top-0 left-0 h-full ${club.color} transition-all duration-1000`} 
                      style={{ width: `${(club.total / 15) * 100}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-[#0f172a] text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden h-full">
              <div className="relative z-10">
                 <div className="p-4 bg-white/10 rounded-2xl w-fit mb-8 border border-white/10">
                    <PieIcon className="w-8 h-8 text-blue-400" />
                 </div>
                 <h3 className="text-2xl font-black mb-4">Quick Insights</h3>
                 <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">Monthly trends showing participation levels and credit allocation efficiency across the department.</p>
                 
                 <div className="space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="w-2 h-2 rounded-full bg-blue-500" />
                       <div className="flex-1">
                          <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-widest">
                             <span>Student Engagement</span>
                             <span className="text-blue-400">+15%</span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                             <div className="h-full bg-blue-500" style={{ width: '82%' }} />
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-2 h-2 rounded-full bg-emerald-500" />
                       <div className="flex-1">
                          <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-widest">
                             <span>Credit Completion</span>
                             <span className="text-emerald-400">+8%</span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-500" style={{ width: '64%' }} />
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-2 h-2 rounded-full bg-rose-500" />
                       <div className="flex-1">
                          <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-widest">
                             <span>External Approval Rate</span>
                             <span className="text-rose-400">Stable</span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                             <div className="h-full bg-rose-500" style={{ width: '45%' }} />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default HODSummary;
