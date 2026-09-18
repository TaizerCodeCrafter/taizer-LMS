import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Modular Admin Components
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import DashboardTab from "../components/admin/DashboardTab";
import PaymentsTab from "../components/admin/PaymentsTab";
import StudentsTab from "../components/admin/StudentsTab";
import SessionsTab from "../components/admin/SessionsTab";
import SlideDesignerModal from "../components/admin/SlideDesignerModal";
import QuestionsTab from "../components/admin/QuestionsTab";
import LmsTab from "../components/admin/LmsTab";
import ZoomTab from "../components/admin/ZoomTab";
import MessagesTab from "../components/admin/MessagesTab";
import WebSettingsTab from "../components/admin/WebSettingsTab";
import SettingsTab from "../components/admin/SettingsTab";
import {
  PaymentSlipModal,
  ConfirmModal,
  ToastAlert
} from "../components/admin/AdminModals";

const Admin = () => {
  const navigate = useNavigate();

  // AUTHENTICATION CHECK
  useEffect(() => {
    const isAdmin = localStorage.getItem("adminLoggedIn");
    if (!isAdmin) {
      navigate("/admin-login");
    }
  }, [navigate]);

  // BACKEND SYNC HELPER
  const syncToBackend = async (key, data) => {
    try {
      if (key === "studentRequests") {
        await fetch("http://localhost:5000/api/students/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
      } else if (key === "lmsSessions") {
        await fetch("http://localhost:5000/api/sessions/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
      } else if (key === "lmsQuestions") {
        await fetch("http://localhost:5000/api/questions/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
      } else if (key === "lmsAssignments") {
        await fetch("http://localhost:5000/api/assignments/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
      } else {
        await fetch("http://localhost:5000/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: key, data })
        });
      }
    } catch (e) {
      console.error("Sync error:", e);
    }
  };

  // ACTIVE TABS STATE
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("adminActiveTab") || "Dashboard"
  );
  const [lmsSubTab, setLmsSubTab] = useState(
    localStorage.getItem("adminLmsSubTab") || "Materials"
  );
  const [webSubTab, setWebSubTab] = useState(
    localStorage.getItem("adminWebSubTab") || "Home"
  );
  const [homeSectionTab, setHomeSectionTab] = useState(
    localStorage.getItem("adminHomeSectionTab") || "Hero Section"
  );
  const [zoomSubTab, setZoomSubTab] = useState(() => {
    const saved = localStorage.getItem("adminZoomSubTab");
    return saved && saved !== "Setup" ? saved : "Schedule";
  });

  useEffect(() => {
    localStorage.setItem("adminActiveTab", activeTab);
  }, [activeTab]);
  useEffect(() => {
    localStorage.setItem("adminLmsSubTab", lmsSubTab);
  }, [lmsSubTab]);
  useEffect(() => {
    localStorage.setItem("adminWebSubTab", webSubTab);
  }, [webSubTab]);
  useEffect(() => {
    localStorage.setItem("adminHomeSectionTab", homeSectionTab);
  }, [homeSectionTab]);
  useEffect(() => {
    localStorage.setItem("adminZoomSubTab", zoomSubTab);
  }, [zoomSubTab]);

  const [students, setStudents] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("studentRequests") || "[]");
    } catch {
      return [];
    }
  });
  const [whatsappMessages, setWhatsappMessages] = useState([]);
  const [portalMessages, setPortalMessages] = useState([]);
  const [inquiries, setInquiries] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("webMessages") || "[]");
    } catch {
      return [];
    }
  });
  const lastMessageCount = useRef(0);
  const [selectedStudentEmail, setSelectedStudentEmail] = useState(null);
  const [adminReplyText, setAdminReplyText] = useState({});
  const [messageTab, setMessageTab] = useState("Portal Chat");

  const [viewingPayment, setViewingPayment] = useState(null);
  const [alert, setAlert] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    inputRequired: false,
    expectedInput: "",
    onConfirm: () => {}
  });

  const [adminProfile, setAdminProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("adminProfile");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email && parsed.email !== "admin@taizer.lk") {
          return parsed;
        }
      }
    } catch (e) {}
    const defaultProf = {
      name: "Super Admin",
      email: "supundilshan358@gmail.com",
      photo: "/admin-profile.png",
      password: "addi"
    };
    try {
      localStorage.setItem("adminProfile", JSON.stringify(defaultProf));
    } catch (e) {}
    return defaultProf;
  });

  // SESSIONS (CURRICULUM)
  const [sessions, setSessions] = useState(
    JSON.parse(localStorage.getItem("lmsSessions") || "{}")
  );
  const [selectedSessionGrade, setSelectedSessionGrade] = useState("Crypto Basic");
  const [editingSessionIndex, setEditingSessionIndex] = useState(null);

  // QUESTIONS (MCQ BANK)
  const [questions, setQuestions] = useState(
    JSON.parse(localStorage.getItem("lmsQuestions") || "{}")
  );
  const [selectedGrade, setSelectedGrade] = useState("Crypto Basic");

  // LMS SETTINGS
  const [courseSettings, setCourseSettings] = useState(
    JSON.parse(
      localStorage.getItem("courseSettings") ||
        '{"subject": "Crypto Basic", "fee": "2500"}'
    )
  );
  const [bankDetails, setBankDetails] = useState(
    JSON.parse(
      localStorage.getItem("bankDetails") ||
        '{"bank": "BOC", "branch": "Horowpothana", "holder": "S.S.D MADUSANKA", "account": "5630207"}'
    )
  );

  // ZOOM LIVE CLASS
  const [zoomSettings, setZoomSettings] = useState(
    JSON.parse(localStorage.getItem("zoomSettings") || "{}")
  );
  const [selectedZoomGrade, setSelectedZoomGrade] = useState("Crypto Basic");
  const [zoomForm, setZoomForm] = useState({
    link: "",
    date: "",
    startTime: "",
    endTime: ""
  });

  // WEBSITE CMS SETTINGS
  const [webCourses, setWebCourses] = useState(
    JSON.parse(
      localStorage.getItem("webCourses") ||
        JSON.stringify([
          {
            id: 1,
            title: "Crypto Basic Masterclass",
            desc: "Blockchain, Wallets & Market Foundation",
            color: "from-blue-600/20",
            border: "border-blue-500/20",
            text: "text-blue-400",
            iconBg: "bg-blue-500/20",
            btn: "bg-blue-600"
          },
          {
            id: 2,
            title: "Order Flow & Institutional Volume",
            desc: "Footprint, DOM & Liquidity Engineering",
            color: "from-purple-600/20",
            border: "border-purple-500/20",
            text: "text-purple-400",
            iconBg: "bg-purple-500/20",
            btn: "bg-purple-600"
          },
          {
            id: 3,
            title: "Technical Analysis Pro",
            desc: "Price Action & Risk Management",
            color: "from-emerald-600/20",
            border: "border-emerald-500/20",
            text: "text-emerald-400",
            iconBg: "bg-emerald-500/20",
            btn: "bg-emerald-600"
          }
        ])
    )
  );

  const [webHomeSettings, setWebHomeSettings] = useState(
    JSON.parse(
      localStorage.getItem("webHomeSettings") ||
        JSON.stringify({
          hero: {
            badge: "Elite Crypto & Financial Trading Academy",
            title: "Master Institutional Crypto & Order Flow Trading",
            subtitle:
              "Master crypto basics, order flow, liquidity dynamics, and institutional trading strategies with high-probability setups and live trading sessions.",
            enrollBtnText: "Enroll for Masterclass",
            enrollBtnLink: "/register",
            whatsappBtnText: "Free Community",
            whatsappUrl: "https://wa.me/",
            heroImage: "/hero-image.png",
            floatingBadge1Title: "Institutional Setups",
            floatingBadge1Subtitle: "High-Probability Execution",
            floatingBadge2Title: "24/7 Trading Portal",
            floatingBadge2Subtitle: "Live Sessions & Materials",
            socialProofText: "Empowering Over 5,000+ Active Traders"
          },
          instructorSpotlight: {
            badge: "Lead Mentor & Market Specialist",
            name: "Taizer Lead Trader",
            role: "Crypto & Order Flow Specialist",
            quote:
              "Empowering traders with institutional execution strategies, order flow footprint analysis, and disciplined risk management to achieve consistent profitability.",
            image: "/teacher.jpg",
            btn1Text: "View Full Credentials & Bio",
            btn1Link: "/instructor-profile",
            btn2Text: "About Our Teaching Methods",
            btn2Link: "/about"
          },
          "Our Courses": {
            badge: "Structured Curriculum",
            title: "Specialized Course Programs",
            subtitle:
              "Select your trading level below to inspect weekly modules, downloadable tutes, and video lessons."
          },
          "Watch a Sample Lesson": {
            badge: "Virtual Classroom",
            title: "Experience Our Teaching Style",
            subtitle: "Watch a sample online session on Market Structure & Order Flow.",
            videoUrl: "https://www.youtube-nocookie.com/embed/ERb6D8MW-u0",
            isLocal: false
          },
          "Our Success Stories": {
            badge: "Proven Track Record",
            title: "Proven Academic Excellence",
            subtitle:
              "Consistently producing Island rankers and top district results year after year."
          },
          "What Students Say": {
            badge: "Student Feedback",
            title: "What Students Say",
            subtitle:
              "Hear directly from our past students who attained top ranks and distinctions."
          },
          cta: {
            title: "Ready To Accelerate Your Exam Results?",
            subtitle:
              "Join the next live interactive lecture and unlock all revision materials on the LMS portal.",
            primaryBtnText: "Start Student Registration",
            primaryBtnLink: "/register",
            secondaryBtnText: "Contact via WhatsApp",
            secondaryBtnLink: "https://wa.me/"
          },
          branding: {
            logo: "/logo.png",
            siteName: "Taizer LMS",
            siteTagline: "Crypto & Forex Trading Academy"
          }
        })
    )
  );

  const [webStats, setWebStats] = useState(
    JSON.parse(
      localStorage.getItem("webStats") ||
        JSON.stringify([
          { label: "A* Results", value: "200+", color: "text-red-400" },
          { label: "Island Rankers", value: "5", color: "text-yellow-400" },
          { label: "Passed Students", value: "5000+", color: "text-green-400" },
          { label: "Satisfaction", value: "100%", color: "text-blue-400" }
        ])
    )
  );

  const [webTestimonials, setWebTestimonials] = useState(
    JSON.parse(
      localStorage.getItem("webTestimonials") ||
        JSON.stringify([
          {
            text: "The way market structure and candlestick patterns are explained is crystal clear. I finally passed my funded challenge thanks to these classes!",
            author: "Kasun Jayawardena",
            location: "Colombo"
          },
          {
            text: "Highly recommended for Order Flow and Volume analysis. The best live trading sessions, footprint charts, and risk rules.",
            author: "Sachini Perera",
            location: "Kandy"
          },
          {
            text: "Crypto Basic course changed my mindset completely. Proper risk management and disciplined execution instead of gambling.",
            author: "Nimal Silva",
            location: "Galle"
          }
        ])
    )
  );

  const [webAboutSettings, setWebAboutSettings] = useState(
    JSON.parse(
      localStorage.getItem("webAboutSettings") ||
        JSON.stringify({
          badge: "Trading Mentor & Director",
          title: "About the Lead Mentor",
          desc: "Dedicated to building professional, disciplined, and profitable traders in Cryptocurrency and Global Financial Markets.",
          image: "/teacher.jpg",
          teacherName: "Taizer Lead Trader",
          teacherRole: "Crypto & Order Flow Specialist",
          quals:
            "Certified Financial Technical Analyst, 8+ Years Crypto & Futures Trading Experience, Order Flow & Volume Profile Specialist",
          exp: "Extensive experience mentoring traders from beginner to professional prop firm funded levels with live execution strategies.",
          phil: "Trading is not gambling or guessing; it is probability, strict risk management, and understanding institutional order flow.",
          btnText: "Read Full Professional Biography",
          btnLink: "/instructor-profile"
        })
    )
  );

  const [webCoursesSettings, setWebCoursesSettings] = useState(
    JSON.parse(
      localStorage.getItem("webCoursesSettings") ||
        JSON.stringify({
          badge: "Professional Trading Syllabus",
          title: "Comprehensive Curriculum & Programs",
          desc: "Specialized Crypto and Financial Market trading programs structured to build consistent, profitable independent traders.",
          ctaText: "Enroll Today",
          ctaLink: "/register"
        })
    )
  );

  const [webResourcesSettings, setWebResourcesSettings] = useState(
    JSON.parse(
      localStorage.getItem("webResourcesSettings") ||
        JSON.stringify({
          badge: "Open Academic Library",
          title: "Free Educational Resources",
          desc: "Download model papers, formula summary sheets, and past paper discussions to boost your examination revision.",
          searchPlaceholder: "Search study materials, papers, or guides..."
        })
    )
  );

  const [webResources, setWebResources] = useState(() => {
    try {
      const saved = localStorage.getItem("webResources");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((r) => r.url && !r.url.includes("dummy.pdf"));
        }
      }
    } catch (e) {}
    return [];
  });

  const [webGeneralSettings, setWebGeneralSettings] = useState(
    JSON.parse(
      localStorage.getItem("webGeneralSettings") ||
        JSON.stringify({
          supportEmail: "support@taizeracademy.com",
          supportPhone: "+94 77 123 4567",
          whatsappNumber: "94771234567",
          address: "Colombo, Sri Lanka",
          workingHours: "Mon - Sun • 8:00 AM - 9:00 PM",
          socials: {
            facebook: "https://facebook.com",
            youtube: "https://youtube.com",
            telegram: "https://t.me",
            whatsappGroup: "https://chat.whatsapp.com",
            instagram: "https://instagram.com"
          },
          subjects: ["Crypto Basic", "Order Flow"],
          grades: {
            "Crypto Basic": [],
            "Order Flow": []
          },
          academicYear: "2026 / 2027",
          announcementBar: {
            enabled: true,
            text: "📢 New Crypto Basic & Order Flow Masterclass batches are now open! Limited seats available.",
            link: "/register",
            linkText: "Register Now"
          },
          footerNotice: "© 2026 Taizer LMS. Empowering high-probability market execution."
        })
    )
  );

  // DYNAMIC CLASSES & GRADES DERIVED FROM GENERAL SETTINGS & DATABASE
  const availableGrades = useMemo(() => {
    const gradesObj = webGeneralSettings?.grades || {};
    const configuredSubjects = webGeneralSettings?.subjects || [];
    const allConfiguredGrades = Object.values(gradesObj).flat();
    const combined = Array.from(
      new Set([
        ...configuredSubjects,
        ...allConfiguredGrades
      ].filter(Boolean))
    );
    return combined.length > 0 ? combined : ["Crypto Basic", "Order Flow"];
  }, [webGeneralSettings]);

  // Keep selected grades synced with active available grades
  useEffect(() => {
    if (availableGrades.length > 0) {
      if (!availableGrades.includes(selectedSessionGrade)) {
        setSelectedSessionGrade(availableGrades[0]);
      }
      if (!availableGrades.includes(selectedGrade)) {
        setSelectedGrade(availableGrades[0]);
      }
      if (!availableGrades.includes(selectedZoomGrade)) {
        setSelectedZoomGrade(availableGrades[0]);
      }
    }
  }, [availableGrades]);

  const handleQuickAddClass = (newClassName, targetSubject) => {
    const trimmed = (newClassName || "").trim();
    if (!trimmed) return;
    const currentSubjects = webGeneralSettings?.subjects || [];
    const currentGrades = webGeneralSettings?.grades || {};

    let updatedSubjects = [...currentSubjects];
    let updatedGrades = { ...currentGrades };

    if (targetSubject && currentSubjects.includes(targetSubject)) {
      // Adding a batch / class under a specific subject
      const existing = currentGrades[targetSubject] || [];
      if (!existing.includes(trimmed)) {
        updatedGrades[targetSubject] = [...existing, trimmed];
      }
    } else {
      // Adding a standalone Course Category / Subject
      if (!updatedSubjects.includes(trimmed)) {
        updatedSubjects.push(trimmed);
      }
      if (!updatedGrades[trimmed]) {
        updatedGrades[trimmed] = [];
      }
    }

    const updatedGeneral = {
      ...webGeneralSettings,
      subjects: updatedSubjects,
      grades: updatedGrades
    };
    setWebGeneralSettings(updatedGeneral);
    try {
      localStorage.setItem("webGeneralSettings", JSON.stringify(updatedGeneral));
    } catch (e) {}
    syncToBackend("webGeneralSettings", updatedGeneral);
    window.dispatchEvent(new Event("storage"));
    showNotification("Course / Category Added", `"${trimmed}" is now active in curriculum and registration!`, "success");
    setSelectedSessionGrade(trimmed);
  };

  const handleDeleteSubject = (subToDelete) => {
    if (!subToDelete) return;
    const currentSubjects = webGeneralSettings?.subjects || [];
    if (currentSubjects.length <= 1) {
      showNotification("Cannot Delete", "You must keep at least one subject in the system.", "error");
      return;
    }
    const updatedSubjects = currentSubjects.filter((s) => s !== subToDelete);
    const updatedGrades = { ...(webGeneralSettings?.grades || {}) };
    delete updatedGrades[subToDelete];

    const updatedGeneral = {
      ...webGeneralSettings,
      subjects: updatedSubjects,
      grades: updatedGrades
    };
    setWebGeneralSettings(updatedGeneral);
    try {
      localStorage.setItem("webGeneralSettings", JSON.stringify(updatedGeneral));
    } catch (e) {}
    syncToBackend("webGeneralSettings", updatedGeneral);
    window.dispatchEvent(new Event("storage"));

    const nextSub = updatedSubjects[0];
    const nextGrades = updatedGrades[nextSub] || [];
    setSelectedSessionGrade(nextGrades.length > 0 ? nextGrades[0] : nextSub);
    showNotification("Subject Deleted", `"${subToDelete}" removed from curriculum & registration.`, "error");
  };

  const handleDeleteGrade = (sub, gradeToDelete) => {
    if (!sub || !gradeToDelete) return;
    const currentGrades = webGeneralSettings?.grades || {};
    const existing = currentGrades[sub] || [];
    const updatedList = existing.filter((g) => g !== gradeToDelete);
    const updatedGrades = {
      ...currentGrades,
      [sub]: updatedList
    };
    const updatedGeneral = {
      ...webGeneralSettings,
      grades: updatedGrades
    };
    setWebGeneralSettings(updatedGeneral);
    try {
      localStorage.setItem("webGeneralSettings", JSON.stringify(updatedGeneral));
    } catch (e) {}
    syncToBackend("webGeneralSettings", updatedGeneral);
    window.dispatchEvent(new Event("storage"));

    setSelectedSessionGrade(updatedList.length > 0 ? updatedList[0] : sub);
    showNotification("Batch Deleted", `Batch "${gradeToDelete}" removed from ${sub}.`, "error");
  };

  const [webInstructorProfile, setWebInstructorProfile] = useState(
    JSON.parse(
      localStorage.getItem("webInstructorProfile") ||
        JSON.stringify({
          role: "Crypto & Order Flow Specialist",
          name: "Taizer Lead Trader",
          image: "/teacher.jpg",
          title: "Instructor Portfolio",
          quote:
            "Professional trader and market analyst dedicated to empowering individuals with institutional execution models, quantitative order flow, and risk management.",
          expYears: "8+",
          stats: [
            { label: "Traders Trained", value: "2500+", icon: "BookOpen", color: "blue" },
            { label: "Funded Traders", value: "92%", icon: "GraduationCap", color: "emerald" }
          ],
          education: [
            { year: "2024", degree: "Advanced Order Flow Certification", institution: "Global Market Profile Institute" },
            { year: "2020", degree: "Certified Financial Technical Analyst (CFTe)", institution: "International Federation of Technical Analysts" },
            { year: "2018", degree: "B.Sc. in Financial Engineering & Analytics", institution: "Faculty of Applied Sciences" }
          ],
          subjects: [
            "Crypto Basic & Intermediate",
            "Order Flow & Footprint Dynamics",
            "Volume Profile & Market Structure",
            "Institutional Liquidity Concepts",
            "Risk Management & Psychology"
          ],
          achievements: [
            "Consistent Multi-Asset Proprietary Trader",
            "Developer of Algorithmic Trading Systems & CVD Indicators",
            "Over 2,500+ Active Trading Students Mentored Globally",
            "Head of Research & Market Intelligence at Taizer"
          ],
          philosophy:
            "True trading consistency is not about predicting the future; it is about executing an edge with mathematical discipline, managing risk with zero emotional bias, and riding institutional liquidity."
        })
    )
  );

  // NOTIFICATION TOAST HELPER
  const showNotification = (title, message, type = "success") => {
    setAlert({ title, message, type });
    setTimeout(() => setAlert(null), 3500);
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hour, minute] = timeStr.split(":");
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${minute} ${ampm}`;
  };

  // LOAD DATA FROM BACKEND
  const loadData = async (isInitial = false) => {
    try {
      const studentsRes = await fetch("http://localhost:5000/api/students");
      if (studentsRes.ok) {
        const fetched = await studentsRes.json();
        if (Array.isArray(fetched)) {
          setStudents(fetched);
          try {
            localStorage.setItem("studentRequests", JSON.stringify(fetched));
          } catch (storageErr) {
            console.warn("Storage quota on studentRequests:", storageErr);
          }
        }
      }

      if (isInitial) {
        const sessionsRes = await fetch("http://localhost:5000/api/sessions");
        if (sessionsRes.ok) {
          const sessionsData = await sessionsRes.json();
          const formattedSessions = {};
          sessionsData.forEach((s) => {
            const g = s.grade || (availableGrades[0] || "Crypto Basic");
            if (!formattedSessions[g]) formattedSessions[g] = [];
            formattedSessions[g].push(s);
          });
          if (sessionsData.length > 0) {
            setSessions(formattedSessions);
            localStorage.setItem("lmsSessions", JSON.stringify(formattedSessions));
          }
        }

        const qsRes = await fetch("http://localhost:5000/api/questions");
        if (qsRes.ok) {
          const qsData = await qsRes.json();
          const formattedQs = {};
          qsData.forEach((q) => {
            const g = q.grade || (availableGrades[0] || "Crypto Basic");
            if (!formattedQs[g]) formattedQs[g] = [];
            formattedQs[g].push(q);
          });
          if (qsData.length > 0) {
            setQuestions(formattedQs);
            localStorage.setItem("lmsQuestions", JSON.stringify(formattedQs));
          }
        }

        const assignmentsRes = await fetch("http://localhost:5000/api/assignments");
        if (assignmentsRes.ok) {
          const assignmentsData = await assignmentsRes.json();
          const formattedAssignments = {};
          assignmentsData.forEach((a) => {
            const g = a.grade || (availableGrades[0] || "Crypto Basic");
            if (!formattedAssignments[g]) formattedAssignments[g] = [];
            formattedAssignments[g].push(a);
          });
          if (assignmentsData.length > 0) {
            localStorage.setItem("lmsAssignments", JSON.stringify(formattedAssignments));
          }
        }

        // Settings
        const settingsRes = await fetch("http://localhost:5000/api/settings");
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          settingsData.forEach((setting) => {
            if (setting.type === "adminProfile" && setting.data) {
              setAdminProfile(setting.data);
              try { localStorage.setItem("adminProfile", JSON.stringify(setting.data)); } catch (e) {}
            }
            if (setting.type === "courseSettings" && setting.data) {
              setCourseSettings(setting.data);
              try { localStorage.setItem("courseSettings", JSON.stringify(setting.data)); } catch (e) {}
            }
            if (setting.type === "bankDetails" && setting.data) {
              setBankDetails(setting.data);
              try { localStorage.setItem("bankDetails", JSON.stringify(setting.data)); } catch (e) {}
            }
            if (setting.type === "zoomSettings" && setting.data) {
              setZoomSettings(setting.data);
              try { localStorage.setItem("zoomSettings", JSON.stringify(setting.data)); } catch (e) {}
            }
            if (setting.type === "lmsReferralConfig" && setting.data) {
              try { localStorage.setItem("lmsReferralConfig", JSON.stringify(setting.data)); } catch (e) {}
            }
            if (setting.type === "lmsReferrals" && setting.data) {
              try { localStorage.setItem("lmsReferrals", JSON.stringify(setting.data)); } catch (e) {}
            }
            if (setting.type === "lmsLiveRecordings" && setting.data) {
              try { localStorage.setItem("lmsLiveRecordings", JSON.stringify(setting.data)); } catch (e) {}
            }
            if (setting.type === "lmsMaterials" && setting.data) {
              try { localStorage.setItem("lmsMaterials", JSON.stringify(setting.data)); } catch (e) {}
            }
            if (setting.type === "lmsClaimedReferrals" && setting.data) {
              try { localStorage.setItem("lmsClaimedReferrals", JSON.stringify(setting.data)); } catch (e) {}
            }
            if (setting.type === "webHomeSettings") setWebHomeSettings(setting.data);
            if (setting.type === "webCourses") setWebCourses(setting.data);
            if (setting.type === "webStats") setWebStats(setting.data);
            if (setting.type === "webTestimonials") setWebTestimonials(setting.data);
            if (setting.type === "webAboutSettings") setWebAboutSettings(setting.data);
            if (setting.type === "webCoursesSettings") setWebCoursesSettings(setting.data);
            if (setting.type === "webResourcesSettings") setWebResourcesSettings(setting.data);
            if (setting.type === "webResources") setWebResources(setting.data);
            if (setting.type === "webGeneralSettings") setWebGeneralSettings(setting.data);
            if (setting.type === "webInstructorProfile") setWebInstructorProfile(setting.data);
          });
        }
      }
    } catch (err) {
      console.error("Failed to load data from backend", err);
    }
  };

  useEffect(() => {
    loadData(true);
    const interval = setInterval(() => loadData(false), 8000);
    return () => clearInterval(interval);
  }, []);

  // REALTIME MESSAGES LOGIC
  const fetchPortalMessages = async (isSilent = false) => {
    try {
      const res = await fetch("http://localhost:5000/api/portal/messages");
      const data = await res.json();

      if (
        !isSilent &&
        data.length > lastMessageCount.current &&
        lastMessageCount.current > 0
      ) {
        const newMsg = data[data.length - 1];
        if (newMsg.sender === "student") {
          const audio = new Audio(
            "https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3"
          );
          audio.play().catch(() => console.log("Audio blocked"));
          showNotification(
            "New Portal Message",
            `${newMsg.studentName}: ${newMsg.text.substring(0, 30)}`,
            "info"
          );
        }
      }

      lastMessageCount.current = data.length;
      setPortalMessages(data);

      if (selectedStudentEmail) {
        const hasUnread = data.some(
          (m) =>
            m.studentEmail === selectedStudentEmail &&
            m.sender === "student" &&
            !m.isRead
        );
        if (hasUnread) {
          markAsRead(selectedStudentEmail);
        }
      }
    } catch (err) {
      console.error("Portal messages fetch error:", err);
    }
  };

  const markAsRead = async (email) => {
    setPortalMessages((prev) =>
      prev.map((m) =>
        m.studentEmail === email && m.sender === "student"
          ? { ...m, isRead: true }
          : m
      )
    );
    try {
      await fetch(`http://localhost:5000/api/portal/messages/read/${email}`, {
        method: "PUT"
      });
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleAdminReply = async (studentEmail, studentName) => {
    const text = adminReplyText[studentEmail];
    if (!text?.trim()) return;

    try {
      await fetch("http://localhost:5000/api/portal/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentEmail,
          studentName,
          text,
          sender: "admin"
        })
      });
      setAdminReplyText({ ...adminReplyText, [studentEmail]: "" });
      fetchPortalMessages(true);
      showNotification("Reply Sent", "Your message was delivered to the student.", "success");
    } catch (err) {
      console.error("Reply error:", err);
    }
  };

  const fetchWhatsappMessages = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/whatsapp/messages");
      if (res.ok) {
        const data = await res.json();
        setWhatsappMessages(data);
      }
    } catch (err) {
      console.error("WhatsApp Fetch Error:", err);
    }
  };

  const deleteWhatsappMessage = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/whatsapp/messages/${id}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setWhatsappMessages(whatsappMessages.filter((m) => m._id !== id));
        showNotification("Deleted", "Chat record removed.", "error");
      }
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  const fetchInquiries = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/inquiries");
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
        localStorage.setItem("webMessages", JSON.stringify(data));
      }
    } catch (err) {
      console.warn("Inquiries fetch fallback to storage:", err);
      try {
        const local = JSON.parse(localStorage.getItem("webMessages") || "[]");
        setInquiries(local);
      } catch (e) {}
    }
  };

  const deleteInquiry = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/inquiries/${id}`, { method: "DELETE" });
    } catch (err) {}
    const updated = inquiries.filter((i) => i._id !== id && i.id !== id);
    setInquiries(updated);
    localStorage.setItem("webMessages", JSON.stringify(updated));
    showNotification("Deleted", "Inquiry removed.", "error");
  };

  const toggleInquiryStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "read" ? "unread" : "read";
    try {
      await fetch(`http://localhost:5000/api/inquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {}
    const updated = inquiries.map((i) => {
      if (i._id === id || i.id === id) {
        return { ...i, status: newStatus };
      }
      return i;
    });
    setInquiries(updated);
    localStorage.setItem("webMessages", JSON.stringify(updated));
  };

  useEffect(() => {
    fetchWhatsappMessages();
    fetchPortalMessages(true);
    fetchInquiries();

    const handleStorage = (e) => {
      if (e.key === "webMessages" || !e.key) {
        try {
          const updated = JSON.parse(localStorage.getItem("webMessages") || "[]");
          setInquiries(updated);
        } catch (err) {}
      }
      if (e.key === "studentRequests" || !e.key) {
        try {
          const updatedStudents = JSON.parse(localStorage.getItem("studentRequests") || "[]");
          setStudents(updatedStudents);
        } catch (err) {}
      }
    };
    window.addEventListener("storage", handleStorage);

    const interval = setInterval(() => {
      fetchPortalMessages(true);
      fetchWhatsappMessages();
      fetchInquiries();
    }, 8000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // PAYMENT STATUS HANDLERS
  const handlePaymentStatus = async (id, status) => {
    let allStudents = [];
    try {
      allStudents = JSON.parse(
        localStorage.getItem("studentRequests") || "[]"
      );
    } catch (e) {
      allStudents = [];
    }

    const currentList = allStudents.length > 0 ? allStudents : students;
    const targetStudent = currentList.find((s) => s.id === id);

    const updated = currentList.map((s) =>
      s.id === id
        ? {
            ...s,
            paymentStatus: status,
            status: status === "Approved" ? "Approved" : (s.status === "Approved" ? "Approved" : "Rejected")
          }
        : s
    );

    try {
      localStorage.setItem("studentRequests", JSON.stringify(updated));
    } catch (storageErr) {
      console.warn("Storage quota warning on studentRequests:", storageErr);
    }
    setStudents(updated);

    // If student has active session in this browser, update activeStudent too
    try {
      const active = JSON.parse(localStorage.getItem("activeStudent") || "null");
      if (
        active &&
        (active.id === id ||
          (targetStudent && active.email?.toLowerCase() === targetStudent.email?.toLowerCase()))
      ) {
        const updatedActive = {
          ...active,
          paymentStatus: status,
          status: status === "Approved" ? "Approved" : active.status
        };
        localStorage.setItem("activeStudent", JSON.stringify(updatedActive));
      }
    } catch (e) {}

    // Notify all open tabs/windows
    window.dispatchEvent(new Event("storage"));

    // Sync to backend MongoDB
    try {
      const targetStudent = allStudents.find(s => s.id === id || s.studentId === id || s._id === id || s.email === id);
      const targetId = (targetStudent && (targetStudent._id || targetStudent.studentId || targetStudent.id || targetStudent.email)) || id;
      await fetch(`http://localhost:5000/api/students/${encodeURIComponent(targetId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentStatus: status,
          status: status === "Approved" ? "Approved" : undefined,
          email: targetStudent?.email
        })
      });
      await syncToBackend("studentRequests", updated);
    } catch (apiErr) {
      console.warn("MongoDB student status update notice:", apiErr);
    }

    setViewingPayment(null);
    showNotification(
      status === "Approved" ? "Access Granted" : "Payment Rejected",
      `Student record marked as ${status}.`,
      status === "Approved" ? "success" : "error"
    );
  };

  const handleDeleteStudent = (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Remove Student",
      message: "Are you sure you want to revoke access and remove this student?",
      confirmText: "Delete Record",
      inputRequired: false,
      onConfirm: async () => {
        let allStudents = [];
        try {
          allStudents = JSON.parse(
            localStorage.getItem("studentRequests") || "[]"
          );
        } catch (e) {
          allStudents = [];
        }
        const currentList = allStudents.length > 0 ? allStudents : students;
        const updated = currentList.filter((s) => s.id !== id);

        try {
          localStorage.setItem("studentRequests", JSON.stringify(updated));
        } catch (storageErr) {
          console.warn("Storage quota warning on studentRequests:", storageErr);
        }
        setStudents(updated);
        window.dispatchEvent(new Event("storage"));

        try {
          const targetStudent = currentList.find(s => s.id === id || s.studentId === id || s._id === id || s.email === id);
          const targetId = (targetStudent && (targetStudent._id || targetStudent.studentId || targetStudent.id || targetStudent.email)) || id;
          await fetch(`http://localhost:5000/api/students/${encodeURIComponent(targetId)}`, { method: "DELETE" });
          await syncToBackend("studentRequests", updated);
        } catch (apiErr) {
          console.warn("MongoDB student delete notice:", apiErr);
        }

        showNotification("Student Deleted", "Student record removed.", "error");
      }
    });
  };

  // SESSIONS HANDLERS
  const handleToggleLockSession = (index) => {
    const updated = { ...sessions };
    if (!updated[selectedSessionGrade] || !updated[selectedSessionGrade][index]) return;
    const current = updated[selectedSessionGrade][index];
    current.locked = !current.locked;
    current.grade = selectedSessionGrade;
    setSessions(updated);
    localStorage.setItem("lmsSessions", JSON.stringify(updated));
    syncToBackend("lmsSessions", updated);
    window.dispatchEvent(new Event("storage"));
    showNotification(
      current.locked ? "Session Locked" : "Session Unlocked",
      `${current.title} access updated.`,
      "success"
    );
  };

  const handleDeleteSession = (index) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Curriculum Session",
      message: "Are you sure you want to delete this session and all its slides?",
      confirmText: "Delete Session",
      inputRequired: false,
      onConfirm: () => {
        const updated = { ...sessions };
        if (updated[selectedSessionGrade]) {
          updated[selectedSessionGrade].splice(index, 1);
        }
        setSessions(updated);
        localStorage.setItem("lmsSessions", JSON.stringify(updated));
        syncToBackend("lmsSessions", updated);
        window.dispatchEvent(new Event("storage"));
        showNotification("Deleted", "Session removed from curriculum.", "error");
      }
    });
  };

  const handleSaveNewSession = (newSession) => {
    const updated = { ...sessions };
    if (!updated[selectedSessionGrade]) updated[selectedSessionGrade] = [];
    const sessionWithGrade = {
      ...newSession,
      grade: selectedSessionGrade,
      locked: newSession.locked || false,
      content: newSession.content || []
    };
    updated[selectedSessionGrade].push(sessionWithGrade);
    setSessions(updated);
    localStorage.setItem("lmsSessions", JSON.stringify(updated));
    syncToBackend("lmsSessions", updated);
    window.dispatchEvent(new Event("storage"));
    showNotification("Success", `New session created for ${selectedSessionGrade}!`, "success");
  };

  const handleSaveSlideDesigner = (slides) => {
    const updated = { ...sessions };
    if (updated[selectedSessionGrade] && updated[selectedSessionGrade][editingSessionIndex]) {
      updated[selectedSessionGrade][editingSessionIndex].content = slides;
      updated[selectedSessionGrade][editingSessionIndex].grade = selectedSessionGrade;
    }
    setSessions(updated);
    localStorage.setItem("lmsSessions", JSON.stringify(updated));
    syncToBackend("lmsSessions", updated);
    window.dispatchEvent(new Event("storage"));
    showNotification("Saved", "Session slides published successfully!", "success");
  };

  // QUESTIONS HANDLERS
  const handleAddQuestion = (newQuestion) => {
    const allQuestions = { ...questions };
    if (!allQuestions[selectedGrade]) allQuestions[selectedGrade] = [];
    const qWithGrade = {
      ...newQuestion,
      grade: selectedGrade
    };
    allQuestions[selectedGrade].push(qWithGrade);
    setQuestions(allQuestions);
    localStorage.setItem("lmsQuestions", JSON.stringify(allQuestions));
    syncToBackend("lmsQuestions", allQuestions);
    window.dispatchEvent(new Event("storage"));
    showNotification("Question Added", `Saved to ${selectedGrade} MCQ Bank.`, "success");
  };

  const handleDeleteQuestion = (idx) => {
    const allQuestions = { ...questions };
    if (allQuestions[selectedGrade]) {
      allQuestions[selectedGrade] = allQuestions[selectedGrade].filter(
        (_, i) => i !== idx
      );
    }
    setQuestions(allQuestions);
    localStorage.setItem("lmsQuestions", JSON.stringify(allQuestions));
    syncToBackend("lmsQuestions", allQuestions);
    window.dispatchEvent(new Event("storage"));
    showNotification("Deleted", "Question removed.", "error");
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin-login");
  };

  // SYSTEM FULL RESET
  const handleTriggerReset = () => {
    setConfirmModal({
      isOpen: true,
      title: "Critical Database Reset",
      message:
        "Are you sure you want to RESET the entire platform? This will wipe all students, modules, and payments permanently.",
      confirmText: "RESET SYSTEM",
      inputRequired: true,
      expectedInput: "RESET",
      onConfirm: () => {
        localStorage.clear();
        showNotification("System Cleared", "All platform data cleared.", "error");
        setTimeout(() => navigate("/admin-login"), 1200);
      }
    });
  };

  const pendingPaymentsCount = students.filter(
    (s) => s.paymentStatus === "Pending" || s.paymentStatus === "Uploaded"
  ).length;

  const unreadInquiriesCount = inquiries.filter((i) => i.status === "unread").length;
  const unreadMessagesCount =
    portalMessages.filter((m) => m.sender === "student" && !m.isRead).length +
    unreadInquiriesCount;

  return (
    <div className="h-screen bg-[#070b14] flex font-sans text-slate-100 overflow-hidden select-none">
      {/* MODERN GLASS SIDEBAR */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={unreadMessagesCount}
        pendingPaymentsCount={pendingPaymentsCount}
        adminProfile={adminProfile}
        brandingLogo={webHomeSettings?.branding?.logo || "/logo.png"}
        brandingName={webHomeSettings?.branding?.siteName || "Taizer LMS"}
        onQuickUpdateLogo={(newLogo) => {
          const updatedHome = {
            ...webHomeSettings,
            branding: {
              ...(webHomeSettings?.branding || {}),
              logo: newLogo
            }
          };
          setWebHomeSettings(updatedHome);
          try {
            localStorage.setItem("webHomeSettings", JSON.stringify(updatedHome));
          } catch (e) {}
          syncToBackend("webHomeSettings", updatedHome);
          window.dispatchEvent(new Event("storage"));
          showNotification("Logo Updated", "Platform logo updated successfully across LMS and Website!", "success");
        }}
        onLogout={handleLogout}
      />

      {/* MAIN VIEWPORT */}
      <div className="flex-grow flex flex-col overflow-hidden bg-[#070b14] relative">
        {/* BACKGROUND AMBIENT GLOW MESH */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 left-1/3 w-[500px] h-[300px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

        {/* TOP HEADER */}
        <AdminHeader
          activeTab={activeTab}
          adminProfile={adminProfile}
          unreadCount={unreadMessagesCount}
          pendingPaymentsCount={pendingPaymentsCount}
          onRefresh={() => {
            loadData(true);
            fetchPortalMessages(true);
            fetchWhatsappMessages();
            showNotification("Refreshed", "System data synced with backend.", "info");
          }}
          onLogout={handleLogout}
        />

        {/* SCROLLABLE MAIN CONTENT CANVAS */}
        <main className="flex-grow overflow-y-auto p-8 relative z-10 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto space-y-8">
            {activeTab === "Dashboard" && (
              <DashboardTab
                students={students}
                sessions={sessions}
                questions={questions}
                whatsappMessages={whatsappMessages}
                portalMessages={portalMessages}
                availableGrades={availableGrades}
                setActiveTab={setActiveTab}
                setViewingPayment={setViewingPayment}
              />
            )}

            {activeTab === "Payment" && (
              <PaymentsTab
                students={students}
                availableGrades={availableGrades}
                onPaymentStatus={handlePaymentStatus}
                onDeleteStudent={handleDeleteStudent}
                setViewingPayment={setViewingPayment}
              />
            )}

            {activeTab === "Students" && (
              <StudentsTab
                students={students}
                setStudents={setStudents}
                availableGrades={availableGrades}
                syncToBackend={syncToBackend}
                showNotification={showNotification}
                onDeleteStudent={handleDeleteStudent}
              />
            )}

            {activeTab === "Sessions" && (
              <SessionsTab
                sessions={sessions}
                selectedSessionGrade={selectedSessionGrade}
                setSelectedSessionGrade={setSelectedSessionGrade}
                availableGrades={availableGrades}
                webGeneralSettings={webGeneralSettings}
                setWebGeneralSettings={setWebGeneralSettings}
                syncToBackend={syncToBackend}
                showNotification={showNotification}
                onQuickAddClass={handleQuickAddClass}
                onDeleteSubject={handleDeleteSubject}
                onDeleteGrade={handleDeleteGrade}
                onToggleLock={handleToggleLockSession}
                onDeleteSession={handleDeleteSession}
                onOpenDesigner={(idx) => setEditingSessionIndex(idx)}
                onSaveNewSession={handleSaveNewSession}
              />
            )}

            {activeTab === "Questions" && (
              <QuestionsTab
                questions={questions}
                selectedGrade={selectedGrade}
                setSelectedGrade={setSelectedGrade}
                availableGrades={availableGrades}
                onAddQuestion={handleAddQuestion}
                onDeleteQuestion={handleDeleteQuestion}
              />
            )}

            {activeTab === "LMS" && (
              <LmsTab
                lmsSubTab={lmsSubTab}
                setLmsSubTab={setLmsSubTab}
                selectedSessionGrade={selectedSessionGrade}
                setSelectedSessionGrade={setSelectedSessionGrade}
                availableGrades={availableGrades}
                courseSettings={courseSettings}
                setCourseSettings={setCourseSettings}
                bankDetails={bankDetails}
                setBankDetails={setBankDetails}
                onSaveCourseSettings={() => {
                  syncToBackend("courseSettings", courseSettings);
                  showNotification("Saved", "Course settings saved.", "success");
                }}
                onSaveBankDetails={() => {
                  syncToBackend("bankDetails", bankDetails);
                  showNotification("Saved", "Bank details updated.", "success");
                }}
                syncToBackend={syncToBackend}
                showNotification={showNotification}
              />
            )}

            {activeTab === "Zoom" && (
              <ZoomTab
                zoomSettings={zoomSettings}
                setZoomSettings={setZoomSettings}
                selectedZoomGrade={selectedZoomGrade}
                setSelectedZoomGrade={setSelectedZoomGrade}
                availableGrades={availableGrades}
                zoomSubTab={zoomSubTab}
                setZoomSubTab={setZoomSubTab}
                zoomForm={zoomForm}
                setZoomForm={setZoomForm}
                onSaveZoomSettings={() => {
                  localStorage.setItem("zoomSettings", JSON.stringify(zoomSettings));
                  window.dispatchEvent(new Event("storage"));
                  syncToBackend("zoomSettings", zoomSettings);
                  showNotification("Saved", "Zoom class link updated & published.", "success");
                }}
                formatTime={formatTime}
                students={students}
                setStudents={setStudents}
                syncToBackend={syncToBackend}
                showNotification={showNotification}
              />
            )}

            {activeTab === "Messages" && (
              <MessagesTab
                messageTab={messageTab}
                setMessageTab={setMessageTab}
                portalMessages={portalMessages}
                whatsappMessages={whatsappMessages}
                inquiries={inquiries}
                selectedStudentEmail={selectedStudentEmail}
                setSelectedStudentEmail={setSelectedStudentEmail}
                adminReplyText={adminReplyText}
                setAdminReplyText={setAdminReplyText}
                onAdminReply={handleAdminReply}
                onDeleteWhatsappMessage={deleteWhatsappMessage}
                onDeleteInquiry={deleteInquiry}
                onToggleInquiryStatus={toggleInquiryStatus}
                onFetchPortalMessages={fetchPortalMessages}
                onFetchWhatsappMessages={fetchWhatsappMessages}
                onFetchInquiries={fetchInquiries}
                markAsRead={markAsRead}
                availableGrades={availableGrades}
              />
            )}

            {activeTab === "WebSetting" && (
              <WebSettingsTab
                webSubTab={webSubTab}
                setWebSubTab={setWebSubTab}
                homeSectionTab={homeSectionTab}
                setHomeSectionTab={setHomeSectionTab}
                webCourses={webCourses}
                setWebCourses={setWebCourses}
                webHomeSettings={webHomeSettings}
                setWebHomeSettings={setWebHomeSettings}
                webStats={webStats}
                setWebStats={setWebStats}
                webTestimonials={webTestimonials}
                setWebTestimonials={setWebTestimonials}
                webInstructorProfile={webInstructorProfile}
                setWebInstructorProfile={setWebInstructorProfile}
                webAboutSettings={webAboutSettings}
                setWebAboutSettings={setWebAboutSettings}
                webCoursesSettings={webCoursesSettings}
                setWebCoursesSettings={setWebCoursesSettings}
                webResourcesSettings={webResourcesSettings}
                setWebResourcesSettings={setWebResourcesSettings}
                webResources={webResources}
                setWebResources={setWebResources}
                webGeneralSettings={webGeneralSettings}
                setWebGeneralSettings={setWebGeneralSettings}
                onSaveSetting={(key, data) => {
                  try {
                    localStorage.setItem(key, JSON.stringify(data));
                  } catch (storageErr) {
                    console.warn(`LocalStorage quota warning for ${key}:`, storageErr);
                  }
                  syncToBackend(key, data);
                  window.dispatchEvent(new Event("storage"));
                  showNotification("Settings Saved", "Website CMS settings saved successfully!", "success");
                }}
              />
            )}

            {activeTab === "Settings" && (
              <SettingsTab
                adminProfile={adminProfile}
                setAdminProfile={setAdminProfile}
                webHomeSettings={webHomeSettings}
                setWebHomeSettings={setWebHomeSettings}
                onSaveProfile={() => {
                  try {
                    localStorage.setItem("adminProfile", JSON.stringify(adminProfile));
                  } catch (e) {
                    console.warn("adminProfile storage error", e);
                  }
                  syncToBackend("adminProfile", adminProfile);
                  window.dispatchEvent(new Event("storage"));
                  showNotification("Success", "Admin profile updated.", "success");
                }}
                onSaveBranding={(newBranding) => {
                  const updatedHome = {
                    ...webHomeSettings,
                    branding: newBranding
                  };
                  setWebHomeSettings(updatedHome);
                  try {
                    localStorage.setItem("webHomeSettings", JSON.stringify(updatedHome));
                  } catch (e) {}
                  syncToBackend("webHomeSettings", updatedHome);
                  window.dispatchEvent(new Event("storage"));
                  showNotification("Branding Saved", "Platform branding & logo updated successfully!", "success");
                }}
                onTriggerReset={handleTriggerReset}
              />
            )}
          </div>
        </main>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {/* SLIDE STUDIO FULLSCREEN MODAL */}
        {editingSessionIndex !== null && sessions[selectedSessionGrade] && (
          <SlideDesignerModal
            session={sessions[selectedSessionGrade][editingSessionIndex]}
            grade={selectedSessionGrade}
            onClose={() => setEditingSessionIndex(null)}
            onSaveSession={handleSaveSlideDesigner}
          />
        )}

        {/* PAYMENT SLIP INSPECTION MODAL */}
        {viewingPayment && (
          <PaymentSlipModal
            student={viewingPayment}
            onClose={() => setViewingPayment(null)}
            onApprove={(id) => handlePaymentStatus(id, "Approved")}
            onReject={(id) => handlePaymentStatus(id, "Rejected")}
          />
        )}

        {/* CONFIRMATION MODAL */}
        {confirmModal.isOpen && (
          <ConfirmModal
            isOpen={confirmModal.isOpen}
            title={confirmModal.title}
            message={confirmModal.message}
            confirmText={confirmModal.confirmText}
            inputRequired={confirmModal.inputRequired}
            expectedInput={confirmModal.expectedInput}
            onConfirm={confirmModal.onConfirm}
            onClose={() =>
              setConfirmModal({ ...confirmModal, isOpen: false, expectedInput: "" })
            }
          />
        )}

        {/* TOAST ALERT BANNER */}
        {alert && <ToastAlert alert={alert} onClose={() => setAlert(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
