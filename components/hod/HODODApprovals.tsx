
import React from 'react';
import { ChevronLeft, Calendar, ClipboardCheck } from 'lucide-react';

interface HODODApprovalsProps {
  setView: (view: string) => void;
  odRequests: any[];
  setOdRequests: (requests: any[]) => void;
}

const HODODApprovals: React.FC<HODODApprovalsProps> = ({ setView, odRequests, setOdRequests }) => {
  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="mb-10 flex items-center gap-4">
        <button onClick={() => setView('hod-dashboard')} className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all"><ChevronLeft className="w-5 h-5 text-slate-600" /></button>
        <div><h1 className="text-3xl font-black text-slate-900 tracking-tight">On-Duty Approvals</h1><p className="text-slate-500 font-medium mt-1">Review and verify student OD requests for technical events.</p></div>
      </div>
      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Student Details</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Event Name</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Event Date</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {odRequests.map((request) => (
                <tr key={request.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-100">{request.studentName.charAt(0)}</div><div><p className="font-bold text-slate-900">{request.studentName}</p><p className="text-xs text-slate-400 font-black uppercase tracking-tight">{request.rollNumber}</p></div></div></td>
                  <td className="px-8 py-6"><p className="font-bold text-slate-700 text-sm">{request.eventName}</p><span className="text-[10px] font-black text-blue-500 uppercase bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">Technical</span></td>
                  <td className="px-8 py-6"><div className="flex items-center gap-2 text-slate-500 font-medium text-sm"><Calendar className="w-4 h-4" />{request.date}</div></td>
                  <td className="px-8 py-6"><div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => { setOdRequests(odRequests.filter(r => r.id !== request.id)); alert('Request Approved Successfully'); }} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 font-black text-[10px] uppercase tracking-wider border border-emerald-100 transition-all active:scale-95">Approve</button>
                       <button onClick={() => { setOdRequests(odRequests.filter(r => r.id !== request.id)); alert('Request Rejected'); }} className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 font-black text-[10px] uppercase tracking-wider border border-rose-100 transition-all active:scale-95">Reject</button>
                    </div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {odRequests.length === 0 && <div className="py-20 text-center flex flex-col items-center"><div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4"><ClipboardCheck className="w-8 h-8 text-slate-300" /></div><h3 className="text-lg font-bold text-slate-900">All caught up!</h3><p className="text-slate-500 text-sm">No pending OD requests.</p></div>}
        </div>
      </div>
    </div>
  );
};

export default HODODApprovals;
