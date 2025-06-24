import { NextResponse } from 'next/server';
import { SymbolDataResponse } from '@/lib/types';
import { getDataWithCache, CachedData } from '@/lib/apiUtils';

// emoji数据URL
const emojiDataUrl = 'https://symboldata.oss-cn-shanghai.aliyuncs.com/emoji-data.json';

// 本地备用数据
const fallbackData: SymbolDataResponse = {
  version: "emoji-fallback-1.0.0",
  symbols: [
    {
      symbol: "😀",
      name: "笑脸",
      pronunciation: "xiào liǎn",
      category: ["表情", "开心"],
      searchTerms: ["smile", "happy", "grin"],
      notes: "表示开心、快乐的表情"
    },
    {
      symbol: "❤️",
      name: "红心",
      pronunciation: "hóng xīn",
      category: ["符号", "爱情"],
      searchTerms: ["heart", "love", "red"],
      notes: "表示爱情、喜欢的符号"
    },
    {
      symbol: "👍",
      name: "点赞",
      pronunciation: "diǎn zàn",
      category: ["手势", "赞同"],
      searchTerms: ["thumbs up", "like", "good"],
      notes: "表示赞同、支持的手势"
    }
  ],
  stats: {
    totalSymbols: 3,
    categoryStats: [
      { id: "表情", name: "表情", count: 1 },
      { id: "符号", name: "符号", count: 1 },
      { id: "手势", name: "手势", count: 1 },
      { id: "开心", name: "开心", count: 1 },
      { id: "爱情", name: "爱情", count: 1 },
      { id: "赞同", name: "赞同", count: 1 }
    ]
  }
};

// 缓存变量
let cachedEmojiData: CachedData | null = null;

// 获取emoji数据（智能缓存策略）
async function getEmojiData(): Promise<SymbolDataResponse> {
  return getDataWithCache(
    emojiDataUrl,
    fallbackData,
    cachedEmojiData,
    (data) => { cachedEmojiData = data; },
    'Emoji'
  );
}

export async function GET() {
  try {
    const data = await getEmojiData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Emoji API route error:', error);
    return NextResponse.json(fallbackData, { status: 500 });
  }
}