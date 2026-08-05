import React from 'react';
import { BUSAN_DISTRICTS } from '../data/mockFestivals';
import { FilterState } from '../types';
import { MapPin, Calendar, Filter, RotateCcw, ArrowUpDown, Sparkles } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  districtCounts: Record<string, number>;
  totalResultCount: number;
}

const MONTHS = [
  { value: '전체', label: '전체 월' },
  { value: '01', label: '1월' },
  { value: '02', label: '2월' },
  { value: '03', label: '3월' },
  { value: '04', label: '4월' },
  { value: '05', label: '5월' },
  { value: '06', label: '6월' },
  { value: '07', label: '7월' },
  { value: '08', label: '8월 (현재)' },
  { value: '09', label: '9월' },
  { value: '10', label: '10월' },
  { value: '11', label: '11월' },
  { value: '12', label: '12월' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  districtCounts,
  totalResultCount,
}) => {
  const handleReset = () => {
    setFilters({
      gugun: '전체',
      month: '전체',
      status: 'all',
      searchQuery: '',
      sortBy: 'startDate',
    });
  };

  const isFiltered =
    filters.gugun !== '전체' ||
    filters.month !== '전체' ||
    filters.status !== 'all' ||
    filters.searchQuery !== '';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-8 shadow-xl">
      
      {/* Top Bar: Title & Status Filters & Reset */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              지역별 & 날짜별 맞춤 검색
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                총 {totalResultCount}개 축제
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              부산시 16개 구/군 지역 및 개최 시기별로 필터링하세요.
            </p>
          </div>
        </div>

        {/* Status Tabs (All, Ongoing, Upcoming, Completed) */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilters((prev) => ({ ...prev, status: 'all' }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filters.status === 'all'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            전체 보기
          </button>
          
          <button
            onClick={() => setFilters((prev) => ({ ...prev, status: 'ongoing' }))}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filters.status === 'ongoing'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>진행 중 🔥</span>
          </button>

          <button
            onClick={() => setFilters((prev) => ({ ...prev, status: 'upcoming' }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filters.status === 'upcoming'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            진행 예정 📅
          </button>

          <button
            onClick={() => setFilters((prev) => ({ ...prev, status: 'completed' }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filters.status === 'completed'
                ? 'bg-slate-800 text-slate-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            지난 축제
          </button>
        </div>
      </div>

      {/* District (Gugun) Horizontal Filter Scroll */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            지역 선택 (구 / 군)
          </label>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            원하는 지역을 클릭하여 바로 조회하세요
          </span>
        </div>
        
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
          {BUSAN_DISTRICTS.map((district) => {
            const count = districtCounts[district] || 0;
            const isSelected = filters.gugun === district;

            return (
              <button
                key={district}
                onClick={() => setFilters((prev) => ({ ...prev, gugun: district }))}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20 scale-105'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/60'
                }`}
              >
                <span>{district}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-900 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Month & Sort Selection Controls */}
      <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        
        {/* Month Selector */}
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-300">개최 월:</span>
          <select
            value={filters.month}
            onChange={(e) => setFilters((prev) => ({ ...prev, month: e.target.value }))}
            className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort selector & Reset */}
        <div className="flex items-center space-x-3 ml-auto">
          <div className="flex items-center space-x-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400 hidden sm:inline">정렬:</span>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sortBy: e.target.value as 'startDate' | 'title' | 'popular',
                }))
              }
              className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
            >
              <option value="startDate">개최일순 (빠른순)</option>
              <option value="title">축제 이름순</option>
              <option value="popular">추천순</option>
            </select>
          </div>

          {isFiltered && (
            <button
              onClick={handleReset}
              className="flex items-center space-x-1 text-xs text-rose-400 hover:text-rose-300 px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>필터 초기화</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
