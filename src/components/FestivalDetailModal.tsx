import React, { useState } from 'react';
import { ProcessedFestival } from '../types';
import {
  X,
  Calendar,
  MapPin,
  Phone,
  Globe,
  DollarSign,
  Clock,
  Heart,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Navigation
} from 'lucide-react';

interface FestivalDetailModalProps {
  festival: ProcessedFestival | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string | number) => void;
}

export const FestivalDetailModal: React.FC<FestivalDetailModalProps> = ({
  festival,
  onClose,
  isFavorite,
  onToggleFavorite,
}) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  if (!festival) return null;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(festival.address || festival.place);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: festival.title,
        text: `${festival.title} - ${festival.usageDayText} (${festival.gugun})`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const kakaoMapSearchUrl = `https://map.kakao.com/?q=${encodeURIComponent(festival.address || festival.place || festival.title)}`;
  const naverMapSearchUrl = `https://map.naver.com/v5/search/${encodeURIComponent(festival.address || festival.place || festival.title)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Card */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-white my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 backdrop-blur-md transition-all shadow-lg"
          title="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Banner Image */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-950 shrink-0 overflow-hidden">
          <img
            src={festival.imgNormal || festival.imgThumb}
            alt={festival.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

          {/* Badges on Banner */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500 text-slate-950 shadow-md">
                📍 {festival.gugun}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800/90 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                {festival.statusLabel}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
              {festival.title}
            </h2>
            {festival.subtitle && (
              <p className="text-sm text-slate-300 font-medium mt-1 line-clamp-1">
                {festival.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-300 scrollbar-thin">
          
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">개최 기간</span>
                <span className="text-xs font-bold text-white">{festival.usageDayText}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">이용 시간</span>
                <span className="text-xs font-bold text-white">{festival.usageTime || '현장 안내'}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">이용 요금</span>
                <span className="text-xs font-bold text-white">{festival.fee || '무료'}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">문의 전화</span>
                <a
                  href={`tel:${festival.tel}`}
                  className="text-xs font-bold text-emerald-400 hover:underline"
                >
                  {festival.tel || '051-120'}
                </a>
              </div>
            </div>

          </div>

          {/* Festival Content Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              축제 소개 & 주요 프로그램
            </h4>
            <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 text-slate-200 leading-relaxed text-sm whitespace-pre-wrap">
              {festival.contents || '부산시에서 개최하는 대표 축제로 가족, 친구, 연인과 함께 즐길 수 있는 다채로운 문화 공연 및 체험 행사가 마련되어 있습니다.'}
            </div>
          </div>

          {/* Address & Map Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              장소 및 위치 안내
            </h4>
            
            <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 text-rose-400 mt-1 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">{festival.place || festival.gugun}</span>
                    <span className="text-xs text-slate-400">{festival.address}</span>
                  </div>
                </div>

                <button
                  onClick={handleCopyAddress}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">복사됨!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>주소 복사</span>
                    </>
                  )}
                </button>
              </div>

              {/* Map Search Shortcuts */}
              <div className="flex items-center space-x-2 pt-2 border-t border-slate-800/80">
                <a
                  href={kakaoMapSearchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-xs font-bold text-center transition-colors flex items-center justify-center space-x-1"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>카카오맵 길찾기</span>
                </a>

                <a
                  href={naverMapSearchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold text-center transition-colors flex items-center justify-center space-x-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>네이버지도 검색</span>
                </a>
              </div>

            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleFavorite(festival.id)}
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all border ${
                isFavorite
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-400 text-rose-400' : ''}`} />
              <span>{isFavorite ? '보관함 저장됨' : '보관함에 저장'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="축제 공유하기"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {shared && <span className="text-xs text-emerald-400 font-medium">링크가 복사되었습니다!</span>}
          </div>

          {festival.homepage && (
            <a
              href={festival.homepage}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-cyan-500/20"
            >
              <Globe className="w-4 h-4" />
              <span>공식 홈페이지 방문</span>
            </a>
          )}

        </div>

      </div>

    </div>
  );
};
