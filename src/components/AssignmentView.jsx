import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Award,
  FileText,
  Paperclip,
  Check,
  CheckCircle2,
  ExternalLink,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Code,
  Play,
  RefreshCw,
  Eye,
  Layout,
  XCircle,
  AlertCircle,
  Sparkles,
  Edit3,
  Loader2
} from "lucide-react";
import { evaluateWebCode, buildPreviewDocument } from "../utils/codeEvaluator";

const AssignmentView = ({
  assignments = [],
  user,
  assignmentSubmissions = {},
  activeAssignment,
  setActiveAssignment,
  currentTaskIndex,
  setCurrentTaskIndex,
  studentAnswers,
  handleAnswerChange,
  handleDiagramUpload,
  handleSubmitAssignment,
  handleOpenAssignment,
  showSubmitModal,
  setShowSubmitModal,
  isSubmittingAssignment,
  viewingSubmittedMode,
  setViewingSubmittedMode,
  uploadingDiagram,
  showReferenceSheet,
  setShowReferenceSheet
}) => {
  const [activeCodeTab, setActiveCodeTab] = useState("html");
  const [codeTestResults, setCodeTestResults] = useState({});
  const [previewTab, setPreviewTab] = useState("split"); // "split" | "target" | "output"

  const palettes = [
    { badgeBg: "bg-amber-500", badgeText: "text-black", btnBg: "bg-amber-500 hover:bg-amber-400 text-black", border: "hover:border-amber-500/40" },
    { badgeBg: "bg-emerald-500", badgeText: "text-black", btnBg: "bg-emerald-500 hover:bg-emerald-400 text-black", border: "hover:border-emerald-500/40" },
    { badgeBg: "bg-cyan-500", badgeText: "text-black", btnBg: "bg-cyan-500 hover:bg-cyan-400 text-black", border: "hover:border-cyan-500/40" },
    { badgeBg: "bg-indigo-500", badgeText: "text-white", btnBg: "bg-indigo-600 hover:bg-indigo-500 text-white", border: "hover:border-indigo-500/40" },
    { badgeBg: "bg-purple-500", badgeText: "text-white", btnBg: "bg-purple-600 hover:bg-purple-500 text-white", border: "hover:border-purple-500/40" }
  ];

  const submittedCount = assignments.filter(a => Boolean(assignmentSubmissions[a.id || a.title])).length;
  const pendingCount = assignments.length - submittedCount;

  return (
    <div className="space-y-10">
      {/* SECTION HEADER & STATS */}
      <div className="bg-[#0f172a]/90 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-800/60 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 blur-[120px] -z-10" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest">
              <span>📝</span> Enrolled: {user?.grade || user?.subject || "Crypto Basic"} Curriculum
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase italic tracking-tight">
              Online Assignments & Evaluations
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-2xl leading-relaxed">
              සතිපතා ප්‍රශ්න පත්‍ර සහ පැවරුම් online ආකාරයෙන් සම්පූර්ණ කර ගුරුවරයා වෙත යොමු කරන්න. 
              MCQ, සවිස්තර රචනා සහ ප්‍රස්ථාර රූපසටහන් සෘජුවම submit කළ හැක.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="flex items-center gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800/80 shrink-0">
            <div className="text-center px-3">
              <p className="text-xl font-black text-white">{assignments.length}</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Total</p>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-center px-3">
              <p className="text-xl font-black text-emerald-400">{submittedCount}</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Submitted</p>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-center px-3">
              <p className="text-xl font-black text-amber-400">{pendingCount}</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* ASSIGNMENTS CARDS GRID (SESSION-STYLE) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {assignments.map((assignment, index) => {
          const asgKey = assignment.id || assignment.title;
          const submission = assignmentSubmissions[asgKey] || assignmentSubmissions[assignment.title];
          const isSubmitted = Boolean(submission);
          const hasDraft = !isSubmitted && Boolean(
            JSON.parse(localStorage.getItem("lmsAssignmentDrafts") || "{}")?.[user?.email]?.[asgKey]
          );

          const palette = assignment.locked
            ? { badgeBg: "bg-slate-700", badgeText: "text-slate-400", btnBg: "bg-slate-800 text-slate-500", border: "" }
            : palettes[index % palettes.length];

          return (
            <motion.div
              key={assignment.id || index}
              whileHover={!assignment.locked ? { y: -6 } : {}}
              className={`p-8 rounded-[2rem] bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800/80 flex flex-col justify-between shadow-2xl relative transition-all ${palette.border} ${
                assignment.locked ? "opacity-60" : ""
              }`}
            >
              <div>
                {/* Top Badges */}
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`px-4 py-1.5 rounded-full text-[11px] font-black tracking-wider uppercase ${palette.badgeBg} ${palette.badgeText}`}
                  >
                    Assignment {index + 1}
                  </div>

                  {assignment.locked ? (
                    <span className="text-slate-500 text-lg">🔒</span>
                  ) : isSubmitted ? (
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      {submission.status === "Graded" ? `Graded: ${submission.score}` : "Submitted"}
                    </span>
                  ) : hasDraft ? (
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      ✎ In Progress
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-400">
                      ● Open
                    </span>
                  )}
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-1.5 mb-4">
                  <h4
                    className={`text-lg font-black tracking-tight leading-snug ${
                      assignment.locked ? "text-slate-500" : "text-white"
                    }`}
                  >
                    {assignment.title}
                  </h4>
                  {assignment.titleSi && (
                    <p
                      className={`text-xs font-semibold ${
                        assignment.locked ? "text-slate-600" : "text-slate-400"
                      }`}
                    >
                      {assignment.titleSi}
                    </p>
                  )}
                </div>

                {/* Description */}
                <p
                  className={`text-xs leading-relaxed line-clamp-3 mb-6 ${
                    assignment.locked ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  {assignment.desc || "Online curriculum assessment with questions and teacher feedback."}
                </p>

                {/* Metadata Chips */}
                <div className="flex flex-wrap gap-2 text-[11px] font-bold text-slate-400 mb-6">
                  <span className="inline-flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Due: {assignment.dueDate || "Ongoing"}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>{assignment.timeLimit || "60 Mins"}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{assignment.totalMarks || 50} Marks</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
                    <FileText className="w-3.5 h-3.5 text-purple-400" />
                    <span>{assignment.tasks?.length || 0} Questions</span>
                  </span>
                  {assignment.fileUrl && (
                    <span className="inline-flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-teal-400">
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>PDF Paper</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-800/80">
                {assignment.locked ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl font-bold text-xs bg-slate-900 text-slate-600 flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <span>🔒 Locked</span>
                  </button>
                ) : isSubmitted ? (
                  <button
                    onClick={() => handleOpenAssignment(assignment)}
                    className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20"
                  >
                    <span>✓ Review Submission & Marks</span>
                  </button>
                ) : hasDraft ? (
                  <button
                    onClick={() => handleOpenAssignment(assignment)}
                    className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <span>✎ Continue Assignment</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenAssignment(assignment)}
                    className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider ${palette.btnBg} transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/10`}
                  >
                    <span>▶ Start Online Assignment</span>
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {assignments.length === 0 && (
        <div className="text-center p-20 bg-[#0f172a] rounded-[3rem] border border-slate-800/50 border-dashed space-y-3">
          <div className="text-4xl">📝</div>
          <p className="text-slate-400 font-black uppercase tracking-widest text-sm">
            No online assignments published for {user?.grade || "your grade"} yet.
          </p>
          <p className="text-slate-600 text-xs font-semibold">
            Admin will upload weekly assignments and papers shortly.
          </p>
        </div>
      )}

      {/* FULL-SCREEN INTERACTIVE ASSIGNMENT WORKSPACE (SESSION-STYLE) */}
      <AnimatePresence>
        {activeAssignment && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="fixed inset-0 z-[100] bg-[#020617] flex flex-col overflow-hidden text-white"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800/80 bg-[#0f172a]/90 backdrop-blur-md shrink-0">
              <button
                onClick={() => {
                  setActiveAssignment(null);
                  setShowReferenceSheet(false);
                }}
                className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
                <span className="text-xs sm:text-sm font-bold tracking-wider uppercase truncate max-w-[200px] sm:max-w-md">
                  Assignments | {activeAssignment.title}
                </span>
              </button>

              <div className="flex items-center gap-3 sm:gap-6">
                {/* Reference PDF Toggle */}
                {activeAssignment.fileUrl && (
                  <button
                    onClick={() => setShowReferenceSheet(!showReferenceSheet)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                      showReferenceSheet
                        ? "bg-teal-500/20 border-teal-500/40 text-teal-300"
                        : "bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white"
                    }`}
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reference PDF Paper</span>
                  </button>
                )}

                {/* Question Step Indicator */}
                <div className="flex items-center gap-2 text-xs font-black tracking-widest text-slate-400">
                  <span className="text-amber-400 font-black">
                    Q {currentTaskIndex + 1}
                  </span>
                  <span>/</span>
                  <span>{activeAssignment.tasks?.length || 1}</span>
                </div>

                {/* Fullscreen Button */}
                <button
                  className="text-slate-400 hover:text-white transition-colors hidden sm:block"
                  onClick={() => document.documentElement.requestFullscreen().catch(() => {})}
                  title="Fullscreen"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-900 shrink-0">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 via-teal-400 to-emerald-400"
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    ((currentTaskIndex + 1) / (activeAssignment.tasks?.length || 1)) * 100
                  }%`
                }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Submission Notice Banner (If in Review Mode) */}
            {viewingSubmittedMode && (
              <div className="bg-emerald-950/50 border-b border-emerald-500/30 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
                <div className="flex items-center gap-2 text-emerald-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Submitted Mode: You are viewing your submitted answers. Click anywhere or Edit to modify.</span>
                </div>
                <div className="flex items-center gap-3">
                  {assignmentSubmissions[activeAssignment.id || activeAssignment.title]?.score !== undefined && (
                    <div className="font-black text-white bg-emerald-600 px-3 py-1 rounded-lg">
                      Marks: {assignmentSubmissions[activeAssignment.id || activeAssignment.title].score} / {activeAssignment.totalMarks || 50}
                    </div>
                  )}
                  {setViewingSubmittedMode && (
                    <button
                      onClick={() => setViewingSubmittedMode(false)}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-black font-black text-xs hover:bg-amber-400 transition-all shadow-md flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Answers / පිළිතුරු සංස්කරණය</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Main Workspace Area */}
            <div className="flex-1 flex overflow-hidden min-h-0 relative">
              {/* Optional Split: Attached Reference Paper (Left Pane) */}
              {showReferenceSheet && activeAssignment.fileUrl && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "45%", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="hidden lg:flex flex-col border-r border-slate-800 bg-slate-950/90 h-full overflow-hidden shrink-0"
                >
                  <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-400 flex items-center gap-2">
                      <Paperclip className="w-3.5 h-3.5" />
                      Attached Question Paper / Reference Theory
                    </span>
                    <a
                      href={activeAssignment.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      download
                      className="text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Open in Tab
                    </a>
                  </div>
                  <div className="flex-1 p-2 overflow-hidden">
                    <embed
                      src={activeAssignment.fileUrl}
                      type="application/pdf"
                      className="w-full h-full rounded-xl border border-slate-800"
                    />
                  </div>
                </motion.div>
              )}

              {/* Question Workspace (Right / Center Pane) */}
              <div className="flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar p-6 sm:p-12 pb-32">
                <div className="max-w-4xl mx-auto w-full space-y-8 animate-fadeIn">
                  {(() => {
                    const task = activeAssignment.tasks?.[currentTaskIndex];
                    if (!task) {
                      return (
                        <div className="text-center p-16 border border-slate-800 border-dashed rounded-3xl">
                          <p className="text-slate-500 font-bold text-sm">
                            No questions found in this assignment.
                          </p>
                        </div>
                      );
                    }

                    const answerVal = studentAnswers[currentTaskIndex];

                    return (
                      <div className="space-y-8">
                        {/* Question Header & Type Badge */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                          <div className="flex items-center gap-3">
                            <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              {task.type === "mcq"
                                ? "Multiple Choice (MCQ)"
                                : task.type === "essay"
                                ? "Written Answer Pad"
                                : task.type === "code"
                                ? "Web Dev & Coding Challenge"
                                : "Handwritten Diagram Upload"}
                            </span>
                            <span className="text-xs font-black text-slate-400">
                              [ {task.marks || 10} Marks ]
                            </span>
                          </div>

                          <div className="text-[11px] font-bold text-slate-500">
                            Question {currentTaskIndex + 1} of {activeAssignment.tasks?.length}
                          </div>
                        </div>

                        {/* Question Text */}
                        <div className="space-y-2">
                          <h3 className="text-xl sm:text-3xl font-black text-white leading-tight">
                            {task.question}
                          </h3>
                          {task.questionSi && (
                            <p className="text-slate-400 font-medium text-sm sm:text-base leading-relaxed">
                              {task.questionSi}
                            </p>
                          )}
                        </div>

                        {/* Task UI: MCQ Choices */}
                        {task.type === "mcq" && (
                          <div className="space-y-3 pt-4">
                            {(task.options || []).map((opt, oIdx) => {
                              const isSelected = answerVal === oIdx;
                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => {
                                    if (viewingSubmittedMode && setViewingSubmittedMode) {
                                      setViewingSubmittedMode(false);
                                    }
                                    handleAnswerChange(currentTaskIndex, oIdx);
                                  }}
                                  className={`w-full p-5 rounded-2xl border text-left font-medium text-base sm:text-lg transition-all flex items-center gap-4 ${
                                    isSelected
                                      ? "bg-amber-500/15 border-amber-500/60 text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.15)]"
                                      : "bg-[#0f172a]/60 border-slate-800 text-slate-300 hover:bg-slate-800/50 hover:border-slate-700"
                                  }`}
                                >
                                  <div
                                    className={`w-7 h-7 rounded-xl border flex items-center justify-center font-black text-xs shrink-0 ${
                                      isSelected
                                        ? "bg-amber-500 border-amber-400 text-black"
                                        : "border-slate-700 text-slate-400"
                                    }`}
                                  >
                                    {String.fromCharCode(65 + oIdx)}
                                  </div>
                                  <span className="flex-1">{opt}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Task UI: Essay / Written Answer Pad */}
                        {task.type === "essay" && (() => {
                          const essayText = typeof answerVal === "string" ? answerVal : (answerVal !== undefined && answerVal !== null ? String(answerVal) : "");
                          return (
                            <div className="space-y-4 pt-2">
                              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                                <div className="flex items-center gap-2">
                                  <span>Online Answer Sheet:</span>
                                  {viewingSubmittedMode && (
                                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                                      Saved Answer
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  {viewingSubmittedMode && setViewingSubmittedMode && (
                                    <button
                                      type="button"
                                      onClick={() => setViewingSubmittedMode(false)}
                                      className="text-amber-400 hover:text-amber-300 text-xs font-bold underline cursor-pointer"
                                    >
                                      Edit Answer ✏️
                                    </button>
                                  )}
                                  <span className="text-amber-400">
                                    Word Count:{" "}
                                    {essayText.trim().split(/\s+/).filter(Boolean).length}
                                  </span>
                                </div>
                              </div>

                              <textarea
                                rows={8}
                                placeholder="ඔබගේ පිළිතුර මෙහි සටහන් කරන්න... / Type your analytical answer here in Sinhala or English..."
                                value={essayText}
                                onChange={(e) => {
                                  if (viewingSubmittedMode && setViewingSubmittedMode) {
                                    setViewingSubmittedMode(false);
                                  }
                                  handleAnswerChange(currentTaskIndex, e.target.value);
                                }}
                                className="w-full bg-[#070c18] border border-slate-800 rounded-2xl p-5 text-sm sm:text-base text-slate-200 outline-none focus:border-amber-500/80 leading-relaxed custom-scrollbar shadow-inner focus:ring-1 focus:ring-amber-500/40"
                              />

                              <p className="text-[11px] text-slate-500 italic">
                                💡 Note: Your draft is automatically saved as you type. You can navigate between questions freely.
                              </p>
                            </div>
                          );
                        })()}

                        {/* Task UI: Handwritten Diagram / Paper Upload */}
                        {task.type === "diagram" && (
                          <div className="space-y-4 pt-2">
                            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                              <div>
                                <p className="text-xs font-bold text-slate-300">Instructions:</p>
                                <p className="text-xs text-slate-400 mt-1">
                                  {task.instructions ||
                                    "ප්‍රස්ථාරය හෝ අත්අකුරු පිළිතුර ඇඳ පැහැදිලි ඡායාරූපයක් (Photo) හෝ PDF එකක් මෙහි upload කරන්න."}
                                </p>
                              </div>

                              <label className="cursor-pointer border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-black/30 hover:bg-amber-500/5 transition-all">
                                <UploadCloud className="w-8 h-8 text-amber-400" />
                                <div className="text-center">
                                  <p className="text-xs font-bold text-slate-200">
                                    {uploadingDiagram ? "Uploading..." : answerVal ? "Click to change / replace diagram photo" : "Click or Drag photo of your diagram / answer"}
                                  </p>
                                  <p className="text-[10px] text-slate-500 mt-0.5">
                                    Supports PNG, JPG, JPEG, PDF (Under 10MB)
                                  </p>
                                </div>
                                <input
                                  type="file"
                                  accept="image/*,.pdf"
                                  onChange={(e) => {
                                    if (viewingSubmittedMode && setViewingSubmittedMode) {
                                      setViewingSubmittedMode(false);
                                    }
                                    handleDiagramUpload(e, currentTaskIndex);
                                  }}
                                  className="hidden"
                                />
                              </label>

                              {/* Uploaded File Preview */}
                              {answerVal && (
                                <div className="p-4 rounded-xl bg-black/40 border border-slate-800 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                                      <CheckCircle2 className="w-4 h-4" />
                                      Answer File Attached
                                    </span>
                                    <button
                                      onClick={() => {
                                        if (viewingSubmittedMode && setViewingSubmittedMode) {
                                          setViewingSubmittedMode(false);
                                        }
                                        handleAnswerChange(currentTaskIndex, "");
                                      }}
                                      className="text-xs text-rose-400 hover:text-rose-300 font-bold"
                                    >
                                      Remove & Re-upload
                                    </button>
                                  </div>

                                  {(typeof answerVal === "string" && answerVal.startsWith("data:image")) ||
                                  (typeof answerVal === "string" && answerVal.match(/\.(png|jpe?g|webp|gif)/i)) ? (
                                    <img
                                      src={answerVal}
                                      alt="Answer Diagram"
                                      className="max-h-80 w-auto rounded-xl border border-slate-700 object-contain mx-auto cursor-pointer"
                                      onClick={() => window.open(answerVal, "_blank")}
                                    />
                                  ) : (
                                    <a
                                      href={answerVal}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold inline-flex items-center gap-2"
                                    >
                                      <Paperclip className="w-3.5 h-3.5" />
                                      View Attached File
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Task UI: Web Dev & Programming Challenge */}
                        {task.type === "code" && (() => {
                          const defaultStarter = task.starterCode || {
                            html: '<!-- Write your HTML code here -->\n<form class="login-form">\n  <h2>Login</h2>\n  <input type="text" placeholder="Username" />\n  <input type="password" placeholder="Password" />\n  <button type="submit">Sign In</button>\n</form>',
                            css: '/* Write your CSS styling here */\n.login-form {\n  max-width: 320px;\n  margin: 20px auto;\n  padding: 24px;\n  background: #f8fafc;\n  border-radius: 16px;\n  box-shadow: 0 4px 15px rgba(0,0,0,0.08);\n}\n',
                            js: ''
                          };

                          const currentCode = typeof answerVal === "object" && answerVal !== null
                            ? answerVal
                            : (typeof answerVal === "string" && answerVal.trim().startsWith("{")
                                ? (() => { try { return JSON.parse(answerVal); } catch { return defaultStarter; } })()
                                : (typeof defaultStarter === "object" ? defaultStarter : { html: defaultStarter || "", css: "", js: "" }));

                          const targetDoc = buildPreviewDocument(
                            task.solutionCode?.html || task.targetHtml || "",
                            task.solutionCode?.css || task.targetCss || "",
                            task.solutionCode?.js || ""
                          );

                          const studentDoc = buildPreviewDocument(
                            currentCode.html || "",
                            currentCode.css || "",
                            currentCode.js || ""
                          );

                          const testReport = codeTestResults[currentTaskIndex] || (currentCode.testResults ? {
                            score: currentCode.autoScore || 0,
                            maxMarks: currentCode.maxMarks || task.marks || 20,
                            percentage: currentCode.percentage || 0,
                            results: currentCode.testResults
                          } : null);

                          const handleUpdateCode = (lang, val) => {
                            if (viewingSubmittedMode && setViewingSubmittedMode) {
                              setViewingSubmittedMode(false);
                            }
                            const updated = {
                              ...currentCode,
                              [lang]: val
                            };
                            handleAnswerChange(currentTaskIndex, updated);
                          };

                          const handleRunTests = () => {
                            const report = evaluateWebCode(currentCode, task.testRules);
                            setCodeTestResults(prev => ({
                              ...prev,
                              [currentTaskIndex]: report
                            }));
                            handleAnswerChange(currentTaskIndex, {
                              ...currentCode,
                              autoScore: report.score,
                              maxMarks: report.maxMarks,
                              percentage: report.percentage,
                              testResults: report.results
                            });
                          };

                          return (
                            <div className="space-y-6 pt-2">
                              {/* PREVIEW CONTROLS & DUAL PREVIEW PANES */}
                              <div className="space-y-3">
                                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800">
                                  <div className="flex items-center gap-2">
                                    <Layout className="w-4 h-4 text-amber-400" />
                                    <span className="text-xs font-bold text-slate-300">Preview Mode:</span>
                                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                                      <button
                                        type="button"
                                        onClick={() => setPreviewTab("split")}
                                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                          previewTab === "split" ? "bg-amber-500 text-black shadow" : "text-slate-400 hover:text-white"
                                        }`}
                                      >
                                        Split View (Both)
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setPreviewTab("target")}
                                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                          previewTab === "target" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
                                        }`}
                                      >
                                        🎯 Target Design Only
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setPreviewTab("output")}
                                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                          previewTab === "output" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"
                                        }`}
                                      >
                                        ⚡ My Live Output
                                      </button>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    {!viewingSubmittedMode && (
                                      <button
                                        type="button"
                                        onClick={handleRunTests}
                                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all active:scale-95"
                                      >
                                        <Play className="w-3.5 h-3.5 fill-current" />
                                        <span>Check & Test Code</span>
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* IFRAME PREVIEWS */}
                                <div className={`grid gap-4 ${previewTab === "split" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
                                  {/* Target View (Teacher Model UI - Secret Code Hidden) */}
                                  {(previewTab === "split" || previewTab === "target") && (
                                    <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col">
                                      <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                                        <span className="text-[11px] font-bold text-indigo-400 flex items-center gap-1.5">
                                          <span>🎯</span> Target Design (Replicate this UI)
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                          Secret Model View
                                        </span>
                                      </div>
                                      <div className="p-3 bg-slate-950/40">
                                        <iframe
                                          title="Target Design Preview"
                                          srcDoc={targetDoc}
                                          sandbox="allow-scripts"
                                          className="w-full h-64 sm:h-72 rounded-xl border border-slate-800 bg-white shadow-inner"
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {/* Student Live Output */}
                                  {(previewTab === "split" || previewTab === "output") && (
                                    <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col">
                                      <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                                        <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                                          <Eye className="w-3.5 h-3.5" /> My Live Output (Real-time)
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                          Updates as you type
                                        </span>
                                      </div>
                                      <div className="p-3 bg-slate-950/40">
                                        <iframe
                                          title="Student Live Output"
                                          srcDoc={studentDoc}
                                          sandbox="allow-scripts"
                                          className="w-full h-64 sm:h-72 rounded-xl border border-slate-800 bg-white shadow-inner"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* TEST RESULTS DRAWER / BADGE */}
                              {testReport && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/40 shadow-xl space-y-3"
                                >
                                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                                    <div className="flex items-center gap-2">
                                      <Sparkles className="w-4 h-4 text-amber-400" />
                                      <span className="text-xs font-black uppercase tracking-wider text-white">
                                        Automated Test Detection Results
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-slate-400">Score:</span>
                                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-black text-xs border border-amber-500/40">
                                        {testReport.score} / {testReport.maxMarks} Marks ({testReport.percentage}%)
                                      </span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {(testReport.results || []).map((res, rIdx) => (
                                      <div
                                        key={res.id || rIdx}
                                        className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                                          res.passed
                                            ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-200"
                                            : "bg-rose-950/30 border-rose-500/30 text-rose-200"
                                        }`}
                                      >
                                        {res.passed ? (
                                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                        ) : (
                                          <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                                        )}
                                        <div className="flex-1 space-y-0.5">
                                          <div className="flex items-center justify-between">
                                            <span className="font-bold">{res.label}</span>
                                            <span className="font-black text-[10px]">
                                              {res.passed ? `+${res.marks} Marks` : "0 Marks"}
                                            </span>
                                          </div>
                                          {!res.passed && res.hint && (
                                            <p className="text-[10px] text-slate-400 italic">💡 Hint: {res.hint}</p>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}

                              {/* CODE EDITOR */}
                              <div className="rounded-2xl bg-[#090d16] border border-slate-800 overflow-hidden shadow-2xl space-y-0">
                                {/* Editor Tabs */}
                                <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Code className="w-4 h-4 text-indigo-400" />
                                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                                      <button
                                        type="button"
                                        onClick={() => setActiveCodeTab("html")}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                                          activeCodeTab === "html" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "text-slate-400 hover:text-white"
                                        }`}
                                      >
                                        <span>HTML</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setActiveCodeTab("css")}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                                          activeCodeTab === "css" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "text-slate-400 hover:text-white"
                                        }`}
                                      >
                                        <span>CSS</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setActiveCodeTab("js")}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                                          activeCodeTab === "js" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" : "text-slate-400 hover:text-white"
                                        }`}
                                      >
                                        <span>JavaScript</span>
                                      </button>
                                    </div>
                                  </div>

                                  <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                                    Editing {activeCodeTab.toUpperCase()} • Auto-saving
                                  </span>
                                </div>

                                {/* Editor Textarea with Monospace Font */}
                                <div className="p-4 bg-[#050811]">
                                  <textarea
                                    rows={12}
                                    value={currentCode[activeCodeTab] || ""}
                                    onChange={(e) => handleUpdateCode(activeCodeTab, e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Tab") {
                                        e.preventDefault();
                                        const start = e.target.selectionStart;
                                        const end = e.target.selectionEnd;
                                        const val = e.target.value;
                                        const updated = val.substring(0, start) + "  " + val.substring(end);
                                        handleUpdateCode(activeCodeTab, updated);
                                        setTimeout(() => {
                                          e.target.selectionStart = e.target.selectionEnd = start + 2;
                                        }, 0);
                                      }
                                    }}
                                    placeholder={`/* Write your ${activeCodeTab.toUpperCase()} code here... */`}
                                    className="w-full bg-transparent font-mono text-xs sm:text-sm text-slate-200 outline-none leading-relaxed resize-y custom-scrollbar"
                                    style={{ tabSize: 2 }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Teacher Feedback (If Available in Review Mode) */}
                        {viewingSubmittedMode &&
                          assignmentSubmissions[activeAssignment.id || activeAssignment.title]?.feedback && (
                            <div className="p-6 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                              <p className="text-xs font-black uppercase tracking-wider text-indigo-400">
                                Teacher Feedback & Remarks:
                              </p>
                              <p className="text-sm text-slate-200 font-medium">
                                {assignmentSubmissions[activeAssignment.id || activeAssignment.title].feedback}
                              </p>
                            </div>
                          )}
                      </div>
                    );
                  })()}
                </div>

                {/* Navigation Controls Footer */}
                <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-[#0f172a]/95 backdrop-blur-xl border-t border-slate-800/80 flex items-center justify-between gap-4 z-[110]">
                  <button
                    onClick={() => setCurrentTaskIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentTaskIndex === 0}
                    className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-black uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  {/* Question Quick Jump Pills */}
                  <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-[200px] sm:max-w-md custom-scrollbar py-1">
                    {(activeAssignment.tasks || []).map((_, qIdx) => {
                      const isAnswered = studentAnswers[qIdx] !== undefined && studentAnswers[qIdx] !== "";
                      const isCurrent = currentTaskIndex === qIdx;
                      return (
                        <button
                          key={qIdx}
                          onClick={() => setCurrentTaskIndex(qIdx)}
                          className={`w-8 h-8 rounded-xl font-black text-xs transition-all shrink-0 flex items-center justify-center ${
                            isCurrent
                              ? "bg-amber-500 text-black shadow-lg shadow-amber-500/30 scale-110 ring-2 ring-amber-400"
                              : isAnswered
                              ? "bg-emerald-600/30 text-emerald-400 border border-emerald-500/30"
                              : "bg-slate-800/60 text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          {qIdx + 1}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-3">
                    {currentTaskIndex < (activeAssignment.tasks?.length || 1) - 1 ? (
                      <button
                        onClick={() => setCurrentTaskIndex((prev) => prev + 1)}
                        className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : null}

                    <button
                      onClick={() => setShowSubmitModal(true)}
                      className={`px-6 py-3 rounded-xl text-white text-xs font-black uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 ${
                        viewingSubmittedMode
                          ? "bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 shadow-amber-900/30"
                          : "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-emerald-900/30"
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>{viewingSubmittedMode ? "Update / Re-Submit (යාවත්කාලීන කරන්න)" : "Submit (භාරදෙන්න)"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Submission Confirmation Modal */}
            {showSubmitModal && (
              <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
                <div className="bg-[#0e1424] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl animate-scaleUp">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-3xl text-amber-400 flex items-center justify-center mx-auto">
                      📝
                    </div>
                    <h3 className="text-xl font-black text-white">Submit Assignment?</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      ඔබ ප්‍රශ්න {activeAssignment.tasks?.length || 0} න්{" "}
                      <span className="text-amber-400 font-bold">
                        {
                          Object.keys(studentAnswers).filter(
                            (k) => studentAnswers[k] !== undefined && studentAnswers[k] !== ""
                          ).length
                        }
                      </span>{" "}
                      කට පිළිතුරු සපයා ඇත. පැවරුම ගුරුවරයා වෙත භාරදීමට තහවුරු කරන්න.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5 text-slate-300">
                    <p className="flex justify-between">
                      <span>Assignment:</span>
                      <span className="font-bold text-white truncate max-w-[180px]">
                        {activeAssignment.title}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span>Student:</span>
                      <span className="font-bold text-white">{user?.name}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Grade:</span>
                      <span className="font-bold text-white">{user?.grade || user?.subject || "Crypto Basic"}</span>
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowSubmitModal(false)}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                    >
                      Review Answers
                    </button>
                    <button
                      type="button"
                      disabled={isSubmittingAssignment}
                      onClick={handleSubmitAssignment}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 disabled:opacity-60"
                    >
                      {isSubmittingAssignment ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <span>Confirm & Submit ✓</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssignmentView;
