import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  Sparkles
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;

    const existingMessages = JSON.parse(
      localStorage.getItem("webMessages") || "[]"
    );
    const newMessage = {
      ...formData,
      id: Date.now(),
      date: new Date().toLocaleString(),
      status: "unread"
    };

    localStorage.setItem(
      "webMessages",
      JSON.stringify([newMessage, ...existingMessages])
    );

    // Sync to backend MongoDB API
    try {
      await fetch("http://localhost:5000/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
    } catch (err) {
      console.warn("Backend inquiry post error:", err);
    }

    // Trigger storage event so Admin panel updates in real time
    window.dispatchEvent(new Event("storage"));

    setSubmitted(true);
    setFormData({ name: "", phone: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="bg-[#070b14] text-slate-100 min-h-screen py-20 select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Connect Directly</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Contact & Support
          </h1>
          <p className="text-sm text-slate-400">
            Have questions about timetable schedules, syllabus coverage, or registration? Reach out directly.
          </p>
        </div>

        {/* TWO COLUMN CONTACT CHANNELS & FORM */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* LEFT CHANNELS */}
          <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 shadow-2xl space-y-6">
            <h3 className="text-base font-bold text-white">Direct Channels</h3>

            <div className="space-y-4">
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-4 group hover:bg-emerald-500/20 transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    WhatsApp Chat Hotline
                  </p>
                  <p className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Click to Open WhatsApp
                  </p>
                </div>
              </a>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Email Inquiries
                  </p>
                  <p className="text-xs font-bold text-slate-200">
                    support@econoacademy.lk
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Class Hours
                  </p>
                  <p className="text-xs font-bold text-slate-200">
                    Saturdays & Sundays (Live Zoom Sessions)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT INQUIRY FORM */}
          <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 shadow-2xl space-y-6">
            <h3 className="text-base font-bold text-white">Send A Message</h3>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Message Received!</h4>
                <p className="text-xs text-slate-400">
                  Our academic coordinator will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nimal Perera"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="text"
                    placeholder="07X XXX XXXX"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    Inquiry Details *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="How can we assist you with class enrollment?..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-medium text-white outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <span>Submit Inquiry</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
