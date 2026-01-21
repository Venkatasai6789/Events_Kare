import React, { useCallback, useMemo, useState } from "react";

type AttendanceStatus = "Pending" | "Approved" | "Rejected";

type AttendanceRecord = {
  attendance_id: string;
  student_id: string;
  student_name: string;
  event_id: string;
  event_name: string;
  marked_at?: string;
  status: AttendanceStatus;
};

const API_BASE = "http://127.0.0.1:5000";

const getAdminAuthHeaders = () => {
  const token = localStorage.getItem("admin_access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const AdminAttendance: React.FC = () => {
  const [eventId, setEventId] = useState<string>("");
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const statusPillClass = useMemo(() => {
    return (status: AttendanceStatus) => {
      if (status === "Approved")
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      if (status === "Rejected")
        return "bg-rose-50 text-rose-700 border-rose-100";
      return "bg-amber-50 text-amber-700 border-amber-100";
    };
  }, []);

  const loadAttendances = useCallback(async () => {
    const trimmed = eventId.trim();
    if (!trimmed) {
      setError("Please enter an event id.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/attendance?event_id=${encodeURIComponent(
          trimmed,
        )}`,
        {
          headers: {
            ...getAdminAuthHeaders(),
          },
        },
      );
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setAttendances([]);
        setError(data?.error || "Failed to fetch attendance list");
        return;
      }
      setAttendances((data?.attendances || []) as AttendanceRecord[]);
    } catch (e: any) {
      setError(e?.message || "Failed to fetch attendance list");
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  const updateAttendanceStatus = useCallback(
    async (attendanceId: string, action: "approve" | "reject") => {
      if (!attendanceId) return;
      setIsUpdating(attendanceId);
      setError(null);
      try {
        const res = await fetch(
          `${API_BASE}/api/admin/attendance/${encodeURIComponent(
            attendanceId,
          )}/${action}`,
          {
            method: "POST",
            headers: {
              ...getAdminAuthHeaders(),
            },
          },
        );
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          setError(data?.error || `Failed to ${action} attendance`);
          return;
        }

        const updated = data?.attendance as AttendanceRecord | undefined;
        if (!updated?.attendance_id) {
          // If backend didn't return the updated doc for any reason, reload list.
          await loadAttendances();
          return;
        }

        setAttendances((prev) =>
          prev.map((r) =>
            r.attendance_id === updated.attendance_id ? updated : r,
          ),
        );
      } catch (e: any) {
        setError(e?.message || `Failed to ${action} attendance`);
      } finally {
        setIsUpdating(null);
      }
    },
    [loadAttendances],
  );

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Attendance Management
        </h1>
        <p className="text-slate-500 font-medium mt-2">
          Review and approve student attendance for events.
        </p>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col min-h-[400px]">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end sm:justify-between mb-6">
          <div className="w-full sm:max-w-md">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Event ID
            </label>
            <input
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              placeholder="Enter event_id"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>

          <button
            onClick={loadAttendances}
            disabled={isLoading}
            className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-60"
          >
            {isLoading ? "Loading..." : "Load Attendance"}
          </button>
        </div>

        {error && (
          <div className="mb-5 p-4 rounded-2xl border border-rose-100 bg-rose-50 text-rose-700 text-sm font-bold">
            {error}
          </div>
        )}

        <div className="w-full overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <div className="col-span-3">Student Name</div>
              <div className="col-span-2">Registration Number</div>
              <div className="col-span-4">Event Name</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            <div className="mt-3 space-y-2">
              {attendances.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <p className="text-sm font-bold">No attendance records</p>
                  <p className="text-xs font-medium mt-1">
                    Enter an event id and click “Load Attendance”.
                  </p>
                </div>
              ) : (
                attendances.map((r) => {
                  const pending = (r.status || "Pending") === "Pending";
                  const busy = isUpdating === r.attendance_id;

                  return (
                    <div
                      key={r.attendance_id}
                      className="grid grid-cols-12 gap-4 px-4 py-4 rounded-2xl border border-slate-200 bg-white hover:shadow-sm transition-all items-center"
                    >
                      <div className="col-span-3">
                        <p className="text-sm font-bold text-slate-900">
                          {r.student_name || "—"}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-bold text-slate-700">
                          {r.student_id || "—"}
                        </p>
                      </div>
                      <div className="col-span-4">
                        <p className="text-sm font-bold text-slate-900">
                          {r.event_name || "—"}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                          {r.event_id}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${statusPillClass(
                            (r.status || "Pending") as AttendanceStatus,
                          )}`}
                        >
                          {r.status || "Pending"}
                        </span>
                      </div>
                      <div className="col-span-1 flex justify-end gap-2">
                        <button
                          onClick={() =>
                            updateAttendanceStatus(r.attendance_id, "approve")
                          }
                          disabled={!pending || busy}
                          className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            updateAttendanceStatus(r.attendance_id, "reject")
                          }
                          disabled={!pending || busy}
                          className="px-3 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-all disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendance;
