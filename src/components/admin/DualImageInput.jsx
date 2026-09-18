import React, { useState, useRef } from "react";
import { Upload, Link as LinkIcon, Trash2, Image as ImageIcon, Check, Loader2, Sparkles } from "lucide-react";
import { compressImageFile, getDataUrlSizeKB } from "../../utils/imageCompressor";
import { showAppToast } from "../GlobalAlert";

/**
 * DualImageInput provides two flexible ways to choose/provide an image:
 * 1. "Upload from Device / Browser" using local file picker -> Canvas Compressed Data URL
 * 2. "Enter Image URL" for hosted links, CDN, or local public paths (/hero-image.png)
 */
const DualImageInput = ({
  label = "Image",
  value = "",
  onChange,
  aspectRatio = "aspect-[4/5]",
  recommended = "Recommended: PNG or JPG (Auto-compressed to ~100KB)",
  defaultPreset = ""
}) => {
  const [mode, setMode] = useState(value?.startsWith("data:") ? "upload" : "url");
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        showAppToast("File Too Large", "Please select an image file under 25MB.", "error");
        return;
      }
      try {
        setIsCompressing(true);
        const compressedDataUrl = await compressImageFile(file, {
          maxWidth: 1280,
          maxHeight: 1280,
          quality: 0.82
        });
        onChange(compressedDataUrl);
      } catch (err) {
        console.error("Image processing error:", err);
        showAppToast("Processing Error", "Failed to process image. Please try another image.", "error");
      } finally {
        setIsCompressing(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
          <span>{label}</span>
        </label>
        <span className="text-[10px] text-slate-400 font-medium">{recommended}</span>
      </div>

      {/* DUAL SELECTOR SWITCH */}
      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 w-fit">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
            mode === "upload"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Upload className="w-3 h-3" />
          <span>Upload from Device</span>
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
            mode === "url"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <LinkIcon className="w-3 h-3" />
          <span>Image URL</span>
        </button>
      </div>

      {/* INPUT AREA */}
      {mode === "upload" ? (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            disabled={isCompressing}
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-4 px-4 rounded-xl border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-950/60 hover:bg-indigo-950/20 text-slate-300 hover:text-white text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group disabled:opacity-50"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 group-hover:bg-indigo-600/20 text-indigo-400 flex items-center justify-center transition-colors">
              {isCompressing ? (
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
            </div>
            <span>
              {isCompressing
                ? "Compressing & Optimizing Image..."
                : "Click to browse photo from computer / mobile"}
            </span>
            <span className="text-[10px] text-slate-400 font-normal">
              {isCompressing
                ? "Auto-downscaling to retina web size..."
                : "Supported: JPG, PNG, WEBP, SVG (Auto-compressed)"}
            </span>
          </button>
        </div>
      ) : (
        <div className="space-y-1.5">
          <input
            type="text"
            placeholder="https://example.com/photo.jpg or /hero-image.png"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none transition-colors"
          />
          <p className="text-[10px] text-slate-400">
            Enter a web link (https://...) or a local asset path (e.g. /hero-image.png, /teacher.jpg).
          </p>
        </div>
      )}

      {/* LIVE IMAGE PREVIEW & ACTIONS */}
      {value ? (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 shrink-0 relative">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/logo.png";
              }}
            />
          </div>
          <div className="flex-grow overflow-hidden">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs font-bold text-white truncate">Active Image</p>
            </div>
            <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
              {value.startsWith("data:")
                ? `⚡ Compressed (${getDataUrlSizeKB(value)} KB)`
                : value}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {defaultPreset && value !== defaultPreset && (
              <button
                type="button"
                onClick={() => onChange(defaultPreset)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-[10px] font-bold"
                title="Reset to default image"
              >
                Reset
              </button>
            )}
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all text-xs"
              title="Remove image"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        defaultPreset && (
          <button
            type="button"
            onClick={() => onChange(defaultPreset)}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2"
          >
            Use default recommended image ({defaultPreset})
          </button>
        )
      )}
    </div>
  );
};

export default DualImageInput;
