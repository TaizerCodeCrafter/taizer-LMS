import React from "react";
import { motion } from "framer-motion";

// Realistic 28 Japanese Candlestick Price Action Sequence
// (Consolidation -> Dip -> Strong Breakout & Rally)
const CANDLE_DATA = [
  { o: 42, c: 46, h: 48, l: 39 },
  { o: 46, c: 43, h: 47, l: 41 },
  { o: 43, c: 49, h: 51, l: 42 },
  { o: 49, c: 46, h: 50, l: 44 },
  { o: 46, c: 53, h: 55, l: 45 },
  { o: 53, c: 50, h: 54, l: 48 },
  { o: 50, c: 45, h: 51, l: 44 },
  { o: 45, c: 54, h: 56, l: 44 },
  { o: 54, c: 62, h: 65, l: 53 },
  { o: 62, c: 70, h: 73, l: 61 },
  { o: 70, c: 66, h: 71, l: 64 },
  { o: 66, c: 74, h: 77, l: 65 },
  { o: 74, c: 82, h: 85, l: 73 },
  { o: 82, c: 78, h: 83, l: 77 },
  { o: 78, c: 88, h: 91, l: 77 },
  { o: 88, c: 97, h: 100, l: 86 },
  { o: 97, c: 93, h: 99, l: 91 },
  { o: 93, c: 104, h: 107, l: 92 },
  { o: 104, c: 115, h: 118, l: 102 },
  { o: 115, c: 110, h: 116, l: 108 },
  { o: 110, c: 122, h: 125, l: 109 },
  { o: 122, c: 134, h: 138, l: 120 },
  { o: 134, c: 128, h: 136, l: 126 },
  { o: 128, c: 142, h: 146, l: 127 },
  { o: 142, c: 156, h: 160, l: 140 },
  { o: 156, c: 150, h: 158, l: 148 },
  { o: 150, c: 165, h: 169, l: 149 },
  { o: 165, c: 178, h: 182, l: 163, isLive: true }
];

export default function CandlestickDivider() {
  const svgWidth = 1000;
  const svgHeight = 150;
  const chartTop = 18;
  const chartBottom = 132;

  const minPrice = 35;
  const maxPrice = 188;

  const toY = (price) =>
    chartBottom - ((price - minPrice) / (maxPrice - minPrice)) * (chartBottom - chartTop);

  const startX = 35;
  const endX = 965;
  const candleCount = CANDLE_DATA.length;
  const stepX = (endX - startX) / (candleCount - 1);
  const candleWidth = 15;

  return (
    <div className="w-full py-4 sm:py-6 relative overflow-hidden select-none pointer-events-none">
      {/* Background Soft Glows */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-80 h-32 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            {/* Bullish Candle Gradient */}
            <linearGradient id="pureBullish" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            {/* Bearish Candle Gradient */}
            <linearGradient id="pureBearish" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>

            {/* Candle Neon Glow Filters */}
            <filter id="candleGlowGreen" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#10b981" floodOpacity="0.65" />
            </filter>
            <filter id="candleGlowRed" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f43f5e" floodOpacity="0.55" />
            </filter>
          </defs>

          {/* CANDLESTICKS FORMING SEQUENTIALLY FROM THE SIDE */}
          {CANDLE_DATA.map((candle, idx) => {
            const x = startX + idx * stepX;
            const isBullish = candle.c >= candle.o;
            const bodyTop = toY(Math.max(candle.o, candle.c));
            const bodyBottom = toY(Math.min(candle.o, candle.c));
            const bodyHeight = Math.max(bodyBottom - bodyTop, 3.5);

            const highY = toY(candle.h);
            const lowY = toY(candle.l);

            const color = isBullish ? "#10b981" : "#f43f5e";
            const grad = isBullish ? "url(#pureBullish)" : "url(#pureBearish)";
            const glow = isBullish ? "url(#candleGlowGreen)" : "url(#candleGlowRed)";

            // Sequential timing from left to right
            const delay = idx * 0.06;

            return (
              <motion.g
                key={idx}
                initial={{ scaleY: 0, opacity: 0 }}
                whileInView={{ scaleY: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  delay,
                  duration: 0.45,
                  type: "spring",
                  stiffness: 190,
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
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />

                {/* Lower Wick */}
                <line
                  x1={x}
                  y1={bodyBottom}
                  x2={x}
                  y2={lowY}
                  stroke={color}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />

                {/* Candle Body */}
                <rect
                  x={x - candleWidth / 2}
                  y={bodyTop}
                  width={candleWidth}
                  height={bodyHeight}
                  fill={grad}
                  stroke={color}
                  strokeWidth="0.8"
                  rx="2.5"
                  filter={glow}
                />
              </motion.g>
            );
          })}

          {/* ACTIVE RIGHTMOST CANDLE PULSE */}
          {(() => {
            const lastCandle = CANDLE_DATA[CANDLE_DATA.length - 1];
            const lastX = startX + (candleCount - 1) * stepX;
            const lastY = toY(lastCandle.c);

            return (
              <g transform={`translate(${lastX}, ${lastY})`}>
                <circle r="3" fill="#34d399" />
                <circle r="7" fill="none" stroke="#34d399" strokeWidth="1.2" opacity="0.8">
                  <animate attributeName="r" values="3;12;3" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0;0.9" dur="2s" repeatCount="indefinite" />
                </circle>
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
}
