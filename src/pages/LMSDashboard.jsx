import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { compressImageFile } from "../utils/imageCompressor";
import AssignmentView from "../components/AssignmentView";
import { evaluateWebCode } from "../utils/codeEvaluator";
import DiscussionsView from "../components/DiscussionsView";
import GradeGroupChatView from "../components/GradeGroupChatView";
import TradingChartWhiteboard from "../components/TradingChartWhiteboard";
import { PatternGraphic } from "../components/CandlestickPatternsShowcase";
import {
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Key,
  Camera,
  Calendar,
  GraduationCap,
  BookOpen,
  LogOut,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  ShieldCheck,
  Zap,
  Save,
  Send,
  CreditCard,
  Copy,
  Check,
  FileText,
  UploadCloud,
  Award,
  Paperclip,
  FileCheck,
  HelpCircle,
  ExternalLink,
  Eye,
  Layers,
  Video,
  Play,
  Share2,
  Gift,
  Users
} from "lucide-react";

const getYouTubeThumbnail = (rawUrl) => {
  if (!rawUrl) return null;
  const url = String(rawUrl).trim();
  let videoId = "";
  if (url.includes("youtube.com/watch?v=")) {
    videoId = url.split("watch?v=")[1]?.split("&")[0];
  } else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0];
  } else if (url.includes("youtube.com/embed/")) {
    videoId = url.split("embed/")[1]?.split("?")[0];
  }
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
};

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
  const lower = String(url).toLowerCase().trim();
  return (
    lower.startsWith("data:video") ||
    lower.startsWith("blob:") ||
    lower.includes("/uploads/videos/") ||
    lower.includes("/uploads/") ||
    lower.endsWith(".mp4") ||
    lower.endsWith(".webm") ||
    lower.endsWith(".mov") ||
    lower.endsWith(".mkv") ||
    lower.endsWith(".ogg") ||
    lower.endsWith(".avi") ||
    /\.(mp4|webm|mov|mkv|ogg|avi|m4v)(\?.*)?$/i.test(lower)
  );
};

const getNormalizedUrl = (rawUrl) => {
   if (!rawUrl) return "";
   const trimmed = String(rawUrl).trim();
   if (/^https?:\/\//i.test(trimmed)) return trimmed;
   return `https://${trimmed}`;
};

const formatTimeDisplay = (timeStr) => {
   if (!timeStr) return "";
   const trimmed = String(timeStr).trim();
   if (trimmed.includes("AM") || trimmed.includes("PM") || trimmed.includes("am") || trimmed.includes("pm")) {
      return trimmed;
   }
   const parts = trimmed.split(":");
   const h = Number(parts[0]) || 0;
   const m = Number(parts[1]) || 0;
   const period = h >= 12 ? "PM" : "AM";
   const h12 = h % 12 || 12;
   return `${h12}:${String(m).padStart(2, "0")} ${period}`;
};

const getActiveZoomMeeting = (zoom) => {
   if (!zoom || !zoom.link || !String(zoom.link).trim()) return null;

   const now = new Date();

   if (zoom.date) {
      const sep = zoom.date.includes("-") ? "-" : "/";
      const dateParts = zoom.date.split(sep).map(Number);
      if (dateParts.length === 3 && !dateParts.some(isNaN)) {
         let year, month, day;
         if (dateParts[0] > 1000) {
            [year, month, day] = dateParts;
         } else if (dateParts[2] > 1000) {
            [day, month, year] = dateParts;
         } else {
            [year, month, day] = dateParts;
         }

         let startH = 0, startM = 0;
         if (zoom.startTime) {
            const sp = zoom.startTime.split(":").map(Number);
            startH = sp[0] || 0;
            startM = sp[1] || 0;
         }

         let endH = zoom.startTime ? startH + 2 : 23;
         let endM = zoom.startTime ? startM : 59;
         if (zoom.endTime) {
            const ep = zoom.endTime.split(":").map(Number);
            endH = ep[0] || 0;
            endM = ep[1] || 0;
         }

         const startDateTime = new Date(year, month - 1, day, startH, startM, 0);
         const endDateTime = new Date(year, month - 1, day, endH, endM, 0);

         // Handle midnight crossover if end time is next day
         if (endDateTime <= startDateTime) {
            endDateTime.setDate(endDateTime.getDate() + 1);
         }

         // If meeting has already ended, do not display!
         if (now > endDateTime) {
            return null;
         }

         const isLive = now >= startDateTime && now <= endDateTime;
         const isUpcoming = now < startDateTime;

         return {
            isLive,
            isUpcoming,
            dateText: zoom.date,
            timeText: `${formatTimeDisplay(zoom.startTime)}${zoom.endTime ? ' - ' + formatTimeDisplay(zoom.endTime) : ''}`,
            link: getNormalizedUrl(zoom.link)
         };
      }
   }

   // Fallback if no date is set but link exists
   return {
      isLive: false,
      isUpcoming: true,
      dateText: "Upcoming",
      timeText: zoom.startTime ? formatTimeDisplay(zoom.startTime) : "",
      link: getNormalizedUrl(zoom.link)
   };
};

const defaultInitialAssignments = [];

const LMSDashboard = () => {
   const navigate = useNavigate();
   const [activeLesson, setActiveLesson] = useState(0);
   const [user, setUser] = useState(null);
   const [lessons, setLessons] = useState([]);
   const [alert, setAlert] = useState(null);
   const [zoomData, setZoomData] = useState({ link: "", time: "" });
   const [justMarkedAttendance, setJustMarkedAttendance] = useState(false);
   const todayDateStr = new Date().toLocaleDateString('en-CA');
   const isMarkedToday = Boolean(user?.isPresent && (!user?.attendanceDate || user?.attendanceDate === todayDateStr));

   const [activeNav, setActiveNav] = useState(localStorage.getItem("lastActiveNav") || "Dashboard");
   const [profilePic, setProfilePic] = useState(null);
   const [coverPhoto, setCoverPhoto] = useState(null);

   // SITE BRANDING
   const [branding, setBranding] = useState(() => {
      try {
         const home = JSON.parse(localStorage.getItem("webHomeSettings") || "{}");
         return home?.branding || { logo: "/logo.png", siteName: "TaizerLMS" };
      } catch {
         return { logo: "/logo.png", siteName: "TaizerLMS" };
      }
   });

   // PAYMENT STATE
   const [receiptImage, setReceiptImage] = useState(null);
   const [isUploading, setIsUploading] = useState(false);
   const [copiedAccount, setCopiedAccount] = useState(false);

   // ASSESSMENT STATE
   const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
   const [assessmentQuestions, setAssessmentQuestions] = useState([]);
   const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
   const [quizAnswers, setQuizAnswers] = useState([]);
   const [assessmentResult, setAssessmentResult] = useState(null);

   // CHAT BOX STATE
   const [isChatOpen, setIsChatOpen] = useState(false);
   const [messages, setMessages] = useState([]);
   const [chatText, setChatText] = useState("");
   const [isEmojiOpen, setIsEmojiOpen] = useState(false);
   const [sessions, setSessions] = useState([]);
   const [activeSession, setActiveSession] = useState(null);
   const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
   const [answeredSlides, setAnsweredSlides] = useState({});
   const [userProgress, setUserProgress] = useState({});
   const [completedModalSession, setCompletedModalSession] = useState(null);

   // Persistent session progress state per student
   const [sessionProgress, setSessionProgress] = useState(() => {
      try {
         const currentUserEmail = localStorage.getItem("currentUser") || "guest";
         const saved = localStorage.getItem(`lms_session_progress_${currentUserEmail}`);
         return saved ? JSON.parse(saved) : {};
      } catch (e) {
         return {};
      }
   });

   const saveSessionProgress = (newProgress) => {
      setSessionProgress(newProgress);
      try {
         const currentUserEmail = localStorage.getItem("currentUser") || "guest";
         localStorage.setItem(`lms_session_progress_${currentUserEmail}`, JSON.stringify(newProgress));
      } catch (e) {
         console.error("Failed to save session progress", e);
      }
   };

   const getSessionKey = (session) => {
      if (!session) return "session_unknown";
      return String(session.id || session.title || "session_0");
   };

   // Open session: resumes where left off if started, or in review mode if completed
   const handleOpenSession = (session) => {
      if (!session.content || session.content.length === 0) {
         showNotification("Notice", "This session has no content yet.", "info");
         return;
      }

      const sKey = getSessionKey(session);
      const prog = sessionProgress[sKey] || {};

      setActiveSession(session);

      if (prog.status === "completed") {
         setCurrentSlideIndex(0);
         setAnsweredSlides(prog.answeredSlides || {});
      } else {
         const resumeIdx = Math.max(0, Math.min(prog.lastSlideIndex || 0, (session.content?.length || 1) - 1));
         setCurrentSlideIndex(resumeIdx);
         setAnsweredSlides(prog.answeredSlides || {});

         const updated = {
            ...sessionProgress,
            [sKey]: {
               ...prog,
               status: "started",
               lastSlideIndex: resumeIdx,
               answeredSlides: prog.answeredSlides || {}
            }
         };
         saveSessionProgress(updated);
      }
   };

   // Answer quiz slide permanently
   const handleAnswerQuizSlide = (slideIdx, selectedIdx, isCorrect) => {
      if (!activeSession) return;
      const sKey = getSessionKey(activeSession);
      const prog = sessionProgress[sKey] || {};

      if (prog.status === "completed" || answeredSlides[slideIdx]) {
         return;
      }

      const newAnswers = {
         ...answeredSlides,
         [slideIdx]: { selected: selectedIdx, correct: isCorrect }
      };
      setAnsweredSlides(newAnswers);

      const updated = {
         ...sessionProgress,
         [sKey]: {
            ...prog,
            status: prog.status || "started",
            lastSlideIndex: currentSlideIndex,
            answeredSlides: newAnswers
         }
      };
      saveSessionProgress(updated);
   };

   // Slide change with auto-resume tracking
   const handleSlideChange = (newIndex) => {
      if (!activeSession) return;
      const validIndex = Math.max(0, Math.min(newIndex, (activeSession.content?.length || 1) - 1));
      setCurrentSlideIndex(validIndex);

      const sKey = getSessionKey(activeSession);
      const prog = sessionProgress[sKey] || {};
      if (prog.status !== "completed") {
         const updated = {
            ...sessionProgress,
            [sKey]: {
               ...prog,
               status: "started",
               lastSlideIndex: validIndex,
               answeredSlides: answeredSlides
            }
         };
         saveSessionProgress(updated);
      }
   };

   // Complete Session with full score computation
   const handleCompleteSession = () => {
      if (!activeSession) return;
      const sKey = getSessionKey(activeSession);
      const totalSlides = activeSession.content?.length || 0;

      let quizCount = 0;
      let correctCount = 0;
      let wrongCount = 0;

      activeSession.content?.forEach((slide, idx) => {
         if (slide.type === "quiz") {
            quizCount++;
            const ans = answeredSlides[idx];
            if (ans && ans.correct) {
               correctCount++;
            } else if (ans && !ans.correct) {
               wrongCount++;
            }
         }
      });

      const scorePercent = quizCount > 0 ? Math.round((correctCount / quizCount) * 100) : 100;

      const completionData = {
         status: "completed",
         completedAt: new Date().toISOString(),
         lastSlideIndex: Math.max(0, totalSlides - 1),
         answeredSlides: { ...answeredSlides },
         totalQuestions: quizCount,
         correctCount: correctCount,
         wrongCount: wrongCount,
         score: scorePercent
      };

      const updated = {
         ...sessionProgress,
         [sKey]: completionData
      };
      saveSessionProgress(updated);

      setCompletedModalSession({
         session: activeSession,
         ...completionData
      });
   };
    const [portalTab, setPortalTab] = useState("Live");
    const [activeVideo, setActiveVideo] = useState(null);
    const [liveRecordings, setLiveRecordings] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [activeAssignment, setActiveAssignment] = useState(null);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [studentAnswers, setStudentAnswers] = useState({});
    const [assignmentSubmissions, setAssignmentSubmissions] = useState({});
    const [showReferenceSheet, setShowReferenceSheet] = useState(false);
    const [isSubmittingAssignment, setIsSubmittingAssignment] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [uploadingDiagram, setUploadingDiagram] = useState(false);
    const [viewingSubmittedMode, setViewingSubmittedMode] = useState(false);
    const [referrals, setReferrals] = useState([]);
    const [copiedRefCode, setCopiedRefCode] = useState(false);
    const [copiedRefLink, setCopiedRefLink] = useState(false);
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [selectedQuizAnswer, setSelectedQuizAnswer] = useState(null);
    const [quizRevealed, setQuizRevealed] = useState(false);
    const [activeNote, setActiveNote] = useState(null);
    const [referralConfig, setReferralConfig] = useState(() => {
       try {
          return JSON.parse(localStorage.getItem("lmsReferralConfig") || '{"active":true,"rewardAmount":"Rs. 500 Discount","rewardDesc":"Earn Rs. 500 fee discount for every friend who registers and enrolls in class.","noticeSi":"ඔබගේ මිතුරන්ට Taizer LMS වෙත ආරාධනා කර පාඨමාලා ගාස්තු වට්ටම් දිනාගන්න!"}');
       } catch {
          return { active: true, rewardAmount: "Rs. 500 Discount", rewardDesc: "Earn Rs. 500 fee discount for every friend who registers and enrolls in class.", noticeSi: "ඔබගේ මිතුරන්ට Taizer LMS වෙත ආරාධනා කර පාඨමාලා ගාස්තු වට්ටම් දිනාගන්න!" };
       }
    });
    const [bankDetails, setBankDetails] = useState(() => {
       try {
          return JSON.parse(localStorage.getItem("bankDetails") || '{"bank":"Bank of Ceylon (BOC)","branch":"HOROWPOTHANA","holder":"S.S.D MADUSANKA","account":"5630207"}');
       } catch {
          return { bank: "Bank of Ceylon (BOC)", branch: "HOROWPOTHANA", holder: "S.S.D MADUSANKA", account: "5630207" };
       }
    });
    const [courseSettings, setCourseSettings] = useState(() => {
       try {
          return JSON.parse(localStorage.getItem("courseSettings") || '{"subject":"Crypto Basic","fee":"2500"}');
       } catch {
          return { subject: "Crypto Basic", fee: "2500" };
       }
    });
    const [generalSettings, setGeneralSettings] = useState(() => {
       try {
          return JSON.parse(localStorage.getItem("webGeneralSettings") || "{}");
       } catch {
          return {};
       }
    });
   const chatEndRef = useRef(null);
   const chatInputRef = useRef(null);

   const totalSessions = sessions.length;
   const completedSessions = sessions.filter(s => userProgress[s.title] === 'completed').length;
   const progressPercentage = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

   useEffect(() => {
      const handleKeyDown = (e) => {
         if (e.key === "Escape" && activeVideo) {
            setActiveVideo(null);
         }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
   }, [activeVideo]);

   useEffect(() => {
      emailjs.init("8C_YF-wTV5vHsMb2C");

      const loadUserData = async () => {
         const currentUserEmail = localStorage.getItem("currentUser");
         if (!currentUserEmail) {
            navigate("/login");
            return;
         }

         let students = [];
         try {
            students = JSON.parse(localStorage.getItem("studentRequests") || "[]");
         } catch (e) {
            students = [];
         }

         let foundUser = students.find(s => s.email?.toLowerCase() === currentUserEmail.toLowerCase());

         // Fallback 1: check activeStudent in localStorage
         if (!foundUser) {
            try {
               const active = JSON.parse(localStorage.getItem("activeStudent") || "null");
               if (active && active.email?.toLowerCase() === currentUserEmail.toLowerCase()) {
                  foundUser = active;
               }
            } catch (e) {}
         }

         // Sync latest student profile from backend MongoDB API
         try {
            const res = await fetch("http://localhost:5000/api/students");
            if (res.ok) {
               const apiStudents = await res.json();
               const freshUser = apiStudents.find(s => s.email?.toLowerCase() === currentUserEmail.toLowerCase());
               if (freshUser) {
                  foundUser = freshUser;
                  localStorage.setItem("studentRequests", JSON.stringify(apiStudents));
               }
            }
         } catch (err) {}

          if (!foundUser) {
             try {
                localStorage.removeItem("currentUser");
                localStorage.removeItem("activeStudent");
             } catch (e) {}
             navigate("/login");
             return;
          }

         setUser(foundUser);
         if (foundUser.profilePic) setProfilePic(foundUser.profilePic);
         if (foundUser.coverPhoto) setCoverPhoto(foundUser.coverPhoto);
         if (foundUser.quizResult) setAssessmentResult(foundUser.quizResult);

         const userGrade = foundUser.grade || foundUser.subject || "Crypto Basic";

         // Load Chats from API
         try {
            const res = await fetch(`http://localhost:5000/api/portal/messages?email=${encodeURIComponent(currentUserEmail)}`);
            if (res.ok) {
               const data = await res.json();
               const userMessages = data.length > 0 ? data : [{ id: 1, text: "Hello! Welcome to Taizer LMS support.", sender: "admin", time: "10:00 AM", isRead: true }];
               setMessages(userMessages);
            }
         } catch (err) {
            console.error('Failed to fetch chats:', err);
         }

         // Load Sessions strictly filtered by student's registered grade or subject from Backend API
         try {
            const res = await fetch(`http://localhost:5000/api/sessions?grade=${encodeURIComponent(userGrade)}`);
            if (res.ok) {
               const apiSessions = await res.json();
               const uGrade = (foundUser.grade || "").trim().toLowerCase();
               const uSub = (foundUser.subject || "").trim().toLowerCase();
               // Strict filter: only show sessions matching student's registered grade or subject category
               const gradeSessions = apiSessions.filter(s => {
                  if (!s.grade) return false;
                  const g = s.grade.trim().toLowerCase();
                  return (uGrade && g === uGrade) || (uSub && g === uSub);
               });
               setSessions(gradeSessions);

               // Keep local cache synced
               const cachedSessions = JSON.parse(localStorage.getItem("lmsSessions") || "{}");
               cachedSessions[userGrade] = gradeSessions;
               localStorage.setItem("lmsSessions", JSON.stringify(cachedSessions));
            } else {
               throw new Error("API sessions fetch failed");
            }
         } catch (sessionErr) {
            // Local fallback
            try {
               const savedSessions = JSON.parse(localStorage.getItem("lmsSessions") || "{}");
               let gradeSessions = [];
               const uGrade = (foundUser.grade || "").trim().toLowerCase();
               const uSub = (foundUser.subject || "").trim().toLowerCase();
               if (Array.isArray(savedSessions)) {
                  gradeSessions = savedSessions.filter(s => {
                     if (!s.grade) return false;
                     const g = s.grade.trim().toLowerCase();
                     return (uGrade && g === uGrade) || (uSub && g === uSub);
                  });
               } else if (savedSessions && typeof savedSessions === "object") {
                  const matchingKey = Object.keys(savedSessions).find(k => {
                     const lower = k.trim().toLowerCase();
                     return (uGrade && lower === uGrade) || (uSub && lower === uSub);
                  });
                  gradeSessions = matchingKey ? (savedSessions[matchingKey] || []) : [];
               }
               setSessions(gradeSessions);
            } catch (storageErr) {
               console.error("Storage sessions error:", storageErr);
            }
         }

         try {
            const allProgress = JSON.parse(localStorage.getItem("lmsProgress") || "{}");
            setUserProgress(allProgress[currentUserEmail] || {});

            const allLiveRecordings = JSON.parse(localStorage.getItem("lmsLiveRecordings") || "{}");
            setLiveRecordings(Array.isArray(allLiveRecordings[userGrade]) ? allLiveRecordings[userGrade] : []);

            const allMaterials = JSON.parse(localStorage.getItem("lmsMaterials") || "{}");
            setMaterials(Array.isArray(allMaterials[userGrade]) ? allMaterials[userGrade] : []);

            // Load Assignments with API sync and robust default fallback
            let currentGradeAssignments = [];
            try {
               const asgRes = await fetch(`http://localhost:5000/api/assignments?grade=${encodeURIComponent(userGrade)}`);
               if (asgRes.ok) {
                  const apiAsgs = await asgRes.json();
                  const filteredAsgs = apiAsgs.filter(a => !a.grade || a.grade.trim().toLowerCase() === userGrade.trim().toLowerCase());
                  if (filteredAsgs.length > 0) {
                     currentGradeAssignments = filteredAsgs;
                     const cachedAsgs = JSON.parse(localStorage.getItem("lmsAssignments") || "{}");
                     cachedAsgs[userGrade] = filteredAsgs;
                     localStorage.setItem("lmsAssignments", JSON.stringify(cachedAsgs));
                  }
               }
            } catch (asgFetchErr) {}

            if (currentGradeAssignments.length === 0) {
               const allAssignments = JSON.parse(localStorage.getItem("lmsAssignments") || "{}");
               currentGradeAssignments = allAssignments[userGrade] || [];
            }
            setAssignments(currentGradeAssignments);

            // Load Student Submissions
            try {
               const subRes = await fetch(`http://localhost:5000/api/submissions?studentEmail=${encodeURIComponent(currentUserEmail)}`);
               if (subRes.ok) {
                  const apiSubs = await subRes.json();
                  const subMap = {};
                  apiSubs.forEach(s => {
                     subMap[s.assignmentId] = s;
                     if (s.assignmentTitle) subMap[s.assignmentTitle] = s;
                  });
                  setAssignmentSubmissions(subMap);
               } else {
                  const savedSubs = JSON.parse(localStorage.getItem("lmsSubmissions") || "[]");
                  const subMap = {};
                  savedSubs.filter(s => s.studentEmail === currentUserEmail).forEach(s => {
                     subMap[s.assignmentId] = s;
                     if (s.assignmentTitle) subMap[s.assignmentTitle] = s;
                  });
                  setAssignmentSubmissions(subMap);
               }
            } catch (subErr) {
               const savedSubs = JSON.parse(localStorage.getItem("lmsSubmissions") || "[]");
               const subMap = {};
               savedSubs.filter(s => s.studentEmail === currentUserEmail).forEach(s => {
                  subMap[s.assignmentId] = s;
                  if (s.assignmentTitle) subMap[s.assignmentTitle] = s;
               });
               setAssignmentSubmissions(subMap);
            }

            let allReferrals = {};
            try {
               const rawRef = JSON.parse(localStorage.getItem("lmsReferrals") || "{}");
               allReferrals = rawRef && typeof rawRef === "object" ? rawRef : {};
            } catch (e) {
               allReferrals = {};
            }
            setReferrals(Array.isArray(allReferrals[userGrade]) ? allReferrals[userGrade] : []);

            let allZoomSettings = {};
            try {
               const rawZoom = JSON.parse(localStorage.getItem("zoomSettings") || "{}");
               allZoomSettings = rawZoom && typeof rawZoom === "object" ? rawZoom : {};
            } catch (e) {
               allZoomSettings = {};
            }
            if (allZoomSettings[userGrade]) {
               setZoomData(allZoomSettings[userGrade]);
            } else {
               setZoomData({ link: "", time: "" });
            }

            // Sync latest settings from backend if available
            try {
               const settingsRes = await fetch("http://localhost:5000/api/settings");
               if (settingsRes.ok) {
                  const allSettings = await settingsRes.json();
                  allSettings.forEach((s) => {
                     if (s.type === "zoomSettings" && s.data) {
                        try { localStorage.setItem("zoomSettings", JSON.stringify(s.data)); } catch (e) {}
                        setZoomData(s.data[userGrade] || { link: "", time: "" });
                     }
                     if (s.type === "lmsReferralConfig" && s.data) {
                        try { localStorage.setItem("lmsReferralConfig", JSON.stringify(s.data)); } catch (e) {}
                        setReferralConfig(s.data);
                     }
                     if (s.type === "lmsReferrals" && s.data) {
                        try { localStorage.setItem("lmsReferrals", JSON.stringify(s.data)); } catch (e) {}
                        if (Array.isArray(s.data[userGrade])) {
                           setReferrals(s.data[userGrade]);
                        }
                     }
                     if (s.type === "lmsLiveRecordings" && s.data) {
                        try { localStorage.setItem("lmsLiveRecordings", JSON.stringify(s.data)); } catch (e) {}
                        if (Array.isArray(s.data[userGrade])) {
                           setLiveRecordings(s.data[userGrade]);
                        }
                     }
                     if (s.type === "lmsMaterials" && s.data) {
                        try { localStorage.setItem("lmsMaterials", JSON.stringify(s.data)); } catch (e) {}
                        if (Array.isArray(s.data[userGrade])) {
                           setMaterials(s.data[userGrade]);
                        }
                     }
                     if (s.type === "bankDetails" && s.data) {
                        try { localStorage.setItem("bankDetails", JSON.stringify(s.data)); } catch (e) {}
                        setBankDetails(s.data);
                     }
                     if (s.type === "courseSettings" && s.data) {
                        try { localStorage.setItem("courseSettings", JSON.stringify(s.data)); } catch (e) {}
                        setCourseSettings(s.data);
                     }
                     if (s.type === "webGeneralSettings" && s.data) {
                        try { localStorage.setItem("webGeneralSettings", JSON.stringify(s.data)); } catch (e) {}
                        setGeneralSettings(s.data);
                     }
                     if (s.type === "webHomeSettings" && s.data?.branding) {
                        try { localStorage.setItem("webHomeSettings", JSON.stringify(s.data)); } catch (e) {}
                        setBranding(s.data.branding);
                     }
                  });
               }
            } catch (zErr) {}

            // Prefetch Questions strictly for student's registered grade
            try {
               const qsRes = await fetch(`http://localhost:5000/api/questions?grade=${encodeURIComponent(userGrade)}`);
               if (qsRes.ok) {
                  const apiQs = await qsRes.json();
                  const filteredQs = apiQs.filter(q => q.grade && q.grade.trim().toLowerCase() === userGrade.trim().toLowerCase());
                  const cachedQs = JSON.parse(localStorage.getItem("lmsQuestions") || "{}");
                  cachedQs[userGrade] = filteredQs;
                  localStorage.setItem("lmsQuestions", JSON.stringify(cachedQs));
               }
            } catch (qErr) {}
         } catch (err) {
            console.error('Data parsing error in LMS:', err);
         }
      };

      loadUserData();
      const interval = setInterval(loadUserData, 2000);

      const handleStorageChange = (e) => {
         if (
            !e ||
            !e.key ||
            [
               "lmsChats",
               "studentRequests",
               "lmsSessions",
               "lmsQuestions",
               "zoomSettings",
               "lmsReferralConfig",
               "lmsReferrals",
               "lmsLiveRecordings",
               "lmsMaterials",
               "bankDetails",
               "courseSettings",
               "webGeneralSettings",
               "webHomeSettings"
            ].includes(e.key)
         ) {
            loadUserData();
            try {
               const savedRefCfg = JSON.parse(localStorage.getItem("lmsReferralConfig") || "null");
               if (savedRefCfg) setReferralConfig(savedRefCfg);
               const savedBank = JSON.parse(localStorage.getItem("bankDetails") || "null");
               if (savedBank) setBankDetails(savedBank);
               const savedCourse = JSON.parse(localStorage.getItem("courseSettings") || "null");
               if (savedCourse) setCourseSettings(savedCourse);
               const savedGeneral = JSON.parse(localStorage.getItem("webGeneralSettings") || "null");
               if (savedGeneral) setGeneralSettings(savedGeneral);
               const home = JSON.parse(localStorage.getItem("webHomeSettings") || "{}");
               if (home?.branding) setBranding(home.branding);
            } catch {}
         }
      };

      window.addEventListener("storage", handleStorageChange);

      return () => {
         clearInterval(interval);
         window.removeEventListener("storage", handleStorageChange);
      };
   }, [navigate]);

   const renderContent = (text) => {
      if (!text) return null;
      return text.split('\n').map((line, i) => {
         if (!line.trim()) return <br key={i} />;

         let isH1 = false;
         let isH2 = false;
         let isBullet = false;

         if (line.startsWith('[h1]')) {
            isH1 = true;
            line = line.replace('[h1]', '');
         } else if (line.startsWith('[h2]')) {
            isH2 = true;
            line = line.replace('[h2]', '');
         } else if (line.startsWith('# ')) {
            isH1 = true;
            line = line.replace('# ', '');
         }

         if (line.trim().startsWith('•') || line.trim().startsWith('- ')) {
            isBullet = true;
            line = line.replace(/^[\s]*[•-][\s]*/, '');
         }

         if (line.trim() === '---') {
            return <div key={i} className="h-px w-full bg-gradient-to-r from-[#2dd4bf]/40 via-slate-800 to-transparent my-6" />;
         }

         const parts = [];
         let lastIdx = 0;
         const combinedRegex = /(\*\*.*?\*\*|\[i\].*?\[\/i\]|\[si\].*?\[\/si\]|\[img\].*?\[\/img\]|\[color=(#?[a-zA-Z0-9]+)\].*?\[\/color\]|\[grad\].*?\[\/grad\])/g;

         let match;
         while ((match = combinedRegex.exec(line)) !== null) {
            if (match.index > lastIdx) parts.push(line.substring(lastIdx, match.index));

            const tag = match[0];
            if (tag.startsWith('**')) {
               parts.push(<b key={match.index} className="text-[#2dd4bf] font-black">{tag.slice(2, -2)}</b>);
            } else if (tag.startsWith('[i]')) {
               parts.push(<em key={match.index} className="italic text-slate-300 font-serif">{tag.slice(3, -4)}</em>);
            } else if (tag.startsWith('[si]')) {
               parts.push(<span key={match.index} className="block text-[11px] font-bold text-slate-500 mt-1 italic">{tag.slice(4, -5)}</span>);
            } else if (tag.startsWith('[img]')) {
               parts.push(<img key={match.index} src={tag.slice(5, -6)} alt="Content" className="my-6 rounded-3xl border border-white/10 shadow-2xl max-h-64 object-cover" />);
            } else if (tag.startsWith('[color=')) {
               const colorMatch = tag.match(/\[color=(#?[a-zA-Z0-9]+)\](.*?)\[\/color\]/);
               if (colorMatch) {
                  parts.push(<span key={match.index} style={{ color: colorMatch[1] }} className="font-bold">{colorMatch[2]}</span>);
               }
            } else if (tag.startsWith('[grad]')) {
               parts.push(<span key={match.index} className="font-black bg-gradient-to-r from-[#2dd4bf] to-blue-500 bg-clip-text text-transparent italic">{tag.slice(6, -7)}</span>);
            }
            lastIdx = combinedRegex.lastIndex;
         }
         if (lastIdx < line.length) parts.push(line.substring(lastIdx));

         const content = parts.length > 0 ? parts : line;

         if (isH1) {
            return (
               <div key={i} className="mt-10 mb-8">
                  <h1 className="text-3xl font-black text-white tracking-tight">{content}</h1>
                  <div className="h-1.5 w-24 bg-gradient-to-r from-[#2dd4bf] to-transparent mt-3 rounded-full"></div>
               </div>
            );
         }
         if (isH2) {
            return (
               <div key={i} className="mt-8 mb-6">
                  <h2 className="text-xl font-black text-slate-200 tracking-tight">{content}</h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-transparent mt-2 rounded-full"></div>
               </div>
            );
         }
         if (isBullet) {
            return (
               <div key={i} className="flex gap-4 items-start mb-4 pl-2">
                  <span className="w-2 h-2 bg-[#2dd4bf] rounded-full mt-2.5 shrink-0 shadow-[0_0_10px_#2dd4bf]"></span>
                  <span className="text-slate-300 font-medium leading-relaxed">{content}</span>
               </div>
            );
         }

         return <p key={i} className="mb-4 leading-relaxed text-slate-300">{content}</p>;
      });
   };

   useEffect(() => {
      const handleKeyDown = (e) => {
         if (!activeSession) return;
         if (e.key === "ArrowRight") {
            if (currentSlideIndex < (activeSession.content?.length || 0) - 1) {
               handleSlideChange(currentSlideIndex + 1);
            } else if (currentSlideIndex === (activeSession.content?.length || 0) - 1) {
               handleCompleteSession();
            }
         } else if (e.key === "ArrowLeft") {
            handleSlideChange(Math.max(0, currentSlideIndex - 1));
         } else if (e.key === "Escape") {
            setActiveSession(null);
         }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
   }, [activeSession, currentSlideIndex, answeredSlides, sessionProgress]);

   // --- ONLINE ASSIGNMENTS ACTIONS ---
   const handleOpenAssignment = (assignment) => {
      if (assignment.locked) {
         showNotification("Locked 🔒", "මෙම පැවරුම තවමත් අගුළුලා ඇත.", "info");
         return;
      }

      const assignmentKey = assignment.id || assignment.title;
      const existingSub = assignmentSubmissions[assignmentKey] || assignmentSubmissions[assignment.title];

      if (existingSub) {
         setActiveAssignment(assignment);
         setCurrentTaskIndex(0);
         setStudentAnswers(existingSub.answers || {});
         setViewingSubmittedMode(true);
      } else {
         const allDrafts = JSON.parse(localStorage.getItem("lmsAssignmentDrafts") || "{}");
         const savedDraft = allDrafts[user?.email]?.[assignmentKey] || {};
         setActiveAssignment(assignment);
         setCurrentTaskIndex(0);
         setStudentAnswers(savedDraft);
         setViewingSubmittedMode(false);
      }
   };

   const handleAnswerChange = (taskIndex, val) => {
      if (viewingSubmittedMode) {
         setViewingSubmittedMode(false);
      }
      setStudentAnswers(prev => ({ ...(prev || {}), [taskIndex]: val }));

      try {
         if (activeAssignment) {
            const assignmentKey = activeAssignment.id || activeAssignment.title;
            const emailKey = user?.email || localStorage.getItem("currentUser") || "student";
            let allDrafts = {};
            try {
               const rawDrafts = JSON.parse(localStorage.getItem("lmsAssignmentDrafts") || "{}");
               allDrafts = rawDrafts && typeof rawDrafts === "object" ? rawDrafts : {};
            } catch {
               allDrafts = {};
            }
            if (!allDrafts[emailKey] || typeof allDrafts[emailKey] !== "object") {
               allDrafts[emailKey] = {};
            }
            allDrafts[emailKey][assignmentKey] = {
               ...(allDrafts[emailKey][assignmentKey] || {}),
               [taskIndex]: val
            };
            try {
               localStorage.setItem("lmsAssignmentDrafts", JSON.stringify(allDrafts));
            } catch (quotaErr) {
               console.warn("Storage quota warning for assignment drafts:", quotaErr);
            }
         }
      } catch (draftErr) {
         console.warn("Draft auto-save warning:", draftErr);
      }
   };

   const handleDiagramUpload = async (e, taskIndex) => {
      if (viewingSubmittedMode) {
         setViewingSubmittedMode(false);
      }
      const file = e.target.files?.[0];
      if (!file) return;

      setUploadingDiagram(true);
      try {
         // Compress diagram photo to lightweight retina format (<100KB)
         const compressedDataUrl = await compressImageFile(file, {
            maxWidth: 1600,
            maxHeight: 1600,
            quality: 0.8
         });

         // Try uploading to server disk with quick 4s timeout
         try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);
            const res = await fetch("http://localhost:5000/api/upload-file", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({
                  fileData: compressedDataUrl,
                  fileName: file.name,
                  fileType: file.type
               }),
               signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (res.ok) {
               const data = await res.json();
               handleAnswerChange(taskIndex, data.url || compressedDataUrl);
               return;
            }
         } catch (uploadErr) {
            console.warn("Upload-file server fallback:", uploadErr.message);
         }

         // Fallback to optimized compressed data URL
         handleAnswerChange(taskIndex, compressedDataUrl);
      } catch (err) {
         console.warn("Compression fallback:", err);
         const reader = new FileReader();
         reader.onload = (event) => {
            handleAnswerChange(taskIndex, event.target.result);
         };
         reader.readAsDataURL(file);
      } finally {
         setUploadingDiagram(false);
      }
   };

   const handleSubmitAssignment = async () => {
      if (!activeAssignment) return;
      setIsSubmittingAssignment(true);

      try {
         const assignmentKey = activeAssignment.id || activeAssignment._id || activeAssignment.title;

         // Auto-evaluate coding tasks and calculate auto-scores
         let totalAutoMarks = 0;
         let hasManualGradingTasks = false;
         const taskScores = {};
         const autoTestResults = {};

         if (activeAssignment.tasks && Array.isArray(activeAssignment.tasks)) {
            activeAssignment.tasks.forEach((task, tIdx) => {
               const taskPoints = Number(task.points || 10);
               if (task.type === "code") {
                  const codeAns = studentAnswers[tIdx] || { html: "", css: "", js: "" };
                  const evaluation = evaluateWebCode(codeAns, task.testRules || []);
                  taskScores[tIdx] = evaluation.score;
                  totalAutoMarks += evaluation.score;
                  autoTestResults[tIdx] = evaluation.testResults;
               } else if (task.type === "mcq") {
                  if (studentAnswers[tIdx] !== undefined && task.correctOption !== undefined) {
                     const isCorrect = Number(studentAnswers[tIdx]) === Number(task.correctOption);
                     const earned = isCorrect ? taskPoints : 0;
                     taskScores[tIdx] = earned;
                     totalAutoMarks += earned;
                  } else {
                     taskScores[tIdx] = 0;
                  }
               } else {
                  hasManualGradingTasks = true;
               }
            });
         }

         const submissionData = {
            assignmentId: assignmentKey,
            assignmentTitle: activeAssignment.title,
            studentEmail: user?.email,
            studentName: user?.name,
            studentId: user?.studentId || user?.id || "STU-" + (user?.name || "STUDENT").slice(0, 3).toUpperCase(),
            grade: user?.grade || user?.subject || "Crypto Basic",
            subject: user?.subject || user?.grade || "Crypto Basic",
            answers: studentAnswers,
            taskScores,
            autoTestResults,
            score: hasManualGradingTasks ? undefined : totalAutoMarks,
            submittedAt: new Date().toISOString(),
            status: hasManualGradingTasks ? "Submitted" : "Graded"
         };

         // 1. FAST TIMED BACKEND FETCH (AbortController with 4.5s timeout so it never hangs)
         try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4500);
            await fetch("http://localhost:5000/api/submissions", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(submissionData),
               signal: controller.signal
            });
            clearTimeout(timeoutId);
         } catch (err) {
            console.warn("Backend submission fallback:", err.message);
         }

         // 2. SAFE LOCALSTORAGE SAVE (Protected against QuotaExceededError)
         try {
            const allSubs = JSON.parse(localStorage.getItem("lmsSubmissions") || "[]");
            const existingIdx = allSubs.findIndex(
               s => (s.assignmentId === assignmentKey || s.assignmentTitle === activeAssignment.title) && s.studentEmail === user?.email
            );
            if (existingIdx !== -1) {
               allSubs[existingIdx] = submissionData;
            } else {
               allSubs.push(submissionData);
            }
            localStorage.setItem("lmsSubmissions", JSON.stringify(allSubs));
         } catch (storageErr) {
            console.warn("LocalStorage save warning:", storageErr.message);
            // Fallback: save lightweight record without massive base64 strings
            try {
               const lightSubmission = {
                  ...submissionData,
                  answers: Object.fromEntries(
                     Object.entries(submissionData.answers || {}).map(([k, v]) => [
                        k,
                        typeof v === "string" && v.length > 50000 ? v.slice(0, 100) + "...[diagram stored]" : v
                     ])
                  )
               };
               localStorage.setItem("lmsSubmissions", JSON.stringify([lightSubmission]));
            } catch (e) {}
         }

         // 3. UPDATE STATE IMMEDIATELY
         setAssignmentSubmissions(prev => ({
            ...prev,
            [assignmentKey]: submissionData
         }));

         // 4. CLEAR DRAFT SAFELY
         try {
            const allDrafts = JSON.parse(localStorage.getItem("lmsAssignmentDrafts") || "{}");
            if (allDrafts[user?.email]) {
               delete allDrafts[user?.email][assignmentKey];
               localStorage.setItem("lmsAssignmentDrafts", JSON.stringify(allDrafts));
            }
         } catch (e) {}

         setViewingSubmittedMode(true);
         if (showNotification) {
            showNotification("Submitted! 🎯", "ඔබගේ පැවරුම සාර්ථකව භාරදෙන ලදී. ගුරුවරයා විසින් පරීක්ෂා කර ලකුණු ලබාදෙනු ඇත.", "success");
         }
      } catch (mainErr) {
         console.error("Submission processing error:", mainErr);
         if (showNotification) {
            showNotification("Submitted! 🎯", "ඔබගේ පැවරුම සාර්ථකව භාරදෙන ලදී.", "success");
         }
      } finally {
         // GUARANTEED TO RUN IMMEDIATELY: Closes modal and resets button state!
         setIsSubmittingAssignment(false);
         setShowSubmitModal(false);
      }
   };

   useEffect(() => {
      localStorage.setItem("lastActiveNav", activeNav);
   }, [activeNav]);

   useEffect(() => {
      const handleStorageChange = () => {
         const updatedUser = JSON.parse(localStorage.getItem("activeStudent") || "{}");
         setUser(updatedUser);
      };
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
   }, []);

   const showNotification = (title, message, type = "success") => {
      setAlert({ title, message, type });
   };

   const formatTime = (timeStr) => {
      if (!timeStr) return "";
      const [hour, minute] = timeStr.split(':');
      const h = parseInt(hour);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      return `${h12}:${minute} ${ampm}`;
   };

   const handleReceiptUpload = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
         if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
            if (file.size > 5 * 1024 * 1024) {
               showNotification("File Too Large", "PDF file size must be less than 5MB.", "error");
               return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
               setReceiptImage(event.target.result);
               showNotification("PDF Selected", "PDF receipt loaded. Click 'Submit Receipt' to confirm.", "success");
            };
            reader.onerror = () => {
               showNotification("Error", "Failed to read PDF file.", "error");
            };
            reader.readAsDataURL(file);
         } else {
            // Compress image down to max 900x900 at 0.72 quality for fast, reliable storage and upload
            const compressed = await compressImageFile(file, {
               maxWidth: 900,
               maxHeight: 900,
               quality: 0.72
            });
            setReceiptImage(compressed);
            showNotification("Image Selected", "Receipt image loaded. Click 'Submit Receipt' to confirm.", "success");
         }
      } catch (err) {
         console.error("Receipt compression error:", err);
         showNotification("Error", "Could not process this file. Please choose another image.", "error");
      }
   };

   // Resilient sync helper to persist any student attribute changes to MongoDB Atlas
   const syncStudentToBackend = async (updates) => {
      if (!user) return;
      const targetId = user._id || user.studentId || user.id || user.email;
      if (!targetId) return;
      const payload = { ...updates, email: user.email };
      try {
         await fetch(`http://localhost:5000/api/students/${encodeURIComponent(targetId)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
         });
      } catch (err) {
         console.warn("Student backend sync fallback:", err);
      }
   };

   const submitPayment = async () => {
      if (!receiptImage) {
         showNotification("Warning", "කරුණාකර ගෙවීම් රිසිට්පත තෝරන්න / Please select a receipt image or PDF.", "error");
         return;
      }
      setIsUploading(true);
      try {
         const now = new Date();
         const paymentDate = now.toLocaleDateString() + " " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
         
         // 1. Update localStorage
         let students = [];
         try {
            students = JSON.parse(localStorage.getItem("studentRequests") || "[]");
         } catch (e) {
            students = [];
         }

         const updated = students.map(s => 
            (s.email?.toLowerCase() === user.email?.toLowerCase() || (user.id && s.id === user.id))
               ? { ...s, paymentStatus: "Uploaded", receiptImage: receiptImage, receiptUrl: receiptImage, paymentDate: paymentDate }
               : s
         );

         try {
            localStorage.setItem("studentRequests", JSON.stringify(updated));
         } catch (storageErr) {
            console.warn("Storage quota warning on studentRequests:", storageErr);
         }

         const updatedUser = { 
            ...user, 
            paymentStatus: "Uploaded", 
            receiptImage: receiptImage, 
            receiptUrl: receiptImage, 
            paymentDate: paymentDate 
         };

         try {
            localStorage.setItem("activeStudent", JSON.stringify(updatedUser));
         } catch (e) {}

         // 2. Synchronize to Backend MongoDB API
         try {
            await syncStudentToBackend({
               paymentStatus: "Uploaded",
               receiptUrl: receiptImage,
               receiptImage: receiptImage,
               paymentDate: paymentDate
            });
            await fetch("http://localhost:5000/api/students/bulk", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(updated)
            });
         } catch (apiErr) {
            console.warn("Backend student sync notice:", apiErr);
         }

         // 3. Update React state & notify user
         setUser(updatedUser);
         window.dispatchEvent(new Event("storage"));
         showNotification(
            "Success", 
            "ගෙවීම් රිසිට්පත සාර්ථකව යවන ලදී! Admin විසින් අනුමත කළ පසු LMS විවෘත වනු ඇත. / Receipt uploaded successfully!", 
            "success"
         );
      } catch (err) {
         console.error("submitPayment error:", err);
         showNotification("Error", "රිසිට්පත යැවීමේදී දෝෂයක් ඇති විය. කරුණාකර නැවත උත්සාහ කරන්න.", "error");
      } finally {
         setIsUploading(false);
      }
   };

   const startAssessment = async () => {
      const userGrade = user?.grade || user?.subject || "Crypto Basic";
      let gradeQuestions = [];
      try {
         const res = await fetch(`http://localhost:5000/api/questions?grade=${encodeURIComponent(userGrade)}`);
         if (res.ok) {
            const apiQuestions = await res.json();
            // Strict filter: only questions matching student's registered grade
            gradeQuestions = apiQuestions.filter(q => q.grade && q.grade.trim().toLowerCase() === userGrade.trim().toLowerCase());
            
            // Sync to local cache
            const allCached = JSON.parse(localStorage.getItem("lmsQuestions") || "{}");
            allCached[userGrade] = gradeQuestions;
            localStorage.setItem("lmsQuestions", JSON.stringify(allCached));
         } else {
            throw new Error("Questions fetch failed");
         }
      } catch (err) {
         // Local fallback
         const allQuestions = JSON.parse(localStorage.getItem("lmsQuestions") || "{}");
         if (Array.isArray(allQuestions)) {
            gradeQuestions = allQuestions.filter(q => q.grade?.trim().toLowerCase() === userGrade.trim().toLowerCase());
         } else if (allQuestions && typeof allQuestions === "object") {
            const matchingKey = Object.keys(allQuestions).find(k => k.trim().toLowerCase() === userGrade.trim().toLowerCase());
            gradeQuestions = matchingKey ? (allQuestions[matchingKey] || []) : [];
         }
      }

      if (gradeQuestions.length === 0) {
         showNotification("Notice", `No assessment questions published for ${userGrade} yet.`, "info");
         return;
      }
      setAssessmentQuestions(gradeQuestions);
      setIsAssessmentOpen(true);
      setCurrentQuizIndex(0);
      setQuizAnswers([]);
   };

   const handleQuizAnswer = (optionIndex) => {
      const updatedAnswers = [...quizAnswers, optionIndex];
      if (currentQuizIndex < assessmentQuestions.length - 1) {
         setQuizAnswers(updatedAnswers);
         setCurrentQuizIndex(currentQuizIndex + 1);
      } else {
         let correctCount = 0;
         const categoryScores = {};
         assessmentQuestions.forEach((q, idx) => {
            const isCorrect = updatedAnswers[idx] === q.correctIndex;
            if (isCorrect) correctCount++;
            if (!categoryScores[q.category]) categoryScores[q.category] = { correct: 0, total: 0 };
            categoryScores[q.category].total++;
            if (isCorrect) categoryScores[q.category].correct++;
         });
         const percentage = Math.round((correctCount / assessmentQuestions.length) * 100);
         const result = { percentage, categories: Object.keys(categoryScores).map(cat => ({ label: cat, value: Math.round((categoryScores[cat].correct / categoryScores[cat].total) * 100) + "%" })) };
         setAssessmentResult(result);
         setIsAssessmentOpen(false);
         const students = JSON.parse(localStorage.getItem("studentRequests") || "[]");
         localStorage.setItem("studentRequests", JSON.stringify(students.map(s => s.email === user.email ? { ...s, quizResult: result } : s)));
         const updatedUser = { ...user, quizResult: result };
         setUser(updatedUser);
         try {
            localStorage.setItem("activeStudent", JSON.stringify(updatedUser));
         } catch (e) {}
         syncStudentToBackend({ quizResult: result });
      }
   };

   const handleLogout = () => {
      localStorage.removeItem("currentUser");
      navigate("/");
   };

   const handleSendMessage = async (e, attachment = null) => {
      if (e) e.preventDefault();
      if (!chatText && !attachment) return;

      const sentText = chatText;
      const sentAttachment = attachment;
      const newMessage = {
         id: Date.now(),
         text: sentText,
         attachment: sentAttachment,
         sender: "student",
         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
         timestamp: new Date().toISOString(),
         isRead: false
      };

      // 1. Save to LocalStorage (for instant UI update)
      const allChats = JSON.parse(localStorage.getItem("lmsChats") || "{}");
      const userChats = [...(allChats[user.email] || []), newMessage];
      const updatedChats = { ...allChats, [user.email]: userChats };
      localStorage.setItem("lmsChats", JSON.stringify(updatedChats));
      setMessages(userChats);
      setChatText("");
      setIsEmojiOpen(false);

      // 2. Send to Backend (so Admin can see it in real-time)
      try {
         await fetch('http://localhost:5000/api/portal/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               studentEmail: user.email,
               studentName: user.name,
               text: sentText || (sentAttachment ? `[File: ${sentAttachment.name}]` : ""),
               attachment: sentAttachment,
               sender: "student"
            })
         });
         fetchPortalMessages();
      } catch (err) {
         console.error('Failed to send message to server:', err);
      }

      chatInputRef.current?.focus();
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
   };

   const fetchPortalMessages = async () => {
      const currentUserEmail = localStorage.getItem("currentUser") || user?.email;
      if (!currentUserEmail) return;
      try {
         const res = await fetch(`http://localhost:5000/api/portal/messages?email=${encodeURIComponent(currentUserEmail)}`);
         if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
               setMessages(data);
               try {
                  const allChats = JSON.parse(localStorage.getItem("lmsChats") || "{}");
                  allChats[currentUserEmail] = data;
                  localStorage.setItem("lmsChats", JSON.stringify(allChats));
               } catch (e) {}
            }
         }
      } catch (err) {
         console.error('Portal messages fetch error:', err);
      }
   };

   const markAdminAsRead = async () => {
      const currentUserEmail = localStorage.getItem("currentUser") || user?.email;
      if (!currentUserEmail) return;

      // Optimistic update: Mark locally first
      setMessages(prev => prev.map(m => 
         m.sender === "admin" ? { ...m, isRead: true } : m
      ));

      try {
         await fetch(`http://localhost:5000/api/portal/messages/read-admin/${encodeURIComponent(currentUserEmail)}`, { method: 'PUT' });
      } catch (err) {
         console.error('Failed to mark admin as read:', err);
      }
   };

   const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
         showNotification("File too large", "Maximum file size is 2MB.", "error");
         return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
         const type = file.type.startsWith("image/") ? "image" : "file";
         handleSendMessage(null, { type, data: reader.result, name: file.name });
      };
      reader.readAsDataURL(file);
   };

   useEffect(() => {
      if (isChatOpen) {
         fetchPortalMessages();
         markAdminAsRead();
         const chatPollInterval = setInterval(() => {
            fetchPortalMessages();
         }, 3500);
         chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
         return () => clearInterval(chatPollInterval);
      }
   }, [isChatOpen]);

   const [editedName, setEditedName] = useState("");
   const [editedPhone, setEditedPhone] = useState("");
   const [newEmail, setNewEmail] = useState("");
   const [passData, setPassData] = useState({ current: "", new: "", confirm: "" });
   const [isOtpSent, setIsOtpSent] = useState(false);
   const [otpInput, setOtpInput] = useState("");
   const [generatedOtp, setGeneratedOtp] = useState("");
   const [isVerifying, setIsVerifying] = useState(false);

   const [isPassOtpSent, setIsPassOtpSent] = useState(false);
   const [passOtpInput, setPassOtpInput] = useState("");
   const [generatedPassOtp, setGeneratedPassOtp] = useState("");
   const [isPassVerifying, setIsPassVerifying] = useState(false);

   useEffect(() => {
      if (user) {
         setEditedName(user.name);
         setEditedPhone(user.phone || "");
      }
   }, [user?.email]);

   const handleSaveChanges = async () => {
      if (!editedName.trim() || !editedPhone.trim()) {
         showNotification("Error", "Name and Phone cannot be empty.", "error");
         return;
      }
      const students = JSON.parse(localStorage.getItem("studentRequests") || "[]");
      const updated = students.map(s => s.email === user.email ? { ...s, name: editedName, phone: editedPhone } : s);
      localStorage.setItem("studentRequests", JSON.stringify(updated));
      const updatedUser = { ...user, name: editedName, phone: editedPhone };
      setUser(updatedUser);
      try {
         localStorage.setItem("activeStudent", JSON.stringify(updatedUser));
      } catch (e) {}
      await syncStudentToBackend({ name: editedName, phone: editedPhone });
      window.dispatchEvent(new Event("storage"));
      showNotification("Success", "Profile details updated successfully.", "success");
   };

   const handleCoverUpload = async (e) => {
      const file = e.target.files?.[0];
      if (file) {
         try {
            const compressed = await compressImageFile(file, {
               maxWidth: 1400,
               maxHeight: 600,
               quality: 0.82
            });
            setCoverPhoto(compressed);
            let students = [];
            try {
               students = JSON.parse(localStorage.getItem("studentRequests") || "[]");
            } catch (err) {
               students = [];
            }
            const updated = students.map(s =>
               (s.email?.toLowerCase() === user.email?.toLowerCase() || (user.id && s.id === user.id))
                  ? { ...s, coverPhoto: compressed }
                  : s
            );
            try {
               localStorage.setItem("studentRequests", JSON.stringify(updated));
            } catch (err) {
               console.warn("Storage warning:", err);
            }
            const updatedUser = { ...user, coverPhoto: compressed };
            try {
               localStorage.setItem("activeStudent", JSON.stringify(updatedUser));
            } catch (e) {}
            setUser(updatedUser);
            await syncStudentToBackend({ coverPhoto: compressed });
            showNotification("Cover Updated", "Cover banner updated successfully.", "success");
         } catch (err) {
            console.error("Cover upload error:", err);
            showNotification("Error", "Failed to update cover photo.", "error");
         }
      }
   };

   const handleProfilePicUpload = async (file) => {
      if (!file) return;
      try {
         const compressed = await compressImageFile(file, {
            maxWidth: 500,
            maxHeight: 500,
            quality: 0.82
         });
         setProfilePic(compressed);
         let students = [];
         try {
            students = JSON.parse(localStorage.getItem("studentRequests") || "[]");
         } catch (err) {
            students = [];
         }
         const updated = students.map(s => s.email === user.email ? { ...s, profilePic: compressed } : s);
         try {
            localStorage.setItem("studentRequests", JSON.stringify(updated));
         } catch (err) {
            console.warn("Storage warning:", err);
         }
         const updatedUser = { ...user, profilePic: compressed };
         setUser(updatedUser);
         try {
            localStorage.setItem("activeStudent", JSON.stringify(updatedUser));
         } catch (e) {}
         await syncStudentToBackend({ profilePic: compressed });
         window.dispatchEvent(new Event("storage"));
         showNotification("Updated", "Profile picture changed successfully.", "success");
      } catch (err) {
         showNotification("Error", "Failed to update profile picture.", "error");
      }
   };

   const handleChangePassword = () => {
      if (passData.current !== user.password) {
         showNotification("Error", "Current password is incorrect.", "error");
         return;
      }
      if (passData.new !== passData.confirm) {
         showNotification("Error", "Passwords do not match.", "error");
         return;
      }
      if (passData.new.length < 6) {
         showNotification("Error", "Password must be at least 6 characters.", "error");
         return;
      }

      setIsPassVerifying(true);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedPassOtp(otp);

      const templateParams = {
         to_name: user.name,
         to_email: user.email,
         otp_code: otp
      };

      emailjs.send(
         "service_88gdr5n",
         "template_3egpqkr",
         templateParams
      ).then(() => {
         setIsPassOtpSent(true);
         setIsPassVerifying(false);
         showNotification("OTP Sent", "A verification code has been sent to your email.", "success");
      }).catch((err) => {
         setIsPassVerifying(false);
         showNotification("Failed", "Error: " + (err.text || "Check EmailJS setup"), "error");
      });
   };

   const handleVerifyPasswordChange = async () => {
      if (passOtpInput === generatedPassOtp) {
         const students = JSON.parse(localStorage.getItem("studentRequests") || "[]");
         const updated = students.map(s => s.email === user.email ? { ...s, password: passData.new } : s);
         localStorage.setItem("studentRequests", JSON.stringify(updated));
         const updatedUser = { ...user, password: passData.new };
         setUser(updatedUser);
         try {
            localStorage.setItem("activeStudent", JSON.stringify(updatedUser));
         } catch (e) {}
         await syncStudentToBackend({ password: passData.new });
         setIsPassOtpSent(false);
         setPassData({ current: "", new: "", confirm: "" });
         setPassOtpInput("");
         showNotification("Success", "Password updated successfully.", "success");
      } else {
         showNotification("Invalid OTP", "The code you entered is incorrect.", "error");
      }
   };

   const handleSendOTP = () => {
      if (!newEmail.includes("@")) {
         showNotification("Invalid Email", "Please enter a valid email address.", "error");
         return;
      }

      setIsVerifying(true);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);

      const templateParams = {
         to_name: user.name,
         to_email: newEmail,
         otp_code: otp
      };

      emailjs.send(
         "service_88gdr5n",
         "template_3egpqkr",
         templateParams
      ).then(() => {
         setIsOtpSent(true);
         setIsVerifying(false);
         showNotification("OTP Sent", "Verification code sent to " + newEmail, "success");
      }).catch((err) => {
         setIsVerifying(false);
         showNotification("Failed", "Error: " + (err.text || "Check EmailJS setup"), "error");
         console.error("EmailJS Error:", err);
      });
   };

   const handleVerifyOTP = async () => {
      if (otpInput === generatedOtp) {
         const oldEmail = user.email;
         const students = JSON.parse(localStorage.getItem("studentRequests") || "[]");
         const updated = students.map(s => s.email === oldEmail ? { ...s, email: newEmail } : s);
         localStorage.setItem("studentRequests", JSON.stringify(updated));
         localStorage.setItem("currentUser", newEmail); // Update session
         const updatedUser = { ...user, email: newEmail };
         setUser(updatedUser);
         try {
            localStorage.setItem("activeStudent", JSON.stringify(updatedUser));
         } catch (e) {}
         await syncStudentToBackend({ email: newEmail });
         setIsOtpSent(false);
         setNewEmail("");
         setOtpInput("");
         showNotification("Email Updated", "Your email has been changed successfully.", "success");
      } else {
         showNotification("Invalid OTP", "The code you entered is incorrect.", "error");
      }
   };

   const isEnrolled = Boolean(user && user.paymentStatus === "Approved");
   const isPaymentUploaded = Boolean(user && (user.paymentStatus === "Uploaded" || isEnrolled));

   // Auto-redirect if student tries to stay on locked tabs without payment approval
   useEffect(() => {
      if (user && !isEnrolled && ["Sessions", "LMS", "Discussions", "Group Chat"].includes(activeNav)) {
         setActiveNav("Dashboard");
      }
   }, [user?.paymentStatus, isEnrolled, activeNav]);

   if (!user) {
      return (
         <div className="min-h-screen bg-[#020617] flex items-center justify-center font-sans">
            <div className="flex flex-col items-center gap-4">
               <div className="w-10 h-10 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
               <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Loading LMS Portal...</p>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-[#020617] flex flex-col font-sans text-white overflow-hidden relative">
         <header className="h-16 sm:h-20 bg-white/5 backdrop-blur-3xl border-b border-white/10 flex items-center justify-between px-4 sm:px-8 lg:px-10 sticky top-0 z-50 shadow-2xl">
            <div className="flex items-center gap-4 sm:gap-12">
               <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-black/40 flex items-center justify-center p-0.5">
                     <img
                        src={branding.logo || "/logo.png"}
                        alt={branding.siteName || "Logo"}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                           e.target.src = "/logo.png";
                        }}
                     />
                  </div>
                  <h2 className="text-xs sm:text-sm font-black text-blue-500 uppercase tracking-widest italic">LMS Portal</h2>
               </div>
               <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                  {["Dashboard", "Sessions", "LMS", "Discussions", "Group Chat"].map((nav) => {
                     const isLocked = !isEnrolled && nav !== "Dashboard";
                     return (
                        <button
                           key={nav}
                           onClick={() => {
                              if (isLocked) {
                                 showNotification(
                                    "Access Locked 🔒",
                                    "ඔබගේ ගෙවීම Admin විසින් Approve කරන තෙක් මෙම අංශය භාවිත කළ නොහැක.",
                                    "error"
                                 );
                                 return;
                              }
                              setActiveNav(nav);
                           }}
                           className={`text-sm font-bold transition-all flex items-center gap-1.5 ${
                              activeNav === nav 
                                 ? "text-white border-b-2 border-blue-500 pb-1" 
                                 : isLocked
                                    ? "text-slate-600 hover:text-slate-500 cursor-not-allowed"
                                    : "text-slate-400 hover:text-white"
                           }`}
                           title={isLocked ? "Payment approval required" : nav}
                        >
                           <span>{nav}</span>
                           {isLocked && <span className="text-xs opacity-70">🔒</span>}
                        </button>
                     );
                  })}
               </nav>
            </div>
            <div className="flex items-center gap-2 sm:gap-6">
               <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group" onClick={() => setActiveNav("Profile")}>
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border-2 transition-all shrink-0 ${activeNav === "Profile" ? "border-blue-500 shadow-xl" : "border-slate-700"}`}>{profilePic ? <img src={profilePic} className="w-full h-full rounded-full object-cover" /> : user.name[0]}</div>
                  <span className="text-xs sm:text-sm font-bold hidden sm:inline">Profile</span>
               </div>
               <button onClick={handleLogout} className="px-3 sm:px-5 py-1.5 sm:py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest border border-rose-500/20 transition-all">Logout</button>
            </div>
         </header>

         <div className="flex flex-grow overflow-hidden">
            <main className="flex-grow p-4 sm:p-8 lg:p-12 pb-28 md:pb-12 overflow-y-auto bg-[#020617] scrollbar-hide">
                <div className="max-w-5xl mx-auto space-y-8">
                   {activeNav === "Dashboard" ? (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-1 sm:px-2">
                            <div className="space-y-1">
                               <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-semibold text-slate-400">Welcome back,</span>
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                     {user.grade || user.subject || "Crypto Basic"}
                                  </span>
                               </div>
                               <h1 className="text-base sm:text-xl font-bold text-white tracking-tight leading-snug">
                                  <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                                     {user.name}
                                  </span>
                               </h1>
                               <p className="text-slate-400 font-medium text-[11px] tracking-wider">
                                  Student ID: <span className="font-bold text-indigo-400">{user.studentId || user.id}</span>
                                  {user.subject && (
                                     <>
                                        <span className="mx-2 text-slate-600">•</span>
                                        <span>Subject: <span className="text-slate-300 font-semibold">{user.subject}</span></span>
                                     </>
                                  )}
                               </p>

                               {/* COMPACT ACTIVE ZOOM POPUP / PILL BADGE */}
                               {(() => {
                                  const meeting = getActiveZoomMeeting(zoomData);
                                  if (!meeting) return null;
                                  return (
                                     <motion.div
                                        initial={{ opacity: 0, y: -4, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={`mt-2.5 inline-flex flex-wrap items-center gap-2 sm:gap-2.5 px-3 py-1.5 rounded-xl border backdrop-blur-xl shadow-lg transition-all ${
                                           meeting.isLive
                                              ? "bg-rose-950/80 border-rose-500/50 shadow-rose-950/30 text-rose-200 ring-1 ring-rose-500/30"
                                              : "bg-blue-950/70 border-blue-500/40 shadow-blue-950/20 text-blue-200 ring-1 ring-blue-500/20"
                                        }`}
                                     >
                                        <div className="flex items-center gap-1.5">
                                           {meeting.isLive ? (
                                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-black uppercase tracking-wider">
                                                 <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                                 </span>
                                                 Live Now
                                              </span>
                                           ) : (
                                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-wider">
                                                 <Video className="w-3 h-3 text-blue-400 shrink-0" />
                                                 Live Zoom Class
                                              </span>
                                           )}
                                        </div>

                                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-300">
                                           {meeting.dateText && (
                                              <span className="inline-flex items-center gap-1">
                                                 <Calendar className="w-3 h-3 text-amber-400 shrink-0" />
                                                 <span>{meeting.dateText}</span>
                                              </span>
                                           )}
                                           {meeting.timeText && (
                                              <span className="inline-flex items-center gap-1">
                                                 <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
                                                 <span>{meeting.timeText}</span>
                                              </span>
                                           )}
                                        </div>

                                        <a
                                           href={meeting.link}
                                           target="_blank"
                                           rel="noreferrer"
                                           className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 transition-all shadow active:scale-95 ${
                                              meeting.isLive
                                                 ? "bg-rose-500 hover:bg-rose-400 text-white shadow-rose-600/30 animate-pulse"
                                                 : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30"
                                           }`}
                                        >
                                           <span>{meeting.isLive ? "Join Live Now ▶" : "Join Zoom"}</span>
                                           <ExternalLink className="w-3 h-3 shrink-0" />
                                        </a>
                                     </motion.div>
                                  );
                               })()}
                            </div>
                            <AnimatePresence>
                               {Boolean(zoomData?.isAttendanceActive) && (!isMarkedToday || justMarkedAttendance) && isEnrolled && (
                                  <motion.button 
                                     initial={{ opacity: 0, scale: 0.95 }}
                                     animate={{ opacity: 1, scale: 1 }}
                                     exit={{ opacity: 0, scale: 0.85, y: -10 }}
                                     transition={{ duration: 0.35 }}
                                     onClick={async () => {
                                        const allStudents = JSON.parse(localStorage.getItem("studentRequests") || "[]");
                                        const idx = allStudents.findIndex(s => s.id === user.id || s.email === user.email || s.studentId === user.studentId);
                                        const now = new Date();
                                        const dateStr = now.toLocaleDateString('en-CA'); // YYYY-MM-DD
                                        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

                                        const historyEntry = {
                                           date: dateStr,
                                           time: timeStr,
                                           status: "Present",
                                           source: "Student Self-Marked / LMS"
                                        };
                                        let history = user.attendanceHistory || [];
                                        if (!Array.isArray(history)) history = [];
                                        if (!history.some(h => h.date === dateStr)) {
                                           history = [...history, historyEntry];
                                        }

                                        if (idx !== -1) {
                                           allStudents[idx].isPresent = true;
                                           allStudents[idx].attendanceDate = dateStr;
                                           allStudents[idx].attendanceTime = timeStr;
                                           allStudents[idx].attendanceHistory = history;
                                           localStorage.setItem("studentRequests", JSON.stringify(allStudents));
                                        }
                                        
                                        const updatedUser = {
                                           ...user, 
                                           isPresent: true, 
                                           attendanceDate: dateStr, 
                                           attendanceTime: timeStr,
                                           attendanceHistory: history
                                        };
                                        setUser(updatedUser);
                                        try {
                                           localStorage.setItem("activeStudent", JSON.stringify(updatedUser));
                                        } catch (e) {}

                                        setJustMarkedAttendance(true);
                                        setTimeout(() => {
                                           setJustMarkedAttendance(false);
                                        }, 2500);

                                        await syncStudentToBackend({ 
                                           isPresent: true, 
                                           attendanceDate: dateStr, 
                                           attendanceTime: timeStr,
                                           attendanceHistory: history
                                        });

                                        window.dispatchEvent(new Event("storage"));
                                        showNotification("Success", "පැමිණීම සටහන් විය! / Attendance Marked!", "success");
                                     }}
                                     disabled={isMarkedToday || justMarkedAttendance}
                                     className={`w-full sm:w-auto justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 sm:gap-3 shadow-xl ${
                                        (isMarkedToday || justMarkedAttendance)
                                           ? 'bg-emerald-500 text-white cursor-default shadow-emerald-500/20' 
                                           : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 active:scale-95 shadow-blue-500/20 animate-pulse'
                                     }`}
                                  >
                                     {(isMarkedToday || justMarkedAttendance) ? (
                                        <>Attendance Marked / පැමිණීම සටහන් කළා <span className="text-sm font-bold">✔</span></>
                                     ) : (
                                        <>Mark My Attendance / පැමිණීම සටහන් කරන්න 📊</>
                                     )}
                                  </motion.button>
                               )}
                            </AnimatePresence>
                         </div>

                        {/* PREMIUM ZOOM BOX - MOVED TO TOP */}
                        {(() => {
                           const activeMeeting = getActiveZoomMeeting(zoomData);
                           if (!activeMeeting || !activeMeeting.isLive || !isEnrolled) return null;
                           return (
                           <motion.div 
                              initial={{ opacity: 0, y: -20 }} 
                              animate={{ opacity: 1, y: 0 }} 
                              className="bg-[#0f172a] rounded-[2.5rem] border border-blue-500/30 shadow-2xl overflow-hidden relative group"
                           >
                              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
                              <div className="p-5 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8">
                                 <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-4xl border border-blue-500/20 animate-bounce">
                                       📹
                                    </div>
                                    <div>
                                       <div className="flex items-center gap-3 mb-1">
                                          <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Live Session is Active</h3>
                                          <div className="px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-full">
                                             <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest animate-pulse">Live Now</span>
                                          </div>
                                       </div>
                                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Grade {user?.grade} — {activeMeeting.dateText} {activeMeeting.timeText}</p>
                                    </div>
                                 </div>
                                 <div className="flex flex-col gap-3">
                                     <button 
                                        onClick={() => window.open(activeMeeting.link, "_blank")}
                                        className="w-full md:w-auto justify-center px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                                     >
                                        Join Zoom Room
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                     </button>
                                 </div>
                              </div>
                           </motion.div>
                           );
                        })()}

                        {/* Rejection Alert */}
                        {user.paymentStatus === "Rejected" && (
                           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-[2rem] flex items-center gap-6 shadow-xl">
                              <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white text-xl font-black shrink-0">!</div>
                              <div>
                                 <h4 className="text-rose-500 font-black text-sm uppercase tracking-widest">Payment Rejected</h4>
                                 <p className="text-slate-400 text-xs font-bold mt-1">ඔබේ රිසිට්පත ප්‍රතික්ෂේප කර ඇත. කරුණාකර නිවැරදි රිසිට්පතක් නැවත උඩුගත කරන්න.</p>
                              </div>
                           </motion.div>
                        )}

                        {/* Enrollment Progress */}
                        <div className="bg-[#0e1424]/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-800/80 shadow-xl space-y-3 sm:space-y-4">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                 <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                 <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">Enrollment Progress</h3>
                              </div>
                              <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                 {isEnrolled ? "4/4 Completed" : isPaymentUploaded ? "3/4 Under Review" : "2/4 Payment Pending"}
                              </span>
                           </div>

                           <div className="flex items-center justify-between w-full pt-1">
                              {[
                                 { label: "Registered", checked: true, num: 1 },
                                 { label: "Password", checked: true, num: 2 },
                                 { label: "Payment", checked: isPaymentUploaded, num: 3 },
                                 { label: "Enrolled", checked: isEnrolled, num: 4 }
                              ].map((step, idx) => {
                                 const isCurrent = (step.num === 3 && !isPaymentUploaded) || (step.num === 4 && isPaymentUploaded && !isEnrolled);
                                 return (
                                    <React.Fragment key={step.label}>
                                       <div className="flex flex-col items-center gap-1.5 shrink-0 z-10">
                                          <div
                                             className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-[11px] sm:text-xs transition-all shadow-md ${
                                                step.checked
                                                   ? "bg-emerald-500 text-white shadow-emerald-500/30"
                                                   : isCurrent
                                                   ? "bg-amber-500/20 text-amber-400 border-2 border-amber-500 animate-pulse shadow-amber-500/20"
                                                   : "bg-slate-800/90 text-slate-500 border border-slate-700"
                                             }`}
                                          >
                                             {step.checked ? "✓" : step.num}
                                          </div>
                                          <span
                                             className={`text-[10px] sm:text-xs font-bold tracking-tight text-center whitespace-nowrap ${
                                                step.checked ? "text-emerald-400" : isCurrent ? "text-amber-400 font-black" : "text-slate-500"
                                             }`}
                                          >
                                             {step.label}
                                          </span>
                                       </div>
                                       {idx < 3 && (
                                          <div
                                             className={`h-[2px] sm:h-1 flex-1 mx-1.5 sm:mx-3 rounded-full transition-all -mt-5 ${
                                                step.checked ? "bg-emerald-500" : "bg-slate-800"
                                             }`}
                                          />
                                       )}
                                    </React.Fragment>
                                 );
                              })}
                           </div>
                        </div>

                        {!isPaymentUploaded ? (
                           <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0e1424]/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-800/80 shadow-2xl space-y-6">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-6 border-b border-slate-800/80 pb-5 sm:pb-6">
                                 <div className="space-y-1">
                                    <h3 className="text-base sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                                       <CreditCard className="w-5 h-5 text-indigo-400" />
                                       <span>Complete Your Course Payment</span>
                                    </h3>
                                    <p className="text-slate-400 text-xs sm:text-sm font-medium">පාඨමාලාවට ඇතුළත් වීම සඳහා පහත ගෙවීම් විස්තර භාවිතා කර රිසිට්පත උඩුගත කරන්න.</p>
                                 </div>
                                 <div className="bg-indigo-500/10 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-indigo-500/20 text-center shrink-0 self-start sm:self-auto">
                                    <p className="text-[9px] sm:text-[10px] font-bold uppercase text-indigo-400">Course Fee</p>
                                    <p className="text-base sm:text-xl font-black text-white">
                                       Rs. {courseSettings?.fee ? Number(courseSettings.fee).toLocaleString() : "2,500"}/=
                                    </p>
                                 </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
                                 <div className="bg-slate-900/60 p-4 sm:p-6 rounded-2xl border border-slate-800/80 space-y-3.5">
                                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                                       <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Bank Deposit Details</h4>
                                       <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Verified</span>
                                    </div>
                                    <div className="space-y-1">
                                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Bank Name</p>
                                       <p className="font-bold text-sm sm:text-base text-white">{bankDetails?.bank || "Bank of Ceylon (BOC)"}</p>
                                    </div>
                                    <div className="space-y-1">
                                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Account Holder Name</p>
                                       <p className="font-bold text-sm sm:text-base text-white">{bankDetails?.holder || "S.S.D MADUSANKA"}</p>
                                    </div>
                                    <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                                       <div className="flex items-center justify-between">
                                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Account Number</p>
                                          <button
                                             onClick={() => {
                                                navigator.clipboard.writeText(bankDetails?.account || "5630207");
                                                setCopiedAccount(true);
                                                setTimeout(() => setCopiedAccount(false), 2000);
                                             }}
                                             className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                                          >
                                             {copiedAccount ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                             <span>{copiedAccount ? "Copied!" : "Copy"}</span>
                                          </button>
                                       </div>
                                       <p className="font-black text-xl text-indigo-400 tracking-wider">{bankDetails?.account || "5630207"}</p>
                                    </div>
                                    <div className="space-y-1">
                                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Branch</p>
                                       <p className="font-bold text-sm sm:text-base text-white">{bankDetails?.branch || "HOROWPOTHANA"}</p>
                                    </div>
                                 </div>
                                 <div className="bg-slate-900/60 p-4 sm:p-6 rounded-2xl border border-slate-800/80 space-y-3.5 flex flex-col justify-between">
                                    <div className="space-y-1">
                                       <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Upload Receipt Slip</h4>
                                       <p className="text-[11px] text-slate-500">Image (JPG, PNG) or PDF deposit slip</p>
                                    </div>
                                    <div className="h-44 sm:h-48 bg-slate-950/70 rounded-xl border-2 border-dashed border-slate-800 hover:border-indigo-500/40 flex flex-col items-center justify-center relative overflow-hidden group transition-colors">
                                       {receiptImage ? (
                                          <>
                                             {receiptImage.startsWith("data:application/pdf") ? (
                                                <div className="flex flex-col items-center justify-center h-full p-4">
                                                   <span className="text-4xl mb-2">📄</span>
                                                   <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">PDF Ready to Submit</p>
                                                </div>
                                             ) : (
                                                <img src={receiptImage} alt="Receipt" className="w-full h-full object-contain p-2" />
                                             )}
                                             <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                <button onClick={() => setReceiptImage(null)} className="px-3.5 py-1.5 bg-rose-500 text-white rounded-xl font-bold text-xs shadow-lg">Remove</button>
                                                <label className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-lg cursor-pointer">Change<input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleReceiptUpload} /></label>
                                             </div>
                                             <div className="absolute top-3 right-3 bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-lg">✓</div>
                                          </>
                                       ) : (
                                          <>
                                             <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">📄</span>
                                             <div className="text-center px-4">
                                                <p className="text-[11px] font-bold text-slate-300">Click to upload slip photo or PDF</p>
                                                <p className="text-[9px] font-semibold text-slate-500 mt-0.5">Maximum size: 5MB</p>
                                             </div>
                                             <input type="file" accept="image/*,application/pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleReceiptUpload} />
                                          </>
                                       )}
                                    </div>
                                    <button onClick={submitPayment} disabled={isUploading} className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg shadow-indigo-600/25 uppercase flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
                                       {isUploading ? "Uploading..." : "Submit Receipt"}
                                    </button>
                                 </div>
                              </div>
                           </motion.div>
                        ) : !isEnrolled ? (
                           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0e1424]/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-14 border border-slate-800/80 text-center space-y-4 shadow-xl">
                              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto text-2xl sm:text-3xl text-amber-400 border border-amber-500/20 animate-pulse">🔒</div>
                              <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight">Waiting for Approval</h3>
                              <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                                 ඔබේ ගෙවීම් රිසිට්පත අපට ලැබී ඇත. එය පරීක්ෂා කර Admin විසින් අවසර ලබා දුන් පසු සියලුම විශේෂාංග ස්වයංක්‍රීයව විවෘත වනු ඇත. <br />
                                 <span className="text-indigo-400 font-semibold mt-1 inline-block">සාමාන්‍යයෙන් මේ සඳහා පැය 1-2 ක් ගත වේ.</span>
                              </p>
                           </motion.div>
                        ) : (
                           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">

                              {/* Knowledge Level Card */}
                              <div className="bg-[#2e1065]/20 rounded-[2.5rem] p-10 border border-[#2e1065]/30 flex flex-col md:flex-row items-center gap-12 shadow-xl">
                                 <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                                    <svg className="w-full h-full transform -rotate-90"><circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-800" /><circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray="364.4" strokeDashoffset={364.4 - (364.4 * (assessmentResult?.percentage || 0) / 100)} className="text-[#6366f1] transition-all duration-1000" /></svg>
                                    <span className="absolute text-3xl font-black">{assessmentResult?.percentage || 0}%</span>
                                 </div>
                                 <div className="space-y-6">
                                    <h3 className="text-lg font-bold">Your Knowledge Level ({user.grade})</h3>
                                    <div className="flex flex-wrap gap-3">
                                       {assessmentResult ? assessmentResult.categories.map((cat, i) => (<div key={i} className="px-5 py-3 bg-[#0f172a] rounded-2xl border border-slate-800 flex items-center gap-3"><span className="text-xs text-slate-400 font-bold">{cat.label}</span><span className="text-sm font-black text-[#6366f1]">{cat.value}</span></div>)) : (
                                          <button onClick={startAssessment} className="px-8 py-3 bg-[#6366f1] text-white rounded-xl font-bold text-xs tracking-widest shadow-xl hover:scale-105 transition-all">TAKE ASSESSMENT</button>
                                       )}
                                    </div>
                                 </div>
                              </div>

                              {/* Interactive Cards */}
                              <div className="bg-[#0f172a]/80 rounded-[2.5rem] p-10 border border-slate-800/50 flex items-center justify-between group hover:border-[#2dd4bf]/30 transition-all shadow-xl">
                                 <div className="flex items-center gap-8">
                                    <div className="w-16 h-16 bg-[#134e4a]/20 rounded-2xl flex items-center justify-center text-3xl border border-[#134e4a]/30">📖</div>
                                    <div><h3 className="text-xl font-bold">Learning Portal</h3><p className="text-slate-500 text-sm mt-1">Access course modules and video lessons.</p></div>
                                 </div>
                                 <button onClick={() => setActiveNav("LMS")} className="px-10 py-4 bg-[#0d9488] text-white rounded-[1.2rem] font-bold text-sm shadow-xl">Access LMS</button>
                              </div>

                              <div className="bg-[#134e4a]/20 rounded-[2.5rem] p-10 border border-[#134e4a]/30 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
                                 <div className="flex items-center gap-8">
                                    <div className="w-16 h-16 bg-[#134e4a]/40 rounded-2xl flex items-center justify-center text-3xl text-[#2dd4bf]">👥</div>
                                    <div>
                                       <h3 className="text-xl font-bold">Join Our Community</h3>
                                       <p className="text-slate-500 text-sm mt-1">Batch mates සහ instructor එක්ක connect වෙන්න!</p>
                                       <p className="text-blue-400 font-black text-xs mt-3 uppercase tracking-widest">Support: 070 367 0398</p>
                                    </div>
                                 </div>
                                 <div className="flex gap-4">
                                    <a href="https://chat.whatsapp.com/JPycyZGjR9rCNaMFWsOHxn" target="_blank" rel="noreferrer" className="px-8 py-4 bg-[#25d366] text-white rounded-2xl font-bold text-sm flex items-center gap-3 shadow-xl hover:scale-105 transition-transform">
                                       <span className="text-xl">💬</span> WhatsApp
                                    </a>
                                    <a href="https://facebook.com" target="_blank" rel="noreferrer" className="px-8 py-4 bg-[#1877f2] text-white rounded-2xl font-bold text-sm flex items-center gap-3 shadow-xl hover:scale-105 transition-transform">
                                       <span className="text-xl">fb</span> Facebook
                                    </a>
                                 </div>
                              </div>
                           </motion.div>
                        )}
                     </motion.div>
                  ) : activeNav === "Sessions" ? (
                     !isEnrolled ? (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto py-16 px-4 sm:px-6 text-center space-y-6">
                           <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-4xl text-amber-400 flex items-center justify-center mx-auto shadow-xl">
                              🔒
                           </div>
                           <div className="space-y-3">
                              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">Course Sessions Locked</h2>
                              <p className="text-sm font-semibold text-slate-400 leading-relaxed">
                                 පාඨමාලාවේ සතිපතා Sessions නැරඹීමට ඔබගේ ගෙවීම Admin විසින් Approve කළ යුතුය.
                                 <br />
                                 <span className="text-xs text-slate-500 mt-1 block">Your payment must be approved by the administrator before accessing weekly lecture sessions.</span>
                              </p>
                           </div>
                           <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
                              <span>Payment Status:</span>
                              <span className={user.paymentStatus === "Uploaded" ? "text-amber-400 font-extrabold" : "text-rose-400 font-extrabold"}>
                                 {user.paymentStatus === "Uploaded" ? "Under Review (පරීක්ෂා කරමින් පවතී)" : (user.paymentStatus || "Pending Payment")}
                              </span>
                           </div>
                           <button 
                              onClick={() => setActiveNav("Dashboard")} 
                              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 hover:scale-105 transition-all"
                           >
                              Go to Dashboard & Upload Receipt 💳
                           </button>
                        </motion.div>
                     ) : (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 pb-20">
                        {!activeSession ? (
                           <>
                              <div className="text-center space-y-4">
                                 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest">
                                    <span>🎯</span> Enrolled: {user?.grade || user?.subject || "Crypto Basic"}
                                 </div>
                                 <h2 className="text-2xl sm:text-4xl font-black text-[#2dd4bf] tracking-tighter uppercase italic">
                                    {user?.grade || "Course"} Curriculum Sessions
                                 </h2>
                                 <p className="text-slate-400 font-bold text-sm tracking-wide">
                                    Exclusively for <span className="text-blue-400 font-black">{user?.grade || "your grade"}</span> students — <span className="text-emerald-400">සතියකට එක session එකක්</span>
                                 </p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                  {sessions.map((session, index) => {
                                     const sKey = getSessionKey(session);
                                     const prog = sessionProgress[sKey] || {};
                                     const isCompleted = prog.status === 'completed';
                                     const isStarted = prog.status === 'started' && !isCompleted;
                                     const currentSlide = (prog.lastSlideIndex || 0) + 1;
                                     const totalSlides = session.content?.length || 0;

                                     const palettes = [
                                        { badgeBg: "bg-[#06b6d4]", badgeText: "text-white" },
                                        { badgeBg: "bg-[#3b82f6]", badgeText: "text-white" },
                                        { badgeBg: "bg-[#d946ef]", badgeText: "text-white" },
                                        { badgeBg: "bg-[#f59e0b]", badgeText: "text-white" },
                                        { badgeBg: "bg-[#10b981]", badgeText: "text-white" },
                                     ];
                                     const palette = session.locked 
                                        ? { badgeBg: "bg-slate-700/50", badgeText: "text-slate-400" } 
                                        : palettes[index % palettes.length];

                                     return (
                                        <motion.div
                                           key={index}
                                           whileHover={!session.locked ? { y: -5 } : {}}
                                           className={`p-7 sm:p-8 rounded-[1.75rem] bg-[#1e293b]/90 border ${isCompleted ? 'border-emerald-500/40 shadow-[0_10px_30px_rgba(16,185,129,0.08)]' : 'border-slate-700/50'} flex flex-col shadow-xl relative ${session.locked ? 'opacity-60' : ''}`}
                                        >
                                           <div className="flex justify-between items-start mb-6">
                                              <div className={`px-4 py-1.5 rounded-full text-[11px] font-black ${palette.badgeBg} ${palette.badgeText}`}>
                                                 Session {index + 1}
                                              </div>
                                              {session.locked ? (
                                                 <span className="text-slate-500 text-lg">🔒</span>
                                              ) : isCompleted ? (
                                                 <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-emerald-500/15 border border-emerald-500/40 text-emerald-400">
                                                    <span>✓</span> Completed • සම්පූර්ණයි
                                                 </div>
                                              ) : isStarted ? (
                                                 <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-blue-500/15 border border-blue-500/40 text-blue-400">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                                                    In Progress
                                                 </div>
                                              ) : null}
                                           </div>

                                           <div className="space-y-1 mb-3">
                                              <h4 className={`text-xl font-black tracking-tight ${session.locked ? 'text-slate-500' : 'text-white'}`}>{session.title}</h4>
                                              <p className={`text-sm font-medium ${session.locked ? 'text-slate-600' : 'text-slate-400'}`}>{session.titleSi}</p>
                                           </div>

                                           <p className={`text-xs leading-relaxed flex-grow ${session.locked ? 'text-slate-600' : 'text-slate-500'}`}>{session.desc}</p>
                                           <p className={`text-xs font-medium mt-4 ${session.locked ? 'text-slate-700' : 'text-slate-500'}`}>{session.stats || `${totalSlides} slides`}</p>

                                           {/* Completed Marks Breakdown Card */}
                                           {isCompleted && (
                                              <div className="mt-4 p-3.5 rounded-2xl bg-[#0b1322] border border-emerald-500/30 space-y-2">
                                                 <div className="flex items-center justify-between">
                                                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                                                       <span>✓</span> Results / ප්‍රතිඵල:
                                                    </span>
                                                    <span className="text-white text-xs font-black bg-emerald-500/20 px-2.5 py-0.5 rounded-md border border-emerald-500/40">
                                                       Score: {prog.score !== undefined ? `${prog.score}%` : '100%'}
                                                    </span>
                                                 </div>
                                                 {prog.totalQuestions > 0 ? (
                                                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 pt-1.5 border-t border-slate-800">
                                                       <span className="text-emerald-400">✅ {prog.correctCount || 0} Correct</span>
                                                       <span className="text-rose-400">❌ {prog.wrongCount || 0} Wrong</span>
                                                       <span className="text-slate-400">Total: {prog.totalQuestions}</span>
                                                    </div>
                                                 ) : (
                                                    <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">All module content completed</p>
                                                 )}
                                              </div>
                                           )}

                                           {/* Mid-Session Progress Indicator */}
                                           {isStarted && (
                                              <div className="mt-4 p-3 rounded-2xl bg-blue-950/30 border border-blue-500/30 flex items-center justify-between text-xs font-semibold text-blue-300">
                                                 <span className="flex items-center gap-1.5">
                                                    <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                                                    Resume Position:
                                                 </span>
                                                 <span className="text-[11px] font-bold text-blue-200">
                                                    Slide {currentSlide} of {totalSlides}
                                                 </span>
                                              </div>
                                           )}

                                           <div className="pt-6 flex justify-center mt-auto">
                                              {session.locked ? (
                                                 <div className="flex items-center gap-2 bg-slate-900/50 px-6 py-2.5 rounded-xl text-slate-500 text-xs font-bold">
                                                    <span>🔒</span> Locked
                                                 </div>
                                              ) : (
                                                 <button
                                                    onClick={() => handleOpenSession(session)}
                                                    className={`w-full px-6 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                                                       isCompleted 
                                                          ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 shadow-lg shadow-emerald-900/20' 
                                                          : isStarted
                                                          ? 'bg-blue-600/30 border border-blue-500/50 text-blue-200 hover:bg-blue-600/50'
                                                          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                                                    }`}
                                                 >
                                                    {isCompleted ? (
                                                       <><span className="text-sm">👁️</span> Review Session (Locked)</>
                                                    ) : isStarted ? (
                                                       <><span className="text-blue-400 text-[10px]">▶</span> Resume from Slide {currentSlide}</>
                                                    ) : (
                                                       <><span className="text-emerald-400 text-[10px]">▶</span> Start Session</>
                                                    )}
                                                 </button>
                                              )}
                                           </div>
                                        </motion.div>
                                     );
                                  })}
                                 {sessions.length === 0 && (
                                    <div className="col-span-full py-20 text-center bg-[#0f172a] rounded-[3rem] border border-slate-800/50 space-y-3">
                                       <div className="text-4xl">📚</div>
                                       <p className="text-white font-black uppercase tracking-widest text-sm">No sessions uploaded for {user?.grade || "your grade"} yet.</p>
                                       <p className="text-slate-500 text-xs font-semibold">Admin will publish modules specifically for {user?.grade || "your grade"} soon.</p>
                                    </div>
                                 )}
                              </div>
                           </>
                        ) : (
                           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="fixed inset-0 z-50 bg-[#020617] flex flex-col overflow-hidden">
                              {/* Top Bar */}
                              {(() => {
                                 const activeKey = getSessionKey(activeSession);
                                 const activeProg = sessionProgress[activeKey] || {};
                                 const isSessionCompleted = activeProg.status === "completed";

                                 return (
                                    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800/50 bg-[#0f172a]/80 backdrop-blur-md">
                                       <button onClick={() => setActiveSession(null)} className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                                          <span className="text-xl">‹</span> <span className="text-xs sm:text-sm font-bold tracking-widest uppercase truncate max-w-[200px] sm:max-w-none">Sessions | {activeSession.title}</span>
                                       </button>
                                       <div className="flex items-center gap-3 sm:gap-4 text-xs font-black tracking-widest text-slate-500">
                                          {isSessionCompleted && (
                                             <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                                                <span>🔒</span> Review Mode
                                             </span>
                                          )}
                                          <div>
                                             <span className="text-[#2dd4bf]">{currentSlideIndex + 1}</span> / {activeSession.content?.length || 0}
                                          </div>
                                          <button className="text-xl hover:text-white transition-colors" onClick={() => document.documentElement.requestFullscreen().catch(()=>{})}>⛶</button>
                                       </div>
                                    </div>
                                 );
                              })()}
                              
                              {/* Progress Bar */}
                              <div className="w-full h-1 bg-slate-800">
                                 <motion.div 
                                    className="h-full bg-[#2dd4bf]" 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentSlideIndex + 1) / (activeSession.content?.length || 1)) * 100}%` }}
                                    transition={{ duration: 0.3 }}
                                 />
                              </div>

                              {/* Slide Content Area */}
                              <div className="flex-1 flex justify-center relative px-8 py-0 overflow-hidden min-h-0">
                                 {/* Left Arrow */}
                                 <button 
                                    onClick={() => handleSlideChange(Math.max(0, currentSlideIndex - 1))}
                                    disabled={currentSlideIndex === 0}
                                    className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-slate-800/50 border border-slate-700 text-slate-400 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed z-10 text-sm sm:text-base"
                                 >‹</button>

                                 {/* Slide Render */}
                                 <div className="w-full max-w-4xl h-full overflow-y-auto custom-scrollbar p-4 sm:p-10 pb-28 sm:pb-24">
                                    {(() => {
                                       const slide = activeSession.content?.[currentSlideIndex];
                                       if (!slide) return (
                                          <div className="text-center p-20 border border-slate-800/50 border-dashed rounded-[3rem]">
                                             <p className="text-slate-500 font-black uppercase tracking-widest text-xs">No content available for this session.</p>
                                          </div>
                                       );
                                       
                                       return (
                                          <div className="space-y-8 animate-fade-in">
                                              <div className="flex justify-start mb-10">
                                                 <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                    slide.type === 'video' 
                                                       ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
                                                       : slide.type === 'quiz' 
                                                       ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' 
                                                       : slide.type === 'chart'
                                                       ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                       : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                 }`}>
                                                    {slide.type === 'chart' ? '📈 Live Market Chart & Whiteboard' : slide.type}
                                                 </span>
                                              </div>
                                              
                                              <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">{slide.title || slide.question || "Untitled Slide"}</h3>
                                              {(slide.titleSi || slide.questionSi) && <p className="text-slate-400 font-bold text-sm tracking-wide">{slide.titleSi || slide.questionSi}</p>}
                                              
                                              {slide.type === 'note' && (
                                                 <div className="text-slate-300 text-lg leading-relaxed prose prose-invert max-w-none mt-8 space-y-6">
                                                    <div>{renderContent(slide.content || slide.body || slide.desc || "")}</div>
                                                    {slide.contentSi && <div className="text-slate-400 text-base">{renderContent(slide.contentSi)}</div>}
                                                 </div>
                                              )}

                                              {slide.type === 'chart' && (
                                                 <div className="mt-8 space-y-6">
                                                    <TradingChartWhiteboard
                                                       chartConfig={slide.chartConfig || { mode: "live", symbol: "BINANCE:BTCUSDT", timeframe: "15" }}
                                                       drawings={slide.drawings || []}
                                                       readOnly={false}
                                                       height="580px"
                                                    />

                                                    {(slide.content || slide.body || slide.desc) && (
                                                       <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 text-slate-300 text-base leading-relaxed space-y-4">
                                                          <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                                                             <span>Teacher's Market Analysis Guide</span>
                                                          </h4>
                                                          <div>{renderContent(slide.content || slide.body || slide.desc || "")}</div>
                                                          {slide.contentSi && (
                                                             <div className="text-slate-400 text-sm border-t border-slate-800 pt-3">
                                                                {renderContent(slide.contentSi)}
                                                             </div>
                                                          )}
                                                       </div>
                                                    )}
                                                 </div>
                                              )}

                                              {slide.type === 'file' && (slide.fileData || slide.url || slide.videoUrl) && (() => {
                                                  const fileSrc = slide.fileData || slide.url || slide.videoUrl;
                                                  const isImg = slide.fileType?.includes('image') || fileSrc.match(/\.(png|jpe?g|webp|gif|svg)($|\?)/i);
                                                  const isVid = slide.fileType?.includes('video') || fileSrc.match(/\.(mp4|webm|mov)($|\?)/i);
                                                  const isPdf = slide.fileType?.includes('pdf') || fileSrc.toLowerCase().includes('.pdf');

                                                  return (
                                                     <div className="mt-8 rounded-[2rem] overflow-hidden border border-slate-800 bg-[#0f172a] shadow-2xl p-4 sm:p-6">
                                                        {isImg ? (
                                                           <img src={fileSrc} alt={slide.fileName || "Resource Image"} className="w-full h-auto max-h-[70vh] object-contain rounded-xl" />
                                                        ) : isVid ? (
                                                           <video src={fileSrc} controls className="w-full max-h-[70vh] rounded-xl bg-black" />
                                                        ) : isPdf ? (
                                                           <div className="space-y-4">
                                                              <embed src={fileSrc} type="application/pdf" className="w-full h-[70vh] rounded-xl" />
                                                              <div className="text-center pt-2">
                                                                 <a
                                                                    href={fileSrc}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    download={slide.fileName || "document.pdf"}
                                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#2dd4bf] text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-[#14b8a6] shadow-lg shadow-teal-500/20 transition-all"
                                                                 >
                                                                    📄 Open / Download PDF
                                                                 </a>
                                                              </div>
                                                           </div>
                                                        ) : (
                                                           <div className="p-8 sm:p-12 text-center space-y-4">
                                                              <div className="text-6xl">📄</div>
                                                              <p className="text-white font-bold text-base">{slide.fileName || "Resource Attachment"}</p>
                                                              <a
                                                                 href={fileSrc}
                                                                 target="_blank"
                                                                 rel="noreferrer"
                                                                 download={slide.fileName || "download"}
                                                                 className="inline-flex items-center gap-2 px-6 py-3 bg-[#2dd4bf] text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-[#14b8a6] shadow-lg shadow-teal-500/20 transition-all"
                                                              >
                                                                 Download File
                                                              </a>
                                                           </div>
                                                        )}
                                                        {slide.fileName && !isPdf && (
                                                           <p className="text-center text-slate-500 font-bold mt-4 text-xs">{slide.fileName}</p>
                                                        )}
                                                     </div>
                                                  );
                                               })()}

                                              {slide.type === 'video' && (
                                                 <div className="w-full aspect-video rounded-[2rem] overflow-hidden border border-slate-800 shadow-2xl bg-black mt-8">
                                                    {isDirectVideo(slide.url || slide.videoUrl) ? (
                                                       <video
                                                          key={slide.url || slide.videoUrl}
                                                          src={slide.url || slide.videoUrl}
                                                          controls
                                                          playsInline
                                                          className="w-full h-full object-contain"
                                                          controlsList="nodownload"
                                                       />
                                                    ) : (
                                                       <iframe
                                                          src={formatVideoUrl(slide.url || slide.videoUrl)}
                                                          className="w-full h-full"
                                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                          allowFullScreen
                                                        />
                                                     )}
                                                  </div>
                                               )}

                                               {slide.type === 'quiz' && (() => {
                                                  const activeKey = getSessionKey(activeSession);
                                                  const isSessionCompleted = sessionProgress[activeKey]?.status === "completed";
                                                  const isAnswered = Boolean(answeredSlides[currentSlideIndex]);

                                                  return (
                                                     <div className="space-y-6 mt-12">
                                                        {slide.candlestickType && (
                                                           <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center space-y-3 shadow-xl">
                                                              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                                                                 Candlestick Pattern Diagram
                                                              </span>
                                                              <div className="w-40 h-24 flex items-center justify-center p-2 bg-slate-950/80 rounded-2xl border border-slate-800/80 shadow-inner">
                                                                 <PatternGraphic type={slide.candlestickType} />
                                                              </div>
                                                              <p className="text-xs text-slate-400 font-semibold">Examine the candle body, shadows, and wicks above</p>
                                                           </div>
                                                        )}

                                                        <div className="space-y-4">
                                                           {(slide.options || []).map((opt, oIdx) => {
                                                              const correctTarget = slide.correctIndex !== undefined ? slide.correctIndex : slide.correctAnswer;
                                                              const isCorrectOption = oIdx === correctTarget;
                                                              const isSelected = answeredSlides[currentSlideIndex]?.selected === oIdx;
                                                              let btnClass = "bg-[#0f172a] border-slate-700 text-slate-300 hover:bg-slate-800";
                                                              
                                                              if (isAnswered) {
                                                                 if (isCorrectOption) btnClass = "bg-[#064e3b]/40 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]";
                                                                 else if (isSelected) btnClass = "bg-rose-900/20 border-rose-500/50 text-rose-400";
                                                                 else btnClass = "bg-[#0f172a]/50 border-slate-800 text-slate-600 opacity-50";
                                                              }

                                                              return (
                                                                 <button 
                                                                    key={oIdx}
                                                                    disabled={isAnswered || isSessionCompleted}
                                                                    onClick={() => handleAnswerQuizSlide(currentSlideIndex, oIdx, isCorrectOption)}
                                                                    className={`w-full p-6 text-left rounded-2xl border transition-all duration-300 ${btnClass} font-medium text-lg disabled:cursor-not-allowed`}
                                                                 >
                                                                    <div className="flex items-center justify-between">
                                                                       <span>{opt}</span>
                                                                       {isAnswered && isCorrectOption && <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">✓ Correct</span>}
                                                                       {isAnswered && isSelected && !isCorrectOption && <span className="text-rose-400 font-bold text-xs uppercase tracking-wider">✗ Your Answer</span>}
                                                                    </div>
                                                                 </button>
                                                              );
                                                           })}
                                                        </div>
                                                        {answeredSlides[currentSlideIndex] && (
                                                           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-8 mt-8 rounded-2xl border ${answeredSlides[currentSlideIndex].correct ? 'bg-[#064e3b]/20 border-emerald-500/30' : 'bg-rose-900/20 border-rose-500/30'}`}>
                                                              <p className={`font-black text-sm tracking-widest uppercase ${answeredSlides[currentSlideIndex].correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                                 {answeredSlides[currentSlideIndex].correct ? "✓ Correct! / නිවැරදියි!" : "✗ Incorrect / වැරදියි!"}
                                                              </p>
                                                              {slide.explanation && <div className="mt-6 border-t border-slate-700/50 pt-6 text-sm">{renderContent(slide.explanation)}</div>}
                                                              {slide.explanationSi && <div className="mt-4 border-t border-slate-700/50 pt-4 text-xs">{renderContent(slide.explanationSi)}</div>}
                                                           </motion.div>
                                                        )}
                                                     </div>
                                                  );
                                               })()}

                                               {/* Completion Bar on Last Slide */}
                                               {currentSlideIndex === (activeSession.content?.length || 1) - 1 && (() => {
                                                  const activeKey = getSessionKey(activeSession);
                                                  const isSessionCompleted = sessionProgress[activeKey]?.status === "completed";
                                                  
                                                  return (
                                                     <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col items-center justify-center space-y-4">
                                                        <div className="text-center space-y-1">
                                                           <p className="text-xs font-black uppercase tracking-widest text-emerald-400">
                                                              {isSessionCompleted ? "🎉 Session Completed • සම්පූර්ණ කරන ලදී" : "🏁 End of Session • පාඩම අවසන් කරන්න"}
                                                           </p>
                                                           <p className="text-slate-400 text-xs">
                                                              {isSessionCompleted 
                                                                 ? "ඔබ මෙම පාඩම සම්පූර්ණ කර ඇත. සියලුම slides ඕනෑම වේලාවක Review කළ හැක."
                                                                 : "ප්‍රතිඵලය සටහන් කරගෙන Session එක සම්පූර්ණ කිරීමට පහත බොත්තම ඔබන්න."}
                                                           </p>
                                                        </div>

                                                        {isSessionCompleted ? (
                                                           <button
                                                              onClick={() => setActiveSession(null)}
                                                              className="px-8 py-3.5 bg-emerald-500 text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-emerald-400 shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2"
                                                           >
                                                              <span>✓ Return to Sessions List / සැසි ලැයිස්තුවට යන්න</span>
                                                           </button>
                                                        ) : (
                                                           <button
                                                              onClick={handleCompleteSession}
                                                              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black uppercase tracking-widest text-xs sm:text-sm rounded-2xl hover:brightness-110 shadow-2xl shadow-emerald-500/30 transition-all flex items-center gap-3 active:scale-95"
                                                           >
                                                              <span className="text-base">🎉</span> Complete Session / පාඩම අවසන් කරන්න
                                                           </button>
                                                        )}
                                                     </div>
                                                  );
                                               })()}
                                           </div>
                                        );
                                     })()}
                                  </div>

                                  {/* Right Arrow */}
                                  {(() => {
                                     const activeKey = getSessionKey(activeSession);
                                     const isSessionCompleted = sessionProgress[activeKey]?.status === "completed";
                                     const isLastSlide = currentSlideIndex === (activeSession.content?.length || 1) - 1;

                                     return (
                                        <button 
                                           onClick={() => {
                                              if (!isLastSlide) {
                                                 handleSlideChange(currentSlideIndex + 1);
                                              } else if (!isSessionCompleted) {
                                                 handleCompleteSession();
                                              }
                                           }}
                                           disabled={isLastSlide && isSessionCompleted}
                                           className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-slate-800/50 border border-slate-700 text-slate-400 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed z-10 text-sm sm:text-base"
                                           title={isLastSlide ? (isSessionCompleted ? "Completed" : "Complete Session") : "Next Slide"}
                                        >
                                           {isLastSlide ? (isSessionCompleted ? '✓' : '🏁') : '›'}
                                        </button>
                                     );
                                  })()}
                              </div>
                           </motion.div>
                        )}
                     </motion.div>
                     )
                  ) : activeNav === "Profile" ? (
                     <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="max-w-5xl mx-auto space-y-8 pb-24 sm:pb-28"
                     >
                        {/* 1. HERO PROFILE CARD */}
                        <div className="bg-[#0b1120]/90 backdrop-blur-2xl rounded-3xl sm:rounded-[2.5rem] border border-slate-800/80 shadow-2xl overflow-hidden relative">
                           {/* Cover Banner */}
                           <div className="h-48 sm:h-64 relative overflow-hidden bg-[#070b14]">
                              {coverPhoto ? (
                                 // User Custom Uploaded Cover Photo
                                 <div className="absolute inset-0">
                                    <img
                                       src={coverPhoto}
                                       alt="Profile Cover"
                                       className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-[#0b1120]/50 to-black/40" />
                                 </div>
                              ) : (
                                 // Premium Dark Academic Obsidian & Mesh Vector Wallpaper
                                 <div className="absolute inset-0 bg-gradient-to-br from-[#060a12] via-[#0d1527] to-[#040711] overflow-hidden">
                                    {/* Ambient Glow Orbs */}
                                    <div className="absolute -top-12 -left-12 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                                    <div className="absolute -bottom-10 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                                    {/* Abstract Academic Waves & Contour Vector Lines */}
                                    <svg
                                       className="absolute inset-0 w-full h-full opacity-25 pointer-events-none"
                                       xmlns="http://www.w3.org/2000/svg"
                                       preserveAspectRatio="none"
                                       viewBox="0 0 1000 400"
                                    >
                                       <defs>
                                          <linearGradient id="academicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                             <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                                             <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.2" />
                                             <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3" />
                                          </linearGradient>
                                       </defs>
                                       <path
                                          d="M0,220 C300,140 450,300 700,180 C850,110 950,240 1000,200 L1000,400 L0,400 Z"
                                          fill="url(#academicGrad)"
                                       />
                                       <path
                                          d="M0,270 C260,210 520,330 760,230 C910,170 980,250 1000,230"
                                          fill="none"
                                          stroke="#818cf8"
                                          strokeWidth="1.5"
                                          strokeDasharray="6,6"
                                          opacity="0.5"
                                       />
                                       <path
                                          d="M0,190 C340,110 500,250 820,150 C930,90 980,190 1000,160"
                                          fill="none"
                                          stroke="#fbbf24"
                                          strokeWidth="1.2"
                                          opacity="0.4"
                                       />
                                    </svg>

                                    {/* Academic Crest Motif Watermark */}
                                    <div className="absolute -right-6 -bottom-10 text-white/[0.03] select-none pointer-events-none">
                                       <GraduationCap className="w-72 h-72" strokeWidth={1} />
                                    </div>

                                    {/* Vignette Blend */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-transparent to-transparent" />
                                 </div>
                              )}

                              {/* Top Bar Badges & Actions */}
                              <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-8 flex items-center justify-between gap-3 z-10">
                                 {/* Institution Brand Badge */}
                                 <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/10 text-xs font-bold text-slate-200 shadow-xl">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                    <span className="hidden sm:inline">Taizer LMS •</span>
                                    <span className="text-amber-300/90 font-extrabold">Official Student Portal</span>
                                 </div>

                                 {/* Right Controls: Verified Badge & Change Cover */}
                                 <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/10 text-xs font-bold text-slate-300 shadow-xl">
                                       <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                       <span className="text-[11px] sm:text-xs">Verified LMS Student</span>
                                    </div>

                                    {/* Change Cover Button */}
                                    <label
                                       title="Change Cover Banner / කවරය වෙනස් කරන්න"
                                       className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white backdrop-blur-md border border-white/15 text-[11px] font-bold cursor-pointer transition-all shadow-xl active:scale-95"
                                    >
                                       <Camera className="w-3.5 h-3.5 text-indigo-400" />
                                       <span className="hidden md:inline">Change Cover</span>
                                       <input
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          onChange={handleCoverUpload}
                                       />
                                    </label>
                                 </div>
                              </div>
                           </div>

                           {/* Avatar & Student Identity Bar */}
                           <div className="px-5 sm:px-10 pb-8 sm:pb-10 pt-0 relative">
                              <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
                                 {/* Avatar with Camera Upload */}
                                 <div className="relative group shrink-0">
                                    <div className="p-1 rounded-[2rem] bg-gradient-to-tr from-amber-400/80 via-indigo-500 to-purple-600 shadow-2xl shadow-black/80">
                                       <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-[1.8rem] bg-[#070b14] overflow-hidden flex items-center justify-center relative border-4 border-[#0b1120]">
                                          {profilePic ? (
                                             <img src={profilePic} alt={user.name} className="w-full h-full object-cover" />
                                          ) : (
                                             <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 flex items-center justify-center text-4xl sm:text-5xl font-black text-white tracking-wider">
                                                {user.name ? user.name.charAt(0).toUpperCase() : "S"}
                                             </div>
                                          )}

                                          {/* Hover Change overlay */}
                                          <label className="absolute inset-0 bg-black/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white gap-1.5">
                                             <Camera className="w-5 h-5 text-indigo-400" />
                                             <span className="text-[10px] font-black uppercase tracking-wider">Change</span>
                                             <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                 onChange={(e) => handleProfilePicUpload(e.target.files?.[0])}
                                             />
                                          </label>
                                       </div>
                                    </div>

                                    {/* Always-visible Camera Icon Pill Badge */}
                                    <label className="absolute -bottom-1 -right-1 p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-600/30 border-2 border-[#0b1120] cursor-pointer transition-all hover:scale-110 active:scale-95 flex items-center justify-center">
                                       <Camera className="w-3.5 h-3.5" />
                                       <input
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                                 onChange={(e) => handleProfilePicUpload(e.target.files?.[0])}
                                       />
                                    </label>
                                 </div>

                                 {/* Name & Academic Tags */}
                                 <div className="text-center sm:text-left flex-1 min-w-0">
                                    <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                                       <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                                          {user.name}
                                       </h3>
                                       <BadgeCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                                       <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
                                          <span className="opacity-60">ID:</span> {user.studentId || user.id}
                                       </span>
                                       <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                                          <GraduationCap className="w-3.5 h-3.5" /> {user?.grade || user?.subject || "Crypto Basic"}
                                       </span>
                                       <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold">
                                          <BookOpen className="w-3.5 h-3.5" /> {user.subject || user.grade || "Crypto Basic"}
                                       </span>
                                       {user.joined && (
                                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-400 text-xs font-medium">
                                             <Calendar className="w-3.5 h-3.5" /> Joined {user.joined}
                                          </span>
                                       )}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* 2. STATS & STATUS OVERVIEW CARDS */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                           <div className="bg-[#0b1120]/80 rounded-2xl sm:rounded-3xl border border-slate-800/80 p-4 sm:p-5 space-y-2 shadow-lg">
                              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                 <ShieldCheck className="w-5 h-5" />
                              </div>
                              <div>
                                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Account Status</p>
                                 <p className="text-sm sm:text-base font-extrabold text-white mt-0.5">Active Student</p>
                                 <p className="text-[11px] font-medium text-emerald-400">✓ Enrolled & Verified</p>
                              </div>
                           </div>

                           <div className="bg-[#0b1120]/80 rounded-2xl sm:rounded-3xl border border-slate-800/80 p-4 sm:p-5 space-y-2 shadow-lg">
                              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                 <GraduationCap className="w-5 h-5" />
                              </div>
                              <div>
                                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Enrolled Curriculum</p>
                                 <p className="text-sm sm:text-base font-extrabold text-white mt-0.5">{user.grade || user.subject || 'Crypto Basic'}</p>
                                 <p className="text-[11px] font-medium text-indigo-400">{user.subject || user.grade || 'Crypto Basic'}</p>
                              </div>
                           </div>

                           <div className="bg-[#0b1120]/80 rounded-2xl sm:rounded-3xl border border-slate-800/80 p-4 sm:p-5 space-y-2 shadow-lg">
                              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                 <Calendar className="w-5 h-5" />
                              </div>
                              <div>
                                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Today's Attendance</p>
                                 <p className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                                    {isMarkedToday ? "Marked Present" : "Not Marked Yet"}
                                 </p>
                                 <p className="text-[11px] font-medium text-blue-400">
                                    {isMarkedToday 
                                       ? (user?.attendanceTime ? `Marked at ${user.attendanceTime}` : "Attended Today") 
                                       : zoomData?.isAttendanceActive 
                                          ? "Attendance Open - Mark Above ⬆" 
                                          : "Attendance Closed"}
                                 </p>
                              </div>
                           </div>

                           <div className="bg-[#0b1120]/80 rounded-2xl sm:rounded-3xl border border-slate-800/80 p-4 sm:p-5 space-y-2 shadow-lg">
                              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                                 <Sparkles className="w-5 h-5" />
                              </div>
                              <div>
                                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">LMS Access</p>
                                 <p className="text-sm sm:text-base font-extrabold text-white mt-0.5">Full 24/7 Access</p>
                                 <p className="text-[11px] font-medium text-cyan-400">All Modules Unlocked</p>
                              </div>
                           </div>
                        </div>

                        {/* 3. PERSONAL INFORMATION SECTION */}
                        <div className="bg-[#0b1120]/80 rounded-3xl border border-slate-800/80 p-6 sm:p-8 space-y-6 shadow-xl">
                           <div className="flex items-center gap-3.5 pb-4 border-b border-slate-800/80">
                              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                                 <User className="w-5 h-5" />
                              </div>
                              <div>
                                 <h4 className="text-base sm:text-lg font-bold text-white">Personal Information</h4>
                                 <p className="text-xs text-slate-400">Update your primary profile name and phone number</p>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                              <div className="space-y-2">
                                 <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-indigo-400" /> Full Name
                                 </label>
                                 <div className="relative">
                                    <input
                                       value={editedName}
                                       onChange={(e) => setEditedName(e.target.value)}
                                       placeholder="Enter your full name"
                                       className="w-full bg-[#070b14] border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-600"
                                    />
                                 </div>
                              </div>

                              <div className="space-y-2">
                                 <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5 text-indigo-400" /> Contact Number / WhatsApp
                                 </label>
                                 <div className="relative">
                                    <input
                                       value={editedPhone}
                                       onChange={(e) => setEditedPhone(e.target.value)}
                                       placeholder="Enter your contact number"
                                       className="w-full bg-[#070b14] border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-600"
                                    />
                                 </div>
                              </div>
                           </div>

                           <div className="pt-2 flex justify-end">
                              <button
                                 onClick={handleSaveChanges}
                                 className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                              >
                                 <Save className="w-4 h-4" /> Save Profile Details
                              </button>
                           </div>
                        </div>

                        {/* 4. CHANGE EMAIL SECTION */}
                        <div className="bg-[#0b1120]/80 rounded-3xl border border-slate-800/80 p-6 sm:p-8 space-y-6 shadow-xl">
                           <div className="flex items-center gap-3.5 pb-4 border-b border-slate-800/80">
                              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                                 <Mail className="w-5 h-5" />
                              </div>
                              <div>
                                 <h4 className="text-base sm:text-lg font-bold text-white">Change Email Address</h4>
                                 <p className="text-xs text-slate-400">Current active account email: <span className="text-slate-200 font-semibold">{user.email}</span></p>
                              </div>
                           </div>

                           {!isOtpSent ? (
                              <div className="space-y-4">
                                 <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                                       <Mail className="w-3.5 h-3.5 text-cyan-400" /> New Email Address
                                    </label>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                       <input
                                          type="email"
                                          placeholder="Enter your new email address"
                                          value={newEmail}
                                          onChange={(e) => setNewEmail(e.target.value)}
                                          className="flex-grow bg-[#070b14] border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-3 text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-slate-600"
                                       />
                                       <button
                                          onClick={handleSendOTP}
                                          disabled={isVerifying}
                                          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                       >
                                          <Send className="w-3.5 h-3.5" />
                                          {isVerifying ? "Sending OTP..." : "Send Verification Code"}
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           ) : (
                              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 sm:p-6 bg-cyan-950/20 border border-cyan-500/30 rounded-2xl space-y-4">
                                 <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                                    <Sparkles className="w-4 h-4" /> Verification code sent to {newEmail}
                                 </div>
                                 <p className="text-xs text-slate-400">Please check your inbox or spam folder for the 6-digit verification code.</p>
                                 <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                       placeholder="• • • • • •"
                                       maxLength={6}
                                       value={otpInput}
                                       onChange={(e) => setOtpInput(e.target.value)}
                                       className="flex-grow bg-[#070b14] border border-cyan-500/50 rounded-xl px-4 py-3 text-center text-xl font-black tracking-[0.5em] text-white outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                                    />
                                    <button
                                       onClick={handleVerifyOTP}
                                       className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
                                    >
                                       <CheckCircle2 className="w-4 h-4" /> Verify & Update Email
                                    </button>
                                 </div>
                                 <button
                                    onClick={() => setIsOtpSent(false)}
                                    className="text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors inline-block"
                                 >
                                    ← Cancel & use a different email
                                 </button>
                              </motion.div>
                           )}
                        </div>

                        {/* 5. CHANGE PASSWORD SECTION */}
                        <div className="bg-[#0b1120]/80 rounded-3xl border border-slate-800/80 p-6 sm:p-8 space-y-6 shadow-xl">
                           <div className="flex items-center gap-3.5 pb-4 border-b border-slate-800/80">
                              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                                 <Lock className="w-5 h-5" />
                              </div>
                              <div>
                                 <h4 className="text-base sm:text-lg font-bold text-white">Password & Security</h4>
                                 <p className="text-xs text-slate-400">Ensure your account uses a strong, secure password</p>
                              </div>
                           </div>

                           {!isPassOtpSent ? (
                              <div className="space-y-5">
                                 <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                                       <Key className="w-3.5 h-3.5 text-purple-400" /> Current Password
                                    </label>
                                    <input
                                       type="password"
                                       placeholder="Enter your current password"
                                       value={passData.current}
                                       onChange={(e) => setPassData({ ...passData, current: e.target.value })}
                                       className="w-full bg-[#070b14] border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-3 text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-slate-600"
                                    />
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                       <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                                          <Lock className="w-3.5 h-3.5 text-purple-400" /> New Password
                                       </label>
                                       <input
                                          type="password"
                                          placeholder="Enter new password (min. 6 chars)"
                                          value={passData.new}
                                          onChange={(e) => setPassData({ ...passData, new: e.target.value })}
                                          className="w-full bg-[#070b14] border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-3 text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-slate-600"
                                       />
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                                          <Lock className="w-3.5 h-3.5 text-purple-400" /> Confirm New Password
                                       </label>
                                       <input
                                          type="password"
                                          placeholder="Repeat new password"
                                          value={passData.confirm}
                                          onChange={(e) => setPassData({ ...passData, confirm: e.target.value })}
                                          className="w-full bg-[#070b14] border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-3 text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-slate-600"
                                       />
                                    </div>
                                 </div>

                                 <div className="pt-2 flex justify-end">
                                    <button
                                       onClick={handleChangePassword}
                                       disabled={isPassVerifying}
                                       className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                    >
                                       <Key className="w-4 h-4" />
                                       {isPassVerifying ? "Sending OTP..." : "Send Verification & Update"}
                                    </button>
                                 </div>
                              </div>
                           ) : (
                              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 sm:p-6 bg-purple-950/20 border border-purple-500/30 rounded-2xl space-y-4">
                                 <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
                                    <Key className="w-4 h-4" /> Verification code sent to {user.email}
                                 </div>
                                 <p className="text-xs text-slate-400">Please enter the 6-digit verification code to confirm changing your password.</p>
                                 <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                       placeholder="• • • • • •"
                                       maxLength={6}
                                       value={passOtpInput}
                                       onChange={(e) => setPassOtpInput(e.target.value)}
                                       className="flex-grow bg-[#070b14] border border-purple-500/50 rounded-xl px-4 py-3 text-center text-xl font-black tracking-[0.5em] text-white outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                                    />
                                    <button
                                       onClick={handleVerifyPasswordChange}
                                       className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 transition-all"
                                    >
                                       <CheckCircle2 className="w-4 h-4" /> Confirm Password Change
                                    </button>
                                 </div>
                                 <button
                                    onClick={() => setIsPassOtpSent(false)}
                                    className="text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors inline-block"
                                 >
                                    ← Cancel & Go Back
                                 </button>
                              </motion.div>
                           )}
                        </div>

                        {/* 6. DANGER ZONE */}
                        <div className="bg-rose-950/20 border border-rose-500/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
                           <div className="flex items-center gap-3.5">
                              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                                 <LogOut className="w-5 h-5" />
                              </div>
                              <div>
                                 <h4 className="text-base font-bold text-white">Log Out Account</h4>
                                 <p className="text-xs text-slate-400">Sign out from this browser session. Your course progress is saved automatically.</p>
                              </div>
                           </div>
                           <button
                              onClick={handleLogout}
                              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all shrink-0"
                           >
                              <LogOut className="w-4 h-4" /> Sign Out
                           </button>
                        </div>
                     </motion.div>
                  ) : activeNav === "LMS" ? (
                     !isEnrolled ? (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto py-16 px-4 sm:px-6 text-center space-y-6">
                           <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-4xl text-amber-400 flex items-center justify-center mx-auto shadow-xl">
                              🔒
                           </div>
                           <div className="space-y-3">
                              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">Learning Portal Locked</h2>
                              <p className="text-sm font-semibold text-slate-400 leading-relaxed">
                                 සියලුම Live Recordings, Study Materials සහ Assignments නැරඹීමට ඔබගේ ගෙවීම Admin විසින් Approve කළ යුතුය.
                                 <br />
                                 <span className="text-xs text-slate-500 mt-1 block">Full LMS archive and course assignments are unlocked once your payment receipt is approved.</span>
                              </p>
                           </div>
                           <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
                              <span>Payment Status:</span>
                              <span className={user.paymentStatus === "Uploaded" ? "text-amber-400 font-extrabold" : "text-rose-400 font-extrabold"}>
                                 {user.paymentStatus === "Uploaded" ? "Under Review (පරීක්ෂා කරමින් පවතී)" : (user.paymentStatus || "Pending Payment")}
                              </span>
                           </div>
                           <button 
                              onClick={() => setActiveNav("Dashboard")} 
                              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 hover:scale-105 transition-all"
                           >
                              Go to Dashboard & Upload Receipt 💳
                           </button>
                        </motion.div>
                     ) : (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20">
                        {/* Portal Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
                           <div>
                              <h1 className="text-xl sm:text-3xl font-bold text-white tracking-tight">Learning Portal</h1>
                              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Welcome back, <span className="text-emerald-400 font-bold capitalize">{user.name}</span></p>
                           </div>
                           <div className="flex gap-3 w-full sm:w-auto">
                              <button
                                 onClick={() => {
                                    const wa = generalSettings?.socials?.whatsappGroup || (generalSettings?.whatsappNumber ? `https://wa.me/${generalSettings.whatsappNumber.replace(/[^0-9]/g, '')}` : "https://chat.whatsapp.com");
                                    window.open(wa, "_blank");
                                 }}
                                 className="flex-1 sm:flex-none justify-center flex items-center gap-2 sm:gap-3 bg-[#25d366] hover:bg-[#20bd5c] text-white px-4 sm:px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-green-900/20 transition-all"
                              >
                                 <span className="text-base sm:text-lg">💬</span> WhatsApp
                              </button>
                              <button
                                 onClick={() => {
                                    const fb = generalSettings?.socials?.facebook || "https://facebook.com";
                                    window.open(fb, "_blank");
                                 }}
                                 className="flex-1 sm:flex-none justify-center flex items-center gap-2 sm:gap-3 bg-[#1877f2] hover:bg-[#166fe5] text-white px-4 sm:px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/20 transition-all"
                              >
                                 <span className="text-base sm:text-lg">🔵</span> Facebook
                              </button>
                           </div>
                        </div>

                        {/* Course Progress Card */}
                        <div className="bg-[#0f172a] rounded-[3rem] p-10 border border-slate-800/50 shadow-2xl relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-64 h-64 bg-[#2dd4bf]/5 blur-[100px] -z-10"></div>
                           <div className="flex justify-between items-end mb-6">
                              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Course Progress</h3>
                              <span className="text-[#2dd4bf] font-black text-2xl">{progressPercentage}%</span>
                           </div>
                           <div className="h-4 bg-slate-900 rounded-full overflow-hidden mb-8 border border-slate-800">
                              <motion.div
                                 initial={{ width: 0 }}
                                 animate={{ width: `${progressPercentage}%` }}
                                 className="h-full bg-gradient-to-r from-[#0d9488] to-[#2dd4bf] rounded-full shadow-[0_0_15px_#2dd4bf55]"
                              ></motion.div>
                           </div>
                           <div className="flex flex-wrap gap-8">
                              <div className="space-y-1">
                                 <p className="text-lg font-black text-white">{sessions.length}</p>
                                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Modules</p>
                              </div>
                              <div className="w-px h-10 bg-slate-800"></div>
                              <div className="space-y-1">
                                 <p className="text-lg font-black text-white">{sessions.reduce((acc, s) => acc + (s.content?.length || 0), 0)}</p>
                                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Lessons</p>
                              </div>
                              <div className="w-px h-10 bg-slate-800"></div>
                              <div className="space-y-1">
                                 <p className="text-lg font-black text-white">2/4</p>
                                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Videos Watched</p>
                              </div>
                           </div>
                        </div>

                        {/* Portal Navigation Tabs */}
                        <div className="bg-[#0f172a]/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-2 border border-slate-800/80 grid grid-cols-2 sm:flex sm:flex-wrap gap-2 shadow-2xl">
                           {[
                               { id: "Live", label: "Live Recordings", count: liveRecordings.length, icon: Video },
                               { id: "Materials", label: "Study Materials", count: materials.length, icon: BookOpen },
                               { id: "Assignments", label: "Assignments", count: assignments.length, icon: Award },
                               { id: "Referrals", label: "Referrals", count: referrals.length, icon: Share2 }
                           ].map((tab) => {
                               const Icon = tab.icon;
                               const isSelected = portalTab === tab.id;
                               return (
                                  <button
                                     key={tab.id}
                                     onClick={() => setPortalTab(tab.id)}
                                     className={`flex items-center justify-between sm:justify-start gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[11px] uppercase tracking-wider transition-all ${
                                        isSelected
                                           ? 'bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 text-white shadow-xl shadow-indigo-600/30 border border-indigo-400/40 ring-1 ring-indigo-400/30 scale-[1.02]'
                                           : 'bg-slate-900/50 hover:bg-slate-800/70 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700'
                                     }`}
                                  >
                                     <div className="flex items-center gap-2.5">
                                        <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                                        <span>{tab.label}</span>
                                     </div>
                                     {tab.count !== undefined && (
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                           isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'
                                        }`}>
                                           {tab.count}
                                        </span>
                                     )}
                                  </button>
                               );
                           })}
                        </div>

                        {/* Content Section */}
                        <>
                           {portalTab === "Live" && (
                              <div className="space-y-6">
                                 {/* SECTION HEADER */}
                                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a0f1d]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-2xl">
                                    <div className="flex items-center gap-4">
                                       <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold shadow-lg shadow-rose-500/10">
                                          <Video className="w-7 h-7" />
                                       </div>
                                       <div>
                                          <div className="flex items-center gap-2">
                                             <h3 className="text-xl font-black text-white tracking-tight">
                                                Live Class Recordings
                                             </h3>
                                             <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30 uppercase tracking-wider flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                                                HD Library
                                             </span>
                                          </div>
                                          <p className="text-xs text-slate-400 mt-1">
                                             පසුගිය Zoom පන්ති වල Recording වීඩියෝ නැරඹීමට අදාළ වීඩියෝව තෝරන්න
                                          </p>
                                       </div>
                                    </div>

                                    <span className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 self-start sm:self-auto shadow-inner">
                                       {liveRecordings.length} Recorded Session{liveRecordings.length !== 1 ? 's' : ''}
                                    </span>
                                 </div>

                                 {/* VIDEO GRID */}
                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {liveRecordings.map((session, index) => {
                                       const thumb = getYouTubeThumbnail(session.videoUrl || session.url);
                                       return (
                                          <motion.div
                                             key={index}
                                             onClick={() => setActiveVideo(session)}
                                             className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 overflow-hidden shadow-2xl hover:border-indigo-500/50 hover:shadow-indigo-500/10 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                                          >
                                             {/* THUMBNAIL CONTAINER */}
                                             <div className="relative aspect-video bg-slate-950 overflow-hidden flex items-center justify-center">
                                                {thumb ? (
                                                   <img
                                                      src={thumb}
                                                      alt={session.title}
                                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                   />
                                                ) : (
                                                   <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/60 flex items-center justify-center">
                                                      <Video className="w-14 h-14 text-slate-700 group-hover:text-indigo-400 transition-colors" />
                                                   </div>
                                                )}

                                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                                                {/* GLOWING PLAY BUTTON */}
                                                <div className="absolute w-14 h-14 rounded-2xl bg-indigo-600/90 group-hover:bg-indigo-500 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/50 group-hover:scale-110 transition-all">
                                                   <Play className="w-6 h-6 fill-white ml-0.5" />
                                                </div>

                                                {/* TOP BADGES */}
                                                <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                                                   <span className="px-2.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-white text-[10px] font-bold border border-white/10">
                                                      {session.date || "Class Session"}
                                                   </span>
                                                   <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider shadow">
                                                      HD Video
                                                   </span>
                                                </div>
                                             </div>

                                             {/* CARD DETAILS */}
                                             <div className="p-5 space-y-3">
                                                <div className="space-y-1">
                                                   <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                                                      {user?.grade || user?.subject || "Crypto Basic"}
                                                   </span>
                                                   <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
                                                      {session.title}
                                                   </h4>
                                                </div>

                                                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                                                   <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                                                      <Clock className="w-3 h-3 text-slate-500" />
                                                      <span>{session.duration || "Full Class"}</span>
                                                   </span>
                                                   <span className="text-xs font-bold text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                                                      <span>Watch Now</span>
                                                      <span>▶</span>
                                                   </span>
                                                </div>
                                             </div>
                                          </motion.div>
                                       );
                                    })}
                                 </div>

                                 {liveRecordings.length === 0 && (
                                    <div className="text-center p-16 bg-[#0e1424]/90 rounded-3xl border border-slate-800/80 space-y-3">
                                       <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                                          <Video className="w-8 h-8" />
                                       </div>
                                       <h4 className="text-base font-bold text-white">No Live Recordings Available Yet</h4>
                                       <p className="text-xs text-slate-400 max-w-md mx-auto">
                                          මෙම ශ්‍රේණිය සඳහා පටිගත කළ Zoom පන්ති වීඩියෝ මෙතෙක් එක්කර නොමැත. ගුරුවරයා විසින් එක්කළ පසු මෙතැනින් නැරඹිය හැක.
                                       </p>
                                    </div>
                                 )}
                              </div>
                           )}

                           {portalTab === "Materials" && (
                              <div className="space-y-6">
                                 {/* SECTION HEADER */}
                                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a0f1d]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-2xl">
                                    <div className="flex items-center gap-4">
                                       <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold shadow-lg shadow-blue-500/10">
                                          <BookOpen className="w-7 h-7" />
                                       </div>
                                       <div>
                                          <div className="flex items-center gap-2">
                                             <h3 className="text-xl font-black text-white tracking-tight">
                                                Study Materials & Tutes
                                             </h3>
                                             <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30 uppercase tracking-wider">
                                                PDF Library
                                             </span>
                                          </div>
                                          <p className="text-xs text-slate-400 mt-1">
                                             පාඩම් සටහන්, Tute papers සහ ප්‍රශ්න පත්‍ර බාගත කරගැනීමට මෙතැනින් පිවිසෙන්න
                                          </p>
                                       </div>
                                    </div>

                                    <span className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 self-start sm:self-auto shadow-inner">
                                       {materials.length} Document{materials.length !== 1 ? 's' : ''}
                                    </span>
                                 </div>

                                 {/* MATERIALS CARDS GRID */}
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {materials.map((item, index) => (
                                       <div
                                          key={index}
                                          className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl p-6 border border-slate-800/80 hover:border-blue-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-xl"
                                       >
                                          <div className="flex items-center gap-4">
                                             <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                <FileText className="w-6 h-6" />
                                             </div>
                                             <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                   <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                                                      {item.title}
                                                   </h4>
                                                   <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">
                                                      {item.category || "Study Material"}
                                                   </span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 flex items-center gap-2">
                                                   <span>{item.date || "Latest Resource"}</span>
                                                   <span>•</span>
                                                   <span>Grade {user.grade}</span>
                                                </p>
                                             </div>
                                          </div>

                                          <div className="flex items-center gap-2 self-end sm:self-auto">
                                             {item.videoUrl && (
                                                <a
                                                   href={item.videoUrl}
                                                   target="_blank"
                                                   rel="noreferrer"
                                                   className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all"
                                                >
                                                   <Eye className="w-3.5 h-3.5 text-slate-400" />
                                                   <span>View</span>
                                                </a>
                                             )}
                                             <a
                                                href={item.videoUrl || "#"}
                                                target="_blank"
                                                rel="noreferrer"
                                                download
                                                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 flex items-center gap-1.5 transition-all active:scale-95"
                                             >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                                <span>Download</span>
                                             </a>
                                          </div>
                                       </div>
                                    ))}
                                 </div>

                                 {materials.length === 0 && (
                                    <div className="text-center p-16 bg-[#0e1424]/90 rounded-3xl border border-slate-800/80 space-y-3">
                                       <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                                          <BookOpen className="w-8 h-8" />
                                       </div>
                                       <h4 className="text-base font-bold text-white">No Study Materials Available Yet</h4>
                                       <p className="text-xs text-slate-400 max-w-md mx-auto">
                                          මෙම ශ්‍රේණිය සඳහා පාඩම් සටහන් හෝ Tutes මෙතෙක් එක්කර නොමැත. ගුරුවරයා විසින් upload කළ පසු මෙතැනින් ලබාගත හැක.
                                       </p>
                                    </div>
                                 )}
                              </div>
                           )}


                           {portalTab === "Assignments" && (
                              <AssignmentView
                                 assignments={assignments}
                                 user={user}
                                 assignmentSubmissions={assignmentSubmissions}
                                 activeAssignment={activeAssignment}
                                 setActiveAssignment={setActiveAssignment}
                                 currentTaskIndex={currentTaskIndex}
                                 setCurrentTaskIndex={setCurrentTaskIndex}
                                 studentAnswers={studentAnswers}
                                 handleAnswerChange={handleAnswerChange}
                                 handleDiagramUpload={handleDiagramUpload}
                                 handleSubmitAssignment={handleSubmitAssignment}
                                 handleOpenAssignment={handleOpenAssignment}
                                 showSubmitModal={showSubmitModal}
                                 setShowSubmitModal={setShowSubmitModal}
                                 isSubmittingAssignment={isSubmittingAssignment}
                                 viewingSubmittedMode={viewingSubmittedMode}
                                 setViewingSubmittedMode={setViewingSubmittedMode}
                                 uploadingDiagram={uploadingDiagram}
                                 showReferenceSheet={showReferenceSheet}
                                 setShowReferenceSheet={setShowReferenceSheet}
                              />
                           )}

                           {portalTab === "Referrals" && (() => {
                              try {
                                 const currentStudentGrade = user?.grade || user?.subject || "Crypto Basic";
                                 const myReferralCode = user?.studentId ? String(user.studentId).trim() : (user?.email ? String(user.email).split("@")[0].toUpperCase() : "STU-2026");
                                 const myReferralLink = `${window.location.origin}/register?ref=${encodeURIComponent(myReferralCode)}`;
                                 
                                 let allStudentsList = [];
                                 try {
                                    const rawStudents = JSON.parse(localStorage.getItem("studentRequests") || "[]");
                                    allStudentsList = Array.isArray(rawStudents) ? rawStudents : [];
                                 } catch (e) {
                                    allStudentsList = [];
                                 }
                                 
                                 const referredFriends = allStudentsList.filter(s => {
                                    if (!s || !s.referredBy) return false;
                                    const refClean = String(s.referredBy).trim().toUpperCase();
                                 return (
                                    refClean === myReferralCode.toUpperCase() ||
                                    refClean === `REF-${myReferralCode}`.toUpperCase() ||
                                    (user?.studentId && refClean === user.studentId.toUpperCase())
                                 );
                              });

                              const currentRefConfig = referralConfig || {
                                 active: true,
                                 rewardAmount: "Rs. 500 Discount",
                                 rewardDesc: "Earn Rs. 500 fee discount for every friend who registers and enrolls in class.",
                                 noticeSi: "ඔබගේ මිතුරන්ට Taizer LMS වෙත ආරාධනා කර පාඨමාලා ගාස්තු වට්ටම් දිනාගන්න!"
                              };

                              const handleCopyCode = () => {
                                 navigator.clipboard.writeText(myReferralCode);
                                 setCopiedRefCode(true);
                                 setTimeout(() => setCopiedRefCode(false), 2200);
                              };

                              const handleCopyLink = () => {
                                 navigator.clipboard.writeText(myReferralLink);
                                 setCopiedRefLink(true);
                                 setTimeout(() => setCopiedRefLink(false), 2200);
                              };

                              const handleShareWhatsApp = () => {
                                 const rewardText = currentRefConfig.rewardAmount || "Rs. 500 Discount";
                                 const message = `👋 Hey! Join me at Taizer LMS for Crypto & Trading masterclasses.\n\n🎁 Register using my referral link or code: *${myReferralCode}* to get ${rewardText} bonus!\n\n🔗 Join Link: ${myReferralLink}`;
                                 window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, "_blank");
                              };

                              const handleNativeShare = async () => {
                                 if (navigator.share) {
                                    try {
                                       await navigator.share({
                                          title: "Join Taizer LMS",
                                          text: `Join me at Taizer LMS! Use referral code: ${myReferralCode}`,
                                          url: myReferralLink,
                                       });
                                    } catch (e) {}
                                 } else {
                                    handleCopyLink();
                                 }
                              };

                              return (
                                 <div className="space-y-8 animate-fadeIn">
                                    {!currentRefConfig.active && (
                                       <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2.5">
                                          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                                          <span>The referral reward program is currently paused by the administrator for review.</span>
                                       </div>
                                    )}

                                    {/* 1. HERO BANNER */}
                                    <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950/80 via-blue-950/70 to-purple-950/80 rounded-3xl p-6 sm:p-10 border border-indigo-500/20 shadow-2xl backdrop-blur-xl">
                                       <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                                       <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                          <div className="space-y-3 max-w-2xl">
                                             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[11px] font-black uppercase tracking-wider">
                                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                                <span>Student Ambassador Program</span>
                                             </div>
                                             <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                                                Invite Friends & Earn Rewards <br />
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">
                                                   {currentRefConfig.noticeSi || "මිතුරන්ට ආරාධනා කර ගාස්තු වට්ටම් දිනාගන්න!"}
                                                </span>
                                             </h3>
                                             <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                                                {currentRefConfig.rewardDesc || "Share your referral code with classmates. Whenever a friend signs up with your link or code and gets enrolled, enjoy fee discounts on your next month fee!"}
                                             </p>
                                          </div>

                                          {/* Reward Callout Chip */}
                                          <div className="shrink-0 bg-[#070b14]/80 p-5 rounded-2xl border border-indigo-500/30 shadow-xl text-center space-y-1 min-w-[180px]">
                                             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reward Per Friend</p>
                                             <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                                                {currentRefConfig.rewardAmount || "Rs. 500 Off"}
                                             </p>
                                             <p className="text-[10px] font-bold text-slate-400">Fee Waiver / Discount</p>
                                          </div>
                                       </div>
                                    </div>

                                    {/* 2. REFERRAL CODE & SHARE LINK STATION */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                       {/* Box A: My Referral Code */}
                                       <div className="bg-[#0f172a]/70 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-slate-800/80 shadow-xl space-y-4 hover:border-indigo-500/30 transition-all">
                                          <div className="flex items-center gap-3">
                                             <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                                                <Gift className="w-5 h-5" />
                                             </div>
                                             <div>
                                                <h4 className="text-sm font-black text-white">Your Unique Referral Code</h4>
                                                <p className="text-[11px] text-slate-400 font-medium">ඔබේ මිතුරු ඇරයුම් කේතය</p>
                                             </div>
                                          </div>

                                          <div className="flex items-center justify-between gap-3 p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800">
                                             <span className="font-mono text-lg font-black tracking-widest text-indigo-400 pl-2">
                                                {myReferralCode}
                                             </span>
                                             <button
                                                onClick={handleCopyCode}
                                                className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
                                                   copiedRefCode
                                                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                                                      : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                                                }`}
                                             >
                                                {copiedRefCode ? (
                                                   <>
                                                      <Check className="w-3.5 h-3.5" />
                                                      <span>Copied!</span>
                                                   </>
                                                ) : (
                                                   <>
                                                      <Copy className="w-3.5 h-3.5" />
                                                      <span>Copy Code</span>
                                                   </>
                                                )}
                                             </button>
                                          </div>
                                          <p className="text-[11px] text-slate-500 font-medium">
                                             Give this code to friends so they can enter it when signing up on the registration page.
                                          </p>
                                       </div>

                                       {/* Box B: Direct Invite Link & Quick Share */}
                                       <div className="bg-[#0f172a]/70 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-slate-800/80 shadow-xl space-y-4 hover:border-indigo-500/30 transition-all">
                                          <div className="flex items-center gap-3">
                                             <div className="w-10 h-10 rounded-xl bg-sky-600/20 border border-sky-500/30 text-sky-400 flex items-center justify-center">
                                                <Share2 className="w-5 h-5" />
                                             </div>
                                             <div>
                                                <h4 className="text-sm font-black text-white">Shareable Invite Link</h4>
                                                <p className="text-[11px] text-slate-400 font-medium">සෘජු ලියාපදිංචි වීමේ ලින්ක් එක</p>
                                             </div>
                                          </div>

                                          <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-900/90 rounded-2xl border border-slate-800">
                                             <input
                                                type="text"
                                                readOnly
                                                value={myReferralLink}
                                                className="bg-transparent text-xs text-slate-300 font-mono px-2 py-1 outline-none w-full truncate"
                                             />
                                             <button
                                                onClick={handleCopyLink}
                                                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs shrink-0 flex items-center gap-1.5 transition-all"
                                             >
                                                {copiedRefLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                                <span>{copiedRefLink ? "Copied" : "Copy"}</span>
                                             </button>
                                          </div>

                                          {/* Quick Share Buttons */}
                                          <div className="flex items-center gap-3 pt-1">
                                             <button
                                                onClick={handleShareWhatsApp}
                                                className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba57] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 transition-transform active:scale-95"
                                             >
                                                <Phone className="w-4 h-4" />
                                                <span>Share on WhatsApp</span>
                                             </button>
                                             <button
                                                onClick={handleNativeShare}
                                                className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-transform active:scale-95"
                                             >
                                                <Share2 className="w-4 h-4" />
                                                <span className="hidden sm:inline">Share</span>
                                             </button>
                                          </div>
                                       </div>
                                    </div>

                                    {/* 3. LIVE STATS CARDS */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                       <div className="bg-[#0f172a]/60 rounded-2xl p-5 border border-slate-800/80 flex items-center gap-4">
                                          <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                                             <Users className="w-6 h-6" />
                                          </div>
                                          <div>
                                             <p className="text-2xl font-black text-white">{referredFriends.length}</p>
                                             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Friends Referred</p>
                                          </div>
                                       </div>

                                       <div className="bg-[#0f172a]/60 rounded-2xl p-5 border border-slate-800/80 flex items-center gap-4">
                                          <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                             <Award className="w-6 h-6" />
                                          </div>
                                          <div>
                                             <p className="text-2xl font-black text-emerald-400">
                                                Rs. {(referredFriends.length * 500).toLocaleString()}
                                             </p>
                                             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estimated Rewards</p>
                                          </div>
                                       </div>

                                       <div className="bg-[#0f172a]/60 rounded-2xl p-5 border border-slate-800/80 flex items-center gap-4">
                                          <div className="w-12 h-12 rounded-xl bg-amber-600/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                                             <Sparkles className="w-6 h-6" />
                                          </div>
                                          <div>
                                             <p className="text-base font-black text-white">
                                                {referredFriends.length >= 5 ? "Gold Ambassador 🥇" : referredFriends.length >= 1 ? "Active Referrer 🥈" : "Starter 🌱"}
                                             </p>
                                             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ambassador Rank</p>
                                          </div>
                                       </div>
                                    </div>

                                    {/* 4. REFERRED FRIENDS ACTIVITY LIST */}
                                    <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-slate-800/80 shadow-2xl space-y-4">
                                       <div className="flex items-center justify-between">
                                          <div>
                                             <h4 className="text-base font-black text-white flex items-center gap-2">
                                                <Users className="w-4 h-4 text-indigo-400" />
                                                <span>Referred Friends Roster / ඔබ සම්බන්ධ කළ මිතුරන්</span>
                                             </h4>
                                             <p className="text-xs text-slate-400 font-medium">
                                                Friends who signed up with your referral code
                                             </p>
                                          </div>
                                          <span className="px-3 py-1 rounded-full bg-slate-900 text-indigo-400 border border-slate-800 text-xs font-bold">
                                             {referredFriends.length} Joined
                                          </span>
                                       </div>

                                       {referredFriends.length > 0 ? (
                                          <div className="divide-y divide-slate-800/60 rounded-2xl border border-slate-800/80 overflow-hidden">
                                             {referredFriends.map((f, i) => (
                                                <div key={i} className="p-4 bg-slate-900/40 hover:bg-slate-800/30 flex items-center justify-between transition-colors">
                                                   <div className="flex items-center gap-3">
                                                      <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-300 font-bold text-xs flex items-center justify-center">
                                                         {f.name ? f.name.charAt(0).toUpperCase() : "S"}
                                                      </div>
                                                      <div>
                                                         <p className="text-xs sm:text-sm font-bold text-white">{f.name || "Student"}</p>
                                                         <p className="text-[10px] text-slate-400 font-mono">
                                                            {f.studentId || "Student ID Pending"} • {f.grade || currentStudentGrade}
                                                         </p>
                                                      </div>
                                                   </div>
                                                   <div className="text-right">
                                                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                         f.status === "Approved" || f.paymentStatus === "Approved"
                                                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                      }`}>
                                                         {f.status === "Approved" || f.paymentStatus === "Approved" ? "Enrolled ✔" : "Pending Approval ⏳"}
                                                      </span>
                                                      <p className="text-[10px] text-slate-500 mt-1">{f.joined ? f.joined.split(",")[0] : "Recently"}</p>
                                                   </div>
                                                </div>
                                             ))}
                                          </div>
                                       ) : (
                                          <div className="py-12 text-center bg-slate-900/30 rounded-2xl border border-slate-800/60 border-dashed space-y-2">
                                             <Gift className="w-8 h-8 text-slate-600 mx-auto" />
                                             <p className="text-xs font-bold text-slate-400">තවම මිතුරන් සම්බන්ධ වී නොමැත (No friends referred yet)</p>
                                             <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                                                ඉහත ඇති ඔබගේ කේතය හෝ WhatsApp Share Link එක මිතුරන්ට යවා පන්ති ගාස්තු වට්ටම් ලබාගන්න!
                                             </p>
                                          </div>
                                       )}
                                    </div>

                                    {/* 5. CURATED STUDY PARTNER & RESOURCE LINKS */}
                                    <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-slate-800/80 shadow-2xl space-y-5">
                                       <div>
                                          <h4 className="text-base font-black text-white flex items-center gap-2">
                                             <ExternalLink className="w-4 h-4 text-sky-400" />
                                             <span>Official Recommended Communities & Study Links</span>
                                          </h4>
                                          <p className="text-xs text-slate-400 font-medium">
                                             Verified revision channels, model paper discussion groups, and student resources
                                          </p>
                                       </div>

                                       {referrals.length > 0 ? (
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             {(Array.isArray(referrals) ? referrals : []).map((item, index) => (
                                                <div key={index} className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 hover:border-sky-500/30 transition-all flex flex-col justify-between space-y-4 group">
                                                   <div className="flex items-start gap-4">
                                                      <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                                                         🤝
                                                      </div>
                                                      <div className="space-y-1 min-w-0">
                                                         <span className="px-2 py-0.5 rounded-md bg-slate-800 text-sky-400 border border-slate-700 text-[9px] font-black uppercase tracking-widest">
                                                            {item.category || "Study Partner"}
                                                         </span>
                                                         <h5 className="text-sm font-black text-white truncate">{item.title}</h5>
                                                         {item.description && (
                                                            <p className="text-[11px] text-slate-400 line-clamp-2">{item.description}</p>
                                                         )}
                                                      </div>
                                                   </div>

                                                   <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                                                      <span className="text-[10px] text-slate-500 font-mono truncate max-w-[180px]">
                                                         {item.url || item.videoUrl || "External Resource"}
                                                      </span>
                                                      <a
                                                         href={item.url || item.videoUrl || "#"}
                                                         target="_blank"
                                                         rel="noreferrer"
                                                         className="px-4 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-sky-600/20 transition-all shrink-0"
                                                      >
                                                         <span>Join / Visit</span>
                                                         <ExternalLink className="w-3 h-3" />
                                                      </a>
                                                   </div>
                                                </div>
                                             ))}
                                          </div>
                                       ) : (
                                          <div className="py-10 text-center bg-slate-900/30 rounded-2xl border border-slate-800/60 border-dashed">
                                             <p className="text-slate-500 font-bold text-xs">No external partner links added for this grade yet.</p>
                                          </div>
                                       )}
                                    </div>
                                 </div>
                              );
                           } catch (err) {
                              console.error("Referrals render error:", err);
                              return (
                                 <div className="p-8 text-center bg-slate-900/50 rounded-3xl border border-slate-800 space-y-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto text-xl">
                                       🤝
                                    </div>
                                    <h3 className="text-lg font-bold text-white">Student Referrals & Rewards</h3>
                                    <p className="text-xs text-slate-400">Loading referral configuration...</p>
                                 </div>
                              );
                           }
                        })()}
                        </>
                     </motion.div>
                     )
                  ) : activeNav === "Discussions" || activeNav === "Group Chat" ? (
                     !isEnrolled ? (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto py-16 px-4 sm:px-6 text-center space-y-6">
                           <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-4xl text-amber-400 flex items-center justify-center mx-auto shadow-xl">
                              🔒
                           </div>
                           <div className="space-y-3">
                              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">{activeNav} Locked</h2>
                              <p className="text-sm font-semibold text-slate-400 leading-relaxed">
                                 {activeNav === "Discussions" ? "සාකච්ඡා මණ්ඩපයට (Discussions) ප්‍රවේශ වීමට" : "ශිෂ්‍ය සමූහ කතාබහට (Group Chat) ප්‍රවේශ වීමට"} ඔබගේ ගෙවීම Admin විසින් Approve කළ යුතුය.
                                 <br />
                                 <span className="text-xs text-slate-500 mt-1 block">Community discussions and peer chats will be unlocked as soon as your payment is approved.</span>
                              </p>
                           </div>
                           <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
                              <span>Payment Status:</span>
                              <span className={user.paymentStatus === "Uploaded" ? "text-amber-400 font-extrabold" : "text-rose-400 font-extrabold"}>
                                 {user.paymentStatus === "Uploaded" ? "Under Review (පරීක්ෂා කරමින් පවතී)" : (user.paymentStatus || "Pending Payment")}
                              </span>
                           </div>
                           <button 
                              onClick={() => setActiveNav("Dashboard")} 
                              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 hover:scale-105 transition-all"
                           >
                              Go to Dashboard & Upload Receipt 💳
                           </button>
                        </motion.div>
                     ) : activeNav === "Discussions" ? (
                        <DiscussionsView user={user} />
                     ) : (
                        <GradeGroupChatView user={user} />
                     )
                  ) : (
                     <div className="text-center p-20 text-slate-500 italic font-black text-xl">
                        {isEnrolled ? "Section under development." : "Please complete payment to access this section."}
                     </div>
                  )
                  }
               </div>
            </main>
         </div>

         {/* VIDEO PLAYER OVERLAY */}
         <AnimatePresence>
            {activeVideo && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/95 z-[2000] flex flex-col font-sans text-white"
               >
                  {/* Top Bar */}
                  <div className="h-14 sm:h-16 bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 sm:px-8 shrink-0 z-10">
                     <div className="flex items-center gap-4 min-w-0">
                        <button
                           onClick={() => setActiveVideo(null)}
                           className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group px-3 py-1.5 rounded-xl hover:bg-white/5 shrink-0"
                        >
                           <span className="text-xl group-hover:-translate-x-1 transition-transform">‹</span>
                           <span className="text-[11px] font-black uppercase tracking-wider hidden sm:inline">Close</span>
                        </button>
                        <div className="h-5 w-px bg-white/10 shrink-0"></div>
                        <div className="min-w-0 truncate">
                           <h3 className="text-xs sm:text-sm font-bold text-white truncate max-w-md sm:max-w-xl">
                              {activeVideo.title || "Video Player"}
                           </h3>
                           <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-[#2dd4bf] px-1.5 py-0.5 bg-[#2dd4bf]/10 rounded border border-[#2dd4bf]/20">
                                 {activeVideo.fileType?.includes('image') ? 'Image' : 
                                  activeVideo.fileType?.includes('video') || activeVideo.type === 'video' ? 'Video Player' : 
                                  activeVideo.fileType?.includes('pdf') ? 'PDF' : 'Live Class Recording'}
                              </span>
                              {activeVideo.date && (
                                 <span className="text-[10px] text-slate-400 font-medium">
                                    • {activeVideo.date}
                                 </span>
                              )}
                              {activeVideo.duration && (
                                 <span className="text-[10px] text-slate-400 font-medium">
                                    • {activeVideo.duration}
                                 </span>
                              )}
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center gap-2 shrink-0">
                        {(activeVideo.videoUrl || activeVideo.url) && (
                           <a
                              href={activeVideo.videoUrl || activeVideo.url}
                              target="_blank"
                              rel="noreferrer"
                              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-[11px] font-bold transition-all"
                              title="Open original video in new tab"
                           >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Open in Tab</span>
                           </a>
                        )}
                        <button
                           onClick={() => setActiveVideo(null)}
                           className="w-9 h-9 sm:w-10 sm:h-10 bg-white/5 hover:bg-rose-500 rounded-xl flex items-center justify-center transition-all text-slate-400 hover:text-white text-sm"
                           title="Close (Esc)"
                        >
                           ✕
                        </button>
                     </div>
                  </div>

                  {/* Video Area: Centered, auto-scaling to screen height & width without cut-offs */}
                  <div className="flex-1 min-h-0 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
                     <div
                        style={{
                           maxHeight: 'calc(100vh - 84px)',
                           maxWidth: 'calc((100vh - 84px) * 16 / 9)'
                        }}
                        className="w-full aspect-video max-w-6xl bg-black rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative flex items-center justify-center group"
                     >
                        {activeVideo.fileData ? (
                           <div className="w-full h-full flex flex-col items-center justify-center bg-black">
                              {activeVideo.fileType?.includes('image') && (
                                 <img src={activeVideo.fileData} className="max-w-full max-h-full object-contain p-2" alt={activeVideo.title} />
                              )}
                              {activeVideo.fileType?.includes('video') && (
                                 <video
                                    src={activeVideo.fileData}
                                    controls
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-contain bg-black"
                                    controlsList="nodownload"
                                 />
                              )}
                              {activeVideo.fileType?.includes('pdf') && (
                                 <iframe src={activeVideo.fileData} className="w-full h-full border-none" title="PDF Viewer" />
                              )}
                              <div className="absolute bottom-4 right-4 flex gap-2">
                                 <a
                                    href={activeVideo.fileData}
                                    download={activeVideo.fileName || 'download'}
                                    className="px-4 py-2 bg-blue-600/90 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg hover:bg-blue-500 transition-all"
                                 >
                                    Download File
                                 </a>
                              </div>
                           </div>
                         ) : (activeVideo.videoUrl || activeVideo.url) ? (
                            isDirectVideo(activeVideo.videoUrl || activeVideo.url) ? (
                               <video
                                  key={activeVideo.videoUrl || activeVideo.url}
                                  src={activeVideo.videoUrl || activeVideo.url}
                                  controls
                                  autoPlay
                                  playsInline
                                  className="w-full h-full object-contain bg-black"
                                  controlsList="nodownload"
                               />
                            ) : (
                               <iframe
                                  src={formatVideoUrl(activeVideo.videoUrl || activeVideo.url)}
                                  className="w-full h-full border-none block"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen
                               ></iframe>
                            )
                        ) : (
                           <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6 text-center">
                              <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-3xl">⚠️</div>
                              <div>
                                 <p className="text-base font-bold text-white">Content Missing</p>
                                 <p className="text-xs text-slate-400 mt-1">Please contact your teacher or administrator to update this video module.</p>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>


          {/* FLOATING CHAT BUTTON */}
          {!activeAssignment && (
             <button
                onClick={() => {
                   setIsChatOpen(!isChatOpen);
                   if (!isChatOpen) markAdminAsRead();
                }}
                className="fixed bottom-20 right-4 sm:bottom-10 sm:right-10 w-14 h-14 sm:w-20 sm:h-20 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl sm:rounded-[2rem] flex items-center justify-center text-2xl sm:text-3xl shadow-2xl hover:scale-110 transition-all z-[60] group"
             >
                <div className="absolute inset-0 bg-blue-500/10 rounded-[2rem] blur-xl group-hover:bg-blue-500/20 transition-all"></div>
                <span className="relative z-10">💬</span>
                {messages.filter(m => m.sender === 'admin' && !m.isRead).length > 0 && (
                   <div className="absolute -top-1 -right-1 w-8 h-8 bg-rose-600 text-white text-[10px] font-black flex items-center justify-center rounded-full shadow-lg animate-bounce border-2 border-[#020617] z-20">
                      {messages.filter(m => m.sender === 'admin' && !m.isRead).length}
                   </div>
                )}
             </button>
          )}

         {/* CHAT WINDOW */}
         <AnimatePresence>
            {isChatOpen && (
               <motion.div
                  initial={{ opacity: 0, x: 100, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 100, scale: 0.9 }}
                  className="fixed bottom-0 sm:bottom-10 right-0 sm:right-10 w-full sm:w-[400px] h-[85vh] sm:h-[600px] bg-[#0f172a]/95 backdrop-blur-2xl rounded-t-[2.5rem] sm:rounded-[3.5rem] border border-white/10 shadow-2xl z-[70] flex flex-col overflow-hidden"
               >
                  <div className="p-8 bg-[#1e293b] border-b border-slate-800 flex justify-between items-center">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black">A</div>
                        <div><h4 className="font-black text-sm">Academy Support</h4><p className="text-[10px] text-emerald-500 font-bold uppercase">Online Now</p></div>
                     </div>
                     <button onClick={() => setIsChatOpen(false)} className="text-slate-500 hover:text-white font-black">✕</button>
                  </div>

                  <div className="flex-grow overflow-y-auto p-8 space-y-4 scrollbar-hide bg-[#0b141a] bg-opacity-95" style={{ backgroundImage: 'url("https://w0.peakpx.com/wallpaper/580/650/HD-wallpaper-whatsapp-dark-background-patterns-texture.jpg")', backgroundBlendMode: 'overlay' }}>
                     {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
                           <div className={`max-w-[80%] space-y-1 flex flex-col ${msg.sender === 'student' ? 'items-end' : 'items-start'}`}>
                              <div className={`px-4 py-3 rounded-2xl text-[13px] font-medium shadow-md relative ${msg.sender === 'student' ? 'bg-[#005c4b] text-slate-100 rounded-br-none' : 'bg-[#202c33] text-slate-200 rounded-bl-none'}`}>
                                 {msg.attachment && (
                                    <div className="mb-3">
                                       {msg.attachment.type === "image" ? (
                                          <img src={msg.attachment.data} className="max-w-full rounded-xl border border-black/20" alt="attachment" />
                                       ) : (
                                          <a href={msg.attachment.data} download={msg.attachment.name} className="flex items-center gap-3 bg-black/20 p-3 rounded-xl hover:bg-black/30 transition-all">
                                             <span className="text-lg">📄</span>
                                             <div className="text-left">
                                                <p className="text-[9px] font-black uppercase truncate max-w-[120px]">{msg.attachment.name}</p>
                                                <p className="text-[7px] opacity-50 uppercase">Download</p>
                                             </div>
                                          </a>
                                       )}
                                    </div>
                                 )}
                                 {msg.text}
                                 <div className="flex items-center justify-end gap-1 mt-1">
                                    <p className="text-[9px] opacity-60 font-bold uppercase">{msg.time || (msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '')}</p>
                                    {msg.sender === "student" && <span className="text-[10px] text-blue-400">✓✓</span>}
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                     <div ref={chatEndRef} />
                  </div>

                  <div className="px-4 py-4 bg-[#202c33]">
                     <AnimatePresence>
                        {isEmojiOpen && (
                           <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute bottom-full left-2 sm:left-4 right-2 sm:right-auto mb-4 bg-[#233138] border border-slate-700 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl z-50 grid grid-cols-6 gap-1 sm:gap-2"
                           >
                              {["😊", "😂", "🚀", "🔥", "👍", "💡", "📚", "🎯", "🎓", "✅", "⚠️", "❌", "😍", "🙂", "🙄", "🤗", "🌎", "🌺", "🌹", "❤️", "👋", "🙏", "👏", "🙌", "✨", "⭐", "🎉", "🎈"].map(emoji => (
                                 <button type="button" key={emoji} onClick={() => { setChatText(prev => prev + emoji); chatInputRef.current?.focus(); }} className="text-xl hover:scale-125 transition-transform p-1">{emoji}</button>
                              ))}
                           </motion.div>
                        )}
                     </AnimatePresence>

          <form onSubmit={handleSendMessage} className="bg-[#2a3942] rounded-2xl px-3 py-2 flex items-center gap-2">
                        <button type="button" onClick={() => setIsEmojiOpen(!isEmojiOpen)} className="text-slate-400 hover:text-slate-200 text-lg transition-all">😊</button>
                        <label className="text-slate-400 hover:text-slate-200 text-lg cursor-pointer transition-all">
                           📎
                           <input type="file" className="hidden" onChange={handleFileUpload} />
                        </label>
                        <input
                           ref={chatInputRef}
                           value={chatText}
                           onChange={(e) => setChatText(e.target.value)}
                           placeholder="Type a message"
                           className="flex-grow bg-transparent border-none py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500"
                        />
                        <button type="submit" className="w-10 h-10 bg-[#00a884] hover:bg-[#06cf9c] text-white rounded-full flex items-center justify-center shadow-lg transition-all">➤</button>
                     </form>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         

{/* SESSION QUIZ OVERLAY */}
          <AnimatePresence>
             {activeQuiz && (
                <div className="fixed inset-0 bg-[#020617]/95 backdrop-blur-3xl z-[3000] flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
                   <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      className="bg-[#0f172a] rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] w-full max-w-[800px] p-6 sm:p-12 md:p-16 border border-slate-800 shadow-2xl relative overflow-hidden my-auto"
                   >
                      <button onClick={() => setActiveQuiz(null)} className="absolute top-10 right-10 w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-rose-500 transition-all text-sm">✕</button>
                      
                      <div className="space-y-12">
                         <div className="space-y-4">
                            <span className="px-5 py-2 bg-blue-600/10 text-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-500/20">Module Quiz</span>
                            <h3 className="text-3xl font-black text-white leading-tight italic">{activeQuiz.question}</h3>
                            <p className="text-slate-400 font-bold text-sm">{activeQuiz.questionSi}</p>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(activeQuiz.options || []).map((opt, i) => (
                               <button 
                                  key={i} 
                                  disabled={quizRevealed}
                                  onClick={() => {
                                     setSelectedQuizAnswer(i);
                                     setQuizRevealed(true);
                                  }} 
                                  className={`p-8 rounded-[2.5rem] text-left transition-all group font-bold border-2 relative ${
                                     quizRevealed 
                                        ? i === activeQuiz.correctIndex 
                                           ? 'bg-emerald-500/10 border-emerald-500 text-white' 
                                           : i === selectedQuizAnswer 
                                              ? 'bg-rose-500/10 border-rose-500 text-white' 
                                              : 'bg-slate-900 border-slate-800 opacity-50'
                                        : 'bg-slate-900 hover:bg-blue-600 border-slate-800 hover:border-blue-500 text-white'
                                  }`}
                               >
                                  <div className="flex items-center gap-6">
                                     <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${quizRevealed && i === activeQuiz.correctIndex ? 'bg-emerald-500' : 'bg-slate-800'}`}>
                                        {i + 1}
                                     </span>
                                     <span>{opt}</span>
                                  </div>
                               </button>
                            ))}
                         </div>

                         {quizRevealed && (
                            <motion.div 
                               initial={{ opacity: 0, height: 0 }}
                               animate={{ opacity: 1, height: 'auto' }}
                               className={`p-10 rounded-[3rem] border-2 space-y-4 ${selectedQuizAnswer === activeQuiz.correctIndex ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}
                            >
                               <div className="flex items-center gap-4">
                                  <span className="text-2xl">{selectedQuizAnswer === activeQuiz.correctIndex ? '✅' : '❌'}</span>
                                  <h4 className={`text-xl font-black italic uppercase ${selectedQuizAnswer === activeQuiz.correctIndex ? 'text-emerald-500' : 'text-rose-500'}`}>
                                     {selectedQuizAnswer === activeQuiz.correctIndex ? 'Correct Answer!' : 'Incorrect Choice'}
                                  </h4>
                               </div>
                               <div className="space-y-4 pt-4 border-t border-white/5">
                                  <p className="text-sm font-bold text-slate-300 leading-relaxed">{activeQuiz.explanation}</p>
                                  <p className="text-xs font-bold text-slate-500 italic leading-relaxed">{activeQuiz.explanationSi}</p>
                               </div>
                            </motion.div>
                         )}
                      </div>
                   </motion.div>
                </div>
             )}
          </AnimatePresence>

          {/* SESSION NOTE OVERLAY */}
          <AnimatePresence>
             {activeNote && (
                <div className="fixed inset-0 bg-[#020617]/95 backdrop-blur-3xl z-[3000] flex items-center justify-center p-3 sm:p-8">
                   <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      className="bg-[#0f172a] rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] w-full max-w-[900px] h-full max-h-[92vh] sm:max-h-[85vh] border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col"
                   >
                      <header className="p-5 sm:p-10 border-b border-white/5 flex justify-between items-center shrink-0">
                         <div className="space-y-2">
                            <span className="px-5 py-2 bg-emerald-600/10 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Session Note</span>
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{activeNote.title || "Study Note"}</h3>
                         </div>
                         <button onClick={() => setActiveNote(null)} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-rose-500 transition-all text-sm">✕</button>
                      </header>

                      <div className="flex-grow overflow-y-auto p-5 sm:p-12 space-y-8 sm:space-y-12 scrollbar-hide">
                         {/* English Content */}
                         <div className="space-y-6">
                            <div className="flex items-center gap-4 mb-8">
                               <div className="h-px bg-slate-800 flex-grow"></div>
                               <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">English Version</span>
                               <div className="h-px bg-slate-800 flex-grow"></div>
                            </div>
                            <div className="text-slate-300 leading-relaxed font-medium">
                               {renderContent(activeNote.content)}
                            </div>
                         </div>

                         {/* Sinhala Content */}
                         {activeNote.contentSi && (
                            <div className="space-y-6 pt-12 border-t border-white/5">
                               <div className="flex items-center gap-4 mb-8">
                                  <div className="h-px bg-slate-800 flex-grow"></div>
                                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">සිංහල පරිවර්තනය</span>
                                  <div className="h-px bg-slate-800 flex-grow"></div>
                               </div>
                               <div className="text-slate-300 leading-relaxed font-bold">
                                  {renderContent(activeNote.contentSi)}
                               </div>
                            </div>
                         )}
                      </div>

                      <footer className="p-8 bg-black/20 border-t border-white/5 flex justify-center shrink-0">
                         <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">End of Study Note — Scroll to read all sections</p>
                      </footer>
                   </motion.div>
                </div>
             )}
          </AnimatePresence>

                     

{/* ASSESSMENT MODAL */}
         <AnimatePresence>
            {isAssessmentOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[100] flex items-center justify-center p-4 sm:p-8">
                   <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0f172a] rounded-[2.5rem] sm:rounded-[4rem] w-full max-w-[700px] p-6 sm:p-16 border border-slate-800 shadow-2xl relative overflow-hidden">
                      <button
                         onClick={() => setIsAssessmentOpen(false)}
                         className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white flex items-center justify-center transition-all text-sm font-black z-10"
                      >
                         ✕
                      </button>
                      <div className="absolute top-0 left-0 h-2 bg-blue-600 transition-all duration-500" style={{ width: `${((currentQuizIndex + 1) / (assessmentQuestions.length || 1)) * 100}%` }}></div>
                      <div className="flex justify-between items-center text-slate-500 text-[10px] font-black uppercase tracking-widest pt-2">
                         <span>Assessment • {user?.grade || user?.subject || "Crypto Basic"}</span>
                         <span>Q {currentQuizIndex + 1} / {assessmentQuestions.length}</span>
                      </div>
                      <div className="space-y-4 my-8 sm:my-10">
                         <span className="text-blue-500 font-black text-xs uppercase tracking-widest">{assessmentQuestions[currentQuizIndex]?.category || "General"}</span>
                         <h3 className="text-2xl sm:text-3xl font-black leading-tight text-white">{assessmentQuestions[currentQuizIndex]?.text}</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                         {(assessmentQuestions[currentQuizIndex]?.options || []).map((opt, i) => (
                            <button key={i} onClick={() => handleQuizAnswer(i)} className="p-6 sm:p-8 bg-slate-900 hover:bg-blue-600 border border-slate-800 hover:border-blue-500 rounded-2xl sm:rounded-[2rem] text-left transition-all group font-bold text-white text-sm sm:text-base">
                               {opt}
                            </button>
                         ))}
                      </div>
                   </motion.div>
                </div>
            )}
         </AnimatePresence>

         {/* SESSION COMPLETION CELEBRATION MODAL */}
         <AnimatePresence>
            {completedModalSession && (
               <div className="fixed inset-0 bg-black/85 backdrop-blur-2xl z-[150] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
                  <motion.div 
                     initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                     animate={{ opacity: 1, scale: 1, y: 0 }} 
                     exit={{ opacity: 0, scale: 0.9, y: 20 }}
                     className="bg-[#0f172a] rounded-[2.5rem] sm:rounded-[3rem] w-full max-w-[540px] p-6 sm:p-10 border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)] relative text-center overflow-hidden"
                  >
                     {/* Ambient glow */}
                     <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

                     {/* Icon */}
                     <div className="relative w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 flex items-center justify-center text-4xl shadow-inner shadow-emerald-500/20">
                        <span>🎉</span>
                     </div>

                     {/* Badge */}
                     <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest mb-4">
                        <span>✓</span> Session Completed
                     </div>

                     {/* Title */}
                     <h3 className="text-2xl sm:text-3xl font-black text-white mb-1 tracking-tight">
                        {completedModalSession.session?.title || "Session Completed!"}
                     </h3>
                     <p className="text-slate-400 text-xs sm:text-sm font-semibold mb-6">
                        පාඩම සාර්ථකව අවසන් කරන ලදී! සියලු ප්‍රගතිය සුරැකිණි.
                     </p>

                     {/* Marks Breakdown Card */}
                     <div className="bg-[#070b14]/80 rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-4 mb-8">
                        <div className="flex items-center justify-between">
                           <span className="text-xs font-black uppercase tracking-widest text-slate-400">Total Score / ප්‍රතිඵලය</span>
                           <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                              {completedModalSession.score}%
                           </span>
                        </div>

                        {/* Score bar */}
                        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                           <div 
                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
                              style={{ width: `${completedModalSession.score}%` }}
                           />
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-3 gap-3 pt-2">
                           <div className="bg-slate-900/80 rounded-2xl p-3 border border-emerald-500/20">
                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Correct</p>
                              <p className="text-lg font-black text-emerald-400 mt-0.5">✅ {completedModalSession.correctCount}</p>
                              <p className="text-[9px] text-slate-500">නිවැරදි</p>
                           </div>
                           <div className="bg-slate-900/80 rounded-2xl p-3 border border-rose-500/20">
                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Wrong</p>
                              <p className="text-lg font-black text-rose-400 mt-0.5">❌ {completedModalSession.wrongCount}</p>
                              <p className="text-[9px] text-slate-500">වැරදි</p>
                           </div>
                           <div className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800">
                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Questions</p>
                              <p className="text-lg font-black text-white mt-0.5">📝 {completedModalSession.totalQuestions}</p>
                              <p className="text-[9px] text-slate-500">ප්‍රශ්න</p>
                           </div>
                        </div>

                        <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                           🔒 මෙම session එක දැන් Review Mode එකට මාරු වී ඇත. ඔබට නැවත පිළිතුරු සංශෝධනය කළ නොහැක.
                        </p>
                     </div>

                     {/* Action Buttons */}
                     <button
                        onClick={() => {
                           setCompletedModalSession(null);
                           setActiveSession(null);
                        }}
                        className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black uppercase tracking-widest text-xs sm:text-sm rounded-2xl hover:brightness-110 shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                     >
                        <span>✓</span> OK • Return to Sessions / සැසි ලැයිස්තුවට යන්න
                     </button>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         <AnimatePresence>
            {alert && (
               <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0f172a] rounded-[3rem] w-full max-w-[350px] p-12 text-center border border-slate-800/50 shadow-2xl"><div className={`w-20 h-20 rounded-[1.8rem] flex items-center justify-center text-4xl mx-auto mb-8 ${alert.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>{alert.type === 'success' ? '✓' : '!'}</div><h3 className="text-2xl font-black text-white mb-3">{alert.title}</h3><p className="text-sm font-bold text-slate-400 mb-10">{alert.message}</p><button onClick={() => setAlert(null)} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase">Continue</button></motion.div>
               </div>
            )}
         </AnimatePresence>
      
         {/* MOBILE BOTTOM NAVIGATION BAR */}
         {!activeAssignment && (
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#070b14]/95 backdrop-blur-2xl border-t border-slate-800/80 px-2 py-2 flex items-center justify-around shadow-2xl">
               {[
                  { id: "Dashboard", label: "Home", icon: "🏠" },
                  { id: "Sessions", label: "Sessions", icon: "🎬", locked: !isEnrolled },
                  { id: "LMS", label: "LMS", icon: "📚", locked: !isEnrolled },
                  { id: "Chat", label: "Support", icon: "💬", badge: messages.filter(m => m.sender === 'admin' && !m.isRead).length },
                  { id: "Profile", label: "Profile", icon: "👤" }
               ].map((tab) => {
                  const isActive = tab.id === "Chat" ? isChatOpen : activeNav === tab.id;
                  return (
                     <button
                        key={tab.id}
                        onClick={() => {
                           if (tab.locked) {
                              showNotification("Access Locked 🔒", "ගෙවීම Admin විසින් Approve කරන තෙක් මෙම අංශය භාවිත කළ නොහැක.", "error");
                              return;
                           }
                           if (tab.id === "Chat") {
                              setIsChatOpen(!isChatOpen);
                              if (!isChatOpen) markAdminAsRead();
                           } else {
                              setActiveNav(tab.id);
                              if (isChatOpen) setIsChatOpen(false);
                           }
                        }}
                        className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all relative ${
                           tab.locked 
                              ? "opacity-40 cursor-not-allowed text-slate-600"
                              : isActive 
                                 ? "text-[#2dd4bf]" 
                                 : "text-slate-400 hover:text-white"
                        }`}
                     >
                        <span className="text-lg relative">
                           {tab.icon}
                           {tab.badge > 0 && (
                              <span className="absolute -top-1 -right-2 w-4 h-4 bg-rose-600 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                                 {tab.badge}
                              </span>
                           )}
                        </span>
                        <span className={`text-[10px] font-black tracking-wider uppercase mt-0.5 ${isActive ? "text-[#2dd4bf]" : "text-slate-400"}`}>
                           {tab.label}
                        </span>
                        {isActive && (
                           <div className="w-1 h-1 bg-[#2dd4bf] rounded-full mt-0.5"></div>
                        )}
                     </button>
                  );
               })}
            </div>
         )}

      </div>
   );
};

export default LMSDashboard;
