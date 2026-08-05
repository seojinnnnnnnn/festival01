import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { MOCK_BUSAN_FESTIVALS } from './src/data/mockFestivals';
import { ProcessedFestival, RawFestivalItem } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper function to format raw items from Public Data Portal
function processRawFestival(item: RawFestivalItem, index: number): ProcessedFestival {
  const title = item.MAIN_TITLE || item.TITLE || '부산 축제';
  const gugun = item.GUGUN_NM || '부산광역시';
  const place = item.MAIN_PLACE || item.ADDR1 || '부산 일원';
  const address = item.ADDR1 || item.ADDR2 || '부산광역시';
  const usageDayText = item.USAGE_DAY || item.USAGE_DAY_WEEK_AND_TIME || '';
  
  // Extract dates if possible from USAGE_DAY string (e.g. "2026.08.01~2026.08.10")
  let startDate = '';
  let endDate = '';
  
  if (usageDayText) {
    const dates = usageDayText.match(/\d{4}[.-]\d{2}[.-]\d{2}/g);
    if (dates && dates.length >= 1) {
      startDate = dates[0].replace(/\./g, '-');
      endDate = dates.length >= 2 ? dates[1].replace(/\./g, '-') : startDate;
    }
  }

  // Fallback dates if missing
  if (!startDate) {
    startDate = '2026-08-01';
    endDate = '2026-08-31';
  }

  // Calculate status
  const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  let status: 'ongoing' | 'upcoming' | 'completed' = 'ongoing';
  let statusLabel = '진행 중';

  if (endDate < now) {
    status = 'completed';
    statusLabel = '지난 축제';
  } else if (startDate > now) {
    status = 'upcoming';
    statusLabel = '진행 예정';
  } else {
    status = 'ongoing';
    statusLabel = '진행 중';
  }

  // Clean image URLs (handling http -> https if needed)
  let imgNormal = item.MAIN_IMG_NORMAL || item.MAIN_IMG_THUMB || '';
  if (imgNormal && imgNormal.startsWith('http:')) {
    imgNormal = imgNormal.replace('http:', 'https:');
  }
  let imgThumb = item.MAIN_IMG_THUMB || imgNormal;
  if (imgThumb && imgThumb.startsWith('http:')) {
    imgThumb = imgThumb.replace('http:', 'https:');
  }

  // Fallback image if empty
  if (!imgNormal) {
    imgNormal = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop';
    imgThumb = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop';
  }

  const lat = item.LAT ? parseFloat(String(item.LAT)) : 35.1796;
  const lng = item.LNG ? parseFloat(String(item.LNG)) : 129.0756;

  return {
    id: item.UC_SEQ || `fest-${index}-${Date.now()}`,
    title,
    subtitle: item.SUBTITLE || item.MIDDLE_SIZE_RMK || `${gugun}에서 개최되는 부산 대표 축제`,
    gugun,
    place,
    address,
    startDate,
    endDate,
    usageDayText: usageDayText || `${startDate} ~ ${endDate}`,
    status,
    statusLabel,
    imgNormal,
    imgThumb,
    contents: item.ITEMCNTNTS || '상세 정보는 홈페이지 및 문의 전화를 참고하시기 바랍니다.',
    usageTime: item.USAGE_DAY_WEEK_AND_TIME || '상세 시간 현장 문의',
    fee: item.USAGE_AMOUNT || '무료',
    tel: item.CNTCT_TEL || item.TEL_NO || '051-120 (부산시 콜센터)',
    homepage: item.HOMEPAGE_URL || 'https://www.busan.go.kr',
    lat: isNaN(lat) ? 35.1796 : lat,
    lng: isNaN(lng) ? 129.0756 : lng,
    categoryTag: gugun,
    raw: item
  };
}

// API Route: Get Festivals
app.get('/api/festivals', async (req, res) => {
  try {
    const serviceKey = process.env.BUSAN_FESTIVAL_SERVICE_KEY || 'GF7ErEjOGUyen2DRr8ZgTER51HDGjVrj5xzRYp02%2BS22Q2WxqKcWcSffo1FBOOtho3jb5g4Yf1nuI9BTUxW69w%3D%3D';
    const pageNo = req.query.pageNo || '1';
    const numOfRows = req.query.numOfRows || '100';

    // Build Public Data Portal API URL
    const targetUrl = `https://apis.data.go.kr/6260000/FestivalService/getFestivalKr?serviceKey=${encodeURIComponent(decodeURIComponent(serviceKey))}&pageNo=${pageNo}&numOfRows=${numOfRows}&resultType=json`;

    console.log(`[API Proxy] Fetching Busan festivals from: ${targetUrl.slice(0, 80)}...`);

    const apiRes = await fetch(targetUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!apiRes.ok) {
      console.warn(`[API Proxy] Public API returned status ${apiRes.status}. Using augmented fallback list.`);
      return res.json({
        success: true,
        source: 'mock',
        totalCount: MOCK_BUSAN_FESTIVALS.length,
        items: MOCK_BUSAN_FESTIVALS
      });
    }

    const textData = await apiRes.text();
    let jsonData: any = null;

    try {
      jsonData = JSON.parse(textData);
    } catch (e) {
      console.warn('[API Proxy] Failed to parse JSON response from Public API. Using fallback mock data.');
      return res.json({
        success: true,
        source: 'mock',
        totalCount: MOCK_BUSAN_FESTIVALS.length,
        items: MOCK_BUSAN_FESTIVALS
      });
    }

    const festivalObj = jsonData?.getFestivalKr || jsonData?.response?.body;
    const rawItems = festivalObj?.item || [];

    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      console.log('[API Proxy] API returned empty items list. Returning mock database.');
      return res.json({
        success: true,
        source: 'mock',
        totalCount: MOCK_BUSAN_FESTIVALS.length,
        items: MOCK_BUSAN_FESTIVALS
      });
    }

    const processedList: ProcessedFestival[] = rawItems.map((item: any, idx: number) => processRawFestival(item, idx));

    // Combine or merge with mock items to ensure rich images and accurate coverage if some API items lack thumbnails
    const combined = [...processedList];
    MOCK_BUSAN_FESTIVALS.forEach(mockItem => {
      if (!combined.some(p => p.title.includes(mockItem.title) || mockItem.title.includes(p.title))) {
        combined.push(mockItem);
      }
    });

    res.json({
      success: true,
      source: 'public_api',
      totalCount: combined.length,
      items: combined
    });

  } catch (err: any) {
    console.error('[API Proxy Error]', err.message);
    res.json({
      success: true,
      source: 'mock_fallback',
      totalCount: MOCK_BUSAN_FESTIVALS.length,
      items: MOCK_BUSAN_FESTIVALS
    });
  }
});

// API Route: AI Recommendation
app.post('/api/ai-recommend', async (req, res) => {
  try {
    const { companion, interest, festivalTitles } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({
        success: true,
        recommendation: {
          recommendedTitles: ['부산바다축제', '광안리 M 드론라이트쇼 및 어방축제'],
          reasoning: `${companion || '방문객'}을(를) 위한 ${interest || '부산 대표'} 추천 코스입니다. 시원한 바다 풍경과 함께 특색 있는 야경을 만끽하실 수 있습니다.`,
          tips: ['주차 공간이 혼잡할 수 있으니 대중교통(지하철) 이용을 권장합니다.', '야간 해변 바람에 대비해 가벼운 겉옷을 준비하세요.']
        }
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `당신은 부산 관광 및 축제 전문 안내원입니다.
사용자 조건:
- 동행자: ${companion || '자유 여행'}
- 취향/관심사: ${interest || '부산 대표 축제'}
- 현재 개최 가능 축제 목록: ${(festivalTitles || []).join(', ')}

이 조건에 어울리는 부산 축제 2~3개를 추천해주시고, 그 이유와 방문 팁을 JSON 형식으로 작성해주세요.
응답 형식(JSON만 반환):
{
  "recommendedTitles": ["축제명1", "축제명2"],
  "reasoning": "추천 이유 설명 (2~3문장)",
  "tips": ["방문 팁 1", "방문 팁 2"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text || '';
    const parsed = JSON.parse(responseText);

    return res.json({
      success: true,
      recommendation: parsed
    });

  } catch (err: any) {
    console.error('[AI Recommend Error]', err.message);
    return res.json({
      success: true,
      recommendation: {
        recommendedTitles: ['부산바다축제', '부산불꽃축제'],
        reasoning: '부산의 아름다운 해변과 광안대교 야경을 가장 잘 즐길 수 있는 대표 명품 축제들을 추천합니다.',
        tips: ['축제 기간 현장 교통이 통제될 수 있으니 사전에 행사 시간을 확인해주세요.']
      }
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Busan Festival Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
