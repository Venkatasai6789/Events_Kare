import React, { useState } from "react";
import { Award } from "lucide-react";

const AdminCertificates: React.FC = () => {
  const getAdminAuthHeaders = () => {
    const token = localStorage.getItem("admin_access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [eventId, setEventId] = useState("");
  const [eventName, setEventName] = useState("");
  const [clubName, setClubName] = useState("");
  const [issuedBy, setIssuedBy] = useState("");
  const [isSending, setIsSending] = useState(false);

  const sendCertificate = async () => {
    setIsSending(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/admin/certificates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify({
          student_id: studentId,
          student_name: studentName,
          event_id: eventId,
          event_name: eventName,
          club_name: clubName,
          issued_by: issuedBy,
          // Dummy image URL for now (temporary)
          certificate_image_url:
            "https://placehold.co/1200x800/png?text=Certificate",
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        alert(data?.error || "Failed to send certificate");
        return;
      }
      alert("Certificate sent!");
      setStudentId("");
      setStudentName("");
      setEventId("");
      setEventName("");
    } catch {
      alert("Failed to send certificate");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Credential Management
        </h1>
        <p className="text-slate-500 font-medium mt-2">
          Issue certificates and verify external achievements.
        </p>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 sticky top-24">
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" /> Issue
            </h2>
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                void sendCertificate();
              }}
            >
              <input
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                type="text"
                className="w-full p-3 bg-slate-50 border rounded-xl text-sm"
                placeholder="Student ID"
              />
              <input
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                type="text"
                className="w-full p-3 bg-slate-50 border rounded-xl text-sm"
                placeholder="Student Name"
              />
              <input
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                type="text"
                className="w-full p-3 bg-slate-50 border rounded-xl text-sm"
                placeholder="Event ID"
              />
              <input
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                type="text"
                className="w-full p-3 bg-slate-50 border rounded-xl text-sm"
                placeholder="Event Name"
              />
              <input
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                type="text"
                className="w-full p-3 bg-slate-50 border rounded-xl text-sm"
                placeholder="Club Name"
              />
              <input
                value={issuedBy}
                onChange={(e) => setIssuedBy(e.target.value)}
                type="text"
                className="w-full p-3 bg-slate-50 border rounded-xl text-sm"
                placeholder="Issued By"
              />
              <button
                disabled={isSending}
                type="submit"
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold disabled:opacity-60"
              >
                Send Certificate
              </button>
            </form>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-8"></div>
      </div>
    </div>
  );
};

export default AdminCertificates;
