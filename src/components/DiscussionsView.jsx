import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Send,
  ThumbsUp,
  Award,
  CheckCircle2,
  Pin,
  Search,
  Filter,
  Sparkles,
  Clock,
  User,
  Trash2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  HelpCircle,
  Share2,
  AlertCircle
} from "lucide-react";
import { showAppConfirm, showAppToast } from "./GlobalAlert";

const GRADES = [
  "All",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
  "Grade 13"
];

const CATEGORIES = ["All", "Theory", "Past Paper", "Model Paper", "Discussion", "General"];

const INITIAL_TOPICS = [
  {
    _id: "seed_top_1",
    title: "Opportunity Cost in Economic Decision Making",
    titleSi: "ආර්ථික තීරණ ගැනීමේදී ආවස්ථික පිරිවැය (Opportunity Cost) යෙදෙන්නේ කෙසේද?",
    question: "Explain the concept of opportunity cost with a real-world example from Sri Lanka's economy. How does scarcity force society to make choices between consumer goods and capital goods?",
    grade: "Grade 12",
    category: "Theory",
    authorName: "Kavinda Sir (Lead Lecturer)",
    authorRole: "teacher",
    pinned: true,
    tags: ["Microeconomics", "Unit 1", "Opportunity Cost"],
    comments: [
      {
        id: "comm_seed_1",
        studentName: "Kasun Perera",
        studentEmail: "kasun@sample.lk",
        studentPhoto: "",
        role: "student",
        comment: "ආවස්ථික පිරිවැය යනු කිසියම් තේරීමක් කිරීමේදී කැප කිරීමට සිදුවන හොඳම විකල්පයේ අගයයි. උදාහරණයක් ලෙස රජය අධ්‍යාපනයට මුදල් වෙන් කිරීමේදී යටිතල පහසුකම් සංවර්ධනය වෙනුවෙන් වැය කිරීමට තිබූ අවස්ථාව අහිමි වේ.",
        likes: 4,
        likedBy: [],
        isVerifiedAnswer: true,
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    _id: "seed_top_2",
    title: "Fiscal Policy vs Monetary Policy during Inflation",
    titleSi: "උද්ධමනය පාලනය කිරීම සඳහා මූල්‍ය ප්‍රතිපත්තිය හා රාජ්‍ය මූල්‍ය ප්‍රතිපත්තිය භාවිතය",
    question: "Which policy tool is more immediately effective in curtailing demand-pull inflation in a developing economy? Discuss interest rate adjustments vs government expenditure cuts.",
    grade: "Grade 13",
    category: "Past Paper",
    authorName: "Kavinda Sir (Lead Lecturer)",
    authorRole: "teacher",
    pinned: true,
    tags: ["Macroeconomics", "Inflation", "Fiscal Policy"],
    comments: [],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    _id: "seed_top_3",
    title: "Welcome to Study Forum! විෂය කරුණු සම්බන්ධ ප්‍රශ්න මෙහිදී සාකච්ඡා කරමු.",
    titleSi: "සියලුම සිසුන් සඳහා සාකච්ඡා මණ්ඩපය (All Grades Q&A)",
    question: "ඔබට ආර්ථික විද්‍යා පාඩම් මාලාවේ ගැටලු සහ විභාග ප්‍රශ්න පිළිබඳව මෙහිදී ගුරුවරයාගෙන් සහ සහෝදර සිසුන්ගෙන් විමසා දැනගත හැක. ගුරුවරයා විසින් දමන ප්‍රශ්න වලට නිවැරදිව පිළිතුරු සපයා ලකුණු හා Verified Badges දිනාගන්න!",
    grade: "All",
    category: "General",
    authorName: "Admin / Teacher Support",
    authorRole: "teacher",
    pinned: true,
    tags: ["General", "Announcement", "Q&A"],
    comments: [],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

export default function DiscussionsView({ user = {} }) {
  const defaultGrade = user?.grade && GRADES.includes(user.grade) ? user.grade : "All";
  const [selectedGrade, setSelectedGrade] = useState(defaultGrade);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [topics, setTopics] = useState(() => {
    try {
      const cached = localStorage.getItem("lmsDiscussionsData");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_TOPICS;
  });
  const [expandedTopics, setExpandedTopics] = useState(() => ({
    seed_top_1: true,
    seed_top_2: true
  }));
  const [replyInputs, setReplyInputs] = useState({});
  const [submittingReply, setSubmittingReply] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch topics from server with graceful local fallback
  const fetchTopics = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/discussions?grade=${encodeURIComponent(selectedGrade)}`
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setTopics(data);
          localStorage.setItem("lmsDiscussionsData", JSON.stringify(data));
          return;
        }
      }
    } catch (err) {
      // Backend not running or network issue -> keep local cache
    }
  };

  useEffect(() => {
    fetchTopics();
    const interval = setInterval(fetchTopics, 4500);
    return () => clearInterval(interval);
  }, [selectedGrade]);

  const toggleExpand = (topicId) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const handlePostReply = async (topicId) => {
    const text = (replyInputs[topicId] || "").trim();
    if (!text) return;

    setSubmittingReply((prev) => ({ ...prev, [topicId]: true }));

    const newCommentObj = {
      id: "cmt_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6),
      studentName: user?.name || "Student",
      studentEmail: (user?.email || "student@econo.lk").toLowerCase(),
      studentPhoto: user?.profilePic || "",
      role: user?.email === "admin" || user?.role === "teacher" ? "teacher" : "student",
      comment: text,
      likes: 0,
      likedBy: [],
      isVerifiedAnswer: user?.role === "teacher",
      createdAt: new Date().toISOString()
    };

    // Optimistic UI update
    setTopics((prev) => {
      const updated = prev.map((t) => {
        if ((t._id || t.id) === topicId) {
          return {
            ...t,
            comments: [...(t.comments || []), newCommentObj]
          };
        }
        return t;
      });
      localStorage.setItem("lmsDiscussionsData", JSON.stringify(updated));
      return updated;
    });

    setReplyInputs((prev) => ({ ...prev, [topicId]: "" }));
    setExpandedTopics((prev) => ({ ...prev, [topicId]: true }));

    // Send to backend
    try {
      await fetch(`http://localhost:5000/api/discussions/${topicId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: user?.name || "Student",
          studentEmail: user?.email || "student@econo.lk",
          studentPhoto: user?.profilePic || "",
          role: user?.email === "admin" || user?.role === "teacher" ? "teacher" : "student",
          comment: text
        })
      });
    } catch (e) {
      console.warn("Could not sync reply to server:", e.message);
    } finally {
      setSubmittingReply((prev) => ({ ...prev, [topicId]: false }));
    }
  };

  const handleLikeComment = async (topicId, commentId) => {
    const userEmail = (user?.email || "student@econo.lk").toLowerCase();

    // Optimistic UI update
    setTopics((prev) => {
      const updated = prev.map((t) => {
        if ((t._id || t.id) === topicId) {
          const updatedComments = (t.comments || []).map((c) => {
            if (c.id === commentId) {
              const likedBy = Array.isArray(c.likedBy) ? [...c.likedBy] : [];
              const hasLiked = likedBy.includes(userEmail);
              const nextLikedBy = hasLiked
                ? likedBy.filter((e) => e !== userEmail)
                : [...likedBy, userEmail];
              return {
                ...c,
                likedBy: nextLikedBy,
                likes: Math.max(0, (c.likes || 0) + (hasLiked ? -1 : 1))
              };
            }
            return c;
          });
          return { ...t, comments: updatedComments };
        }
        return t;
      });
      localStorage.setItem("lmsDiscussionsData", JSON.stringify(updated));
      return updated;
    });

    try {
      await fetch(
        `http://localhost:5000/api/discussions/${topicId}/like-comment/${commentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail })
        }
      );
    } catch (e) {
      console.warn("Could not sync like to server:", e.message);
    }
  };

  const handleDeleteComment = (topicId, commentId) => {
    showAppConfirm({
      title: "Remove Answer?",
      message: "Are you sure you want to remove this answer? This action cannot be undone.",
      confirmText: "Remove Answer",
      type: "danger",
      onConfirm: async () => {
        setTopics((prev) => {
          const updated = prev.map((t) => {
            if ((t._id || t.id) === topicId) {
              return {
                ...t,
                comments: (t.comments || []).filter((c) => c.id !== commentId)
              };
            }
            return t;
          });
          localStorage.setItem("lmsDiscussionsData", JSON.stringify(updated));
          return updated;
        });

        try {
          await fetch(
            `http://localhost:5000/api/discussions/${topicId}/comments/${commentId}`,
            { method: "DELETE" }
          );
          showAppToast("Answer Removed", "Your answer has been deleted.", "info");
        } catch (e) {
          console.warn("Could not delete comment on server:", e.message);
        }
      }
    });
  };

  // Filter topics
  const filteredTopics = topics.filter((t) => {
    const matchesGrade =
      selectedGrade === "All" ||
      t.grade === "All" ||
      !t.grade ||
      t.grade === selectedGrade;

    const matchesCategory =
      selectedCategory === "All" ||
      t.category === selectedCategory;

    const matchesSearch =
      !searchQuery.trim() ||
      (t.title && t.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.titleSi && t.titleSi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.question && t.question.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesGrade && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn pb-12">
      {/* BANNER HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900/60 border border-indigo-500/20 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Academic Q&A & Peer Forum</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              සාකච්ඡා මණ්ඩපය (Academic Discussions)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
              ගුරුවරයා විසින් ඉදිරිපත් කරන ප්‍රශ්න හා විෂය සංකල්ප වලට පිළිතුරු සපයන්න. 
              නිවැරදි හා විශිෂ්ට පිළිතුරු සඳහා ගුරුවරයාගේ <span className="text-amber-400 font-bold">Verified Answer</span> ඇගයීම හිමිවේ!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Topics</div>
              <div className="text-xl font-black text-indigo-400">{filteredTopics.length}</div>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Enrolled As</div>
              <div className="text-sm font-black text-emerald-400">{user?.grade || "Student"}</div>
            </div>
          </div>
        </div>

        {/* GRADE SELECTOR PILLS */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>Select Grade:</span>
          </span>
          {GRADES.map((g) => {
            const isSelected = selectedGrade === g;
            return (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-105"
                    : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                }`}
              >
                {g === "All" ? "🌐 All Grades" : g}
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0e1424]/90 backdrop-blur-xl p-4 rounded-2xl border border-slate-800/80 shadow-lg">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or keywords..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden md:inline">
            Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-indigo-600/30 border border-indigo-500 text-indigo-300"
                  : "text-slate-400 hover:text-white bg-slate-900/50 border border-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* TOPICS LIST */}
      {filteredTopics.length === 0 ? (
        <div className="text-center py-16 px-4 bg-[#0e1424]/60 backdrop-blur-xl rounded-3xl border border-slate-800/80 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-3xl flex items-center justify-center mx-auto text-indigo-400">
            💬
          </div>
          <h3 className="text-lg font-bold text-white">No discussions found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {selectedGrade !== "All"
              ? `There are no discussion questions posted for ${selectedGrade} yet.`
              : "Try adjusting your search query or filters."}
          </p>
          {selectedGrade !== "All" && (
            <button
              onClick={() => setSelectedGrade("All")}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-xl transition-all"
            >
              View All Grades Topics
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredTopics.map((topic) => {
            const topicId = topic._id || topic.id;
            const isExpanded = Boolean(expandedTopics[topicId]);
            const commentsCount = (topic.comments || []).length;
            const hasVerifiedAnswer = (topic.comments || []).some(
              (c) => c.isVerifiedAnswer
            );

            return (
              <div
                key={topicId}
                className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 shadow-xl hover:border-slate-700/80 transition-all overflow-hidden"
              >
                {/* TOPIC HEADER BAR */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {topic.pinned && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[11px] font-bold">
                          <Pin className="w-3 h-3" />
                          <span>Pinned Topic</span>
                        </span>
                      )}
                      <span className="px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[11px] font-bold">
                        {topic.grade || "All Grades"}
                      </span>
                      {topic.category && (
                        <span className="px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[11px] font-bold">
                          {topic.category}
                        </span>
                      )}
                      {hasVerifiedAnswer && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified Answer Available</span>
                        </span>
                      )}
                    </div>

                    {/* Author Stamp */}
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <div className="w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-[10px] font-bold text-indigo-300">
                        {topic.authorName?.charAt(0) || "T"}
                      </div>
                      <span className="font-semibold text-slate-300">
                        {topic.authorName || "Teacher"}
                      </span>
                      {topic.authorRole === "teacher" && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase">
                          Teacher
                        </span>
                      )}
                    </div>
                  </div>

                  {/* TITLE & QUESTION */}
                  <div className="space-y-2">
                    <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                      {topic.title}
                    </h2>
                    {topic.titleSi && (
                      <h3 className="text-sm font-bold text-indigo-300 leading-snug">
                        {topic.titleSi}
                      </h3>
                    )}
                    <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs sm:text-sm text-slate-300 font-medium leading-relaxed whitespace-pre-line">
                      {topic.question}
                    </div>
                  </div>

                  {/* TAGS */}
                  {Array.isArray(topic.tags) && topic.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {topic.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* FOOTER ACTIONS */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => toggleExpand(topicId)}
                      className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>
                        {commentsCount} {commentsCount === 1 ? "Answer / පිළිතුර" : "Answers / පිළිතුරු"}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(topic.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* EXPANDED ANSWERS / COMMENTS SECTION */}
                {isExpanded && (
                  <div className="border-t border-slate-800 bg-[#090e1a]/80 p-5 sm:p-6 space-y-6">
                    {/* COMMENTS LIST */}
                    {commentsCount === 0 ? (
                      <div className="text-center py-8 px-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-xs text-slate-400">
                        <p className="font-semibold text-slate-300">
                          මෙම ප්‍රශ්නයට තවම කිසිදු ශිෂ්‍ය පිළිතුරක් ලැබී නොමැත.
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          පළමු පිළිතුර සපයා ගුරුවරයාගේ ඇගයීම දිනාගන්න! (Be the first to submit an answer)
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Student Answers & Teacher Explanations:
                        </div>

                        {topic.comments.map((comment) => {
                          const userEmail = (user?.email || "").toLowerCase();
                          const hasLiked =
                            Array.isArray(comment.likedBy) &&
                            comment.likedBy.includes(userEmail);
                          const isAuthor =
                            userEmail &&
                            comment.studentEmail &&
                            comment.studentEmail.toLowerCase() === userEmail;

                          return (
                            <div
                              key={comment.id}
                              className={`p-4 rounded-2xl border transition-all ${
                                comment.isVerifiedAnswer
                                  ? "bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-950/30"
                                  : comment.role === "teacher"
                                  ? "bg-amber-950/20 border-amber-500/40"
                                  : "bg-slate-900/80 border-slate-800"
                              }`}
                            >
                              {/* VERIFIED BANNER */}
                              {comment.isVerifiedAnswer && (
                                <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-black">
                                  <Award className="w-4 h-4 text-emerald-400" />
                                  <span>👑 Verified Teacher Answer (ගුරු භවතා අනුමත කළ පිළිතුර)</span>
                                </div>
                              )}

                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase shadow">
                                    {comment.studentPhoto ? (
                                      <img
                                        src={comment.studentPhoto}
                                        alt={comment.studentName}
                                        className="w-full h-full object-cover rounded-xl"
                                      />
                                    ) : (
                                      comment.studentName?.charAt(0) || "S"
                                    )}
                                  </div>
                                  <div>
                                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                      <span>{comment.studentName}</span>
                                      {comment.role === "teacher" && (
                                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase">
                                          Teacher
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                      {new Date(comment.createdAt).toLocaleDateString()} at{" "}
                                      {new Date(comment.createdAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                      })}
                                    </div>
                                  </div>
                                </div>

                                {isAuthor && (
                                  <button
                                    onClick={() => handleDeleteComment(topicId, comment.id)}
                                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                                    title="Delete my answer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>

                              {/* Comment Content */}
                              <div className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed pl-10 whitespace-pre-line">
                                {comment.comment}
                              </div>

                              {/* Actions: Likes */}
                              <div className="mt-3 pl-10 flex items-center gap-4 text-xs">
                                <button
                                  onClick={() => handleLikeComment(topicId, comment.id)}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                    hasLiked
                                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                      : "bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60"
                                  }`}
                                >
                                  <ThumbsUp className="w-3.5 h-3.5" />
                                  <span>{comment.likes || 0}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* NEW ANSWER FORM */}
                    <div className="pt-4 border-t border-slate-800/80 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <MessageSquare className="w-4 h-4 text-indigo-400" />
                        <span>ඔබගේ පිළිතුර හෝ අදහස ඉදිරිපත් කරන්න (Post Your Answer):</span>
                      </div>

                      <div className="relative">
                        <textarea
                          rows={3}
                          value={replyInputs[topicId] || ""}
                          onChange={(e) =>
                            setReplyInputs((prev) => ({
                              ...prev,
                              [topicId]: e.target.value
                            }))
                          }
                          placeholder="ඔබගේ පිළිතුර මෙහි සටහන් කරන්න... (Type your full answer or explanation here)..."
                          className="w-full p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-y leading-relaxed"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-[11px] text-slate-500">
                          Posting as: <strong className="text-slate-400">{user?.name || "Student"}</strong>
                        </div>
                        <button
                          disabled={
                            !replyInputs[topicId]?.trim() || submittingReply[topicId]
                          }
                          onClick={() => handlePostReply(topicId)}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{submittingReply[topicId] ? "Posting..." : "Submit Answer (පිළිතුර යවන්න)"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
