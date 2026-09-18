import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  LogIn,
  UserPlus,
  Menu,
  X,
  Sparkles,
  ChevronRight
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Courses", path: "/courses" },
    { name: "Resources", path: "/resources" },
    { name: "Contact", path: "/contact" },
  ];

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

  useEffect(() => {
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
    <nav className="sticky top-0 z-[100] bg-[#070b14]/90 backdrop-blur-2xl border-b border-slate-800/80 transition-all select-none">
      {/* TOP ANNOUNCEMENT BANNER */}
      {generalSettings.announcementBar?.enabled && generalSettings.announcementBar?.text && (
        <div className="bg-gradient-to-r from-indigo-950/90 via-slate-900/95 to-indigo-950/90 border-b border-indigo-500/20 py-2 px-4 text-xs select-none">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-slate-300">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-medium truncate text-slate-200">
                {generalSettings.announcementBar.text}
              </span>
            </div>
            {generalSettings.announcementBar.link && (
              String(generalSettings.announcementBar.link).startsWith("http") ? (
                <a
                  href={generalSettings.announcementBar.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 shrink-0 hover:underline underline-offset-2 transition-all"
                >
                  <span>{generalSettings.announcementBar.linkText || "Learn More"}</span>
                  <ChevronRight className="w-3 h-3" />
                </a>
              ) : (
                <Link
                  to={generalSettings.announcementBar.link}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 shrink-0 hover:underline underline-offset-2 transition-all"
                >
                  <span>{generalSettings.announcementBar.linkText || "Learn More"}</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              )
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* BRAND LOGO */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-w-0">
            <div className="relative shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-600 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center overflow-hidden p-1">
                  {!logoError ? (
                    <img
                      src={branding.logo || "/logo.png"}
                      alt="Logo"
                      className="w-full h-full object-contain"
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    <GraduationCap className="w-4 sm:w-5 h-4 sm:h-5 text-indigo-400" />
                  )}
                </div>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#070b14]" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base md:text-lg font-black tracking-tight text-white uppercase truncate">
                  {branding.siteName ? (
                    branding.siteName
                  ) : (
                    <>
                      Econo<span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">Academy</span>
                    </>
                  )}
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  LK
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-500 font-semibold tracking-wider uppercase -mt-0.5 truncate hidden sm:block">
                {branding.siteTagline || "Economics & Sinhala LMS"}
              </p>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION MENU */}
          <div className="hidden md:flex items-center space-x-1 font-medium bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navTabIndicator"
                      className="absolute inset-0 bg-indigo-600/30 border border-indigo-500/40 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* RIGHT ACTION BUTTONS */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to="/register"
              className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent hover:border-slate-800 transition-all shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Register</span>
            </Link>

            <Link to="/login" className="hidden md:flex shrink-0">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5 shrink-0" />
                <span>LMS Portal</span>
              </motion.button>
            </Link>

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors shrink-0 active:scale-95"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0f1d] border-t border-slate-800/80 overflow-hidden"
          >
            <div className="px-5 py-6 space-y-2.5">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    location.pathname === item.path
                      ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-md shadow-indigo-600/10"
                      : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                  }`}
                >
                  <span>{item.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </Link>
              ))}

              <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2.5">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-center font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Student LMS Portal Login</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-center font-bold text-xs flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4 text-indigo-400" />
                  <span>New Student Registration</span>
                </Link>
                <Link
                  to="/admin-login"
                  onClick={() => setIsOpen(false)}
                  className="text-center text-[10px] font-bold text-slate-500 hover:text-slate-400 uppercase tracking-widest pt-2"
                >
                  Admin Control Console
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
