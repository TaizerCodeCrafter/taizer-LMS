import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  CreditCard,
  BookOpen,
  HelpCircle,
  MessageSquare,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  TrendingUp,
  GraduationCap
} from "lucide-react";

const DashboardTab = ({
  students = [],
  sessions = {},
  questions = {},
  whatsappMessages = [],
  portalMessages = [],
  setActiveTab,
  setViewingPayment
}) => {
  const pendingStudents = students.filter(
    (s) => s.paymentStatus === "Pending" || s.paymentStatus === "Uploaded"
  );
  const approvedStudents = students.filter((s) => s.paymentStatus === "Approved");
  const totalSessionsCount = Object.values(sessions).flat().length;
  const totalQuestionsCount = Object.values(questions).flat().length;
  const unreadMessagesCount = portalMessages.filter(
    (m) => m.sender === "student" && !m.isRead
  ).length;

  // Grade breakdown
  const gradeDistribution = students.reduce((acc, s) => {
    const g = s.grade || "Other";
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});

  const statCards = [
    {
      title: "Total Students",
      value: students.length,
      subtext: `${approvedStudents.length} Active Access`,
      icon: Users,
      color: "from-blue-500 to-indigo-600",
      accent: "text-blue-400",
      bgAccent: "bg-blue-500/10 border-blue-500/20",
      tab: "Students"
    },
    {
      title: "Pending Payments",
      value: pendingStudents.length,
      subtext: pendingStudents.length > 0 ? "Requires Review" : "All Caught Up",
      icon: CreditCard,
      color: "from-amber-500 to-orange-600",
      accent: "text-amber-400",
      bgAccent: "bg-amber-500/10 border-amber-500/20",
      tab: "Payment",
      alert: pendingStudents.length > 0
    },
    {
      title: "Curriculum Modules",
      value: totalSessionsCount,
      subtext: "Across All Grades",
      icon: BookOpen,
      color: "from-emerald-500 to-teal-600",
      accent: "text-emerald-400",
      bgAccent: "bg-emerald-500/10 border-emerald-500/20",
      tab: "Sessions"
    },
    {
      title: "Question Bank",
      value: totalQuestionsCount,
      subtext: "Assessments & MCQs",
      icon: HelpCircle,
      color: "from-purple-500 to-violet-600",
      accent: "text-purple-400",
      bgAccent: "bg-purple-500/10 border-purple-500/20",
      tab: "Questions"
    },
    {
      title: "Live Portal Messages",
      value: portalMessages.length,
      subtext: unreadMessagesCount > 0 ? `${unreadMessagesCount} Unread` : "WhatsApp + Portal",
      icon: MessageSquare,
      color: "from-pink-500 to-rose-600",
      accent: "text-pink-400",
      bgAccent: "bg-pink-500/10 border-pink-500/20",
      tab: "Messages"
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* WELCOME BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Advanced Admin Control Panel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome Back, <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">Administrator</span>
            </h1>
            <p className="text-sm text-slate-400 max-w-xl">
              Monitor student registrations, verify payment slips, curate course modules, and manage student communications in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("Payment")}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center gap-2"
            >
              <span>Review Payments</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab("Sessions")}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition-all active:scale-95"
            >
              Manage Curriculum
            </button>
          </div>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              whileHover={{ y: -3 }}
              onClick={() => setActiveTab(stat.tab)}
              className="cursor-pointer bg-[#0e1424]/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 shadow-xl group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.bgAccent}`}
                >
                  <Icon className={`w-5 h-5 ${stat.accent}`} />
                </div>
                {stat.alert && (
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                  </span>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-black text-white mt-1 group-hover:text-indigo-400 transition-colors">
                  {stat.value}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  {stat.subtext}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* TWO COLUMN CONTENT: PENDING PAYMENTS & ENROLLMENT OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PENDING PAYMENT REQUESTS HUB (2 COLUMNS) */}
        <div className="lg:col-span-2 bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-7 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Pending Payment Approvals
                </h3>
                <p className="text-xs text-slate-400">
                  Verify receipts and unlock portal access for new registrations
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("Payment")}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800/80">
            <table className="w-full text-left">
              <thead className="bg-slate-900/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Student</th>
                  <th className="px-5 py-3.5">Grade</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {pendingStudents.slice(0, 5).map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-xs">
                          {s.name?.charAt(0) || "S"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-200">{s.name}</p>
                          <p className="text-[10px] text-slate-500">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-300">
                        {s.grade || "A/L"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-[11px]">
                      {s.joined?.split(",")[0] || "Recent"}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => {
                          setViewingPayment(s);
                          setActiveTab("Payment");
                        }}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 font-semibold text-xs transition-all"
                      >
                        Inspect Slip
                      </button>
                    </td>
                  </tr>
                ))}

                {pendingStudents.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-slate-500">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
                      <p className="font-bold text-sm text-slate-400">
                        All payments have been reviewed!
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        No pending payment verification requests in the queue.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SYSTEM SUMMARY & QUICK SHORTCUTS (1 COLUMN) */}
        <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-7 shadow-2xl space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Grade Overview</h3>
                <p className="text-xs text-slate-400">Student enrollment spread</p>
              </div>
            </div>

            {/* GRADE BARS */}
            <div className="space-y-3">
              {["Grade 12", "Grade 13", "Grade 10", "Grade 11"].map((g) => {
                const count = gradeDistribution[g] || 0;
                const percentage = students.length > 0 ? Math.round((count / students.length) * 100) : 0;
                return (
                  <div key={g} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">{g}</span>
                      <span className="text-slate-400">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* QUICK ACTION TILES */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Quick Actions
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveTab("Sessions")}
                className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-all group"
              >
                <BookOpen className="w-4 h-4 text-indigo-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-slate-200">+ New Session</p>
                <p className="text-[10px] text-slate-500">Curriculum</p>
              </button>
              <button
                onClick={() => setActiveTab("Questions")}
                className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-all group"
              >
                <HelpCircle className="w-4 h-4 text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-slate-200">+ New MCQ</p>
                <p className="text-[10px] text-slate-500">Question Bank</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
