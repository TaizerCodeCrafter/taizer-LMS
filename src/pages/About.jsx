import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Briefcase
} from "lucide-react";

const DEFAULT_ABOUT_SETTINGS = {
  badge: "Academic Background",
  title: "About the Lecturer",
  desc: "Dedicated to excellence and holistic student development in Economics and Sinhala.",
  image: "/teacher.jpg",
  teacherName: "Ishara Madhushani",
  teacherRole: "Economics & Sinhala Language Specialist",
  quals:
    "B.A. (Hons) in Economics - University of Sri Jayewardenepura, Diploma in English - Lakshman Yapa Foundation, Advanced Level Distinction Achiever",
  exp: "Extensive teaching experience preparing candidates for national O/L and A/L examinations, with proven island ranks.",
  phil: "Economics is not merely a subject to memorize; it is a lens to understand human decision making and market realities.",
  btnText: "Read Full Professional Biography",
  btnLink: "/instructor-profile"
};

const About = () => {
  const [settings, setSettings] = useState(
    JSON.parse(
      localStorage.getItem("webAboutSettings") ||
        JSON.stringify(DEFAULT_ABOUT_SETTINGS)
    )
  );

  const currentAbout = {
    ...DEFAULT_ABOUT_SETTINGS,
    ...settings
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/settings");
        if (res.ok) {
          const data = await res.json();
          const target = data.find((s) => s.type === "webAboutSettings");
          if (target) setSettings(target.data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchSettings();

    const handleStorage = (e) => {
      if (!e || !e.key || e.key === "webAboutSettings") {
        try {
          const val = localStorage.getItem("webAboutSettings");
          if (val) setSettings(JSON.parse(val));
        } catch (err) {}
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Format qualifications lines
  const qualificationItems = (currentAbout.quals || "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div className="bg-[#070b14] text-slate-100 min-h-screen py-20 select-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* PAGE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
            <span>{currentAbout.badge || "Academic Background"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {currentAbout.title || "About the Teacher"}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed whitespace-pre-line">
            {currentAbout.desc}
          </p>
        </motion.div>

        {/* TWO COLUMN PROFILE & QUALIFICATIONS */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* TEACHER PORTRAIT CARD */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-6 shadow-2xl space-y-6"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-slate-700/80 relative bg-slate-950">
              <img
                src={currentAbout.image || "/teacher.jpg"}
                alt={currentAbout.teacherName || "Teacher"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/teacher.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1424] via-transparent to-transparent" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-white">
                {currentAbout.teacherName || "Ishara Madhushani"}
              </h3>
              <p className="text-xs text-indigo-400 font-semibold">
                {currentAbout.teacherRole || "Economics & Sinhala Language Specialist"}
              </p>
            </div>
          </motion.div>

          {/* RIGHT DETAILS CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* QUALIFICATIONS */}
            <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 shadow-2xl space-y-4">
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Academic Qualifications</h3>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                {qualificationItems.length > 0 ? (
                  qualificationItems.map((q, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{q}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500 italic text-xs">No qualifications entered yet</li>
                )}
              </ul>
            </div>

            {/* TEACHING EXPERIENCE & RESULTS */}
            {currentAbout.exp && (
              <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 shadow-2xl space-y-4">
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-bold text-white">Teaching Experience & Results</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {currentAbout.exp}
                </p>
              </div>
            )}

            {/* TEACHING PHILOSOPHY */}
            {currentAbout.phil && (
              <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 shadow-2xl space-y-4">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-bold text-white">Teaching Philosophy</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic whitespace-pre-line">
                  "{currentAbout.phil}"
                </p>
              </div>
            )}

            {/* FULL BIO LINK */}
            <div className="pt-2">
              <Link
                to={currentAbout.btnLink || "/instructor-profile"}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span>{currentAbout.btnText || "Read Full Professional Biography"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
