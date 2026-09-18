import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Plus,
  Trash2,
  Video,
  FileText,
  HelpCircle,
  Paperclip,
  CheckCircle2,
  ExternalLink,
  Eye,
  Layers,
  Sparkles,
  UploadCloud,
  Globe,
  Loader2
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

const isDirectVideo = (url) => {
  if (!url) return false;
  return (
    url.startsWith("data:video") ||
    url.startsWith("blob:") ||
    url.includes("/uploads/videos/") ||
    url.endsWith(".mp4") ||
    url.endsWith(".webm") ||
    url.endsWith(".mov") ||
    url.includes(".mp4?") ||
    url.includes(".webm?")
  );
};

const SlideDesignerModal = ({
  session,
  grade,
  onClose,
  onSaveSession
}) => {
  const [slides, setSlides] = useState(() => {
    if (session?.content && Array.isArray(session.content) && session.content.length > 0) {
      return session.content;
    }
    return [
      {
        type: "video",
        title: session?.title || "Slide 1",
        titleSi: session?.titleSi || "",
        content: session?.desc || "",
        contentSi: "",
        videoUrl: session?.videoUrl || "",
        question: "",
        options: ["", "", "", ""],
        correctIndex: 0,
        explanation: ""
      }
    ];
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoSourceMode, setVideoSourceMode] = useState("url");
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [resourceSourceMode, setResourceSourceMode] = useState("url");
  const [isUploadingResource, setIsUploadingResource] = useState(false);
  const [resourceUploadStatus, setResourceUploadStatus] = useState("");

  const activeSlide = slides[activeIndex] || {
    type: "video",
    title: "",
    titleSi: "",
    content: "",
    contentSi: "",
    videoUrl: "",
    question: "",
    options: ["", "", "", ""],
    correctIndex: 0,
    explanation: ""
  };

  const updateActiveSlide = (field, value) => {
    const updated = [...slides];
    if (!updated[activeIndex]) {
      updated[activeIndex] = { ...activeSlide };
    }
    updated[activeIndex][field] = value;
    setSlides(updated);
  };

  const handleVideoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 250 * 1024 * 1024) {
      showAppToast("File Too Large", "Video file size must be less than 250MB.", "error");
      return;
    }

    try {
      setIsUploadingVideo(true);
      setUploadStatus("Processing video file...");

      // Immediate local Blob URL for instant preview
      const localBlobUrl = URL.createObjectURL(file);
      updateActiveSlide("videoUrl", localBlobUrl);
      updateActiveSlide("fileName", file.name);

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
              updateActiveSlide("videoUrl", data.url);
              updateActiveSlide("fileName", file.name);
              setUploadStatus("Uploaded successfully!");
            }
          } else {
            console.warn("Server video upload error, using local fallback");
            updateActiveSlide("videoUrl", event.target.result);
            updateActiveSlide("fileName", file.name);
          }
        } catch (apiErr) {
          console.warn("Backend video upload notice:", apiErr);
          updateActiveSlide("videoUrl", event.target.result);
          updateActiveSlide("fileName", file.name);
        } finally {
          setIsUploadingVideo(false);
          setTimeout(() => setUploadStatus(""), 3500);
        }
      };

      reader.onerror = () => {
        showAppToast("Upload Error", "Failed to read video file.", "error");
        setIsUploadingVideo(false);
        setUploadStatus("");
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Video upload error:", err);
      setIsUploadingVideo(false);
      setUploadStatus("");
    }
  };

  const handleResourceFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      showAppToast("File Too Large", "Resource file size must be less than 100MB.", "error");
      return;
    }

    try {
      setIsUploadingResource(true);
      setResourceUploadStatus("Processing resource file...");

      // Immediate local Blob URL for instant preview/linking
      const localBlobUrl = URL.createObjectURL(file);
      updateActiveSlide("fileData", localBlobUrl);
      updateActiveSlide("url", localBlobUrl);
      updateActiveSlide("videoUrl", localBlobUrl);
      updateActiveSlide("fileName", file.name);
      updateActiveSlide("fileType", file.type || "application/octet-stream");

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          setResourceUploadStatus("Saving file to server...");
          const res = await fetch("http://localhost:5000/api/upload-file", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileData: event.target.result,
              fileName: file.name,
              fileType: file.type
            })
          });

          if (res.ok) {
            const data = await res.json();
            if (data.url) {
              updateActiveSlide("fileData", data.url);
              updateActiveSlide("url", data.url);
              updateActiveSlide("videoUrl", data.url);
              updateActiveSlide("fileName", file.name);
              updateActiveSlide("fileType", file.type || "application/octet-stream");
              setResourceUploadStatus("Uploaded successfully!");
            }
          } else {
            console.warn("Server file upload notice, keeping local fallback");
            updateActiveSlide("fileData", event.target.result);
            updateActiveSlide("url", event.target.result);
            updateActiveSlide("videoUrl", event.target.result);
            updateActiveSlide("fileName", file.name);
          }
        } catch (apiErr) {
          console.warn("Backend file upload notice:", apiErr);
          updateActiveSlide("fileData", event.target.result);
          updateActiveSlide("url", event.target.result);
          updateActiveSlide("videoUrl", event.target.result);
          updateActiveSlide("fileName", file.name);
        } finally {
          setIsUploadingResource(false);
          setTimeout(() => setResourceUploadStatus(""), 3500);
        }
      };

      reader.onerror = () => {
        showAppToast("Upload Error", "Failed to read resource file.", "error");
        setIsUploadingResource(false);
        setResourceUploadStatus("");
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Resource file upload error:", err);
      setIsUploadingResource(false);
      setResourceUploadStatus("");
    }
  };

  const handleAddSlide = () => {
    const newSlide = {
      type: "note",
      title: `Slide ${slides.length + 1}`,
      titleSi: "",
      content: "",
      contentSi: "",
      videoUrl: "",
      question: "",
      options: ["", "", "", ""],
      correctIndex: 0,
      explanation: ""
    };
    const updated = [...slides, newSlide];
    setSlides(updated);
    setActiveIndex(updated.length - 1);
  };

  const handleDeleteSlide = (idx, e) => {
    e.stopPropagation();
    if (slides.length <= 1) {
      showAppToast("Action Not Allowed", "A session must have at least one slide.", "warning");
      return;
    }
    const updated = slides.filter((_, i) => i !== idx);
    setSlides(updated);
    setActiveIndex(Math.max(0, Math.min(activeIndex, updated.length - 1)));
  };

  const handleSaveAll = () => {
    onSaveSession(slides);
    onClose();
  };

  const insertTag = (openTag, closeTag = "") => {
    const textarea = document.getElementById("note-editor-textarea");
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = activeSlide.content || "";
    const selected = current.substring(start, end);
    const updatedText =
      current.substring(0, start) + openTag + selected + closeTag + current.substring(end);
    updateActiveSlide("content", updatedText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + openTag.length,
        start + openTag.length + selected.length
      );
    }, 0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070b14] flex flex-col select-none text-slate-200">
      {/* STUDIO HEADER */}
      <header className="bg-[#0b101d] border-b border-slate-800 px-6 py-3.5 flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <span>← Exit Studio</span>
          </button>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                {grade}
              </span>
              <h3 className="text-sm font-black text-white">
                {session?.title || "Curriculum Session"}
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Interactive Lesson Studio • {slides.length} slides configured
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveAll}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save & Publish Changes</span>
          </button>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* STUDIO BODY: SIDEBAR + EDITOR */}
      <div className="flex flex-grow overflow-hidden">
        {/* SLIDES SEQUENCE SIDEBAR */}
        <aside className="w-80 bg-[#090e1a] border-r border-slate-800/80 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Slides Sequence
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] font-semibold text-slate-400">
              {slides.length}
            </span>
          </div>

          <div className="flex-grow overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-slate-800">
            {slides.map((slide, idx) => {
              const isCurrent = idx === activeIndex;
              const typeIcons = {
                video: Video,
                note: FileText,
                quiz: HelpCircle,
                file: Paperclip
              };
              const TypeIcon = typeIcons[slide.type] || FileText;

              return (
                <div
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                    isCurrent
                      ? "bg-indigo-600/20 border-indigo-500/60 shadow-lg shadow-indigo-600/10 text-white"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCurrent
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <TypeIcon className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {slide.type}
                        </span>
                      </div>
                      <p className="text-xs font-semibold truncate text-slate-200">
                        {slide.title || "Untitled Slide"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDeleteSlide(idx, e)}
                    title="Delete Slide"
                    className="w-7 h-7 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}

            <button
              onClick={handleAddSlide}
              className="w-full p-3 rounded-xl border border-dashed border-slate-700 hover:border-indigo-500 text-slate-400 hover:text-indigo-300 font-bold text-xs flex items-center justify-center gap-2 transition-all mt-3"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Slide</span>
            </button>
          </div>
        </aside>

        {/* ACTIVE SLIDE EDITOR */}
        <main className="flex-grow overflow-y-auto p-8 bg-[#060911]">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* SLIDE TYPE SELECTOR PILLS */}
            <div className="flex items-center gap-2 bg-[#0e1424] p-1.5 rounded-2xl border border-slate-800 w-fit">
              {[
                { type: "video", label: "Video Lesson", icon: Video },
                { type: "note", label: "Interactive Note", icon: FileText },
                { type: "quiz", label: "MCQ Checkpoint", icon: HelpCircle },
                { type: "file", label: "Resource File", icon: Paperclip }
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = activeSlide.type === item.type;
                return (
                  <button
                    key={item.type}
                    onClick={() => updateActiveSlide("type", item.type)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* SLIDE TITLES */}
            <div className="bg-[#0e1424] border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    English Title
                  </label>
                  <input
                    type="text"
                    value={activeSlide.title || ""}
                    onChange={(e) => updateActiveSlide("title", e.target.value)}
                    placeholder="e.g. Part 1: Elasticity Concept"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    Sinhala Title
                  </label>
                  <input
                    type="text"
                    value={activeSlide.titleSi || ""}
                    onChange={(e) => updateActiveSlide("titleSi", e.target.value)}
                    placeholder="e.g. නම්‍යතාවය පිළිබඳ මූලික සිද්ධාන්ත"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* VIDEO TYPE EDITOR */}
            {activeSlide.type === "video" && (
              <div className="bg-[#0e1424] border border-slate-800 rounded-3xl p-6 space-y-5">
                {/* SOURCE SELECTOR TABS */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <label className="text-xs font-extrabold text-white block flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-indigo-400" />
                      <span>Lesson Video Source / වීඩියෝ මූලාශ්‍රය</span>
                    </label>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Choose to paste a Web URL (YouTube, Vimeo, MP4 link) or upload an MP4 directly from your browser
                    </p>
                  </div>

                  <div className="flex items-center p-1 bg-slate-900/90 border border-slate-800 rounded-xl gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setVideoSourceMode("url")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        videoSourceMode === "url"
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Web URL / YouTube</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoSourceMode("upload")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        videoSourceMode === "upload"
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload from Computer</span>
                    </button>
                  </div>
                </div>

                {/* 1. URL MODE INPUT */}
                {videoSourceMode === "url" && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 block">
                      Video URL (YouTube Embed, Watch Link, or Direct MP4 Link)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={activeSlide.videoUrl || ""}
                        onChange={(e) => updateActiveSlide("videoUrl", formatVideoUrl(e.target.value))}
                        placeholder="https://www.youtube.com/watch?v=... or https://example.com/lesson.mp4"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-white outline-none focus:border-indigo-500 pr-10"
                      />
                      {activeSlide.videoUrl && (
                        <button
                          type="button"
                          onClick={() => updateActiveSlide("videoUrl", "")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                          title="Clear URL"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500">
                      💡 Tip: YouTube watch links (e.g. youtube.com/watch?v=...) are automatically converted into responsive embeddable players.
                    </p>
                  </div>
                )}

                {/* 2. BROWSER UPLOAD MODE */}
                {videoSourceMode === "upload" && (
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-300 block">
                      Select Video File from your Browser / Computer (MP4, WebM, MOV)
                    </label>

                    <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/60 rounded-2xl p-6 text-center bg-slate-900/50 hover:bg-slate-900 transition-all relative">
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,video/*"
                        onChange={handleVideoFileUpload}
                        disabled={isUploadingVideo}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                      />
                      <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                          {isUploadingVideo ? (
                            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                          ) : (
                            <UploadCloud className="w-6 h-6 text-indigo-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">
                            {isUploadingVideo ? uploadStatus || "Processing Video..." : "Click or drag & drop video file here"}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Supports MP4, WebM, MOV • Up to 250MB
                          </p>
                        </div>
                      </div>
                    </div>

                    {activeSlide.fileName && (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                        <div className="flex items-center gap-2 text-indigo-300 font-semibold truncate">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="truncate">{activeSlide.fileName}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            updateActiveSlide("videoUrl", "");
                            updateActiveSlide("fileName", "");
                          }}
                          className="text-slate-500 hover:text-rose-400 text-xs font-bold shrink-0 ml-2"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* LIVE PREVIEW PLAYER */}
                {activeSlide.videoUrl && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-bold px-1">
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Interactive Video Player Preview</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold">✓ Ready to stream</span>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-slate-800 bg-black aspect-video max-w-2xl mx-auto shadow-2xl relative">
                      {isDirectVideo(activeSlide.videoUrl) ? (
                        <video
                          key={activeSlide.videoUrl}
                          src={activeSlide.videoUrl}
                          controls
                          playsInline
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <iframe
                          src={activeSlide.videoUrl}
                          title="Video Preview"
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* NOTE TYPE EDITOR */}
            {activeSlide.type === "note" && (
              <div className="bg-[#0e1424] border border-slate-800 rounded-3xl p-6 space-y-4">
                {/* TOOLBAR */}
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-900 rounded-xl border border-slate-800">
                  <button
                    onClick={() => insertTag("**", "**")}
                    className="px-2.5 py-1 rounded hover:bg-slate-800 text-xs font-black text-slate-300"
                    title="Bold"
                  >
                    B
                  </button>
                  <button
                    onClick={() => insertTag("[si]", "[/si]")}
                    className="px-2.5 py-1 rounded hover:bg-slate-800 text-xs italic font-serif text-slate-300"
                    title="Sinhala / Italic"
                  >
                    I
                  </button>
                  <button
                    onClick={() => insertTag("[h1]", "")}
                    className="px-2.5 py-1 rounded hover:bg-slate-800 text-xs font-bold text-indigo-400"
                    title="Heading 1"
                  >
                    H1
                  </button>
                  <button
                    onClick={() => insertTag("[h2]", "")}
                    className="px-2.5 py-1 rounded hover:bg-slate-800 text-xs font-bold text-indigo-400"
                    title="Heading 2"
                  >
                    H2
                  </button>
                  <button
                    onClick={() => insertTag("\n• ", "")}
                    className="px-2.5 py-1 rounded hover:bg-slate-800 text-xs font-bold text-slate-300"
                    title="Bullet"
                  >
                    • List
                  </button>
                  <button
                    onClick={() => insertTag("\n---\n", "")}
                    className="px-2.5 py-1 rounded hover:bg-slate-800 text-xs font-bold text-slate-300"
                    title="Divider"
                  >
                    — Line
                  </button>
                  <div className="w-px h-4 bg-slate-800 mx-1" />
                  <button
                    onClick={() => insertTag("[color=#2dd4bf]", "[/color]")}
                    className="px-2.5 py-1 rounded hover:bg-slate-800 text-xs font-black text-teal-400"
                    title="Teal Color"
                  >
                    Color
                  </button>
                  <button
                    onClick={() => insertTag("[grad]", "[/grad]")}
                    className="px-2.5 py-1 rounded hover:bg-slate-800 text-xs font-black bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent"
                    title="Gradient"
                  >
                    Gradient
                  </button>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    Lesson Content / Notes (Markdown & Tags Supported)
                  </label>
                  <textarea
                    id="note-editor-textarea"
                    rows={12}
                    value={activeSlide.content || ""}
                    onChange={(e) => updateActiveSlide("content", e.target.value)}
                    placeholder="Type lesson content here... Use toolbar to format headings, highlights, and bullet points."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 outline-none focus:border-indigo-500 leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* QUIZ TYPE EDITOR */}
            {activeSlide.type === "quiz" && (
              <div className="bg-[#0e1424] border border-slate-800 rounded-3xl p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    MCQ Question Prompt
                  </label>
                  <textarea
                    rows={3}
                    value={activeSlide.question || ""}
                    onChange={(e) => updateActiveSlide("question", e.target.value)}
                    placeholder="Enter the question for this checkpoint..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-semibold text-white outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 block">
                    Answer Options (Select correct radio button)
                  </label>
                  {(activeSlide.options || ["", "", "", ""]).map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border ${
                        activeSlide.correctIndex === oIdx
                          ? "bg-emerald-500/10 border-emerald-500/40"
                          : "bg-slate-900 border-slate-800"
                      }`}
                    >
                      <input
                        type="radio"
                        name="correctAnswerOption"
                        checked={activeSlide.correctIndex === oIdx}
                        onChange={() => updateActiveSlide("correctIndex", oIdx)}
                        className="w-4 h-4 text-emerald-500 bg-slate-800 border-slate-700"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...(activeSlide.options || ["", "", "", ""])];
                          newOpts[oIdx] = e.target.value;
                          updateActiveSlide("options", newOpts);
                        }}
                        placeholder={`Option ${oIdx + 1}`}
                        className="flex-grow bg-transparent text-xs font-medium text-white outline-none"
                      />
                      {activeSlide.correctIndex === oIdx && (
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                          Correct
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    Explanation / Solution Hint (Optional)
                  </label>
                  <input
                    type="text"
                    value={activeSlide.explanation || ""}
                    onChange={(e) => updateActiveSlide("explanation", e.target.value)}
                    placeholder="Why this answer is correct..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* FILE TYPE EDITOR */}
            {activeSlide.type === "file" && (
              <div className="bg-[#0e1424] border border-slate-800 rounded-3xl p-6 space-y-5">
                {/* SOURCE SELECTOR PILLS */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-indigo-400" /> Resource File Attachment
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Add notes, handouts, past papers or documents using a link or upload directly.
                    </p>
                  </div>
                  <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 shrink-0 self-start sm:self-center">
                    <button
                      type="button"
                      onClick={() => setResourceSourceMode("url")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        resourceSourceMode === "url"
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" /> Web URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setResourceSourceMode("upload")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        resourceSourceMode === "upload"
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <UploadCloud className="w-3.5 h-3.5" /> Upload from Computer
                    </button>
                  </div>
                </div>

                {resourceSourceMode === "url" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">
                        Attachment Download / Web URL (PDF, Notes, Drive Link)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={activeSlide.url || activeSlide.fileData || activeSlide.videoUrl || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateActiveSlide("url", val);
                            updateActiveSlide("fileData", val);
                            updateActiveSlide("videoUrl", val);
                            if (!activeSlide.fileName && val) {
                              const guessedName = val.split("/").pop()?.split("?")[0] || "Resource Document";
                              updateActiveSlide("fileName", guessedName);
                            }
                          }}
                          placeholder="https://... /pdf/economics_unit1.pdf or Google Drive link"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                        />
                        {(activeSlide.url || activeSlide.fileData || activeSlide.videoUrl) && (
                          <button
                            type="button"
                            onClick={() => {
                              updateActiveSlide("url", "");
                              updateActiveSlide("fileData", "");
                              updateActiveSlide("videoUrl", "");
                              updateActiveSlide("fileName", "");
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-rose-400 text-xs font-bold"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Enter a direct link to any PDF, Word doc, presentation, or Google Drive download link.
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">
                        Display File Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={activeSlide.fileName || ""}
                        onChange={(e) => updateActiveSlide("fileName", e.target.value)}
                        placeholder="e.g. Unit 1 Revision Notes.pdf"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-medium text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer bg-slate-900/40 hover:bg-slate-900/70 transition-all text-center">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar,image/*,application/*"
                        className="hidden"
                        onChange={handleResourceFileUpload}
                        disabled={isUploadingResource}
                      />
                      {isUploadingResource ? (
                        <div className="flex flex-col items-center gap-2 text-indigo-400">
                          <Loader2 className="w-8 h-8 animate-spin" />
                          <p className="text-xs font-bold">{resourceUploadStatus || "Uploading file..."}</p>
                          <p className="text-[10px] text-slate-400">Saving to server, please wait...</p>
                        </div>
                      ) : (activeSlide.fileData || activeSlide.url || activeSlide.videoUrl) ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-emerald-400">File attached successfully!</p>
                            <p className="text-xs font-semibold text-white mt-0.5">{activeSlide.fileName || "Attached Document"}</p>
                            <p className="text-[10px] text-slate-400 mt-1">Click to replace file</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <UploadCloud className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">Click or drag & drop to upload file</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              Supports PDF, Word, PowerPoint, Excel, Images, Zip (up to 100MB)
                            </p>
                          </div>
                        </div>
                      )}
                    </label>

                    {(activeSlide.fileData || activeSlide.url || activeSlide.videoUrl) && (
                      <div className="flex items-center justify-between px-2">
                        <span className="text-[11px] text-slate-400">
                          Current: <strong className="text-white">{activeSlide.fileName || "Attached File"}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            updateActiveSlide("fileData", "");
                            updateActiveSlide("url", "");
                            updateActiveSlide("videoUrl", "");
                            updateActiveSlide("fileName", "");
                            updateActiveSlide("fileType", "");
                          }}
                          className="text-[10px] text-rose-400 hover:underline font-bold"
                        >
                          Remove file
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* LIVE PREVIEW / ACTION FOR RESOURCE */}
                {(activeSlide.fileData || activeSlide.url || activeSlide.videoUrl) && (
                  <div className="pt-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Resource Preview / Info</p>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">📄</div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-white truncate">{activeSlide.fileName || "Resource Document"}</p>
                          <p className="text-[10px] text-slate-500 truncate max-w-xs sm:max-w-md">
                            {activeSlide.fileData || activeSlide.url || activeSlide.videoUrl}
                          </p>
                        </div>
                      </div>
                      <a
                        href={activeSlide.fileData || activeSlide.url || activeSlide.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-500/20 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> View / Test Link
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SlideDesignerModal;
