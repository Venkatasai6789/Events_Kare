import React, { useEffect, useMemo, useState } from "react";
import { Medal, Plus, Award, Briefcase } from "lucide-react";
import { Achievement } from "../../types";
import { MY_ACHIEVEMENTS, STUDENT_PROFILE } from "../../constants";

interface StudentInboxProps {
  onUploadClick: () => void;
  setPreviewAchievement: (achievement: Achievement | null) => void;
}

const StudentInbox: React.FC<StudentInboxProps> = ({
  onUploadClick,
  setPreviewAchievement,
}) => {
  const [activeCertificateFilter, setActiveCertificateFilter] = useState("All");

  type AchievementWithFile = Achievement & { fileUrl?: string };
  type CertificateDoc = {
    certificate_id?: string;
    student_id: string;
    student_name: string;
    event_id: string;
    event_name: string;
    club_name: string;
    certificate_image_url: string;
    issued_by: string;
    issued_at: string;
    status: "Issued";
  };

  const [issuedCertificates, setIssuedCertificates] = useState<
    CertificateDoc[]
  >([]);

  const fetchCertificates = async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;
      const res = await fetch(
        `http://127.0.0.1:5000/api/student/certificates?student_id=${encodeURIComponent(
          STUDENT_PROFILE.registerNumber,
        )}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        },
      );
      const data = await res.json().catch(() => null);
      if (!res.ok) return;
      setIssuedCertificates(
        Array.isArray(data?.certificates) ? data.certificates : [],
      );
    } catch {
      // no-op: keep existing UI
    }
  };

  useEffect(() => {
    void fetchCertificates();
    const intervalId = window.setInterval(() => {
      void fetchCertificates();
    }, 5000);
    return () => window.clearInterval(intervalId);
  }, []);

  const issuedAsAchievements: AchievementWithFile[] = useMemo(() => {
    return issuedCertificates.map((c) => ({
      id: c.certificate_id || `${c.event_id}-${c.issued_at}`,
      title: c.event_name,
      date: c.issued_at,
      venue: c.club_name,
      organization: c.club_name,
      type: "Certificate",
      category: "General",
      status: "Verified",
      fileUrl: c.certificate_image_url,
    }));
  }, [issuedCertificates]);

  const allAchievements: AchievementWithFile[] = useMemo(() => {
    return [
      ...issuedAsAchievements,
      ...(MY_ACHIEVEMENTS as AchievementWithFile[]),
    ];
  }, [issuedAsAchievements]);

  const filteredAchievements = useMemo(() => {
    if (activeCertificateFilter === "All") return allAchievements;
    const filter =
      activeCertificateFilter === "Offer Letters"
        ? "Career"
        : activeCertificateFilter;
    return allAchievements.filter((a) =>
      filter === "Career"
        ? a.category === "Career"
        : a.category === filter || a.category === "General",
    );
  }, [activeCertificateFilter, allAchievements]);

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <Medal className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
              Credential Center
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              Manage Achievements
            </p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-1.5 rounded-full flex overflow-x-auto hide-scrollbar">
          {["All", "Group 2", "Group 3", "EE", "Offer Letters"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveCertificateFilter(f)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                activeCertificateFilter === f
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAchievements.map((ach) => (
          <div
            key={ach.id}
            className="bg-white rounded-[2rem] p-8 border border-slate-100 flex flex-col hover:shadow-xl transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  ach.category === "Career"
                    ? "bg-purple-50 text-purple-600"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {ach.category === "Career" ? (
                  <Briefcase className="w-5 h-5" />
                ) : (
                  <Award className="w-5 h-5" />
                )}
              </div>
              <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                VERIFIED
              </span>
            </div>
            <div className="flex-grow space-y-2 mb-8">
              <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                {ach.title}
              </h3>
              <p className="text-sm font-bold text-slate-400 uppercase">
                {ach.organization || ach.venue}
              </p>
              <p className="text-xs font-bold text-slate-400 uppercase">
                Issued: {new Date(ach.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-3 pt-6 border-t border-slate-50">
              <button
                onClick={() => setPreviewAchievement(ach)}
                className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-black"
              >
                View
              </button>
              <button
                onClick={() => {
                  const url = (ach as AchievementWithFile).fileUrl;
                  if (url) window.open(url, "_blank", "noopener,noreferrer");
                }}
                className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-xs font-black"
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onUploadClick}
        className="fixed bottom-10 right-10 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-40"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default StudentInbox;
