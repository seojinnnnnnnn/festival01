import React from 'react';
import { Sun, CloudRain, Wind, Waves, Thermometer, MapPin } from 'lucide-react';

export const WeatherWidget: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-slate-950 border border-cyan-500/20 rounded-2xl p-3.5 sm:p-4 mb-6 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
      
      <div className="flex items-center space-x-3">
        <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <Sun className="w-5 h-5 animate-spin-slow" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              부산 해안가 실시간 날씨
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              축제 즐기기 아주 좋은 날
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            현재 <span className="font-bold text-white">28°C</span> · 맑음 ☀️ · 바다 바람 쾌적 (해변 물놀이 및 야외 축제 최적)
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4 text-xs text-slate-400 shrink-0 border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-4">
        <div className="flex items-center space-x-1">
          <Wind className="w-3.5 h-3.5 text-cyan-400" />
          <span>풍속 3.2m/s</span>
        </div>
        <div className="flex items-center space-x-1">
          <Waves className="w-3.5 h-3.5 text-blue-400" />
          <span>파고 0.5m</span>
        </div>
      </div>

    </div>
  );
};
