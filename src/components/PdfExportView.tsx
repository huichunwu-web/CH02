import React, { useRef } from 'react';
import { COURSE_FLASHCARDS, COURSE_QUIZ_QUESTIONS, COURSE_SCENARIOS } from '../data/courseData';
import { QuizResultState } from './QuizView';
import {
  Printer,
  Download,
  Copy,
  Check,
  Award,
  IdCard,
  User,
  Calendar,
  BookOpen,
  FileCheck2,
  ShieldCheck,
  CheckCircle,
  XCircle,
  FileText
} from 'lucide-react';

interface PdfExportViewProps {
  studentId: string;
  studentName: string;
  masteredCards: string[];
  lastResult: QuizResultState | null;
  completedScenarios: string[];
}

export const PdfExportView: React.FC<PdfExportViewProps> = ({
  studentId,
  studentName,
  masteredCards,
  lastResult,
  completedScenarios,
}) => {
  const [copied, setCopied] = React.useState(false);
  const printContainerRef = useRef<HTMLDivElement>(null);

  const currentDate = new Date().toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const reportSerial = `GHP-${studentId.replace(/[^a-zA-Z0-9]/g, '') || 'STU'}-${Math.floor(
    100000 + Math.random() * 900000
  )}`;

  // Print to PDF
  const handlePrint = () => {
    window.print();
  };

  // Export as text/json report file
  const handleDownloadReport = () => {
    const reportData = {
      reportTitle: '一個好的餐廳 Chapter 2 學習評量與實務驗證報告',
      reportSerial,
      studentId,
      studentName,
      evaluationDate: currentDate,
      flashcardsMastery: {
        masteredCount: masteredCards.length,
        totalCards: COURSE_FLASHCARDS.length,
        masteryPercentage: Math.round((masteredCards.length / COURSE_FLASHCARDS.length) * 100),
      },
      quizPerformance: lastResult
        ? {
            score: lastResult.score,
            correctCount: lastResult.correctCount,
            totalQuestions: lastResult.totalQuestions,
            completedAt: lastResult.completedAt,
          }
        : '尚未進行模擬測驗',
      scenariosStatus: {
        completedCount: completedScenarios.length,
        totalScenarios: COURSE_SCENARIOS.length,
        completedList: completedScenarios,
      },
      standardBasis: [
        '食品良好衛生規範準則 (GHP) 第32條',
        '營業場所外場正壓與廚房負壓氣流平衡標準',
        '廚房空氣補足系統 (Air Make-Up System) 4大功能',
        '廁所四大防護原則與洗手警語規範',
      ],
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `學習成績報告_${studentId}_${studentName}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Copy textual verification code
  const handleCopyCode = () => {
    const code = `[餐飲衛生認證碼: ${reportSerial} | 學號: ${studentId} | 姓名: ${studentName} | 測驗成績: ${
      lastResult?.score ?? '未測驗'
    }分 | 字卡熟練: ${masteredCards.length}/${COURSE_FLASHCARDS.length} | 情境破解: ${
      completedScenarios.length
    }/${COURSE_SCENARIOS.length} | 日期: ${currentDate}]`;

    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Panel (Hidden in Print) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
              <Award className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              學習成果檢驗與 PDF 輸出
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            系統已自動彙整您的學號、姓名、字卡掌握進度、模擬測驗成績及情境決策紀錄，可直接點擊列印為高解析度 A4 PDF 報告。
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>列印 / 另存為 PDF</span>
          </button>

          <button
            onClick={handleDownloadReport}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>下載報告 JSON</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">已複製認證碼</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>複製認證碼</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* PRINTABLE PDF DOCUMENT CONTAINER */}
      <div
        ref={printContainerRef}
        className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/90 shadow-sm print:border-none print:shadow-none print:p-0 max-w-4xl mx-auto space-y-8"
      >
        {/* Certificate Header Banner */}
        <div className="border-b-2 border-amber-500 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center text-2xl font-bold shadow-xs">
                🍽️
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">
                  專業餐飲管理與食品衛生安全研習系列
                </span>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  《一個好的餐廳 Chapter 2》學習成就與評量報告
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  餐廳外場氣壓平衡 · 自助餐防塵溫控 · 廚房空氣補足與作業區隔 · 廁所衛生規範
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-400 font-mono">
              <div>流水驗證序號</div>
              <div className="font-bold text-slate-800 text-sm">{reportSerial}</div>
              <div className="text-[11px] text-slate-500 mt-1">{currentDate}</div>
            </div>
          </div>
        </div>

        {/* Student Profile Card in PDF */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-amber-50/50 p-5 rounded-2xl border border-amber-200/80">
          <div>
            <div className="text-[11px] text-amber-800 font-semibold uppercase flex items-center gap-1">
              <IdCard className="w-3.5 h-3.5" /> 學生學號
            </div>
            <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
              {studentId}
            </div>
          </div>

          <div>
            <div className="text-[11px] text-amber-800 font-semibold uppercase flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> 學生姓名
            </div>
            <div className="text-base font-bold text-slate-900 mt-0.5">
              {studentName}
            </div>
          </div>

          <div>
            <div className="text-[11px] text-amber-800 font-semibold uppercase flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> 評核日期
            </div>
            <div className="text-sm font-semibold text-slate-800 mt-0.5">
              {currentDate}
            </div>
          </div>

          <div>
            <div className="text-[11px] text-amber-800 font-semibold uppercase flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> 綜合能力評等
            </div>
            <div className="text-base font-extrabold text-amber-700 mt-0.5">
              {lastResult
                ? lastResult.score >= 90
                  ? 'A+ (精熟優良)'
                  : lastResult.score >= 80
                  ? 'A (熟練合格)'
                  : lastResult.score >= 60
                  ? 'B (基礎達標)'
                  : 'C (待加強)'
                : '進行中'}
            </div>
          </div>
        </div>

        {/* THREE CORE METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Metric 1: Flashcards */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold flex items-center gap-1 text-slate-700">
                <BookOpen className="w-4 h-4 text-amber-600" /> 重點字卡掌握度
              </span>
              <span className="font-bold text-slate-800">
                {masteredCards.length} / {COURSE_FLASHCARDS.length}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-amber-500 h-full rounded-full transition-all"
                style={{
                  width: `${(masteredCards.length / COURSE_FLASHCARDS.length) * 100}%`,
                }}
              />
            </div>
            <div className="text-[11px] text-slate-500">
              已掌握 {Math.round((masteredCards.length / COURSE_FLASHCARDS.length) * 100)}% 核心名詞與法規概念
            </div>
          </div>

          {/* Metric 2: Quiz Score */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold flex items-center gap-1 text-slate-700">
                <FileCheck2 className="w-4 h-4 text-orange-600" /> 模擬測驗成績
              </span>
              <span className="font-bold text-slate-800">
                {lastResult ? `${lastResult.score} 分` : '尚未作答'}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-orange-500 h-full rounded-full transition-all"
                style={{ width: `${lastResult ? lastResult.score : 0}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500">
              {lastResult
                ? `共 ${lastResult.totalQuestions} 題中答對 ${lastResult.correctCount} 題`
                : '請至「模擬測驗」區作答以獲取成績'}
            </div>
          </div>

          {/* Metric 3: Scenarios Passed */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold flex items-center gap-1 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> 實戰情境排查
              </span>
              <span className="font-bold text-slate-800">
                {completedScenarios.length} / {COURSE_SCENARIOS.length}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{
                  width: `${(completedScenarios.length / COURSE_SCENARIOS.length) * 100}%`,
                }}
              />
            </div>
            <div className="text-[11px] text-slate-500">
              已完成 {completedScenarios.length} 個餐飲實務工程案例整改決策
            </div>
          </div>
        </div>

        {/* SECTION 1: MASTERED KNOWLEDGE HIGHLIGHTS */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 border-l-4 border-amber-600 pl-2.5">
            一、核心法規與衛生標準精熟清單
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {COURSE_FLASHCARDS.map((card) => {
              const isMastered = masteredCards.includes(card.id);
              return (
                <div
                  key={card.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                    isMastered
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                      : 'bg-white border-slate-200 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isMastered ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"></span>
                    )}
                    <span className="font-medium truncate">{card.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {card.categoryLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: DETAILED QUIZ RESULTS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 border-l-4 border-amber-600 pl-2.5">
              二、模擬測驗作答明細與錯題檢核
            </h3>
            {lastResult && (
              <span className="text-xs text-slate-500">
                測驗完成時間：{lastResult.completedAt}
              </span>
            )}
          </div>

          {lastResult ? (
            <div className="space-y-2.5">
              {COURSE_QUIZ_QUESTIONS.map((q, idx) => {
                const userAnsRecord = lastResult.answers.find((a) => a.questionId === q.id);
                const isCorrect = userAnsRecord?.isCorrect ?? false;
                const userSelection = userAnsRecord?.userAnswers ?? [];

                return (
                  <div
                    key={q.id}
                    className={`p-3 rounded-xl border text-xs leading-relaxed ${
                      isCorrect
                        ? 'bg-slate-50/70 border-slate-200'
                        : 'bg-rose-50/40 border-rose-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        {isCorrect ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        )}
                        <span>
                          {idx + 1}. {q.question}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {q.slideRef}
                      </span>
                    </div>

                    <div className="pl-5 space-y-1 text-slate-600">
                      <div>
                        <strong>學生答案：</strong>
                        {userSelection.length > 0
                          ? userSelection.map((a) => `[${String.fromCharCode(65 + a)}] ${q.options[a]}`).join(', ')
                          : '未作答'}
                        {' · '}
                        <strong>正確解答：</strong>
                        {q.correctAnswers.map((a) => `[${String.fromCharCode(65 + a)}] ${q.options[a]}`).join(', ')}
                      </div>
                      {!isCorrect && (
                        <div className="text-amber-900 bg-amber-50/70 p-2 rounded-lg border border-amber-200/60 mt-1">
                          <strong>解析：</strong> {q.explanation}（{q.lawBasis}）
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center border border-dashed border-slate-300 rounded-2xl text-slate-400 text-xs">
              目前尚未完成模擬測驗，可切換至「模擬測驗」分頁作答後自動帶入完整題型評核。
            </div>
          )}
        </div>

        {/* SECTION 3: SCENARIO DECISION AUDIT */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 border-l-4 border-amber-600 pl-2.5">
            三、餐飲實務工程情境決策歷程
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {COURSE_SCENARIOS.map((sc, idx) => {
              const isPassed = completedScenarios.includes(sc.id);
              return (
                <div
                  key={sc.id}
                  className={`p-3.5 rounded-xl border ${
                    isPassed
                      ? 'bg-emerald-50/30 border-emerald-200'
                      : 'bg-slate-50/50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">
                      案例 {idx + 1}：{sc.title.split('：')[1] || sc.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isPassed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isPassed ? '✅ 決策合格' : '未完成'}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] line-clamp-2">
                    {sc.correctRuleSummary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* TEACHER SIGNATURE & VERIFICATION FOOTER */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-3 gap-6 text-xs text-slate-600">
          <div>
            <div className="text-[11px] text-slate-400 mb-6">指導教師 / 主任評閱簽章：</div>
            <div className="border-b border-slate-400 pb-1 w-40 text-slate-400">
              （簽名 / 蓋章）
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-400 mb-6">綜合考核評語：</div>
            <div className="border-b border-slate-400 pb-1 text-slate-700">
              准予結業認證，熟稔餐飲衛生與空間法規。
            </div>
          </div>

          <div className="col-span-2 md:col-span-1 text-right">
            <div className="text-[11px] text-slate-400 mb-1">系統防偽認證章戳</div>
            <div className="inline-block border-2 border-amber-600 text-amber-700 font-bold px-3 py-1.5 rounded-lg rotate-[-3deg] text-[11px]">
              GHP VERIFIED
              <br />
              考評核准
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
