import React, { useState } from 'react';
import { User, IdCard, Volume2, VolumeX, Award, BookOpen, FileCheck, CheckCircle2, Edit3 } from 'lucide-react';

interface HeaderProps {
  studentId: string;
  studentName: string;
  onUpdateStudent: (id: string, name: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  activeTab: 'cards' | 'quiz' | 'scenario' | 'report';
  setActiveTab: (tab: 'cards' | 'quiz' | 'scenario' | 'report') => void;
  masteredCount: number;
  totalCards: number;
  bestScore: number | null;
  scenariosPassedCount: number;
  totalScenarios: number;
}

export const Header: React.FC<HeaderProps> = ({
  studentId,
  studentName,
  onUpdateStudent,
  soundEnabled,
  onToggleSound,
  activeTab,
  setActiveTab,
  masteredCount,
  totalCards,
  bestScore,
  scenariosPassedCount,
  totalScenarios,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempId, setTempId] = useState(studentId);
  const [tempName, setTempName] = useState(studentName);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempId.trim() && tempName.trim()) {
      onUpdateStudent(tempId.trim(), tempName.trim());
      setIsEditing(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/60 shadow-xs print:hidden">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400/30 text-amber-100 font-semibold px-2 py-0.5 rounded-full text-xs border border-amber-300/30">
              Chapter 2 專業餐飲規劃
            </span>
            <span className="font-medium tracking-wide">
              一個好的餐廳：外場與廚房基本要求互動學習系統
            </span>
          </div>

          {/* Student Profile Quick View */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-black/20 hover:bg-black/30 transition px-2.5 py-1 rounded-md">
              <IdCard className="w-3.5 h-3.5 text-amber-200" />
              <span className="text-amber-100 font-mono text-xs">{studentId}</span>
              <span className="text-white font-medium">{studentName}</span>
              <button
                onClick={() => {
                  setTempId(studentId);
                  setTempName(studentName);
                  setIsEditing(true);
                }}
                className="ml-1 text-amber-200 hover:text-white p-0.5 rounded transition"
                title="修改學號與姓名"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                soundEnabled
                  ? 'bg-amber-400 text-amber-950 shadow-xs hover:bg-amber-300'
                  : 'bg-black/20 text-amber-200 hover:bg-black/30'
              }`}
              title={soundEnabled ? '音效已開啟（答題提示音）' : '音效已靜音'}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  <span>音效開</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>靜音中</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Logo & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-sm font-bold text-lg">
            🍽️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
                好餐廳餐飲空間與衛生學習系統
              </h1>
              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full font-semibold border border-orange-200">
                GHP 準則精要
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              正負壓空調氣流 · 60°C溫控防塵 · 廚房補氣隔熱 · 廁所動線防污
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('cards')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'cards'
                ? 'bg-amber-500 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>學習字卡</span>
            <span className={`text-xs px-1.5 py-0.2 rounded-full ${
              activeTab === 'cards' ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {masteredCount}/{totalCards}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'quiz'
                ? 'bg-amber-500 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>模擬測驗</span>
            {bestScore !== null && (
              <span className={`text-xs px-1.5 py-0.2 rounded-full ${
                activeTab === 'quiz' ? 'bg-amber-600 text-white' : 'bg-emerald-100 text-emerald-800 font-bold'
              }`}>
                {bestScore}分
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('scenario')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'scenario'
                ? 'bg-amber-500 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>情境分析</span>
            <span className={`text-xs px-1.5 py-0.2 rounded-full ${
              activeTab === 'scenario' ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {scenariosPassedCount}/{totalScenarios}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'report'
                ? 'bg-amber-500 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>PDF 輸出與證書</span>
          </button>
        </nav>
      </div>

      {/* Student Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">設定學生身份資訊</h3>
                <p className="text-xs text-slate-500">此資訊將列印於正式測驗成績單與 PDF 歷程報告中</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  學生學號 (Student ID) *
                </label>
                <div className="relative">
                  <IdCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={tempId}
                    onChange={(e) => setTempId(e.target.value)}
                    placeholder="例如：B11234056"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  學生姓名 (Student Name) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="例如：王小明"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition"
                >
                  確認更新
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
