import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Trash2,
  GraduationCap,
  Mail,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Eye,
  Phone,
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Code,
  ExternalLink,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Check,
  MessageSquare
} from "lucide-react";

const StudentsTab = ({
  students = [],
  setStudents,
  availableGrades = [],
  syncToBackend,
  showNotification,
  onDeleteStudent
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("All");
  const [viewingStudent, setViewingStudent] = useState(null);
  const [activeProfileTab, setActiveProfileTab] = useState("overview"); // 'overview', 'attendance', 'assignments', 'courses'
  const [expandedSubmissionIdx, setExpandedSubmissionIdx] = useState(null);
  const [expandedCodeTab, setExpandedCodeTab] = useState("html");

  const [allSubmissions, setAllSubmissions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("lmsSubmissions") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/submissions");
        if (res.ok) {
          const data = await res.json();
          setAllSubmissions(data);
          localStorage.setItem("lmsSubmissions", JSON.stringify(data));
        }
      } catch (err) {
        const local = JSON.parse(localStorage.getItem("lmsSubmissions") || "[]");
        setAllSubmissions(local);
      }
    };
    fetchSubs();

    const handleStorage = (e) => {
      if (e.key === "lmsSubmissions" || !e.key) {
        try {
          setAllSubmissions(JSON.parse(localStorage.getItem("lmsSubmissions") || "[]"));
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const approvedStudents = students.filter((s) => s.paymentStatus === "Approved");

  const filtered = approvedStudents.filter((s) => {
    const matchesSearch =
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone?.includes(searchTerm);
    const matchesGrade =
      gradeFilter === "All" || s.grade === gradeFilter || s.subject === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  // Get student-specific submissions
  const getStudentSubmissions = (student) => {
    if (!student) return [];
    return allSubmissions.filter(
      (sub) =>
        (sub.studentEmail && sub.studentEmail.toLowerCase() === student.email?.toLowerCase()) ||
        (sub.studentName && sub.studentName.toLowerCase() === student.name?.toLowerCase()) ||
        (sub.studentId && (sub.studentId === student.studentId || sub.studentId === student.id))
    );
  };

  // Toggle student attendance status manually
  const handleToggleAttendance = async (student) => {
    const allStudents = JSON.parse(localStorage.getItem("studentRequests") || "[]");
    const idx = allStudents.findIndex(
      (s) => s.id === student.id || (s.email && s.email.toLowerCase() === student.email?.toLowerCase())
    );
    if (idx === -1) return;

    const newStatus = !allStudents[idx].isPresent;
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-CA");
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

    allStudents[idx].isPresent = newStatus;
    allStudents[idx].attendanceDate = newStatus ? dateStr : null;
    allStudents[idx].attendanceTime = newStatus ? timeStr : null;

    if (!allStudents[idx].attendanceHistory) {
      allStudents[idx].attendanceHistory = [];
    }
    if (newStatus) {
      allStudents[idx].attendanceHistory.unshift({
        date: dateStr,
        time: timeStr,
        status: "Present",
        source: "Admin Manual / LMS"
      });
    }

    localStorage.setItem("studentRequests", JSON.stringify(allStudents));
    window.dispatchEvent(new Event("storage"));
    setViewingStudent(allStudents[idx]);
    if (setStudents) setStudents(allStudents);
    if (syncToBackend) syncToBackend("studentRequests", allStudents);

    try {
      const targetId = student._id || student.studentId || student.id || student.email;
      await fetch(`http://localhost:5000/api/students/${encodeURIComponent(targetId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isPresent: newStatus,
          attendanceDate: allStudents[idx].attendanceDate,
          attendanceTime: allStudents[idx].attendanceTime,
          attendanceHistory: allStudents[idx].attendanceHistory,
          email: student.email
        })
      });
    } catch (e) {}

    if (showNotification) {
      showNotification(
        newStatus ? "Marked Present" : "Marked Absent",
        `${student.name} ${newStatus ? "පැමිණි බව" : "නොපැමිණි බව"} සටහන් කරන ලදී.`,
        newStatus ? "success" : "info"
      );
    }
  };

  const currentStudentSubmissions = viewingStudent ? getStudentSubmissions(viewingStudent) : [];
  const gradedSubs = currentStudentSubmissions.filter((s) => s.score !== undefined);
  const avgScore = gradedSubs.length > 0
    ? Math.round(gradedSubs.reduce((sum, s) => sum + Number(s.score || 0), 0) / gradedSubs.length)
    : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0e1424]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/80 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Active Student Directory
            </h2>
            <p className="text-xs text-slate-400">
              Verified students with authorized access to LMS video lessons, quizzes & assignments
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-indigo-300">
              {approvedStudents.length} Active Students
            </span>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0e1424]/90 backdrop-blur-xl p-4 rounded-2xl border border-slate-800/80">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, student ID, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-medium text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-400">Filter Grade:</label>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-300 outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">All Classes / Grades</option>
            {(availableGrades.length > 0
              ? availableGrades
              : [
                  "Grade 12",
                  "Grade 13",
                  "Grade 11",
                  "Grade 10",
                  "Grade 9",
                  "Grade 8",
                  "Grade 7",
                  "Grade 6"
                ]
            ).map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* STUDENTS TABLE */}
      <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900/90 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Student Profile</th>
                <th className="px-6 py-4">Enrolled Course</th>
                <th className="px-6 py-4">Attendance</th>
                <th className="px-6 py-4">Access Status</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filtered.map((s) => {
                const isPresent = Boolean(s.isPresent);
                const studentSubs = getStudentSubmissions(s);
                return (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                    onClick={() => setViewingStudent(s)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-indigo-600/20 shrink-0 group-hover:scale-105 transition-transform">
                          {s.name?.charAt(0) || "S"}
                        </div>
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-100 group-hover:text-indigo-300 transition-colors truncate">
                              {s.name}
                            </p>
                            <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                              {s.studentId || s.id}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                            <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                            <span>{s.email}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold text-[11px]">
                        {s.grade || "Grade 12"}
                      </span>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                        {s.subject || "Economics"}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      {isPresent ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Present</span>
                          {s.attendanceTime && (
                            <span className="text-[9px] text-emerald-300 font-mono">
                              ({s.attendanceTime})
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                          <XCircle className="w-3 h-3 text-slate-500" />
                          <span>Absent</span>
                        </span>
                      )}
                      {studentSubs.length > 0 && (
                        <p className="text-[10px] text-indigo-400 font-bold mt-1">
                          {studentSubs.length} Assignment{studentSubs.length > 1 ? "s" : ""}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Full Access Granted</span>
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-400 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{s.joined || "Recent"}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setViewingStudent(s)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 font-bold text-xs transition-all active:scale-95 shadow-sm"
                          title="View Complete Academic Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Profile</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteStudent(s.id)}
                          title="Revoke Access & Delete"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 font-semibold text-xs transition-all active:scale-95"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="font-bold text-sm text-slate-400">
                      No approved students found
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Check your pending payments to approve new student signups.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMPREHENSIVE STUDENT ACADEMIC PROFILE MODAL */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#0b1020] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full space-y-6 shadow-2xl animate-scaleUp max-h-[92vh] overflow-y-auto custom-scrollbar my-auto">
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-indigo-600/30">
                  {viewingStudent.name ? viewingStudent.name[0].toUpperCase() : "S"}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      {viewingStudent.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono text-xs font-bold">
                      {viewingStudent.studentId || viewingStudent.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                    <span>{viewingStudent.email}</span>
                    {viewingStudent.phone && (
                      <>
                        <span>•</span>
                        <span>{viewingStudent.phone}</span>
                      </>
                    )}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                      {viewingStudent.grade || "Grade 12"}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                      {viewingStudent.subject || "Economics"}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      {viewingStudent.paymentStatus || "Approved"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewingStudent(null)}
                className="text-slate-400 hover:text-white text-2xl p-2 rounded-xl hover:bg-slate-800/80 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* TOP METRIC CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Course / Grade</span>
                <p className="font-black text-white text-xs sm:text-sm">{viewingStudent.grade || "Grade 12"}</p>
                <p className="text-[10px] text-indigo-400 font-bold">{viewingStudent.subject || "Economics"}</p>
              </div>

              <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Today's Attendance</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      viewingStudent.isPresent ? "bg-emerald-400 animate-pulse" : "bg-slate-600"
                    }`}
                  />
                  <p className={`font-black text-xs sm:text-sm ${viewingStudent.isPresent ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {viewingStudent.isPresent ? "Present ✔" : "Not Marked"}
                  </p>
                </div>
                <p className="text-[10px] text-slate-500">
                  {viewingStudent.attendanceTime || "No log today"}
                </p>
              </div>

              <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Assignments Done</span>
                <p className="font-black text-amber-400 text-xs sm:text-sm">
                  {currentStudentSubmissions.length} Submitted
                </p>
                <p className="text-[10px] text-slate-500">
                  {gradedSubs.length} Graded
                </p>
              </div>

              <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Average Score</span>
                <p className="font-black text-cyan-400 text-xs sm:text-sm">
                  {gradedSubs.length > 0 ? `${avgScore} Marks` : "Pending"}
                </p>
                <p className="text-[10px] text-slate-500">Across tasks</p>
              </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              {[
                { id: "overview", label: "Profile & Course", icon: GraduationCap },
                { id: "attendance", label: "Attendance & Logs", icon: Calendar },
                { id: "assignments", label: `Assignments & Marks (${currentStudentSubmissions.length})`, icon: Award }
              ].map((t) => {
                const Icon = t.icon;
                const isSel = activeProfileTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveProfileTab(t.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isSel
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT 1: OVERVIEW & COURSE */}
            {activeProfileTab === "overview" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 font-bold text-[10px] uppercase">Full Name</span>
                    <p className="text-white font-bold">{viewingStudent.name}</p>
                  </div>
                  <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 font-bold text-[10px] uppercase">Student ID Number</span>
                    <p className="font-mono text-indigo-400 font-bold">
                      {viewingStudent.studentId || viewingStudent.id}
                    </p>
                  </div>
                  <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 font-bold text-[10px] uppercase">Email Address</span>
                    <a
                      href={`mailto:${viewingStudent.email}`}
                      className="text-slate-200 hover:text-indigo-400 font-medium truncate flex items-center gap-1"
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>{viewingStudent.email}</span>
                    </a>
                  </div>
                  <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 font-bold text-[10px] uppercase">Contact Phone & WhatsApp</span>
                    {viewingStudent.phone ? (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-200 font-bold">{viewingStudent.phone}</span>
                        <a
                          href={`https://wa.me/${viewingStudent.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-md hover:bg-emerald-500/30 flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    ) : (
                      <p className="text-slate-500">Not provided</p>
                    )}
                  </div>
                  <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 font-bold text-[10px] uppercase">Enrolled Course Curriculum</span>
                    <p className="text-white font-bold">
                      {viewingStudent.grade || "Grade 12"} • {viewingStudent.subject || "Economics"}
                    </p>
                  </div>
                  <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 font-bold text-[10px] uppercase">Joined Date</span>
                    <p className="text-slate-300 font-medium">{viewingStudent.joined || "N/A"}</p>
                  </div>
                </div>

                {/* PAYMENT SLIP PREVIEW (IF AVAILABLE) */}
                {viewingStudent.slipUrl && (
                  <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-indigo-400" />
                        <span>Submitted Bank Payment Slip</span>
                      </span>
                      <a
                        href={viewingStudent.slipUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        <span>Open Full Image</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="max-h-48 overflow-hidden rounded-xl border border-slate-800 bg-black/40 flex items-center justify-center">
                      <img
                        src={viewingStudent.slipUrl}
                        alt="Payment Slip"
                        className="max-h-48 object-contain rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 2: ATTENDANCE & LOGS */}
            {activeProfileTab === "attendance" && (
              <div className="space-y-4">
                {/* ATTENDANCE TOGGLE CARD */}
                <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span>Today's Class Attendance Status:</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          viewingStudent.isPresent
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {viewingStudent.isPresent ? "Marked Present ✔" : "Absent / Not Marked"}
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {viewingStudent.attendanceTime
                        ? `පැමිණි වේලාව: ${viewingStudent.attendanceTime} (${viewingStudent.attendanceDate || "Today"})`
                        : "අද දින මෙම ශිෂ්‍යයා තවම පැමිණීම සටහන් කර නොමැත."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleAttendance(viewingStudent)}
                    className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 border ${
                      viewingStudent.isPresent
                        ? "bg-rose-500/15 hover:bg-rose-600 text-rose-400 hover:text-white border-rose-500/30"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-emerald-600/30"
                    }`}
                  >
                    {viewingStudent.isPresent ? (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Change to Absent</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark as Present</span>
                      </>
                    )}
                  </button>
                </div>

                {/* ATTENDANCE RECORDS LOG */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">
                    Recorded Attendance Sessions:
                  </span>
                  <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar">
                    {/* CURRENT RECORD */}
                    {viewingStudent.isPresent && (
                      <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/30 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                            ✔
                          </div>
                          <div>
                            <p className="font-bold text-white">Live Session Attendance</p>
                            <p className="text-[10px] text-slate-400">
                              {viewingStudent.attendanceDate || "Today"} at {viewingStudent.attendanceTime || "Scheduled Time"}
                            </p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                          Present
                        </span>
                      </div>
                    )}

                    {/* HISTORICAL RECORDS */}
                    {viewingStudent.attendanceHistory &&
                      viewingStudent.attendanceHistory.map((hist, hIdx) => (
                        <div
                          key={hIdx}
                          className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                              🗓️
                            </div>
                            <div>
                              <p className="font-bold text-white">Session on {hist.date}</p>
                              <p className="text-[10px] text-slate-400">
                                Recorded at {hist.time} ({hist.source || "LMS Portal"})
                              </p>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                            {hist.status || "Attended"}
                          </span>
                        </div>
                      ))}

                    {!viewingStudent.isPresent &&
                      (!viewingStudent.attendanceHistory || viewingStudent.attendanceHistory.length === 0) && (
                        <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800/80 text-slate-500 text-xs">
                          මෙම ශිෂ්‍යයා සඳහා සටහන් වූ පැමිණීමේ වාර්තා නොමැත.
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: ASSIGNMENTS & MARKS */}
            {activeProfileTab === "assignments" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">
                    Submitted Assignments & Marks History ({currentStudentSubmissions.length}):
                  </span>
                  {currentStudentSubmissions.length > 0 && (
                    <span className="text-[11px] font-bold text-emerald-400">
                      Average: {avgScore} Marks
                    </span>
                  )}
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar">
                  {currentStudentSubmissions.map((sub, sIdx) => {
                    const isExpanded = expandedSubmissionIdx === sIdx;
                    return (
                      <div
                        key={sub._id || sIdx}
                        className="bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden text-xs"
                      >
                        <div
                          className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-900/60 transition-colors"
                          onClick={() => setExpandedSubmissionIdx(isExpanded ? null : sIdx)}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-white text-xs sm:text-sm">
                                {sub.assignmentTitle}
                              </h5>
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  sub.status === "Graded"
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                }`}
                              >
                                {sub.status || "Submitted"}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 flex items-center gap-2">
                              <span>Submitted on: {new Date(sub.submittedAt).toLocaleString()}</span>
                              <span>•</span>
                              <span className="text-indigo-400 font-semibold">{sub.grade}</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className="text-sm font-black text-emerald-400 block">
                                {sub.score !== undefined ? `${sub.score} Marks` : "Pending"}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {sub.feedback ? "With Feedback" : "Auto / In Review"}
                              </span>
                            </div>
                            <button
                              type="button"
                              className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* EXPANDED SUBMISSION DETAILS */}
                        {isExpanded && (
                          <div className="p-4 bg-slate-900/60 border-t border-slate-800/80 space-y-4">
                            {/* TEACHER FEEDBACK */}
                            {sub.feedback && (
                              <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-500/30 space-y-1">
                                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
                                  Teacher Review & Feedback:
                                </span>
                                <p className="text-xs text-indigo-100 font-medium italic">
                                  "{sub.feedback}"
                                </p>
                              </div>
                            )}

                            {/* SUBMITTED ANSWERS BREAKDOWN */}
                            <div className="space-y-2">
                              <span className="text-[11px] font-bold text-slate-300 block">
                                Submitted Answers Breakdown:
                              </span>
                              {sub.answers && typeof sub.answers === "object" ? (
                                <div className="space-y-2">
                                  {Object.entries(sub.answers).map(([key, val], aIdx) => {
                                    const taskScore = sub.taskScores?.[key];
                                    const isCode = typeof val === "object" && val !== null && ("html" in val || "css" in val || "js" in val);
                                    const isImage = typeof val === "string" && (val.startsWith("data:image") || val.startsWith("http"));

                                    return (
                                      <div
                                        key={aIdx}
                                        className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs"
                                      >
                                        <div className="flex items-center justify-between">
                                          <span className="font-bold text-slate-300">
                                            Question {Number(key) + 1}
                                          </span>
                                          {taskScore !== undefined && (
                                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                                              +{taskScore} Marks
                                            </span>
                                          )}
                                        </div>

                                        {/* CODE TASK */}
                                        {isCode ? (
                                          <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                              {["html", "css", "js"].map((tab) => (
                                                <button
                                                  key={tab}
                                                  type="button"
                                                  onClick={() => setExpandedCodeTab(tab)}
                                                  className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                    expandedCodeTab === tab
                                                      ? "bg-amber-500 text-black font-black"
                                                      : "bg-slate-900 text-slate-400"
                                                  }`}
                                                >
                                                  {tab}
                                                </button>
                                              ))}
                                            </div>
                                            <pre className="p-2.5 rounded-lg bg-black text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-32">
                                              {val[expandedCodeTab] || `/* No ${expandedCodeTab} code written */`}
                                            </pre>
                                          </div>
                                        ) : isImage ? (
                                          <div className="space-y-1">
                                            <img
                                              src={val}
                                              alt="Diagram Answer"
                                              className="max-h-36 rounded-lg border border-slate-800 object-contain bg-black/40"
                                            />
                                          </div>
                                        ) : (
                                          <div className="p-2.5 bg-slate-900 rounded-lg text-slate-200">
                                            {String(val)}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-slate-500 text-xs">No individual task breakdown recorded.</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {currentStudentSubmissions.length === 0 && (
                    <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800/80 text-slate-500 text-xs">
                      මෙම ශිෂ්‍යයා විසින් තවමත් කිසිදු Assignment එකක් භාරදී නොමැත.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MODAL FOOTER */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <span className="text-[11px] text-slate-500">
                Student Account: <b className="text-slate-300">{viewingStudent.name}</b>
              </span>
              <button
                type="button"
                onClick={() => setViewingStudent(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsTab;
