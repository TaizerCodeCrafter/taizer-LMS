import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import {
  UserPlus,
  User,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Loader2,
  Gift
} from "lucide-react";
import { compressImageFile } from "../utils/imageCompressor";

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    emailjs.init("8C_YF-wTV5vHsMb2C");
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Crypto Basic",
    grade: "Crypto Basic",
    referralCode: ""
  });

  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const ref = searchParams.get("ref");
      if (ref) {
        setFormData((prev) => ({ ...prev, referralCode: ref.toUpperCase().trim() }));
      }
    } catch (e) {}
  }, []);

  const [submitted, setSubmitted] = useState(false);
  const [generatedId, setGeneratedId] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("webGeneralSettings");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      subjects: ["Crypto Basic", "Price Action", "Technical Analysis", "Sinhala", "Economics"],
      grades: {
        "Crypto Basic": [],
        "Price Action": [],
        "Technical Analysis": [],
        Sinhala: ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10"],
        Economics: ["Grade 12", "Grade 13"]
      }
    };
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/settings");
        if (res.ok) {
          const data = await res.json();
          const generalSetting = data.find((s) => s.type === "webGeneralSettings");
          if (generalSetting && generalSetting.data) {
            setSettings(generalSetting.data);
            try {
              localStorage.setItem("webGeneralSettings", JSON.stringify(generalSetting.data));
            } catch (e) {}
            const subjectsList = generalSetting.data.subjects || ["Crypto Basic"];
            const currentSub = subjectsList[0] || "Crypto Basic";
            const subGrades = (generalSetting.data.grades && generalSetting.data.grades[currentSub]) || [];
            const defaultGrade = subGrades.length > 0 ? subGrades[0] : currentSub;
            setFormData((prev) => ({
              ...prev,
              subject: prev.subject && subjectsList.includes(prev.subject) ? prev.subject : currentSub,
              grade: prev.grade || defaultGrade
            }));
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchSettings();

    const handleStorageChange = (e) => {
      if (!e || !e.key || e.key === "webGeneralSettings") {
        try {
          const fresh = JSON.parse(localStorage.getItem("webGeneralSettings") || "null");
          if (fresh) setSettings(fresh);
        } catch (err) {}
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const showNotification = (title, message, type = "success") => {
    setAlert({ title, message, type });
  };

  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8).toUpperCase();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const students = JSON.parse(
      localStorage.getItem("studentRequests") || "[]"
    );

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      showNotification("Required", "Please complete all contact information.", "error");
      setLoading(false);
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length < 9) {
      showNotification("Invalid Phone", "Please enter a valid phone number.", "error");
      setLoading(false);
      return;
    }

    if (
      students.find(
        (s) => s.email?.toLowerCase() === formData.email.toLowerCase()
      )
    ) {
      showNotification("Email Exists", "This email is already registered. Please log in.", "error");
      setLoading(false);
      return;
    }

    const approvedCount = students.filter(
      (s) => s.studentId && s.studentId.startsWith("EA-")
    ).length;
    const nextIdNumber = approvedCount + 1;
    const studentId = `EA-${nextIdNumber.toString().padStart(4, "0")}`;
    const generatedPass = generateRandomPassword();

    const templateParams = {
      to_name: formData.name,
      to_email: formData.email,
      student_id: studentId,
      temp_password: generatedPass,
      login_link: "http://localhost:5173/login"
    };

    const completeRegistration = () => {
      const resolvedGrade = formData.grade || formData.subject;
      const newStudent = {
        ...formData,
        grade: resolvedGrade,
        id: "REQ" + Math.floor(Math.random() * 10000),
        studentId: studentId,
        password: generatedPass,
        status: "Pending",
        paymentStatus: "Pending",
        receiptUrl: "",
        receiptImage: "",
        referredBy: formData.referralCode ? formData.referralCode.trim() : "",
        joined: new Date().toLocaleString()
      };

      const updatedStudents = [...students, newStudent];
      try {
        localStorage.setItem("studentRequests", JSON.stringify(updatedStudents));
      } catch (storageErr) {
        console.warn("Storage quota warning on studentRequests:", storageErr);
      }

      fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent)
      }).catch((err) => console.error("MongoDB Save Error:", err));

      setGeneratedId(studentId);
      setTempPassword(generatedPass);
      setSubmitted(true);
      setLoading(false);
    };

    emailjs
      .send("service_88gdr5n", "template_pjirm4x", templateParams)
      .then(() => {
        completeRegistration();
      })
      .catch((err) => {
        console.warn("EmailJS Dispatch warning:", err);
        completeRegistration();
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070b14] py-20 px-4 select-none relative overflow-hidden">
      {/* AMBIENT GLOW ORBS */}
      <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="max-w-lg w-full bg-[#0e1424]/90 backdrop-blur-2xl rounded-3xl p-9 border border-slate-800/80 shadow-2xl relative z-10 space-y-6"
      >
        {!submitted ? (
          <>
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 p-0.5 mx-auto shadow-xl shadow-indigo-600/20">
                <div className="w-full h-full bg-[#070b14] rounded-[14px] flex items-center justify-center text-indigo-400">
                  <UserPlus className="w-7 h-7" />
                </div>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight uppercase">
                Student <span className="text-indigo-400">Enrollment</span>
              </h1>
              <p className="text-xs text-slate-400">
                Register to gain access to our interactive LMS lectures & materials
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kasun Jayawardena"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="student@gmail.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Phone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="077 123 4567"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* SUBJECT / COURSE SELECTION & OPTIONAL BATCH SELECTION */}
              {(() => {
                const subGrades = (settings.grades && settings.grades[formData.subject]) || [];
                const hasGrades = Array.isArray(subGrades) && subGrades.length > 0;

                return (
                  <div className={hasGrades ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-1"}>
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Course / Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => {
                          const newSub = e.target.value;
                          const gradesForSub = (settings.grades && settings.grades[newSub]) || [];
                          const defaultGrade = gradesForSub.length > 0 ? gradesForSub[0] : newSub;
                          setFormData({ ...formData, subject: newSub, grade: defaultGrade });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-semibold text-white outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        {(settings.subjects || ["Crypto Basic", "Price Action", "Sinhala", "Economics"]).map((s) => (
                          <option key={s} value={s} className="bg-slate-900">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    {hasGrades && (
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Class / Batch Level
                        </label>
                        <select
                          value={formData.grade}
                          onChange={(e) =>
                            setFormData({ ...formData, grade: e.target.value })
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-semibold text-white outline-none focus:border-indigo-500 cursor-pointer"
                        >
                          {subGrades.map((g) => (
                            <option key={g} value={g} className="bg-slate-900">
                              {g}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* REFERRAL CODE (OPTIONAL) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Referral Code / මිතුරු ඇරයුම් කේතය (Optional)
                  </label>
                  {formData.referralCode && (
                    <span className="text-[10px] font-black text-emerald-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Bonus Applied
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Gift className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. EA-0001 or REF-0001"
                    value={formData.referralCode}
                    onChange={(e) =>
                      setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-white uppercase placeholder:normal-case outline-none focus:border-indigo-500"
                  />
                </div>
                {formData.referralCode && (
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    🎁 Referral discount bonus will be verified upon enrollment.
                  </p>
                )}
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <span>Processing Registration...</span>
                ) : (
                  <>
                    <span>Submit & Generate Student ID</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-slate-400 text-center pt-2">
              Already enrolled?{" "}
              <Link to="/login" className="text-indigo-400 font-bold hover:underline">
                Log In to LMS
              </Link>
            </p>
          </>
        ) : (
          /* SUCCESS SCREEN */
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center text-3xl mx-auto border border-emerald-500/20 shadow-xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-black text-white">Enrollment Successful!</h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Your student account credentials have been generated. An email has also been sent to{" "}
                <span className="text-indigo-400 font-bold">{formData.email}</span>.
              </p>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Your Student ID
                </p>
                <p className="text-2xl font-black text-indigo-400 mt-0.5">
                  {generatedId}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Temporary Password
                </p>
                <p className="text-sm font-mono font-bold text-white mt-0.5">
                  {tempPassword}
                </p>
              </div>
            </div>

            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 text-left">
              <p className="text-[11px] text-indigo-300 leading-relaxed font-medium">
                💡 <strong>Payment Details:</strong> You can log in to your Student LMS Portal anytime to view banking details and submit your payment slip for account verification.
              </p>
            </div>

            <button
              onClick={() => navigate("/login")}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-indigo-600/30"
            >
              Proceed to LMS Login
            </button>
          </div>
        )}
      </motion.div>

      {/* ALERT MODAL */}
      <AnimatePresence>
        {alert && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#0e1424] border border-slate-800 rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${
                  alert.type === "success"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}
              >
                {alert.type === "success" ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <AlertCircle className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{alert.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{alert.message}</p>
              </div>
              <button
                onClick={() => setAlert(null)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow"
              >
                Continue
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Register;
