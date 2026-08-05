import React, { useState } from 'react';
import { ProcessedFestival } from '../types';
import { MapPin, Navigation, Sparkles, Calendar, ChevronRight } from 'lucide-react';

interface BusanMapViewProps {
  festivals: ProcessedFestival[];
  onSelectDetail: (festival: ProcessedFestival) => void;
  selectedGugun: string;
  onSelectGugun: (gugun: string) => void;
}

// Approximate relative layout grid positions for Busan Districts for stylized map view
const DISTRICT_POSITIONS: Record<string, { top: string; left: string }> = {
  '기장군': { top: '22%', left: '80%' },
  '금정구': { top: '20%', left: '50%' },
  '북구': { top: '30%', left: '32%' },
  '강서구': { top: '55%', left: '18%' },
  '사상구': { top: '48%', left: '38%' },
  '부산진구': { top: '42%', left: '52%' },
  '동래구': { top: '32%', left: '58%' },
  '연제구': { top: '38%', left: '60%' },
  '해운대구': { top: '38%', left: '78%' },
  '수영구': { top: '48%', left: '70%' },
  '남구': { top: '58%', left: '62%' },
  '동구': { top: '56%', left: '48%' },
  '중구': { top: '64%', left: '46%' },
  '서구': { top: '68%', left: '40%' },
  '사하구': { top: '72%', left: '30%' },
  '영도구': { top: '78%', left: '52%' },
};

export const BusanMapView: React.FC<BusanMapViewProps> = ({
  festivals,
  onSelectDetail,
  selectedGugun,
  onSelectGugun,
}) => {
  const [hoveredFestival, setHoveredFestival] = useState<ProcessedFestival | null>(null);

  // Group festivals by Gugun
  const gugunGroups: Record<string, ProcessedFestival[]> = {};
  festivals.forEach((f) => {
    if (!gugunGroups[f.gugun]) {
      gugunGroups[f.gugun] = [];
    }
    gugunGroups[f.gugun].push(f);
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl mb-8 overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Navigation className="w-5 h-5 text-cyan-400" />
            부산 지역별 축제 위치 지도
          </h3>
          <p className="text-xs text-slate-400">
            구/군 마커를 선택하여 해당 지역에서 열리는 주요 축제를 한눈에 파악하세요.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-medium text-slate-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
          <span>선택 지역: {selectedGugun}</span>
        </div>
      </div>

      {/* Main Interactive Map Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Visual Map Representation */}
        <div className="lg:col-span-2 relative min-h-[420px] bg-slate-950 rounded-2xl border border-slate-800/80 p-4 overflow-hidden flex flex-col justify-between">
          
          {/* Decorative Sea Background Accent */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-cyan-300 font-semibold flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>부산광역시 축제 맵</span>
          </div>

          <div className="absolute bottom-4 right-4 z-10 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-400">
            🌊 남해 & 동해 바다 연안
          </div>

          {/* District Pins on Map Canvas */}
          <div className="relative w-full h-[360px]">
            {Object.entries(DISTRICT_POSITIONS).map(([gugunName, pos]) => {
              const list = gugunGroups[gugunName] || [];
              const count = list.length;
              const isSelected = selectedGugun === gugunName;

              return (
                <div
                  key={gugunName}
                  style={{ top: pos.top, left: pos.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                >
                  <button
                    onClick={() => onSelectGugun(gugunName)}
                    onMouseEnter={() => list.length > 0 && setHoveredFestival(list[0])}
                    onMouseLeave={() => setHoveredFestival(null)}
                    className={`relative flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all transform hover:scale-110 shadow-lg ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/30 z-30'
                        : count > 0
                        ? 'bg-slate-800/95 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-600 hover:text-white'
                        : 'bg-slate-900/80 text-slate-500 border border-slate-800'
                    }`}
                  >
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-cyan-400'}`} />
                    <span>{gugunName}</span>
                    {count > 0 && (
                      <span className={`ml-1 text-[10px] px-1.5 rounded-full font-black ${
                        isSelected ? 'bg-slate-950 text-cyan-300' : 'bg-cyan-500/20 text-cyan-200'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

        </div>

        {/* Selected District Festival List Sidebar */}
        <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-400" />
                {selectedGugun} 축제 목록
              </h4>
              <span className="text-xs text-slate-400">
                {(gugunGroups[selectedGugun] || []).length}개 등록
              </span>
            </div>

            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin">
              {(!gugunGroups[selectedGugun] || gugunGroups[selectedGugun].length === 0) ? (
                <div className="text-center py-10 text-xs text-slate-500">
                  선택한 {selectedGugun} 지역에 등록된 축제가 없습니다. 다른 구/군을 선택해보세요!
                </div>
              ) : (
                gugunGroups[selectedGugun].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectDetail(item)}
                    className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group flex items-center justify-between"
                  >
                    <div className="space-y-1 pr-2">
                      <h5 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {item.title}
                      </h5>
                      <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                        <Calendar className="w-3 h-3 text-cyan-400" />
                        <span>{item.usageDayText}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 text-center">
            💡 카드를 클릭하면 상세 정보를 확인하실 수 있습니다.
          </div>
        </div>

      </div>

    </div>
  );
};
