import React, { useState } from 'react';
import { COURSE_FLASHCARDS, Flashcard } from '../data/courseData';
import { soundEffects } from '../utils/sound';
import {
  RotateCw,
  CheckCircle,
  Clock,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  LayoutGrid,
  Columns,
  BookOpen,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';

interface FlashcardsViewProps {
  soundEnabled: boolean;
  masteredCards: string[];
  onToggleMastered: (id: string) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  soundEnabled,
  masteredCards,
  onToggleMastered,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Filter cards
  const filteredCards = COURSE_FLASHCARDS.filter((card) => {
    const matchesCategory = selectedCategory === 'all' || card.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.keyTakeaway.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const activeCard: Flashcard | undefined = filteredCards[currentIndex];

  const handleFlip = () => {
    soundEffects.playFlip(soundEnabled);
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < filteredCards.length - 1) {
      soundEffects.playFlip(soundEnabled);
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      soundEffects.playFlip(soundEnabled);
      setIsFlipped(false);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleShuffle = () => {
    soundEffects.playFlip(soundEnabled);
    setIsFlipped(false);
    setCurrentIndex(Math.floor(Math.random() * filteredCards.length));
  };

  // Text to Speech
  const handleSpeak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-TW';
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const categories = [
    { id: 'all', label: '全部字卡', icon: '📚' },
    { id: 'air_pressure', label: '外場氣壓與空調', icon: '🌬️' },
    { id: 'hygiene_temp', label: '防塵溫控與餐具', icon: '🛡️' },
    { id: 'kitchen_setup', label: '廚房規範與補氣', icon: '🍳' },
    { id: 'restroom', label: '廁所衛生規範', icon: '🚻' },
  ];

  return (
    <div className="space-y-6">
      {/* Overview & Quick Filters */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                <BookOpen className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900">重點知識字卡</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              依據 Chapter 2 教材整理的核心觀念，點擊字卡即可翻轉正面問答與背面法規精粹。
            </p>
          </div>

          {/* Mastered statistics badge */}
          <div className="flex items-center gap-3">
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-amber-700 font-medium">學習掌握度</div>
                <div className="text-sm font-bold text-amber-900">
                  {masteredCards.length} / {COURSE_FLASHCARDS.length} 張已精熟
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {Math.round((masteredCards.length / COURSE_FLASHCARDS.length) * 100)}%
              </div>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('carousel')}
                className={`p-2 rounded-lg transition ${
                  viewMode === 'carousel'
                    ? 'bg-white shadow-xs text-amber-600 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="單卡專注模式"
              >
                <Columns className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition ${
                  viewMode === 'grid'
                    ? 'bg-white shadow-xs text-amber-600 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="全覽網格模式"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Bar & Search */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              placeholder="搜尋字卡或關鍵字..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {filteredCards.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
          <Filter className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="font-semibold text-slate-700">找不到符合條件的字卡</p>
          <p className="text-xs text-slate-400 mt-1">請嘗試變更分類或清除關鍵字篩選</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-lg hover:bg-amber-600 transition"
          >
            重設篩選
          </button>
        </div>
      ) : viewMode === 'carousel' && activeCard ? (
        /* CAROUSEL FOCUS MODE */
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Card Counter & Shuffle */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-2">
            <span>
              第 <strong className="text-slate-800 font-bold">{currentIndex + 1}</strong> / {filteredCards.length} 張字卡
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShuffle}
                className="flex items-center gap-1 text-slate-600 hover:text-amber-700 px-2 py-1 rounded bg-white border border-slate-200 hover:border-amber-300 transition"
              >
                <Shuffle className="w-3 h-3" />
                <span>隨機切換</span>
              </button>
              <button
                onClick={() =>
                  handleSpeak(
                    !isFlipped
                      ? `${activeCard.title}。問題：${activeCard.question}`
                      : `${activeCard.title}。答案：${activeCard.answer}。重點提示：${activeCard.keyTakeaway}`
                  )
                }
                className={`flex items-center gap-1 px-2.5 py-1 rounded border transition ${
                  isSpeaking
                    ? 'bg-amber-600 text-white border-amber-600 animate-pulse'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300'
                }`}
                title="語音朗讀字卡"
              >
                <Volume2 className="w-3 h-3" />
                <span>{isSpeaking ? '停止朗讀' : '語音朗讀'}</span>
              </button>
            </div>
          </div>

          {/* Interactive 3D Flip Card Container */}
          <div
            onClick={handleFlip}
            className="cursor-pointer select-none perspective-1000 min-h-[380px] group"
          >
            <div
              className={`relative w-full min-h-[380px] rounded-3xl p-6 md:p-8 transition-all duration-500 shadow-md border ${
                !isFlipped
                  ? 'bg-gradient-to-br from-white via-amber-50/30 to-orange-50/50 border-amber-200/80 hover:shadow-lg'
                  : 'bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white border-slate-700 hover:shadow-xl'
              }`}
            >
              {/* Category Pill & Flip Hint */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                    !isFlipped
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                  }`}
                >
                  {activeCard.categoryLabel}
                </span>

                <span
                  className={`text-xs flex items-center gap-1.5 transition ${
                    !isFlipped ? 'text-amber-700 font-medium' : 'text-amber-300'
                  }`}
                >
                  <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                  <span>{isFlipped ? '點擊翻回正面問答' : '點擊查看解答與法規'}</span>
                </span>
              </div>

              {!isFlipped ? (
                /* FRONT CONTENT */
                <div className="flex flex-col justify-between h-full pt-2">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                      {activeCard.title}
                    </h3>
                    <div className="p-5 rounded-2xl bg-white/80 border border-amber-100 shadow-xs">
                      <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        核心問題思考
                      </div>
                      <p className="text-base md:text-lg text-slate-800 leading-relaxed font-medium">
                        {activeCard.question}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-amber-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-amber-700 font-medium">
                      💡 關鍵字提點：{activeCard.keyTakeaway}
                    </span>
                    <span className="text-slate-400 font-mono">點擊卡片翻面 ➔</span>
                  </div>
                </div>
              ) : (
                /* BACK CONTENT */
                <div className="flex flex-col justify-between h-full pt-2 text-slate-200">
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                        【標準解答】
                      </span>
                      <h4 className="text-lg md:text-xl font-bold text-white mt-1">
                        {activeCard.answer}
                      </h4>
                    </div>

                    <div className="space-y-2 bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
                      <div className="text-xs font-semibold text-amber-300 mb-1">
                        深度解析與教材要點：
                      </div>
                      <ul className="space-y-1.5 text-xs md:text-sm text-slate-300">
                        {activeCard.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-amber-400 font-bold shrink-0">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {activeCard.lawReference && (
                      <div className="text-xs text-amber-200/90 bg-amber-950/40 p-2.5 rounded-lg border border-amber-500/20">
                        <strong className="text-amber-400">法規依據：</strong> {activeCard.lawReference}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-medium">
                      🏆 考點精華：{activeCard.keyTakeaway}
                    </span>
                    <span className="text-slate-400">點擊翻回問題</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Controls: Prev, Mastered Toggle, Next */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border transition ${
                currentIndex === 0
                  ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>上一張</span>
            </button>

            {/* Mastered Marker */}
            <button
              onClick={() => onToggleMastered(activeCard.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-xs ${
                masteredCards.includes(activeCard.id)
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-white text-slate-700 border border-slate-300 hover:border-emerald-500 hover:text-emerald-700'
              }`}
            >
              <CheckCircle className={`w-4 h-4 ${masteredCards.includes(activeCard.id) ? 'fill-white text-emerald-600' : ''}`} />
              <span>
                {masteredCards.includes(activeCard.id) ? '已標記為精熟' : '標記為已精熟'}
              </span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === filteredCards.length - 1}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border transition ${
                currentIndex === filteredCards.length - 1
                  ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>下一張</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* GRID ALL-CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCards.map((card) => {
            const isMastered = masteredCards.includes(card.id);
            return (
              <div
                key={card.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-400 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      {card.categoryLabel}
                    </span>
                    <button
                      onClick={() => onToggleMastered(card.id)}
                      className={`text-xs p-1 rounded-full transition ${
                        isMastered
                          ? 'text-emerald-600 hover:text-emerald-700'
                          : 'text-slate-300 hover:text-slate-500'
                      }`}
                      title={isMastered ? '已標記熟練' : '標記為已熟練'}
                    >
                      <CheckCircle className={`w-4 h-4 ${isMastered ? 'fill-emerald-100' : ''}`} />
                    </button>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-2">
                    {card.title}
                  </h4>
                  <p className="text-xs text-slate-600 mb-3 line-clamp-3">
                    {card.question}
                  </p>

                  <div className="bg-amber-50/60 p-2.5 rounded-lg border border-amber-100/80 mb-3">
                    <span className="text-[11px] font-bold text-amber-900 block mb-0.5">
                      重點解答：
                    </span>
                    <p className="text-xs text-slate-800 line-clamp-3">
                      {card.answer}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[180px]">💡 {card.keyTakeaway}</span>
                  <button
                    onClick={() => {
                      const idx = filteredCards.findIndex((c) => c.id === card.id);
                      if (idx !== -1) {
                        setCurrentIndex(idx);
                        setViewMode('carousel');
                        setIsFlipped(true);
                      }
                    }}
                    className="text-amber-600 font-semibold hover:underline"
                  >
                    詳細解析 ➔
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
