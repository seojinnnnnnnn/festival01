import React, { useState } from 'react';
import { ProcessedFestival, AiRecommendationResponse } from '../types';
import { Sparkles, X, Users, Heart, Lightbulb, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';

interface AiRecommendModalProps {
  isOpen: boolean;
  onClose: () => void;
  festivals: ProcessedFestival[];
  onSelectDetail: (festival: ProcessedFestival) => void;
}

const COMPANIONS = ['가족과 함께 👨‍👩‍👧', '연인과 데이트 💕', '친구들과 🥳', '혼자 자유여행 🎒'];
const INTERESTS = ['바다 & 해변 🌊', '화려한 야경 🌃', '먹거리 & 수산물 🍣', '문화 & 역사 🏛️', 'K-POP & 음악 🎵', '꽃 & 자연 🌸'];

export const AiRecommendModal: React.FC<AiRecommendModalProps> = ({
  isOpen,
  onClose,
  festivals,
  onSelectDetail,
}) => {
  const [selectedCompanion, setSelectedCompanion] = useState(COMPANIONS[0]);
  const [selectedInterest, setSelectedInterest] = useState(INTERESTS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AiRecommendationResponse | null>(null);

  if (!isOpen) return null;

  const handleGetRecommendation = async () => {
    setIsLoading(true);
    setRecommendation(null);

    const festivalTitles = festivals.map((f) => f.title);

    try {
      const res = await fetch('/api/ai-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companion: selectedCompanion,
          interest: selectedInterest,
          festivalTitles,
        }),
      });

      const data = await res.json();
      if (data.success && data.recommendation) {
        setRecommendation(data.recommendation);
      }
    } catch (e) {
      console.error(e);
      // Fallback recommendation
      setRecommendation({
        recommendedTitles: ['부산바다축제', '광안리 M 드론라이트쇼 및 어방축제'],
        reasoning: `${selectedCompanion} 여행객을 위한 맞춤형 코스입니다. 시원한 부산 바다 풍경과 화려한 광안대교 야경을 둘다 만족스럽게 즐기실 수 있습니다.`,
        tips: [
          '주말 및 행사 당일 해변 주변 도로가 혼잡하므로 지하철(2호선) 이용을 권장합니다.',
          '야간 해풍에 대비해 얇은 겉옷과 돗자리를 챙기시면 더욱 좋습니다.',
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const matchedFestivals = (recommendation?.recommendedTitles || []).map((title) => {
    return festivals.find((f) => f.title.includes(title) || title.includes(f.title)) || null;
  }).filter((f): f is ProcessedFestival => f !== null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      
      <div
        className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-white my-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                AI 맞춤 부산 축제 코스 추천
              </h3>
              <p className="text-xs text-amber-200/80">
                여행 동행인과 취향을 선택하면 AI가 최적의 축제를 추천해드립니다.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form & Results Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm scrollbar-thin">
          
          {/* Companion Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              1. 누굴 만나요? (동행자)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {COMPANIONS.map((comp) => (
                <button
                  key={comp}
                  onClick={() => setSelectedCompanion(comp)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-left ${
                    selectedCompanion === comp
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {comp}
                </button>
              ))}
            </div>
          </div>

          {/* Interest Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              2. 어떤 경험을 하고 싶나요? (취향)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {INTERESTS.map((interest) => (
                <button
                  key={interest}
                  onClick={() => setSelectedInterest(interest)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-left ${
                    selectedInterest === interest
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Action Generate Button */}
          <button
            onClick={handleGetRecommendation}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>AI 분석 및 코스 생성 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>AI 추천 결과 생성하기</span>
              </>
            )}
          </button>

          {/* Recommendation Output */}
          {recommendation && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-4 animate-fadeIn">
              
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> AI 맞춤 분석 완료
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {recommendation.reasoning}
                </p>
              </div>

              {/* Matched Festival Cards */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h5 className="text-xs font-bold text-slate-400">추천 축제 바로가기:</h5>
                <div className="space-y-2">
                  {matchedFestivals.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onClose();
                        onSelectDetail(item);
                      }}
                      className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.imgThumb}
                          alt={item.title}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 bg-slate-950"
                        />
                        <div>
                          <h6 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                            {item.title}
                          </h6>
                          <p className="text-[11px] text-slate-400">📍 {item.gugun} · {item.usageDayText}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-1" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              {recommendation.tips && recommendation.tips.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 space-y-1">
                  <span className="font-bold flex items-center gap-1 text-amber-300">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> 현장 방문 꿀팁
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-200/90">
                    {recommendation.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
