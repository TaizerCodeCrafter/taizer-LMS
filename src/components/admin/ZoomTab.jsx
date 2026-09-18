import React, { useState } from "react";
import {
  Video,
  Calendar,
  Clock,
  Link,
  Save,
  Users,
  History,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Search,
  RotateCcw,
  AlertCircle,
  Check,
  Radio
} from "lucide-react";
import { showAppConfirm } from "../GlobalAlert";

const ZoomTab = ({
  zoomSettings = {},
  setZoomSettings,
  selectedZoomGrade,
  setSelectedZoomGrade,
  zoomSubTab,
  setZoomSubTab,
  zoomForm,
  setZoomForm,
  onSaveZoomSettings,
  formatTime,
  students = [],
  setStudents,
  syncToBackend,
  showNotification
}) => {
  const [attendanceSearch, setAttendanceSearch] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState("all"); // 'all', 'present', 'absent'

  const currentGradeZoom = zoomSettings[selectedZoomGrade] || {
    link: "",
    date: "",
    startTime: "",
    endTime: "",
    isAttendanceActive: false
  };

  const isAttendanceActive = Boolean(currentGradeZoom.isAttendanceActive);

  const handleUpdate = (field, value) => {
    const updated = { ...zoomSettings };
    if (!updated[selectedZoomGrade]) updated[selectedZoomGrade] = {};
    updated[selectedZoomGrade][field] = value;
    setZoomSettings(updated);
  };

  // Toggle Attendance Active ON / OFF for selected grade
  const handleToggleAttendance = (targetGrade = selectedZoomGrade, forcedState = null) => {
    const updated = { ...zoomSettings };
    if (!updated[targetGrade]) updated[targetGrade] = {};
    const newState = forcedState !== null ? forcedState : !updated[targetGrade].isAttendanceActive;
    updated[targetGrade].isAttendanceActive = newState;

    setZoomSettings(updated);
    localStorage.setItem("zoomSettings", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    if (syncToBackend) {
      syncToBackend("zoomSettings", updated);
    }
    if (showNotification) {
      showNotification(
        newState ? "Attendance Active 🟢" : "Attendance Closed 🔴",
        `${targetGrade}: සිසුන්ට පැමිණීම සටහන් කිරීම ${newState ? 'සක්‍රීය' : 'අක්‍රීය'} කරන ලදී.`,
        newState ? "success" : "info"
      );
    }
  };

  // Toggle Attendance for All Grades
  const handleToggleAllGradesAttendance = (newState) => {
    const grades = ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12", "Grade 13"];
    const updated = { ...zoomSettings };
    grades.forEach((g) => {
      if (!updated[g]) updated[g] = {};
      updated[g].isAttendanceActive = newState;
    });

    setZoomSettings(updated);
    localStorage.setItem("zoomSettings", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    if (syncToBackend) {
      syncToBackend("zoomSettings", updated);
    }
    if (showNotification) {
      showNotification(
        newState ? "All Grades Active 🟢" : "All Grades Closed 🔴",
        newState ? "සියලුම ශ්‍රේණි සඳහා පැමිණීම සක්‍රීය කරන ලදී." : "සියලුම ශ්‍රේණි සඳහා පැමිණීම අක්‍රීය කරන ලදී.",
        newState ? "success" : "info"
      );
    }
  };

  // Reset attendance for selected grade
  const handleResetAttendance = () => {
    showAppConfirm({
      title: "Reset Attendance?",
      message: `${selectedZoomGrade} සිසුන්ගේ අද දින පැමිණීම (Attendance) reset කිරීමට අවශ්‍ය බව තහවුරු කරන්න?`,
      confirmText: "Reset Attendance",
      type: "warning",
      onConfirm: () => {
        const allStudents = JSON.parse(localStorage.getItem("studentRequests") || "[]");
        const updated = allStudents.map((s) => {
          const sGrade = (s.grade || "").trim().toLowerCase();
          const selGrade = selectedZoomGrade.trim().toLowerCase();
          if (sGrade === selGrade || (sGrade.includes("12") && selGrade.includes("12")) || (sGrade.includes("13") && selGrade.includes("13"))) {
            return { ...s, isPresent: false, attendanceDate: null, attendanceTime: null };
          }
          return s;
        });

        localStorage.setItem("studentRequests", JSON.stringify(updated));
        window.dispatchEvent(new Event("storage"));
        if (setStudents) setStudents(updated);
        if (syncToBackend) syncToBackend("studentRequests", updated);
        if (showNotification) {
          showNotification("Reset Complete", `${selectedZoomGrade} සිසුන්ගේ පැමිණීම reset කරන ලදී.`, "info");
        }
      }
    });
  };

  // Manually toggle single student attendance
  const handleToggleStudentAttendance = async (student) => {
    const allStudents = JSON.parse(localStorage.getItem("studentRequests") || "[]");
    const idx = allStudents.findIndex((s) => s.id === student.id || s.email === student.email);
    if (idx === -1) return;

    const newStatus = !allStudents[idx].isPresent;
    const now = new Date();
    allStudents[idx].isPresent = newStatus;
    allStudents[idx].attendanceDate = newStatus ? now.toLocaleDateString("en-CA") : null;
    allStudents[idx].attendanceTime = newStatus ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }) : null;

    localStorage.setItem("studentRequests", JSON.stringify(allStudents));
    window.dispatchEvent(new Event("storage"));
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
          email: student.email
        })
      });
    } catch (e) {}

    if (showNotification) {
      showNotification(
        newStatus ? "Marked Present" : "Marked Absent",
        `${student.name || "Student"} ${newStatus ? "පැමිණි බව" : "නොපැමිණි බව"} සටහන් කරන ලදී.`,
        newStatus ? "success" : "info"
      );
    }
  };

  // Grade student filtering
  const allCurrentStudents = students && students.length > 0
    ? students
    : JSON.parse(localStorage.getItem("studentRequests") || "[]");

  const gradeStudents = allCurrentStudents.filter((s) => {
    const sGrade = (s.grade || "Grade 12").trim().toLowerCase();
    const selGrade = selectedZoomGrade.trim().toLowerCase();
    return sGrade === selGrade || (sGrade.includes("12") && selGrade.includes("12")) || (sGrade.includes("13") && selGrade.includes("13"));
  });

  const presentStudents = gradeStudents.filter((s) => s.isPresent);
  const absentStudents = gradeStudents.filter((s) => !s.isPresent);
  const attendanceRate = gradeStudents.length > 0 ? Math.round((presentStudents.length / gradeStudents.length) * 100) : 0;

  const displayedStudents = gradeStudents.filter((s) => {
    const matchesSearch =
      !attendanceSearch ||
      (s.name && s.name.toLowerCase().includes(attendanceSearch.toLowerCase())) ||
      (s.studentId && s.studentId.toLowerCase().includes(attendanceSearch.toLowerCase())) ||
      (s.email && s.email.toLowerCase().includes(attendanceSearch.toLowerCase())) ||
      (s.phone && s.phone.toLowerCase().includes(attendanceSearch.toLowerCase()));

    if (!matchesSearch) return false;
    if (attendanceFilter === "present") return s.isPresent;
    if (attendanceFilter === "absent") return !s.isPresent;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0e1424]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/80 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Live Zoom Class Management
            </h2>
            <p className="text-xs text-slate-400">
              Configure live Zoom sessions, broadcast links, and schedules for each grade
            </p>
          </div>
        </div>

        {/* GRADE PICKER & ATTENDANCE QUICK ACTION */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800">
            <label className="text-xs font-bold text-slate-400">Grade:</label>
            <select
              value={selectedZoomGrade}
              onChange={(e) => setSelectedZoomGrade(e.target.value)}
              className="bg-transparent text-xs font-black text-blue-400 outline-none cursor-pointer"
            >
              {[
                "Grade 6",
                "Grade 7",
                "Grade 8",
                "Grade 9",
                "Grade 10",
                "Grade 11",
                "Grade 12",
                "Grade 13"
              ].map((g) => (
                <option key={g} value={g} className="bg-slate-900 text-slate-200">
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* PRIMARY ATTENDANCE ACTIVE TOGGLE BUTTON */}
          <button
            type="button"
            onClick={() => handleToggleAttendance(selectedZoomGrade)}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all shadow-md active:scale-95 border ${
              isAttendanceActive
                ? "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-emerald-600/30 ring-2 ring-emerald-500/30"
                : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600"
            }`}
            title={`Click to turn attendance ${isAttendanceActive ? 'OFF' : 'ON'} for ${selectedZoomGrade}`}
          >
            <span className="relative flex h-2.5 w-2.5">
              {isAttendanceActive && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isAttendanceActive ? "bg-emerald-400" : "bg-slate-500"
                }`}
              ></span>
            </span>
            <div className="text-left">
              <span className="block text-[9px] uppercase tracking-wider font-extrabold opacity-75">
                {selectedZoomGrade}
              </span>
              <span className="font-extrabold">
                {isAttendanceActive ? "Attendance: ACTIVE (ON)" : "Attendance: INACTIVE (OFF)"}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* SUBTABS */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-[#0e1424]/90 backdrop-blur-xl p-2 rounded-2xl border border-slate-800/80 w-fit">
          {[
            { id: "Schedule", label: "Schedule Meeting", icon: Calendar },
            { id: "Attendance", label: `Attendance (${presentStudents.length}/${gradeStudents.length})`, icon: Users },
            { id: "History", label: "Class History", icon: History }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = zoomSubTab === tab.id || (tab.id === "Schedule" && zoomSubTab === "Setup");
            return (
              <button
                key={tab.id}
                onClick={() => setZoomSubTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ATTENDANCE QUICK STATUS INDICATOR */}
        <div className="flex items-center gap-2 bg-[#0e1424]/90 px-4 py-2 rounded-2xl border border-slate-800/80 text-xs">
          <span className="text-slate-400 font-medium">Attendance Gate:</span>
          {isAttendanceActive ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              OPEN for Students
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold border border-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              CLOSED / OFF
            </span>
          )}
        </div>
      </div>

      {/* SETUP / SCHEDULE TAB CONTENT */}
      {(zoomSubTab === "Setup" || zoomSubTab === "Schedule") && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* FORM */}
          <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Link className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {selectedZoomGrade} Meeting Parameters
                  </h3>
                  <p className="text-xs text-slate-400">Broadcast link & scheduled time</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">
                  Zoom Join Link (URL) *
                </label>
                <input
                  type="text"
                  value={currentGradeZoom.link || ""}
                  onChange={(e) => handleUpdate("link", e.target.value)}
                  placeholder="https://us02web.zoom.us/j/..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">
                  Session Date
                </label>
                <input
                  type="date"
                  value={currentGradeZoom.date || ""}
                  onChange={(e) => handleUpdate("date", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={currentGradeZoom.startTime || ""}
                    onChange={(e) => handleUpdate("startTime", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={currentGradeZoom.endTime || ""}
                    onChange={(e) => handleUpdate("endTime", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* ATTENDANCE ACTIVE SWITCH BOX */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">
                      Student Attendance Active Toggle
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        isAttendanceActive
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {isAttendanceActive ? "Active / ON" : "Inactive / OFF"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {isAttendanceActive
                      ? "සක්‍රීයයි - ශිෂ්‍ය Dashboard එකේ 'Mark My Attendance' බොත්තම දර්ශනය වේ."
                      : "අක්‍රීයයි - ශිෂ්‍ය Dashboard එකේ පැමිණීම සටහන් කිරීම වසා ඇත."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleAttendance(selectedZoomGrade)}
                  className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isAttendanceActive ? "bg-emerald-500 shadow-lg shadow-emerald-500/30" : "bg-slate-800"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      isAttendanceActive ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <button
                onClick={onSaveZoomSettings}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Publish Meeting for {selectedZoomGrade}</span>
              </button>
            </div>
          </div>

          {/* PREVIEW CARD */}
          <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 shadow-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                  Student Portal Preview
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {selectedZoomGrade}
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0b1020] border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black">
                    <Video className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Live Economics Class</h4>
                    <p className="text-xs text-slate-400">
                      {selectedZoomGrade} Weekly Interactive Session
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Date</p>
                    <p className="font-bold text-slate-200 mt-0.5">
                      {currentGradeZoom.date || "Not Scheduled"}
                    </p>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Time</p>
                    <p className="font-bold text-slate-200 mt-0.5">
                      {currentGradeZoom.startTime
                        ? `${formatTime(currentGradeZoom.startTime)} - ${formatTime(
                            currentGradeZoom.endTime
                          )}`
                        : "Pending"}
                    </p>
                  </div>
                </div>

                {/* ATTENDANCE BUTTON PREVIEW */}
                <div className="pt-2 border-t border-slate-800/80">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Student Attendance Button Status:
                  </p>
                  {isAttendanceActive ? (
                    <div className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs uppercase tracking-wider text-center shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                      <span>Mark My Attendance / පැමිණීම සටහන් කරන්න 📊</span>
                    </div>
                  ) : (
                    <div className="px-4 py-2.5 rounded-xl bg-slate-800/80 text-slate-400 font-bold text-xs uppercase tracking-wider text-center border border-slate-700/50">
                      Attendance Closed / පැමිණීම සටහන් කිරීම වසා ඇත
                    </div>
                  )}
                </div>

                {currentGradeZoom.link && (
                  <a
                    href={currentGradeZoom.link}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow"
                  >
                    <span>Test Join Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400">
              <p className="font-semibold text-slate-300 mb-1">
                Attendance Gate Policy:
              </p>
              Admin Panel එකෙන් <b>Attendance Active</b> බොත්තම ක්‍රියාත්මක කළ විට පමණක් සිසුන්ට තම Dashboard එක හරහා පැමිණීම සටහන් කළ හැක.
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED ATTENDANCE SUBTAB */}
      {zoomSubTab === "Attendance" && (
        <div className="space-y-6">
          {/* TOP CONTROL PANEL */}
          <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white">
                    {selectedZoomGrade} Attendance Hub
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                      isAttendanceActive
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    {isAttendanceActive ? "GATE IS OPEN (ACTIVE)" : "GATE IS CLOSED (OFF)"}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Manage live session attendance marking, toggle student access, and review present students.
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleAttendance(selectedZoomGrade)}
                  className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2.5 transition-all shadow-xl active:scale-95 border ${
                    isAttendanceActive
                      ? "bg-rose-600 hover:bg-rose-500 text-white border-rose-400 shadow-rose-600/30"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-emerald-600/30"
                  }`}
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                  </span>
                  <span>
                    {isAttendanceActive
                      ? `Turn OFF Attendance for ${selectedZoomGrade}`
                      : `Turn ON Attendance for ${selectedZoomGrade}`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleAllGradesAttendance(!isAttendanceActive)}
                  className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700 transition-all active:scale-95"
                >
                  {isAttendanceActive ? "Turn OFF All Grades" : "Turn ON All Grades"}
                </button>

                <button
                  type="button"
                  onClick={handleResetAttendance}
                  className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 font-bold text-xs border border-slate-800 hover:border-rose-500/30 transition-all flex items-center gap-2 active:scale-95"
                  title="Reset today's attendance records for this grade"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Today's Roster</span>
                </button>
              </div>
            </div>

            {/* METRICS ROW */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Total Enrolled
                </span>
                <p className="text-2xl font-black text-white">{gradeStudents.length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                  Marked Present
                </span>
                <p className="text-2xl font-black text-emerald-400">{presentStudents.length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-400">
                  Absent / Not Marked
                </span>
                <p className="text-2xl font-black text-rose-400">{absentStudents.length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">
                  Attendance Rate
                </span>
                <p className="text-2xl font-black text-blue-400">{attendanceRate}%</p>
              </div>
            </div>

            {/* SEARCH & FILTER TOOLBAR */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search student by name, ID, or phone..."
                  value={attendanceSearch}
                  onChange={(e) => setAttendanceSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-900 p-1 rounded-xl border border-slate-800">
                {[
                  { id: "all", label: `All (${gradeStudents.length})` },
                  { id: "present", label: `Present (${presentStudents.length})` },
                  { id: "absent", label: `Absent (${absentStudents.length})` }
                ].map((flt) => (
                  <button
                    key={flt.id}
                    onClick={() => setAttendanceFilter(flt.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      attendanceFilter === flt.id
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {flt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* STUDENT ROSTER TABLE */}
            <div className="border border-slate-800/80 rounded-2xl overflow-hidden">
              <div className="max-h-96 overflow-y-auto custom-scrollbar divide-y divide-slate-800/60">
                {displayedStudents.map((s, idx) => {
                  const isPresent = Boolean(s.isPresent);
                  return (
                    <div
                      key={s.id || idx}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                            isPresent
                              ? "bg-emerald-600 shadow-md shadow-emerald-600/20"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {s.name ? s.name[0].toUpperCase() : "S"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-white">{s.name || "Student"}</h4>
                            <span className="text-[10px] font-mono font-bold text-indigo-400">
                              {s.studentId || s.id}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            {s.phone || s.email || "No contact provided"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        {isPresent ? (
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-black border border-emerald-500/20 inline-flex items-center gap-1.5 shadow-sm">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Present ✔</span>
                              {s.attendanceTime && (
                                <span className="text-[10px] text-emerald-300 font-mono">
                                  ({s.attendanceTime})
                                </span>
                              )}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleStudentAttendance(s)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 text-[10px] font-bold border border-slate-700"
                              title="Mark as Absent"
                            >
                              Mark Absent
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-xl bg-slate-800/80 text-slate-400 text-xs font-bold border border-slate-700 inline-flex items-center gap-1.5">
                              <XCircle className="w-3.5 h-3.5 text-slate-500" />
                              <span>Absent / Not Marked</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleStudentAttendance(s)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-[10px] font-bold border border-emerald-500/30"
                              title="Manually Mark Present"
                            >
                              Mark Present
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {displayedStudents.length === 0 && (
                  <div className="p-12 text-center text-slate-500 text-xs">
                    No students found matching current filter or search criteria for {selectedZoomGrade}.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HISTORY */}
      {zoomSubTab === "History" && (
        <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-12 text-center text-slate-500 shadow-2xl">
          <History className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-300">
            Class History Log for {selectedZoomGrade}
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Live meeting records and session history are maintained automatically when classes conclude.
          </p>
        </div>
      )}
    </div>
  );
};

export default ZoomTab;
