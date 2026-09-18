import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Send,
  Paperclip,
  Trash2,
  Sparkles,
  Award,
  Clock,
  Search,
  CheckCircle2,
  X,
  FileText,
  Image as ImageIcon,
  MessageCircle,
  Hash
} from "lucide-react";
import { showAppConfirm, showAppToast } from "./GlobalAlert";

const getDynamicChannels = () => {
  const base = [
    { id: "All", name: "All Traders Community", badge: "Main Lounge", icon: "🌐" }
  ];
  try {
    const saved = localStorage.getItem("webGeneralSettings");
    if (saved) {
      const parsed = JSON.parse(saved);
      const gradesObj = parsed.grades || {};
      const subs = parsed.subjects || [];
      const allGrades = Object.values(gradesObj).flat();
      const combined = Array.from(new Set([...subs, ...allGrades].filter(Boolean)));
      if (combined.length > 0) {
        return [
          ...base,
          ...combined.map((name, i) => ({
            id: name,
            name: `${name} Group`,
            badge: "Active Cohort",
            icon: i % 2 === 0 ? "⚡" : "🎯"
          }))
        ];
      }
    }
  } catch {}
  return [
    ...base,
    { id: "Crypto Basic", name: "Crypto Basic Group", badge: "Core Foundation", icon: "⚡" },
    { id: "Order Flow", name: "Order Flow Group", badge: "Advanced Trading", icon: "🎯" }
  ];
};

const CHANNELS = getDynamicChannels();

const SEED_MESSAGES = {
  "All": [
    {
      _id: "gm_seed_all_1",
      grade: "All",
      senderName: "Taizer Academy Support",
      senderEmail: "admin@taizeracademy.com",
      senderRole: "teacher",
      text: "Welcome traders! Use this community channel to discuss market dynamics, news, and technical analysis setups. Maintain high trading discipline! 🌟",
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
    }
  ],
  "Crypto Basic": [
    {
      _id: "gm_seed_cb_1",
      grade: "Crypto Basic",
      senderName: "Lead Mentor",
      senderEmail: "mentor@taizeracademy.com",
      senderRole: "teacher",
      text: "Crypto Basic members: Make sure to review wallet safety and 1% risk position sizing before taking live trades.",
      timestamp: new Date(Date.now() - 3600000 * 10).toISOString()
    },
    {
      _id: "gm_seed_cb_2",
      grade: "Crypto Basic",
      senderName: "Dinuka Perera",
      senderEmail: "dinuka@sample.lk",
      senderRole: "student",
      text: "Thank you mentor! Looking forward to today's review session.",
      timestamp: new Date(Date.now() - 3600000 * 8).toISOString()
    }
  ],
  "Order Flow": [
    {
      _id: "gm_seed_of_1",
      grade: "Order Flow",
      senderName: "Lead Mentor",
      senderEmail: "mentor@taizeracademy.com",
      senderRole: "teacher",
      text: "Order Flow members: Footprint chart review is scheduled for today's session. Analyze volume delta absorption at resistance.",
      timestamp: new Date(Date.now() - 3600000 * 15).toISOString()
    }
  ]
};

export default function GradeGroupChatView({ user = {} }) {
  // Determine default grade channel
  const userGradeMatch = CHANNELS.find((c) => c.id === user?.grade);
  const initialGrade = userGradeMatch ? userGradeMatch.id : (CHANNELS[1]?.id || "All");

  const [activeGrade, setActiveGrade] = useState(initialGrade);
  const [messages, setMessages] = useState(() => {
    try {
      const cached = localStorage.getItem(`lmsGroupChat_${initialGrade}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return SEED_MESSAGES[initialGrade] || [];
  });

  const [inputText, setInputText] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [sending, setSending] = useState(false);
  const [channelSearch, setChannelSearch] = useState("");

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch group chat messages from server with graceful local fallback
  const fetchMessages = async (gradeToFetch) => {
    try {
      const targetGrade = gradeToFetch || activeGrade;
      const res = await fetch(
        `http://localhost:5000/api/group-chat?grade=${encodeURIComponent(targetGrade)}`
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setMessages(data);
          localStorage.setItem(`lmsGroupChat_${targetGrade}`, JSON.stringify(data));
          return;
        }
      }
    } catch (err) {
      // Backend not running -> keep local messages
    }
  };

  useEffect(() => {
    // Switch channel and load cache
    try {
      const cached = localStorage.getItem(`lmsGroupChat_${activeGrade}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        } else {
          setMessages(SEED_MESSAGES[activeGrade] || []);
        }
      } else {
        setMessages(SEED_MESSAGES[activeGrade] || []);
      }
    } catch {}

    fetchMessages(activeGrade);
    const interval = setInterval(() => fetchMessages(activeGrade), 3500);
    return () => clearInterval(interval);
  }, [activeGrade]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle file attachment selection
  const handleAttachmentUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showAppToast("File Too Large", "Maximum attachment size is 5MB.", "error");
      return;
    }

    setUploadingAttachment(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      const isImg = file.type.startsWith("image/");

      // Try uploading to server disk
      try {
        const res = await fetch("http://localhost:5000/api/upload-file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileData: base64Data,
            fileName: file.name,
            fileType: file.type
          })
        });
        if (res.ok) {
          const respJson = await res.json();
          setAttachment({
            url: respJson.url || base64Data,
            name: file.name,
            type: isImg ? "image" : "document",
            size: (file.size / 1024).toFixed(1) + " KB"
          });
          setUploadingAttachment(false);
          return;
        }
      } catch (err) {
        // Fallback to base64
      }

      setAttachment({
        url: base64Data,
        name: file.name,
        type: isImg ? "image" : "document",
        size: (file.size / 1024).toFixed(1) + " KB"
      });
      setUploadingAttachment(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const textToSend = inputText.trim();
    if (!textToSend && !attachment) return;

    setSending(true);

    const isTeacher = user?.email === "admin" || user?.role === "teacher";
    const newMsg = {
      _id: "gm_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6),
      grade: activeGrade,
      senderName: user?.name || "Student",
      senderEmail: (user?.email || "student@taizer.lk").toLowerCase(),
      senderRole: isTeacher ? "teacher" : "student",
      senderPhoto: user?.profilePic || "",
      text: textToSend,
      attachment: attachment || null,
      timestamp: new Date().toISOString()
    };

    // Optimistic UI update
    setMessages((prev) => {
      const updated = [...prev, newMsg];
      localStorage.setItem(`lmsGroupChat_${activeGrade}`, JSON.stringify(updated));
      return updated;
    });

    setInputText("");
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    // Sync to backend
    try {
      await fetch("http://localhost:5000/api/group-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade: activeGrade,
          senderName: user?.name || "Student",
          senderEmail: user?.email || "student@taizer.lk",
          senderRole: isTeacher ? "teacher" : "student",
          senderPhoto: user?.profilePic || "",
          text: textToSend,
          attachment: newMsg.attachment
        })
      });
    } catch (err) {
      console.warn("Could not sync message to server:", err.message);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = (msgId) => {
    showAppConfirm({
      title: "Delete Message?",
      message: "Are you sure you want to delete this message from the group chat?",
      confirmText: "Delete Message",
      type: "danger",
      onConfirm: async () => {
        setMessages((prev) => {
          const updated = prev.filter((m) => (m._id || m.id) !== msgId);
          localStorage.setItem(`lmsGroupChat_${activeGrade}`, JSON.stringify(updated));
          return updated;
        });

        try {
          await fetch(`http://localhost:5000/api/group-chat/${msgId}`, {
            method: "DELETE"
          });
          showAppToast("Message Deleted", "Message removed from chat.", "info");
        } catch (err) {
          console.warn("Could not delete message on server:", err.message);
        }
      }
    });
  };

  const activeChannelMeta = CHANNELS.find((c) => c.id === activeGrade) || CHANNELS[0];

  const filteredChannels = CHANNELS.filter(
    (c) =>
      c.name.toLowerCase().includes(channelSearch.toLowerCase()) ||
      c.badge.toLowerCase().includes(channelSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn pb-12">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/40 to-slate-900/80 border border-emerald-500/20 p-6 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Users className="w-3.5 h-3.5" />
              <span>Trading Community Network</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              ශිෂ්‍ය සමූහ කතාබහ (Trading Community Group Chat)
            </h1>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              ඔබගේ විෂය / කාණ්ඩය තෝරා සහෝදර සිසුන් හා උපදේශකවරුන් සමඟ වෙළඳපල කරුණු සාකච්ඡා කරන්න.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Your Enrolled Batch</span>
              <span className="text-sm font-black text-emerald-400">{user?.grade || user?.subject || "Crypto Basic"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CHAT CONTAINER: CHANNELS SIDEBAR + CHAT ROOM */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[620px]">
        {/* CHANNELS COLUMN */}
        <div className="lg:col-span-1 bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-4 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-indigo-400" />
              <span>Grade Channels</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">
              {CHANNELS.length}
            </span>
          </div>

          {/* Channels list */}
          <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[520px] pr-1">
            {filteredChannels.map((channel) => {
              const isSelected = activeGrade === channel.id;
              const isUserGrade = user?.grade === channel.id;

              return (
                <button
                  key={channel.id}
                  onClick={() => setActiveGrade(channel.id)}
                  className={`w-full p-3 rounded-2xl text-left transition-all flex items-center justify-between group ${
                    isSelected
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/25 scale-[1.02]"
                      : "bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 border border-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{channel.icon}</span>
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <span>{channel.name}</span>
                        {isUserGrade && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase ${
                              isSelected
                                ? "bg-white/20 text-white"
                                : "bg-emerald-500/20 text-emerald-300"
                            }`}
                          >
                            You
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-[10px] ${
                          isSelected ? "text-indigo-100" : "text-slate-500"
                        }`}
                      >
                        {channel.badge}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CHAT FEED COLUMN */}
        <div className="lg:col-span-3 bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 shadow-2xl flex flex-col overflow-hidden">
          {/* ROOM HEADER */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{activeChannelMeta.icon}</span>
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <span>{activeChannelMeta.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
                    {activeChannelMeta.badge}
                  </span>
                </h2>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                  <span>Live Grade Room • {messages.length} messages</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => fetchMessages(activeGrade)}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 transition-all"
              title="Refresh messages"
            >
              🔄 Refresh
            </button>
          </div>

          {/* MESSAGES SCROLL AREA */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[460px] min-h-[380px] bg-[#070b14]/50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-2xl flex items-center justify-center text-indigo-400">
                  💬
                </div>
                <h3 className="text-sm font-bold text-white">No messages in {activeGrade} yet</h3>
                <p className="text-xs text-slate-400 max-w-xs">
                  Be the first trader to send a greeting or ask a market analysis question in this channel!
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const msgId = msg._id || msg.id;
                const userEmail = (user?.email || "").toLowerCase();
                const isMe =
                  userEmail &&
                  msg.senderEmail &&
                  msg.senderEmail.toLowerCase() === userEmail;
                const isTeacher =
                  msg.senderRole === "teacher" || msg.senderRole === "admin";

                return (
                  <div
                    key={msgId}
                    className={`flex items-end gap-2.5 ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    {!isMe && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white uppercase shrink-0 shadow">
                        {msg.senderPhoto ? (
                          <img
                            src={msg.senderPhoto}
                            alt={msg.senderName}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          msg.senderName?.charAt(0) || "S"
                        )}
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 space-y-1.5 shadow-md ${
                        isMe
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none"
                          : isTeacher
                          ? "bg-[#1f190e] border border-amber-500/40 text-amber-100 rounded-bl-none shadow-amber-900/20"
                          : "bg-slate-900/95 border border-slate-800 text-slate-200 rounded-bl-none"
                      }`}
                    >
                      {/* SENDER HEADER */}
                      <div className="flex items-center justify-between gap-3 text-[11px]">
                        <div className="flex items-center gap-1.5 font-bold">
                          <span className={isMe ? "text-blue-100" : isTeacher ? "text-amber-300" : "text-white"}>
                            {isMe ? "You" : msg.senderName}
                          </span>
                          {isTeacher && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-extrabold uppercase border border-amber-500/30">
                              <Award className="w-2.5 h-2.5" />
                              <span>Lecturer</span>
                            </span>
                          )}
                        </div>

                        <div
                          className={`text-[10px] flex items-center gap-1 ${
                            isMe ? "text-blue-200/80" : "text-slate-500"
                          }`}
                        >
                          <Clock className="w-2.5 h-2.5" />
                          <span>
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                          {isMe && (
                            <button
                              onClick={() => handleDeleteMessage(msgId)}
                              className="ml-1 hover:text-rose-300 transition-colors"
                              title="Delete message"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* MESSAGE TEXT */}
                      {msg.text && (
                        <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line break-words font-medium">
                          {msg.text}
                        </div>
                      )}

                      {/* ATTACHMENT */}
                      {msg.attachment && (
                        <div className="mt-2 pt-2 border-t border-white/10">
                          {msg.attachment.type === "image" ? (
                            <img
                              src={msg.attachment.url}
                              alt="Attachment"
                              className="max-h-60 rounded-xl object-contain border border-white/10"
                            />
                          ) : (
                            <a
                              href={msg.attachment.url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 p-2.5 rounded-xl bg-black/20 hover:bg-black/40 border border-white/10 text-xs font-semibold transition-all"
                            >
                              <FileText className="w-4 h-4 text-indigo-300 shrink-0" />
                              <span className="truncate max-w-[200px]">
                                {msg.attachment.name || "Download File"}
                              </span>
                              <span className="text-[10px] text-slate-400 shrink-0">
                                {msg.attachment.size || ""}
                              </span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* QUICK PROMPT TAGS */}
          <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
              Quick Tags:
            </span>
            {[
              "📚 Past Paper Question",
              "💡 Doubt in Theory",
              "📝 Essay Model",
              "👋 Hi Everyone!"
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => setInputText((prev) => (prev ? `${prev} ${tag}` : tag))}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 font-medium whitespace-nowrap transition-all"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* ATTACHMENT PREVIEW */}
          {attachment && (
            <div className="px-4 py-2 bg-indigo-950/40 border-t border-indigo-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-indigo-300">
                <Paperclip className="w-3.5 h-3.5" />
                <span className="truncate max-w-xs">{attachment.name}</span>
                <span className="text-[10px] text-indigo-400/70">({attachment.size})</span>
              </div>
              <button
                onClick={() => setAttachment(null)}
                className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* INPUT BAR */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 sm:p-4 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2"
          >
            {/* File input button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAttachmentUpload}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAttachment}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/60 transition-all shrink-0"
              title="Attach photo or document"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Input field */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`${activeGrade} කණ්ඩායමට පණිවිඩයක් යවන්න... (Type a message...)`}
              className="flex-1 px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />

            {/* Send button */}
            <button
              type="submit"
              disabled={(!inputText.trim() && !attachment) || sending}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
