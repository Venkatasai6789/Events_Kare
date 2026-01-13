import React from "react";
import { ChevronLeft, CalendarClock, Send, FileCheck2 } from "lucide-react";

type HostelPermissionStatus = "Pending" | "Approved" | "Rejected";

type HostelPermissionRequest = {
  id: string;
  studentName: string;
  registerNumber: string;
  section: string;
  eventName: string;
  eventDateTime: string;
  eventDuration: string;
  hostelName: string;
  status: HostelPermissionStatus;
  sentToHostelHead?: boolean;
};

interface HostelPermissionProps {
  setView: (view: string) => void;
  requests: HostelPermissionRequest[];
  onSendToHostelHead: (requestId: string) => void;
}

const statusStyles: Record<HostelPermissionStatus, string> = {
  Pending: "text-amber-600 bg-amber-50 border-amber-100",
  Approved: "text-emerald-600 bg-emerald-50 border-emerald-100",
  Rejected: "text-rose-600 bg-rose-50 border-rose-100",
};

const HostelPermission: React.FC<HostelPermissionProps> = ({
  setView,
  requests,
  onSendToHostelHead,
}) => {
  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setView("fa-dashboard")}
            className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Hostel Permission
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Send late-night event permission requests to the hostel head and
              track approval status.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                  Date &amp; Time
                </th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                  Hostel
                </th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((req) => (
                <tr
                  key={req.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-100">
                        {req.studentName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">
                          {req.studentName}
                        </p>
                        <p className="text-xs text-slate-400 font-black uppercase tracking-tight">
                          {req.registerNumber} • Sec {req.section}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <p className="font-bold text-slate-700 text-sm">
                      {req.eventName}
                    </p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                      Late-night / Extended
                    </p>
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                      <CalendarClock className="w-4 h-4" />
                      {req.eventDateTime}
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <p className="font-bold text-slate-700 text-sm">
                      {req.eventDuration}
                    </p>
                  </td>

                  <td className="px-8 py-6">
                    <p className="font-bold text-slate-700 text-sm">
                      {req.hostelName}
                    </p>
                  </td>

                  <td className="px-8 py-6">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg border ${
                        statusStyles[req.status]
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        disabled={req.sentToHostelHead}
                        onClick={() => {
                          onSendToHostelHead(req.id);
                        }}
                        className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-wider border transition-all active:scale-95 flex items-center gap-2 ${
                          req.sentToHostelHead
                            ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
                            : "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100"
                        }`}
                        title={
                          req.sentToHostelHead
                            ? "Already sent to hostel head"
                            : "Send permission request to hostel head"
                        }
                      >
                        <Send className="w-3.5 h-3.5" />
                        {req.sentToHostelHead ? "Sent" : "Send"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {requests.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <FileCheck2 className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                All caught up!
              </h3>
              <p className="text-slate-500 text-sm">
                No hostel permission requests to track.
              </p>
            </div>
          )}
        </div>
      </div>

      <p className="mt-5 text-xs text-slate-400 font-bold">
        FA is read-only for approval status (Approved/Rejected) and can only
        send the request to hostel head.
      </p>
    </div>
  );
};

export default HostelPermission;
