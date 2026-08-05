import React, { useState } from 'react';
import { ProcessedFestival } from '../types';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, Sparkles } from 'lucide-react';

interface CalendarViewProps {
  festivals: ProcessedFestival[];
  onSelectDetail: (festival: ProcessedFestival) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ festivals, onSelectDetail }) => {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(8); // Default to August 2026
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDay(null);
  };

  // Helper to check if festival overlaps with a given day in current month/year
  const getFestivalsForDay = (day: number) => {
    const formattedMonth = String(currentMonth).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;

    return festivals.filter((f) => {
      if (!f.startDate || !f.endDate) return false;
      return f.startDate <= dateStr && dateStr <= f.endDate;
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl mb-8">
      
      {/* Month Navigator Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-cyan-400" />
            월별 축제 달력
          </h3>
          <p className="text-xs text-slate-400">
            원하는 날짜를 클릭하여 해당 날짜에 진행되는 부산 축제를 확인하세요.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={prevMonth}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-sm font-extrabold text-white min-w-[110px] text-center">
            {currentYear}년 {currentMonth}월
          </span>

          <button
            onClick={nextMonth}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 mb-2">
        <span className="text-rose-400">일</span>
        <span>월</span>
        <span>화</span>
        <span>수</span>
        <span>목</span>
        <span>금</span>
        <span className="text-blue-400">토</span>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5 bg-slate-950 p-2 rounded-2xl border border-slate-800">
        
        {/* Empty cells before month start */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="h-20 bg-slate-900/20 rounded-xl"></div>
        ))}

        {/* Days of current month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayFestivals = getFestivalsForDay(day);
          const hasFestivals = dayFestivals.length > 0;
          const isSelected = selectedDay === day;

          return (
            <div
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`h-20 p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${
                isSelected
                  ? 'bg-cyan-950/80 border-cyan-500 ring-2 ring-cyan-500/30'
                  : hasFestivals
                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 hover:border-cyan-500/40'
                  : 'bg-slate-900/40 hover:bg-slate-900/70 border-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-300'}`}>
                  {day}
                </span>
                {hasFestivals && (
                  <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {dayFestivals.length}
                  </span>
                )}
              </div>

              {/* Event Dots / Snippets */}
              <div className="space-y-1">
                {dayFestivals.slice(0, 2).map((f) => (
                  <div
                    key={f.id}
                    className="text-[10px] font-semibold truncate px-1 py-0.5 rounded bg-cyan-900/50 text-cyan-200 border border-cyan-500/20"
                    title={f.title}
                  >
                    {f.title}
                  </div>
                ))}
                {dayFestivals.length > 2 && (
                  <span className="text-[9px] text-slate-400 block text-right font-medium">
                    +{dayFestivals.length - 2}개 더보기
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Day Festival List */}
      {selectedDay !== null && (
        <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              {currentYear}년 {currentMonth}월 {selectedDay}일 축제 일정
            </h4>
            <button
              onClick={() => setSelectedDay(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              닫기 ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {getFestivalsForDay(selectedDay).length === 0 ? (
              <p className="text-xs text-slate-400 py-4 col-span-2 text-center">
                해당 날짜에 예정된 축제가 없습니다.
              </p>
            ) : (
              getFestivalsForDay(selectedDay).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectDetail(item)}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer flex items-center space-x-3"
                >
                  <img
                    src={item.imgThumb}
                    alt={item.title}
                    className="w-12 h-12 rounded-lg object-cover shrink-0 bg-slate-950"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-white truncate">{item.title}</h5>
                    <p className="text-[11px] text-slate-400 truncate">📍 {item.gugun} · {item.place}</p>
                    <span className="text-[10px] text-cyan-400 font-semibold">{item.usageDayText}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};
