
import React from 'react';
import { QrCode } from 'lucide-react';

const AdminAttendance: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="mb-10"><h1 className="text-3xl font-black text-slate-900 tracking-tight">Event Check-in</h1><p className="text-slate-500 font-medium mt-2">Scan QR codes or manually check in attendees.</p></div>
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="p-6 bg-slate-50 rounded-full mb-6"><QrCode className="w-12 h-12 text-slate-400" /></div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">QR Scanner</h3><p className="text-slate-500 max-w-md mb-8">Camera access is required to scan attendee tickets.</p>
        <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">Launch Scanner</button>
      </div>
    </div>
  );
};

export default AdminAttendance;
