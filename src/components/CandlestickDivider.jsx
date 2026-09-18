import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Activity,
  RotateCw,
  Sparkles,
  Zap,
  BarChart3,
  Flame,
  ShieldCheck
} from "lucide-react";

// Realistic 26 Japanese Candlestick Price Action Sequence
// (Consolidation -> Demand retest -> Breakout rally -> Final live expansion)
const CANDLE_DATA = [
  { o: 44, c: 47, h: 49, l: 42, v: 40, time: "10:00" },
  { o: 47, c: 44, h: 48, l: 42, v: 34, time: "10:05" },
  { o: 44, c: 50, h: 52, l: 43, v: 52, time: "10:10" },
  { o: 50, c: 48, h: 51, l: 46, v: 38, time: "10:15" },
  { o: 48, c: 54, h: 56, l: 47, v: 60, time: "10:20" },
  { o: 54, c: 51, h: 55, l: 49, v: 42, time: "10:25" },
  { o: 51, c: 47, h: 52, l: 46, v: 48, time: "10:30" }, // Retest in demand zone
  { o: 47, c: 56, h: 58, l: 46, v: 76, time: "10:35" }, // Demand bounce
  { o: 56, c: 65, h: 68, l: 55, v: 98, time: "10:40" }, // Institutional impulse
  { o: 65, c: 72, h: 74, l: 64, v: 110, time: "10:45" }, // BOS Breakout
  { o: 72, c: 68, h: 73, l: 66, v: 52, time: "10:50" }, // Retest
  { o: 68, c: 77, h: 80, l: 67, v: 88, time: "10:55" },
  { o: 77, c: 85, h: 88, l: 76, v: 96, time: "11:00" },
  { o: 85, c: 81, h: 86, l: 80, v: 62, time: "11:05" },
  { o: 81, c: 90, h: 93, l: 80, v: 86, time: "11:10" },
  { o: 90, c: 99, h: 102, l: 88, v: 104, time: "11:15" },
  { o: 99, c: 95, h: 101, l: 93, v: 64, time: "11:20" },
  { o: 95, c: 106, h: 109, l: 94, v: 118, time: "11:25" },
  { o: 106, c: 116, h: 120, l: 104, v: 132, time: "11:30" },
  { o: 116, c: 111, h: 117, l: 109, v: 72, time: "11:35" },
  { o: 111, c: 124, h: 127, l: 110, v: 128, time: "11:40" },
  { o: 124, c: 136, h: 140, l: 122, v: 146, time: "11:45" },
  { o: 136, c: 131, h: 138, l: 129, v: 82, time: "11:50" },
  { o: 131, c: 145, h: 148, l: 130, v: 158, time: "11:55" },
  { o: 145, c: 158, h: 161, l: 143, v: 178, time: "12:00" },
  { o: 158, c: 172, h: 176, l: 156, v: 210, time: "12:05", isLive: true } // Active live candle
];

export default function CandlestickDivider() {
  const [replayCount, setReplayCount] = useState(0);
  const [activeTimeframe, setActiveTimeframe] = useState("15m");
  const [livePrice, setLivePrice] = useState(68452.8);

  // Micro-fluctuation for active live candle price
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.45) * 6.5;
      setLivePrice((prev) => +(prev + delta).toFixed(2));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // SVG Chart Dimensions
  const svgWidth = 1000;
  const svgHeight = 240;
  const chartTop = 28;
  const chartBottom = 175;
  const volTop = 195;
  const volBottom = 230;

  const minPrice = 36;
  const maxPrice = 182;

  const toY = (price) =>
    chartBottom - ((price - minPrice) / (maxPrice - minPrice)) * (chartBottom - chartTop);

  const startX = 50;
  const endX = 875;
  const candleCount = CANDLE_DATA.length;
  const stepX = (endX - startX) / (candleCount - 1);
  const candleWidth = 18;

  // Calculate EMA 9 line
  const emaPoints = [];
  let prevEma = CANDLE_DATA[0].c;
  const k = 2 / (8 + 1);
  CANDLE_DATA.forEach((c) => {
    prevEma = c.c * k + prevEma * (1 - k);
    emaPoints.push(prevEma);
  });

  let emaPath = `M ${startX} ${toY(emaPoints[0]).toFixed(1)}`;
  for (let i = 1; i < emaPoints.length; i++) {
    const cx = (startX + i * stepX).toFixed(1);
    const cy = toY(emaPoints[i]).toFixed(1);
    emaPath += ` L ${cx} ${cy}`;
  }

  const lastCandle = CANDLE_DATA[CANDLE_DATA.length - 1];
  const lastX = startX + (candleCount - 1) * stepX;
  const lastCloseY = toY(lastCandle.c);

  return (
    <section className="relative w-full py-10 overflow-hidden bg-gradient-to-b from-[#070b14] via-[#0b1120] to-[#070b14]">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Grid Lines Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Sleek Terminal Card */}
        <div className="rounded-3xl border border-slate-800/90 bg-[#0c1222]/90 backdrop-blur-2xl shadow-2xl shadow-black/60 overflow-hidden">
          
          {/* TOP BAR: Trading Pair, Indicators, Timeframes & Live Status */}
          <div className="px-5 py-4 sm:px-7 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4 bg-slate-950/60">
            {/* Left: Market Live Badge & Asset Name */}
            <div className="flex items-center gap-3.5 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black tracking-wide">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>LIVE MARKET ENGINE</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-white font-extrabold text-sm sm:text-base tracking-wide flex items-center gap-1.5">
                  BTC/USDT <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">Perpetual</span>
                </span>
                <span className="text-xs font-mono font-black text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +14.85%
                </span>
              </div>

              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                <Activity className="w-3 h-3 text-cyan-400" />
                <span>Strategy: <strong className="text-slate-200">Smart Money Concepts (SMC)</strong></span>
              </div>
            </div>

            {/* Right: Timeframes, 98% Win Rate Pill & Replay Button */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap ml-auto">
              {/* Timeframes */}
              <div className="hidden sm:flex items-center bg-slate-900/90 rounded-xl p-1 border border-slate-800 text-xs font-bold text-slate-400">
                {["1m", "5m", "15m", "1h", "4h"].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => {
                      setActiveTimeframe(tf);
                      setReplayCount((c) => c + 1);
                    }}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      activeTimeframe === tf
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-extrabold"
                        : "hover:text-slate-200 hover:bg-slate-800/50"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              {/* Accuracy Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black shadow-lg shadow-emerald-500/10">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>98% Win Rate Signal</span>
              </div>

              {/* Replay Animation Button */}
              <button
                onClick={() => setReplayCount((c) => c + 1)}
                title="Watch candles form again from the side"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-indigo-400 transition-transform active:rotate-180" />
                <span className="hidden sm:inline">Replay Formation</span>
              </button>
            </div>
          </div>

          {/* MAIN CHART AREA: Animated Candlesticks & Live Flow */}
          <div className="p-4 sm:p-6 lg:p-8 relative">
            
            {/* Top Indicator Overlay Pill */}
            <div className="absolute top-6 left-8 z-10 hidden sm:flex items-center gap-3 text-[11px] font-mono">
              <span className="text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> EMA (9): <strong className="text-cyan-300">67,820</strong>
              </span>
              <span className="text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Vol (20): <strong className="text-emerald-300">182.4K</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
                BOS Confirmed ↗
              </span>
            </div>

            {/* SVG CANDLESTICK CANVAS */}
            <div className="w-full overflow-x-auto select-none no-scrollbar">
              <svg
                key={replayCount}
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto min-w-[720px] sm:min-w-full overflow-visible"
              >
                <defs>
                  {/* Bullish Gradient */}
                  <linearGradient id="bullishGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>

                  {/* Bearish Gradient */}
                  <linearGradient id="bearishGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fb7185" />
                    <stop offset="100%" stopColor="#e11d48" />
                  </linearGradient>

                  {/* Candle Glow Filter */}
                  <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#10b981" floodOpacity="0.5" />
                  </filter>
                  <filter id="roseGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#f43f5e" floodOpacity="0.4" />
                  </filter>

                  {/* Demand Zone Pattern */}
                  <linearGradient id="demandZoneGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {/* HORIZONTAL GRID LINES & PRICE LABELS */}
                {[
                  { p: 170, label: "70,000" },
                  { p: 135, label: "68,000" },
                  { p: 100, label: "66,000" },
                  { p: 65, label: "64,000" },
                  { p: 40, label: "62,000" }
                ].map((grid, idx) => {
                  const y = toY(grid.p);
                  return (
                    <g key={idx}>
                      <line
                        x1={startX - 20}
                        y1={y}
                        x2={svgWidth - 20}
                        y2={y}
                        stroke="#334155"
                        strokeDasharray="4 4"
                        strokeOpacity="0.35"
                        strokeWidth="1"
                      />
                      <text
                        x={svgWidth - 15}
                        y={y + 3.5}
                        fill="#64748b"
                        fontSize="10"
                        fontFamily="monospace"
                        textAnchor="start"
                        fontWeight="600"
                      >
                        {grid.label}
                      </text>
                    </g>
                  );
                })}

                {/* DEMAND ZONE / INSTITUTIONAL ORDER BLOCK (OB) RECTANGLE */}
                <rect
                  x={startX + 5 * stepX - 10}
                  y={toY(56)}
                  width={6 * stepX + 20}
                  height={toY(44) - toY(56)}
                  fill="url(#demandZoneGrad)"
                  stroke="#10b981"
                  strokeOpacity="0.25"
                  strokeDasharray="3 3"
                  rx="4"
                />
                <text
                  x={startX + 5 * stepX - 5}
                  y={toY(56) - 5}
                  fill="#34d399"
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="monospace"
                  opacity="0.8"
                >
                  Order Block (Demand Zone)
                </text>

                {/* BREAK OF STRUCTURE (BOS) LINE */}
                <line
                  x1={startX + 8 * stepX}
                  y1={toY(74)}
                  x2={startX + 18 * stepX}
                  y2={toY(74)}
                  stroke="#38bdf8"
                  strokeWidth="1.2"
                  strokeDasharray="4 2"
                  strokeOpacity="0.6"
                />
                <text
                  x={startX + 13 * stepX}
                  y={toY(74) - 4}
                  fill="#38bdf8"
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  BOS Breakout ↗
                </text>

                {/* EMA 9 SMOOTH TREND LINE (Draws across dynamically) */}
                <motion.path
                  d={emaPath}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeOpacity="0.8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.2, ease: "easeInOut" }}
                />

                {/* CANDLESTICKS FORMING SEQUENTIALLY FROM THE SIDE */}
                {CANDLE_DATA.map((candle, idx) => {
                  const x = startX + idx * stepX;
                  const isBullish = candle.c >= candle.o;
                  const bodyTop = toY(Math.max(candle.o, candle.c));
                  const bodyBottom = toY(Math.min(candle.o, candle.c));
                  const bodyHeight = Math.max(bodyBottom - bodyTop, 4);

                  const highY = toY(candle.h);
                  const lowY = toY(candle.l);

                  const color = isBullish ? "#10b981" : "#f43f5e";
                  const gradUrl = isBullish ? "url(#bullishGrad)" : "url(#bearishGrad)";
                  const filterUrl = isBullish ? "url(#emeraldGlow)" : "url(#roseGlow)";

                  // Volume bar coords
                  const volHeight = (candle.v / 220) * (volBottom - volTop);
                  const volY = volBottom - volHeight;

                  // Staggered formation timing (simulating real-time bars forming from left to right)
                  const delay = idx * 0.075;

                  return (
                    <g key={idx}>
                      {/* Volume Bar at the bottom */}
                      <motion.rect
                        x={x - candleWidth / 2 + 2}
                        y={volY}
                        width={candleWidth - 4}
                        height={volHeight}
                        fill={color}
                        opacity={isBullish ? 0.35 : 0.25}
                        rx="2"
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={{ scaleY: 1, opacity: isBullish ? 0.35 : 0.25 }}
                        transition={{ delay, duration: 0.35, ease: "easeOut" }}
                        style={{ transformOrigin: `center ${volBottom}px` }}
                      />

                      {/* Candlestick Group (Upper Wick, Lower Wick, Body) */}
                      <motion.g
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={{ scaleY: 1, opacity: 1 }}
                        transition={{
                          delay,
                          duration: 0.45,
                          type: "spring",
                          stiffness: 180,
                          damping: 18
                        }}
                        style={{ transformOrigin: `${x}px ${bodyBottom}px` }}
                      >
                        {/* Upper Wick */}
                        <line
                          x1={x}
                          y1={highY}
                          x2={x}
                          y2={bodyTop}
                          stroke={color}
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />

                        {/* Lower Wick */}
                        <line
                          x1={x}
                          y1={bodyBottom}
                          x2={x}
                          y2={lowY}
                          stroke={color}
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />

                        {/* Candle Body */}
                        <rect
                          x={x - candleWidth / 2}
                          y={bodyTop}
                          width={candleWidth}
                          height={bodyHeight}
                          fill={gradUrl}
                          stroke={color}
                          strokeWidth="1"
                          rx="3"
                          filter={filterUrl}
                        />

                        {/* Optional subtle highlight on top edge */}
                        <line
                          x1={x - candleWidth / 2 + 2}
                          y1={bodyTop + 1}
                          x2={x + candleWidth / 2 - 2}
                          y2={bodyTop + 1}
                          stroke="#ffffff"
                          strokeOpacity={isBullish ? 0.4 : 0.2}
                          strokeWidth="1"
                        />
                      </motion.g>
                    </g>
                  );
                })}

                {/* ACTIVE LIVE CANDLE ANIMATION & PRICE EXTENSION LINE */}
                {/* Horizontal Dashed Live Price Line extending to the edge */}
                <motion.line
                  x1={lastX + candleWidth / 2 + 4}
                  y1={lastCloseY}
                  x2={svgWidth - 25}
                  y2={lastCloseY}
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: [0.6, 1, 0.6], pathLength: 1 }}
                  transition={{
                    delay: candleCount * 0.075,
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Pulsing Target Radar on Active Candle */}
                <g transform={`translate(${lastX}, ${lastCloseY})`}>
                  <circle r="4" fill="#10b981" />
                  <circle r="8" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.8">
                    <animate attributeName="r" values="4;14;4" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9;0;0.9" dur="2s" repeatCount="indefinite" />
                  </circle>
                </g>

                {/* Floating Live Price Tag on the Right Axis */}
                <g transform={`translate(${svgWidth - 18}, ${lastCloseY})`}>
                  <rect
                    x="-65"
                    y="-13"
                    width="80"
                    height="24"
                    rx="6"
                    fill="#047857"
                    stroke="#34d399"
                    strokeWidth="1.5"
                    filter="url(#emeraldGlow)"
                  />
                  <text
                    x="-25"
                    y="3"
                    fill="#ffffff"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    ${livePrice.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  </text>
                </g>
              </svg>
            </div>

            {/* BOTTOM TICKER STRIP: Multi-Market Live Insights */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold text-slate-300">Live Trade Volume:</span>
                  <span className="text-white font-mono font-bold">$1.42 Billion</span>
                </div>
                <div className="hidden md:flex items-center gap-1.5 text-slate-400">
                  <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-semibold text-slate-300">Market Sentiment:</span>
                  <span className="text-emerald-400 font-bold">Strong Bullish (88%)</span>
                </div>
                <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-semibold text-slate-300">Smart Liquidity:</span>
                  <span className="text-cyan-300 font-mono font-bold">Swept Buy-Side Highs</span>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-[11px] text-slate-400">Powered by</span>
                <span className="text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                  Taizer Algo Flow™
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
