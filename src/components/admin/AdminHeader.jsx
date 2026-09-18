import React, { useState, useEffect } from "react";
import {
  Bell,
  Clock,
  Radio,
  Search,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from "lucide-react";

const AdminHeader = ({
  activeTab,
  adminProfile,
  unreadCount = 0,
  pendingPaymentsCount = 0,
  onRefresh,
  onLogout
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });

  return (
    <header className="sticky top-0 z-20 bg-[#080c16]/80 backdrop-blur-xl border-b border-slate-800/80 px-8 py-4">
      <div className="flex items-center justify-between gap-6">
        {/* BREADCRUMB & CONSOLE TITLE */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <span>Admin Console</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-indigo-400 font-bold">{activeTab}</span>
            </div>
            <h2 className="text-sm font-black text-white uppercase tracking-tight mt-0.5">
              {activeTab === "WebSetting" ? "Website CMS Management" : `${activeTab} Management`}
            </h2>
          </div>
        </div>

        {/* RIGHT SYSTEM STATUS & CONTROLS */}
        <div className="flex items-center gap-4">
          {/* SYSTEM SYNC STATUS */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Live Sync Active</span>
          </div>

          {/* LIVE CLOCK */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/40 border border-slate-800 text-slate-300 text-xs font-medium">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{formattedTime}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">{formattedDate}</span>
          </div>

          {/* REFRESH FEED BUTTON */}
          <button
            onClick={onRefresh}
            title="Refresh Data"
            className="w-9 h-9 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* PUBLIC SITE LINK */}
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            title="View Public Website"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition-all"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* ADMIN BADGE */}
          <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-200 leading-tight">
                {adminProfile?.name || "Admin"}
              </p>
              <button
                onClick={onLogout}
                className="text-[10px] font-semibold text-rose-400 hover:text-rose-300 transition-colors uppercase tracking-wider"
              >
                Sign Out
              </button>
            </div>
            <img
              src={adminProfile?.photo || "/admin-profile.png"}
              alt="Admin"
              className="w-10 h-10 rounded-xl object-cover border-2 border-indigo-500/30"
              onError={(e) => {
                e.target.src = "/logo.png";
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
