import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  X,
  Tag,
  ShieldCheck,
  GraduationCap
} from "lucide-react";

const DEFAULT_COURSES_SETTINGS = {
  badge: "Official Academic Syllabus",
  title: "Comprehensive Curriculum & Programs",
  desc: "Specialized Sinhala Language and Economics programs structured to guarantee distinctions in National O/L and A/L examinations.",
  ctaText: "Enroll Today",
  ctaLink: "/register"
};

const DEFAULT_COURSES = [
  {
    id: 1,
    title: "Sinhala Language (Grade 6–9)",
    category: "Sinhala",
    badge: "Junior Foundation",
    desc: "Comprehensive grammar, literature, essay structuring, and model paper training designed to build strong linguistic foundations.",
    schedule: "Every Saturday • 8:00 AM – 10:30 AM",
    price: "Rs. 2,000 / Month",
    image: "",
    features: "Grammar & Vocabulary Mastery\nSet Book Literature Analysis\nWeekly Composition Practice\nDownloadable PDF Worksheets",
    curriculum: "Complete school syllabus coverage, past paper discussions, and monthly evaluation tests.",
    portalAccess: "Full access to video recordings and downloadable notes on LMS portal.",
    color: "from-blue-600/20",
    border: "border-blue-500/20",
    text: "text-blue-400",
    iconBg: "bg-blue-500/20",
    btn: "bg-blue-600",
    isHidden: false
  },
  {
    id: 2,
    title: "G.C.E. O/L Sinhala Language (Grade 10–11)",
    category: "Sinhala",
    badge: "O/L Exam Focus",
    desc: "Intensive preparation for O/L candidates covering both papers, prescribed texts, précis writing, and timed mock exams.",
    schedule: "Every Saturday • 2:00 PM – 4:30 PM",
    price: "Rs. 2,500 / Month",
    image: "",
    features: "Prescribed Texts & Poems\n10-Year Past Paper Marking Schemes\nModel Paper Discussions with Timed Sessions\nIndividual Feedback on Essays",
    curriculum: "Grade 10 & 11 syllabus fast-track revision, essay writing techniques, and exam target questions.",
    portalAccess: "24/7 unlimited access to all recordings, discussion forums, and revision notes.",
    color: "from-purple-600/20",
    border: "border-purple-500/20",
    text: "text-purple-400",
    iconBg: "bg-purple-500/20",
    btn: "bg-purple-600",
    isHidden: false
  },
  {
    id: 3,
    title: "G.C.E. A/L Economics (Grade 12–13)",
    category: "Economics",
    badge: "A/L Distinction Program",
    desc: "In-depth economic theory, macro & micro models, national income analysis, fiscal policies, and structured essay writing.",
    schedule: "Every Sunday • 8:00 AM – 12:00 PM",
    price: "Rs. 3,000 / Month",
    image: "",
    features: "Full Micro & Macro Theory\nMathematical & Diagrammatic Analysis\nTarget Island Rank Past Paper Program\nDetailed Model Essay Marking & Feedback",
    curriculum: "Complete A/L syllabus with unit tests, past paper dissection from 2011 to 2024, and government budget analysis.",
    portalAccess: "High-definition recorded lectures, downloadable summary sheets, and MCQ question bank access.",
    color: "from-emerald-600/20",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    iconBg: "bg-emerald-500/20",
    btn: "bg-emerald-600",
    isHidden: false
  }
];

const Courses = () => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("webCoursesSettings");
      return saved ? { ...DEFAULT_COURSES_SETTINGS, ...JSON.parse(saved) } : DEFAULT_COURSES_SETTINGS;
    } catch (e) {
      return DEFAULT_COURSES_SETTINGS;
    }
  });

  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem("webCourses");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((c) => !c.isHidden);
        }
      }
      return DEFAULT_COURSES;
    } catch (e) {
      return DEFAULT_COURSES;
    }
  });

  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/settings");
        if (res.ok) {
          const data = await res.json();
          const target = data.find((s) => s.type === "webCoursesSettings");
          if (target && target.data) {
            setSettings({ ...DEFAULT_COURSES_SETTINGS, ...target.data });
          }

          const coursesTarget = data.find((s) => s.type === "webCourses");
          if (coursesTarget && Array.isArray(coursesTarget.data) && coursesTarget.data.length > 0) {
            setCourses(coursesTarget.data.filter((c) => !c.isHidden));
          }
        }
      } catch (e) {
        console.error("Courses fetch error:", e);
      }
    };
    fetchSettings();

    const handleStorage = (e) => {
      if (!e || !e.key || e.key === "webCoursesSettings") {
        try {
          const saved = localStorage.getItem("webCoursesSettings");
          if (saved) setSettings({ ...DEFAULT_COURSES_SETTINGS, ...JSON.parse(saved) });
        } catch (err) {}
      }
      if (!e || !e.key || e.key === "webCourses") {
        try {
          const saved = localStorage.getItem("webCourses");
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setCourses(parsed.filter((c) => !c.isHidden));
            }
          }
        } catch (err) {}
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const currentSettings = {
    ...DEFAULT_COURSES_SETTINGS,
    ...settings
  };

  const categories = [
    "All",
    ...new Set(courses.map((c) => c.category).filter(Boolean))
  ];

  const displayedCourses =
    activeCategory === "All"
      ? courses
      : courses.filter((c) => c.category === activeCategory);

  return (
    <div className="bg-[#070b14] text-slate-100 min-h-screen py-20 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* PAGE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>{currentSettings.badge || "Official Academic Syllabus"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {currentSettings.title || "Academic Courses"}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed whitespace-pre-line">
            {currentSettings.desc ||
              "Specialized Sinhala Language and Economics programs structured to guarantee distinctions in National O/L and A/L examinations."}
          </p>

          {/* CATEGORY FILTER PILLS */}
          {categories.length > 2 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === cat
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                  }`}
                >
                  {cat === "All" ? "All Programs" : cat}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* COURSES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {displayedCourses.map((course, idx) => {
            const featuresList = (course.features || "")
              .split(/[\n,]/)
              .map((f) => f.trim())
              .filter(Boolean);

            return (
              <motion.div
                key={course.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 hover:border-indigo-500/40 overflow-hidden shadow-2xl flex flex-col justify-between transition-all group"
              >
                {/* CARD TOP (PHOTO OR GRADIENT BANNER) */}
                {course.image ? (
                  <div className="aspect-[16/9] w-full bg-slate-950 relative overflow-hidden border-b border-slate-800">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e1424] via-black/30 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10">
                        {course.category || "Academic"}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white shadow-md">
                        {course.badge || "Active Program"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 pb-0 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-black text-xs flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      {course.category && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300">
                          {course.category}
                        </span>
                      )}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {course.badge || "Active Program"}
                    </span>
                  </div>
                )}

                {/* CARD CONTENT */}
                <div className="p-6 space-y-4 flex-grow">
                  <h3 className="text-lg font-black text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {course.desc}
                  </p>

                  {/* SCHEDULE & PRICE BADGES */}
                  <div className="space-y-2 pt-2 text-xs border-t border-slate-800/80">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">{course.schedule || "Weekly Live Zoom Lectures"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300 font-medium">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-emerald-400">{course.price || "Affordable Monthly Tuition"}</span>
                    </div>
                  </div>

                  {/* FEATURES BULLETS PREVIEW */}
                  {featuresList.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                      {featuresList.slice(0, 3).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-[11px] text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ACTION BUTTONS */}
                <div className="p-6 pt-0 space-y-2.5">
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>View Curriculum Details</span>
                  </button>
                  <Link
                    to={currentSettings.ctaLink || "/register"}
                    state={{ selectedCourse: course.title }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-1.5 transition-all text-center active:scale-95"
                  >
                    <span>{currentSettings.ctaText || "Enroll Today"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* COURSE DETAILS MODAL */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0e1424] border border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl custom-scrollbar"
            >
              {/* MODAL BANNER IMAGE */}
              {selectedCourse.image && (
                <div className="aspect-[16/9] -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-4 overflow-hidden rounded-t-3xl relative border-b border-slate-800">
                  <img
                    src={selectedCourse.image}
                    alt={selectedCourse.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1424] via-transparent to-transparent" />
                </div>
              )}

              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    {selectedCourse.category && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {selectedCourse.category}
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300">
                      {selectedCourse.badge || "Active Program"}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white">
                    {selectedCourse.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* OVERVIEW */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedCourse.desc}
              </p>

              {/* SCHEDULE & TUITION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Class Schedule</span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-200">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{selectedCourse.schedule || "Weekly Live Lectures"}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Monthly Tuition</span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{selectedCourse.price || "Contact for Tuition"}</span>
                  </div>
                </div>
              </div>

              {/* FEATURES LIST */}
              {selectedCourse.features && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Program Highlights
                  </h4>
                  <div className="space-y-1.5">
                    {selectedCourse.features
                      .split(/[\n,]/)
                      .map((f) => f.trim())
                      .filter(Boolean)
                      .map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* CURRICULUM & LMS ACCESS */}
              <div className="space-y-3 text-xs text-slate-300">
                {selectedCourse.curriculum && (
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1">
                    <span className="font-bold text-white block">Curriculum Breakdown:</span>
                    <p className="text-slate-400 leading-relaxed whitespace-pre-line">
                      {selectedCourse.curriculum}
                    </p>
                  </div>
                )}
                {selectedCourse.portalAccess && (
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1">
                    <span className="font-bold text-white block">Student LMS Portal Access:</span>
                    <p className="text-slate-400 leading-relaxed whitespace-pre-line">
                      {selectedCourse.portalAccess}
                    </p>
                  </div>
                )}
              </div>

              {/* MODAL ACTIONS */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-all"
                >
                  Close
                </button>
                <Link
                  to="/register"
                  state={{ selectedCourse: selectedCourse.title }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
                >
                  <span>Register for Class</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Courses;
