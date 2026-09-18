import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  X,
  Trash2,
  AlertTriangle,
  HelpCircle
} from "lucide-react";

let toastEmitter = null;
let confirmEmitter = null;

// Global toast helper
export const showAppToast = (titleOrMsg, message = "", type = "success", duration = 3800) => {
  if (toastEmitter) {
    if (typeof titleOrMsg === "object") {
      toastEmitter(titleOrMsg);
    } else if (message) {
      toastEmitter({ title: titleOrMsg, message, type, duration });
    } else {
      toastEmitter({ title: "Notification", message: titleOrMsg, type, duration });
    }
  } else {
    window.dispatchEvent(
      new CustomEvent("app-toast", {
        detail: {
          title: typeof titleOrMsg === "object" ? titleOrMsg.title : message ? titleOrMsg : "Notification",
          message: typeof titleOrMsg === "object" ? titleOrMsg.message : message || titleOrMsg,
          type: typeof titleOrMsg === "object" ? titleOrMsg.type : type,
          duration
        }
      })
    );
  }
};

// Global confirm helper
export const showAppConfirm = ({
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger", // "danger" | "warning" | "info"
  onConfirm = () => {},
  onCancel = () => {}
}) => {
  if (confirmEmitter) {
    confirmEmitter({
      title,
      message,
      confirmText,
      cancelText,
      type,
      onConfirm,
      onCancel
    });
  } else {
    window.dispatchEvent(
      new CustomEvent("app-confirm", {
        detail: { title, message, confirmText, cancelText, type, onConfirm, onCancel }
      })
    );
  }
};

export default function GlobalAlert() {
  const [toasts, setToasts] = useState([]);
  const [confirmModal, setConfirmModal] = useState(null);

  const addToast = ({ title, message, type = "success", duration = 3800 }) => {
    const id = "toast_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
    const newToast = {
      id,
      title: title || (type === "success" ? "Success" : type === "error" ? "Notice" : "Information"),
      message: String(message || ""),
      type: type || "success",
      duration
    };

    setToasts((prev) => [newToast, ...prev.slice(0, 3)]); // Keep max 4 toasts

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    toastEmitter = addToast;
    confirmEmitter = (config) => setConfirmModal(config);

    // Listen to custom DOM events
    const handleCustomToast = (e) => {
      if (e && e.detail) {
        addToast(e.detail);
      }
    };
    window.addEventListener("app-toast", handleCustomToast);

    const handleCustomConfirm = (e) => {
      if (e && e.detail) {
        setConfirmModal(e.detail);
      }
    };
    window.addEventListener("app-confirm", handleCustomConfirm);

    // INTERCEPT NATIVE WINDOW.ALERT
    const originalAlert = window.alert;
    window.alert = (msg) => {
      const text = String(msg || "");
      const lower = text.toLowerCase();
      let derivedType = "info";
      let title = "System Notification";

      if (lower.includes("success") || lower.includes("published") || lower.includes("saved")) {
        derivedType = "success";
        title = "Action Successful";
      } else if (lower.includes("error") || lower.includes("failed") || lower.includes("large") || lower.includes("please enter") || lower.includes("please provide")) {
        derivedType = "error";
        title = "Attention Needed";
      }

      addToast({
        title,
        message: text,
        type: derivedType,
        duration: 4000
      });
    };

    // INTERCEPT NATIVE WINDOW.CONFIRM (PREVENTS UGLY BROWSER POPUPS)
    const originalConfirm = window.confirm;
    window.confirm = (msg) => {
      console.warn("Native window.confirm intercepted by GlobalAlert:", msg);
      showAppConfirm({
        title: "Please Confirm",
        message: String(msg || "Are you sure you want to proceed?"),
        confirmText: "Confirm",
        type: "danger"
      });
      return false; // Prevent blocking synchronous popup
    };

    // Attach to window object for ease of access
    window.showToast = showAppToast;
    window.showConfirm = showAppConfirm;

    return () => {
      window.removeEventListener("app-toast", handleCustomToast);
      window.removeEventListener("app-confirm", handleCustomConfirm);
      window.alert = originalAlert;
      window.confirm = originalConfirm;
      toastEmitter = null;
      confirmEmitter = null;
    };
  }, []);

  return (
    <>
      {/* FLOATING TOASTS CONTAINER */}
      <div className="fixed top-5 right-5 z-[999999] pointer-events-none flex flex-col gap-3 max-w-sm sm:max-w-md w-full px-4 sm:px-0">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            const isSuccess = toast.type === "success";
            const isError = toast.type === "error";

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.92, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.9, y: -10, filter: "blur(4px)" }}
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
                className={`pointer-events-auto relative overflow-hidden rounded-2xl p-4 sm:p-4.5 backdrop-blur-2xl shadow-2xl border transition-all ${
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
                  {/* ICON CONTAINER */}
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
                    ) : isError ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                  </div>

                  {/* TEXT CONTENT */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-xs sm:text-sm font-black text-white tracking-tight flex items-center gap-2">
                        <span>{toast.title}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-md font-extrabold uppercase tracking-wider ${
                            isSuccess
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : isError
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                          }`}
                        >
                          {toast.type}
                        </span>
                      </h4>
                    </div>
                    <p className="text-xs text-slate-200 font-medium leading-relaxed break-words">
                      {toast.message}
                    </p>
                  </div>

                  {/* CLOSE BUTTON */}
                  <button
                    onClick={() => removeToast(toast.id)}
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
                  transition={{ duration: toast.duration / 1000, ease: "linear" }}
                  className={`absolute bottom-0 left-0 right-0 h-[2.5px] origin-left ${
                    isSuccess
                      ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                      : isError
                      ? "bg-gradient-to-r from-rose-500 to-amber-500"
                      : "bg-gradient-to-r from-blue-500 to-indigo-500"
                  }`}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* GLOBAL CONFIRMATION MODAL */}
      <AnimatePresence>
        {confirmModal && (
          <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (confirmModal.onCancel) confirmModal.onCancel();
                setConfirmModal(null);
              }}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              className="relative z-10 bg-[#0e1424] border border-slate-700/80 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5 overflow-hidden text-center sm:text-left animate-scaleUp"
            >
              {/* Glow Aura */}
              <div
                className={`absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl pointer-events-none ${
                  confirmModal.type === "danger"
                    ? "bg-rose-500/25"
                    : confirmModal.type === "warning"
                    ? "bg-amber-500/25"
                    : "bg-indigo-500/25"
                }`}
              />

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 relative z-10">
                {/* Icon Container */}
                <div
                  className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-xl ${
                    confirmModal.type === "danger"
                      ? "bg-rose-500/15 border-rose-500/40 text-rose-400 shadow-rose-500/10"
                      : confirmModal.type === "warning"
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-amber-500/10"
                      : "bg-indigo-500/15 border-indigo-500/40 text-indigo-400 shadow-indigo-500/10"
                  }`}
                >
                  {confirmModal.type === "danger" ? (
                    <Trash2 className="w-6 h-6 sm:w-7 sm:h-7" />
                  ) : confirmModal.type === "warning" ? (
                    <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7" />
                  ) : (
                    <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                  )}
                </div>

                <div className="space-y-1.5 min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                    {confirmModal.title || "Confirmation Required"}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed break-words">
                    {confirmModal.message}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => {
                    if (confirmModal.onCancel) confirmModal.onCancel();
                    setConfirmModal(null);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-all"
                >
                  {confirmModal.cancelText || "Cancel"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const cb = confirmModal.onConfirm;
                    setConfirmModal(null);
                    if (cb) cb();
                  }}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-xl transition-all ${
                    confirmModal.type === "danger"
                      ? "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-rose-600/30"
                      : confirmModal.type === "warning"
                      ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-600/30"
                      : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-600/30"
                  }`}
                >
                  {confirmModal.confirmText || "Confirm"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
