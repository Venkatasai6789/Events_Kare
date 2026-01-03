import React from "react";
import {
  User,
  QrCode,
  Download,
  Share2,
  BookOpen,
  Award,
  Zap,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { CREDIT_GROUPS, STUDENT_PROFILE } from "../../constants";

interface StudentDashboardProps {
  setView: (view: string) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ setView }) => {
  return (
    <div className="animate-in fade-in duration-700 pb-20">
      {/* New Welcome Header Section */}
      <div className="flex flex-col xl:flex-row gap-8 items-start xl:items-center justify-between mb-8">
        <div className="space-y-2 max-w-xl">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Welcome, <span className="text-blue-600">Alex</span> 👋
          </h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">
            Track your activity credits, registered events, upcoming, ongoing
            events and club vacancies.
          </p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap gap-4 w-full xl:w-auto">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center flex-1 min-w-[140px] py-6">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-3xl font-black text-emerald-600 mb-1">12</p>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Completed Events
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center flex-1 min-w-[140px] py-6">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-3xl font-black text-blue-600 mb-1">4</p>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Upcoming Events
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center flex-1 min-w-[140px] py-6">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-3">
              <Zap className="w-6 h-6" />
            </div>
            <p className="text-3xl font-black text-amber-500 mb-1">11</p>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Total Credits Earned
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          {/* Updated Student ID Card */}
          <div className="bg-[#1e293b] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="flex justify-between items-start mb-8 relative z-10">
              <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2">
                <User className="w-3 h-3" /> Student ID
              </span>
              <button className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                <span className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-6 relative z-10">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Full Name
                </p>
                <p className="text-2xl font-black tracking-tight">
                  {STUDENT_PROFILE.name}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Registration No.
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-black tracking-wider font-mono">
                    {STUDENT_PROFILE.registerNumber}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Dept
                  </p>
                  <p className="font-bold text-sm">
                    {STUDENT_PROFILE.department}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Year
                  </p>
                  <p className="font-bold text-sm">
                    {STUDENT_PROFILE.academicYear}
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
          </div>

          {/* Updated QR Card */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-2 text-blue-600">
              <QrCode className="w-5 h-5" />
              <h3 className="font-black text-lg text-slate-900">
                Attendance QR
              </h3>
            </div>
            <p className="text-slate-500 text-xs font-bold mb-6">
              Scan at event entrance
            </p>
            <div className="bg-white p-2 border-2 border-slate-100 rounded-2xl mb-8 shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${STUDENT_PROFILE.registerNumber}`}
                className="w-48 h-48 mix-blend-multiply opacity-90"
              />
            </div>
            <div className="flex gap-4 w-full">
              <button className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Save
              </button>
              <button className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 h-full">
          <div className="bg-white rounded-[2rem] p-10 border border-slate-200 shadow-sm h-full">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-900">
                  Academic Progress
                </h2>
              </div>
              <p className="text-slate-500 font-medium ml-11">
                Track your progress towards graduation requirements
              </p>
            </div>

            <div className="space-y-6">
              {CREDIT_GROUPS.map((group, index) => {
                let icon = <Award className="w-5 h-5" />;
                let bgColor = "bg-pink-50";
                let textColor = "text-pink-600";

                if (index === 0) {
                  // Group 2
                  bgColor = "bg-emerald-50";
                  textColor = "text-emerald-600";
                  icon = <Award className="w-5 h-5" />;
                } else if (index === 1) {
                  // Group 3
                  bgColor = "bg-amber-50";
                  textColor = "text-amber-600";
                  icon = <Zap className="w-5 h-5" />;
                } else {
                  // EE
                  bgColor = "bg-purple-50";
                  textColor = "text-purple-600";
                  icon = <BookOpen className="w-5 h-5" />;
                }

                return (
                  <div
                    key={group.id}
                    className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100 hover:border-slate-200 transition-all"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bgColor} ${textColor}`}
                        >
                          {icon}
                        </div>
                        <h3 className="text-lg font-black text-slate-900">
                          {group.name
                            .replace(" (Certs)", "")
                            .replace(" (Points)", "")}{" "}
                          <span className="text-slate-400 font-bold text-sm">
                            (
                            {group.id.includes("ee")
                              ? "Credits"
                              : "Certificates"}
                            )
                          </span>
                        </h3>
                      </div>
                      <div className="text-xl font-black text-slate-900">
                        {group.earned}
                        <span className="text-slate-400">/{group.total}</span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-3 mb-3 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${(group.earned / group.total) * 100}%`,
                          backgroundColor: group.color,
                        }}
                      />
                    </div>

                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {group.id.includes("ee") ? "EE" : "GROUP"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
