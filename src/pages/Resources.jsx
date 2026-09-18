import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FolderDown,
  FileText,
  Video,
  Download,
  Sparkles,
  ExternalLink,
  Search,
  BookOpen,
  FileArchive,
  CheckCircle2,
  Award
} from "lucide-react";

const DEFAULT_RESOURCES_SETTINGS = {
  badge: "Open Academic Library",
  title: "Free Educational Resources",
  desc: "Download model papers, formula summary sheets, and past paper discussions to boost your examination revision.",
  searchPlaceholder: "Search study materials, papers, or guides...",
  studyTipBadge: "Pro Revision Tip",
  studyTipTitle: "Consistent Practice Yields Distinctions",
  studyTipDesc: "Download and attempt at least one past paper under timed exam conditions every week. Compare your answers with our model marking schemes to spot weak areas.",
  studyTipBtnText: "Join Exam Discussion Class",
  studyTipBtnLink: "/register"
};

const DEFAULT_RESOURCES = [];

const Resources = () => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("webResourcesSettings");
      return saved ? { ...DEFAULT_RESOURCES_SETTINGS, ...JSON.parse(saved) } : DEFAULT_RESOURCES_SETTINGS;
    } catch (e) {
      return DEFAULT_RESOURCES_SETTINGS;
    }
  });

  const [resources, setResources] = useState(() => {
    try {
      const saved = localStorage.getItem("webResources");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((r) => !r.isHidden && r.url && !r.url.includes("dummy.pdf"));
        }
      }
    } catch (e) {}
    return [];
  });

  const [generalSettings, setGeneralSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("webGeneralSettings");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { subjects: ["Crypto Basic", "Order Flow"] };
  });

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [downloadToast, setDownloadToast] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/settings");
        if (res.ok) {
          const data = await res.json();
          const target = data.find((s) => s.type === "webResourcesSettings");
          if (target && target.data) {
            setSettings({ ...DEFAULT_RESOURCES_SETTINGS, ...target.data });
          }

          const resTarget = data.find((s) => s.type === "webResources");
          if (resTarget && Array.isArray(resTarget.data)) {
            const cleanList = resTarget.data.filter((r) => !r.isHidden && r.url && !r.url.includes("dummy.pdf"));
            setResources(cleanList);
            try { localStorage.setItem("webResources", JSON.stringify(cleanList)); } catch (e) {}
          }

          const genTarget = data.find((s) => s.type === "webGeneralSettings");
          if (genTarget && genTarget.data) {
            setGeneralSettings(genTarget.data);
            try { localStorage.setItem("webGeneralSettings", JSON.stringify(genTarget.data)); } catch (e) {}
          }
        }
      } catch (e) {
        console.error("Resources fetch error:", e);
      }
    };
    fetchSettings();

    const handleStorage = (e) => {
      if (!e || !e.key || e.key === "webResourcesSettings") {
        try {
          const saved = localStorage.getItem("webResourcesSettings");
          if (saved) setSettings({ ...DEFAULT_RESOURCES_SETTINGS, ...JSON.parse(saved) });
        } catch (err) {}
      }
      if (!e || !e.key || e.key === "webResources") {
        try {
          const saved = localStorage.getItem("webResources");
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              setResources(parsed.filter((r) => !r.isHidden && r.url && !r.url.includes("dummy.pdf")));
            }
          }
        } catch (err) {}
      }
      if (!e || !e.key || e.key === "webGeneralSettings") {
        try {
          const saved = localStorage.getItem("webGeneralSettings");
          if (saved) setGeneralSettings(JSON.parse(saved));
        } catch (err) {}
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const currentSettings = {
    ...DEFAULT_RESOURCES_SETTINGS,
    ...settings
  };

  const categories = [
    "All",
    ...Array.from(
      new Set([
        ...(generalSettings.subjects || []),
        ...resources.map((r) => r.category).filter(Boolean)
      ])
    )
  ];

  const filteredResources = resources.filter((item) => {
    const matchesCat = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      !searchTerm ||
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleDownload = (item) => {
    setDownloadToast(`Starting download: ${item.title}`);
    setTimeout(() => setDownloadToast(null), 3000);

    if (item.url && item.url !== "#") {
      window.open(item.url, "_blank", "noopener,noreferrer");
    }
  };

  const getItemIcon = (type = "") => {
    const t = type.toLowerCase();
    if (t.includes("video")) return <Video className="w-6 h-6" />;
    if (t.includes("zip") || t.includes("archive")) return <FileArchive className="w-6 h-6" />;
    if (t.includes("book") || t.includes("guide")) return <BookOpen className="w-6 h-6" />;
    return <FileText className="w-6 h-6" />;
  };

  return (
    <div className="bg-[#070b14] text-slate-100 min-h-screen py-20 select-none relative">
      {/* DOWNLOAD TOAST */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{downloadToast}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
            <FolderDown className="w-3.5 h-3.5 text-indigo-400" />
            <span>{currentSettings.badge || "Open Academic Library"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {currentSettings.title || "Free Resources"}
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">
            {currentSettings.desc}
          </p>

          {/* SEARCH INPUT BAR */}
          <div className="pt-3 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={currentSettings.searchPlaceholder || "Search study materials, papers, or guides..."}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none shadow-inner"
            />
          </div>

          {/* CATEGORY FILTER PILLS */}
          {categories.length > 2 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
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
                  {cat === "All" ? "All Resources" : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RESOURCE ITEMS LIST */}
        <div className="space-y-4">
          {filteredResources.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              whileHover={{ y: -3 }}
              className="p-6 rounded-3xl bg-[#0e1424]/90 backdrop-blur-xl border border-slate-800/80 hover:border-indigo-500/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all group"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
                  {getItemIcon(item.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                        {item.badge}
                      </span>
                    )}
                    {item.category && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {item.category}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500 font-medium">
                      {item.type || "Document"} • {item.size || "Direct Access"}
                    </span>
                    {item.downloadCount && (
                      <span className="text-[10px] text-slate-500">
                        ({item.downloadCount} downloads)
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleDownload(item)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700/80 transition-all shadow shrink-0 active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </motion.div>
          ))}

          {filteredResources.length === 0 && (
            <div className="text-center py-16 rounded-3xl bg-[#0e1424]/60 border border-slate-800/80 space-y-2">
              <FolderDown className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">No Resources Found</h4>
              <p className="text-xs text-slate-500">
                Try searching with different keywords or choosing another category.
              </p>
            </div>
          )}
        </div>

        {/* STUDY TIP & CALL TO ACTION BANNER */}
        {settings.studyTipTitle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900/30 via-slate-900/60 to-blue-900/30 border border-indigo-500/20 backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="space-y-2 max-w-2xl">
              {settings.studyTipBadge && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Award className="w-3.5 h-3.5" />
                  <span>{settings.studyTipBadge}</span>
                </span>
              )}
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {settings.studyTipTitle}
              </h3>
              {settings.studyTipDesc && (
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {settings.studyTipDesc}
                </p>
              )}
            </div>

            {settings.studyTipBtnText && (
              <a
                href={settings.studyTipBtnLink || "/register"}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all shrink-0 active:scale-95"
              >
                <span>{settings.studyTipBtnText}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Resources;
