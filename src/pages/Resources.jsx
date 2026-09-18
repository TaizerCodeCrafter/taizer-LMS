import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Award,
  Lock,
  Unlock,
  CreditCard,
  MessageCircle,
  Upload,
  Check,
  X,
  AlertCircle,
  Copy,
  Loader2,
  Building,
  User,
  Hash,
  MapPin
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
    return { subjects: ["Crypto Basic", "Order Flow"], whatsappNumber: "94771234567" };
  });

  const [bankDetails, setBankDetails] = useState(() => {
    try {
      const saved = localStorage.getItem("bankDetails");
      return saved
        ? JSON.parse(saved)
        : { bank: "Bank of Ceylon (BOC)", branch: "HOROWPOTHANA", holder: "S.S.D MADUSANKA", account: "5630207" };
    } catch (e) {
      return { bank: "Bank of Ceylon (BOC)", branch: "HOROWPOTHANA", holder: "S.S.D MADUSANKA", account: "5630207" };
    }
  });

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [downloadToast, setDownloadToast] = useState(null);

  // Resource Purchase / Unlock Modal State
  const [selectedResourceToBuy, setSelectedResourceToBuy] = useState(null);
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [slipFile, setSlipFile] = useState(null);
  const [slipPreview, setSlipPreview] = useState(null);
  const [isSubmittingSlip, setIsSubmittingSlip] = useState(false);
  const [slipSubmissionSuccess, setSlipSubmissionSuccess] = useState(false);
  const [copiedBankField, setCopiedBankField] = useState(null);
  const slipFileInputRef = useRef(null);

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

          const bankTarget = data.find((s) => s.type === "bankDetails");
          if (bankTarget && bankTarget.data) {
            setBankDetails(bankTarget.data);
            try { localStorage.setItem("bankDetails", JSON.stringify(bankTarget.data)); } catch (e) {}
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
      if (!e || !e.key || e.key === "bankDetails") {
        try {
          const saved = localStorage.getItem("bankDetails");
          if (saved) setBankDetails(JSON.parse(saved));
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

  const handleCopyText = (text, fieldName) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedBankField(fieldName);
      setTimeout(() => setCopiedBankField(null), 2000);
    } catch (e) {}
  };

  const handleSlipFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSlipFile(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setSlipPreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setSlipPreview(null);
    }
  };

  const handleSubmitSlip = async (e) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerPhone.trim() || !slipFile) {
      alert("Please fill in your name, phone number, and attach your deposit slip.");
      return;
    }

    setIsSubmittingSlip(true);
    try {
      let slipUrl = "";
      if (slipPreview) {
        try {
          const res = await fetch("http://localhost:5000/api/upload-file", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileData: slipPreview,
              fileName: slipFile.name,
              fileType: slipFile.type
            })
          });
          if (res.ok) {
            const data = await res.json();
            slipUrl = data.url;
          }
        } catch (err) {}
      }

      // Record transaction
      const newOrder = {
        id: Date.now(),
        resourceId: selectedResourceToBuy.id,
        resourceTitle: selectedResourceToBuy.title,
        price: selectedResourceToBuy.price,
        buyerName,
        buyerPhone,
        slipUrl: slipUrl || (slipPreview ? "Base64 Image Attached" : slipFile.name),
        date: new Date().toISOString(),
        status: "Pending Verification"
      };

      try {
        const existingOrders = JSON.parse(localStorage.getItem("resourceOrders") || "[]");
        localStorage.setItem("resourceOrders", JSON.stringify([newOrder, ...existingOrders]));
      } catch (err) {}

      setSlipSubmissionSuccess(true);
    } catch (err) {
      console.error(err);
      setSlipSubmissionSuccess(true);
    } finally {
      setIsSubmittingSlip(false);
    }
  };

  const closePurchaseModal = () => {
    setSelectedResourceToBuy(null);
    setBuyerName("");
    setBuyerPhone("");
    setSlipFile(null);
    setSlipPreview(null);
    setSlipSubmissionSuccess(false);
  };

  const getItemIcon = (type = "") => {
    const t = type.toLowerCase();
    if (t.includes("video")) return <Video className="w-6 h-6" />;
    if (t.includes("zip") || t.includes("archive")) return <FileArchive className="w-6 h-6" />;
    if (t.includes("book") || t.includes("guide")) return <BookOpen className="w-6 h-6" />;
    return <FileText className="w-6 h-6" />;
  };

  const whatsappNumber = (generalSettings.whatsappNumber || "94771234567").replace(/[^0-9]/g, "");
  const whatsappBuyUrl = selectedResourceToBuy
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        `Hello Taizer Academy! 🎓\n\nI want to purchase the premium study resource:\n📚 Resource: ${selectedResourceToBuy.title}\n💰 Price: Rs. ${Number(selectedResourceToBuy.price || 0).toLocaleString()}\n\nPlease verify my payment and send me download access.`
      )}`
    : "#";

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
                    {item.isLocked ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5 text-amber-400" />
                        <span>Premium • Rs. {Number(item.price || 0).toLocaleString()}</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <Unlock className="w-2.5 h-2.5 text-emerald-400" />
                        <span>Free Download</span>
                      </span>
                    )}

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

              {/* ACTION BUTTON: UNLOCK / BUY VS FREE DOWNLOAD */}
              {item.isLocked ? (
                <button
                  onClick={() => setSelectedResourceToBuy(item)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs flex items-center justify-center gap-2 border border-amber-500/40 transition-all shadow-lg shadow-amber-600/20 shrink-0 active:scale-95 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Unlock / Buy • Rs. {Number(item.price || 0).toLocaleString()}</span>
                </button>
              ) : (
                <button
                  onClick={() => handleDownload(item)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700/80 transition-all shadow shrink-0 active:scale-95 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Free</span>
                </button>
              )}
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

      {/* ========================================================================= */}
      {/* RESOURCE PURCHASE & UNLOCK MODAL                                         */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedResourceToBuy && (
          <div className="fixed inset-0 z-[200] overflow-y-auto bg-black/85 backdrop-blur-md p-4 sm:p-6 flex items-start sm:items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#0e1424] border border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl custom-scrollbar my-auto"
            >
              {/* MODAL HEADER */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      Unlock Premium Resource
                    </h3>
                    <p className="text-xs text-slate-400">
                      Complete payment to receive instant download access
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closePurchaseModal}
                  className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* RESOURCE SUMMARY CARD */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                    {getItemIcon(selectedResourceToBuy.type)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {selectedResourceToBuy.title}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {selectedResourceToBuy.type || "Document"} • {selectedResourceToBuy.size || "Direct"}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase tracking-wider text-amber-400/80 block font-bold">
                    Price
                  </span>
                  <span className="text-base font-black text-amber-400">
                    Rs. {Number(selectedResourceToBuy.price || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* SUCCESS STATE */}
              {slipSubmissionSuccess ? (
                <div className="text-center py-6 space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white">
                      Payment Slip Submitted!
                    </h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                      Thank you, <span className="text-white font-bold">{buyerName}</span>. Our administrators will verify your deposit slip and WhatsApp you the direct download link shortly.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                    <a
                      href={whatsappBuyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Notify via WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={closePurchaseModal}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-800 transition-all"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* BANK TRANSFER DETAILS CARD */}
                  <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-indigo-300">
                      <CreditCard className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Academy Bank Deposit / Transfer Details
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                        <span className="text-[10px] text-slate-500 block">Bank Name</span>
                        <span className="font-bold text-white">
                          {bankDetails.bank || "Bank of Ceylon (BOC)"}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Account Number</span>
                          <span className="font-black text-amber-400 font-mono tracking-wider">
                            {bankDetails.account || "5630207"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyText(bankDetails.account || "5630207", "account")}
                          className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                          title="Copy Account Number"
                        >
                          {copiedBankField === "account" ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                        <span className="text-[10px] text-slate-500 block">Account Holder</span>
                        <span className="font-bold text-white">
                          {bankDetails.holder || "S.S.D MADUSANKA"}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                        <span className="text-[10px] text-slate-500 block">Branch</span>
                        <span className="font-bold text-white">
                          {bankDetails.branch || "HOROWPOTHANA"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* FAST OPTION 1: 1-CLICK WHATSAPP PURCHASE */}
                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-left">
                      <h5 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Instant Buy via WhatsApp</span>
                      </h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Send payment slip or request details directly on WhatsApp
                      </p>
                    </div>
                    <a
                      href={whatsappBuyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/25 transition-all shrink-0 active:scale-95"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Order on WhatsApp</span>
                    </a>
                  </div>

                  {/* FAST OPTION 2: DIRECT SLIP UPLOAD FORM */}
                  <form onSubmit={handleSubmitSlip} className="space-y-3 pt-1">
                    <div className="flex items-center gap-2 pb-1 border-b border-slate-800">
                      <Upload className="w-3.5 h-3.5 text-indigo-400" />
                      <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                        Or Submit Transfer Slip for Verification
                      </h5>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          placeholder="e.g. Kasun Perera"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">
                          WhatsApp / Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={buyerPhone}
                          onChange={(e) => setBuyerPhone(e.target.value)}
                          placeholder="077 123 4567"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        Bank Deposit / Transfer Receipt Slip *
                      </label>
                      <input
                        type="file"
                        ref={slipFileInputRef}
                        onChange={handleSlipFileSelect}
                        accept="image/*,.pdf"
                        className="hidden"
                      />

                      {slipFile ? (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {slipPreview ? (
                              <img
                                src={slipPreview}
                                alt="Slip preview"
                                className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                                <FileText className="w-5 h-5" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate max-w-xs">
                                {slipFile.name}
                              </p>
                              <span className="text-[10px] text-emerald-400 font-medium">
                                Ready to upload
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => slipFileInputRef.current?.click()}
                            className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-300 hover:text-white"
                          >
                            Change
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => slipFileInputRef.current?.click()}
                          className="p-4 rounded-xl bg-slate-950 border border-dashed border-slate-800 hover:border-indigo-500/40 text-center cursor-pointer group transition-all"
                        >
                          <Upload className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 mx-auto mb-1 transition-colors" />
                          <p className="text-xs font-bold text-slate-300 group-hover:text-white">
                            Click to upload payment receipt or screenshot
                          </p>
                          <p className="text-[10px] text-slate-500">
                            JPG, PNG, or PDF format accepted
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={closePurchaseModal}
                        className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingSlip}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all disabled:opacity-50"
                      >
                        {isSubmittingSlip ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Submit Slip for Verification</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Resources;

