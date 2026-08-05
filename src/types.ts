export interface RawFestivalItem {
  UC_SEQ?: number;
  MAIN_TITLE?: string;
  TITLE?: string;
  GUGUN_NM?: string;
  HOMEPAGE_URL?: string;
  TEL_NO?: string;
  CNTCT_TEL?: string;
  MAIN_PLACE?: string;
  ADDR1?: string;
  ADDR2?: string;
  MAIN_IMG_NORMAL?: string;
  MAIN_IMG_THUMB?: string;
  ITEMCNTNTS?: string;
  USAGE_DAY_WEEK_AND_TIME?: string;
  USAGE_AMOUNT?: string;
  MIDDLE_SIZE_RMK?: string;
  SUBTITLE?: string;
  LAT?: number | string;
  LNG?: number | string;
  USAGE_DAY?: string;
  [key: string]: any;
}

export type FestivalStatus = 'ongoing' | 'upcoming' | 'completed' | 'unknown';

export interface ProcessedFestival {
  id: string | number;
  title: string;
  subtitle: string;
  gugun: string; // e.g., 해운대구, 수영구
  place: string; // e.g., 해운대 해수욕장
  address: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  usageDayText: string; // Original text string
  status: FestivalStatus;
  statusLabel: string;
  imgNormal: string;
  imgThumb: string;
  contents: string;
  usageTime: string;
  fee: string;
  tel: string;
  homepage: string;
  lat: number;
  lng: number;
  categoryTag?: string;
  raw: RawFestivalItem;
}

export interface FilterState {
  gugun: string; // '전체' or specific gugun
  month: string; // '전체' or '01' ~ '12'
  status: 'all' | 'ongoing' | 'upcoming' | 'completed';
  searchQuery: string;
  sortBy: 'startDate' | 'title' | 'popular';
}

export interface AiRecommendationRequest {
  companion: string; // e.g. 가족, 연인, 혼자, 친구
  interest: string; // e.g. 야경, 먹거리, 체험, 해변, 공연
  seasonMonth?: string;
}

export interface AiRecommendationResponse {
  recommendedTitles: string[];
  reasoning: string;
  tips: string[];
}
