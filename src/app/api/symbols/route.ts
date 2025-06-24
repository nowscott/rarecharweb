import { NextResponse } from 'next/server';
import { SymbolData, SymbolDataResponse, CategoryStat } from '@/lib/types';

// 远程数据URL
const betaDataUrl = 'https://symboldata.oss-cn-shanghai.aliyuncs.com/data-beta.json';

// 计算分类统计信息
function calculateCategoryStats(symbols: SymbolData[]): CategoryStat[] {
  const categoryCounts: Record<string, number> = {};
  
  symbols.forEach(symbol => {
    if (symbol.category && symbol.category.length > 0) {
      symbol.category.forEach(cat => {
        if (categoryCounts[cat]) {
          categoryCounts[cat]++;
        } else {
          categoryCounts[cat] = 1;
        }
      });
    }
  });
  
  // 转换为统计数组并排序
  const stats = Object.keys(categoryCounts)
    .map(id => ({
      id,
      name: id, // 直接使用分类名称，因为已经是中文
      count: categoryCounts[id]
    }))
    .sort((a, b) => b.count - a.count);

  return stats;
}

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

// 缓存相关
interface CachedData {
  data: SymbolDataResponse;
  timestamp: number;
  originalData: SymbolDataResponse;
}

let cachedSymbolData: CachedData | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1小时

// 带超时的fetch函数
async function fetchWithTimeout(url: string, timeout: number = 8000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      cache: 'no-store',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// 获取符号数据（智能缓存策略）
async function getSymbolData(): Promise<SymbolDataResponse> {
  const now = Date.now();
  
  // 检查是否有有效缓存
  if (cachedSymbolData && (now - cachedSymbolData.timestamp) < CACHE_DURATION) {
    // 缓存有效，检查是否需要版本对比
    console.log('使用缓存数据');
    return cachedSymbolData.data;
  }
  
  // 缓存过期或不存在，尝试获取新数据
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(`尝试获取数据 (第${attempt}次)...`);
      const response = await fetchWithTimeout(betaDataUrl, 8000);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // 验证数据格式
      if (!data.symbols || !Array.isArray(data.symbols)) {
        throw new Error('数据格式无效');
      }
      
      // 如果有缓存，对比版本号
      if (cachedSymbolData && cachedSymbolData.originalData.version === data.version) {
        console.log('版本号相同，更新缓存时间戳');
        cachedSymbolData.timestamp = now;
        return cachedSymbolData.data;
      }
      
      // 版本不同或无缓存，处理新数据
      console.log('版本更新或首次获取，处理新数据');
      const categoryStats = calculateCategoryStats(data.symbols);
      
      const processedData = {
        ...data,
        symbols: data.symbols,
        stats: {
          totalSymbols: data.symbols.length,
          categoryStats
        }
      };
      
      // 更新缓存
      cachedSymbolData = {
        data: processedData,
        timestamp: now,
        originalData: data
      };
      
      console.log(`数据获取成功，共${data.symbols.length}个符号`);
      return processedData;
      
    } catch (error) {
      console.error(`第${attempt}次尝试失败:`, error);
      
      // 如果不是最后一次尝试，等待1秒后重试
      if (attempt < 2) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  // 所有尝试都失败了
  console.error('所有数据获取尝试都失败了，使用备用方案');
  
  // 如果有缓存数据，返回缓存（即使过期）
  if (cachedSymbolData) {
    console.log('返回过期的缓存数据');
    return cachedSymbolData.data;
  }
  
  // 最后的备用方案：返回本地备用数据
  console.log('返回本地备用数据');
  return fallbackData;
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