import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Award,
  BookOpen,
  Users,
  CheckCircle2,
  Mail,
  ArrowLeft,
  Briefcase,
  Sparkles,
  TrendingUp
} from "lucide-react";

const InstructorProfile = () => {
  const [profile, setProfile] = useState(
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
            {
              year: "2024",
              degree: "Advanced Order Flow Certification",
              institution: "Global Market Profile Institute"
            },
            {
              year: "2020",
              degree: "Certified Financial Technical Analyst (CFTe)",
              institution: "International Federation of Technical Analysts"
            },
            {
              year: "2018",
              degree: "B.Sc. in Financial Engineering & Analytics",
              institution: "Faculty of Applied Sciences"
            }
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

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/settings");
        if (res.ok) {
          const data = await res.json();
          const target = data.find((s) => s.type === "webInstructorProfile");
          if (target) setProfile(target.data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchSettings();

    const handleStorage = (e) => {
      if (e.key === "webInstructorProfile") {
        try {
          setProfile(JSON.parse(e.newValue || "{}"));
        } catch (err) {}
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div className="bg-[#070b14] text-slate-100 min-h-screen py-20 select-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* BACK NAVIGATION */}
        <div>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to About Page</span>
          </Link>
        </div>

        {/* HERO PROFILE SPOTLIGHT */}
        <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-10">
          <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-3xl overflow-hidden border-2 border-indigo-500/40 shrink-0 shadow-2xl">
            <img
              src={profile.image || "/teacher.jpg"}
              alt="Instructor"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/hero-image.png";
              }}
            />
          </div>

          <div className="space-y-4 text-center md:text-left flex-grow">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{profile.role || "Crypto & Order Flow Specialist"}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              {profile.name || "Taizer Lead Trader"}
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed italic max-w-xl">
              "{profile.quote}"
            </p>

            {/* KEY STATS PILLS */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-slate-200">
                  {profile.expYears || "3+"} Years Teaching
                </span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200">
                  98% A/L Pass Rate
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TWO COLUMN CONTENT: EDUCATION & ACHIEVEMENTS */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* EDUCATION TIMELINE */}
          <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Education & Credentials</h3>
            </div>

            <div className="space-y-4">
              {(profile.education || []).map((edu, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{edu.degree}</h4>
                    <span className="text-[10px] font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10">
                      {edu.year}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{edu.institution}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ACHIEVEMENTS & MILESTONES */}
          <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Career Milestones</h3>
            </div>

            <ul className="space-y-3">
              {(profile.achievements || []).map((ach, idx) => (
                <li
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{ach}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SUBJECT EXPERTISE */}
        <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 shadow-2xl space-y-4">
          <h3 className="text-base font-bold text-white">Subject Disciplines Taught</h3>
          <div className="flex flex-wrap gap-2.5">
            {(profile.subjects || []).map((sub, idx) => (
              <span
                key={idx}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
              >
                {sub}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorProfile;
