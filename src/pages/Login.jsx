import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Lock, Mail, ArrowRight, ArrowLeft } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    let students = [];
    try {
      const res = await fetch("http://localhost:5000/api/students");
      if (res.ok) {
        students = await res.json();
        if (Array.isArray(students)) {
          try {
            localStorage.setItem("studentRequests", JSON.stringify(students));
          } catch (e) {}
        }
      } else {
        students = JSON.parse(localStorage.getItem("studentRequests") || "[]");
      }
    } catch (err) {
      students = JSON.parse(localStorage.getItem("studentRequests") || "[]");
    }

    if (!students || students.length === 0) {
      try {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("activeStudent");
      } catch (e) {}
      setError("No registered student account found. Please register first.");
      return;
    }

    const student = students.find(
      (s) =>
        (s.email?.toLowerCase() === userId.toLowerCase().trim() ||
          s.studentId?.toLowerCase() === userId.toLowerCase().trim()) &&
        s.password === password.trim()
    );

    if (student) {
      if (student.status === "Rejected" || student.paymentStatus === "Rejected") {
        setError("Your account request was rejected. Please contact administration.");
        return;
      }
      localStorage.setItem("currentUser", student.email);
      localStorage.setItem("activeStudent", JSON.stringify(student));
      navigate("/lms");
    } else {
      setError("Invalid Student ID/Email or Password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070b14] py-20 px-4 select-none relative overflow-hidden">
      {/* AMBIENT GLOW ORBS */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="max-w-md w-full bg-[#0e1424]/90 backdrop-blur-2xl rounded-3xl p-9 border border-slate-800/80 shadow-2xl space-y-8 relative z-10"
      >
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-600 p-0.5 mx-auto shadow-xl shadow-indigo-600/20">
            <div className="w-full h-full bg-[#070b14] rounded-[14px] flex items-center justify-center text-indigo-400">
              <GraduationCap className="w-8 h-8" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">
              Student <span className="text-indigo-400">Portal</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Access your lesson recordings, worksheets, and live class links
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Student ID or Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="EA-0001 or email@domain.com"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  if (error) setError("");
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs font-semibold text-white outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs font-semibold text-white outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold text-center leading-relaxed">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <span>Log In to LMS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center space-y-3">
          <p className="text-xs text-slate-400">
            Don't have an account yet?{" "}
            <Link
              to="/register"
              className="text-indigo-400 hover:text-indigo-300 font-bold"
            >
              Register Here
            </Link>
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-400 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
