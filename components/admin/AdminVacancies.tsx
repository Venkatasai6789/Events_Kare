
import React from 'react';
import { ClipboardList, Check, X } from 'lucide-react';
import { JobApplication } from '../../types';

interface AdminVacanciesProps {
  applications: JobApplication[];
}

const AdminVacancies: React.FC<AdminVacanciesProps> = ({ applications }) => {
  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="mb-10"><h1 className="text-3xl font-black text-slate-900 tracking-tight">Recruitment Portal</h1><p className="text-slate-500 font-medium mt-2">Post roles and review candidate applications.</p></div>
      <div className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8"><h2 className="text-2xl font-black text-slate-900 flex items-center gap-3"><ClipboardList className="w-5 h-5" />Applications</h2>
            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden"><table className="w-full text-left"><thead className="bg-slate-50 border-b"><tr><th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Student</th><th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Role</th><th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Action</th></tr></thead>
                   <tbody className="divide-y">{applications.map(app => (<tr key={app.id} className="hover:bg-slate-50"><td className="px-6 py-4"><p className="font-bold">{app.studentName}</p><p className="text-xs text-slate-500">{app.rollNumber}</p></td><td className="px-6 py-4 text-sm font-medium">{app.roleApplied}</td><td className="px-6 py-4"><div className="flex gap-2"><button className="p-2 bg-green-50 text-green-600 rounded-lg"><Check className="w-4 h-4" /></button><button className="p-2 bg-red-50 text-red-600 rounded-lg"><X className="w-4 h-4" /></button></div></td></tr>))}</tbody></table></div>
         </div>
      </div>
     </div>
  );
};

export default AdminVacancies;
