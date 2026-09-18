import React, { useState, useMemo } from "react";
import {
  X,
  Search,
  Sparkles,
  TrendingUp,
  TrendingDown,
  HelpCircle,
  CheckCircle2,
  Filter,
  Flame,
  Zap,
  ArrowRight
} from "lucide-react";
import { PATTERNS_DATA, PatternGraphic } from "../CandlestickPatternsShowcase";

export default function CandlestickQuestionModal({
  isOpen,
  onClose,
  onSelectPatternQuestion
}) {
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'bullish' | 'bearish' | 'neutral'
  const [searchTerm, setSearchTerm] = useState("");
  const [languageMode, setLanguageMode] = useState("bilingual"); // 'bilingual' | 'si' | 'en'

  // Flatten all 37 patterns into a unified array
  const allPatterns = useMemo(() => {
    const list = [];
    if (PATTERNS_DATA.bullish) {
      PATTERNS_DATA.bullish.forEach((p) => list.push({ ...p, sentimentType: "bullish" }));
    }
    if (PATTERNS_DATA.bearish) {
      PATTERNS_DATA.bearish.forEach((p) => list.push({ ...p, sentimentType: "bearish" }));
    }
    if (PATTERNS_DATA.neutral) {
      PATTERNS_DATA.neutral.forEach((p) => list.push({ ...p, sentimentType: "neutral" }));
    }
    return list;
  }, []);

  // Filtered patterns based on active tab & search
  const filteredPatterns = useMemo(() => {
    return allPatterns.filter((p) => {
      const matchTab =
        activeTab === "all" ||
        (activeTab === "bullish" && p.sentimentType === "bullish") ||
        (activeTab === "bearish" && p.sentimentType === "bearish") ||
        (activeTab === "neutral" && p.sentimentType === "neutral");

      const matchSearch =
        !searchTerm.trim() ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sentiment.toLowerCase().includes(searchTerm.toLowerCase());

      return matchTab && matchSearch;
    });
  }, [allPatterns, activeTab, searchTerm]);

  if (!isOpen) return null;

  // Generate question payload for a selected pattern
  const handleSelectPattern = (pattern) => {
    // Pick 3 realistic distractor patterns from the entire library
    const otherPatterns = allPatterns.filter((p) => p.name !== pattern.name);
    // Shuffle other patterns
    const shuffledOthers = [...otherPatterns].sort(() => 0.5 - Math.random());
    const distractors = shuffledOthers.slice(0, 3).map((p) => p.name);

    // Place correct answer at random index 0-3
    const correctIndex = Math.floor(Math.random() * 4);
    const options = [...distractors];
    options.splice(correctIndex, 0, pattern.name);

    // Formulate question prompt based on language
    let questionText = "What is the name of this candlestick pattern shown below?";
    let questionSiText = "පහත දැක්වෙන Candlestick රටාව (Pattern) කුමක්ද?";

    if (languageMode === "en") {
      questionText = "Identify the candlestick pattern shown below:";
      questionSiText = "";
    } else if (languageMode === "si") {
      questionText = "පහත දැක්වෙන Candlestick රටාව (Pattern) කුමක්ද?";
      questionSiText = "";
    }

    const payload = {
      question: questionText,
      questionSi: questionSiText,
      options: options,
      correctIndex: correctIndex,
      correctAnswer: correctIndex,
      explanation: `${pattern.name} (${pattern.sentiment}): ${pattern.desc}`,
      explanationSi: `${pattern.name} - ${pattern.sentiment}`,
      candlestickType: pattern.svgType,
      category: "Candlestick Patterns"
    };

    onSelectPatternQuestion(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#0b101e] border border-slate-800 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scaleUp">
        {/* HEADER */}
        <div className="bg-[#0f172a] border-b border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>Candlestick Pattern Question Generator</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                  37 Patterns Library
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Select any Japanese candlestick pattern to automatically generate an interactive MCQ with vector SVG graphic
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTROLS BAR: TABS, SEARCH, LANGUAGE */}
        <div className="p-4 bg-[#090d18] border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Category Tabs */}
          <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800 gap-1 w-full sm:w-auto overflow-x-auto">
            {[
              { id: "all", label: "All Patterns", count: allPatterns.length },
              { id: "bullish", label: "Bullish 🟢", count: PATTERNS_DATA.bullish?.length || 16 },
              { id: "bearish", label: "Bearish 🔴", count: PATTERNS_DATA.bearish?.length || 16 },
              { id: "neutral", label: "Indecision ⚪", count: PATTERNS_DATA.neutral?.length || 5 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>{tab.label}</span>
                <span className="px-1.5 py-0.2 text-[10px] rounded-md bg-black/30 font-semibold opacity-70">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Language Mode */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Language Selector */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs shrink-0">
              <button
                type="button"
                onClick={() => setLanguageMode("bilingual")}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  languageMode === "bilingual"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                title="English + Sinhala"
              >
                EN + සිංහල
              </button>
              <button
                type="button"
                onClick={() => setLanguageMode("si")}
                className={`px-2 py-1 rounded-lg font-bold transition-all ${
                  languageMode === "si"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                සිංහල
              </button>
              <button
                type="button"
                onClick={() => setLanguageMode("en")}
                className={`px-2 py-1 rounded-lg font-bold transition-all ${
                  languageMode === "en"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                English
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-grow sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candle name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* CANDLESTICK PATTERNS GRID */}
        <div className="flex-grow overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPatterns.map((pattern) => {
              const isBullish = pattern.sentimentType === "bullish";
              const isBearish = pattern.sentimentType === "bearish";

              return (
                <div
                  key={pattern.id}
                  onClick={() => handleSelectPattern(pattern)}
                  className={`group relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between hover:scale-[1.02] ${
                    isBullish
                      ? "bg-emerald-950/20 border-emerald-900/40 hover:border-emerald-500/70 hover:shadow-lg hover:shadow-emerald-900/20"
                      : isBearish
                      ? "bg-rose-950/20 border-rose-900/40 hover:border-rose-500/70 hover:shadow-lg hover:shadow-rose-900/20"
                      : "bg-slate-900/40 border-slate-800 hover:border-slate-600 hover:shadow-lg hover:shadow-slate-900/40"
                  }`}
                >
                  {/* Card Top: Badges */}
                  <div className="flex items-center justify-between gap-1.5 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                        isBullish
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : isBearish
                          ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                          : "bg-slate-500/15 text-slate-400 border-slate-500/30"
                      }`}
                    >
                      {pattern.sentiment}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {pattern.group}
                    </span>
                  </div>

                  {/* SVG Candle Graphic */}
                  <div className="py-2 flex items-center justify-center min-h-[90px] bg-slate-950/40 rounded-xl border border-slate-900 group-hover:border-slate-800 transition-colors my-1">
                    <PatternGraphic type={pattern.svgType} />
                  </div>

                  {/* Pattern Info */}
                  <div className="mt-2 space-y-1">
                    <h4 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                      {pattern.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {pattern.desc}
                    </p>
                  </div>

                  {/* Action Button */}
                  <button
                    type="button"
                    className="mt-3 w-full py-2 px-3 rounded-xl bg-slate-800 group-hover:bg-indigo-600 text-slate-300 group-hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Insert Question</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>

          {filteredPatterns.length === 0 && (
            <div className="py-20 text-center text-slate-500">
              <Search className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              <p className="font-bold text-slate-300">No candlestick patterns found</p>
              <p className="text-xs text-slate-500 mt-1">Try a different search keyword or tab filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
