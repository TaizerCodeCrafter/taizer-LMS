import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  HelpCircle,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Flame,
  Zap,
  Layers
} from "lucide-react";

// =========================================================================
// PATTERN DEFINITIONS (37 PRO TRADING PATTERNS)
// =========================================================================

export const PATTERNS_DATA = {
  bullish: [
    // SINGLE CANDLE
    {
      id: "b1",
      name: "Bullish Marubozu",
      group: "Single",
      sentiment: "Strong Bullish",
      desc: "Full green body with no wicks. Demonstrates overwhelming buying domination from opening to close.",
      svgType: "b_marubozu"
    },
    {
      id: "b2",
      name: "Hammer",
      group: "Single",
      sentiment: "Bullish Reversal",
      desc: "Small upper body with lower wick >= 2x body height. Signals strong rejection of lower price levels.",
      svgType: "b_hammer"
    },
    {
      id: "b3",
      name: "Inverted Hammer",
      group: "Single",
      sentiment: "Bullish Reversal",
      desc: "Small body at bottom with long upper wick. Indicates buyers testing higher levels before breakout.",
      svgType: "b_inv_hammer"
    },
    {
      id: "b4",
      name: "Dragonfly Doji",
      group: "Single",
      sentiment: "Bullish Reversal",
      desc: "T-shaped doji with open, high, and close at the peak. Intense buyer absorption at bottom.",
      svgType: "b_dragonfly"
    },

    // 2-CANDLE
    {
      id: "b5",
      name: "Bullish Engulfing",
      group: "2-Candle",
      sentiment: "Bullish Reversal",
      desc: "Large green candle completely covers prior red body. Complete shift in institutional order flow.",
      svgType: "b_engulfing"
    },
    {
      id: "b6",
      name: "Bullish Harami",
      group: "2-Candle",
      sentiment: "Bullish Reversal",
      desc: "Small green candle contained inside prior tall red candle. Selling momentum exhaustion.",
      svgType: "b_harami"
    },
    {
      id: "b7",
      name: "Piercing Line",
      group: "2-Candle",
      sentiment: "Bullish Reversal",
      desc: "Green candle opens below prior low and closes above 50% midpoint of the previous red body.",
      svgType: "b_piercing"
    },
    {
      id: "b8",
      name: "Tweezer Bottom",
      group: "2-Candle",
      sentiment: "Support Reversal",
      desc: "Two consecutive candles with identical lowest low wicks confirming concrete support rejection.",
      svgType: "b_tweezer"
    },

    // 3-CANDLE / MULTI-CANDLE
    {
      id: "b9",
      name: "Morning Star",
      group: "Multi-Candle",
      sentiment: "Major Reversal",
      desc: "Tall red candle, small gapped base candle, followed by strong green candle closing deep into red body.",
      svgType: "b_morning_star"
    },
    {
      id: "b10",
      name: "Morning Doji Star",
      group: "Multi-Candle",
      sentiment: "Major Reversal",
      desc: "Classic Morning Star where middle pivot candle is an indecision Doji, confirming trend turning point.",
      svgType: "b_morning_doji"
    },
    {
      id: "b11",
      name: "Three White Soldiers",
      group: "Multi-Candle",
      sentiment: "Strong Continuation",
      desc: "Three consecutive tall green candles closing near highs with steady rising opens. Massive demand.",
      svgType: "b_soldiers"
    },
    {
      id: "b12",
      name: "Three Inside Up",
      group: "Multi-Candle",
      sentiment: "Confirmed Reversal",
      desc: "Bullish harami followed by third green candle closing above first red candle's high.",
      svgType: "b_inside_up"
    },
    {
      id: "b13",
      name: "Three Outside Up",
      group: "Multi-Candle",
      sentiment: "Confirmed Breakout",
      desc: "Bullish engulfing followed by third green candle surging to a higher close.",
      svgType: "b_outside_up"
    },
    {
      id: "b14",
      name: "Bullish Abandoned Baby",
      group: "Multi-Candle",
      sentiment: "Rare Strong Reversal",
      desc: "Doji gapped down below first red candle wicks, followed by tall green gapped up above doji.",
      svgType: "b_abandoned"
    },
    {
      id: "b15",
      name: "Rising Three Methods",
      group: "Multi-Candle",
      sentiment: "Bullish Continuation",
      desc: "Long green candle, three small red pullback candles within its range, then massive green breakout.",
      svgType: "b_rising_three"
    },
    {
      id: "b16",
      name: "Mat Hold",
      group: "Multi-Candle",
      sentiment: "Bullish Continuation",
      desc: "Upside gap followed by shallow consolidations holding above first candle base before explosive pump.",
      svgType: "b_mat_hold"
    }
  ],

  bearish: [
    // SINGLE CANDLE
    {
      id: "r1",
      name: "Bearish Marubozu",
      group: "Single",
      sentiment: "Strong Bearish",
      desc: "Solid red body with no shadows. Extreme seller control from open through close.",
      svgType: "r_marubozu"
    },
    {
      id: "r2",
      name: "Shooting Star",
      group: "Single",
      sentiment: "Bearish Reversal",
      desc: "Small lower body with long upper wick >= 2x body height. Rejection of high prices at market peak.",
      svgType: "r_shooting_star"
    },
    {
      id: "r3",
      name: "Hanging Man",
      group: "Single",
      sentiment: "Bearish Reversal",
      desc: "Appears at top of uptrend. Long lower wick shows heavy sell orders entering the market.",
      svgType: "r_hanging_man"
    },
    {
      id: "r4",
      name: "Gravestone Doji",
      group: "Single",
      sentiment: "Bearish Reversal",
      desc: "Inverted T-shape doji with open, low, close at bottom and very long upper wick.",
      svgType: "r_gravestone"
    },

    // 2-CANDLE
    {
      id: "r5",
      name: "Bearish Engulfing",
      group: "2-Candle",
      sentiment: "Bearish Reversal",
      desc: "Large red body completely swallows prior green body. Aggressive institutional dumping.",
      svgType: "r_engulfing"
    },
    {
      id: "r6",
      name: "Bearish Harami",
      group: "2-Candle",
      sentiment: "Bearish Reversal",
      desc: "Small red body contained completely within preceding large green candle. Buying stall.",
      svgType: "r_harami"
    },
    {
      id: "r7",
      name: "Dark Cloud Cover",
      group: "2-Candle",
      sentiment: "Bearish Reversal",
      desc: "Red candle opens higher than green high, but closes below 50% midpoint of the green body.",
      svgType: "r_dark_cloud"
    },
    {
      id: "r8",
      name: "Tweezer Top",
      group: "2-Candle",
      sentiment: "Resistance Reversal",
      desc: "Two consecutive candles touching the exact same high price wick, rejecting resistance.",
      svgType: "r_tweezer"
    },

    // 3-CANDLE / MULTI-CANDLE
    {
      id: "r9",
      name: "Evening Star",
      group: "Multi-Candle",
      sentiment: "Major Reversal",
      desc: "Tall green candle, small gapped peak candle, followed by decisive red candle penetrating deep.",
      svgType: "r_evening_star"
    },
    {
      id: "r10",
      name: "Evening Doji Star",
      group: "Multi-Candle",
      sentiment: "Major Reversal",
      desc: "Evening Star where peak candle is a Doji, marking exhaustion of the bull run.",
      svgType: "r_evening_doji"
    },
    {
      id: "r11",
      name: "Three Black Crows",
      group: "Multi-Candle",
      sentiment: "Strong Downtrend",
      desc: "Three consecutive tall red candles each opening within prior body and plunging to fresh lows.",
      svgType: "r_crows"
    },
    {
      id: "r12",
      name: "Three Inside Down",
      group: "Multi-Candle",
      sentiment: "Confirmed Reversal",
      desc: "Bearish harami confirmed by third red candle breaking below first candle's low.",
      svgType: "r_inside_down"
    },
    {
      id: "r13",
      name: "Three Outside Down",
      group: "Multi-Candle",
      sentiment: "Confirmed Breakdown",
      desc: "Bearish engulfing confirmed by third red candle accelerating to lower lows.",
      svgType: "r_outside_down"
    },
    {
      id: "r14",
      name: "Bearish Abandoned Baby",
      group: "Multi-Candle",
      sentiment: "Rare Strong Reversal",
      desc: "Doji gapped up above green wicks, followed by third red candle gapped down.",
      svgType: "r_abandoned"
    },
    {
      id: "r15",
      name: "Falling Three Methods",
      group: "Multi-Candle",
      sentiment: "Bearish Continuation",
      desc: "Long red candle, three small counter green pullbacks inside, then massive red breakdown.",
      svgType: "r_falling_three"
    },
    {
      id: "r16",
      name: "Bearish Mat Hold",
      group: "Multi-Candle",
      sentiment: "Bearish Continuation",
      desc: "Downside gap followed by brief upward pauses below resistance before aggressive continuation.",
      svgType: "r_mat_hold"
    }
  ],

  neutral: [
    {
      id: "n1",
      name: "Classic Doji",
      group: "Indecision",
      sentiment: "Neutral / Equilibrium",
      desc: "Open and close prices are virtually identical. Perfect balance between bulls and bears.",
      svgType: "n_doji"
    },
    {
      id: "n2",
      name: "Long-Legged Doji",
      group: "Indecision",
      sentiment: "High Volatility",
      desc: "Doji with extraordinarily long upper and lower shadows reflecting intense tug-of-war.",
      svgType: "n_long_legged"
    },
    {
      id: "n3",
      name: "Spinning Top",
      group: "Indecision",
      sentiment: "Indecision",
      desc: "Small centered body with equal upper and lower shadows. Impending consolidation or pause.",
      svgType: "n_spinning"
    },
    {
      id: "n4",
      name: "High-Wave Candle",
      group: "Indecision",
      sentiment: "Extreme Confusion",
      desc: "Very compact body with oversized wicks on both ends, signaling market disorientation.",
      svgType: "n_high_wave"
    },
    {
      id: "n5",
      name: "Four-Price Doji",
      group: "Indecision",
      sentiment: "Total Stalemate",
      desc: "Open, high, low, close are all at the exact same tick. Complete liquidity freeze or pause.",
      svgType: "n_four_price"
    }
  ]
};

// =========================================================================
// VECTOR CANDLE GRAPHIC RENDERER
// =========================================================================

function PatternGraphic({ type }) {
  const gGreen = "#10b981";
  const gGreenGrad = "url(#pattGreenGrad)";
  const gRed = "#f43f5e";
  const gRedGrad = "url(#pattRedGrad)";
  const gNeutral = "#94a3b8";

  return (
    <svg viewBox="0 0 90 70" className="w-full h-16 sm:h-20 overflow-visible select-none">
      <defs>
        <linearGradient id="pattGreenGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="pattRedGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
        <filter id="pattGreenGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#10b981" floodOpacity="0.5" />
        </filter>
        <filter id="pattRedGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#f43f5e" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* RENDER BY TYPE */}
      {(() => {
        switch (type) {
          // --- BULLISH SINGLE ---
          case "b_marubozu":
            return (
              <rect x="36" y="10" width="18" height="50" rx="3" fill={gGreenGrad} stroke={gGreen} filter="url(#pattGreenGlow)" />
            );

          case "b_hammer":
            return (
              <g filter="url(#pattGreenGlow)">
                <line x1="45" y1="11" x2="45" y2="15" stroke={gGreen} strokeWidth="2" strokeLinecap="round" />
                <rect x="37" y="15" width="16" height="14" rx="2.5" fill={gGreenGrad} stroke={gGreen} />
                <line x1="45" y1="29" x2="45" y2="60" stroke={gGreen} strokeWidth="2" strokeLinecap="round" />
              </g>
            );

          case "b_inv_hammer":
            return (
              <g filter="url(#pattGreenGlow)">
                <line x1="45" y1="10" x2="45" y2="42" stroke={gGreen} strokeWidth="2" strokeLinecap="round" />
                <rect x="37" y="42" width="16" height="14" rx="2.5" fill={gGreenGrad} stroke={gGreen} />
                <line x1="45" y1="56" x2="45" y2="59" stroke={gGreen} strokeWidth="2" strokeLinecap="round" />
              </g>
            );

          case "b_dragonfly":
            return (
              <g filter="url(#pattGreenGlow)">
                <line x1="33" y1="14" x2="57" y2="14" stroke={gGreen} strokeWidth="3.5" strokeLinecap="round" />
                <line x1="45" y1="14" x2="45" y2="60" stroke={gGreen} strokeWidth="2" strokeLinecap="round" />
              </g>
            );

          // --- BULLISH 2-CANDLE ---
          case "b_engulfing":
            return (
              <>
                <g filter="url(#pattRedGlow)">
                  <line x1="33" y1="22" x2="33" y2="48" stroke={gRed} strokeWidth="1.8" />
                  <rect x="28" y="26" width="10" height="18" rx="2" fill={gRedGrad} stroke={gRed} />
                </g>
                <g filter="url(#pattGreenGlow)">
                  <line x1="55" y1="12" x2="55" y2="58" stroke={gGreen} strokeWidth="2" />
                  <rect x="48" y="16" width="14" height="38" rx="2.5" fill={gGreenGrad} stroke={gGreen} />
                </g>
              </>
            );

          case "b_harami":
            return (
              <>
                <g filter="url(#pattRedGlow)">
                  <line x1="35" y1="10" x2="35" y2="60" stroke={gRed} strokeWidth="2" />
                  <rect x="28" y="16" width="14" height="38" rx="2.5" fill={gRedGrad} stroke={gRed} />
                </g>
                <g filter="url(#pattGreenGlow)">
                  <line x1="56" y1="26" x2="56" y2="44" stroke={gGreen} strokeWidth="1.8" />
                  <rect x="51" y="29" width="10" height="12" rx="2" fill={gGreenGrad} stroke={gGreen} />
                </g>
              </>
            );

          case "b_piercing":
            return (
              <>
                <g filter="url(#pattRedGlow)">
                  <line x1="34" y1="12" x2="34" y2="54" stroke={gRed} strokeWidth="1.8" />
                  <rect x="28" y="16" width="12" height="34" rx="2" fill={gRedGrad} stroke={gRed} />
                </g>
                <g filter="url(#pattGreenGlow)">
                  <line x1="56" y1="22" x2="56" y2="60" stroke={gGreen} strokeWidth="1.8" />
                  <rect x="50" y="28" width="12" height="30" rx="2" fill={gGreenGrad} stroke={gGreen} />
                  <line x1="26" y1="33" x2="64" y2="33" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.4" />
                </g>
              </>
            );

          case "b_tweezer":
            return (
              <>
                <g filter="url(#pattRedGlow)">
                  <line x1="35" y1="16" x2="35" y2="58" stroke={gRed} strokeWidth="1.8" />
                  <rect x="29" y="22" width="12" height="24" rx="2" fill={gRedGrad} stroke={gRed} />
                </g>
                <g filter="url(#pattGreenGlow)">
                  <line x1="55" y1="18" x2="55" y2="58" stroke={gGreen} strokeWidth="1.8" />
                  <rect x="49" y="22" width="12" height="24" rx="2" fill={gGreenGrad} stroke={gGreen} />
                </g>
                <line x1="25" y1="58" x2="65" y2="58" stroke="#34d399" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
              </>
            );

          // --- BULLISH 3 / MULTI ---
          case "b_morning_star":
            return (
              <>
                <g filter="url(#pattRedGlow)">
                  <line x1="22" y1="14" x2="22" y2="48" stroke={gRed} strokeWidth="1.6" />
                  <rect x="17" y="18" width="10" height="26" rx="1.5" fill={gRedGrad} stroke={gRed} />
                </g>
                <g filter="url(#pattGreenGlow)">
                  <line x1="45" y1="46" x2="45" y2="60" stroke={gGreen} strokeWidth="1.4" />
                  <rect x="41" y="49" width="8" height="8" rx="1.5" fill={gGreenGrad} stroke={gGreen} />
                </g>
                <g filter="url(#pattGreenGlow)">
                  <line x1="68" y1="18" x2="68" y2="52" stroke={gGreen} strokeWidth="1.6" />
                  <rect x="63" y="22" width="10" height="26" rx="1.5" fill={gGreenGrad} stroke={gGreen} />
                </g>
              </>
            );

          case "b_morning_doji":
            return (
              <>
                <g filter="url(#pattRedGlow)">
                  <line x1="22" y1="14" x2="22" y2="48" stroke={gRed} strokeWidth="1.6" />
                  <rect x="17" y="18" width="10" height="26" rx="1.5" fill={gRedGrad} stroke={gRed} />
                </g>
                <g filter="url(#pattGreenGlow)">
                  <line x1="45" y1="46" x2="45" y2="60" stroke="#34d399" strokeWidth="1.6" />
                  <line x1="39" y1="53" x2="51" y2="53" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
                </g>
                <g filter="url(#pattGreenGlow)">
                  <line x1="68" y1="18" x2="68" y2="52" stroke={gGreen} strokeWidth="1.6" />
                  <rect x="63" y="22" width="10" height="26" rx="1.5" fill={gGreenGrad} stroke={gGreen} />
                </g>
              </>
            );

          case "b_soldiers":
            return (
              <g filter="url(#pattGreenGlow)">
                <line x1="24" y1="36" x2="24" y2="60" stroke={gGreen} strokeWidth="1.6" />
                <rect x="19" y="40" width="10" height="18" rx="1.5" fill={gGreenGrad} stroke={gGreen} />
                <line x1="45" y1="24" x2="45" y2="48" stroke={gGreen} strokeWidth="1.6" />
                <rect x="40" y="28" width="10" height="18" rx="1.5" fill={gGreenGrad} stroke={gGreen} />
                <line x1="66" y1="12" x2="66" y2="36" stroke={gGreen} strokeWidth="1.6" />
                <rect x="61" y="16" width="10" height="18" rx="1.5" fill={gGreenGrad} stroke={gGreen} />
              </g>
            );

          case "b_inside_up":
            return (
              <>
                <rect x="18" y="14" width="9" height="38" rx="1.5" fill={gRedGrad} stroke={gRed} filter="url(#pattRedGlow)" />
                <rect x="41" y="28" width="8" height="14" rx="1.5" fill={gGreenGrad} stroke={gGreen} filter="url(#pattGreenGlow)" />
                <rect x="63" y="10" width="9" height="28" rx="1.5" fill={gGreenGrad} stroke={gGreen} filter="url(#pattGreenGlow)" />
              </>
            );

          case "b_outside_up":
            return (
              <>
                <rect x="19" y="26" width="8" height="16" rx="1.5" fill={gRedGrad} stroke={gRed} filter="url(#pattRedGlow)" />
                <rect x="39" y="18" width="11" height="32" rx="2" fill={gGreenGrad} stroke={gGreen} filter="url(#pattGreenGlow)" />
                <rect x="63" y="10" width="9" height="28" rx="1.5" fill={gGreenGrad} stroke={gGreen} filter="url(#pattGreenGlow)" />
              </>
            );

          case "b_abandoned":
            return (
              <>
                <rect x="18" y="14" width="9" height="28" rx="1.5" fill={gRedGrad} stroke={gRed} filter="url(#pattRedGlow)" />
                <g filter="url(#pattGreenGlow)">
                  <line x1="45" y1="50" x2="45" y2="62" stroke="#34d399" strokeWidth="1.6" />
                  <line x1="40" y1="56" x2="50" y2="56" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
                </g>
                <rect x="63" y="14" width="9" height="28" rx="1.5" fill={gGreenGrad} stroke={gGreen} filter="url(#pattGreenGlow)" />
              </>
            );

          case "b_rising_three":
            return (
              <>
                <rect x="12" y="14" width="9" height="42" rx="1.5" fill={gGreenGrad} stroke={gGreen} filter="url(#pattGreenGlow)" />
                <rect x="29" y="20" width="6" height="8" rx="1" fill={gRedGrad} stroke={gRed} />
                <rect x="42" y="26" width="6" height="8" rx="1" fill={gRedGrad} stroke={gRed} />
                <rect x="55" y="32" width="6" height="8" rx="1" fill={gRedGrad} stroke={gRed} />
                <rect x="69" y="10" width="9" height="38" rx="1.5" fill={gGreenGrad} stroke={gGreen} filter="url(#pattGreenGlow)" />
              </>
            );

          case "b_mat_hold":
            return (
              <>
                <rect x="12" y="20" width="9" height="38" rx="1.5" fill={gGreenGrad} stroke={gGreen} filter="url(#pattGreenGlow)" />
                <rect x="29" y="14" width="6" height="7" rx="1" fill={gRedGrad} stroke={gRed} />
                <rect x="42" y="20" width="6" height="7" rx="1" fill={gRedGrad} stroke={gRed} />
                <rect x="55" y="26" width="6" height="7" rx="1" fill={gRedGrad} stroke={gRed} />
                <rect x="69" y="8" width="9" height="34" rx="1.5" fill={gGreenGrad} stroke={gGreen} filter="url(#pattGreenGlow)" />
              </>
            );

          // --- BEARISH SINGLE ---
          case "r_marubozu":
            return (
              <rect x="36" y="10" width="18" height="50" rx="3" fill={gRedGrad} stroke={gRed} filter="url(#pattRedGlow)" />
            );

          case "r_shooting_star":
            return (
              <g filter="url(#pattRedGlow)">
                <line x1="45" y1="10" x2="45" y2="42" stroke={gRed} strokeWidth="2" strokeLinecap="round" />
                <rect x="37" y="42" width="16" height="14" rx="2.5" fill={gRedGrad} stroke={gRed} />
                <line x1="45" y1="56" x2="45" y2="59" stroke={gRed} strokeWidth="2" strokeLinecap="round" />
              </g>
            );

          case "r_hanging_man":
            return (
              <g filter="url(#pattRedGlow)">
                <line x1="45" y1="11" x2="45" y2="15" stroke={gRed} strokeWidth="2" strokeLinecap="round" />
                <rect x="37" y="15" width="16" height="14" rx="2.5" fill={gRedGrad} stroke={gRed} />
                <line x1="45" y1="29" x2="45" y2="60" stroke={gRed} strokeWidth="2" strokeLinecap="round" />
              </g>
            );

          case "r_gravestone":
            return (
              <g filter="url(#pattRedGlow)">
                <line x1="45" y1="12" x2="45" y2="56" stroke={gRed} strokeWidth="2" strokeLinecap="round" />
                <line x1="33" y1="56" x2="57" y2="56" stroke={gRed} strokeWidth="3.5" strokeLinecap="round" />
              </g>
            );

          // --- BEARISH 2-CANDLE ---
          case "r_engulfing":
            return (
              <>
                <g filter="url(#pattGreenGlow)">
                  <line x1="33" y1="22" x2="33" y2="48" stroke={gGreen} strokeWidth="1.8" />
                  <rect x="28" y="26" width="10" height="18" rx="2" fill={gGreenGrad} stroke={gGreen} />
                </g>
                <g filter="url(#pattRedGlow)">
                  <line x1="55" y1="12" x2="55" y2="58" stroke={gRed} strokeWidth="2" />
                  <rect x="48" y="16" width="14" height="38" rx="2.5" fill={gRedGrad} stroke={gRed} />
                </g>
              </>
            );

          case "r_harami":
            return (
              <>
                <g filter="url(#pattGreenGlow)">
                  <line x1="35" y1="10" x2="35" y2="60" stroke={gGreen} strokeWidth="2" />
                  <rect x="28" y="16" width="14" height="38" rx="2.5" fill={gGreenGrad} stroke={gGreen} />
                </g>
                <g filter="url(#pattRedGlow)">
                  <line x1="56" y1="26" x2="56" y2="44" stroke={gRed} strokeWidth="1.8" />
                  <rect x="51" y="29" width="10" height="12" rx="2" fill={gRedGrad} stroke={gRed} />
                </g>
              </>
            );

          case "r_dark_cloud":
            return (
              <>
                <g filter="url(#pattGreenGlow)">
                  <line x1="34" y1="16" x2="34" y2="58" stroke={gGreen} strokeWidth="1.8" />
                  <rect x="28" y="22" width="12" height="34" rx="2" fill={gGreenGrad} stroke={gGreen} />
                </g>
                <g filter="url(#pattRedGlow)">
                  <line x1="56" y1="10" x2="56" y2="48" stroke={gRed} strokeWidth="1.8" />
                  <rect x="50" y="12" width="12" height="32" rx="2" fill={gRedGrad} stroke={gRed} />
                  <line x1="26" y1="39" x2="64" y2="39" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.4" />
                </g>
              </>
            );

          case "r_tweezer":
            return (
              <>
                <g filter="url(#pattGreenGlow)">
                  <line x1="35" y1="12" x2="35" y2="54" stroke={gGreen} strokeWidth="1.8" />
                  <rect x="29" y="20" width="12" height="24" rx="2" fill={gGreenGrad} stroke={gGreen} />
                </g>
                <g filter="url(#pattRedGlow)">
                  <line x1="55" y1="12" x2="55" y2="52" stroke={gRed} strokeWidth="1.8" />
                  <rect x="49" y="20" width="12" height="24" rx="2" fill={gRedGrad} stroke={gRed} />
                </g>
                <line x1="25" y1="12" x2="65" y2="12" stroke="#fb7185" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
              </>
            );

          // --- BEARISH 3 / MULTI ---
          case "r_evening_star":
            return (
              <>
                <g filter="url(#pattGreenGlow)">
                  <line x1="22" y1="22" x2="22" y2="56" stroke={gGreen} strokeWidth="1.6" />
                  <rect x="17" y="26" width="10" height="26" rx="1.5" fill={gGreenGrad} stroke={gGreen} />
                </g>
                <g filter="url(#pattRedGlow)">
                  <line x1="45" y1="10" x2="45" y2="24" stroke={gRed} strokeWidth="1.4" />
                  <rect x="41" y="12" width="8" height="8" rx="1.5" fill={gRedGrad} stroke={gRed} />
                </g>
                <g filter="url(#pattRedGlow)">
                  <line x1="68" y1="18" x2="68" y2="52" stroke={gRed} strokeWidth="1.6" />
                  <rect x="63" y="22" width="10" height="26" rx="1.5" fill={gRedGrad} stroke={gRed} />
                </g>
              </>
            );

          case "r_evening_doji":
            return (
              <>
                <g filter="url(#pattGreenGlow)">
                  <line x1="22" y1="22" x2="22" y2="56" stroke={gGreen} strokeWidth="1.6" />
                  <rect x="17" y="26" width="10" height="26" rx="1.5" fill={gGreenGrad} stroke={gGreen} />
                </g>
                <g filter="url(#pattRedGlow)">
                  <line x1="45" y1="10" x2="45" y2="24" stroke="#fb7185" strokeWidth="1.6" />
                  <line x1="39" y1="17" x2="51" y2="17" stroke="#fb7185" strokeWidth="2.5" strokeLinecap="round" />
                </g>
                <g filter="url(#pattRedGlow)">
                  <line x1="68" y1="18" x2="68" y2="52" stroke={gRed} strokeWidth="1.6" />
                  <rect x="63" y="22" width="10" height="26" rx="1.5" fill={gRedGrad} stroke={gRed} />
                </g>
              </>
            );

          case "r_crows":
            return (
              <g filter="url(#pattRedGlow)">
                <line x1="24" y1="12" x2="24" y2="36" stroke={gRed} strokeWidth="1.6" />
                <rect x="19" y="16" width="10" height="18" rx="1.5" fill={gRedGrad} stroke={gRed} />
                <line x1="45" y1="24" x2="45" y2="48" stroke={gRed} strokeWidth="1.6" />
                <rect x="40" y="28" width="10" height="18" rx="1.5" fill={gRedGrad} stroke={gRed} />
                <line x1="66" y1="36" x2="66" y2="60" stroke={gRed} strokeWidth="1.6" />
                <rect x="61" y="40" width="10" height="18" rx="1.5" fill={gRedGrad} stroke={gRed} />
              </g>
            );

          case "r_inside_down":
            return (
              <>
                <rect x="18" y="14" width="9" height="38" rx="1.5" fill={gGreenGrad} stroke={gGreen} filter="url(#pattGreenGlow)" />
                <rect x="41" y="26" width="8" height="14" rx="1.5" fill={gRedGrad} stroke={gRed} filter="url(#pattRedGlow)" />
                <rect x="63" y="32" width="9" height="28" rx="1.5" fill={gRedGrad} stroke={gRed} filter="url(#pattRedGlow)" />
              </>
            );

          case "r_outside_down":
            return (
              <>
                <rect x="19" y="20" width="8" height="16" rx="1.5" fill={gGreenGrad} stroke={gGreen} filter="url(#pattGreenGlow)" />
                <rect x="39" y="14" width="11" height="32" rx="2" fill={gRedGrad} stroke={gRed} filter="url(#pattRedGlow)" />
                <rect x="63" y="30" width="9" height="28" rx="1.5" fill={gRedGrad} stroke={gRed} filter="url(#pattRedGlow)" />
              </>
            );

          case "r_abandoned":
            return (
              <>
                <rect x="18" y="24" width="9" height="28" rx="1.5" fill={gGreenGrad} stroke={gGreen} filter="url(#pattGreenGlow)" />
                <g filter="url(#pattRedGlow)">
                  <line x1="45" y1="8" x2="45" y2="20" stroke="#fb7185" strokeWidth="1.6" />
                  <line x1="40" y1="14" x2="50" y2="14" stroke="#fb7185" strokeWidth="2.5" strokeLinecap="round" />
                </g>
                <rect x="63" y="24" width="9" height="28" rx="1.5" fill={gRedGrad} stroke={gRed} filter="url(#pattRedGlow)" />
              </>
            );

          case "r_falling_three":
            return (
              <>
                <rect x="12" y="10" width="9" height="42" rx="1.5" fill={gRedGrad} stroke={gRed} filter="url(#pattRedGlow)" />
                <rect x="29" y="34" width="6" height="8" rx="1" fill={gGreenGrad} stroke={gGreen} />
                <rect x="42" y="28" width="6" height="8" rx="1" fill={gGreenGrad} stroke={gGreen} />
                <rect x="55" y="22" width="6" height="8" rx="1" fill={gGreenGrad} stroke={gGreen} />
                <rect x="69" y="18" width="9" height="38" rx="1.5" fill={gRedGrad} stroke={gRed} filter="url(#pattRedGlow)" />
              </>
            );

          case "r_mat_hold":
            return (
              <>
                <rect x="12" y="10" width="9" height="38" rx="1.5" fill={gRedGrad} stroke={gRed} filter="url(#pattRedGlow)" />
                <rect x="29" y="36" width="6" height="7" rx="1" fill={gGreenGrad} stroke={gGreen} />
                <rect x="42" y="30" width="6" height="7" rx="1" fill={gGreenGrad} stroke={gGreen} />
                <rect x="55" y="24" width="6" height="7" rx="1" fill={gGreenGrad} stroke={gGreen} />
                <rect x="69" y="26" width="9" height="34" rx="1.5" fill={gRedGrad} stroke={gRed} filter="url(#pattRedGlow)" />
              </>
            );

          // --- NEUTRAL / INDECISION ---
          case "n_doji":
            return (
              <g>
                <line x1="45" y1="12" x2="45" y2="58" stroke={gNeutral} strokeWidth="2" strokeLinecap="round" />
                <line x1="32" y1="35" x2="58" y2="35" stroke="#f1f5f9" strokeWidth="3" strokeLinecap="round" />
              </g>
            );

          case "n_long_legged":
            return (
              <g>
                <line x1="45" y1="6" x2="45" y2="64" stroke={gNeutral} strokeWidth="2" strokeLinecap="round" />
                <line x1="30" y1="35" x2="60" y2="35" stroke="#f1f5f9" strokeWidth="3" strokeLinecap="round" />
              </g>
            );

          case "n_spinning":
            return (
              <g>
                <line x1="45" y1="12" x2="45" y2="58" stroke={gNeutral} strokeWidth="2" strokeLinecap="round" />
                <rect x="36" y="29" width="18" height="12" rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
              </g>
            );

          case "n_high_wave":
            return (
              <g>
                <line x1="45" y1="6" x2="45" y2="64" stroke={gNeutral} strokeWidth="2" strokeLinecap="round" />
                <rect x="38" y="32" width="14" height="6" rx="1.5" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
              </g>
            );

          case "n_four_price":
            return (
              <g>
                <line x1="28" y1="35" x2="62" y2="35" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
              </g>
            );

          default:
            return (
              <rect x="38" y="20" width="14" height="30" rx="2" fill={gGreenGrad} stroke={gGreen} />
            );
        }
      })()}
    </svg>
  );
}

// =========================================================================
// MAIN COMPONENT
// =========================================================================

export default function CandlestickPatternsShowcase() {
  const [activeCategory, setActiveCategory] = useState("bullish"); // 'bullish', 'bearish', 'neutral'
  const [groupFilter, setGroupFilter] = useState("all"); // 'all', 'Single', '2-Candle', 'Multi-Candle'
  const [searchTerm, setSearchTerm] = useState("");

  const currentList = PATTERNS_DATA[activeCategory] || [];

  const filteredPatterns = currentList.filter((p) => {
    const matchesGroup = groupFilter === "all" || p.group === groupFilter;
    const matchesSearch =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const getCategoryColor = () => {
    if (activeCategory === "bullish") return "emerald";
    if (activeCategory === "bearish") return "rose";
    return "sky";
  };

  const color = getCategoryColor();

  return (
    <section className="relative w-full py-16 sm:py-20 bg-gradient-to-b from-[#070b14] via-[#0a101f] to-[#070b14] overflow-hidden">
      {/* Ambient background glows */}
      <div
        className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-colors duration-700 ${
          activeCategory === "bullish"
            ? "bg-emerald-600/10"
            : activeCategory === "bearish"
            ? "bg-rose-600/10"
            : "bg-sky-600/10"
        }`}
      />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none bg-indigo-600/5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent uppercase tracking-wider">
              Price Action Master Encyclopedia
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Master Every{" "}
            <span
              className={
                activeCategory === "bullish"
                  ? "bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent"
                  : activeCategory === "bearish"
                  ? "bg-gradient-to-r from-rose-400 to-red-300 bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-sky-400 to-slate-200 bg-clip-text text-transparent"
              }
            >
              Candlestick Pattern
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            From single-candle exhaustion triggers to multi-candle institutional momentum, inspect every high-probability candlestick setup used by pro traders.
          </p>
        </div>

        {/* CATEGORY SELECTOR TABS (Bullish / Bearish / Neutral) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* 3 Main Category Buttons */}
          <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800/80 shadow-xl overflow-x-auto w-full sm:w-auto">
            {/* Bullish Tab */}
            <button
              onClick={() => {
                setActiveCategory("bullish");
                setGroupFilter("all");
              }}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeCategory === "bullish"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 scale-[1.02]"
                  : "text-slate-400 hover:text-emerald-400 hover:bg-slate-900/60"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>🟢 Bullish Patterns</span>
              <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300">
                16
              </span>
            </button>

            {/* Bearish Tab */}
            <button
              onClick={() => {
                setActiveCategory("bearish");
                setGroupFilter("all");
              }}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeCategory === "bearish"
                  ? "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-600/30 scale-[1.02]"
                  : "text-slate-400 hover:text-rose-400 hover:bg-slate-900/60"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              <span>🔴 Bearish Patterns</span>
              <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-md bg-rose-500/20 text-rose-300">
                16
              </span>
            </button>

            {/* Neutral Tab */}
            <button
              onClick={() => {
                setActiveCategory("neutral");
                setGroupFilter("all");
              }}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeCategory === "neutral"
                  ? "bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg shadow-slate-700/30 scale-[1.02]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span>⚪ Neutral / Indecision</span>
              <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-md bg-sky-500/20 text-sky-300">
                5
              </span>
            </button>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search pattern..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* SUB-FILTER PILLS (Single / 2-Candle / Multi-Candle) */}
        {activeCategory !== "neutral" && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Candle Formation:
            </span>
            {[
              { id: "all", label: "All Formations" },
              { id: "Single", label: "Single Candle (4)" },
              { id: "2-Candle", label: "2-Candle Patterns (4)" },
              { id: "Multi-Candle", label: "3-Candle / Multi (8)" }
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setGroupFilter(sub.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  groupFilter === sub.id
                    ? activeCategory === "bullish"
                      ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/10"
                      : "bg-rose-500/20 border border-rose-500/40 text-rose-300 shadow-md shadow-rose-500/10"
                    : "bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-white"
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}

        {/* CANDLESTICK CARDS GRID ("boarder ekak athule lassana candle eka dala candle ekata yatin nama lassanata") */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          <AnimatePresence mode="popLayout">
            {filteredPatterns.map((pattern, idx) => {
              const isBullish = activeCategory === "bullish";
              const isBearish = activeCategory === "bearish";

              const borderHover = isBullish
                ? "hover:border-emerald-500/50 hover:shadow-emerald-500/15"
                : isBearish
                ? "hover:border-rose-500/50 hover:shadow-rose-500/15"
                : "hover:border-sky-500/50 hover:shadow-sky-500/15";

              const glowBg = isBullish
                ? "group-hover:bg-emerald-500/5"
                : isBearish
                ? "group-hover:bg-rose-500/5"
                : "group-hover:bg-sky-500/5";

              const pillColor = isBullish
                ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                : isBearish
                ? "bg-rose-500/10 border-rose-500/25 text-rose-400"
                : "bg-sky-500/10 border-sky-500/25 text-sky-300";

              return (
                <motion.div
                  key={pattern.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.025 }}
                  className={`group relative rounded-2xl border border-slate-800/90 bg-[#0c1222]/90 backdrop-blur-xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-xl ${borderHover} hover:-translate-y-1.5`}
                >
                  {/* Subtle hover background highlight */}
                  <div className={`absolute inset-0 rounded-2xl transition-colors duration-300 ${glowBg} pointer-events-none`} />

                  {/* TOP: Formation Group Badge & Number */}
                  <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-800 text-slate-400">
                      {pattern.group}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      #{String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* CENTER: BEAUTIFULLY DRAWN CANDLESTICK GRAPHIC */}
                  <div className="py-2 flex items-center justify-center relative z-10 transition-transform duration-300 group-hover:scale-110">
                    <PatternGraphic type={pattern.svgType} />
                  </div>

                  {/* BOTTOM: PATTERN NAME & DETAILS (Lassanata yatin nama) */}
                  <div className="pt-3 border-t border-slate-800/70 space-y-1.5 relative z-10">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs sm:text-sm font-black text-white tracking-tight group-hover:text-white transition-colors truncate">
                        {pattern.name}
                      </h4>
                    </div>

                    <p className="text-[10px] sm:text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {pattern.desc}
                    </p>

                    <div className="pt-1.5 flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold ${pillColor}`}>
                        {isBullish ? "🟢" : isBearish ? "🔴" : "⚪"} {pattern.sentiment}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* BOTTOM HELPER BANNER */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs sm:text-sm font-bold text-white">
                Learn how to trade these 37 patterns live with high win-rate risk management
              </h5>
              <p className="text-[11px] text-slate-400">
                All patterns covered with real chart examples, entry points, stop-loss & take-profit levels inside the LMS portal.
              </p>
            </div>
          </div>
          <a
            href="/register"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/20 transition-all active:scale-95 shrink-0"
          >
            Join Live Trading LMS
          </a>
        </div>

      </div>
    </section>
  );
}
