import React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  BookOpen,
  HelpCircle,
  GraduationCap,
  Video,
  MessageSquare,
  Globe,
  Settings,
  LogOut,
  Shield,
  Camera
} from "lucide-react";
import { compressImageFile } from "../../utils/imageCompressor";

const NAV_ITEMS = [
  { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "Payment", label: "Payments", icon: CreditCard },
  { id: "Students", label: "Students", icon: Users },
  { id: "Sessions", label: "Curriculum", icon: BookOpen },
  { id: "Questions", label: "MCQ Bank", icon: HelpCircle },
  { id: "LMS", label: "LMS Portal", icon: GraduationCap },
  { id: "Zoom", label: "Live Class", icon: Video },
  { id: "Messages", label: "Messages", icon: MessageSquare },
  { id: "WebSetting", label: "Web Settings", icon: Globe },
  { id: "Settings", label: "Settings", icon: Settings },
];

const AdminSidebar = ({
  activeTab,
  setActiveTab,
  unreadCount = 0,
  pendingPaymentsCount = 0,
  adminProfile,
  brandingLogo = "/logo.png",
  brandingName = "Taizer LMS",
  onQuickUpdateLogo,
  onLogout
}) => {
  return (
    <aside className="w-72 bg-[#090d16]/95 backdrop-blur-2xl border-r border-slate-800/80 flex flex-col shrink-0 select-none relative z-30 shadow-2xl">
      {/* BRAND HEADER */}
      <div className="p-6 pb-4 border-b border-slate-800/60">
        <div className="flex items-center gap-3.5">
          <div className="relative group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center overflow-hidden relative">
                <img
                  src={brandingLogo || "/logo.png"}
                  alt="Logo"
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <Shield className="w-5 h-5 text-indigo-400" />
                
                {/* 1-CLICK QUICK LOGO CHANGER OVERLAY */}
                <label
                  title="Click to change logo / Logo එක වෙනස් කරන්න"
                  className="absolute inset-0 bg-black/75 rounded-[10px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20"
                >
                  <Camera className="w-4 h-4 text-white" />
                  <span className="text-[7px] font-black text-slate-200 uppercase tracking-tighter">Edit</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file && onQuickUpdateLogo) {
                        try {
                          const compressed = await compressImageFile(file, {
                            maxWidth: 500,
                            maxHeight: 500,
                            quality: 0.85
                          });
                          onQuickUpdateLogo(compressed);
                        } catch (err) {
                          console.error("Logo upload error:", err);
                        }
                      }
                    }}
                  />
                </label>
              </div>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#090d16]" />
          </div>

          <div
            className="overflow-hidden cursor-pointer group/title"
            title="Manage Website Branding (Web Settings)"
            onClick={() => setActiveTab("WebSetting")}
          >
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-extrabold tracking-tight text-white uppercase truncate group-hover/title:text-indigo-400 transition-colors">
                {brandingName || "EconoAcademy"}
              </h1>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO ADMIN
              </span>
              <span className="text-[10px] text-slate-500 font-medium">v2.5</span>
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <nav className="flex-grow overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <div className="px-3 pb-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Navigation Menu
          </p>
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isMessages = item.id === "Messages" && unreadCount > 0;
          const isPayments = item.id === "Payment" && pendingPaymentsCount > 0;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-semibold text-xs transition-all duration-200 relative group text-left ${
                isActive
                  ? "text-white font-bold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeSidebarIndicator"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600/25 to-blue-600/15 border border-indigo-500/40 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}

              <div
                className={`relative z-10 w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                    : "bg-slate-800/60 text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <span className="relative z-10 tracking-wide flex-grow">
                {item.label}
              </span>

              {/* Badges */}
              {isMessages && (
                <span className="relative z-10 px-2 py-0.5 text-[10px] font-black rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse">
                  {unreadCount}
                </span>
              )}

              {isPayments && (
                <span className="relative z-10 px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20">
                  {pendingPaymentsCount}
                </span>
              )}

              {isActive && (
                <div className="relative z-10 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* FOOTER USER CARD */}
      <div className="p-3.5 border-t border-slate-800/70 bg-[#070a12]/80">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative shrink-0">
              <img
                src={adminProfile?.photo || "/admin-profile.png"}
                alt="Admin"
                className="w-9 h-9 rounded-lg object-cover border border-slate-700/80"
                onError={(e) => {
                  e.target.src = "/logo.png";
                }}
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#090d16]" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-200 truncate">
                {adminProfile?.name || "Administrator"}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {adminProfile?.email || "admin@econoacademy.lk"}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sign Out"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
