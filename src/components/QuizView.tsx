import React, { useState } from 'react';
import { COURSE_QUIZ_QUESTIONS, QuizQuestion } from '../data/courseData';
import { soundEffects } from '../utils/sound';
import confetti from 'canvas-confetti';
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Award,
  AlertCircle,
  Check,
  Bookmark,
  Volume2,
  FileText
} from 'lucide-react';

export interface QuizResultState {
  score: number;
  totalQuestions: number;
  correctCount: number;
  completedAt: string;
  answers: {
    questionId: string;
    userAnswers: number[];
    isCorrect: boolean;
  }[];
}

interface QuizViewProps {
  soundEnabled: boolean;
  studentName: string;
  studentId: string;
  onSaveResult: (result: QuizResultState) => void;
  lastResult: QuizResultState | null;
  onNavigateToReport: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  soundEnabled,
  studentName,
  studentId,
  onSaveResult,
  lastResult,
  onNavigateToReport,
}) => {
  const [examMode, setExamMode] = useState<'practice' | 'exam'>('practice');
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  // Store user selections: questionId -> array of selected option indexes
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number[]>>({});
  // Store submission status per question in practice mode
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});
  // Exam finished state
  const [isExamCompleted, setIsExamCompleted] = useState<boolean>(false);
  const [examScore, setExamScore] = useState<number>(0);

  const questions = COURSE_QUIZ_QUESTIONS;
  const currentQ: QuizQuestion = questions[currentIdx];
  const userSelected = selectedAnswers[currentQ.id] || [];
  const isCurrentSubmitted = submittedQuestions[currentQ.id] || isExamCompleted;

  // Toggle option selection
  const handleSelectOption = (optIdx: number) => {
    if (isCurrentSubmitted && examMode === 'practice') return;
    if (isExamCompleted) return;

    soundEffects.playFlip(soundEnabled);

    if (currentQ.type === 'single' || currentQ.type === 'boolean') {
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQ.id]: [optIdx],
      }));
    } else {
      // multiple choice
      const current = selectedAnswers[currentQ.id] || [];
      const updated = current.includes(optIdx)
        ? current.filter((i) => i !== optIdx)
        : [...current, optIdx].sort((a, b) => a - b);
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQ.id]: updated,
      }));
    }
  };

  // Submit in practice mode
  const handleSubmitPractice = () => {
    if (userSelected.length === 0) return;

    const isCorrect =
      userSelected.length === currentQ.correctAnswers.length &&
      userSelected.every((val) => currentQ.correctAnswers.includes(val));

    if (isCorrect) {
      soundEffects.playCorrect(soundEnabled);
    } else {
      soundEffects.playIncorrect(soundEnabled);
    }

    setSubmittedQuestions((prev) => ({
      ...prev,
      [currentQ.id]: true,
    }));
  };

  // Complete exam
  const handleFinishExam = () => {
    let correctCount = 0;
    const answersRecord = questions.map((q) => {
      const userAns = selectedAnswers[q.id] || [];
      const isCorrect =
        userAns.length === q.correctAnswers.length &&
        userAns.every((val) => q.correctAnswers.includes(val));
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        userAnswers: userAns,
        isCorrect,
      };
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    setExamScore(finalScore);
    setIsExamCompleted(true);

    if (finalScore >= 80) {
      soundEffects.playFanfare(soundEnabled);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else if (finalScore >= 60) {
      soundEffects.playCorrect(soundEnabled);
    } else {
      soundEffects.playIncorrect(soundEnabled);
    }

    const resultState: QuizResultState = {
      score: finalScore,
      totalQuestions: questions.length,
      correctCount,
      completedAt: new Date().toLocaleString('zh-TW', { hour12: false }),
      answers: answersRecord,
    };

    onSaveResult(resultState);
  };

  // Reset/Restart Quiz
  const handleRestart = () => {
    setSelectedAnswers({});
    setSubmittedQuestions({});
    setIsExamCompleted(false);
    setCurrentIdx(0);
    setExamScore(0);
  };

  // Check if answer for current question is correct
  const isQuestionCorrect = (qId: string) => {
    const q = questions.find((item) => item.id === qId);
    if (!q) return false;
    const userAns = selectedAnswers[qId] || [];
    return (
      userAns.length === q.correctAnswers.length &&
      userAns.every((val) => q.correctAnswers.includes(val))
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Controller Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-orange-100 text-orange-700 rounded-lg">
              <FileCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Chapter 2 課堂模擬測驗
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            共 {questions.length} 題，嚴密覆蓋外場正負壓、空調通風、GHP 第32條防塵溫控、廚房補氣與廁所規範。答題時有音效反饋！
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
            <button
              onClick={() => {
                setExamMode('practice');
                setIsExamCompleted(false);
              }}
              className={`px-3 py-1.5 rounded-lg transition ${
                examMode === 'practice'
                  ? 'bg-white shadow-xs text-amber-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              即時解析模式
            </button>
            <button
              onClick={() => {
                setExamMode('exam');
              }}
              className={`px-3 py-1.5 rounded-lg transition ${
                examMode === 'exam'
                  ? 'bg-white shadow-xs text-amber-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              模擬考計分模式
            </button>
          </div>

          <button
            onClick={handleRestart}
            className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            title="重新作答"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* COMPLETED EXAM SUMMARY MODAL / BANNER */}
      {isExamCompleted && (
        <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 md:p-8 text-white shadow-lg animate-in zoom-in-95 duration-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex flex-col items-center justify-center border border-white/30 shadow-inner">
                <span className="text-3xl font-black">{examScore}</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-amber-100">
                  測驗總分
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-white/25 px-2.5 py-0.5 rounded-full font-bold">
                    {studentId} · {studentName}
                  </span>
                  <span className="text-xs font-semibold text-amber-100">
                    {examScore >= 80 ? '🌟 成績優異' : examScore >= 60 ? '👍 表現及格' : '⚠️ 需加強複習'}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mt-1">
                  模擬測驗作答完畢！
                </h3>
                <p className="text-xs text-amber-100 mt-1 max-w-lg">
                  答對題數：{Object.values(questions).filter((q) => isQuestionCorrect(q.id)).length} / {questions.length} 題
                  （答對率 {Math.round((Object.values(questions).filter((q) => isQuestionCorrect(q.id)).length / questions.length) * 100)}%）。
                  可點擊下方題號查看錯題解析，或前往 PDF 頁面輸出正式成績單。
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onNavigateToReport}
                className="px-5 py-2.5 bg-white text-amber-900 rounded-xl font-bold text-xs shadow-md hover:bg-amber-50 transition flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-amber-600" />
                <span>匯出 PDF 報告</span>
              </button>
              <button
                onClick={handleRestart}
                className="px-4 py-2.5 bg-black/20 hover:bg-black/30 rounded-xl text-xs font-semibold text-white transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>重新測驗</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUESTION NAVIGATOR PILLS */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
          <span className="font-semibold text-slate-700">題目導覽列</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> 答對
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> 答錯
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> 已選
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span> 未答
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => {
            const hasAns = (selectedAnswers[q.id] || []).length > 0;
            const isSub = submittedQuestions[q.id] || isExamCompleted;
            const isCorrect = isQuestionCorrect(q.id);
            const isCurrent = currentIdx === idx;

            let badgeColor = 'bg-slate-100 text-slate-600 border-slate-200';
            if (isSub) {
              if (isCorrect) badgeColor = 'bg-emerald-500 text-white border-emerald-600';
              else badgeColor = 'bg-rose-500 text-white border-rose-600';
            } else if (hasAns) {
              badgeColor = 'bg-amber-400 text-amber-950 border-amber-500 font-bold';
            }

            return (
              <button
                key={q.id}
                onClick={() => {
                  soundEffects.playFlip(soundEnabled);
                  setCurrentIdx(idx);
                }}
                className={`w-8 h-8 rounded-lg text-xs font-semibold border transition flex items-center justify-center ${badgeColor} ${
                  isCurrent ? 'ring-2 ring-amber-600 ring-offset-2 scale-105' : 'hover:opacity-80'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN QUESTION CARD */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
        {/* Header: Question Type & Category */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-200">
              第 {currentIdx + 1} 題 · {currentQ.category}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              {currentQ.type === 'single'
                ? '單選題'
                : currentQ.type === 'multiple'
                ? '多選題'
                : '是非判斷題'}
            </span>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            教材參照：{currentQ.slideRef}
          </span>
        </div>

        {/* Question Text */}
        <div className="text-base md:text-lg font-bold text-slate-900 leading-relaxed">
          {currentQ.question}
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {currentQ.options.map((optText, optIdx) => {
            const isSelected = userSelected.includes(optIdx);
            const isTargetCorrect = currentQ.correctAnswers.includes(optIdx);

            let optionStyle =
              'border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 text-slate-700 bg-white';

            if (isSelected) {
              optionStyle = 'border-amber-500 bg-amber-50/70 text-amber-900 font-medium';
            }

            // If submitted or exam completed, show colored states
            if (isCurrentSubmitted) {
              if (isTargetCorrect) {
                optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-400';
              } else if (isSelected && !isTargetCorrect) {
                optionStyle = 'border-rose-400 bg-rose-50 text-rose-900';
              } else {
                optionStyle = 'border-slate-200 opacity-60 text-slate-500';
              }
            }

            return (
              <div
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between gap-3 ${optionStyle}`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold border transition ${
                      currentQ.type === 'multiple' ? 'rounded-md' : 'rounded-full'
                    } ${
                      isSelected
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'border-slate-300 text-slate-500 bg-white'
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </div>
                  <span className="text-sm md:text-base leading-snug">{optText}</span>
                </div>

                {isCurrentSubmitted && (
                  <div className="shrink-0">
                    {isTargetCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-rose-500 fill-rose-100" />
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button: Submit in Practice Mode */}
        {examMode === 'practice' && !isCurrentSubmitted && (
          <div className="flex items-center justify-end pt-2">
            <button
              onClick={handleSubmitPractice}
              disabled={userSelected.length === 0}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                userSelected.length === 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-amber-600 text-white hover:bg-amber-700 shadow-xs'
              }`}
            >
              <span>送出並核對解答</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* FEEDBACK EXPLANATION PANEL */}
        {isCurrentSubmitted && (
          <div
            className={`p-5 rounded-2xl border animate-in fade-in slide-in-from-top-2 duration-200 ${
              isQuestionCorrect(currentQ.id)
                ? 'bg-emerald-50/70 border-emerald-200'
                : 'bg-rose-50/60 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {isQuestionCorrect(currentQ.id) ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-800">
                    回答正確！恭喜掌握此核心重點！
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  <span className="text-sm font-bold text-rose-800">
                    回答錯誤。正確解答為：
                    {currentQ.correctAnswers.map((a) => String.fromCharCode(65 + a)).join(', ')}
                  </span>
                </>
              )}
            </div>

            <p className="text-xs md:text-sm text-slate-700 leading-relaxed mb-3">
              {currentQ.explanation}
            </p>

            {currentQ.lawBasis && (
              <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/60 text-xs text-slate-600">
                <strong className="text-amber-800">教材法規原點：</strong> {currentQ.lawBasis}
              </div>
            )}
          </div>
        )}

        {/* Bottom Pagination Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={() => {
              if (currentIdx > 0) {
                soundEffects.playFlip(soundEnabled);
                setCurrentIdx(currentIdx - 1);
              }
            }}
            disabled={currentIdx === 0}
            className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold border transition ${
              currentIdx === 0
                ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>上一題</span>
          </button>

          <span className="text-xs text-slate-400 font-mono">
            {currentIdx + 1} / {questions.length}
          </span>

          {currentIdx < questions.length - 1 ? (
            <button
              onClick={() => {
                soundEffects.playFlip(soundEnabled);
                setCurrentIdx(currentIdx + 1);
              }}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 transition shadow-xs"
            >
              <span>下一題</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinishExam}
              className="flex items-center gap-1 px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-md"
            >
              <Award className="w-4 h-4" />
              <span>結算模擬考成績</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
