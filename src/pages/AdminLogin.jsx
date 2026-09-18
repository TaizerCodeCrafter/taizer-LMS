import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, User, ArrowRight, ArrowLeft } from "lucide-react";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const storedProfile = JSON.parse(
      localStorage.getItem("adminProfile") ||
        JSON.stringify({
          name: "S.S.D Madusanka",
          email: "admin@econoacademy.lk",
          photo: "/admin-profile.png",
          password: "admin"
        })
    );

    if (
      (username === "admin" || username === storedProfile.email) &&
      password === storedProfile.password
    ) {
      localStorage.setItem("adminLoggedIn", "true");
      navigate("/admin");
    } else {
      setError("Invalid administrative credentials. Please check your username and password.");
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-6 relative overflow-hidden select-none">
      {/* AMBIENT GLOWS */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md bg-[#0e1424]/90 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-9 shadow-2xl relative z-10 space-y-8"
      >
        {/* LOGO & TITLE */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 p-0.5 mx-auto shadow-xl shadow-indigo-600/20">
            <div className="w-full h-full bg-[#090d16] rounded-[14px] flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase">
              Admin <span className="text-indigo-400">Console</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Econo Academy LMS Management System
            </p>
          </div>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Username or Admin Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError("");
                }}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
                placeholder="admin"
                required
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
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold text-center"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <span>Authorize Access</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* BACK TO SITE LINK */}
        <div className="pt-2 text-center">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
