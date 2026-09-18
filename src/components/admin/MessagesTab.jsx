import React, { useState } from "react";
import {
  MessageSquare,
  Bot,
  Send,
  Trash2,
  RefreshCw,
  Search,
  CheckCheck,
  User,
  AlertCircle,
  Globe,
  Phone,
  ExternalLink,
  CheckCircle2,
  Clock,
  Users,
  Award,
  Hash,
  Sparkles,
  Paperclip
} from "lucide-react";
import { showAppConfirm, showAppToast } from "../GlobalAlert";

const MessagesTab = ({
  messageTab,
  setMessageTab,
  portalMessages = [],
  whatsappMessages = [],
  inquiries = [],
  selectedStudentEmail,
  setSelectedStudentEmail,
  adminReplyText,
  setAdminReplyText,
  onAdminReply,
  onDeleteWhatsappMessage,
  onDeleteInquiry,
  onToggleInquiryStatus,
  onFetchPortalMessages,
  onFetchWhatsappMessages,
  onFetchInquiries,
  markAsRead
}) => {
  const [studentSearch, setStudentSearch] = useState("");
  const [inquirySearch, setInquirySearch] = useState("");

  const [adminChatGrade, setAdminChatGrade] = useState("Grade 12");
  const [adminChatMessages, setAdminChatMessages] = useState([]);
  const [adminChatInput, setAdminChatInput] = useState("");
  const [adminChatSending, setAdminChatSending] = useState(false);

  const fetchAdminChat = async (targetGrade) => {
    try {
      const g = targetGrade || adminChatGrade;
      const res = await fetch(`http://localhost:5000/api/group-chat?grade=${encodeURIComponent(g)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setAdminChatMessages(data);
          localStorage.setItem(`lmsGroupChat_${g}`, JSON.stringify(data));
          return;
        }
      }
    } catch (e) {}
    try {
      const cached = localStorage.getItem(`lmsGroupChat_${targetGrade || adminChatGrade}`);
      if (cached) setAdminChatMessages(JSON.parse(cached));
    } catch (e) {}
  };

  React.useEffect(() => {
    if (messageTab === "Grade Group Chats") {
      fetchAdminChat(adminChatGrade);
      const interval = setInterval(() => fetchAdminChat(adminChatGrade), 4000);
      return () => clearInterval(interval);
    }
  }, [messageTab, adminChatGrade]);

  const handleAdminSendGroupChat = async (e) => {
    if (e) e.preventDefault();
    const text = adminChatInput.trim();
    if (!text) return;

    setAdminChatSending(true);
    const newMsg = {
      _id: "gm_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6),
      grade: adminChatGrade,
      senderName: "Kavinda Sir (Lead Lecturer)",
      senderEmail: "admin@econo.lk",
      senderRole: "teacher",
      text,
      timestamp: new Date().toISOString()
    };

    setAdminChatMessages((prev) => {
      const updated = [...prev, newMsg];
      localStorage.setItem(`lmsGroupChat_${adminChatGrade}`, JSON.stringify(updated));
      return updated;
    });
    setAdminChatInput("");

    try {
      await fetch("http://localhost:5000/api/group-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade: adminChatGrade,
          senderName: "Kavinda Sir (Lead Lecturer)",
          senderEmail: "admin@econo.lk",
          senderRole: "teacher",
          text
        })
      });
    } catch (err) {
      console.warn("Could not sync admin group chat message:", err.message);
    } finally {
      setAdminChatSending(false);
    }
  };

  const handleAdminDeleteGroupMsg = (msgId) => {
    showAppConfirm({
      title: "Delete Message?",
      message: "Are you sure you want to delete this message from the group chat?",
      confirmText: "Delete Message",
      type: "danger",
      onConfirm: async () => {
        setAdminChatMessages((prev) => {
          const updated = prev.filter((m) => (m._id || m.id) !== msgId);
          localStorage.setItem(`lmsGroupChat_${adminChatGrade}`, JSON.stringify(updated));
          return updated;
        });
        try {
          await fetch(`http://localhost:5000/api/group-chat/${msgId}`, { method: "DELETE" });
          showAppToast("Message Deleted", "Message removed from community.", "info");
        } catch (e) {}
      }
    });
  };

  // Group portal messages by studentEmail
  const studentChats = Object.entries(
    portalMessages.reduce((acc, msg) => {
      if (!acc[msg.studentEmail]) {
        acc[msg.studentEmail] = {
          name: msg.studentName || "Student",
          lastMsg: msg.text,
          time: msg.timestamp,
          unreadCount: 0
        };
      }
      if (
        msg.sender === "student" &&
        !msg.isRead &&
        msg.studentEmail !== selectedStudentEmail
      ) {
        acc[msg.studentEmail].unreadCount++;
      } else if (new Date(msg.timestamp) > new Date(acc[msg.studentEmail].time)) {
        acc[msg.studentEmail].lastMsg = msg.text;
        acc[msg.studentEmail].time = msg.timestamp;
      }
      return acc;
    }, {})
  ).filter(([email, data]) =>
    data.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const activeMessages = portalMessages.filter(
    (m) => m.studentEmail === selectedStudentEmail
  );

  const selectedStudentName =
    portalMessages.find((m) => m.studentEmail === selectedStudentEmail)?.studentName ||
    "Student";

  const handleSend = (e) => {
    e.preventDefault();
    if (!adminReplyText[selectedStudentEmail]?.trim()) return;
    onAdminReply(selectedStudentEmail, selectedStudentName);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER & SWITCHER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0e1424]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/80 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Student Communication Hub
            </h2>
            <p className="text-xs text-slate-400">
              Real-time portal inquiry chats and automated WhatsApp AI response logs
            </p>
          </div>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setMessageTab("Portal Chat")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              messageTab === "Portal Chat"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Portal Messenger</span>
          </button>
          <button
            onClick={() => setMessageTab("WhatsApp AI History")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              messageTab === "WhatsApp AI History"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>WhatsApp AI Logs</span>
          </button>
          <button
            onClick={() => setMessageTab("Website Inquiries")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              messageTab === "Website Inquiries"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Website Inquiries</span>
            {inquiries.filter((i) => i.status === "unread").length > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] bg-rose-500 text-white rounded-full font-extrabold leading-none">
                {inquiries.filter((i) => i.status === "unread").length}
              </span>
            )}
          </button>
          <button
            onClick={() => setMessageTab("Grade Group Chats")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              messageTab === "Grade Group Chats"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Grade Group Chats</span>
          </button>
        </div>
      </div>

      {/* PORTAL CHAT INTERFACE */}
      {messageTab === "Portal Chat" ? (
        <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[600px]">
          {/* LEFT: CHAT LIST */}
          <div className="border-r border-slate-800/80 flex flex-col bg-[#090d16]/95">
            <div className="p-4 border-b border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Student Conversations
                </span>
                <button
                  onClick={() => onFetchPortalMessages(false)}
                  title="Refresh Conversations"
                  className="text-slate-400 hover:text-white"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter student..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex-grow overflow-y-auto divide-y divide-slate-800/50 scrollbar-thin scrollbar-thumb-slate-800">
              {studentChats.map(([email, data]) => {
                const isSelected = selectedStudentEmail === email;
                return (
                  <button
                    key={email}
                    onClick={() => {
                      setSelectedStudentEmail(email);
                      markAsRead(email);
                    }}
                    className={`w-full p-4 flex items-center gap-3.5 text-left transition-colors ${
                      isSelected
                        ? "bg-indigo-600/15 border-l-4 border-indigo-500"
                        : "hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                      {data.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden flex-grow">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-200 truncate">
                          {data.name}
                        </p>
                        {data.unreadCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shrink-0">
                            {data.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {data.lastMsg || "No messages"}
                      </p>
                    </div>
                  </button>
                );
              })}

              {studentChats.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  <p className="text-xs font-semibold">No chats found</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: CONVERSATION WINDOW */}
          <div className="md:col-span-2 flex flex-col bg-[#0b101c]/90">
            {selectedStudentEmail ? (
              <>
                {/* ACTIVE CHAT HEADER */}
                <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-bold flex items-center justify-center text-sm">
                      {selectedStudentName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        {selectedStudentName}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {selectedStudentEmail}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onFetchPortalMessages(false)}
                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* MESSAGES THREAD */}
                <div className="flex-grow overflow-y-auto p-6 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800">
                  {activeMessages.map((msg, idx) => {
                    const isAdmin = msg.sender === "admin";
                    return (
                      <div
                        key={idx}
                        className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                            isAdmin
                              ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-tr-none shadow-md"
                              : "bg-slate-800/90 text-slate-200 rounded-tl-none border border-slate-700/60"
                          }`}
                        >
                          {msg.attachment && (
                            <div className="mb-2">
                              {msg.attachment.type === "image" ? (
                                <img
                                  src={msg.attachment.data}
                                  className="max-w-xs max-h-52 rounded-xl border border-white/10 shadow object-cover cursor-pointer"
                                  alt="attachment"
                                  onClick={() => window.open(msg.attachment.data, '_blank')}
                                />
                              ) : (
                                <a
                                  href={msg.attachment.data}
                                  download={msg.attachment.name || "attachment"}
                                  className="flex items-center gap-2 bg-black/20 hover:bg-black/30 p-2.5 rounded-xl text-[11px] font-semibold transition-all border border-white/10"
                                >
                                  <span className="text-base">📄</span>
                                  <div className="text-left truncate">
                                    <p className="font-bold truncate max-w-[160px]">{msg.attachment.name || "File Attachment"}</p>
                                    <p className="text-[9px] opacity-60 uppercase">Click to Download</p>
                                  </div>
                                </a>
                              )}
                            </div>
                          )}
                          <p className="leading-relaxed whitespace-pre-wrap">
                            {msg.text}
                          </p>
                          <div
                            className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                              isAdmin ? "text-indigo-200" : "text-slate-500"
                            }`}
                          >
                            <span>
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </span>
                            {isAdmin && <CheckCheck className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* REPLY INPUT */}
                <form
                  onSubmit={handleSend}
                  className="p-3 border-t border-slate-800/80 flex items-center gap-2 bg-slate-900/40"
                >
                  <input
                    type="text"
                    placeholder={`Reply to ${selectedStudentName}...`}
                    value={adminReplyText[selectedStudentEmail] || ""}
                    onChange={(e) =>
                      setAdminReplyText({
                        ...adminReplyText,
                        [selectedStudentEmail]: e.target.value
                      })
                    }
                    className="flex-grow bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-medium text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition-all active:scale-95 shrink-0"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-slate-500 p-8">
                <MessageSquare className="w-12 h-12 text-slate-700 mb-3" />
                <p className="font-bold text-sm text-slate-400">
                  Select a student conversation
                </p>
                <p className="text-xs text-slate-500 mt-1 text-center max-w-xs">
                  Choose a student from the sidebar to view chat history and reply instantly.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : messageTab === "WhatsApp AI History" ? (
        /* WHATSAPP AI LOGS INTERFACE */
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-[#0e1424]/90 backdrop-blur-xl p-4 rounded-2xl border border-slate-800/80">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-300">
                AI Auto-Responder History ({whatsappMessages.length} logs)
              </span>
            </div>
            <button
              onClick={onFetchWhatsappMessages}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Logs</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {whatsappMessages.map((msg) => (
              <div
                key={msg._id}
                className="bg-[#0e1424]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/80 space-y-4 shadow-xl relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black flex items-center justify-center text-xs">
                      {msg.name?.charAt(0) || "W"}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        {msg.name || "Student"}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {msg.from?.split("@")[0]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500">
                      {new Date(msg.timestamp).toLocaleString()}
                    </span>
                    <button
                      onClick={() => onDeleteWhatsappMessage(msg._id)}
                      title="Delete Log"
                      className="w-7 h-7 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Student Inquiry
                    </p>
                    <p className="text-slate-200 italic font-medium leading-relaxed">
                      "{msg.body}"
                    </p>
                  </div>
                  <div className="bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-500/20">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                      AI Generated Response
                    </p>
                    <p className="text-emerald-300 font-medium leading-relaxed">
                      {msg.reply}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {whatsappMessages.length === 0 && (
              <div className="p-16 text-center text-slate-500 bg-[#0e1424]/90 rounded-3xl border border-slate-800/80">
                <Bot className="w-10 h-10 text-slate-700 mx-auto mb-2" />
                <p className="font-bold text-sm text-slate-400">
                  No WhatsApp logs recorded yet
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* WEBSITE INQUIRIES VIEW */
        <div className="space-y-4">
          {/* SEARCH & REFRESH BAR */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0e1424]/90 p-4 rounded-2xl border border-slate-800/80">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search inquiries by name, phone or message..."
                value={inquirySearch}
                onChange={(e) => setInquirySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onFetchInquiries}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
              <div className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                Total: {inquiries.length}
              </div>
            </div>
          </div>

          {/* INQUIRIES LIST */}
          <div className="space-y-3">
            {inquiries
              .filter((item) => {
                const q = inquirySearch.toLowerCase();
                return (
                  !q ||
                  item.name?.toLowerCase().includes(q) ||
                  item.phone?.toLowerCase().includes(q) ||
                  item.message?.toLowerCase().includes(q)
                );
              })
              .map((inquiry, idx) => {
                const cleanPhone = (inquiry.phone || "").replace(/[^0-9]/g, "");
                const waNumber = cleanPhone.startsWith("0")
                  ? "94" + cleanPhone.substring(1)
                  : cleanPhone.startsWith("94")
                  ? cleanPhone
                  : "94" + cleanPhone;

                return (
                  <div
                    key={inquiry._id || inquiry.id || idx}
                    className={`p-5 rounded-2xl border transition-all ${
                      inquiry.status === "unread"
                        ? "bg-[#0e1424]/95 border-blue-500/30 shadow-lg shadow-blue-500/5"
                        : "bg-[#0e1424]/70 border-slate-800/80"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                          {(inquiry.name || "U")[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">
                              {inquiry.name}
                            </h4>
                            {inquiry.status === "unread" && (
                              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-extrabold border border-blue-500/30">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">
                            📞 {inquiry.phone || "No phone provided"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        {inquiry.phone && (
                          <a
                            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                              `Hello ${inquiry.name}, thank you for contacting EconoAcademy. Regarding your inquiry: "${inquiry.message?.substring(0, 50)}..."`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>WhatsApp Chat</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        <button
                          onClick={() =>
                            onToggleInquiryStatus(
                              inquiry._id || inquiry.id,
                              inquiry.status
                            )
                          }
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                            inquiry.status === "read"
                              ? "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                              : "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{inquiry.status === "read" ? "Mark Unread" : "Mark Done"}</span>
                        </button>

                        <button
                          onClick={() => onDeleteInquiry(inquiry._id || inquiry.id)}
                          title="Delete Inquiry"
                          className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* MESSAGE BODY */}
                    <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 mt-2">
                      <p className="text-xs text-slate-300 leading-relaxed font-normal whitespace-pre-wrap">
                        {inquiry.message}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2.5 px-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {inquiry.date || (inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleString() : "Recently")}
                      </span>
                      <span>Source: Contact Us Form</span>
                    </div>
                  </div>
                );
              })}

            {inquiries.length === 0 && (
              <div className="p-16 text-center text-slate-500 bg-[#0e1424]/90 rounded-3xl border border-slate-800/80">
                <Globe className="w-10 h-10 text-slate-700 mx-auto mb-2" />
                <p className="font-bold text-sm text-white">
                  No website inquiries received yet
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Messages submitted via the "Contact & Support" page will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GRADE GROUP CHATS MONITORING & BROADCAST */}
      {messageTab === "Grade Group Chats" && (
        <div className="space-y-6">
          {/* GRADE SELECTOR & CONTROLS */}
          <div className="bg-[#0e1424]/90 backdrop-blur-xl p-5 rounded-3xl border border-slate-800/80 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-purple-400" />
                <span>Select Grade Channel:</span>
              </span>
              {[
                "All",
                "Grade 6",
                "Grade 7",
                "Grade 8",
                "Grade 9",
                "Grade 10",
                "Grade 11",
                "Grade 12",
                "Grade 13"
              ].map((g) => (
                <button
                  key={g}
                  onClick={() => setAdminChatGrade(g)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    adminChatGrade === g
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/25"
                      : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {g === "All" ? "🌐 All Grades" : g}
                </button>
              ))}
            </div>

            <button
              onClick={() => fetchAdminChat(adminChatGrade)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 shrink-0 self-start md:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Stream</span>
            </button>
          </div>

          {/* CHAT MONITORING WINDOW */}
          <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden flex flex-col h-[580px]">
            {/* STREAM HEADER */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{adminChatGrade === "All" ? "All Grades Public Community" : adminChatGrade + " Group Chat"}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-extrabold uppercase">
                      Admin Monitoring
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {adminChatMessages.length} messages in channel • Teacher announcements are highlighted
                  </p>
                </div>
              </div>
            </div>

            {/* MESSAGES FEED */}
            <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-[#070b14]/50">
              {adminChatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-2">
                  <Users className="w-10 h-10 text-slate-600" />
                  <p className="text-sm font-bold text-slate-300">No messages in {adminChatGrade} yet</p>
                  <p className="text-xs text-slate-500">Post an announcement below to initiate the discussion.</p>
                </div>
              ) : (
                adminChatMessages.map((msg) => {
                  const msgId = msg._id || msg.id;
                  const isTeacher = msg.senderRole === "teacher" || msg.senderRole === "admin";

                  return (
                    <div
                      key={msgId}
                      className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                        isTeacher
                          ? "bg-purple-950/20 border-purple-500/40 shadow-md shadow-purple-950/20"
                          : "bg-slate-900/80 border-slate-800/80"
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                          isTeacher ? "bg-gradient-to-tr from-purple-600 to-indigo-600" : "bg-slate-800 text-slate-300"
                        }`}>
                          {msg.senderName?.charAt(0) || "S"}
                        </div>

                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-white">{msg.senderName}</span>
                            {isTeacher ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase border border-amber-500/30">
                                <Award className="w-2.5 h-2.5" />
                                <span>Lecturer / Admin</span>
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">({msg.senderEmail})</span>
                            )}
                            <span className="text-[10px] text-slate-500">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>

                          <div className="text-xs text-slate-200 leading-relaxed break-words whitespace-pre-line font-normal">
                            {msg.text}
                          </div>

                          {msg.attachment && (
                            <div className="pt-2">
                              {msg.attachment.type === "image" ? (
                                <img src={msg.attachment.url} alt="Attachment" className="max-h-40 rounded-xl object-contain" />
                              ) : (
                                <a href={msg.attachment.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 underline">
                                  {msg.attachment.name || "View Attachment"}
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleAdminDeleteGroupMsg(msgId)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                        title="Delete Message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* TEACHER ANNOUNCEMENT INPUT */}
            <form onSubmit={handleAdminSendGroupChat} className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Broadcasting to {adminChatGrade}:</span>
              </div>
              <input
                type="text"
                value={adminChatInput}
                onChange={(e) => setAdminChatInput(e.target.value)}
                placeholder={`Type official announcement or study update to ${adminChatGrade}... (පණිවිඩයක් යවන්න)`}
                className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                disabled={!adminChatInput.trim() || adminChatSending}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20 disabled:opacity-50 flex items-center gap-1.5 transition-all shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesTab;
