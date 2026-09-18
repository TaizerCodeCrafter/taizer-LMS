import React, { useState } from "react";
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
  CheckCircle2
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
  onQuickAddClass,
  onToggleLock,
  onDeleteSession,
  onOpenDesigner,
  onSaveNewSession
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQuickAddClassOpen, setIsQuickAddClassOpen] = useState(false);
  const [newClassNameInput, setNewClassNameInput] = useState("");
  const [videoSourceMode, setVideoSourceMode] = useState("url");
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
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
              Manage weekly sessions, video lessons, notes, and interactive quizzes
            </p>
          </div>
        </div>

        {/* GRADE / CLASS PICKER & QUICK ADD & ADD BUTTON */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800">
            <label className="text-xs font-bold text-slate-400">Course / Category:</label>
            <select
              value={selectedSessionGrade}
              onChange={(e) => setSelectedSessionGrade(e.target.value)}
              className="bg-transparent text-xs font-black text-emerald-400 outline-none cursor-pointer max-w-[180px] sm:max-w-[220px]"
            >
              {(availableGrades.length > 0
                ? availableGrades
                : [
                    "Crypto Basic",
                    "Price Action",
                    "Technical Analysis",
                    "Grade 12",
                    "Grade 13"
                  ]
              ).map((g) => (
                <option key={g} value={g} className="bg-slate-900 text-slate-200">
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* QUICK ADD NEW CLASS / COURSE BUTTON */}
          {onQuickAddClass && (
            <div>
              {!isQuickAddClassOpen ? (
                <button
                  type="button"
                  onClick={() => setIsQuickAddClassOpen(true)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
                  title="Add new course category or batch"
                >
                  <Plus className="w-3.5 h-3.5 text-teal-400" />
                  <span className="hidden sm:inline">Add Course</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-teal-500/50 shadow-lg animate-fadeIn">
                  <input
                    type="text"
                    autoFocus
                    value={newClassNameInput}
                    onChange={(e) => setNewClassNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (newClassNameInput.trim()) {
                          onQuickAddClass(newClassNameInput.trim());
                          setNewClassNameInput("");
                          setIsQuickAddClassOpen(false);
                        }
                      } else if (e.key === "Escape") {
                        setIsQuickAddClassOpen(false);
                      }
                    }}
                    placeholder="Course name (e.g. Crypto Basic)..."
                    className="w-36 sm:w-44 bg-slate-950 border-0 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newClassNameInput.trim()) {
                        onQuickAddClass(newClassNameInput.trim());
                        setNewClassNameInput("");
                        setIsQuickAddClassOpen(false);
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-teal-600 text-white text-xs font-bold hover:bg-teal-500"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsQuickAddClassOpen(false)}
                    className="px-1.5 py-1 text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all active:scale-95 ml-auto sm:ml-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Session</span>
          </button>
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
    </div>
  );
};

export default SessionsTab;
