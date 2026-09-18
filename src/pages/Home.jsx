import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Play,
  CheckCircle2,
  Trophy,
  Star,
  Users,
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  X,
  Award,
  MessageSquare
} from "lucide-react";
import CandlestickPatternsShowcase from "../components/CandlestickPatternsShowcase";

const Home = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [courses, setCourses] = useState(
    JSON.parse(
      localStorage.getItem("webCourses") ||
        JSON.stringify([
          {
            id: 1,
            title: "Crypto Basic Masterclass",
            desc: "Foundation Blockchain, Wallets & Market Execution",
            color: "from-blue-600/20",
            border: "border-blue-500/30",
            text: "text-blue-400",
            iconBg: "bg-blue-500/20",
            btn: "bg-blue-600",
            details: {
              overview: [
                "Blockchain fundamentals & wallet security",
                "Centralized & Decentralized exchanges setup",
                "Spot & Futures market mechanics",
                "Basic Technical Analysis & chart patterns"
              ],
              learn: [
                "Candlestick patterns & trendlines",
                "Risk management & position sizing",
                "Support, Resistance & Breakouts",
                "Live market analysis sessions"
              ],
              duration: "1 – 2 months (weekly live sessions)",
              target: "Beginner & intermediate crypto traders",
              includes: ["PDF cheat sheets", "Chart setups", "LMS video recordings"]
            }
          },
          {
            id: 2,
            title: "Order Flow & Institutional Volume",
            desc: "Footprint Charts, Delta & Market Microstructure",
            color: "from-purple-600/20",
            border: "border-purple-500/30",
            text: "text-purple-400",
            iconBg: "bg-purple-500/20",
            btn: "bg-purple-600",
            details: {
              overview: [
                "Footprint charts (Bid/Ask volume imbalances)",
                "Cumulative Volume Delta (CVD) divergence",
                "DOM & liquidity absorption zones",
                "Auction Market Theory & Value Areas"
              ],
              learn: [
                "Identifying institutional absorption & trapped traders",
                "High-probability scalp & intraday setups",
                "Advanced order flow execution frameworks",
                "Daily pre-market preparation"
              ],
              duration: "3 months (intensive live masterclass)",
              target: "Experienced traders seeking edge & prop firm funding",
              includes: ["Order Flow indicators", "Private VIP community", "Daily trade breakdowns"]
            }
          }
        ])
    )
  );

const DEFAULT_HOME_SETTINGS = {
  hero: {
    badge: "Premier Crypto & Trading Academy LK",
    title: "Master Crypto Basic & Order Flow Trading",
    subtitle:
      "සරලව සහ නිවැරදිව Technical Analysis හා Order Flow ඉගෙන ගෙන සාර්ථක Trader කෙනෙක් වෙමු. Interactive online LMS, risk management rules, and weekly live trading sessions.",
    enrollBtnText: "Enroll for Classes",
    enrollBtnLink: "/register",
    whatsappBtnText: "Free WhatsApp Community",
    whatsappUrl: "https://wa.me/",
    heroImage: "/hero-image.png",
    floatingBadge1Title: "Institutional Setups",
    floatingBadge1Subtitle: "High-Probability Execution",
    floatingBadge2Title: "24/7 LMS Portal",
    floatingBadge2Subtitle: "Full Video & Note Archive",
    socialProofText: "Over 5,000+ Students Guided to Success"
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

  const [homeSettings, setHomeSettings] = useState(
    JSON.parse(
      localStorage.getItem("webHomeSettings") ||
        JSON.stringify(DEFAULT_HOME_SETTINGS)
    )
  );

  const [stats, setStats] = useState(
    JSON.parse(
      localStorage.getItem("webStats") ||
        JSON.stringify([
          { label: "Funded Traders", value: "250+", color: "text-rose-400" },
          { label: "Active Members", value: "3500+", color: "text-amber-400" },
          { label: "Win Rate", value: "78%", color: "text-emerald-400" },
          { label: "Trader Rating", value: "100%", color: "text-indigo-400" }
        ])
    )
  );

  const [testimonials, setTestimonials] = useState(
    JSON.parse(
      localStorage.getItem("webTestimonials") ||
        JSON.stringify([
          {
            text:
              "The way market structure and candlestick patterns are explained is crystal clear. I finally passed my funded challenge thanks to these structured sessions and online LMS recordings!",
            author: "Kasun Jayawardena",
            location: "Colombo"
          },
          {
            text:
              "Highly recommended for Order Flow and Volume analysis. The best live trading sessions, footprint charts, and risk rules. Cleared all my doubts effortlessly.",
            author: "Sachini Perera",
            location: "Kandy"
          },
          {
            text:
              "Crypto Basic course changed my mindset completely. Proper risk management and disciplined execution instead of gambling.",
            author: "Nimal Silva",
            location: "Galle"
          }
        ])
    )
  );

  const [instructorProfile, setInstructorProfile] = useState(
    JSON.parse(localStorage.getItem("webInstructorProfile") || "{}")
  );

  // Normalized settings combining defaults, localStorage, and API
  const currentSettings = {
    ...DEFAULT_HOME_SETTINGS,
    ...homeSettings,
    hero: { ...DEFAULT_HOME_SETTINGS.hero, ...(homeSettings?.hero || {}) },
    instructorSpotlight: {
      ...DEFAULT_HOME_SETTINGS.instructorSpotlight,
      ...(homeSettings?.instructorSpotlight || {}),
      name:
        homeSettings?.instructorSpotlight?.name ||
        instructorProfile?.name ||
        DEFAULT_HOME_SETTINGS.instructorSpotlight.name,
      role:
        homeSettings?.instructorSpotlight?.role ||
        instructorProfile?.role ||
        DEFAULT_HOME_SETTINGS.instructorSpotlight.role,
      quote:
        homeSettings?.instructorSpotlight?.quote ||
        instructorProfile?.quote ||
        DEFAULT_HOME_SETTINGS.instructorSpotlight.quote,
      image:
        homeSettings?.instructorSpotlight?.image ||
        instructorProfile?.image ||
        DEFAULT_HOME_SETTINGS.instructorSpotlight.image
    },
    "Our Courses": {
      ...DEFAULT_HOME_SETTINGS["Our Courses"],
      ...(homeSettings?.["Our Courses"] || {})
    },
    "Watch a Sample Lesson": {
      ...DEFAULT_HOME_SETTINGS["Watch a Sample Lesson"],
      ...(homeSettings?.["Watch a Sample Lesson"] || {})
    },
    "Our Success Stories": {
      ...DEFAULT_HOME_SETTINGS["Our Success Stories"],
      ...(homeSettings?.["Our Success Stories"] || {})
    },
    "What Students Say": {
      ...DEFAULT_HOME_SETTINGS["What Students Say"],
      ...(homeSettings?.["What Students Say"] || {})
    },
    cta: { ...DEFAULT_HOME_SETTINGS.cta, ...(homeSettings?.cta || {}) }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/settings");
        if (res.ok) {
          const data = await res.json();
          data.forEach((setting) => {
            if (setting.type === "webCourses") setCourses(setting.data);
            if (setting.type === "webHomeSettings") setHomeSettings(setting.data);
            if (setting.type === "webStats") setStats(setting.data);
            if (setting.type === "webTestimonials") setTestimonials(setting.data);
            if (setting.type === "webInstructorProfile") setInstructorProfile(setting.data);
          });
        }
      } catch (e) {
        console.error("Failed to fetch settings from backend", e);
      }
    };
    fetchSettings();

    // Cross-tab & intra-window real-time listener
    const handleStorage = (e) => {
      try {
        if (!e || !e.key || e.key === "webHomeSettings") {
          const val = localStorage.getItem("webHomeSettings");
          if (val) setHomeSettings(JSON.parse(val));
        }
        if (!e || !e.key || e.key === "webCourses") {
          const val = localStorage.getItem("webCourses");
          if (val) setCourses(JSON.parse(val));
        }
        if (!e || !e.key || e.key === "webStats") {
          const val = localStorage.getItem("webStats");
          if (val) setStats(JSON.parse(val));
        }
        if (!e || !e.key || e.key === "webTestimonials") {
          const val = localStorage.getItem("webTestimonials");
          if (val) setTestimonials(JSON.parse(val));
        }
        if (!e || !e.key || e.key === "webInstructorProfile") {
          const val = localStorage.getItem("webInstructorProfile");
          if (val) setInstructorProfile(JSON.parse(val));
        }
      } catch (err) {}
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="bg-[#070b14] text-slate-100 overflow-x-hidden select-none">
      {/* ========================================================================= */}
      {/* 1. CINEMA DARK HERO SECTION                                               */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 border-b border-slate-800/80">
        {/* AMBIENT GLOW ORBS */}
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* HERO TEXT CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-center lg:text-left space-y-7"
            >
              {/* BADGE */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>{currentSettings.hero.badge}</span>
              </div>

              {/* HEADLINE */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.18] font-display">
                {(() => {
                  const title = currentSettings.hero.title || "Master Crypto Basic & Order Flow Trading";
                  const parts = title.split(/(Crypto\s*Basic|Order\s*Flow|Trading|Crypto)/gi);
                  return parts.map((part, index) => {
                    const lower = part.toLowerCase();
                    if (lower.includes("crypto")) {
                      return (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-indigo-400 via-sky-300 to-blue-400 bg-clip-text text-transparent"
                        >
                          {part}
                        </span>
                      );
                    }
                    if (lower.includes("order flow")) {
                      return (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-emerald-400 via-teal-300 to-teal-400 bg-clip-text text-transparent"
                        >
                          {part}
                        </span>
                      );
                    }
                    return part;
                  });
                })()}
              </h1>

              {/* SUBTITLE & MOTTO */}
              <div className="space-y-3 max-w-xl mx-auto lg:mx-0">
                {currentSettings.hero.subtitle?.includes("සරලව") ? (
                  <>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 text-xs sm:text-sm font-medium font-sinhala shadow-lg">
                      <span className="text-amber-400 font-bold">❝</span>
                      <span>
                        {currentSettings.hero.subtitle.split("\n")[0] ||
                          "සරලව සහ නිවැරදිව Technical Analysis හා Order Flow ඉගෙන ගෙන සාර්ථක Trader කෙනෙක් වෙමු."}
                      </span>
                      <span className="text-amber-400 font-bold">❞</span>
                    </div>
                    <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
                      {currentSettings.hero.subtitle.includes("\n")
                        ? currentSettings.hero.subtitle.split("\n").slice(1).join(" ")
                        : currentSettings.hero.subtitle
                            .replace("සරලව සහ නිවැරදිව Technical Analysis හා Order Flow ඉගෙන ගෙන සාර්ථක Trader කෙනෙක් වෙමු.", "")
                            .replace("සරලව සහ නිවැරදිව විෂය කරුණු ඉගෙන ගෙන විශිෂ්ඨ සාමාර්ථයක් කරා යමු.", "")
                            .trim()}
                    </p>
                  </>
                ) : (
                  <p className="text-sm sm:text-base text-slate-400 leading-relaxed whitespace-pre-line font-normal">
                    {currentSettings.hero.subtitle}
                  </p>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to={currentSettings.hero.enrollBtnLink || "/register"}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <span>{currentSettings.hero.enrollBtnText || "Enroll for Classes"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={currentSettings.hero.whatsappUrl || "https://wa.me/"}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{currentSettings.hero.whatsappBtnText || "Free WhatsApp Class"}</span>
                </a>
              </div>

              {/* SOCIAL PROOF AVATARS */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-4 text-center sm:text-left">
                <div className="flex -space-x-2.5 overflow-hidden py-1">
                  {[
                    { initials: "KS", bg: "from-indigo-600 to-violet-600" },
                    { initials: "AN", bg: "from-blue-600 to-cyan-500" },
                    { initials: "DP", bg: "from-emerald-600 to-teal-500" },
                    { initials: "TM", bg: "from-rose-500 to-amber-500" },
                  ].map((student, i) => (
                    <div
                      key={i}
                      className={`inline-flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-[#070b14] bg-gradient-to-tr ${student.bg} shadow-md shadow-black/40 select-none`}
                    >
                      <span className="text-[11px] font-black text-white tracking-wider">
                        {student.initials}
                      </span>
                    </div>
                  ))}
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-[#070b14] bg-slate-900 border border-slate-700/70 text-indigo-400 font-black text-[10px] tracking-tight shadow-md select-none">
                    +5k
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 font-bold mt-0.5">
                    {currentSettings.hero.socialProofText}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* HERO IMAGE SHOWCASE WITH FLOATING BADGES */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 relative max-w-md lg:max-w-none w-full mx-auto"
            >
              <div className="relative rounded-3xl p-1 bg-gradient-to-tr from-indigo-500/40 via-blue-500/20 to-transparent shadow-2xl">
                <div className="rounded-[22px] overflow-hidden bg-slate-950 aspect-[4.5/5] relative border border-slate-800">
                  <img
                    src={currentSettings.hero.heroImage || "/hero-image.png"}
                    alt="Teaching Session"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/hero-image.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-transparent" />
                </div>
              </div>

              {/* FLOATING STAT BADGE 1: PASS RATE (TABLET/DESKTOP) */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-[#0e1424]/95 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 shadow-2xl hidden sm:flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">
                    {currentSettings.hero.floatingBadge1Title}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {currentSettings.hero.floatingBadge1Subtitle}
                  </p>
                </div>
              </motion.div>

              {/* FLOATING STAT BADGE 2: LMS ACCESS (TABLET/DESKTOP) */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -top-6 -right-6 bg-[#0e1424]/95 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 shadow-2xl hidden sm:flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-black">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">
                    {currentSettings.hero.floatingBadge2Title}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {currentSettings.hero.floatingBadge2Subtitle}
                  </p>
                </div>
              </motion.div>

              {/* MOBILE BADGES GRID (VISIBLE ON PHONES) */}
              <div className="sm:hidden grid grid-cols-2 gap-2.5 mt-4">
                <div className="bg-[#0e1424]/95 p-3 rounded-2xl border border-slate-800 flex items-center gap-2.5 shadow-lg">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-black shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-white truncate">
                      {currentSettings.hero.floatingBadge1Title}
                    </h4>
                    <p className="text-[9px] text-slate-400 truncate">
                      {currentSettings.hero.floatingBadge1Subtitle}
                    </p>
                  </div>
                </div>

                <div className="bg-[#0e1424]/95 p-3 rounded-2xl border border-slate-800 flex items-center gap-2.5 shadow-lg">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-black shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-white truncate">
                      {currentSettings.hero.floatingBadge2Title}
                    </h4>
                    <p className="text-[9px] text-slate-400 truncate">
                      {currentSettings.hero.floatingBadge2Subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 1.5 DYNAMIC CANDLESTICK PATTERNS SHOWCASE (BULLISH / BEARISH / NEUTRAL)   */}
      {/* ========================================================================= */}
      <CandlestickPatternsShowcase />

      {/* ========================================================================= */}
      {/* 2. INSTRUCTOR SHORT SPOTLIGHT                                             */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-10">
            <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-indigo-500/30 shrink-0 shadow-2xl">
              <img
                src={currentSettings.instructorSpotlight.image || "/teacher.jpg"}
                alt="Teacher"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/teacher.jpg";
                }}
              />
            </div>

            <div className="space-y-4 text-center md:text-left flex-grow">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
                <Trophy className="w-3.5 h-3.5" />
                <span>{currentSettings.instructorSpotlight.badge}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {currentSettings.instructorSpotlight.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed whitespace-pre-line">
                {currentSettings.instructorSpotlight.quote}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
                <Link
                  to={currentSettings.instructorSpotlight.btn1Link || "/instructor-profile"}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all"
                >
                  <span>{currentSettings.instructorSpotlight.btn1Text || "View Full Credentials & Bio"}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to={currentSettings.instructorSpotlight.btn2Link || "/about"}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all"
                >
                  {currentSettings.instructorSpotlight.btn2Text || "About Our Teaching Methods"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. COURSE OVERVIEW CARDS                                                  */}
      {/* ========================================================================= */}
      <section className="py-24 border-b border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{currentSettings["Our Courses"].badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {currentSettings["Our Courses"].title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              {currentSettings["Our Courses"].subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course, idx) => (
              <motion.div
                key={course.id || idx}
                whileHover={{ y: -8 }}
                className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 hover:border-indigo-500/40 p-8 shadow-2xl flex flex-col justify-between space-y-6 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-black text-sm flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300">
                      Live + LMS
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {course.desc}
                  </p>

                  <ul className="space-y-2 pt-2 text-xs text-slate-300">
                    {(course.details?.overview || []).slice(0, 3).map((pt, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800/80">
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all"
                  >
                    View Syllabus Details
                  </button>
                  <Link
                    to="/register"
                    state={{ selectedCourse: course.title }}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-1.5 transition-all text-center"
                  >
                    <span>Enroll In Course</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SAMPLE LESSON CINEMA PREVIEW                                           */}
      {/* ========================================================================= */}
      <section className="py-24 border-b border-slate-800/80 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
              <Play className="w-3.5 h-3.5 text-indigo-400" />
              <span>{currentSettings["Watch a Sample Lesson"].badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {currentSettings["Watch a Sample Lesson"].title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {currentSettings["Watch a Sample Lesson"].subtitle}
            </p>
          </div>

          <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative group">
            {currentSettings["Watch a Sample Lesson"].isLocal ? (
              <video
                src={currentSettings["Watch a Sample Lesson"].videoUrl}
                className="w-full h-full"
                controls
              />
            ) : (
              <iframe
                className="w-full h-full"
                src={currentSettings["Watch a Sample Lesson"].videoUrl}
                title="Sample Lesson Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SUCCESS STORIES & ACHIEVEMENT STATS                                    */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 rounded-3xl border border-slate-800 p-10 sm:p-14 shadow-2xl">
            <div className="text-center space-y-2 mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
                <Award className="w-3.5 h-3.5" />
                <span>{currentSettings["Our Success Stories"].badge}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                {currentSettings["Our Success Stories"].title}
              </h2>
              <p className="text-xs text-slate-400">
                {currentSettings["Our Success Stories"].subtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((st, i) => (
                <div key={i} className="space-y-1.5">
                  <h3 className={`text-4xl sm:text-5xl font-black ${st.color || "text-indigo-400"}`}>
                    {st.value}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {st.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. STUDENT TESTIMONIALS                                                   */}
      {/* ========================================================================= */}
      <section className="py-24 border-b border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{currentSettings["What Students Say"].badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {currentSettings["What Students Say"].title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {currentSettings["What Students Say"].subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((tm, idx) => (
              <div
                key={idx}
                className="bg-[#0e1424]/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-800/80 shadow-2xl flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                    "{tm.text}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center text-sm">
                    {tm.author?.charAt(0) || "S"}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{tm.author}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {tm.location || "Sri Lanka"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FINAL HIGH-CONVERSION CTA                                              */}
      {/* ========================================================================= */}
      <section className="py-24 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            {currentSettings.cta.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            {currentSettings.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={currentSettings.cta.primaryBtnLink || "/register"}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider shadow-2xl shadow-indigo-600/30"
            >
              {currentSettings.cta.primaryBtnText || "Start Student Registration"}
            </Link>
            <a
              href={currentSettings.cta.secondaryBtnLink || "https://wa.me/"}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{currentSettings.cta.secondaryBtnText || "Contact via WhatsApp"}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* COURSE DETAILS MODAL                                                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0e1424] border border-slate-800 rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase">
                      {selectedCourse.title}
                    </h3>
                    <p className="text-xs text-slate-400">{selectedCourse.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-6 text-xs text-slate-300">
                <div>
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
                    Course Syllabus Overview
                  </h4>
                  <ul className="space-y-1.5">
                    {(selectedCourse.details?.overview || []).map((pt, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
                    What You Will Master
                  </h4>
                  <ul className="space-y-1.5">
                    {(selectedCourse.details?.learn || []).map((pt, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Duration</p>
                    <p className="font-bold text-white mt-0.5">
                      {selectedCourse.details?.duration || "Standard Academic Term"}
                    </p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Target Group</p>
                    <p className="font-bold text-white mt-0.5">
                      {selectedCourse.details?.target || "All Registered Students"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Close
                </button>
                <Link
                  to="/register"
                  state={{ selectedCourse: selectedCourse.title }}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30"
                >
                  Enroll Now
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
