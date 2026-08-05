import React, { useState, useEffect, useMemo } from 'react';
import { ProcessedFestival, FilterState } from './types';
import { MOCK_BUSAN_FESTIVALS, BUSAN_DISTRICTS } from './data/mockFestivals';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { FestivalCard } from './components/FestivalCard';
import { FestivalDetailModal } from './components/FestivalDetailModal';
import { BusanMapView } from './components/BusanMapView';
import { CalendarView } from './components/CalendarView';
import { AiRecommendModal } from './components/AiRecommendModal';
import { WeatherWidget } from './components/WeatherWidget';
import {
  Sparkles,
  Heart,
  Compass,
  MapPin,
  Calendar,
  AlertCircle,
  Waves,
  Globe,
  Loader2,
  SlidersHorizontal
} from 'lucide-react';

export default function App() {
  const [festivals, setFestivals] = useState<ProcessedFestival[]>(MOCK_BUSAN_FESTIVALS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'grid' | 'map' | 'calendar' | 'favorites'>('grid');
  const [selectedFestivalDetail, setSelectedFestivalDetail] = useState<ProcessedFestival | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  // Favorites stored in localStorage
  const [favorites, setFavorites] = useState<(string | number)[]>(() => {
    try {
      const saved = localStorage.getItem('busan_festival_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    gugun: '전체',
    month: '전체',
    status: 'all',
    searchQuery: '',
    sortBy: 'startDate',
  });

  // Fetch API data on load
  const fetchFestivals = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/festivals');
      const data = await res.json();
      if (data.success && Array.isArray(data.items) && data.items.length > 0) {
        setFestivals(data.items);
      } else {
        setFestivals(MOCK_BUSAN_FESTIVALS);
      }
    } catch (err) {
      console.warn('API connection error. Using local mock dataset:', err);
      setFestivals(MOCK_BUSAN_FESTIVALS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFestivals();
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('busan_festival_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  const toggleFavorite = (id: string | number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Compute count of festivals per district
  const districtCounts = useMemo(() => {
    const counts: Record<string, number> = { '전체': festivals.length };
    BUSAN_DISTRICTS.forEach((d) => {
      if (d !== '전체') counts[d] = 0;
    });

    festivals.forEach((f) => {
      if (counts[f.gugun] !== undefined) {
        counts[f.gugun] += 1;
      }
    });
    return counts;
  }, [festivals]);

  // Filter & Sort Logic
  const filteredFestivals = useMemo(() => {
    let result = [...festivals];

    // If favorites tab selected
    if (activeTab === 'favorites') {
      result = result.filter((f) => favorites.includes(f.id));
    }

    // Filter by District (Gugun)
    if (filters.gugun !== '전체') {
      result = result.filter((f) => f.gugun === filters.gugun);
    }

    // Filter by Month
    if (filters.month !== '전체') {
      result = result.filter((f) => {
        const startM = f.startDate ? f.startDate.slice(5, 7) : '';
        const endM = f.endDate ? f.endDate.slice(5, 7) : '';
        return startM === filters.month || endM === filters.month;
      });
    }

    // Filter by Status
    if (filters.status !== 'all') {
      result = result.filter((f) => f.status === filters.status);
    }

    // Filter by Search Query
    if (filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (f) =>
          f.title.toLowerCase().includes(q) ||
          f.subtitle.toLowerCase().includes(q) ||
          f.gugun.toLowerCase().includes(q) ||
          f.place.toLowerCase().includes(q) ||
          f.contents.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (filters.sortBy === 'startDate') {
        return (a.startDate || '').localeCompare(b.startDate || '');
      } else if (filters.sortBy === 'title') {
        return a.title.localeCompare(b.title, 'ko');
      } else {
        // 'popular'
        return a.status === 'ongoing' ? -1 : 1;
      }
    });

    return result;
  }, [festivals, filters, activeTab, favorites]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        favoritesCount={favorites.length}
        totalCount={festivals.length}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        searchQuery={filters.searchQuery}
        setSearchQuery={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
        onRefreshData={fetchFestivals}
        isLoading={isLoading}
      />

      {/* Hero Banner Section */}
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 pt-8 pb-4 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-900">
        <div className="max-w-7xl mx-auto">
          
          <WeatherWidget />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold mb-2">
                <Waves className="w-3.5 h-3.5 animate-pulse" />
                <span>dynamic busan festival hub</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {activeTab === 'favorites' ? '내 축제 보관함 💖' : '부산 구/군별 & 날짜별 축제 통합 안내'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                {activeTab === 'favorites'
                  ? '마음에 들어서 저장해 둔 부산 축제 목록입니다.'
                  : '해운대, 광안리, 남포동, 기장 등 부산 전역에서 열리는 축제 정보를 실시간으로 확인해보세요.'}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center space-x-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-xs font-medium self-start md:self-auto">
              <div className="text-center px-3 border-r border-slate-800">
                <span className="block text-slate-400 text-[10px]">전체 축제</span>
                <span className="text-base font-extrabold text-cyan-400">{festivals.length}개</span>
              </div>
              <div className="text-center px-3 border-r border-slate-800">
                <span className="block text-slate-400 text-[10px]">진행 중</span>
                <span className="text-base font-extrabold text-emerald-400">
                  {festivals.filter((f) => f.status === 'ongoing').length}개
                </span>
              </div>
              <div className="text-center px-3">
                <span className="block text-slate-400 text-[10px]">진행 예정</span>
                <span className="text-base font-extrabold text-blue-400">
                  {festivals.filter((f) => f.status === 'upcoming').length}개
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Tab 1: Grid View with FilterBar */}
        {activeTab === 'grid' && (
          <>
            <FilterBar
              filters={filters}
              setFilters={setFilters}
              districtCounts={districtCounts}
              totalResultCount={filteredFestivals.length}
            />

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-3">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                <p className="text-xs text-slate-400">부산 축제 공공데이터를 불러오는 중입니다...</p>
              </div>
            ) : filteredFestivals.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center my-8">
                <AlertCircle className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">검색 조건에 해당되는 축제가 없습니다</h3>
                <p className="text-xs text-slate-400 mb-4 max-w-md mx-auto">
                  선택하신 구/군 또는 월/검색어 조건을 변경하거나 필터를 초기화해 보세요.
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      gugun: '전체',
                      month: '전체',
                      status: 'all',
                      searchQuery: '',
                      sortBy: 'startDate',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
                >
                  필터 초기화하기
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFestivals.map((festival) => (
                  <FestivalCard
                    key={festival.id}
                    festival={festival}
                    isFavorite={favorites.includes(festival.id)}
                    onToggleFavorite={toggleFavorite}
                    onSelectDetail={(item) => setSelectedFestivalDetail(item)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Tab 2: Map View */}
        {activeTab === 'map' && (
          <BusanMapView
            festivals={festivals}
            onSelectDetail={(item) => setSelectedFestivalDetail(item)}
            selectedGugun={filters.gugun}
            onSelectGugun={(gugun) => {
              setFilters((prev) => ({ ...prev, gugun }));
              setActiveTab('grid');
            }}
          />
        )}

        {/* Tab 3: Calendar View */}
        {activeTab === 'calendar' && (
          <CalendarView
            festivals={festivals}
            onSelectDetail={(item) => setSelectedFestivalDetail(item)}
          />
        )}

        {/* Tab 4: Favorites View */}
        {activeTab === 'favorites' && (
          <div>
            {filteredFestivals.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center my-8">
                <Heart className="w-10 h-10 text-rose-500/40 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">아직 보관함에 담긴 축제가 없습니다</h3>
                <p className="text-xs text-slate-400 mb-4 max-w-md mx-auto">
                  관심 있는 부산 축제의 하트 아이콘을 눌러 나만의 축제 목록을 완성해보세요.
                </p>
                <button
                  onClick={() => setActiveTab('grid')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:from-cyan-400 hover:to-blue-500 transition-colors"
                >
                  축제 목록 둘러보기
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFestivals.map((festival) => (
                  <FestivalCard
                    key={festival.id}
                    festival={festival}
                    isFavorite={favorites.includes(festival.id)}
                    onToggleFavorite={toggleFavorite}
                    onSelectDetail={(item) => setSelectedFestivalDetail(item)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Festival Detail Modal */}
      <FestivalDetailModal
        festival={selectedFestivalDetail}
        onClose={() => setSelectedFestivalDetail(null)}
        isFavorite={selectedFestivalDetail ? favorites.includes(selectedFestivalDetail.id) : false}
        onToggleFavorite={toggleFavorite}
      />

      {/* AI Recommendation Modal */}
      <AiRecommendModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        festivals={festivals}
        onSelectDetail={(item) => setSelectedFestivalDetail(item)}
      />

      {/* Footer */}
      <footer className="bg-slate-900/90 border-t border-slate-800 text-slate-400 text-xs py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold">
              釜
            </div>
            <div>
              <p className="font-bold text-slate-200">부산 축제 정보 가이드</p>
              <p className="text-[11px] text-slate-500">
                공공데이터포털(data.go.kr) 부산광역시 축제 서비스 API 연동
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span className="hover:text-slate-200">부산광역시 16개 구/군</span>
            <span>·</span>
            <span className="hover:text-slate-200">실시간 진행/예정 축제</span>
            <span>·</span>
            <a
              href="https://www.data.go.kr/data/15061058/openapi.do"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              <Globe className="w-3 h-3" /> API 출처
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
