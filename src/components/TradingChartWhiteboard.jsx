import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  TrendingUp,
  Edit3,
  MousePointer,
  Minus,
  Square,
  Highlighter,
  Type,
  Eraser,
  RotateCcw,
  RotateCw,
  Trash2,
  Save,
  Upload,
  Maximize2,
  Minimize2,
  Eye,
  Settings,
  ChevronDown,
  Layers,
  Sparkles,
  HelpCircle,
  Check
} from "lucide-react";

// Standard popular symbols for quick selection
const POPULAR_SYMBOLS = [
  { label: "BTC/USDT", value: "BINANCE:BTCUSDT", category: "Crypto" },
  { label: "ETH/USDT", value: "BINANCE:ETHUSDT", category: "Crypto" },
  { label: "SOL/USDT", value: "BINANCE:SOLUSDT", category: "Crypto" },
  { label: "EUR/USD", value: "FX:EURUSD", category: "Forex" },
  { label: "GBP/USD", value: "FX:GBPUSD", category: "Forex" },
  { label: "Gold (XAU/USD)", value: "OANDA:XAUUSD", category: "Commodities" },
  { label: "S&P 500", value: "FOREXCOM:SPXUSD", category: "Indices" },
  { label: "NASDAQ", value: "FOREXCOM:NSXUSD", category: "Indices" },
  { label: "TSLA", value: "NASDAQ:TSLA", category: "Stocks" },
  { label: "NVDA", value: "NASDAQ:NVDA", category: "Stocks" }
];

const TIMEFRAMES = [
  { label: "1m", value: "1" },
  { label: "5m", value: "5" },
  { label: "15m", value: "15" },
  { label: "1h", value: "60" },
  { label: "4h", value: "240" },
  { label: "1D", value: "D" },
  { label: "1W", value: "W" }
];

const COLOR_PALETTE = [
  { name: "Bullish Green", value: "#10b981", bg: "bg-emerald-500" },
  { name: "Bearish Red", value: "#f43f5e", bg: "bg-rose-500" },
  { name: "Cyan", value: "#06b6d4", bg: "bg-cyan-500" },
  { name: "Gold / Amber", value: "#f59e0b", bg: "bg-amber-500" },
  { name: "Pure White", value: "#ffffff", bg: "bg-white" },
  { name: "Purple", value: "#a855f7", bg: "bg-purple-500" }
];

const QUICK_TEXT_TAGS = [
  "Order Block (OB)",
  "Fair Value Gap (FVG)",
  "Liquidity Sweep",
  "Break of Structure (BOS)",
  "Change of Character (CHOCH)",
  "Support Level",
  "Resistance Level",
  "Entry Point",
  "Stop Loss (SL)",
  "Take Profit (TP)",
  "Bullish Reversal",
  "Bearish Reversal"
];

export default function TradingChartWhiteboard({
  chartConfig = {},
  drawings = [],
  onChangeConfig,
  onChangeDrawings,
  onSave,
  isAdmin = false,
  readOnly = false,
  height = "600px"
}) {
  // Chart Config state
  const [chartMode, setChartMode] = useState(chartConfig.mode || "live"); // 'live' | 'image' | 'grid'
  const [symbol, setSymbol] = useState(chartConfig.symbol || "BINANCE:BTCUSDT");
  const [timeframe, setTimeframe] = useState(chartConfig.timeframe || "15");
  const [customSymbolInput, setCustomSymbolInput] = useState("");
  const [showSymbolDropdown, setShowSymbolDropdown] = useState(false);
  const [imageUrl, setImageUrl] = useState(chartConfig.imageUrl || "");

  // Whiteboard drawing tool state
  const [interactMode, setInteractMode] = useState(false); // true: chart interaction, false: drawing mode
  const [activeTool, setActiveTool] = useState("pen"); // 'pen' | 'line' | 'hline' | 'rect' | 'highlighter' | 'text' | 'eraser'
  const [activeColor, setActiveColor] = useState("#10b981");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [elements, setElements] = useState(Array.isArray(drawings) ? drawings : []);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Text tool modal / input state
  const [textModalOpen, setTextModalOpen] = useState(false);
  const [pendingTextPos, setPendingTextPos] = useState({ x: 500, y: 300 });
  const [customText, setCustomText] = useState("");

  // In-progress drawing gesture state
  const [currentStroke, setCurrentStroke] = useState(null);
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  // Sync incoming drawings if prop changes
  useEffect(() => {
    if (Array.isArray(drawings)) {
      setElements(drawings);
    }
  }, [drawings]);

  // Sync incoming chartConfig
  useEffect(() => {
    if (chartConfig) {
      if (chartConfig.mode) setChartMode(chartConfig.mode);
      if (chartConfig.symbol) setSymbol(chartConfig.symbol);
      if (chartConfig.timeframe) setTimeframe(chartConfig.timeframe);
      if (chartConfig.imageUrl !== undefined) setImageUrl(chartConfig.imageUrl);
    }
  }, [chartConfig]);

  // Sync config changes upward
  const notifyConfigChange = useCallback((newConfig) => {
    if (onChangeConfig) {
      onChangeConfig(newConfig);
    }
  }, [onChangeConfig]);

  const notifyDrawingsChange = useCallback((newElements) => {
    setElements(newElements);
    if (onChangeDrawings) {
      onChangeDrawings(newElements);
    }
  }, [onChangeDrawings]);

  // Convert client pointer event to normalized SVG coordinates (0 - 1000, 0 - 600)
  const getSvgCoordinates = (e) => {
    if (!svgRef.current) return { x: 500, y: 300 };
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = ((clientX - rect.left) / rect.width) * 1000;
    const y = ((clientY - rect.top) / rect.height) * 600;
    return {
      x: Math.max(0, Math.min(1000, Math.round(x))),
      y: Math.max(0, Math.min(600, Math.round(y)))
    };
  };

  // Pointer Down (Start Drawing or Text Placement)
  const handlePointerDown = (e) => {
    if (interactMode) return;
    const coords = getSvgCoordinates(e);

    if (activeTool === "text") {
      setPendingTextPos(coords);
      setTextModalOpen(true);
      return;
    }

    if (activeTool === "eraser") {
      return;
    }

    // Save history for undo
    setHistory((prev) => [...prev, elements]);
    setRedoStack([]);

    const newId = "el_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4);

    if (activeTool === "pen" || activeTool === "highlighter") {
      setCurrentStroke({
        id: newId,
        type: activeTool,
        points: [coords],
        color: activeColor,
        strokeWidth: activeTool === "highlighter" ? Math.max(strokeWidth * 4, 16) : strokeWidth,
        opacity: activeTool === "highlighter" ? 0.38 : 1
      });
    } else if (activeTool === "line") {
      setCurrentStroke({
        id: newId,
        type: "line",
        x1: coords.x,
        y1: coords.y,
        x2: coords.x,
        y2: coords.y,
        color: activeColor,
        strokeWidth: strokeWidth
      });
    } else if (activeTool === "hline") {
      // Instant horizontal line across full width
      const hlineElement = {
        id: newId,
        type: "hline",
        y: coords.y,
        color: activeColor,
        strokeWidth: strokeWidth
      };
      notifyDrawingsChange([...elements, hlineElement]);
      setCurrentStroke(null);
    } else if (activeTool === "rect") {
      setCurrentStroke({
        id: newId,
        type: "rect",
        startX: coords.x,
        startY: coords.y,
        x: coords.x,
        y: coords.y,
        width: 0,
        height: 0,
        color: activeColor,
        fillColor: activeColor + "26", // 15% opacity hex
        strokeWidth: strokeWidth
      });
    }
  };

  // Pointer Move (Update In-Progress Shape)
  const handlePointerMove = (e) => {
    if (interactMode || !currentStroke) return;
    const coords = getSvgCoordinates(e);

    if (currentStroke.type === "pen" || currentStroke.type === "highlighter") {
      setCurrentStroke((prev) => ({
        ...prev,
        points: [...prev.points, coords]
      }));
    } else if (currentStroke.type === "line") {
      setCurrentStroke((prev) => ({
        ...prev,
        x2: coords.x,
        y2: coords.y
      }));
    } else if (currentStroke.type === "rect") {
      const minX = Math.min(currentStroke.startX, coords.x);
      const minY = Math.min(currentStroke.startY, coords.y);
      const width = Math.abs(coords.x - currentStroke.startX);
      const height = Math.abs(coords.y - currentStroke.startY);

      setCurrentStroke((prev) => ({
        ...prev,
        x: minX,
        y: minY,
        width,
        height
      }));
    }
  };

  // Pointer Up (Commit Shape)
  const handlePointerUp = () => {
    if (interactMode || !currentStroke) return;
    if (
      (currentStroke.type === "pen" || currentStroke.type === "highlighter") &&
      currentStroke.points.length > 1
    ) {
      notifyDrawingsChange([...elements, currentStroke]);
    } else if (
      currentStroke.type === "line" &&
      (currentStroke.x1 !== currentStroke.x2 || currentStroke.y1 !== currentStroke.y2)
    ) {
      notifyDrawingsChange([...elements, currentStroke]);
    } else if (
      currentStroke.type === "rect" &&
      currentStroke.width > 5 &&
      currentStroke.height > 5
    ) {
      notifyDrawingsChange([...elements, currentStroke]);
    }
    setCurrentStroke(null);
  };

  // Add Text Label
  const handleAddText = (textValue) => {
    if (!textValue || !textValue.trim()) {
      setTextModalOpen(false);
      return;
    }
    setHistory((prev) => [...prev, elements]);
    setRedoStack([]);

    const newTextEl = {
      id: "el_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      type: "text",
      x: pendingTextPos.x,
      y: pendingTextPos.y,
      text: textValue.trim(),
      color: activeColor,
      fontSize: 14 + strokeWidth * 2
    };

    notifyDrawingsChange([...elements, newTextEl]);
    setCustomText("");
    setTextModalOpen(false);
  };

  // Eraser Tool action on an element
  const handleEraseElement = (elId, e) => {
    if (activeTool !== "eraser" || interactMode) return;
    e.stopPropagation();
    setHistory((prev) => [...prev, elements]);
    setRedoStack([]);
    notifyDrawingsChange(elements.filter((el) => el.id !== elId));
  };

  // Undo
  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack((prev) => [...prev, elements]);
    setHistory((prev) => prev.slice(0, prev.length - 1));
    notifyDrawingsChange(previous);
  };

  // Redo
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistory((prev) => [...prev, elements]);
    setRedoStack((prev) => prev.slice(0, prev.length - 1));
    notifyDrawingsChange(next);
  };

  // Clear All
  const handleClearAll = () => {
    if (elements.length === 0) return;
    if (window.confirm("Clear all drawings and annotations from chart?")) {
      setHistory((prev) => [...prev, elements]);
      setRedoStack([]);
      notifyDrawingsChange([]);
    }
  };

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const resultUrl = event.target?.result;
      setImageUrl(resultUrl);
      setChartMode("image");
      notifyConfigChange({
        mode: "image",
        symbol,
        timeframe,
        imageUrl: resultUrl
      });
    };
    reader.readAsDataURL(file);
  };

  // Handle Symbol Change
  const handleSelectSymbol = (sym) => {
    setSymbol(sym);
    setShowSymbolDropdown(false);
    notifyConfigChange({
      mode: chartMode,
      symbol: sym,
      timeframe,
      imageUrl
    });
  };

  // Handle Timeframe Change
  const handleSelectTimeframe = (tf) => {
    setTimeframe(tf);
    notifyConfigChange({
      mode: chartMode,
      symbol,
      timeframe: tf,
      imageUrl
    });
  };

  // Convert points array to SVG path 'd' attribute with smoothing
  const renderPointsPath = (points) => {
    if (!points || points.length === 0) return "";
    if (points.length === 1) return `M ${points[0].x} ${points[0].y} L ${points[0].x} ${points[0].y}`;
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }
    return d;
  };

  // TradingView Widget URL
  const tradingViewUrl = `https://s.tradingview.com/widgetembed/?frameElementId=tradingview_widget&symbol=${encodeURIComponent(
    symbol
  )}&interval=${timeframe}&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=0b0f19&studies=[]&theme=dark&style=1&timezone=exchange&studies_overrides={}&overrides={}&enabled_features=[]&disabled_features=[]&locale=en&utm_source=localhost`;

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col bg-[#080d1a] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all select-none ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none h-screen" : ""
      }`}
      style={{ height: isFullscreen ? "100vh" : height }}
    >
      {/* ========================================================================= */}
      {/* TOP HEADER: CHART CONFIG & MODE CONTROLS */}
      {/* ========================================================================= */}
      <div className="bg-[#0b1120] border-b border-slate-800/90 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5 z-20 shrink-0 text-slate-300">
        {/* LEFT: Mode Selector & Symbol Info */}
        <div className="flex items-center gap-2">
          {/* Chart Mode Switcher */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setChartMode("live");
                notifyConfigChange({ mode: "live", symbol, timeframe, imageUrl });
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                chartMode === "live"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live Market</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setChartMode("image");
                notifyConfigChange({ mode: "image", symbol, timeframe, imageUrl });
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                chartMode === "image"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Chart Image</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setChartMode("grid");
                notifyConfigChange({ mode: "grid", symbol, timeframe, imageUrl });
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                chartMode === "grid"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Grid Chalkboard</span>
            </button>
          </div>

          {/* Symbol & Timeframe Dropdown (If Live) */}
          {chartMode === "live" && (
            <div className="relative flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowSymbolDropdown(!showSymbolDropdown)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-extrabold text-white flex items-center gap-1.5 shadow-sm"
              >
                <span className="text-emerald-400 font-mono">●</span>
                <span>{symbol.split(":")[1] || symbol}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Timeframe Buttons */}
              <div className="hidden sm:flex items-center bg-slate-900 p-0.5 rounded-xl border border-slate-800">
                {TIMEFRAMES.map((tf) => (
                  <button
                    key={tf.value}
                    type="button"
                    onClick={() => handleSelectTimeframe(tf.value)}
                    className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all ${
                      timeframe === tf.value
                        ? "bg-indigo-600 text-white font-extrabold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>

              {/* Symbol Dropdown Modal */}
              {showSymbolDropdown && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-[#0e1526] border border-slate-800 rounded-2xl p-3 shadow-2xl z-50 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Select Market Asset
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowSymbolDropdown(false)}
                      className="text-xs text-slate-500 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Custom Symbol Input */}
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="e.g. BINANCE:SOLUSDT"
                      value={customSymbolInput}
                      onChange={(e) => setCustomSymbolInput(e.target.value.toUpperCase())}
                      className="flex-grow bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white uppercase font-mono outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customSymbolInput.trim()) {
                          handleSelectSymbol(customSymbolInput.trim());
                        }
                      }}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-500"
                    >
                      Apply
                    </button>
                  </div>

                  {/* Preset list */}
                  <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {POPULAR_SYMBOLS.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => handleSelectSymbol(item.value)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          symbol === item.value
                            ? "bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/40"
                            : "text-slate-300 hover:bg-slate-900 hover:text-white"
                        }`}
                      >
                        <span className="font-semibold">{item.label}</span>
                        <span className="text-[10px] text-slate-500">{item.category}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Image Upload Input (If Mode is Image) */}
          {chartMode === "image" && (
            <div className="flex items-center gap-2">
              <label className="cursor-pointer px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Chart</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <input
                type="text"
                placeholder="Or paste image URL..."
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  notifyConfigChange({ mode: "image", symbol, timeframe, imageUrl: e.target.value });
                }}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1 text-xs text-white w-48 outline-none focus:border-cyan-500"
              />
            </div>
          )}
        </div>

        {/* RIGHT: Interaction Mode Toggle & Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Toggle: Draw Mode vs Interact with TradingView */}
          <button
            type="button"
            onClick={() => setInteractMode(!interactMode)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              interactMode
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 font-black"
                : "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600/30"
            }`}
            title={
              interactMode
                ? "Currently in Chart Zoom/Pan mode. Click to resume Drawing."
                : "Switch to Chart Interaction (zoom, pan, click candles on TradingView)."
            }
          >
            {interactMode ? (
              <>
                <MousePointer className="w-3.5 h-3.5" />
                <span>Interact Mode Active</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>✏️ Draw / Annotate</span>
              </>
            )}
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Whiteboard"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Save Button (If provided) */}
          {onSave && (
            <button
              type="button"
              onClick={() => onSave({ chartConfig: { mode: chartMode, symbol, timeframe, imageUrl }, drawings: elements })}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Chart</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* WHITEBOARD STAGE (CANVAS / TRADINGVIEW BACKGROUND + SVG OVERLAY) */}
      {/* ========================================================================= */}
      <div className="relative flex-grow w-full h-full overflow-hidden bg-[#0a0f1d]">
        {/* 1. BACKGROUND LAYER: TRADINGVIEW / IMAGE / GRID */}
        <div className="absolute inset-0 z-0">
          {chartMode === "live" && (
            <iframe
              key={`${symbol}-${timeframe}`}
              src={tradingViewUrl}
              className="w-full h-full border-0"
              title="TradingView Live Chart"
              allowFullScreen
            />
          )}

          {chartMode === "image" && (
            <div className="w-full h-full flex items-center justify-center bg-[#070b14] overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Chart Analysis"
                  className="w-full h-full object-contain pointer-events-none"
                />
              ) : (
                <div className="text-center p-8 text-slate-500 space-y-3">
                  <Upload className="w-12 h-12 mx-auto text-slate-600" />
                  <p className="font-bold text-sm text-slate-300">No chart image loaded yet</p>
                  <p className="text-xs text-slate-500 max-w-sm">
                    Click "Upload Chart" above or paste an image URL to annotate a trading chart screenshot.
                  </p>
                </div>
              )}
            </div>
          )}

          {chartMode === "grid" && (
            <div className="w-full h-full bg-[#090e1a] relative overflow-hidden flex flex-col justify-between p-6 select-none pointer-events-none">
              {/* High-tech Trading Grid lines */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #334155 1px, transparent 1px),
                    linear-gradient(to bottom, #334155 1px, transparent 1px)
                  `,
                  backgroundSize: "60px 40px"
                }}
              />
              {/* Sample Price Markers on Right */}
              <div className="absolute right-3 top-0 bottom-0 flex flex-col justify-between py-6 text-[10px] font-mono text-slate-500 font-bold">
                <span>$68,500.00</span>
                <span>$67,200.00</span>
                <span>$66,000.00</span>
                <span>$64,800.00</span>
                <span>$63,500.00</span>
              </div>
              {/* Center watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <span className="text-6xl font-black tracking-widest uppercase text-slate-400">
                  CHART WHITEBOARD
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 2. SVG DRAWING OVERLAY */}
        <svg
          ref={svgRef}
          viewBox="0 0 1000 600"
          preserveAspectRatio="none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className={`absolute inset-0 w-full h-full z-10 touch-none ${
            interactMode
              ? "pointer-events-none opacity-90"
              : activeTool === "eraser"
              ? "cursor-crosshair pointer-events-auto"
              : "cursor-crosshair pointer-events-auto"
          }`}
        >
          <defs>
            {/* Arrowhead marker for trendlines */}
            <marker
              id="wb-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill={activeColor} />
            </marker>
          </defs>

          {/* RENDER COMMITTED DRAWINGS */}
          {elements.map((el) => {
            const isClickableEraser = activeTool === "eraser" && !interactMode;

            if (el.type === "pen" || el.type === "highlighter") {
              return (
                <path
                  key={el.id}
                  d={renderPointsPath(el.points)}
                  stroke={el.color}
                  strokeWidth={el.strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  opacity={el.opacity || 1}
                  onPointerDown={(e) => handleEraseElement(el.id, e)}
                  className={`transition-opacity ${
                    isClickableEraser ? "hover:stroke-rose-500 hover:opacity-100 cursor-pointer" : ""
                  }`}
                />
              );
            }

            if (el.type === "line") {
              return (
                <g key={el.id} onPointerDown={(e) => handleEraseElement(el.id, e)}>
                  <line
                    x1={el.x1}
                    y1={el.y1}
                    x2={el.x2}
                    y2={el.y2}
                    stroke={el.color}
                    strokeWidth={el.strokeWidth}
                    strokeLinecap="round"
                    className={isClickableEraser ? "hover:stroke-rose-500 cursor-pointer" : ""}
                  />
                  {/* Endpoint dots */}
                  <circle cx={el.x1} cy={el.y1} r={el.strokeWidth * 1.2} fill={el.color} />
                  <circle cx={el.x2} cy={el.y2} r={el.strokeWidth * 1.2} fill={el.color} />
                </g>
              );
            }

            if (el.type === "hline") {
              return (
                <g key={el.id} onPointerDown={(e) => handleEraseElement(el.id, e)}>
                  <line
                    x1="0"
                    y1={el.y}
                    x2="1000"
                    y2={el.y}
                    stroke={el.color}
                    strokeWidth={el.strokeWidth}
                    strokeDasharray="6 4"
                    className={isClickableEraser ? "hover:stroke-rose-500 cursor-pointer" : ""}
                  />
                  <rect
                    x="900"
                    y={el.y - 12}
                    width="95"
                    height="24"
                    rx="6"
                    fill="#0f172a"
                    stroke={el.color}
                    strokeWidth="1.5"
                  />
                  <text
                    x="947"
                    y={el.y + 4}
                    textAnchor="middle"
                    fill={el.color}
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    LEVEL
                  </text>
                </g>
              );
            }

            if (el.type === "rect") {
              return (
                <g key={el.id} onPointerDown={(e) => handleEraseElement(el.id, e)}>
                  <rect
                    x={el.x}
                    y={el.y}
                    width={el.width}
                    height={el.height}
                    rx="4"
                    fill={el.fillColor || el.color + "26"}
                    stroke={el.color}
                    strokeWidth={el.strokeWidth}
                    className={isClickableEraser ? "hover:stroke-rose-500 cursor-pointer" : ""}
                  />
                </g>
              );
            }

            if (el.type === "text") {
              const textWidth = Math.max(80, (el.text.length * (el.fontSize || 16)) * 0.65 + 24);
              return (
                <g
                  key={el.id}
                  transform={`translate(${el.x}, ${el.y})`}
                  onPointerDown={(e) => handleEraseElement(el.id, e)}
                  className={isClickableEraser ? "hover:opacity-50 cursor-pointer" : ""}
                >
                  <rect
                    x="-8"
                    y="-20"
                    width={textWidth}
                    height={30}
                    rx="6"
                    fill="#0b101de6"
                    stroke={el.color}
                    strokeWidth="1.5"
                  />
                  <text
                    x="4"
                    y="0"
                    fill={el.color}
                    fontSize={el.fontSize || 15}
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {el.text}
                  </text>
                </g>
              );
            }

            return null;
          })}

          {/* RENDER CURRENT ACTIVE STROKE IN REAL-TIME */}
          {currentStroke && (
            <>
              {(currentStroke.type === "pen" || currentStroke.type === "highlighter") && (
                <path
                  d={renderPointsPath(currentStroke.points)}
                  stroke={currentStroke.color}
                  strokeWidth={currentStroke.strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  opacity={currentStroke.opacity || 1}
                />
              )}
              {currentStroke.type === "line" && (
                <line
                  x1={currentStroke.x1}
                  y1={currentStroke.y1}
                  x2={currentStroke.x2}
                  y2={currentStroke.y2}
                  stroke={currentStroke.color}
                  strokeWidth={currentStroke.strokeWidth}
                  strokeLinecap="round"
                />
              )}
              {currentStroke.type === "rect" && (
                <rect
                  x={currentStroke.x}
                  y={currentStroke.y}
                  width={currentStroke.width}
                  height={currentStroke.height}
                  rx="4"
                  fill={currentStroke.fillColor}
                  stroke={currentStroke.color}
                  strokeWidth={currentStroke.strokeWidth}
                />
              )}
            </>
          )}
        </svg>

        {/* 3. FLOATING WHITEBOARD TOOLBAR */}
        {!interactMode && !readOnly && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-[#0d1424]/95 backdrop-blur-xl border border-slate-700/80 p-2 rounded-2xl shadow-2xl">
            {/* TOOL SELECTORS */}
            <div className="flex items-center gap-1 border-r border-slate-700/80 pr-2">
              {[
                { id: "pen", label: "Pen", icon: Edit3 },
                { id: "line", label: "Trendline", icon: TrendingUp },
                { id: "hline", label: "Price Level", icon: Minus },
                { id: "rect", label: "Order Block Zone", icon: Square },
                { id: "highlighter", label: "Highlighter", icon: Highlighter },
                { id: "text", label: "Text Label", icon: Type },
                { id: "eraser", label: "Eraser", icon: Eraser }
              ].map((tool) => {
                const Icon = tool.icon;
                const isSelected = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => setActiveTool(tool.id)}
                    title={tool.label}
                    className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>

            {/* COLOR PALETTE */}
            <div className="flex items-center gap-1.5 border-r border-slate-700/80 pr-2">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setActiveColor(c.value)}
                  title={c.name}
                  className={`w-5 h-5 rounded-full ${c.bg} transition-all border-2 ${
                    activeColor === c.value
                      ? "border-white scale-125 shadow-md"
                      : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                />
              ))}
            </div>

            {/* STROKE WIDTH SELECTOR */}
            <div className="flex items-center gap-1 border-r border-slate-700/80 pr-2">
              {[
                { w: 2, label: "Thin" },
                { w: 4, label: "Medium" },
                { w: 7, label: "Bold" }
              ].map((item) => (
                <button
                  key={item.w}
                  type="button"
                  onClick={() => setStrokeWidth(item.w)}
                  className={`w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center transition-colors ${
                    strokeWidth === item.w
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {item.w}
                </button>
              ))}
            </div>

            {/* UNDO / REDO / CLEAR */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleUndo}
                disabled={history.length === 0}
                title="Undo"
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRedo}
                disabled={redoStack.length === 0}
                title="Redo"
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                title="Clear All Drawings"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 4. TEXT PLACEMENT MODAL */}
        {textModalOpen && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0e1626] border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scaleUp">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Type className="w-4 h-4 text-indigo-400" />
                  <span>Insert Chart Annotation Text</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setTextModalOpen(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Quick Preset Badges */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 block">
                  Quick Trading Concepts:
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto custom-scrollbar">
                  {QUICK_TEXT_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAddText(tag)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-indigo-600/30 hover:border-indigo-500 border border-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Typed Input */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-[11px] font-bold text-slate-400 block">
                  Or Type Custom Annotation:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Pin Bar Reversal Zone..."
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddText(customText);
                    }}
                    autoFocus
                    className="flex-grow bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddText(customText)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30"
                  >
                    Place
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
