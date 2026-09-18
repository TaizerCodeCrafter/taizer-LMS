import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  AlertCircle,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Download,
  CreditCard,
  User,
  ExternalLink,
  FileText
} from "lucide-react";
import { showAppToast } from "../GlobalAlert";

export const PaymentSlipModal = ({
  student,
  onClose,
  onApprove,
  onReject
}) => {
  const [zoom, setZoom] = useState(1);
  const [blobUrl, setBlobUrl] = useState(null);
  const [imgError, setImgError] = useState(false);

  if (!student) return null;

  const slipUrl = student.receiptUrl || student.receiptImage || "";
  const isPdf = Boolean(
    slipUrl &&
      (slipUrl.startsWith("data:application/pdf") ||
        slipUrl.endsWith(".pdf") ||
        slipUrl.includes("application/pdf"))
  );

  useEffect(() => {
    if (!slipUrl) {
      setBlobUrl(null);
      return;
    }

    if (slipUrl.startsWith("data:")) {
      try {
        const parts = slipUrl.split(",");
        const mimeMatch = parts[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : isPdf ? "application/pdf" : "image/jpeg";
        const bstr = atob(parts[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);

        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (err) {
        console.warn("Could not convert data URL to Blob:", err);
        setBlobUrl(slipUrl);
      }
    } else {
      setBlobUrl(slipUrl);
    }
  }, [slipUrl, isPdf]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = blobUrl || slipUrl;
    link.download = `payment-receipt-${student.studentId || "student"}${isPdf ? ".pdf" : ".jpg"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenNewTab = () => {
    if (blobUrl) {
      window.open(blobUrl, "_blank");
    } else if (slipUrl) {
      const win = window.open();
      if (win) {
        win.document.write(
          `<iframe src="${slipUrl}" frameborder="0" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;" allowfullscreen></iframe>`
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0e1424] border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* HEADER */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Payment Deposit Verification</h3>
              <p className="text-xs text-slate-400">
                {student.name} • {student.grade} ({student.subject || "Economics"})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isPdf && (
              <>
                <button
                  onClick={() => setZoom((z) => Math.max(z - 0.25, 0.75))}
                  className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoom((z) => Math.min(z + 0.25, 2.5))}
                  className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SLIP VIEWER BODY */}
        <div className="flex-grow overflow-auto p-6 bg-slate-950/80 flex items-center justify-center min-h-[360px]">
          {slipUrl ? (
            isPdf ? (
              <div className="w-full h-[520px] flex flex-col items-center justify-between gap-3">
                <iframe
                  src={blobUrl || slipUrl}
                  title="Payment Slip PDF"
                  className="w-full flex-grow rounded-2xl border border-slate-800 bg-slate-900 shadow-inner"
                />
                <div className="flex items-center gap-3 flex-wrap justify-center pt-1">
                  <button
                    onClick={handleOpenNewTab}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 inline-flex items-center gap-1.5 transition-all shadow"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Open PDF in New Window</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 inline-flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Original PDF</span>
                  </button>
                </div>
              </div>
            ) : imgError ? (
              <div className="text-center p-8 space-y-4 max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-2xl">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Receipt Document Attached</h4>
                  <p className="text-xs text-slate-400 mt-1">Direct thumbnail preview failed. You can open or download the original file below.</p>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleOpenNewTab}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 inline-flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                    Open in Tab
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download File
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="overflow-hidden rounded-2xl border border-slate-800 shadow-2xl bg-slate-900/60 p-2">
                  <img
                    src={blobUrl || slipUrl}
                    alt="Payment Slip"
                    onError={() => setImgError(true)}
                    style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
                    className="max-h-[460px] max-w-full object-contain rounded-xl transition-transform duration-200"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenNewTab}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-[11px] border border-slate-700 inline-flex items-center gap-1.5 transition-all"
                  >
                    <ExternalLink className="w-3 h-3 text-indigo-400" />
                    <span>View Fullscreen</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-[11px] border border-slate-700 inline-flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3 h-3 text-emerald-400" />
                    <span>Download Slip</span>
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="text-center text-slate-500 p-12">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 text-slate-700" />
              <p className="text-sm font-bold text-slate-400">No Slip Uploaded</p>
              <p className="text-xs text-slate-600 mt-1">
                The student registered without uploading a bank receipt.
              </p>
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="text-xs text-slate-400 text-left">
            <p>
              <span className="font-bold text-slate-300">Email:</span> {student.email}
            </p>
            <p>
              <span className="font-bold text-slate-300">Registered:</span>{" "}
              {student.joined || "N/A"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onReject(student.id)}
              className="px-5 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 font-bold text-xs transition-all active:scale-95"
            >
              Reject Slip
            </button>
            <button
              onClick={() => onApprove(student.id)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Approve & Grant LMS Access</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText,
  inputRequired,
  expectedInput,
  onConfirm,
  onClose
}) => {
  const [inputValue, setInputValue] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (inputRequired && inputValue !== expectedInput) {
      showAppToast("Confirmation Required", `Please type "${expectedInput}" to confirm.`, "error");
      return;
    }
    onConfirm();
    setInputValue("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0e1424] border border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl"
      >
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-lg font-black text-white">{title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed">{message}</p>
        </div>

        {inputRequired && (
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-rose-400">
              Type "{expectedInput}" below to proceed:
            </p>
            <input
              type="text"
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-center font-bold text-white outline-none focus:border-rose-500"
            />
          </div>
        )}

        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={handleConfirm}
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all active:scale-95"
          >
            {confirmText || "Confirm Action"}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const ToastAlert = ({ alert, onClose }) => {
  if (!alert) return null;

  const isSuccess = alert.type === "success";
  const isError = alert.type === "error";

  return (
    <div className="fixed top-6 right-6 z-[999999] pointer-events-auto max-w-sm sm:max-w-md w-full px-4 sm:px-0">
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.92, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.9, y: -10, filter: "blur(4px)" }}
        transition={{ type: "spring", stiffness: 450, damping: 30 }}
        className={`relative overflow-hidden rounded-2xl p-4 sm:p-4.5 backdrop-blur-2xl shadow-2xl border transition-all ${
          isSuccess
            ? "bg-[#0b1622]/95 border-emerald-500/40 shadow-emerald-950/40 text-emerald-100"
            : isError
            ? "bg-[#1d0f14]/95 border-rose-500/40 shadow-rose-950/40 text-rose-100"
            : "bg-[#0d1424]/95 border-indigo-500/40 shadow-indigo-950/40 text-indigo-100"
        }`}
      >
        {/* GLOW EFFECT */}
        <div
          className={`absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl pointer-events-none ${
            isSuccess
              ? "bg-emerald-500/20"
              : isError
              ? "bg-rose-500/20"
              : "bg-indigo-500/20"
          }`}
        />

        <div className="flex items-start gap-3.5 relative z-10">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-lg ${
              isSuccess
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-emerald-500/10"
                : isError
                ? "bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-rose-500/10"
                : "bg-indigo-500/20 border-indigo-500/40 text-indigo-400 shadow-indigo-500/10"
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h4 className="text-xs sm:text-sm font-black text-white tracking-tight flex items-center gap-2">
                <span>{alert.title}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-md font-extrabold uppercase tracking-wider ${
                    isSuccess
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : isError
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  }`}
                >
                  {alert.type || "info"}
                </span>
              </h4>
            </div>
            <p className="text-xs text-slate-200 font-medium leading-relaxed break-words">
              {alert.message}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PROGRESS BAR */}
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 3.5, ease: "linear" }}
          className={`absolute bottom-0 left-0 right-0 h-[2.5px] origin-left ${
            isSuccess
              ? "bg-gradient-to-r from-emerald-500 to-teal-400"
              : isError
              ? "bg-gradient-to-r from-rose-500 to-amber-500"
              : "bg-gradient-to-r from-blue-500 to-indigo-500"
          }`}
        />
      </motion.div>
    </div>
  );
};
