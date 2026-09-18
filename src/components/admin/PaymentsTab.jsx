import React, { useState } from "react";
import {
  CreditCard,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Filter,
  Check,
  X,
  AlertCircle
} from "lucide-react";

const PaymentsTab = ({
  students = [],
  onPaymentStatus,
  onDeleteStudent,
  setViewingPayment
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [gradeFilter, setGradeFilter] = useState("All");

  const pendingCount = students.filter((s) => s.paymentStatus === "Pending" || s.paymentStatus === "Uploaded").length;
  const approvedCount = students.filter((s) => s.paymentStatus === "Approved").length;
  const rejectedCount = students.filter((s) => s.paymentStatus === "Rejected").length;

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || 
      (statusFilter === "Pending" ? (s.paymentStatus === "Pending" || s.paymentStatus === "Uploaded") : s.paymentStatus === statusFilter);
    const matchesGrade =
      gradeFilter === "All" || s.grade === gradeFilter;
    return matchesSearch && matchesStatus && matchesGrade;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HUB HEADER & METRIC SUMMARY */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0e1424]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/80 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Payment Verification Hub
            </h2>
            <p className="text-xs text-slate-400">
              Review deposit slips, grant portal access, or manage transaction disputes
            </p>
          </div>
        </div>

        {/* SUMMARY PILLS */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-amber-400">
              {pendingCount} Pending
            </span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-bold text-emerald-400">
              {approvedCount} Approved
            </span>
          </div>
          {rejectedCount > 0 && (
            <div className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="text-xs font-bold text-rose-400">
                {rejectedCount} Rejected
              </span>
            </div>
          )}
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0e1424]/90 backdrop-blur-xl p-4 rounded-2xl border border-slate-800/80">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-medium text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            {["All", "Pending", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === status
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Grade Filter */}
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 outline-none focus:border-indigo-500"
          >
            <option value="All">All Grades</option>
            <option value="Grade 12">Grade 12</option>
            <option value="Grade 13">Grade 13</option>
            <option value="Grade 11">Grade 11</option>
            <option value="Grade 10">Grade 10</option>
          </select>
        </div>
      </div>

      {/* PAYMENTS TABLE */}
      <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900/90 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Student Details</th>
                <th className="px-6 py-4">Grade & Subject</th>
                <th className="px-6 py-4">Payment Slip</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Registered Date</th>
                <th className="px-6 py-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                  {/* Student */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
                        {s.name?.charAt(0) || "S"}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-slate-100 truncate">{s.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{s.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Grade */}
                  <td className="px-6 py-4">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold text-[11px]">
                      {s.grade || "Grade 12"}
                    </span>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                      {s.subject || "Economics"}
                    </p>
                  </td>

                  {/* Payment Slip Button */}
                  <td className="px-6 py-4">
                    {s.receiptUrl || s.receiptImage ? (
                      <button
                        onClick={() => setViewingPayment(s)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-semibold text-[11px] transition-all"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Inspect Slip</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">
                        No Slip Attached
                      </span>
                    )}
                  </td>

                  {/* Status Pill */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        s.paymentStatus === "Approved"
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                          : s.paymentStatus === "Rejected"
                          ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
                          : "bg-amber-500/15 border-amber-500/30 text-amber-400 animate-pulse"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          s.paymentStatus === "Approved"
                            ? "bg-emerald-400"
                            : s.paymentStatus === "Rejected"
                            ? "bg-rose-400"
                            : "bg-amber-400"
                        }`}
                      />
                      {s.paymentStatus || "Pending"}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-slate-400 text-[11px]">
                    {s.joined || "N/A"}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {s.paymentStatus === "Pending" || s.paymentStatus === "Uploaded" ? (
                        <>
                          <button
                            onClick={() => onPaymentStatus(s.id, "Approved")}
                            title="Approve Payment"
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => onPaymentStatus(s.id, "Rejected")}
                            title="Reject Payment"
                            className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 font-bold text-xs flex items-center gap-1 transition-all active:scale-95"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setViewingPayment(s)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-semibold text-xs transition-all"
                          >
                            Manage
                          </button>
                          <button
                            onClick={() => onDeleteStudent(s.id)}
                            title="Delete Student"
                            className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 flex items-center justify-center transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="font-bold text-sm text-slate-400">
                      No payment records found
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Try adjusting your search criteria or filter tags.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentsTab;
