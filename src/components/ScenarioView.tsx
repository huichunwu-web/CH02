import React, { useState } from 'react';
import { COURSE_SCENARIOS, ScenarioCase } from '../data/courseData';
import { soundEffects } from '../utils/sound';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Building2,
  FileCheck2,
  ArrowRight,
  ShieldAlert,
  Award,
  ChevronRight,
  Check,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface ScenarioViewProps {
  soundEnabled: boolean;
  completedScenarios: string[];
  onPassScenario: (scenarioId: string) => void;
}

export const ScenarioView: React.FC<ScenarioViewProps> = ({
  soundEnabled,
  completedScenarios,
  onPassScenario,
}) => {
  const [activeCaseIdx, setActiveCaseIdx] = useState<number>(0);
  const [selectedViolations, setSelectedViolations] = useState<Record<string, string[]>>({});
  const [selectedSolution, setSelectedSolution] = useState<Record<string, string>>({});
  const [showSolutionFeedback, setShowSolutionFeedback] = useState<Record<string, boolean>>({});

  const currentCase: ScenarioCase = COURSE_SCENARIOS[activeCaseIdx];
  const userCheckedViolations = selectedViolations[currentCase.id] || [];
  const chosenSolId = selectedSolution[currentCase.id];
  const isFeedbackOpen = showSolutionFeedback[currentCase.id] || completedScenarios.includes(currentCase.id);

  // Toggle violation check
  const handleToggleViolation = (vId: string) => {
    soundEffects.playFlip(soundEnabled);
    const current = selectedViolations[currentCase.id] || [];
    const updated = current.includes(vId)
      ? current.filter((id) => id !== vId)
      : [...current, vId];

    setSelectedViolations((prev) => ({
      ...prev,
      [currentCase.id]: updated,
    }));
  };

  // Choose solution
  const handleChooseSolution = (solId: string) => {
    soundEffects.playFlip(soundEnabled);
    setSelectedSolution((prev) => ({
      ...prev,
      [currentCase.id]: solId,
    }));
  };

  // Submit case resolution
  const handleSubmitCase = () => {
    const chosen = currentCase.solutionOptions.find((s) => s.id === chosenSolId);
    if (!chosen) return;

    setShowSolutionFeedback((prev) => ({
      ...prev,
      [currentCase.id]: true,
    }));

    if (chosen.isOptimal) {
      soundEffects.playCorrect(soundEnabled);
      onPassScenario(currentCase.id);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    } else {
      soundEffects.playIncorrect(soundEnabled);
    }
  };

  const handleResetCurrentCase = () => {
    setSelectedViolations((prev) => ({ ...prev, [currentCase.id]: [] }));
    setSelectedSolution((prev) => ({ ...prev, [currentCase.id]: '' }));
    setShowSolutionFeedback((prev) => ({ ...prev, [currentCase.id]: false }));
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              餐飲現場實戰情境分析
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            取材自餐廳實際經營中常見之氣壓失衡、違章廚房、自助餐溫控與廁所動線缺失。化身專業衛生顧問，排查違規並做出正確決策！
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">通關進度</span>
            <span className="text-sm font-bold text-amber-700">
              {completedScenarios.length} / {COURSE_SCENARIOS.length} 個案例已破解
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {Math.round((completedScenarios.length / COURSE_SCENARIOS.length) * 100)}%
          </div>
        </div>
      </div>

      {/* Case Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {COURSE_SCENARIOS.map((sc, idx) => {
          const isPassed = completedScenarios.includes(sc.id);
          const isCurrent = activeCaseIdx === idx;
          return (
            <button
              key={sc.id}
              onClick={() => {
                soundEffects.playFlip(soundEnabled);
                setActiveCaseIdx(idx);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition whitespace-nowrap ${
                isCurrent
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isCurrent ? 'bg-amber-800 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {idx + 1}
              </span>
              <span>{sc.title.split('：')[1] || sc.title}</span>
              {isPassed && (
                <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrent ? 'text-amber-200' : 'text-emerald-600'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* ACTIVE CASE CONTAINER */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-8">
        {/* Case Banner */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-2xl p-6 border border-amber-200/80">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-amber-800 bg-amber-200/70 px-2.5 py-0.5 rounded-full">
              {currentCase.title.split('：')[0]} · 現場實況模擬
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              {currentCase.location}
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">
            {currentCase.title}
          </h3>

          <p className="text-xs md:text-sm text-slate-700 leading-relaxed mb-4">
            {currentCase.background}
          </p>

          <div className="p-3.5 rounded-xl bg-white/90 border border-amber-200 shadow-xs flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <p className="text-xs md:text-sm font-semibold text-amber-900 italic">
              {currentCase.highlightedQuote}
            </p>
          </div>
        </div>

        {/* STEP 1: VIOLATIONS INSPECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h4 className="text-base font-bold text-slate-900">
                現場勘查：請勾選該餐廳涉及的違規或隱患項目（可複選）
              </h4>
            </div>
            <span className="text-xs text-slate-400">點擊卡片進行排查標記</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentCase.inspectionViolations.map((item) => {
              const isChecked = userCheckedViolations.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => handleToggleViolation(item.id)}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3 ${
                    isChecked
                      ? 'border-amber-500 bg-amber-50/60 shadow-xs'
                      : 'border-slate-200 hover:border-amber-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center border transition shrink-0 ${
                      isChecked
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <span className="text-xs md:text-sm font-semibold text-slate-800 block">
                      {item.label}
                    </span>
                    {/* Hide explanation underneath options specifically for Case 1 */}
                    {isFeedbackOpen && currentCase.id !== 'case-1' && (
                      <span className={`text-[11px] mt-1 block ${
                        item.isActualViolation ? 'text-amber-800' : 'text-slate-500 italic'
                      }`}>
                        {item.isActualViolation ? `✅ 屬實違規：${item.reason}` : `ℹ️ 非本案違規項目：${item.reason}`}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 2: DECISION MAKING */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h4 className="text-base font-bold text-slate-900">
              顧問整改決策：{currentCase.challengeQuestion}
            </h4>
          </div>

          <div className="space-y-3">
            {currentCase.solutionOptions.map((opt) => {
              const isSelected = chosenSolId === opt.id;
              let style = 'border-slate-200 hover:border-amber-400 bg-white';

              if (isSelected) {
                style = 'border-amber-600 bg-amber-50 text-amber-950 font-medium ring-1 ring-amber-500';
              }

              if (isFeedbackOpen) {
                if (opt.isOptimal) {
                  style = 'border-emerald-500 bg-emerald-50/80 ring-1 ring-emerald-400';
                } else if (isSelected && !opt.isOptimal) {
                  style = 'border-rose-400 bg-rose-50/70';
                }
              }

              return (
                <div
                  key={opt.id}
                  onClick={() => handleChooseSolution(opt.id)}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer ${style}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs md:text-sm font-bold text-slate-900">
                      {opt.title}
                    </span>
                    {isSelected && !isFeedbackOpen && (
                      <span className="text-xs text-amber-700 font-bold">已選擇</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">{opt.description}</p>

                  {/* Immediate feedback if opened */}
                  {isFeedbackOpen && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-xs">
                      {opt.isOptimal ? (
                        <div className="text-emerald-800 font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>【最佳整改對策】：{opt.feedback}</span>
                        </div>
                      ) : (
                        <div className="text-rose-700 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-rose-500" />
                          <span>【不建議】：{opt.feedback}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button: Evaluate Case */}
        {!isFeedbackOpen ? (
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={handleSubmitCase}
              disabled={!chosenSolId}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                !chosenSolId
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-amber-600 text-white hover:bg-amber-700 shadow-sm'
              }`}
            >
              <span>送出顧問分析報告並評分</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* STEP 3: AUTHORITY SUMMARY & LEGAL EXPLANATION */
          <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h5 className="font-bold text-white text-sm md:text-base">
                  官方食品良好衛生規範 (GHP) 權威指導結語
                </h5>
              </div>
              <button
                onClick={handleResetCurrentCase}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
              >
                <RefreshCw className="w-3 h-3" />
                <span>重新分析此案</span>
              </button>
            </div>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
              {currentCase.correctRuleSummary}
            </p>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                已列入個人實務案例成果報告！
              </span>

              {activeCaseIdx < COURSE_SCENARIOS.length - 1 ? (
                <button
                  onClick={() => {
                    soundEffects.playFlip(soundEnabled);
                    setActiveCaseIdx(activeCaseIdx + 1);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-amber-500 text-white font-bold hover:bg-amber-600 transition flex items-center gap-1"
                >
                  <span>前往下個案例</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="text-amber-300 font-bold">
                  🎉 全數情境案例已研讀完成！
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
