import React, { useState } from "react";
import {
  Globe,
  Home,
  Info,
  BookOpen,
  FolderOpen,
  Sliders,
  Save,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Layers,
  UserCheck,
  Video,
  Award,
  MessageSquare,
  Compass,
  Image as ImageIcon,
  ExternalLink,
  Eye,
  CheckCircle2,
  Phone,
  Flame,
  GraduationCap,
  Briefcase,
  ArrowRight,
  Tag,
  Copy,
  EyeOff,
  Calendar,
  CreditCard,
  Search,
  FolderDown,
  Mail,
  MapPin,
  Clock,
  Share2,
  FileText,
  FileArchive,
  Download,
  Megaphone,
  X,
  MessageCircle
} from "lucide-react";
import DualImageInput from "./DualImageInput";

const DEFAULT_HOME_SETTINGS = {
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
    title: "Proven Trading Excellence",
    subtitle:
      "Consistently producing funded traders and profitable independent market participants."
  },
  "What Students Say": {
    badge: "Trader Feedback",
    title: "What Students Say",
    subtitle:
      "Hear directly from our members who mastered the markets and achieved financial freedom."
  },
  cta: {
    title: "Ready To Accelerate Your Trading Results?",
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
};

const DEFAULT_ABOUT_SETTINGS = {
  badge: "Trading Mentor & Director",
  title: "About the Lead Mentor",
  desc: "Dedicated to building professional, disciplined, and profitable traders in Cryptocurrency and Global Financial Markets.",
  image: "/teacher.jpg",
  teacherName: "Taizer Lead Trader",
  teacherRole: "Crypto & Order Flow Specialist",
  quals:
    "Certified Financial Technical Analyst\n8+ Years Crypto & Futures Trading Experience\nOrder Flow & Volume Profile Specialist",
  exp: "Extensive experience mentoring traders from beginner to professional prop firm funded levels with live execution strategies.",
  phil: "Trading is not gambling or guessing; it is probability, strict risk management, and understanding institutional order flow.",
  btnText: "Read Full Professional Biography",
  btnLink: "/instructor-profile"
};

const DEFAULT_COURSES_SETTINGS = {
  badge: "Professional Trading Syllabus",
  title: "Comprehensive Curriculum & Programs",
  desc: "Specialized Crypto and Financial Market trading programs structured to build consistent, profitable independent traders.",
  ctaText: "Enroll Today",
  ctaLink: "/register"
};

const DEFAULT_RESOURCES_SETTINGS = {
  badge: "Open Knowledge Library",
  title: "Free Trading Resources",
  desc: "Download trading cheat sheets, market structure guides, and risk management calculators to boost your trading journey.",
  searchPlaceholder: "Search study materials, papers, or guides..."
};

const DEFAULT_RESOURCES = [];

const DEFAULT_GENERAL_SETTINGS = {
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
};

const WebSettingsTab = ({
  webSubTab,
  setWebSubTab,
  homeSectionTab,
  setHomeSectionTab,
  webCourses = [],
  setWebCourses,
  webHomeSettings = {},
  setWebHomeSettings,
  webStats = [],
  setWebStats,
  webTestimonials = [],
  setWebTestimonials,
  webInstructorProfile = {},
  setWebInstructorProfile,
  webAboutSettings = {},
  setWebAboutSettings,
  webCoursesSettings = {},
  setWebCoursesSettings,
  webResourcesSettings = {},
  setWebResourcesSettings,
  webResources = [],
  setWebResources,
  webGeneralSettings = {},
  setWebGeneralSettings,
  webInstructors = [],
  setWebInstructors,
  onSaveSetting
}) => {
  const [editingCourse, setEditingCourse] = useState(null);
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);

  // Instructors CMS State
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [isEditInstructorOpen, setIsEditInstructorOpen] = useState(false);
  const [instructorModalTab, setInstructorModalTab] = useState("basic");

  // Safe normalized home settings with defaults
  const currentHome = {
    ...DEFAULT_HOME_SETTINGS,
    ...webHomeSettings,
    hero: { ...DEFAULT_HOME_SETTINGS.hero, ...(webHomeSettings?.hero || {}) },
    instructorSpotlight: {
      ...DEFAULT_HOME_SETTINGS.instructorSpotlight,
      ...(webHomeSettings?.instructorSpotlight || {}),
      // Also sync if instructor profile has name/quote/image
      name:
        webHomeSettings?.instructorSpotlight?.name ||
        webInstructorProfile?.name ||
        DEFAULT_HOME_SETTINGS.instructorSpotlight.name,
      quote:
        webHomeSettings?.instructorSpotlight?.quote ||
        webInstructorProfile?.quote ||
        DEFAULT_HOME_SETTINGS.instructorSpotlight.quote,
      image:
        webHomeSettings?.instructorSpotlight?.image ||
        webInstructorProfile?.image ||
        DEFAULT_HOME_SETTINGS.instructorSpotlight.image
    },
    "Our Courses": {
      ...DEFAULT_HOME_SETTINGS["Our Courses"],
      ...(webHomeSettings?.["Our Courses"] || {})
    },
    "Watch a Sample Lesson": {
      ...DEFAULT_HOME_SETTINGS["Watch a Sample Lesson"],
      ...(webHomeSettings?.["Watch a Sample Lesson"] || {})
    },
    "Our Success Stories": {
      ...DEFAULT_HOME_SETTINGS["Our Success Stories"],
      ...(webHomeSettings?.["Our Success Stories"] || {})
    },
    "What Students Say": {
      ...DEFAULT_HOME_SETTINGS["What Students Say"],
      ...(webHomeSettings?.["What Students Say"] || {})
    },
    cta: { ...DEFAULT_HOME_SETTINGS.cta, ...(webHomeSettings?.cta || {}) },
    branding: { ...DEFAULT_HOME_SETTINGS.branding, ...(webHomeSettings?.branding || {}) }
  };

  const updateHomeNested = (section, field, value) => {
    const updated = {
      ...currentHome,
      [section]: {
        ...currentHome[section],
        [field]: value
      }
    };
    setWebHomeSettings(updated);

    // If updating instructor spotlight, also update webInstructorProfile for full sync
    if (section === "instructorSpotlight") {
      const updatedInstructor = {
        ...webInstructorProfile,
        [field]: value
      };
      setWebInstructorProfile(updatedInstructor);
    }
  };

  const handleSaveAllHome = () => {
    onSaveSetting("webHomeSettings", currentHome);
    onSaveSetting("webStats", webStats);
    onSaveSetting("webTestimonials", webTestimonials);
    onSaveSetting("webInstructorProfile", {
      ...webInstructorProfile,
      name: currentHome.instructorSpotlight.name,
      role: currentHome.instructorSpotlight.role,
      quote: currentHome.instructorSpotlight.quote,
      image: currentHome.instructorSpotlight.image
    });
    onSaveSetting("webCourses", webCourses);
  };

  // Safe normalized About settings with defaults
  const currentAbout = {
    ...DEFAULT_ABOUT_SETTINGS,
    ...webAboutSettings
  };

  const updateAboutField = (field, value) => {
    const updated = {
      ...currentAbout,
      [field]: value
    };
    setWebAboutSettings(updated);
  };

  const handleSaveAbout = () => {
    onSaveSetting("webAboutSettings", currentAbout);
    if (setWebInstructorProfile) {
      const updatedProfile = {
        ...webInstructorProfile,
        name: currentAbout.teacherName || webInstructorProfile.name,
        role: currentAbout.teacherRole || webInstructorProfile.role,
        image: currentAbout.image || webInstructorProfile.image,
        philosophy: currentAbout.phil || webInstructorProfile.philosophy
      };
      setWebInstructorProfile(updatedProfile);
      onSaveSetting("webInstructorProfile", updatedProfile);
    }
  };

  // Safe normalized Courses settings with defaults
  const currentCoursesSettings = {
    ...DEFAULT_COURSES_SETTINGS,
    ...webCoursesSettings
  };

  const updateCoursesSettingsField = (field, value) => {
    const updated = {
      ...currentCoursesSettings,
      [field]: value
    };
    setWebCoursesSettings(updated);
  };

  const handleSaveCoursesPage = () => {
    onSaveSetting("webCoursesSettings", currentCoursesSettings);
    onSaveSetting("webCourses", webCourses);
  };

  const handleToggleCourseVisibility = (id) => {
    const updated = webCourses.map((c) =>
      c.id === id ? { ...c, isHidden: !c.isHidden } : c
    );
    setWebCourses(updated);
    onSaveSetting("webCourses", updated);
  };

  const handleDuplicateCourse = (course) => {
    const duplicated = {
      ...course,
      id: Date.now(),
      title: `${course.title} (Copy)`
    };
    const updated = [...webCourses, duplicated];
    setWebCourses(updated);
    onSaveSetting("webCourses", updated);
  };

  const handleSaveCourseCard = (e) => {
    e.preventDefault();
    let updated;
    const existingIndex = webCourses.findIndex((c) => c.id === editingCourse.id);
    if (existingIndex > -1) {
      updated = webCourses.map((c) => (c.id === editingCourse.id ? editingCourse : c));
    } else {
      updated = [...webCourses, { ...editingCourse, id: editingCourse.id || Date.now() }];
    }
    setWebCourses(updated);
    onSaveSetting("webCourses", updated);
    setIsEditCourseOpen(false);
  };

  const handleDeleteCourseCard = (id) => {
    const updated = webCourses.filter((c) => c.id !== id);
    setWebCourses(updated);
    onSaveSetting("webCourses", updated);
  };

  // Resources CMS State & Helpers
  const [editingResource, setEditingResource] = useState(null);
  const [isEditResourceOpen, setIsEditResourceOpen] = useState(false);
  const [newSubjectInput, setNewSubjectInput] = useState("");
  const [newGradeInputs, setNewGradeInputs] = useState({});

  const currentResourcesSettings = {
    ...DEFAULT_RESOURCES_SETTINGS,
    ...webResourcesSettings
  };

  const updateResourcesSettingsField = (field, value) => {
    const updated = {
      ...currentResourcesSettings,
      [field]: value
    };
    setWebResourcesSettings(updated);
  };

  const handleSaveResourcesPage = () => {
    onSaveSetting("webResourcesSettings", currentResourcesSettings);
    onSaveSetting("webResources", webResources);
  };

  const handleToggleResourceVisibility = (id) => {
    const updated = webResources.map((r) =>
      r.id === id ? { ...r, isHidden: !r.isHidden } : r
    );
    setWebResources(updated);
    onSaveSetting("webResources", updated);
  };

  const handleDuplicateResource = (item) => {
    const duplicated = {
      ...item,
      id: Date.now(),
      title: `${item.title} (Copy)`
    };
    const updated = [...webResources, duplicated];
    setWebResources(updated);
    onSaveSetting("webResources", updated);
  };

  const handleSaveResourceItem = (e) => {
    e.preventDefault();
    let updated;
    const existingIndex = webResources.findIndex((r) => r.id === editingResource.id);
    if (existingIndex > -1) {
      updated = webResources.map((r) => (r.id === editingResource.id ? editingResource : r));
    } else {
      updated = [...webResources, { ...editingResource, id: editingResource.id || Date.now() }];
    }
    setWebResources(updated);
    onSaveSetting("webResources", updated);
    setIsEditResourceOpen(false);
  };

  const handleDeleteResourceItem = (id) => {
    const updated = webResources.filter((r) => r.id !== id);
    setWebResources(updated);
    onSaveSetting("webResources", updated);
  };

  // General Settings State & Helpers
  const currentGeneralSettings = {
    ...DEFAULT_GENERAL_SETTINGS,
    ...webGeneralSettings,
    socials: { ...DEFAULT_GENERAL_SETTINGS.socials, ...(webGeneralSettings?.socials || {}) },
    announcementBar: {
      ...DEFAULT_GENERAL_SETTINGS.announcementBar,
      ...(webGeneralSettings?.announcementBar || {})
    }
  };

  const updateGeneralField = (field, value) => {
    const updated = {
      ...currentGeneralSettings,
      [field]: value
    };
    setWebGeneralSettings(updated);
  };

  const updateGeneralNested = (section, field, value) => {
    const updated = {
      ...currentGeneralSettings,
      [section]: {
        ...currentGeneralSettings[section],
        [field]: value
      }
    };
    setWebGeneralSettings(updated);
  };

  const handleSaveGeneralSettings = () => {
    onSaveSetting("webGeneralSettings", currentGeneralSettings);
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    const trimmed = (newSubjectInput || "").trim();
    if (!trimmed) return;
    const currentSubs = currentGeneralSettings.subjects || [];
    const currentGrades = currentGeneralSettings.grades || {};
    if (!currentSubs.includes(trimmed)) {
      const updatedSubs = [...currentSubs, trimmed];
      const updatedGrades = {
        ...currentGrades,
        [trimmed]: currentGrades[trimmed] || []
      };
      const updated = {
        ...currentGeneralSettings,
        subjects: updatedSubs,
        grades: updatedGrades
      };
      setWebGeneralSettings(updated);
      try {
        localStorage.setItem("webGeneralSettings", JSON.stringify(updated));
      } catch (err) {}
      onSaveSetting("webGeneralSettings", updated);
      window.dispatchEvent(new Event("storage"));
    }
    setNewSubjectInput("");
  };

  const handleRemoveSubject = (sub) => {
    const updatedSubs = (currentGeneralSettings.subjects || []).filter((s) => s !== sub);
    const updatedGrades = { ...(currentGeneralSettings.grades || {}) };
    delete updatedGrades[sub];
    const updated = {
      ...currentGeneralSettings,
      subjects: updatedSubs,
      grades: updatedGrades
    };
    setWebGeneralSettings(updated);
    try {
      localStorage.setItem("webGeneralSettings", JSON.stringify(updated));
    } catch (err) {}
    onSaveSetting("webGeneralSettings", updated);
    window.dispatchEvent(new Event("storage"));
  };

  const handleAddGradeToSubject = (sub, gradeName) => {
    const trimmed = (gradeName || "").trim();
    if (!trimmed) return;
    const currentGrades = currentGeneralSettings.grades || {};
    const existing = currentGrades[sub] || [];
    if (!existing.includes(trimmed)) {
      const updatedGrades = {
        ...currentGrades,
        [sub]: [...existing, trimmed]
      };
      const updated = {
        ...currentGeneralSettings,
        grades: updatedGrades
      };
      setWebGeneralSettings(updated);
      try {
        localStorage.setItem("webGeneralSettings", JSON.stringify(updated));
      } catch (err) {}
      onSaveSetting("webGeneralSettings", updated);
      window.dispatchEvent(new Event("storage"));
    }
    setNewGradeInputs((prev) => ({ ...prev, [sub]: "" }));
  };

  const handleRemoveGradeFromSubject = (sub, gradeToRemove) => {
    const currentGrades = currentGeneralSettings.grades || {};
    const existing = currentGrades[sub] || [];
    const updatedGrades = {
      ...currentGrades,
      [sub]: existing.filter((g) => g !== gradeToRemove)
    };
    const updated = {
      ...currentGeneralSettings,
      grades: updatedGrades
    };
    setWebGeneralSettings(updated);
    try {
      localStorage.setItem("webGeneralSettings", JSON.stringify(updated));
    } catch (err) {}
    onSaveSetting("webGeneralSettings", updated);
    window.dispatchEvent(new Event("storage"));
  };

  // Instructors CMS Handlers
  const handleOpenAddInstructor = () => {
    setEditingInstructor({
      id: "inst_" + Date.now(),
      name: "",
      role: "",
      badge: "Trading Mentor",
      image: "/teacher.jpg",
      experience: "3+ Years",
      specialties: ["Order Flow", "Price Action", "Risk Management"],
      bio: "",
      education: [],
      achievements: [],
      quote: "",
      socials: { telegram: "", whatsapp: "", email: "" }
    });
    setInstructorModalTab("basic");
    setIsEditInstructorOpen(true);
  };

  const handleOpenEditInstructor = (inst) => {
    setEditingInstructor({
      ...inst,
      specialties: Array.isArray(inst.specialties) ? [...inst.specialties] : [],
      education: Array.isArray(inst.education) ? [...inst.education] : [],
      achievements: Array.isArray(inst.achievements) ? [...inst.achievements] : [],
      socials: { ...(inst.socials || {}) }
    });
    setInstructorModalTab("basic");
    setIsEditInstructorOpen(true);
  };

  const handleSaveInstructor = (e) => {
    e.preventDefault();
    if (!editingInstructor?.name?.trim()) {
      alert("Please enter the mentor's name.");
      return;
    }
    const currentList = Array.isArray(webInstructors) ? webInstructors : [];
    const existingIndex = currentList.findIndex((i) => i.id === editingInstructor.id);
    let updated;
    if (existingIndex > -1) {
      updated = currentList.map((i) => (i.id === editingInstructor.id ? editingInstructor : i));
    } else {
      updated = [...currentList, { ...editingInstructor, id: editingInstructor.id || ("inst_" + Date.now()) }];
    }
    setWebInstructors(updated);
    try {
      localStorage.setItem("webInstructors", JSON.stringify(updated));
    } catch (err) {}
    onSaveSetting("webInstructors", updated);
    window.dispatchEvent(new Event("storage"));
    setIsEditInstructorOpen(false);
  };

  const handleDeleteInstructor = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name || "this mentor"}" from the website?`)) {
      const currentList = Array.isArray(webInstructors) ? webInstructors : [];
      const updated = currentList.filter((i) => i.id !== id);
      setWebInstructors(updated);
      try {
        localStorage.setItem("webInstructors", JSON.stringify(updated));
      } catch (err) {}
      onSaveSetting("webInstructors", updated);
      window.dispatchEvent(new Event("storage"));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* MAIN CMS HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0e1424]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/80 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Website CMS Management
            </h2>
            <p className="text-xs text-slate-400">
              Complete real-time control over all Home page sections, headlines, videos, and images
            </p>
          </div>
        </div>

        {/* PRIMARY SUBTAB SELECTOR */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
          {[
            { id: "Home", label: "Home Page", icon: Home },
            { id: "Instructors", label: "Faculty & Mentors", icon: GraduationCap },
            { id: "About", label: "About Page", icon: Info },
            { id: "Courses", label: "Courses Page", icon: BookOpen },
            { id: "Resources", label: "Resources Page", icon: FolderOpen },
            { id: "Setting", label: "General", icon: Sliders }
          ].map((sub) => {
            const Icon = sub.icon;
            const isSelected = webSubTab === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setWebSubTab(sub.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                  isSelected
                    ? "bg-teal-600 text-white shadow-lg shadow-teal-600/25"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sub.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HOMEPAGE SECTIONS CMS                                                     */}
      {/* ========================================================================= */}
      {webSubTab === "Home" && (
        <div className="space-y-6">
          {/* HOME SECTION TABS NAVIGATION */}
          <div className="bg-[#0e1424]/90 backdrop-blur-xl p-2 rounded-2xl border border-slate-800/80 flex items-center gap-2 overflow-x-auto">
            {[
              { id: "Hero Section", label: "1. Hero & Badges", icon: Sparkles },
              { id: "Portfolio", label: "2. Teacher Spotlight", icon: UserCheck },
              { id: "Our Courses", label: "3. Course Cards", icon: BookOpen },
              { id: "Watch a Sample Lesson", label: "4. Sample Video", icon: Video },
              { id: "Our Success Stories", label: "5. Success Stats", icon: Award },
              { id: "What Students Say", label: "6. Testimonials", icon: MessageSquare },
              { id: "CTA Banner", label: "7. Bottom CTA Banner", icon: Flame },
              { id: "Branding", label: "Site Branding & Logo", icon: ImageIcon }
            ].map((section) => {
              const Icon = section.icon;
              const isSelected = homeSectionTab === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setHomeSectionTab(section.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* 1. HERO SECTION CONFIG                                              */}
          {/* ------------------------------------------------------------------- */}
          {homeSectionTab === "Hero Section" && (
            <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 shadow-2xl space-y-8 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    <span>Hero Section & Main Showcase</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Customize the top hero headline, subtitle, buttons, badges, and the main hero photo
                  </p>
                </div>
                <button
                  onClick={handleSaveAllHome}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center gap-2 self-start sm:self-auto"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Hero Section</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* LEFT: TEXT CONTROLS */}
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Top Announcement Pill Badge
                    </label>
                    <input
                      type="text"
                      value={currentHome.hero.badge}
                      onChange={(e) => updateHomeNested("hero", "badge", e.target.value)}
                      placeholder="Premier Crypto & Trading Academy LK"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Main Headline Title
                    </label>
                    <input
                      type="text"
                      value={currentHome.hero.title}
                      onChange={(e) => updateHomeNested("hero", "title", e.target.value)}
                      placeholder="Master Institutional Crypto & Order Flow Trading"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Subtitle / Description Paragraph
                    </label>
                    <textarea
                      rows={3}
                      value={currentHome.hero.subtitle}
                      onChange={(e) => updateHomeNested("hero", "subtitle", e.target.value)}
                      placeholder="සරලව සහ නිවැරදිව විෂය කරුණු ඉගෙන ගෙන විශිෂ්ඨ සාමාර්ථයක් කරා යමු..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3.5 text-xs text-slate-200 outline-none resize-none leading-relaxed"
                    />
                  </div>

                  {/* ACTION BUTTONS CONFIG */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-4">
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                      Call-to-Action Buttons
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 block mb-1">
                          Primary Button Text
                        </label>
                        <input
                          type="text"
                          value={currentHome.hero.enrollBtnText}
                          onChange={(e) =>
                            updateHomeNested("hero", "enrollBtnText", e.target.value)
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 block mb-1">
                          Primary Button Link
                        </label>
                        <input
                          type="text"
                          value={currentHome.hero.enrollBtnLink}
                          onChange={(e) =>
                            updateHomeNested("hero", "enrollBtnLink", e.target.value)
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 block mb-1">
                          WhatsApp Button Text
                        </label>
                        <input
                          type="text"
                          value={currentHome.hero.whatsappBtnText}
                          onChange={(e) =>
                            updateHomeNested("hero", "whatsappBtnText", e.target.value)
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 block mb-1">
                          WhatsApp Link / Number
                        </label>
                        <input
                          type="text"
                          value={currentHome.hero.whatsappUrl}
                          onChange={(e) =>
                            updateHomeNested("hero", "whatsappUrl", e.target.value)
                          }
                          placeholder="https://wa.me/947XXXXXXXX"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SOCIAL PROOF TEXT */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Social Proof Badge Text
                    </label>
                    <input
                      type="text"
                      value={currentHome.hero.socialProofText}
                      onChange={(e) =>
                        updateHomeNested("hero", "socialProofText", e.target.value)
                      }
                      placeholder="Over 5,000+ Students Guided to Distinctions"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                {/* RIGHT: HERO MAIN IMAGE & FLOATING BADGES */}
                <div className="space-y-6">
                  {/* DUAL IMAGE INPUT FOR HERO IMAGE */}
                  <DualImageInput
                    label="Hero Main Showcase Image"
                    recommended="Recommended: High-res PNG with transparent or dark background, or portrait"
                    value={currentHome.hero.heroImage}
                    defaultPreset="/hero-image.png"
                    onChange={(val) => updateHomeNested("hero", "heroImage", val)}
                  />

                  {/* FLOATING BADGES CONFIG */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-4">
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                      Floating Showcase Badges
                    </p>

                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                          Badge 1 (Bottom Left)
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Title (e.g. 98% A/L Pass Rate)"
                            value={currentHome.hero.floatingBadge1Title}
                            onChange={(e) =>
                              updateHomeNested("hero", "floatingBadge1Title", e.target.value)
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                          />
                          <input
                            type="text"
                            placeholder="Subtitle (e.g. Consistent Island Results)"
                            value={currentHome.hero.floatingBadge1Subtitle}
                            onChange={(e) =>
                              updateHomeNested(
                                "hero",
                                "floatingBadge1Subtitle",
                                e.target.value
                              )
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300"
                          />
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider">
                          Badge 2 (Top Right)
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Title (e.g. 24/7 LMS Portal)"
                            value={currentHome.hero.floatingBadge2Title}
                            onChange={(e) =>
                              updateHomeNested("hero", "floatingBadge2Title", e.target.value)
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                          />
                          <input
                            type="text"
                            placeholder="Subtitle (e.g. Full Video & Note Archive)"
                            value={currentHome.hero.floatingBadge2Subtitle}
                            onChange={(e) =>
                              updateHomeNested(
                                "hero",
                                "floatingBadge2Subtitle",
                                e.target.value
                              )
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* 2. INSTRUCTOR SHORT SPOTLIGHT                                       */}
          {/* ------------------------------------------------------------------- */}
          {homeSectionTab === "Portfolio" && (
            <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 shadow-2xl space-y-8 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-indigo-400" />
                    <span>Teacher Spotlight & Profile Banner</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Customize the lecturer spotlight card appearing right below the hero on the homepage
                  </p>
                </div>
                <button
                  onClick={handleSaveAllHome}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Teacher Spotlight</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Section Pill Badge
                    </label>
                    <input
                      type="text"
                      value={currentHome.instructorSpotlight.badge}
                      onChange={(e) =>
                        updateHomeNested("instructorSpotlight", "badge", e.target.value)
                      }
                      placeholder="Lead Lecturer & Academic Director"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1.5">
                        Teacher / Lecturer Name
                      </label>
                      <input
                        type="text"
                        value={currentHome.instructorSpotlight.name}
                        onChange={(e) =>
                          updateHomeNested("instructorSpotlight", "name", e.target.value)
                        }
                        placeholder="Taizer Lead Trader"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1.5">
                        Role / Designation
                      </label>
                      <input
                        type="text"
                        value={currentHome.instructorSpotlight.role}
                        onChange={(e) =>
                          updateHomeNested("instructorSpotlight", "role", e.target.value)
                        }
                        placeholder="Crypto & Order Flow Specialist"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Teaching Philosophy / Bio Quote
                    </label>
                    <textarea
                      rows={4}
                      value={currentHome.instructorSpotlight.quote}
                      onChange={(e) =>
                        updateHomeNested("instructorSpotlight", "quote", e.target.value)
                      }
                      placeholder="Empowering traders with institutional execution strategies, order flow footprint analysis..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3.5 text-xs text-slate-200 outline-none resize-none leading-relaxed"
                    />
                  </div>

                  {/* PROFILE BUTTONS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-1">
                        Button 1 Text
                      </label>
                      <input
                        type="text"
                        value={currentHome.instructorSpotlight.btn1Text}
                        onChange={(e) =>
                          updateHomeNested("instructorSpotlight", "btn1Text", e.target.value)
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-1">
                        Button 1 Link
                      </label>
                      <input
                        type="text"
                        value={currentHome.instructorSpotlight.btn1Link}
                        onChange={(e) =>
                          updateHomeNested("instructorSpotlight", "btn1Link", e.target.value)
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-1">
                        Button 2 Text
                      </label>
                      <input
                        type="text"
                        value={currentHome.instructorSpotlight.btn2Text}
                        onChange={(e) =>
                          updateHomeNested("instructorSpotlight", "btn2Text", e.target.value)
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-1">
                        Button 2 Link
                      </label>
                      <input
                        type="text"
                        value={currentHome.instructorSpotlight.btn2Link}
                        onChange={(e) =>
                          updateHomeNested("instructorSpotlight", "btn2Link", e.target.value)
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* RIGHT: TEACHER PHOTO SELECTOR */}
                <div>
                  <DualImageInput
                    label="Teacher Profile Photo"
                    recommended="Recommended: Square or portrait photograph (JPG/PNG)"
                    value={currentHome.instructorSpotlight.image}
                    defaultPreset="/teacher.jpg"
                    onChange={(val) => updateHomeNested("instructorSpotlight", "image", val)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* 3. OUR COURSES CARDS                                                */}
          {/* ------------------------------------------------------------------- */}
          {homeSectionTab === "Our Courses" && (
            <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 shadow-2xl space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    <span>Homepage Courses Section</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure the section headers and manage interactive course cards
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingCourse({
                        id: Date.now(),
                        title: "",
                        desc: "",
                        color: "from-blue-600/20",
                        border: "border-blue-500/20",
                        text: "text-blue-400",
                        iconBg: "bg-blue-500/20",
                        btn: "bg-blue-600",
                        details: {
                          overview: ["Core subject overview", "Exam-targeted focus"],
                          learn: ["Key syllabus units", "Model questions"],
                          duration: "Annual Program",
                          target: "Students",
                          includes: ["PDF Notes", "Recorded Lessons"]
                        }
                      });
                      setIsEditCourseOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/25"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Course</span>
                  </button>
                  <button
                    onClick={handleSaveAllHome}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Headers</span>
                  </button>
                </div>
              </div>

              {/* SECTION HEADERS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Section Badge
                  </label>
                  <input
                    type="text"
                    value={currentHome["Our Courses"].badge}
                    onChange={(e) => updateHomeNested("Our Courses", "badge", e.target.value)}
                    placeholder="Structured Curriculum"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={currentHome["Our Courses"].title}
                    onChange={(e) => updateHomeNested("Our Courses", "title", e.target.value)}
                    placeholder="Specialized Course Programs"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Section Subtitle
                  </label>
                  <input
                    type="text"
                    value={currentHome["Our Courses"].subtitle}
                    onChange={(e) =>
                      updateHomeNested("Our Courses", "subtitle", e.target.value)
                    }
                    placeholder="Select your grade level below..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* COURSES LIST */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {webCourses.map((c, i) => (
                  <div
                    key={c.id || i}
                    className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between space-y-4 group hover:border-indigo-500/40 transition-all shadow-xl"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 font-black text-xs flex items-center justify-center">
                          #{i + 1}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingCourse(c);
                              setIsEditCourseOpen(true);
                            }}
                            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                            title="Edit course"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourseCard(c.id)}
                            className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-600 hover:text-white"
                            title="Delete course"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h4 className="text-base font-bold text-white">{c.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{c.desc}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {c.details?.duration || "Standard"}
                      </span>
                      <span className="text-[10px] font-black text-indigo-400">
                        {c.details?.overview?.length || 0} Syllabus Bullets
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* 4. SAMPLE VIDEO SECTION                                             */}
          {/* ------------------------------------------------------------------- */}
          {homeSectionTab === "Watch a Sample Lesson" && (
            <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 shadow-2xl space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                    <Video className="w-5 h-5 text-indigo-400" />
                    <span>Watch a Sample Lesson Cinema</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Embed YouTube lectures or hosted video clips for prospective students
                  </p>
                </div>
                <button
                  onClick={handleSaveAllHome}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Video Settings</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Section Badge
                    </label>
                    <input
                      type="text"
                      value={currentHome["Watch a Sample Lesson"].badge}
                      onChange={(e) =>
                        updateHomeNested("Watch a Sample Lesson", "badge", e.target.value)
                      }
                      placeholder="Virtual Classroom"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={currentHome["Watch a Sample Lesson"].title}
                      onChange={(e) =>
                        updateHomeNested("Watch a Sample Lesson", "title", e.target.value)
                      }
                      placeholder="Experience Our Teaching Style"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Section Subtitle
                    </label>
                    <input
                      type="text"
                      value={currentHome["Watch a Sample Lesson"].subtitle}
                      onChange={(e) =>
                        updateHomeNested("Watch a Sample Lesson", "subtitle", e.target.value)
                      }
                      placeholder="Watch a sample online session on Market Structure & Order Flow."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Video URL (YouTube Embed or direct video link)
                    </label>
                    <input
                      type="text"
                      value={currentHome["Watch a Sample Lesson"].videoUrl}
                      onChange={(e) =>
                        updateHomeNested("Watch a Sample Lesson", "videoUrl", e.target.value)
                      }
                      placeholder="https://www.youtube-nocookie.com/embed/ERb6D8MW-u0"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Tip: Use YouTube Embed URL: https://www.youtube-nocookie.com/embed/VIDEO_ID
                    </p>
                  </div>
                </div>

                {/* LIVE VIDEO PREVIEW */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">
                    Live Video Stage Preview
                  </span>
                  <div className="rounded-2xl overflow-hidden aspect-video bg-black border border-slate-800 shadow-2xl relative">
                    {currentHome["Watch a Sample Lesson"].videoUrl ? (
                      <iframe
                        src={currentHome["Watch a Sample Lesson"].videoUrl}
                        title="Sample Lesson"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                        No video URL configured
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* 5. SUCCESS STORIES (STATS COUNTERS)                                 */}
          {/* ------------------------------------------------------------------- */}
          {homeSectionTab === "Our Success Stories" && (
            <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 shadow-2xl space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-400" />
                    <span>Achievement Stats Counters</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Highlight key academic milestones and distinctions
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setWebStats([
                        ...webStats,
                        { label: "New Milestone", value: "100+", color: "text-indigo-400" }
                      ]);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Counter</span>
                  </button>
                  <button
                    onClick={handleSaveAllHome}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Stats</span>
                  </button>
                </div>
              </div>

              {/* SECTION HEADERS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Section Badge
                  </label>
                  <input
                    type="text"
                    value={currentHome["Our Success Stories"].badge}
                    onChange={(e) =>
                      updateHomeNested("Our Success Stories", "badge", e.target.value)
                    }
                    placeholder="Proven Track Record"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={currentHome["Our Success Stories"].title}
                    onChange={(e) =>
                      updateHomeNested("Our Success Stories", "title", e.target.value)
                    }
                    placeholder="Proven Academic Excellence"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Section Subtitle
                  </label>
                  <input
                    type="text"
                    value={currentHome["Our Success Stories"].subtitle}
                    onChange={(e) =>
                      updateHomeNested("Our Success Stories", "subtitle", e.target.value)
                    }
                    placeholder="Consistently producing Island rankers..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* STATS LIST */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {webStats.map((stat, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Counter #{i + 1}
                      </span>
                      {webStats.length > 1 && (
                        <button
                          onClick={() => {
                            setWebStats(webStats.filter((_, idx) => idx !== i));
                          }}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">
                        Metric Value
                      </label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const updated = [...webStats];
                          updated[i].value = e.target.value;
                          setWebStats(updated);
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-lg font-black text-indigo-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">
                        Label Description
                      </label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const updated = [...webStats];
                          updated[i].label = e.target.value;
                          setWebStats(updated);
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* 6. WHAT STUDENTS SAY (TESTIMONIALS)                                 */}
          {/* ------------------------------------------------------------------- */}
          {homeSectionTab === "What Students Say" && (
            <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 shadow-2xl space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-indigo-400" />
                    <span>Student Reviews & Testimonials</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Share feedback and success stories from alumni and high-ranking students
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setWebTestimonials([
                        ...webTestimonials,
                        {
                          text: "Exceptional teaching and very easy-to-understand notes.",
                          author: "New Student",
                          location: "District Rank"
                        }
                      ]);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Review</span>
                  </button>
                  <button
                    onClick={handleSaveAllHome}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Testimonials</span>
                  </button>
                </div>
              </div>

              {/* SECTION HEADERS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Section Badge
                  </label>
                  <input
                    type="text"
                    value={currentHome["What Students Say"].badge}
                    onChange={(e) =>
                      updateHomeNested("What Students Say", "badge", e.target.value)
                    }
                    placeholder="Student Feedback"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={currentHome["What Students Say"].title}
                    onChange={(e) =>
                      updateHomeNested("What Students Say", "title", e.target.value)
                    }
                    placeholder="What Students Say"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Section Subtitle
                  </label>
                  <input
                    type="text"
                    value={currentHome["What Students Say"].subtitle}
                    onChange={(e) =>
                      updateHomeNested("What Students Say", "subtitle", e.target.value)
                    }
                    placeholder="Hear directly from our past students..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* TESTIMONIALS LIST */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {webTestimonials.map((tm, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800/80 space-y-4 shadow-xl relative group flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 font-bold text-xs flex items-center justify-center">
                          ★ 5.0
                        </span>
                        {webTestimonials.length > 1 && (
                          <button
                            onClick={() => {
                              setWebTestimonials(webTestimonials.filter((_, idx) => idx !== i));
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <textarea
                        rows={4}
                        value={tm.text}
                        onChange={(e) => {
                          const updated = [...webTestimonials];
                          updated[i].text = e.target.value;
                          setWebTestimonials(updated);
                        }}
                        placeholder="Student quote..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 outline-none resize-none leading-relaxed"
                      />
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Student Name"
                        value={tm.author}
                        onChange={(e) => {
                          const updated = [...webTestimonials];
                          updated[i].author = e.target.value;
                          setWebTestimonials(updated);
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Location / Rank"
                        value={tm.location}
                        onChange={(e) => {
                          const updated = [...webTestimonials];
                          updated[i].location = e.target.value;
                          setWebTestimonials(updated);
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* 7. BOTTOM CALL TO ACTION BANNER                                     */}
          {/* ------------------------------------------------------------------- */}
          {homeSectionTab === "CTA Banner" && (
            <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 shadow-2xl space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                    <Flame className="w-5 h-5 text-indigo-400" />
                    <span>Bottom Call-to-Action Banner</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Customize the closing call-to-action banner at the very bottom of the homepage
                  </p>
                </div>
                <button
                  onClick={handleSaveAllHome}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save CTA Banner</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Main Banner Headline
                    </label>
                    <input
                      type="text"
                      value={currentHome.cta.title}
                      onChange={(e) => updateHomeNested("cta", "title", e.target.value)}
                      placeholder="Ready To Accelerate Your Exam Results?"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Banner Subtitle / Description
                    </label>
                    <textarea
                      rows={3}
                      value={currentHome.cta.subtitle}
                      onChange={(e) => updateHomeNested("cta", "subtitle", e.target.value)}
                      placeholder="Join the next live interactive lecture and unlock all revision materials on the LMS portal."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3.5 text-xs text-slate-200 outline-none resize-none leading-relaxed"
                    />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-4">
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    Banner Action Triggers
                  </p>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Primary Button Text
                    </label>
                    <input
                      type="text"
                      value={currentHome.cta.primaryBtnText}
                      onChange={(e) => updateHomeNested("cta", "primaryBtnText", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Primary Button Link
                    </label>
                    <input
                      type="text"
                      value={currentHome.cta.primaryBtnLink}
                      onChange={(e) => updateHomeNested("cta", "primaryBtnLink", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Secondary (WhatsApp) Button Text
                    </label>
                    <input
                      type="text"
                      value={currentHome.cta.secondaryBtnText}
                      onChange={(e) =>
                        updateHomeNested("cta", "secondaryBtnText", e.target.value)
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Secondary Button Link / URL
                    </label>
                    <input
                      type="text"
                      value={currentHome.cta.secondaryBtnLink}
                      onChange={(e) =>
                        updateHomeNested("cta", "secondaryBtnLink", e.target.value)
                      }
                      placeholder="https://wa.me/"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* 8. SITE BRANDING & LOGO                                             */}
          {/* ------------------------------------------------------------------- */}
          {homeSectionTab === "Branding" && (
            <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 shadow-2xl space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-indigo-400" />
                    <span>Website Branding & Logo</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Upload your institution logo (browser file upload or image URL) and brand names
                  </p>
                </div>
                <button
                  onClick={handleSaveAllHome}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Branding</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <DualImageInput
                    label="Official Logo (Used on Navbar & Footer)"
                    recommended="Recommended: Square or transparent PNG/SVG logo"
                    value={currentHome.branding.logo}
                    defaultPreset="/logo.png"
                    onChange={(val) => updateHomeNested("branding", "logo", val)}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Academy / Brand Name
                    </label>
                    <input
                      type="text"
                      value={currentHome.branding.siteName}
                      onChange={(e) => updateHomeNested("branding", "siteName", e.target.value)}
                      placeholder="Taizer LMS"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Brand Tagline
                    </label>
                    <input
                      type="text"
                      value={currentHome.branding.siteTagline}
                      onChange={(e) =>
                        updateHomeNested("branding", "siteTagline", e.target.value)
                      }
                      placeholder="Crypto & Forex Trading LMS"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* FACULTY & MENTORS CMS SUBTAB (අපගේ ප්‍රවීණ ගුරු මණ්ඩලය)                   */}
      {/* ========================================================================= */}
      {webSubTab === "Instructors" && (
        <div className="space-y-6 animate-fadeIn">
          {/* TOP ACTION BAR */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0e1424]/90 backdrop-blur-xl p-5 rounded-2xl border border-slate-800/80 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Faculty & Mentors (අපගේ ප්‍රවීණ ගුරු මණ්ඩලය)</h3>
                <p className="text-xs text-slate-400">
                  Manage mentors, credentials, photos, specialties, and contact links displayed across the academy website.
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenAddInstructor}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Mentor</span>
            </button>
          </div>

          {/* INSTRUCTORS GRID */}
          <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Active Mentors & Instructors ({(webInstructors || []).length})</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Click Edit to update profile details, credentials, or photos. Click Delete to remove from the website.
                </p>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                Auto-synced with Live Website & Database
              </span>
            </div>

            {(!webInstructors || webInstructors.length === 0) ? (
              <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-950/50 space-y-4">
                <GraduationCap className="w-12 h-12 text-slate-600 mx-auto" />
                <div>
                  <h4 className="text-sm font-bold text-slate-300">No Mentors Configured</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Add trading mentors and instructors to showcase their expertise and verified credentials on the website.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddInstructor}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
                >
                  + Add First Mentor
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {webInstructors.map((inst, index) => (
                  <div
                    key={inst.id || index}
                    className="group bg-slate-950/80 rounded-2xl border border-slate-800/90 hover:border-indigo-500/50 transition-all p-5 flex flex-col justify-between space-y-5 relative overflow-hidden shadow-lg"
                  >
                    {/* TOP BADGE & ACTIONS */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                        {inst.badge || "Mentor"}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditInstructor(inst)}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-indigo-600/30 hover:border-indigo-500/50 transition-all"
                          title="Edit Profile"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteInstructor(inst.id, inst.name)}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 hover:border-rose-500/40 transition-all"
                          title="Delete Instructor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* MENTOR PHOTO & INFO */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-indigo-500/30 shrink-0 bg-slate-900 shadow-md">
                        <img
                          src={inst.image || "/teacher.jpg"}
                          alt={inst.name || "Mentor"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/teacher.jpg";
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <h4 className="text-sm font-black text-white truncate group-hover:text-indigo-400 transition-colors">
                          {inst.name || "Unnamed Mentor"}
                        </h4>
                        <p className="text-xs text-indigo-300/90 font-medium truncate">
                          {inst.role || "Trading Coach"}
                        </p>
                        {inst.experience && (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded bg-slate-900 text-[10px] text-slate-400 border border-slate-800">
                            <Award className="w-3 h-3 text-amber-400" />
                            <span>{inst.experience}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* SPECIALTIES TAGS */}
                    {Array.isArray(inst.specialties) && inst.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {inst.specialties.slice(0, 3).map((spec, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 text-[10px] font-medium border border-slate-800"
                          >
                            {spec}
                          </span>
                        ))}
                        {inst.specialties.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-slate-900 text-slate-400 text-[10px]">
                            +{inst.specialties.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* BIO PREVIEW */}
                    {inst.bio && (
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {inst.bio}
                      </p>
                    )}

                    {/* STATS / PILLS FOOTER */}
                    <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-3">
                        <span title="Education / Certifications">
                          🎓 {(inst.education || []).length} Certs
                        </span>
                        <span title="Key Achievements">
                          ⭐ {(inst.achievements || []).length} Milestones
                        </span>
                      </div>
                      <button
                        onClick={() => handleOpenEditInstructor(inst)}
                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                      >
                        <span>Edit Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* OTHER SUBTABS (About, Courses, Resources, General)                        */}
      {/* ========================================================================= */}
      {webSubTab === "About" && (
        <div className="space-y-6">
          {/* TOP SAVE ACTION BAR */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0e1424]/90 backdrop-blur-xl p-5 rounded-2xl border border-slate-800/80 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">About Page Content Management</h3>
                <p className="text-xs text-slate-400">
                  Customise biography, teacher photos (upload or URL), credentials, experience, and philosophy
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href="/about"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>View Live Page</span>
                <ExternalLink className="w-3 h-3 ml-0.5 text-slate-500" />
              </a>
              <button
                onClick={handleSaveAbout}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save About Page</span>
              </button>
            </div>
          </div>

          {/* TWO COLUMN CMS EDITOR & LIVE PREVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT: EDITING CONTROLS (7 COLS) */}
            <div className="lg:col-span-7 space-y-6">
              {/* SECTION 1: HERO & HEADINGS */}
              <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    1. Page Header & Introduction
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Announcement Badge
                    </label>
                    <input
                      type="text"
                      value={currentAbout.badge}
                      onChange={(e) => updateAboutField("badge", e.target.value)}
                      placeholder="e.g. Academic Background"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Main Page Title
                    </label>
                    <input
                      type="text"
                      value={currentAbout.title}
                      onChange={(e) => updateAboutField("title", e.target.value)}
                      placeholder="e.g. About the Lecturer"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Introduction / Header Description
                  </label>
                  <textarea
                    rows={3}
                    value={currentAbout.desc}
                    onChange={(e) => updateAboutField("desc", e.target.value)}
                    placeholder="Brief introductory statement about teaching mission and excellence..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* SECTION 2: TEACHER PROFILE & DUAL IMAGE INPUT */}
              <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <UserCheck className="w-4 h-4 text-teal-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    2. Teacher Portrait & Identity
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Teacher Full Name
                    </label>
                    <input
                      type="text"
                      value={currentAbout.teacherName}
                      onChange={(e) => updateAboutField("teacherName", e.target.value)}
                      placeholder="e.g. Taizer Lead Trader"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Teacher Role / Specialty
                    </label>
                    <input
                      type="text"
                      value={currentAbout.teacherRole}
                      onChange={(e) => updateAboutField("teacherRole", e.target.value)}
                      placeholder="e.g. Crypto & Order Flow Specialist"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* DUAL IMAGE INPUT FOR TEACHER PORTRAIT */}
                <DualImageInput
                  label="Teacher Portrait Photo (File Upload or Image URL)"
                  value={currentAbout.image || ""}
                  onChange={(val) => updateAboutField("image", val)}
                  placeholder="Paste direct image URL or upload JPG / PNG from computer"
                  helpText="Supports file upload from device (auto-converted to Base64) or direct web URLs. Live thumbnail updates instantly."
                />
              </div>

              {/* SECTION 3: QUALIFICATIONS & CREDENTIALS */}
              <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    3. Academic Qualifications
                  </h4>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Academic Degrees & Diplomas
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Separate each qualification by a new line or comma
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={currentAbout.quals}
                    onChange={(e) => updateAboutField("quals", e.target.value)}
                    placeholder="Certified Financial Technical Analyst (CFTe)&#10;8+ Years Crypto & Futures Trading Experience&#10;Order Flow & Volume Profile Specialist"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none font-mono leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Each line is rendered with an emerald checkmark badge on the About page.
                  </p>
                </div>
              </div>

              {/* SECTION 4: EXPERIENCE & PHILOSOPHY */}
              <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    4. Experience & Teaching Philosophy
                  </h4>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Teaching Experience & Results Summary
                  </label>
                  <textarea
                    rows={3}
                    value={currentAbout.exp}
                    onChange={(e) => updateAboutField("exp", e.target.value)}
                    placeholder="Extensive experience mentoring traders from beginner to professional prop firm funded levels with live execution strategies..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Teaching Philosophy / Motivational Quote
                  </label>
                  <textarea
                    rows={3}
                    value={currentAbout.phil}
                    onChange={(e) => updateAboutField("phil", e.target.value)}
                    placeholder="Trading is not gambling or guessing; it is probability, strict risk management, and understanding institutional order flow..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed italic"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={currentAbout.btnText}
                      onChange={(e) => updateAboutField("btnText", e.target.value)}
                      placeholder="e.g. Read Full Professional Biography"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Button Target Link
                    </label>
                    <input
                      type="text"
                      value={currentAbout.btnLink}
                      onChange={(e) => updateAboutField("btnLink", e.target.value)}
                      placeholder="e.g. /instructor-profile"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* BOTTOM SAVE BUTTON */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveAbout}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-xl shadow-teal-600/25 flex items-center gap-2 transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All About Page Changes</span>
                </button>
              </div>
            </div>

            {/* RIGHT: LIVE INTERACTIVE PREVIEW CARD (5 COLS) */}
            <div className="lg:col-span-5 sticky top-6 space-y-4">
              <div className="bg-[#0e1424]/95 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-5 shadow-2xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Live About Preview
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold">
                    Real-time
                  </span>
                </div>

                {/* MINI HEADER PREVIEW */}
                <div className="text-center space-y-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold">
                    <GraduationCap className="w-3 h-3 text-indigo-400" />
                    <span>{currentAbout.badge || "Academic Background"}</span>
                  </div>
                  <h4 className="text-base font-black text-white uppercase tracking-tight">
                    {currentAbout.title || "About the Lecturer"}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                    {currentAbout.desc}
                  </p>
                </div>

                {/* TEACHER PORTRAIT PREVIEW */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800/80 p-4 space-y-3">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-slate-800 relative">
                    <img
                      src={currentAbout.image || "/teacher.jpg"}
                      alt={currentAbout.teacherName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/teacher.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                      <div>
                        <p className="text-sm font-bold text-white">
                          {currentAbout.teacherName || "Taizer Lead Trader"}
                        </p>
                        <p className="text-[10px] text-indigo-300">
                          {currentAbout.teacherRole || "Crypto & Order Flow Specialist"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QUALIFICATIONS CHECKLIST PREVIEW */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-xs font-bold text-white">Qualifications</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-slate-300">
                    {(currentAbout.quals || "")
                      .split(/[\n,]/)
                      .map((q) => q.trim())
                      .filter(Boolean)
                      .slice(0, 4)
                      .map((q, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{q}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* TEACHING PHILOSOPHY PREVIEW */}
                {currentAbout.phil && (
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-xs font-bold text-white">Philosophy</span>
                    </div>
                    <p className="text-[11px] text-slate-400 italic line-clamp-3">
                      "{currentAbout.phil}"
                    </p>
                  </div>
                )}

                {/* BUTTON PREVIEW */}
                <div>
                  <div className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-md">
                    <span>{currentAbout.btnText || "Read Full Professional Biography"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {webSubTab === "Courses" && (
        <div className="space-y-6">
          {/* TOP SAVE & ACTION BAR */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0e1424]/90 backdrop-blur-xl p-5 rounded-2xl border border-slate-800/80 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Courses Page Content Management</h3>
                <p className="text-xs text-slate-400">
                  Customise page headers, syllabus highlights, and academic course programs with photos, pricing, and schedules
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href="/courses"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>View Live Page</span>
                <ExternalLink className="w-3 h-3 ml-0.5 text-slate-500" />
              </a>
              <button
                onClick={handleSaveCoursesPage}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save Courses Page</span>
              </button>
            </div>
          </div>

          {/* TWO COLUMN CMS EDITOR & LIVE PREVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT: EDITING CONTROLS (7 COLS) */}
            <div className="lg:col-span-7 space-y-6">
              {/* SECTION 1: HEADER & HEADINGS */}
              <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    1. Page Header & Introduction
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Announcement Badge
                    </label>
                    <input
                      type="text"
                      value={currentCoursesSettings.badge}
                      onChange={(e) => updateCoursesSettingsField("badge", e.target.value)}
                      placeholder="e.g. Official Academic Syllabus"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Main Page Title
                    </label>
                    <input
                      type="text"
                      value={currentCoursesSettings.title}
                      onChange={(e) => updateCoursesSettingsField("title", e.target.value)}
                      placeholder="e.g. Comprehensive Curriculum & Programs"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Subtitle Description
                  </label>
                  <textarea
                    rows={3}
                    value={currentCoursesSettings.desc}
                    onChange={(e) => updateCoursesSettingsField("desc", e.target.value)}
                    placeholder="Brief description of the courses, curriculum targets, and student outcomes..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Enroll Button Text
                    </label>
                    <input
                      type="text"
                      value={currentCoursesSettings.ctaText || "Enroll Today"}
                      onChange={(e) => updateCoursesSettingsField("ctaText", e.target.value)}
                      placeholder="e.g. Enroll Today"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Enroll Target Link
                    </label>
                    <input
                      type="text"
                      value={currentCoursesSettings.ctaLink || "/register"}
                      onChange={(e) => updateCoursesSettingsField("ctaLink", e.target.value)}
                      placeholder="e.g. /register"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: COURSE PROGRAMS CATALOG MANAGER */}
              <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-400" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      2. Course Catalog Programs ({webCourses.length})
                    </h4>
                  </div>
                  <button
                    onClick={() => {
                      setEditingCourse({
                        id: Date.now(),
                        title: "",
                        category: (currentGeneralSettings.subjects && currentGeneralSettings.subjects[0]) || "Crypto Basic",
                        badge: "Active Program",
                        desc: "",
                        schedule: "Weekly Live Zoom Lectures",
                        price: "Rs. 2,500 / Month",
                        image: "",
                        features: "Full Theory & Revision\nModel Paper Discussions\nUnlimited LMS Portal Access",
                        curriculum: "Comprehensive syllabus coverage, unit evaluations, and past paper dissection.",
                        portalAccess: "Full access to video recordings and downloadable notes on LMS portal.",
                        color: "from-blue-600/20",
                        border: "border-blue-500/20",
                        text: "text-blue-400",
                        iconBg: "bg-blue-500/20",
                        btn: "bg-blue-600",
                        isHidden: false
                      });
                      setIsEditCourseOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Course</span>
                  </button>
                </div>

                {/* LIST OF COURSES */}
                <div className="space-y-3">
                  {webCourses.map((c, i) => (
                    <div
                      key={c.id || i}
                      className={`p-4 rounded-2xl border transition-all ${
                        c.isHidden
                          ? "bg-slate-950/40 border-slate-900 opacity-60"
                          : "bg-slate-950/80 border-slate-800/80 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-3.5">
                          {c.image ? (
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                              <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-sm shrink-0">
                              #{i + 1}
                            </div>
                          )}

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="text-sm font-bold text-white">{c.title || "Untitled Course"}</h5>
                              {c.category && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                                  {c.category}
                                </span>
                              )}
                              {c.badge && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                  {c.badge}
                                </span>
                              )}
                              {c.isHidden && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                  Hidden
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-indigo-400" />
                                {c.schedule || "Weekly Lectures"}
                              </span>
                              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                                <CreditCard className="w-3 h-3" />
                                {c.price || "Tuition"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* ROW ACTIONS */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          <button
                            onClick={() => handleToggleCourseVisibility(c.id)}
                            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                            title={c.isHidden ? "Make visible on website" : "Hide from website"}
                          >
                            {c.isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleDuplicateCourse(c)}
                            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                            title="Duplicate course"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingCourse(c);
                              setIsEditCourseOpen(true);
                            }}
                            className="p-2 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white"
                            title="Edit full course"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourseCard(c.id)}
                            className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-600 hover:text-white"
                            title="Delete course"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {webCourses.length === 0 && (
                    <div className="text-center py-10 rounded-2xl border border-dashed border-slate-800 text-slate-500 text-xs">
                      No courses added yet. Click "+ Add New Course" above to create one.
                    </div>
                  )}
                </div>
              </div>

              {/* BOTTOM SAVE BUTTON */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveCoursesPage}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-xl shadow-teal-600/25 flex items-center gap-2 transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Courses Page Changes</span>
                </button>
              </div>
            </div>

            {/* RIGHT: LIVE INTERACTIVE PREVIEW (5 COLS) */}
            <div className="lg:col-span-5 sticky top-6 space-y-4">
              <div className="bg-[#0e1424]/95 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-5 shadow-2xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Live Courses Preview
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold">
                    Real-time
                  </span>
                </div>

                {/* MINI HEADER PREVIEW */}
                <div className="text-center space-y-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold">
                    <BookOpen className="w-3 h-3 text-indigo-400" />
                    <span>{currentCoursesSettings.badge || "Official Academic Syllabus"}</span>
                  </div>
                  <h4 className="text-base font-black text-white uppercase tracking-tight">
                    {currentCoursesSettings.title || "Academic Courses"}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                    {currentCoursesSettings.desc}
                  </p>
                </div>

                {/* FIRST 2 COURSE CARDS PREVIEW */}
                <div className="space-y-3">
                  {webCourses
                    .filter((c) => !c.isHidden)
                    .slice(0, 2)
                    .map((course, idx) => (
                      <div
                        key={course.id || idx}
                        className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden space-y-3"
                      >
                        {course.image && (
                          <div className="aspect-[16/9] w-full bg-slate-900 relative overflow-hidden border-b border-slate-800">
                            <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2">
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-600 text-white">
                                {course.badge || "Active"}
                              </span>
                            </div>
                          </div>
                        )}
                        <div className="p-3.5 space-y-2">
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-bold text-white line-clamp-1">{course.title}</h5>
                            <span className="text-[10px] text-emerald-400 font-bold">{course.price}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2">{course.desc}</p>
                          <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/60">
                            <span>{course.schedule}</span>
                            <span className="text-indigo-400 font-bold">
                              {currentCoursesSettings.ctaText || "Enroll"} →
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* VIEW FULL PAGE BUTTON */}
                <a
                  href="/courses"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Open Full /courses Page</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {webSubTab === "Resources" && (
        <div className="space-y-6">
          {/* TOP SAVE & ACTION BAR */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0e1424]/90 backdrop-blur-xl p-5 rounded-2xl border border-slate-800/80 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <FolderDown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Free Study Library & Resources CMS</h3>
                <p className="text-xs text-slate-400">
                  Manage downloadable past papers, model answers, revision guides, links, and revision tip banners
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href="/resources"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>View Live Page</span>
                <ExternalLink className="w-3 h-3 ml-0.5 text-slate-500" />
              </a>
              <button
                onClick={handleSaveResourcesPage}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save Resources Page</span>
              </button>
            </div>
          </div>

          {/* TWO COLUMN CMS EDITOR & LIVE PREVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT: EDITING CONTROLS (7 COLS) */}
            <div className="lg:col-span-7 space-y-6">
              {/* SECTION 1: HEADER & SEARCH BAR */}
              <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    1. Page Header & Search Bar
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Announcement Badge
                    </label>
                    <input
                      type="text"
                      value={currentResourcesSettings.badge || ""}
                      onChange={(e) => updateResourcesSettingsField("badge", e.target.value)}
                      placeholder="e.g. Open Academic Library"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Main Page Title
                    </label>
                    <input
                      type="text"
                      value={currentResourcesSettings.title || ""}
                      onChange={(e) => updateResourcesSettingsField("title", e.target.value)}
                      placeholder="e.g. Free Educational Resources"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Page Description / Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={currentResourcesSettings.desc || ""}
                    onChange={(e) => updateResourcesSettingsField("desc", e.target.value)}
                    placeholder="Download model papers, formula summary sheets, and past paper discussions..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Live Search Input Placeholder
                  </label>
                  <input
                    type="text"
                    value={currentResourcesSettings.searchPlaceholder || ""}
                    onChange={(e) =>
                      updateResourcesSettingsField("searchPlaceholder", e.target.value)
                    }
                    placeholder="Search study materials, papers, or guides..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* SECTION 2: RESOURCE CATALOG MANAGER */}
              <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-teal-400" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      2. Downloadable Materials Catalog
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {webResources.length} Items
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setEditingResource({
                        id: Date.now(),
                        title: "",
                        category: (currentGeneralSettings.subjects && currentGeneralSettings.subjects[0]) || "Crypto Basic",
                        type: "PDF Document",
                        size: "2.5 MB",
                        badge: "New",
                        url: "",
                        downloadCount: "0",
                        description: "",
                        isHidden: false
                      });
                      setIsEditResourceOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/25 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Resource</span>
                  </button>
                </div>

                {/* RESOURCE LIST */}
                <div className="space-y-3">
                  {webResources.map((item, idx) => {
                    return (
                      <div
                        key={item.id || idx}
                        className={`p-4 rounded-xl border transition-all ${
                          item.isHidden
                            ? "bg-slate-950/40 border-slate-800/50 opacity-60"
                            : "bg-slate-950/80 border-slate-800/80 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                              {item.type?.includes("Video") ? (
                                <Video className="w-4 h-4" />
                              ) : item.type?.includes("Archive") || item.type?.includes("Zip") ? (
                                <FileArchive className="w-4 h-4" />
                              ) : (
                                <FileText className="w-4 h-4" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                {item.badge && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                                    {item.badge}
                                  </span>
                                )}
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                                  {item.category || "General"}
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  {item.type || "PDF"} • {item.size || "Direct"}
                                </span>
                                {item.downloadCount && (
                                  <span className="text-[10px] text-slate-500">
                                    ({item.downloadCount} dl)
                                  </span>
                                )}
                                {item.isHidden && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    Hidden
                                  </span>
                                )}
                              </div>
                              <h5 className="text-xs font-bold text-white mt-1 truncate">
                                {item.title || "Untitled Resource"}
                              </h5>
                              {item.description && (
                                <p className="text-[11px] text-slate-400 truncate max-w-md mt-0.5">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* ACTIONS */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => {
                                setEditingResource({ ...item });
                                setIsEditResourceOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                              title="Edit Resource"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDuplicateResource(item)}
                              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                              title="Duplicate"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleToggleResourceVisibility(item.id)}
                              className={`p-1.5 rounded-lg border ${
                                item.isHidden
                                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                                  : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
                              }`}
                              title={item.isHidden ? "Make Visible" : "Hide from Website"}
                            >
                              {item.isHidden ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteResourceItem(item.id)}
                              className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {webResources.length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                      No resources added yet. Click "+ Add Resource" above to create one.
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 3: STUDY TIP / RECOMMENDATION BANNER */}
              <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Award className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    3. Study Tip & Recommendation Banner
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Tip Badge
                    </label>
                    <input
                      type="text"
                      value={currentResourcesSettings.studyTipBadge || ""}
                      onChange={(e) =>
                        updateResourcesSettingsField("studyTipBadge", e.target.value)
                      }
                      placeholder="e.g. Pro Revision Tip"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Tip Headline
                    </label>
                    <input
                      type="text"
                      value={currentResourcesSettings.studyTipTitle || ""}
                      onChange={(e) =>
                        updateResourcesSettingsField("studyTipTitle", e.target.value)
                      }
                      placeholder="e.g. Consistent Practice Yields Distinctions"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Tip Content / Advice
                  </label>
                  <textarea
                    rows={3}
                    value={currentResourcesSettings.studyTipDesc || ""}
                    onChange={(e) =>
                      updateResourcesSettingsField("studyTipDesc", e.target.value)
                    }
                    placeholder="Download and attempt past papers under timed exam conditions..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Action Button Text
                    </label>
                    <input
                      type="text"
                      value={currentResourcesSettings.studyTipBtnText || ""}
                      onChange={(e) =>
                        updateResourcesSettingsField("studyTipBtnText", e.target.value)
                      }
                      placeholder="e.g. Join Exam Discussion Class"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Action Button Link
                    </label>
                    <input
                      type="text"
                      value={currentResourcesSettings.studyTipBtnLink || ""}
                      onChange={(e) =>
                        updateResourcesSettingsField("studyTipBtnLink", e.target.value)
                      }
                      placeholder="/register"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: LIVE INTERACTIVE PREVIEW (5 COLS) */}
            <div className="lg:col-span-5 sticky top-6 space-y-4">
              <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Live Resources Preview
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Realtime Sync
                  </span>
                </div>

                {/* PREVIEW CONTAINER */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/60 space-y-4">
                  {/* HEADER PREVIEW */}
                  <div className="text-center space-y-2">
                    {currentResourcesSettings.badge && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                        {currentResourcesSettings.badge}
                      </span>
                    )}
                    <h3 className="text-sm font-black text-white">
                      {currentResourcesSettings.title || "Free Educational Resources"}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {currentResourcesSettings.desc}
                    </p>
                  </div>

                  {/* SEARCH BAR PREVIEW */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-[11px] text-slate-400">
                      {currentResourcesSettings.searchPlaceholder || "Search materials..."}
                    </div>
                  </div>

                  {/* CATEGORIES PILLS PREVIEW */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {["All", ...(currentGeneralSettings.subjects || [])].map((cat, i) => (
                      <span
                        key={cat}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                          i === 0
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-900 border border-slate-800 text-slate-400"
                        }`}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* CARDS LIST PREVIEW */}
                  <div className="space-y-2 max-h-[280px] overflow-y-auto custom-scrollbar pr-1">
                    {webResources
                      .filter((r) => !r.isHidden)
                      .slice(0, 4)
                      .map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                              <FileText className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold text-white truncate">
                                {item.title}
                              </p>
                              <p className="text-[10px] text-slate-500 truncate">
                                {item.size || "Direct"} • {item.downloadCount || "0"} dl
                              </p>
                            </div>
                          </div>
                          <div className="px-2.5 py-1 rounded-lg bg-indigo-600/80 text-white text-[10px] font-bold flex items-center gap-1 shrink-0">
                            <Download className="w-3 h-3" />
                            <span>Get</span>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* STUDY TIP PREVIEW */}
                  {currentResourcesSettings.studyTipTitle && (
                    <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 space-y-1">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
                        <Award className="w-3 h-3" />
                        <span>{currentResourcesSettings.studyTipBadge || "Study Tip"}</span>
                      </div>
                      <p className="text-[11px] font-bold text-white">
                        {currentResourcesSettings.studyTipTitle}
                      </p>
                      <p className="text-[10px] text-slate-400 line-clamp-2">
                        {currentResourcesSettings.studyTipDesc}
                      </p>
                    </div>
                  )}
                </div>

                {/* VIEW FULL PAGE BUTTON */}
                <a
                  href="/resources"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Open Full /resources Page</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {webSubTab === "Setting" && (
        <div className="space-y-6">
          {/* TOP SAVE & ACTION BAR */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0e1424]/90 backdrop-blur-xl p-5 rounded-2xl border border-slate-800/80 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Global Platform & Academic Configuration</h3>
                <p className="text-xs text-slate-400">
                  Manage official contact channels, social networks, active academic curriculum, notice banner, and footer branding
                </p>
              </div>
            </div>
            <button
              onClick={handleSaveGeneralSettings}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save General Settings</span>
            </button>
          </div>

          {/* TWO COLUMN CMS EDITOR & LIVE PREVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT: EDITING CONTROLS (7 COLS) */}
            <div className="lg:col-span-7 space-y-6">
              {/* SECTION 1: OFFICIAL CONTACT & SUPPORT CHANNELS */}
              <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Phone className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    1. Official Contact & Support Channels
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Official Support Email</span>
                    </label>
                    <input
                      type="email"
                      value={currentGeneralSettings.supportEmail || ""}
                      onChange={(e) => updateGeneralField("supportEmail", e.target.value)}
                      placeholder="support@taizer.lk"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-blue-400" />
                      <span>Hotline / Phone Number</span>
                    </label>
                    <input
                      type="text"
                      value={currentGeneralSettings.supportPhone || ""}
                      onChange={(e) => updateGeneralField("supportPhone", e.target.value)}
                      placeholder="+94 77 123 4567"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp Direct Number</span>
                    </label>
                    <input
                      type="text"
                      value={currentGeneralSettings.whatsappNumber || ""}
                      onChange={(e) => updateGeneralField("whatsappNumber", e.target.value)}
                      placeholder="94771234567"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Digits only without + (used for wa.me links, e.g. 94771234567)
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Support Working Hours</span>
                    </label>
                    <input
                      type="text"
                      value={currentGeneralSettings.workingHours || ""}
                      onChange={(e) => updateGeneralField("workingHours", e.target.value)}
                      placeholder="Mon - Sun • 8:00 AM - 9:00 PM"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>Academy Location / Physical Address</span>
                  </label>
                  <input
                    type="text"
                    value={currentGeneralSettings.address || ""}
                    onChange={(e) => updateGeneralField("address", e.target.value)}
                    placeholder="Colombo, Sri Lanka"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* SECTION 2: SOCIAL MEDIA & COMMUNITY CHANNELS */}
              <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Share2 className="w-4 h-4 text-blue-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    2. Social Media & Community Channels
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Facebook Page URL
                    </label>
                    <input
                      type="url"
                      value={currentGeneralSettings.socials?.facebook || ""}
                      onChange={(e) => updateGeneralNested("socials", "facebook", e.target.value)}
                      placeholder="https://facebook.com/taizeracademy"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      YouTube Channel URL
                    </label>
                    <input
                      type="url"
                      value={currentGeneralSettings.socials?.youtube || ""}
                      onChange={(e) => updateGeneralNested("socials", "youtube", e.target.value)}
                      placeholder="https://youtube.com/@taizeracademy"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Telegram Channel / Group URL
                    </label>
                    <input
                      type="url"
                      value={currentGeneralSettings.socials?.telegram || ""}
                      onChange={(e) => updateGeneralNested("socials", "telegram", e.target.value)}
                      placeholder="https://t.me/taizeracademy"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      WhatsApp Community Group URL
                    </label>
                    <input
                      type="url"
                      value={currentGeneralSettings.socials?.whatsappGroup || ""}
                      onChange={(e) => updateGeneralNested("socials", "whatsappGroup", e.target.value)}
                      placeholder="https://chat.whatsapp.com/..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Instagram Profile URL
                  </label>
                  <input
                    type="url"
                    value={currentGeneralSettings.socials?.instagram || ""}
                    onChange={(e) => updateGeneralNested("socials", "instagram", e.target.value)}
                    placeholder="https://instagram.com/taizeracademy"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* SECTION 3: ACADEMIC CURRICULUM & SUBJECT TAGS */}
              <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    3. Academic Curriculum & Registration Setup
                  </h4>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Current Academic Year / Intake
                  </label>
                  <input
                    type="text"
                    value={currentGeneralSettings.academicYear || ""}
                    onChange={(e) => updateGeneralField("academicYear", e.target.value)}
                    placeholder="e.g. 2026 / 2027"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* ACTIVE SUBJECT CHIPS */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">
                    Active Subjects (Available in Student Registration & Filter Pills)
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(currentGeneralSettings.subjects || []).map((sub) => (
                      <span
                        key={sub}
                        className="px-3 py-1.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center gap-2"
                      >
                        <Tag className="w-3 h-3 text-indigo-400" />
                        <span>{sub}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubject(sub)}
                          className="w-4 h-4 rounded-full bg-indigo-500/20 hover:bg-red-500 hover:text-white flex items-center justify-center text-[10px] transition-colors"
                          title="Remove subject"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>

                  <form onSubmit={handleAddSubject} className="flex gap-2">
                    <input
                      type="text"
                      value={newSubjectInput}
                      onChange={(e) => setNewSubjectInput(e.target.value)}
                      placeholder="Add new course / subject (e.g. Crypto Basic, Price Action, Scalping)..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Subject</span>
                    </button>
                  </form>
                </div>

                {/* ACTIVE CLASSES / BATCHES PER SUBJECT (SYNCS REGISTRATION & ADMIN CURRICULUM) */}
                <div className="pt-4 border-t border-slate-800/80 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-200 block mb-1">
                      Active Classes / Batches per Subject (Optional Cohorts)
                    </label>
                    <p className="text-[11px] text-slate-400">
                      Configure sub-batches or cohorts if desired (e.g. Batch 01, VIP Group). Standalone trading courses (such as Crypto Basic) without sub-batches will display directly in Registration without asking students for a grade level.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {(currentGeneralSettings.subjects || []).map((sub) => {
                      const gradesForSub = (currentGeneralSettings.grades && currentGeneralSettings.grades[sub]) || [];
                      const inputValue = newGradeInputs[sub] || "";

                      return (
                        <div
                          key={sub}
                          className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-white flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                              {sub} Classes / Batches ({gradesForSub.length})
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              Subject: {sub}
                            </span>
                          </div>

                          {/* Existing Grade Chips */}
                          <div className="flex flex-wrap gap-1.5">
                            {gradesForSub.length === 0 ? (
                              <p className="text-[11px] text-emerald-400/80 italic">
                                Standalone Course — No grade levels required. Students registering for {sub} will be enrolled directly.
                              </p>
                            ) : (
                              gradesForSub.map((g) => (
                                <span
                                  key={g}
                                  className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-sm"
                                >
                                  <span>{g}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveGradeFromSubject(sub, g)}
                                    className="w-4 h-4 rounded-full bg-emerald-500/20 hover:bg-rose-500 hover:text-white flex items-center justify-center text-[9px] transition-colors"
                                    title={`Remove ${g}`}
                                  >
                                    ✕
                                  </button>
                                </span>
                              ))
                            )}
                          </div>

                          {/* Add Class Input */}
                          <div className="flex gap-2 pt-1">
                            <input
                              type="text"
                              value={inputValue}
                              onChange={(e) =>
                                setNewGradeInputs((prev) => ({
                                  ...prev,
                                  [sub]: e.target.value
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddGradeToSubject(sub, inputValue);
                                }
                              }}
                              placeholder={`Add new class for ${sub} (e.g. Batch 2026, Scalping Mastery, Advance Batch)...`}
                              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddGradeToSubject(sub, inputValue)}
                              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-teal-600/20 transition-all active:scale-95 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Class</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* SECTION 4: TOP ANNOUNCEMENT BANNER */}
              <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-amber-400" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      4. Top Announcement Marquee Alert
                    </h4>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs font-bold text-slate-400">Enable Bar:</span>
                    <input
                      type="checkbox"
                      checked={!!currentGeneralSettings.announcementBar?.enabled}
                      onChange={(e) =>
                        updateGeneralNested("announcementBar", "enabled", e.target.checked)
                      }
                      className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800 focus:ring-indigo-500"
                    />
                  </label>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Announcement Notice Text
                  </label>
                  <textarea
                    rows={2}
                    value={currentGeneralSettings.announcementBar?.text || ""}
                    onChange={(e) =>
                      updateGeneralNested("announcementBar", "text", e.target.value)
                    }
                    placeholder="📢 Crypto Basic & Order Flow Masterclass registrations are now open! Limited seats available."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Action Button / Tag Text
                    </label>
                    <input
                      type="text"
                      value={currentGeneralSettings.announcementBar?.linkText || ""}
                      onChange={(e) =>
                        updateGeneralNested("announcementBar", "linkText", e.target.value)
                      }
                      placeholder="Register Now"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Action Button Link / URL
                    </label>
                    <input
                      type="text"
                      value={currentGeneralSettings.announcementBar?.link || ""}
                      onChange={(e) =>
                        updateGeneralNested("announcementBar", "link", e.target.value)
                      }
                      placeholder="/register"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5: FOOTER COPYRIGHT & PLATFORM MOTTO */}
              <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Compass className="w-4 h-4 text-purple-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    5. Footer Notice & Legal Statement
                  </h4>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Platform Motto / Mission Statement Quote
                  </label>
                  <textarea
                    rows={2}
                    value={currentGeneralSettings.footerNotice || ""}
                    onChange={(e) => updateGeneralField("footerNotice", e.target.value)}
                    placeholder="සරලව සහ නිවැරදිව විෂය කරුණු ඉගෙන ගෙන විශිෂ්ඨ සාමාර්ථයක් කරා යමු..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Copyright Line Text
                  </label>
                  <input
                    type="text"
                    value={currentGeneralSettings.copyrightText || ""}
                    onChange={(e) => updateGeneralField("copyrightText", e.target.value)}
                    placeholder="All rights reserved. Secured LMS Platform."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT: LIVE INTERACTIVE PREVIEW (5 COLS) */}
            <div className="lg:col-span-5 sticky top-6 space-y-4">
              <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Live Settings Preview
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Live System Sync
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/60 space-y-4">
                  {/* ANNOUNCEMENT BAR PREVIEW */}
                  {currentGeneralSettings.announcementBar?.enabled && (
                    <div className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-900/40 via-blue-900/40 to-indigo-900/40 border border-indigo-500/30 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping shrink-0" />
                        <p className="text-[11px] text-slate-200 font-medium truncate">
                          {currentGeneralSettings.announcementBar?.text}
                        </p>
                      </div>
                      {currentGeneralSettings.announcementBar?.linkText && (
                        <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[9px] font-bold shrink-0">
                          {currentGeneralSettings.announcementBar?.linkText}
                        </span>
                      )}
                    </div>
                  )}

                  {/* CONTACT INFO CARD */}
                  <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-2.5">
                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Contact Channels</span>
                    </p>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-500">Hotline:</span>
                        <span className="font-semibold text-white">
                          {currentGeneralSettings.supportPhone || "Not set"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-500">WhatsApp:</span>
                        <span className="font-semibold text-emerald-400">
                          +{currentGeneralSettings.whatsappNumber || "Not set"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-500">Email:</span>
                        <span className="font-semibold text-slate-300">
                          {currentGeneralSettings.supportEmail || "Not set"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-500">Hours:</span>
                        <span className="font-semibold text-slate-400">
                          {currentGeneralSettings.workingHours || "Not set"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-500">Location:</span>
                        <span className="font-semibold text-slate-400 truncate max-w-[150px]">
                          {currentGeneralSettings.address || "Not set"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SOCIAL CHANNELS PREVIEW */}
                  <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-2">
                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>Community Links</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(currentGeneralSettings.socials || {}).map(([net, url]) => (
                        <span
                          key={net}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold capitalize border ${
                            url
                              ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300"
                              : "bg-slate-950 border-slate-800 text-slate-600"
                          }`}
                        >
                          {net}: {url ? "Configured" : "Empty"}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CURRICULUM PREVIEW */}
                  <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Curriculum</span>
                      </p>
                      <span className="text-[10px] font-bold text-slate-400">
                        Year: {currentGeneralSettings.academicYear || "Current"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(currentGeneralSettings.subjects || []).map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* FOOTER NOTICE PREVIEW */}
                  {currentGeneralSettings.footerNotice && (
                    <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center space-y-1">
                      <p className="text-[10px] text-slate-400 italic">
                        "{currentGeneralSettings.footerNotice}"
                      </p>
                      <p className="text-[9px] text-slate-500">
                        © {new Date().getFullYear()} Taizer LMS • {currentGeneralSettings.copyrightText || "All rights reserved."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT COURSE CARD MODAL                                                    */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* ENHANCED EDIT COURSE CARD MODAL                                           */}
      {/* ========================================================================= */}
      {isEditCourseOpen && editingCourse && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1424] border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl animate-scaleUp custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-black text-white">Configure Course Program</h3>
              </div>
              <button
                onClick={() => setIsEditCourseOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCourseCard} className="space-y-4">
              {/* BASIC INFO ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCourse.title || ""}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, title: e.target.value })
                    }
                    placeholder="e.g. Crypto Basic Masterclass"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Category / Subject
                  </label>
                  <select
                    value={editingCourse.category || (currentGeneralSettings.subjects && currentGeneralSettings.subjects[0]) || "Crypto Basic"}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, category: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {(currentGeneralSettings.subjects || []).map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                    <option value="General">General / All</option>
                  </select>
                </div>
              </div>

              {/* BADGE & ACCENT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Ribbon / Badge Text
                  </label>
                  <input
                    type="text"
                    value={editingCourse.badge || ""}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, badge: e.target.value })
                    }
                    placeholder="e.g. A/L Distinction Program"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Card Accent Theme
                  </label>
                  <select
                    value={editingCourse.text || "text-blue-400"}
                    onChange={(e) => {
                      const val = e.target.value;
                      let theme = {};
                      if (val === "text-blue-400")
                        theme = {
                          text: "text-blue-400",
                          color: "from-blue-600/20",
                          border: "border-blue-500/20",
                          iconBg: "bg-blue-500/20",
                          btn: "bg-blue-600"
                        };
                      else if (val === "text-purple-400")
                        theme = {
                          text: "text-purple-400",
                          color: "from-purple-600/20",
                          border: "border-purple-500/20",
                          iconBg: "bg-purple-500/20",
                          btn: "bg-purple-600"
                        };
                      else if (val === "text-emerald-400")
                        theme = {
                          text: "text-emerald-400",
                          color: "from-emerald-600/20",
                          border: "border-emerald-500/20",
                          iconBg: "bg-emerald-500/20",
                          btn: "bg-emerald-600"
                        };
                      else if (val === "text-amber-400")
                        theme = {
                          text: "text-amber-400",
                          color: "from-amber-600/20",
                          border: "border-amber-500/20",
                          iconBg: "bg-amber-500/20",
                          btn: "bg-amber-600"
                        };
                      else
                        theme = {
                          text: "text-rose-400",
                          color: "from-rose-600/20",
                          border: "border-rose-500/20",
                          iconBg: "bg-rose-500/20",
                          btn: "bg-rose-600"
                        };
                      setEditingCourse({ ...editingCourse, ...theme });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="text-blue-400">Electric Blue</option>
                    <option value="text-purple-400">Neon Purple</option>
                    <option value="text-emerald-400">Emerald Green</option>
                    <option value="text-amber-400">Amber Gold</option>
                    <option value="text-rose-400">Rose Pink</option>
                  </select>
                </div>
              </div>

              {/* DUAL IMAGE INPUT FOR COURSE BANNER */}
              <DualImageInput
                label="Course Banner / Thumbnail Image (File Upload or Image URL)"
                value={editingCourse.image || ""}
                onChange={(val) => setEditingCourse({ ...editingCourse, image: val })}
                placeholder="Upload JPG/PNG from device or enter image URL"
                helpText="Renders as a crisp 16:9 banner on top of the course card and modal."
              />

              {/* DESCRIPTION */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Course Overview Description
                </label>
                <textarea
                  rows={2}
                  value={editingCourse.desc || ""}
                  onChange={(e) =>
                    setEditingCourse({ ...editingCourse, desc: e.target.value })
                  }
                  placeholder="Summary of course targets, topics covered, and who it is for..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                />
              </div>

              {/* SCHEDULE & PRICE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Lecture Schedule & Timing
                  </label>
                  <input
                    type="text"
                    value={editingCourse.schedule || ""}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, schedule: e.target.value })
                    }
                    placeholder="e.g. Every Sunday • 8:00 AM – 12:00 PM"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Tuition Fee / Pricing
                  </label>
                  <input
                    type="text"
                    value={editingCourse.price || ""}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, price: e.target.value })
                    }
                    placeholder="e.g. Rs. 3,000 / Month"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* KEY FEATURES */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Program Highlights / Key Features
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Separate each item with a new line
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={editingCourse.features || ""}
                  onChange={(e) =>
                    setEditingCourse({ ...editingCourse, features: e.target.value })
                  }
                  placeholder="Full Micro & Macro Theory&#10;Mathematical & Diagrammatic Analysis&#10;Target Past Paper Marking Sessions&#10;Downloadable PDF Summary Sheets"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none font-mono leading-relaxed"
                />
              </div>

              {/* CURRICULUM & PORTAL ACCESS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Curriculum Details (Modal)
                  </label>
                  <textarea
                    rows={2}
                    value={editingCourse.curriculum || ""}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, curriculum: e.target.value })
                    }
                    placeholder="Comprehensive school syllabus coverage, past paper discussions..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    LMS Portal Access Info (Modal)
                  </label>
                  <textarea
                    rows={2}
                    value={editingCourse.portalAccess || ""}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, portalAccess: e.target.value })
                    }
                    placeholder="Full access to video recordings and downloadable notes..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* VISIBILITY CHECKBOX */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="courseVisibleCheckbox"
                  checked={!editingCourse.isHidden}
                  onChange={(e) =>
                    setEditingCourse({ ...editingCourse, isHidden: !e.target.checked })
                  }
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800 focus:ring-indigo-500"
                />
                <label htmlFor="courseVisibleCheckbox" className="text-xs text-slate-300 cursor-pointer select-none">
                  Publish on Website (display in Courses Page and Home Page catalog)
                </label>
              </div>

              {/* MODAL FOOTER */}
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditCourseOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all"
                >
                  Save Course Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT RESOURCE ITEM MODAL                                                 */}
      {/* ========================================================================= */}
      {isEditResourceOpen && editingResource && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1424] border border-slate-800 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl animate-scaleUp custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <FolderDown className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-black text-white">Configure Study Material Resource</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditResourceOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveResourceItem} className="space-y-4">
              {/* RESOURCE TITLE */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Resource Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingResource.title || ""}
                  onChange={(e) =>
                    setEditingResource({ ...editingResource, title: e.target.value })
                  }
                  placeholder="e.g. Order Flow & Footprint Cheat Sheet"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* CATEGORY & TYPE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Category / Subject
                  </label>
                  <select
                    value={editingResource.category || (currentGeneralSettings.subjects && currentGeneralSettings.subjects[0]) || "Crypto Basic"}
                    onChange={(e) =>
                      setEditingResource({ ...editingResource, category: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {(currentGeneralSettings.subjects || []).map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                    <option value="General">General / All</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Material Format / Type
                  </label>
                  <select
                    value={editingResource.type || "PDF Document"}
                    onChange={(e) =>
                      setEditingResource({ ...editingResource, type: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="PDF Document">PDF Document</option>
                    <option value="PDF CheatSheet">PDF CheatSheet</option>
                    <option value="Model Paper & Marking">Model Paper & Marking</option>
                    <option value="Video Lecture Link">Video Lecture Link</option>
                    <option value="Zip Archive">Zip Archive</option>
                  </select>
                </div>
              </div>

              {/* BADGE, FILE SIZE, DOWNLOAD COUNT */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Highlight Badge
                  </label>
                  <input
                    type="text"
                    value={editingResource.badge || ""}
                    onChange={(e) =>
                      setEditingResource({ ...editingResource, badge: e.target.value })
                    }
                    placeholder="Must Read / Quick Revision"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    File Size / Duration
                  </label>
                  <input
                    type="text"
                    value={editingResource.size || ""}
                    onChange={(e) =>
                      setEditingResource({ ...editingResource, size: e.target.value })
                    }
                    placeholder="2.4 MB / 45 Mins"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Downloads Display
                  </label>
                  <input
                    type="text"
                    value={editingResource.downloadCount || ""}
                    onChange={(e) =>
                      setEditingResource({ ...editingResource, downloadCount: e.target.value })
                    }
                    placeholder="1,420"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* DOWNLOAD URL / FILE LINK */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Download URL / Resource Link (Direct PDF or Google Drive Link)
                </label>
                <input
                  type="text"
                  value={editingResource.url || ""}
                  onChange={(e) =>
                    setEditingResource({ ...editingResource, url: e.target.value })
                  }
                  placeholder="https://example.com/file.pdf or Google Drive download link"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Description / Synopsis
                </label>
                <textarea
                  rows={3}
                  value={editingResource.description || ""}
                  onChange={(e) =>
                    setEditingResource({ ...editingResource, description: e.target.value })
                  }
                  placeholder="Summarize the question paper, syllabus sections covered, or key highlights..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                />
              </div>

              {/* VISIBILITY CHECKBOX */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="resourceVisibleCheckbox"
                  checked={!editingResource.isHidden}
                  onChange={(e) =>
                    setEditingResource({ ...editingResource, isHidden: !e.target.checked })
                  }
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800 focus:ring-indigo-500"
                />
                <label
                  htmlFor="resourceVisibleCheckbox"
                  className="text-xs text-slate-300 cursor-pointer select-none"
                >
                  Publish on Website (display in Free Study Library)
                </label>
              </div>

              {/* MODAL FOOTER */}
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditResourceOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all"
                >
                  Save Resource Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT INSTRUCTOR / FACULTY MEMBER MODAL                                   */}
      {/* ========================================================================= */}
      {isEditInstructorOpen && editingInstructor && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1424] border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-scaleUp custom-scrollbar">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {editingInstructor.id ? "Configure Faculty & Mentor Profile" : "Add New Faculty Mentor"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Profile credentials and details shown in website cards and detailed modal
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditInstructorOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* TAB SELECTOR INSIDE MODAL */}
            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800/80">
              {[
                { id: "basic", label: "Basic Info & Bio" },
                { id: "credentials", label: "Credentials & Milestones" },
                { id: "socials", label: "Contact & Links" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setInstructorModalTab(tab.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    instructorModalTab === tab.id
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveInstructor} className="space-y-5">
              {/* TAB 1: BASIC INFO & BIO */}
              {instructorModalTab === "basic" && (
                <div className="space-y-4">
                  {/* PHOTO INPUT WITH DUAL UPLOAD / URL */}
                  <DualImageInput
                    label="Mentor Profile Photo"
                    value={editingInstructor.image || "/teacher.jpg"}
                    onChange={(val) => setEditingInstructor({ ...editingInstructor, image: val })}
                    aspectRatio="aspect-square"
                    recommended="PNG/JPG (Auto-compressed to ~80KB)"
                    defaultPreset="/teacher.jpg"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingInstructor.name || ""}
                        onChange={(e) =>
                          setEditingInstructor({ ...editingInstructor, name: e.target.value })
                        }
                        placeholder="e.g. Taizer Lead Trader"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1.5">
                        Role / Designation
                      </label>
                      <input
                        type="text"
                        value={editingInstructor.role || ""}
                        onChange={(e) =>
                          setEditingInstructor({ ...editingInstructor, role: e.target.value })
                        }
                        placeholder="e.g. Founder & Chief Market Analyst"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1.5">
                        Badge / Tag (Card Top Pill)
                      </label>
                      <input
                        type="text"
                        value={editingInstructor.badge || ""}
                        onChange={(e) =>
                          setEditingInstructor({ ...editingInstructor, badge: e.target.value })
                        }
                        placeholder="e.g. Lead Mentor, Derivatives Expert"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1.5">
                        Trading Experience
                      </label>
                      <input
                        type="text"
                        value={editingInstructor.experience || ""}
                        onChange={(e) =>
                          setEditingInstructor({ ...editingInstructor, experience: e.target.value })
                        }
                        placeholder="e.g. 8+ Years Pro Trading"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* SPECIALTIES */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Specialties / Subject Areas (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={(editingInstructor.specialties || []).join(", ")}
                      onChange={(e) =>
                        setEditingInstructor({
                          ...editingInstructor,
                          specialties: e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                        })
                      }
                      placeholder="Order Flow & DOM, Crypto Microstructure, Volume Profile, Risk Management"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Separate each specialty with a comma (e.g. "Order Flow, Footprint, Crypto").
                    </p>
                  </div>

                  {/* DETAILED BIO */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Professional Biography & Background
                    </label>
                    <textarea
                      rows={4}
                      value={editingInstructor.bio || ""}
                      onChange={(e) =>
                        setEditingInstructor({ ...editingInstructor, bio: e.target.value })
                      }
                      placeholder="Comprehensive introduction, trading background, market expertise, and mentoring philosophy..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: CREDENTIALS & PHILOSOPHY */}
              {instructorModalTab === "credentials" && (
                <div className="space-y-4">
                  {/* EDUCATION / CERTIFICATIONS */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Verified Certifications & Academic Credentials (one per line)
                    </label>
                    <textarea
                      rows={4}
                      value={(editingInstructor.education || []).join("\n")}
                      onChange={(e) =>
                        setEditingInstructor({
                          ...editingInstructor,
                          education: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean)
                        })
                      }
                      placeholder="Certified Financial Technical Analyst (CFTe) - IFTA&#10;Advanced Order Flow Specialist - GMPI&#10;B.Sc. in Financial Engineering"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Type each certification on a separate line. Displayed with verified checkmarks.
                    </p>
                  </div>

                  {/* CAREER MILESTONES & ACHIEVEMENTS */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Key Career Milestones & Achievements (one per line)
                    </label>
                    <textarea
                      rows={4}
                      value={(editingInstructor.achievements || []).join("\n")}
                      onChange={(e) =>
                        setEditingInstructor({
                          ...editingInstructor,
                          achievements: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean)
                        })
                      }
                      placeholder="Funded 6-Figure Proprietary Futures & Crypto Trader&#10;Over 2,500+ Active Students Mentored&#10;Developer of Algorithmic CVD Indicators"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Type each milestone on a separate line. Displayed with trophy icons.
                    </p>
                  </div>

                  {/* TRADING PHILOSOPHY / QUOTE */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Trading Philosophy / Personal Motto
                    </label>
                    <textarea
                      rows={3}
                      value={editingInstructor.quote || ""}
                      onChange={(e) =>
                        setEditingInstructor({ ...editingInstructor, quote: e.target.value })
                      }
                      placeholder="True trading consistency is not about predicting the future; it is executing an edge with mathematical discipline..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed italic"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: CONTACT & SOCIALS */}
              {instructorModalTab === "socials" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Telegram Channel or Handle Link
                    </label>
                    <input
                      type="text"
                      value={editingInstructor.socials?.telegram || ""}
                      onChange={(e) =>
                        setEditingInstructor({
                          ...editingInstructor,
                          socials: { ...(editingInstructor.socials || {}), telegram: e.target.value }
                        })
                      }
                      placeholder="https://t.me/username"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      WhatsApp Contact / Community Link
                    </label>
                    <input
                      type="text"
                      value={editingInstructor.socials?.whatsapp || ""}
                      onChange={(e) =>
                        setEditingInstructor({
                          ...editingInstructor,
                          socials: { ...(editingInstructor.socials || {}), whatsapp: e.target.value }
                        })
                      }
                      placeholder="https://wa.me/94771234567"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Direct Email Address
                    </label>
                    <input
                      type="email"
                      value={editingInstructor.socials?.email || ""}
                      onChange={(e) =>
                        setEditingInstructor({
                          ...editingInstructor,
                          socials: { ...(editingInstructor.socials || {}), email: e.target.value }
                        })
                      }
                      placeholder="mentor@taizeracademy.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* MODAL FOOTER */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditInstructorOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-black shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
                  >
                    Save Mentor Profile
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebSettingsTab;
