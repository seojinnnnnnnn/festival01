import React from 'react';
import { Waves, MapPin, Calendar, Heart, Sparkles, Search, Compass, RefreshCw } from 'lucide-react';

interface NavbarProps {
  activeTab: 'grid' | 'map' | 'calendar' | 'favorites';
  setActiveTab: (tab: 'grid' | 'map' | 'calendar' | 'favorites') => void;
  favoritesCount: number;
  totalCount: number;
  onOpenAiModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onRefreshData: () => void;
  isLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  favoritesCount,
  totalCount,
  onOpenAiModal,
  searchQuery,
  setSearchQuery,
  onRefreshData,
  isLoading
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('grid')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Waves className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent">
                  부산 축제 가이드
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  공공데이터 API
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                부산광역시 구/군별 · 날짜별 축제 실시간 통합 조회
              </p>
            </div>
          </div>

          {/* Center Search Input */}
          <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="축제명, 장소, 구/군 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/80 text-white text-sm pl-10 pr-4 py-2 rounded-xl border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-slate-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Actions & Navigation Tabs */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* AI Recommendation Button */}
            <button
              onClick={onOpenAiModal}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-medium transition-all shadow-sm group"
            >
              <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">AI 축제 추천</span>
              <span className="sm:hidden">AI 추천</span>
            </button>

            {/* Refresh Data */}
            <button
              onClick={onRefreshData}
              disabled={isLoading}
              title="데이터 새로고침"
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>

            {/* Navigation Tabs */}
            <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80">
              <button
                onClick={() => setActiveTab('grid')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'grid'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">목록</span>
              </button>

              <button
                onClick={() => setActiveTab('map')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'map'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">지도</span>
              </button>

              <button
                onClick={() => setActiveTab('calendar')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'calendar'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">달력</span>
              </button>

              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'favorites'
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${favoritesCount > 0 ? 'fill-rose-400 text-rose-400' : ''}`} />
                <span className="hidden sm:inline">보관함</span>
                {favoritesCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/30 text-rose-200 border border-rose-400/30">
                    {favoritesCount}
                  </span>
                )}
              </button>
            </div>

          </div>

        </div>

        {/* Mobile Search Input Bar */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="부산 축제명, 장소, 구/군 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 text-white text-xs pl-10 pr-4 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

      </div>
    </header>
  );
};
