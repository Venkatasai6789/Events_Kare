
import React from 'react';
import { Award, FileText } from 'lucide-react';

const AdminCertificates: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="mb-10"><h1 className="text-3xl font-black text-slate-900 tracking-tight">Credential Management</h1><p className="text-slate-500 font-medium mt-2">Issue certificates and verify external achievements.</p></div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1"><div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 sticky top-24"><h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2"><Award className="w-5 h-5 text-blue-600" /> Issue</h2><form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Certificates Issued!'); }}><input type="text" className="w-full p-3 bg-slate-50 border rounded-xl text-sm" placeholder="Event Name" /><button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold">Issue Certificates</button></form></div></div>
        <div className="lg:col-span-2 space-y-8"><div><h2 className="text-xl font-black text-slate-900 mb-6">Pending Verification</h2><div className="space-y-4">{[1, 2].map((i) => (<div key={i} className="bg-white p-6 rounded-[2rem] border flex items-center gap-6"><FileText className="w-8 h-8 text-slate-400" /><div className="flex-1"><h4 className="font-bold">External Certificate</h4><p className="text-sm text-slate-500">Student Name</p></div><div className="flex gap-2"><button className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">Approve</button><button className="p-3 bg-rose-50 text-rose-600 rounded-xl">Reject</button></div></div>))}</div></div></div>
      </div>
    </div>
  );
};

export default AdminCertificates;
