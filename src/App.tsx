import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FlashcardsView } from './components/FlashcardsView';
import { QuizView, QuizResultState } from './components/QuizView';
import { ScenarioView } from './components/ScenarioView';
import { PdfExportView } from './components/PdfExportView';
import { COURSE_FLASHCARDS, COURSE_SCENARIOS } from './data/courseData';
import {
  BookOpen,
  FileCheck,
  CheckCircle2,
  Award,
  Sparkles,
  ArrowRight,
  Flame,
  Wind,
  Shield,
  Layers
} from 'lucide-react';

export default function App() {
  // Student identification state
  const [studentId, setStudentId] = useState<string>(() => {
    return localStorage.getItem('ghp_student_id') || 'STU113082';
  });
  const [studentName, setStudentName] = useState<string>(() => {
    return localStorage.getItem('ghp_student_name') || '林奕廷';
  });

  // Sound effects state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('ghp_sound_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  // Flashcards mastered ids
  const [masteredCards, setMasteredCards] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ghp_mastered_cards');
      return saved ? JSON.parse(saved) : ['fc-1', 'fc-2', 'fc-6'];
    } catch {
      return ['fc-1', 'fc-2', 'fc-6'];
    }
  });

  // Quiz results state
  const [quizResult, setQuizResult] = useState<QuizResultState | null>(() => {
    try {
      const saved = localStorage.getItem('ghp_quiz_result');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Completed scenario ids
  const [completedScenarios, setCompletedScenarios] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ghp_scenarios_passed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'cards' | 'quiz' | 'scenario' | 'report'>('cards');

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('ghp_student_id', studentId);
  }, [studentId]);

  useEffect(() => {
    localStorage.setItem('ghp_student_name', studentName);
  }, [studentName]);

  useEffect(() => {
    localStorage.setItem('ghp_sound_enabled', String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('ghp_mastered_cards', JSON.stringify(masteredCards));
  }, [masteredCards]);

  useEffect(() => {
    if (quizResult) {
      localStorage.setItem('ghp_quiz_result', JSON.stringify(quizResult));
    }
  }, [quizResult]);

  useEffect(() => {
    localStorage.setItem('ghp_scenarios_passed', JSON.stringify(completedScenarios));
  }, [completedScenarios]);

  const handleUpdateStudent = (newId: string, newName: string) => {
    setStudentId(newId);
    setStudentName(newName);
  };

  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const handleToggleMasteredCard = (cardId: string) => {
    setMasteredCards((prev) =>
      prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]
    );
  };

  const handleSaveQuizResult = (result: QuizResultState) => {
    setQuizResult(result);
  };

  const handlePassScenario = (scenarioId: string) => {
    if (!completedScenarios.includes(scenarioId)) {
      setCompletedScenarios((prev) => [...prev, scenarioId]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-900">
      {/* Top Header Navigation */}
      <Header
        studentId={studentId}
        studentName={studentName}
        onUpdateStudent={handleUpdateStudent}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        masteredCount={masteredCards.length}
        totalCards={COURSE_FLASHCARDS.length}
        bestScore={quizResult?.score ?? null}
        scenariosPassedCount={completedScenarios.length}
        totalScenarios={COURSE_SCENARIOS.length}
      />

      {/* Main Content Area */}
      <main className="grow max-w-7xl w-full mx-auto px-4 py-6 md:py-8 space-y-6">
        {/* Course Banner Hero (Hidden on PDF page or when printing) */}
        {activeTab !== 'report' && (
          <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 md:p-8 text-white shadow-md print:hidden">
            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 text-white px-2.5 py-0.5 rounded-full border border-white/25">
                  教材精編 · 華立圖書 Chapter 2
                </span>
                <span className="text-xs text-amber-200">
                  學生：{studentName}（{studentId}）
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                一個好的餐廳：外場與廚房基本要求
              </h2>

              <p className="text-xs md:text-sm text-amber-100 leading-relaxed max-w-2xl">
                全面掌握外場正壓調控、廚房負壓排煙、夏季防蚊蠅灰塵、破除「聞香下馬」迷思、GHP 第32條防塵溫控（熟食熱藏60°C以上、室溫限2小時）、防範A型肝炎、拒絕違建廚房、空氣補足系統四大機能與廁所防污動線。
              </p>

              {/* Core Pillars Quick Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                <div className="bg-black/20 backdrop-blur-xs p-2.5 rounded-xl border border-white/10 flex items-center gap-2">
                  <Wind className="w-4 h-4 text-amber-300 shrink-0" />
                  <span className="font-medium text-slate-100">外場正壓 · 廚房負壓</span>
                </div>
                <div className="bg-black/20 backdrop-blur-xs p-2.5 rounded-xl border border-white/10 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span className="font-medium text-slate-100">GHP防塵 · 60°C熱藏</span>
                </div>
                <div className="bg-black/20 backdrop-blur-xs p-2.5 rounded-xl border border-white/10 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-300 shrink-0" />
                  <span className="font-medium text-slate-100">補足空氣 · 隔熱降溫</span>
                </div>
                <div className="bg-black/20 backdrop-blur-xs p-2.5 rounded-xl border border-white/10 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-300 shrink-0" />
                  <span className="font-medium text-slate-100">廁所防污 · 緩衝氣控</span>
                </div>
              </div>
            </div>

            {/* Background Decorative Graphic */}
            <div className="absolute right-0 bottom-0 top-0 w-80 opacity-15 pointer-events-none flex items-center justify-center">
              <span className="text-[160px] font-black select-none">CH2</span>
            </div>
          </div>
        )}

        {/* Dynamic Tab Views */}
        {activeTab === 'cards' && (
          <FlashcardsView
            soundEnabled={soundEnabled}
            masteredCards={masteredCards}
            onToggleMastered={handleToggleMasteredCard}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizView
            soundEnabled={soundEnabled}
            studentName={studentName}
            studentId={studentId}
            onSaveResult={handleSaveQuizResult}
            lastResult={quizResult}
            onNavigateToReport={() => setActiveTab('report')}
          />
        )}

        {activeTab === 'scenario' && (
          <ScenarioView
            soundEnabled={soundEnabled}
            completedScenarios={completedScenarios}
            onPassScenario={handlePassScenario}
          />
        )}

        {activeTab === 'report' && (
          <PdfExportView
            studentId={studentId}
            studentName={studentName}
            masteredCards={masteredCards}
            lastResult={quizResult}
            completedScenarios={completedScenarios}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-400 print:hidden mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">
              《一個好的餐廳 Chapter 2》餐飲管理數位互動教材
            </span>
            <span>· 依據《食品良好衛生規範準則 (GHP)》與餐飲建築通風標準設計</span>
          </div>

          <div className="flex items-center gap-3">
            <span>當前學號：<strong className="text-slate-700 font-mono">{studentId}</strong></span>
            <span>學生：<strong className="text-slate-700">{studentName}</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
