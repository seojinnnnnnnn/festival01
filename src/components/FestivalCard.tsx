import React, { useState } from 'react';
import { ProcessedFestival } from '../types';
import { Calendar, MapPin, Heart, ChevronRight, Phone, Tag, ExternalLink } from 'lucide-react';

interface FestivalCardProps {
  festival: ProcessedFestival;
  isFavorite: boolean;
  onToggleFavorite: (id: string | number) => void;
  onSelectDetail: (festival: ProcessedFestival) => void;
}

export const FestivalCard: React.FC<FestivalCardProps> = ({
  festival,
  isFavorite,
  onToggleFavorite,
  onSelectDetail,
}) => {
  const [imgSrc, setImgSrc] = useState(
    festival.imgThumb || festival.imgNormal || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop'
  );

  const handleImageError = () => {
    setImgSrc('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop');
  };

  const getStatusBadge = () => {
    switch (festival.status) {
      case 'ongoing':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500 text-slate-950 shadow-md flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span>
            진행 중 🔥
          </span>
        );
      case 'upcoming':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500 text-white shadow-md">
            진행 예정 📅
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
            지난 축제 ⏳
          </span>
        );
    }
  };

  return (
    <div className="group bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col h-full">
      
      {/* Image Banner Section */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
        <img
          src={imgSrc}
          alt={festival.title}
          onError={handleImageError}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center space-x-1.5">
            {getStatusBadge()}
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900/90 text-cyan-300 border border-cyan-500/30 backdrop-blur-md shadow-md">
              📍 {festival.gugun}
            </span>
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(festival.id);
            }}
            className="pointer-events-auto p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-700/80 backdrop-blur-md transition-transform active:scale-90 shadow-md"
            title={isFavorite ? '보관함에서 제거' : '보관함에 저장'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite
                  ? 'fill-rose-500 text-rose-500 animate-bounce'
                  : 'text-slate-300 hover:text-rose-400'
              }`}
            />
          </button>
        </div>

        {/* Bottom Title overlay */}
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 drop-shadow-md">
            {festival.title}
          </h3>
          {festival.subtitle && (
            <p className="text-xs text-slate-300 line-clamp-1 font-light opacity-90 mt-0.5">
              {festival.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2.5 text-xs">
          
          {/* Date info */}
          <div className="flex items-start space-x-2 text-slate-300">
            <Calendar className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
            <span className="font-medium text-slate-200">
              {festival.usageDayText || `${festival.startDate} ~ ${festival.endDate}`}
            </span>
          </div>

          {/* Location info */}
          <div className="flex items-start space-x-2 text-slate-400">
            <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <span className="line-clamp-1">{festival.place || festival.address}</span>
          </div>

          {/* Fee & Tag */}
          <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400 border-t border-slate-800/80">
            <span className="flex items-center gap-1 text-cyan-400 font-medium">
              <Tag className="w-3 h-3" />
              {festival.fee || '무료'}
            </span>
            {festival.tel && (
              <span className="flex items-center gap-1 text-slate-400">
                <Phone className="w-3 h-3" />
                {festival.tel.slice(0, 15)}
              </span>
            )}
          </div>

        </div>

        {/* Action Button */}
        <button
          onClick={() => onSelectDetail(festival)}
          className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-cyan-600/20 text-slate-200 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 group/btn"
        >
          <span>축제 상세 및 안내 보기</span>
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>

      </div>

    </div>
  );
};
