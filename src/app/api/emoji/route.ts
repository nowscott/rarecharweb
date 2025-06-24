import { NextResponse } from 'next/server';
import { SymbolData, SymbolDataResponse, CategoryStat } from '@/lib/types';

// emoji数据URL
const emojiDataUrl = 'https://symboldata.oss-cn-shanghai.aliyuncs.com/emoji-data.json';

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

// 缓存相关
interface CachedData {
  data: SymbolDataResponse;
  timestamp: number;
  originalData: SymbolDataResponse;
}

let cachedEmojiData: CachedData | null = null;
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

// 获取emoji数据（智能缓存策略）
async function getEmojiData(): Promise<SymbolDataResponse> {
  const now = Date.now();
  
  // 检查是否有有效缓存
  if (cachedEmojiData && (now - cachedEmojiData.timestamp) < CACHE_DURATION) {
    // 缓存有效，检查是否需要版本对比
    const cacheAge = Math.floor((now - cachedEmojiData.timestamp) / 1000 / 60); // 分钟
    console.log('🟢 [Emoji缓存状态] 使用有效缓存数据');
    console.log(`   - 缓存时间: ${cacheAge}分钟前`);
    console.log(`   - 数据版本: ${cachedEmojiData.data.version}`);
    console.log(`   - Emoji数量: ${cachedEmojiData.data.symbols.length}`);
    return cachedEmojiData.data;
  }
  
  // 缓存过期或不存在，尝试获取新数据
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(`尝试获取Emoji数据 (第${attempt}次)...`);
      const response = await fetchWithTimeout(emojiDataUrl, 8000);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // 验证数据格式
      if (!data.symbols || !Array.isArray(data.symbols)) {
        throw new Error('Emoji数据格式无效');
      }
      
      // 如果有缓存，对比版本号
      if (cachedEmojiData && cachedEmojiData.originalData.version === data.version) {
        console.log('🟡 [Emoji缓存状态] 版本号相同，更新缓存时间戳');
        console.log(`   - 远程版本: ${data.version}`);
        console.log(`   - 缓存版本: ${cachedEmojiData.originalData.version}`);
        console.log(`   - 操作: 仅更新时间戳，不重新处理数据`);
        cachedEmojiData.timestamp = now;
        return cachedEmojiData.data;
      }
      
      // 版本不同或无缓存，处理新数据
      console.log('🔴 [Emoji缓存状态] 版本更新或首次获取，处理新数据');
      if (cachedEmojiData) {
        console.log(`   - 旧版本: ${cachedEmojiData.originalData.version}`);
        console.log(`   - 新版本: ${data.version}`);
        console.log(`   - 操作: 重新处理并更新缓存`);
      } else {
        console.log(`   - 状态: 首次获取Emoji数据`);
        console.log(`   - 版本: ${data.version}`);
        console.log(`   - 操作: 创建新缓存`);
      }
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
      cachedEmojiData = {
        data: processedData,
        timestamp: now,
        originalData: data
      };
      
      console.log(`Emoji数据获取成功，共${data.symbols.length}个emoji`);
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
  console.error('所有Emoji数据获取尝试都失败了，使用备用方案');
  
  // 如果有缓存数据，返回缓存（即使过期）
  if (cachedEmojiData) {
    console.log('返回过期的Emoji缓存数据');
    return cachedEmojiData.data;
  }
  
  // 最后的备用方案：返回本地备用数据
  console.log('返回本地Emoji备用数据');
  return fallbackData;
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