import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  TrendingUp,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  ArrowUpRight,
  Shield,
  Heart,
  BookOpen
} from "lucide-react";

const Footer = () => {
  const [logoError, setLogoError] = useState(false);
  const [branding, setBranding] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("webHomeSettings") || "{}")?.branding || {};
    } catch (e) {
      return {};
    }
  });

  const [generalSettings, setGeneralSettings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("webGeneralSettings") || "{}");
    } catch (e) {
      return {};
    }
  });

  React.useEffect(() => {
    const handleStorage = (e) => {
      if (!e || !e.key || e.key === "webHomeSettings") {
        try {
          const val = localStorage.getItem("webHomeSettings");
          if (val) setBranding(JSON.parse(val)?.branding || {});
        } catch (err) {}
      }
      if (!e || !e.key || e.key === "webGeneralSettings") {
        try {
          const val = localStorage.getItem("webGeneralSettings");
          if (val) setGeneralSettings(JSON.parse(val));
        } catch (err) {}
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <footer className="bg-[#070b14] text-slate-400 border-t border-slate-800/80 relative overflow-hidden select-none">
      {/* AMBIENT BACKGROUND GLOW */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[300px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 pb-16 border-b border-slate-800/80">
          {/* BRAND COLUMN (2 COLUMNS) */}
          <div className="lg:col-span-2 space-y-5 text-center md:text-left flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center justify-center md:justify-start gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-600 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300 shrink-0">
                <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center overflow-hidden p-1">
                  {!logoError ? (
                    <img
                      src={branding.logo || "/logo.png"}
                      alt="Taizer Logo"
                      className="w-full h-full object-contain"
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-black tracking-tight text-white uppercase">
                  {branding.siteName ? (
                    branding.siteName
                  ) : (
                    <>
                      Taizer<span className="text-emerald-400">LMS</span>
                    </>
                  )}
                </h3>
                <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                  {branding.siteTagline || "Crypto & Forex Trading Academy"}
                </p>
              </div>
            </Link>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed mx-auto md:mx-0">
              {generalSettings.footerNotice ||
                'Empowering traders with institutional price action, smart money concepts, and high-probability market execution.'}
            </p>

            {/* CONTACT & SOCIAL CHANNELS */}
            <div className="flex items-center justify-center md:justify-start gap-2.5 pt-2 flex-wrap">
              <a
                href={
                  generalSettings?.whatsappNumber
                    ? `https://wa.me/${String(generalSettings.whatsappNumber).replace(/[^0-9]/g, "")}`
                    : generalSettings?.socials?.whatsappGroup || "https://wa.me/"
                }
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 flex items-center justify-center transition-all shadow active:scale-95"
                title="WhatsApp Direct"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${generalSettings?.supportEmail || "support@econoacademy.lk"}`}
                className="w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-700/80 flex items-center justify-center transition-all shadow active:scale-95"
                title={`Email: ${generalSettings?.supportEmail || "support@econoacademy.lk"}`}
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={`tel:${String(generalSettings?.supportPhone || "+94700000000").replace(/\s+/g, "")}`}
                className="w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-blue-600 text-slate-300 hover:text-white border border-slate-700/80 flex items-center justify-center transition-all shadow active:scale-95"
                title={`Call: ${generalSettings?.supportPhone || "+94 77 123 4567"}`}
              >
                <Phone className="w-4 h-4" />
              </a>

              {generalSettings.socials?.facebook && (
                <a
                  href={generalSettings.socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 flex items-center justify-center transition-all shadow text-xs font-bold active:scale-95"
                  title="Facebook Page"
                >
                  FB
                </a>
              )}
              {generalSettings.socials?.youtube && (
                <a
                  href={generalSettings.socials.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 flex items-center justify-center transition-all shadow text-xs font-bold active:scale-95"
                  title="YouTube Channel"
                >
                  YT
                </a>
              )}
              {generalSettings.socials?.telegram && (
                <a
                  href={generalSettings.socials.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-white border border-sky-500/20 flex items-center justify-center transition-all shadow text-xs font-bold active:scale-95"
                  title="Telegram Channel"
                >
                  TG
                </a>
              )}
            </div>
          </div>

          {/* RIGHT COLUMNS GRID (3 COLUMNS DESKTOP, 2 COLUMNS MOBILE) */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8 text-left">
            {/* QUICK LINKS */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                Navigation
              </h4>
              <ul className="space-y-2.5 text-xs">
                {[
                  { name: "Home", path: "/" },
                  { name: "About Teacher", path: "/about" },
                  { name: "Courses Syllabus", path: "/courses" },
                  { name: "Free Resources", path: "/resources" },
                  { name: "Contact & Location", path: "/contact" }
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                    >
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ACADEMIC COURSES */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                Courses
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <Link to="/courses" className="hover:text-indigo-400 transition-colors">
                    A/L Economics Full Theory
                  </Link>
                </li>
                <li>
                  <Link to="/courses" className="hover:text-indigo-400 transition-colors">
                    A/L Economics Paper Class
                  </Link>
                </li>
                <li>
                  <Link to="/courses" className="hover:text-indigo-400 transition-colors">
                    O/L Sinhala Language
                  </Link>
                </li>
                <li>
                  <Link to="/courses" className="hover:text-indigo-400 transition-colors">
                    Grade 6-9 Foundation
                  </Link>
                </li>
                <li>
                  <Link to="/resources" className="hover:text-indigo-400 transition-colors">
                    Model Papers & Marking
                  </Link>
                </li>
              </ul>
            </div>

            {/* PORTALS & ADMIN */}
            <div className="col-span-2 sm:col-span-1 space-y-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                Student Portals
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <Link
                    to="/login"
                    className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors flex items-center gap-1"
                  >
                    <span>Student LMS Login</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>New Student Register</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </li>
                <li className="pt-2 border-t border-slate-800/60">
                  <Link
                    to="/admin-login"
                    className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 text-[11px]"
                  >
                    <Shield className="w-3 h-3 text-slate-500" />
                    <span>Admin Control Console</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT BAR */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} {branding.siteName || "EconoAcademy LK"}.{" "}
            {generalSettings.copyrightText || "All rights reserved."}
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6">
            <span>{generalSettings.address || "Colombo, Sri Lanka"}</span>
            <span>•</span>
            <span className="text-slate-400">
              {generalSettings.workingHours || "Secured LMS Platform"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
