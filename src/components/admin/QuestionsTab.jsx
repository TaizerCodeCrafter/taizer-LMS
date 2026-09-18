import React, { useState } from "react";
import {
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle2,
  Search,
  Filter,
  AlertCircle,
  Sparkles
} from "lucide-react";
import CandlestickQuestionModal from "./CandlestickQuestionModal";
import { PatternGraphic } from "../CandlestickPatternsShowcase";

const QuestionsTab = ({
  questions = {},
  selectedGrade,
  setSelectedGrade,
  availableGrades = [],
  onAddQuestion,
  onDeleteQuestion
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCandleModalOpen, setIsCandleModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    options: ["", "", "", ""],
    correctIndex: 0,
    category: "General"
  });

  const gradeQuestions = questions[selectedGrade] || [];
  const filteredQuestions = gradeQuestions.filter((q) =>
    q.text?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newQuestion.text.trim()) return;
    onAddQuestion(newQuestion);
    setNewQuestion({
      text: "",
      options: ["", "", "", ""],
      correctIndex: 0,
      category: "General"
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0e1424]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/80 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              MCQ Assessment Question Bank
            </h2>
            <p className="text-xs text-slate-400">
              Create and organize standardized multiple-choice questions by grade
            </p>
          </div>
        </div>

        {/* GRADE PICKER & ADD BUTTON */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800">
            <label className="text-xs font-bold text-slate-400">Grade:</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-transparent text-xs font-black text-purple-400 outline-none cursor-pointer"
            >
              {(availableGrades.length > 0
                ? availableGrades
                : ["Crypto Basic", "Order Flow"]
              ).map((g) => (
                <option key={g} value={g} className="bg-slate-900 text-slate-200">
                  {g}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setIsCandleModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Candle Question Library (37)</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative max-w-md bg-[#0e1424]/90 backdrop-blur-xl p-2 rounded-2xl border border-slate-800/80">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search question prompt..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-transparent text-xs font-medium text-white placeholder-slate-500 outline-none"
        />
      </div>

      {/* QUESTIONS GRID */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => (
          <div
            key={idx}
            className="bg-[#0e1424]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/80 shadow-xl space-y-4 relative group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-grow">
                <span className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  Q{idx + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">
                      {q.category || "General"}
                    </span>
                    <span className="text-[10px] font-bold text-purple-400">
                      {selectedGrade}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-relaxed">
                    {q.text}
                  </h4>
                  {q.candlestickType && (
                    <div className="w-24 h-16 bg-slate-950/80 rounded-xl border border-slate-800 p-1 flex items-center justify-center mt-2">
                      <PatternGraphic type={q.candlestickType} />
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => onDeleteQuestion(idx)}
                title="Delete Question"
                className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 flex items-center justify-center transition-all opacity-70 group-hover:opacity-100 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* CHOICES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {(q.options || []).map((opt, oIdx) => {
                const isCorrect = q.correctIndex === oIdx;
                return (
                  <div
                    key={oIdx}
                    className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2.5 border ${
                      isCorrect
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-bold"
                        : "bg-slate-900/60 border-slate-800/80 text-slate-400"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isCorrect
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="truncate">{opt}</span>
                    {isCorrect && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filteredQuestions.length === 0 && (
          <div className="py-20 text-center text-slate-500 bg-[#0e1424]/90 rounded-3xl border border-slate-800/80">
            <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="font-bold text-base text-slate-300">
              No questions found for {selectedGrade}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Add multiple choice questions to build assessment quizzes.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question</span>
            </button>
          </div>
        )}
      </div>

      {/* ADD QUESTION MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1424] border border-slate-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6 animate-scaleUp">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white">Add MCQ Question</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">
                  Question Text / Prompt *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter the assessment question..."
                  value={newQuestion.text}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, text: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-semibold text-white outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-400 block">
                  Options (Select radio button for the correct answer)
                </label>
                {newQuestion.options.map((opt, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-2 rounded-xl border ${
                      newQuestion.correctIndex === i
                        ? "bg-emerald-500/10 border-emerald-500/40"
                        : "bg-slate-900 border-slate-800"
                    }`}
                  >
                    <input
                      type="radio"
                      name="correctOptionRadio"
                      checked={newQuestion.correctIndex === i}
                      onChange={() =>
                        setNewQuestion({ ...newQuestion, correctIndex: i })
                      }
                      className="w-4 h-4 text-emerald-500"
                    />
                    <input
                      type="text"
                      required
                      placeholder={`Option ${i + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const updated = [...newQuestion.options];
                        updated[i] = e.target.value;
                        setNewQuestion({ ...newQuestion, options: updated });
                      }}
                      className="flex-grow bg-transparent text-xs font-medium text-white outline-none"
                    />
                    {newQuestion.correctIndex === i && (
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">
                        Correct
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* CANDLESTICK QUESTION GENERATOR MODAL */}
      <CandlestickQuestionModal
        isOpen={isCandleModalOpen}
        onClose={() => setIsCandleModalOpen(false)}
        onSelectPatternQuestion={(questionData) => {
          onAddQuestion({
            text: questionData.question,
            options: questionData.options,
            correctIndex: questionData.correctIndex,
            category: "Candlestick Patterns",
            candlestickType: questionData.candlestickType,
            explanation: questionData.explanation
          });
        }}
      />
    </div>
  );
};

export default QuestionsTab;
