import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Plus,
  Lock,
  Unlock,
  Edit3,
  Trash2,
  PlaySquare,
  Layers,
  Sparkles,
  AlertCircle,
  UploadCloud,
  Globe,
  Loader2,
  CheckCircle2,
  Tag
} from "lucide-react";
import { showAppToast } from "../GlobalAlert";

const formatVideoUrl = (rawUrl) => {
  if (!rawUrl) return "";
  let url = rawUrl.trim();
  if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("watch?v=")[1]?.split("&")[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
};

const SessionsTab = ({
  sessions = {},
  selectedSessionGrade,
  setSelectedSessionGrade,
  availableGrades = [],
  webGeneralSettings = {},
  setWebGeneralSettings,
  syncToBackend,
  showNotification,
  onQuickAddClass,
  onDeleteSubject,
  onDeleteGrade,
  onToggleLock,
  onDeleteSession,
  onOpenDesigner,
  onSaveNewSession
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [videoSourceMode, setVideoSourceMode] = useState("url");
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  // Master Subject & Grade Management State
  const subjects =
    webGeneralSettings?.subjects && webGeneralSettings.subjects.length > 0
      ? webGeneralSettings.subjects
      : ["Crypto Basic", "Order Flow"];
  const gradesObj = webGeneralSettings?.grades || {};

  const getSubjectForGrade = (grade) => {
    if (!grade) return subjects[0] || "Crypto Basic";
    if (subjects.includes(grade)) return grade;
    for (const sub of subjects) {
      if ((gradesObj[sub] || []).includes(grade)) return sub;
    }
    return subjects[0] || "Crypto Basic";
  };

  const [selectedSubject, setSelectedSubject] = useState(() =>
    getSubjectForGrade(selectedSessionGrade)
  );

  useEffect(() => {
    const sub = getSubjectForGrade(selectedSessionGrade);
    setSelectedSubject(sub);
  }, [selectedSessionGrade, webGeneralSettings]);

  const currentSubjectGrades = gradesObj[selectedSubject] || [];
  const hasGrades = Array.isArray(currentSubjectGrades) && currentSubjectGrades.length > 0;

  // Add / Delete Subject States
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSubjectInput, setNewSubjectInput] = useState("");

  // Add / Delete Grade States
  const [isAddingGrade, setIsAddingGrade] = useState(false);
  const [newGradeInput, setNewGradeInput] = useState("");

  const handleSubjectChange = (newSub) => {
    setSelectedSubject(newSub);
    const subGrades = gradesObj[newSub] || [];
    if (subGrades.length > 0) {
      setSelectedSessionGrade(subGrades[0]);
    } else {
      setSelectedSessionGrade(newSub);
    }
  };

  const submitAddSubject = () => {
    const trimmed = (newSubjectInput || "").trim();
    if (!trimmed) return;
    if (subjects.includes(trimmed)) {
      if (showNotification) showNotification("Subject Exists", `"${trimmed}" is already added.`, "info");
      setIsAddingSubject(false);
      setNewSubjectInput("");
      return;
    }
    const updatedSubjects = [...subjects, trimmed];
    const updatedGrades = { ...gradesObj, [trimmed]: [] };
    const updatedSettings = {
      ...webGeneralSettings,
      subjects: updatedSubjects,
      grades: updatedGrades
    };
    if (setWebGeneralSettings) setWebGeneralSettings(updatedSettings);
    try {
      localStorage.setItem("webGeneralSettings", JSON.stringify(updatedSettings));
    } catch (e) {}
    if (syncToBackend) syncToBackend("webGeneralSettings", updatedSettings);
    window.dispatchEvent(new Event("storage"));
    setSelectedSubject(trimmed);
    setSelectedSessionGrade(trimmed);
    setIsAddingSubject(false);
    setNewSubjectInput("");
    if (showNotification) {
      showNotification("Subject Added", `"${trimmed}" is now active in Register form & Curriculum!`, "success");
    }
  };

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: "subject", // "subject" | "grade"
    target: "",
    subject: ""
  });

  const confirmDeleteSubject = (sub) => {
    if (!sub) return;
    if (subjects.length <= 1) {
      if (showNotification) showNotification("Cannot Delete", "You must keep at least one subject in the system.", "error");
      return;
    }
    setDeleteModal({
      isOpen: true,
      type: "subject",
      target: sub,
      subject: sub
    });
  };

  const confirmDeleteGrade = (grade, sub = selectedSubject) => {
    if (!grade || !sub) return;
    setDeleteModal({
      isOpen: true,
      type: "grade",
      target: grade,
      subject: sub
    });
  };

  const handleExecuteDelete = () => {
    if (deleteModal.type === "subject") {
      const subToDelete = deleteModal.target;
      if (onDeleteSubject) {
        onDeleteSubject(subToDelete);
      } else {
        const updatedSubjects = subjects.filter((s) => s !== subToDelete);
        const updatedGrades = { ...gradesObj };
        delete updatedGrades[subToDelete];
        const updatedSettings = {
          ...webGeneralSettings,
          subjects: updatedSubjects,
          grades: updatedGrades
        };
        if (setWebGeneralSettings) setWebGeneralSettings(updatedSettings);
        try { localStorage.setItem("webGeneralSettings", JSON.stringify(updatedSettings)); } catch (e) {}
        if (syncToBackend) syncToBackend("webGeneralSettings", updatedSettings);
        window.dispatchEvent(new Event("storage"));
      }

      const remaining = subjects.filter((s) => s !== deleteModal.target);
      if (remaining.length > 0) {
        const nextSub = remaining[0];
        setSelectedSubject(nextSub);
        const nextGrades = (webGeneralSettings?.grades || {})[nextSub] || [];
        if (setSelectedSessionGrade) {
          setSelectedSessionGrade(nextGrades.length > 0 ? nextGrades[0] : nextSub);
        }
      }
    } else if (deleteModal.type === "grade") {
      const gradeToDelete = deleteModal.target;
      const sub = deleteModal.subject || selectedSubject;
      if (onDeleteGrade) {
        onDeleteGrade(sub, gradeToDelete);
      } else {
        const existing = gradesObj[sub] || [];
        const updatedList = existing.filter((g) => g !== gradeToDelete);
        const updatedGrades = {
          ...gradesObj,
          [sub]: updatedList
        };
        const updatedSettings = {
          ...webGeneralSettings,
          grades: updatedGrades
        };
        if (setWebGeneralSettings) setWebGeneralSettings(updatedSettings);
        try { localStorage.setItem("webGeneralSettings", JSON.stringify(updatedSettings)); } catch (e) {}
        if (syncToBackend) syncToBackend("webGeneralSettings", updatedSettings);
        window.dispatchEvent(new Event("storage"));
      }

      const existing = (webGeneralSettings?.grades || {})[sub] || [];
      const updatedList = existing.filter((g) => g !== deleteModal.target);
      if (setSelectedSessionGrade) {
        setSelectedSessionGrade(updatedList.length > 0 ? updatedList[0] : sub);
      }
    }
    setDeleteModal({ isOpen: false, type: "subject", target: "", subject: "" });
  };

  const submitAddGrade = () => {
    const trimmed = (newGradeInput || "").trim();
    if (!trimmed) return;
    const existing = gradesObj[selectedSubject] || [];
    if (existing.includes(trimmed)) {
      if (showNotification) showNotification("Batch Exists", `"${trimmed}" is already in ${selectedSubject}.`, "info");
      setIsAddingGrade(false);
      setNewGradeInput("");
      return;
    }
    const updatedGrades = {
      ...gradesObj,
      [selectedSubject]: [...existing, trimmed]
    };
    const updatedSettings = {
      ...webGeneralSettings,
      grades: updatedGrades
    };
    if (setWebGeneralSettings) setWebGeneralSettings(updatedSettings);
    try {
      localStorage.setItem("webGeneralSettings", JSON.stringify(updatedSettings));
    } catch (e) {}
    if (syncToBackend) syncToBackend("webGeneralSettings", updatedSettings);
    window.dispatchEvent(new Event("storage"));
    setSelectedSessionGrade(trimmed);
    setIsAddingGrade(false);
    setNewGradeInput("");
    if (showNotification) {
      showNotification("Batch Added", `Class "${trimmed}" added to ${selectedSubject} & synced to Register form!`, "success");
    }
  };

  const [newSessionForm, setNewSessionForm] = useState({
    title: "",
    titleSi: "",
    desc: "",
    videoUrl: "",
    videoFile: false,
    locked: false,
    content: []
  });

  const handleVideoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      showAppToast("Invalid File", "Please choose a valid video file (.mp4, .webm, .mov, etc.)", "error");
      return;
    }

    if (file.size > 250 * 1024 * 1024) {
      showAppToast("File Too Large", "Video file size must be less than 250MB.", "error");
      return;
    }

    try {
      setIsUploadingVideo(true);
      setUploadStatus("Processing video file...");

      const localBlobUrl = URL.createObjectURL(file);
      setNewSessionForm((prev) => ({ ...prev, videoUrl: localBlobUrl, videoFileName: file.name }));

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          setUploadStatus("Saving video to server...");
          const res = await fetch("http://localhost:5000/api/upload-video", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              videoData: event.target.result,
              fileName: file.name
            })
          });

          if (res.ok) {
            const data = await res.json();
            if (data.url) {
              setNewSessionForm((prev) => ({ ...prev, videoUrl: data.url, videoFileName: file.name }));
              setUploadStatus("Uploaded successfully!");
            }
          } else {
            setNewSessionForm((prev) => ({ ...prev, videoUrl: event.target.result, videoFileName: file.name }));
          }
        } catch (apiErr) {
          console.warn("Backend video upload notice:", apiErr);
          setNewSessionForm((prev) => ({ ...prev, videoUrl: event.target.result, videoFileName: file.name }));
        } finally {
          setIsUploadingVideo(false);
          setTimeout(() => setUploadStatus(""), 3500);
        }
      };

      reader.onerror = () => {
        showAppToast("Upload Failed", "Failed to read video file.", "error");
        setIsUploadingVideo(false);
        setUploadStatus("");
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setIsUploadingVideo(false);
      setUploadStatus("");
    }
  };

  const currentGradeSessions = sessions[selectedSessionGrade] || [];

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newSessionForm.title.trim()) return;
    onSaveNewSession({ ...newSessionForm, content: newSessionForm.content || [] });
    setNewSessionForm({
      title: "",
      titleSi: "",
      desc: "",
      videoUrl: "",
      videoFile: false,
      locked: false,
      content: []
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0e1424]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/80 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Course Curriculum Management
            </h2>
            <p className="text-xs text-slate-400">
              Manage subjects, class batches, weekly video lessons, and curriculum
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all active:scale-95 ml-auto sm:ml-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Session</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MASTER SUBJECT & GRADE / BATCH CONTROLLER BAR                             */}
      {/* ========================================================================= */}
      <div className="bg-[#0e1424]/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-800/80 shadow-2xl space-y-4">
        
        {/* ROW 1: SUBJECT / COURSE CONTROLS */}
        <div className="pb-4 border-b border-slate-800/70 space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Active Subject / Course
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <select
                    value={selectedSubject}
                    onChange={(e) => handleSubjectChange(e.target.value)}
                    className="bg-slate-900 text-white font-black text-sm sm:text-base border border-slate-700/80 rounded-xl px-3.5 py-1.5 outline-none focus:border-indigo-500 cursor-pointer shadow"
                  >
                    {subjects.map((sub) => (
                      <option key={sub} value={sub} className="bg-slate-900 text-white font-semibold">
                        {sub}
                      </option>
                    ))}
                  </select>

                  {/* Delete Selected Subject Button */}
                  <button
                    type="button"
                    onClick={() => confirmDeleteSubject(selectedSubject)}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-all cursor-pointer flex items-center gap-1.5"
                    title={`Delete subject "${selectedSubject}"`}
                  >
                    <Trash2 className="w-4 h-4 text-rose-400" />
                    <span className="text-[11px] font-bold text-rose-400 hidden sm:inline">Delete Subject</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ADD SUBJECT BUTTON / FORM */}
            <div className="flex items-center gap-2">
              {!isAddingSubject ? (
                <button
                  type="button"
                  onClick={() => setIsAddingSubject(true)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Subject</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-indigo-500/50 shadow-lg animate-fadeIn">
                  <input
                    type="text"
                    autoFocus
                    value={newSubjectInput}
                    onChange={(e) => setNewSubjectInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        submitAddSubject();
                      } else if (e.key === "Escape") {
                        setIsAddingSubject(false);
                      }
                    }}
                    placeholder="New Subject name (e.g. Crypto Basic)..."
                    className="w-48 sm:w-60 bg-slate-950 border-0 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={submitAddSubject}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 cursor-pointer"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingSubject(false);
                      setNewSubjectInput("");
                    }}
                    className="px-2 py-1.5 text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ACTIVE SUBJECT CHIPS (WITH INDIVIDUAL DELETE BUTTONS) */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mr-1">
              All Subjects:
            </span>
            {subjects.map((sub) => {
              const isSelected = selectedSubject === sub;
              return (
                <div
                  key={sub}
                  onClick={() => handleSubjectChange(sub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer select-none ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/40"
                      : "bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800"
                  }`}
                  title={isSelected ? `Current Subject: ${sub}` : `Switch to ${sub}`}
                >
                  <Layers className={`w-3 h-3 ${isSelected ? "text-indigo-200" : "text-slate-400"}`} />
                  <span>{sub}</span>
                  {subjects.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDeleteSubject(sub);
                      }}
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition-all cursor-pointer ${
                        isSelected
                          ? "bg-indigo-800/80 hover:bg-rose-500 text-indigo-200 hover:text-white"
                          : "bg-slate-800 hover:bg-rose-500 text-slate-400 hover:text-white"
                      }`}
                      title={`Delete "${sub}" from curriculum & registration`}
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ROW 2: GRADE / BATCH CONTROLS FOR SELECTED SUBJECT */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Classes / Batches:
            </span>

            {!hasGrades ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Standalone Course (No Grade Levels) — Appears directly in Register Form</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={selectedSessionGrade}
                  onChange={(e) => setSelectedSessionGrade(e.target.value)}
                  className="bg-slate-900 text-teal-300 font-bold text-xs border border-slate-700 rounded-xl px-3 py-1.5 outline-none cursor-pointer"
                >
                  {currentSubjectGrades.map((g) => (
                    <option key={g} value={g} className="bg-slate-900 text-white">
                      {g}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => confirmDeleteGrade(selectedSessionGrade)}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500/50 hover:bg-rose-500/10 text-rose-400 text-xs transition-all cursor-pointer"
                  title={`Delete batch "${selectedSessionGrade}" from ${selectedSubject}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Batch Chips with Delete Buttons */}
                <div className="flex items-center gap-1.5 ml-1">
                  {currentSubjectGrades.map((g) => {
                    const isSelected = selectedSessionGrade === g;
                    return (
                      <span
                        key={g}
                        onClick={() => setSelectedSessionGrade(g)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                          isSelected
                            ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm"
                            : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
                        }`}
                      >
                        <span>{g}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDeleteGrade(g);
                          }}
                          className="w-3.5 h-3.5 rounded-full hover:bg-rose-500 hover:text-white text-slate-500 flex items-center justify-center text-[9px] transition-colors cursor-pointer"
                          title={`Delete batch "${g}"`}
                        >
                          ✕
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ADD BATCH / GRADE BUTTON */}
          <div className="flex items-center gap-2">
            {!isAddingGrade ? (
              <button
                type="button"
                onClick={() => setIsAddingGrade(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                title={`Add sub-batch or cohort to ${selectedSubject}`}
              >
                <Plus className="w-3.5 h-3.5 text-teal-400" />
                <span>+ Add Batch / Grade</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-teal-500/50 shadow-lg animate-fadeIn">
                <input
                  type="text"
                  autoFocus
                  value={newGradeInput}
                  onChange={(e) => setNewGradeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      submitAddGrade();
                    } else if (e.key === "Escape") {
                      setIsAddingGrade(false);
                    }
                  }}
                  placeholder={`New batch for ${selectedSubject} (e.g. Batch 01)...`}
                  className="w-48 sm:w-56 bg-slate-950 border-0 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={submitAddGrade}
                  className="px-2.5 py-1 rounded-lg bg-teal-600 text-white text-xs font-bold hover:bg-teal-500 cursor-pointer"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingGrade(false);
                    setNewGradeInput("");
                  }}
                  className="px-1.5 py-1 text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* SESSIONS LIST */}
      <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {selectedSessionGrade} Sessions
            </span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold">
              {currentGradeSessions.length} Modules
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Click "Studio" to edit slides and interactive content
          </p>
        </div>

        <div className="divide-y divide-slate-800/60">
          {currentGradeSessions.map((session, index) => {
            const slideCount = (session.content || []).length;
            const isLocked = Boolean(session.locked);

            return (
              <div
                key={index}
                className="p-6 hover:bg-slate-800/25 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* LEFT INFO */}
                <div className="flex items-start gap-4 flex-grow">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[9px] font-extrabold uppercase text-slate-500">
                      WEEK
                    </span>
                    <span className="text-base font-black text-indigo-400 leading-none">
                      {index + 1}
                    </span>
                  </div>

                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 className="text-base font-bold text-white tracking-tight">
                        {session.title || "Untitled Session"}
                      </h4>
                      {session.titleSi && (
                        <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                          {session.titleSi}
                        </span>
                      )}
                      <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Layers className="w-3 h-3 text-indigo-400" />
                        <span>{slideCount} Slides</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 max-w-2xl line-clamp-1">
                      {session.desc || "No summary description set for this lesson module."}
                    </p>
                  </div>
                </div>

                {/* RIGHT ACTIONS */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  {/* Lock Toggle Button */}
                  <button
                    onClick={() => onToggleLock(index)}
                    title={isLocked ? "Unlock for students" : "Lock for students"}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                      isLocked
                        ? "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                    }`}
                  >
                    {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    <span>{isLocked ? "Locked" : "Unlocked"}</span>
                  </button>

                  {/* Open Slide Designer */}
                  <button
                    onClick={() => onOpenDesigner(index)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Lesson Studio</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => onDeleteSession(index)}
                    title="Delete Session"
                    className="w-9 h-9 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 flex items-center justify-center transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {currentGradeSessions.length === 0 && (
            <div className="py-20 text-center text-slate-500">
              <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="font-bold text-base text-slate-300">
                No sessions found for {selectedSessionGrade}
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Create a weekly curriculum lesson with video players, study notes, and MCQs.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Session</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CREATE SESSION MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1424] border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 animate-scaleUp">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white">Create New Session</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">
                  Session Title (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Session 01: Introduction to Demand"
                  value={newSessionForm.title}
                  onChange={(e) =>
                    setNewSessionForm({ ...newSessionForm, title: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">
                  Sinhala Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ඉල්ලුම සහ සැපයුම හැඳින්වීම"
                  value={newSessionForm.titleSi}
                  onChange={(e) =>
                    setNewSessionForm({ ...newSessionForm, titleSi: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">
                  Brief Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Summary of topics covered in this lesson..."
                  value={newSessionForm.desc}
                  onChange={(e) =>
                    setNewSessionForm({ ...newSessionForm, desc: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-medium text-white outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              {/* VIDEO SOURCE CONTROLS */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-400 block">
                    Main Session Video
                  </label>
                  <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => setVideoSourceMode("url")}
                      className={`px-3 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 transition-all ${
                        videoSourceMode === "url"
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Globe className="w-3 h-3" /> Web URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoSourceMode("upload")}
                      className={`px-3 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 transition-all ${
                        videoSourceMode === "upload"
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <UploadCloud className="w-3 h-3" /> Upload File
                    </button>
                  </div>
                </div>

                {videoSourceMode === "url" ? (
                  <div>
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=... or embed URL"
                      value={newSessionForm.videoUrl}
                      onChange={(e) =>
                        setNewSessionForm({ ...newSessionForm, videoUrl: formatVideoUrl(e.target.value) })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Supports YouTube, Vimeo, Google Drive, or direct MP4 links.</p>
                  </div>
                ) : (
                  <div>
                    <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-900/50 hover:bg-slate-900 transition-all text-center">
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                        className="hidden"
                        onChange={handleVideoFileUpload}
                        disabled={isUploadingVideo}
                      />
                      {isUploadingVideo ? (
                        <div className="flex flex-col items-center gap-2 text-indigo-400">
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <p className="text-xs font-bold">{uploadStatus || "Uploading video..."}</p>
                        </div>
                      ) : newSessionForm.videoUrl ? (
                        <div className="flex flex-col items-center gap-1">
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                          <p className="text-xs font-bold text-emerald-400">Video attached</p>
                          <p className="text-[10px] text-slate-400">{newSessionForm.videoFileName || "Click to change video"}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-slate-400">
                          <UploadCloud className="w-6 h-6 text-indigo-400" />
                          <p className="text-xs font-bold text-white">Choose Video from Computer</p>
                          <p className="text-[10px] text-slate-500">MP4, WebM, MOV supported (up to 250MB)</p>
                        </div>
                      )}
                    </label>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
                >
                  Save & Setup Slides
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="bg-[#0e1424] border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-black text-white">
                  Delete {deleteModal.type === "subject" ? "Subject" : "Batch"}?
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Are you sure you want to delete{" "}
                  <strong className="text-white font-bold">"{deleteModal.target}"</strong>?
                  {deleteModal.type === "subject" && (
                    <span className="block text-rose-400/90 text-[11px] mt-1 font-medium">
                      This will also remove it from the Student Registration form.
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModal({ isOpen: false, type: "subject", target: "", subject: "" })}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteDelete}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                >
                  Delete Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SessionsTab;
