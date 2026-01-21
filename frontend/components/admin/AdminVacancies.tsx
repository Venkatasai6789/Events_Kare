import React, { useEffect, useMemo, useState } from "react";
import { ClipboardList, Check, X, Plus, Briefcase } from "lucide-react";
import { CAMPUS_CLUBS } from "../../constants";
import { JobApplication, Vacancy } from "../../types";

interface AdminVacanciesProps {
  applications: JobApplication[];
}

const AdminVacancies: React.FC<AdminVacanciesProps> = ({ applications }) => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

  const getAdminAuthHeaders = () => {
    const token = localStorage.getItem("admin_access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const clubOptions = useMemo(() => CAMPUS_CLUBS.map((c) => c.name), []);

  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loadingVacancies, setLoadingVacancies] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [clubName, setClubName] = useState(clubOptions[0] || "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [openings, setOpenings] = useState(1);
  const [deadline, setDeadline] = useState("");
  const [contact, setContact] = useState("");
  const [releaseToStudents, setReleaseToStudents] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadVacancies = async () => {
    setLoadingVacancies(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/vacancies`, {
        headers: {
          ...getAdminAuthHeaders(),
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load vacancies");
      setVacancies(Array.isArray(data?.vacancies) ? data.vacancies : []);
    } catch (e: any) {
      setError(e?.message || "Failed to load vacancies");
    } finally {
      setLoadingVacancies(false);
    }
  };

  useEffect(() => {
    loadVacancies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitVacancy = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        club_name: clubName,
        title,
        description,
        skills,
        openings,
        deadline: deadline || null,
        contact: contact || null,
        status: releaseToStudents ? "Published" : "Draft",
      };

      const res = await fetch(`${API_BASE}/api/admin/vacancies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create vacancy");

      setTitle("");
      setDescription("");
      setSkills("");
      setOpenings(1);
      setDeadline("");
      setContact("");
      setReleaseToStudents(true);

      await loadVacancies();
    } catch (e: any) {
      setError(e?.message || "Failed to create vacancy");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Recruitment Portal
        </h1>
        <p className="text-slate-500 font-medium mt-2">
          Post roles and review candidate applications.
        </p>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <ClipboardList className="w-5 h-5" />
            Applications
          </h2>
          <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-bold">{app.studentName}</p>
                      <p className="text-xs text-slate-500">{app.rollNumber}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {app.roleApplied}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 bg-green-50 text-green-600 rounded-lg">
                          <Check className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-red-50 text-red-600 rounded-lg">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[2rem] border border-slate-200 p-8">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-6">
              <Plus className="w-5 h-5" />
              Post New Recruitment
            </h2>

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 text-rose-700 text-sm font-bold border border-rose-100">
                {error}
              </div>
            )}

            <form onSubmit={submitVacancy} className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Club
                </label>
                <select
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  className="mt-2 w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white font-bold text-slate-700"
                >
                  {clubOptions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Role Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-2 w-full px-4 py-3 rounded-2xl border border-slate-200 font-bold text-slate-700"
                  placeholder="e.g., Backend Developer"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="mt-2 w-full px-4 py-3 rounded-2xl border border-slate-200 font-bold text-slate-700"
                  placeholder="What will the student do?"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Skills (comma separated)
                </label>
                <input
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="mt-2 w-full px-4 py-3 rounded-2xl border border-slate-200 font-bold text-slate-700"
                  placeholder="React, TypeScript, Tailwind"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider">
                    Openings
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={openings}
                    onChange={(e) => setOpenings(Number(e.target.value))}
                    className="mt-2 w-full px-4 py-3 rounded-2xl border border-slate-200 font-bold text-slate-700"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="mt-2 w-full px-4 py-3 rounded-2xl border border-slate-200 font-bold text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Contact (optional)
                </label>
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="mt-2 w-full px-4 py-3 rounded-2xl border border-slate-200 font-bold text-slate-700"
                  placeholder="Email / Phone"
                />
              </div>

              <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={releaseToStudents}
                  onChange={(e) => setReleaseToStudents(e.target.checked)}
                  className="w-4 h-4"
                />
                Release to students (Published)
              </label>

              <button
                disabled={submitting}
                className="w-full mt-2 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Posting..." : "Post Recruitment"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-200 p-8">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-6">
              <Briefcase className="w-5 h-5" />
              Posted Recruitments
            </h2>
            {loadingVacancies ? (
              <p className="text-slate-500 font-bold">Loading...</p>
            ) : vacancies.length === 0 ? (
              <p className="text-slate-500 font-bold">
                No recruitments posted yet.
              </p>
            ) : (
              <div className="space-y-4">
                {vacancies.map((v) => (
                  <div
                    key={v.vacancy_id}
                    className="border border-slate-200 rounded-2xl p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-wider">
                          {v.club_name}
                        </p>
                        <h3 className="text-lg font-black text-slate-900 leading-tight mt-1">
                          {v.title}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium mt-2 line-clamp-2">
                          {v.description}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          v.status === "Published"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {v.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-black border border-slate-100 uppercase tracking-wide">
                        {v.openings} Opening{v.openings > 1 ? "s" : ""}
                      </span>
                      {v.deadline && (
                        <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-black border border-slate-100 uppercase tracking-wide">
                          Deadline: {v.deadline}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVacancies;
