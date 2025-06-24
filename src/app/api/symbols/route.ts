import { NextResponse } from 'next/server';
import { SymbolDataResponse } from '@/lib/types';
import { getDataWithCache, CachedData } from '@/lib/apiUtils';

// 远程数据URL
const betaDataUrl = 'https://symboldata.oss-cn-shanghai.aliyuncs.com/data-beta.json';

// 本地备用数据
const fallbackData: SymbolDataResponse = {
  version: "fallback-1.0.0",
  symbols: [
    {
      symbol: "⚠️",
      name: "警告符号",
      pronunciation: "jǐng gào fú hào",
      category: ["符号", "警告"],
      searchTerms: ["warning", "alert", "caution"],
      notes: "用于表示警告或注意事项"
    },
    {
      symbol: "✅",
      name: "勾选符号",
      pronunciation: "gōu xuǎn fú hào",
      category: ["符号", "确认"],
      searchTerms: ["check", "tick", "done"],
      notes: "用于表示完成或确认"
    },
    {
      symbol: "❌",
      name: "错误符号",
      pronunciation: "cuò wù fú hào",
      category: ["符号", "错误"],
      searchTerms: ["error", "wrong", "cancel"],
      notes: "用于表示错误或取消"
    }
  ],
  stats: {
    totalSymbols: 3,
    categoryStats: [
      { id: "符号", name: "符号", count: 3 },
      { id: "警告", name: "警告", count: 1 },
      { id: "确认", name: "确认", count: 1 },
      { id: "错误", name: "错误", count: 1 }
    ]
  }
};

// 缓存变量
let cachedSymbolData: CachedData | null = null;

// 获取符号数据（智能缓存策略）
async function getSymbolData(): Promise<SymbolDataResponse> {
  return getDataWithCache(
    betaDataUrl,
    fallbackData,
    cachedSymbolData,
    (data) => { cachedSymbolData = data; },
    '符号'
  );
}

export async function GET() {
  try {
    const data = await getSymbolData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(fallbackData, { status: 500 });
  }
}