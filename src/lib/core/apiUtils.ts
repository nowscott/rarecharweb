import { SymbolData, SymbolDataResponse, CategoryStat } from './types';

// 缓存接口
interface CachedData {
  data: SymbolDataResponse;
  timestamp: number;
  originalData: SymbolDataResponse;
}

// 缓存持续时间
const CACHE_DURATION = 60 * 60 * 1000; // 1小时

// 计算分类统计信息
export function calculateCategoryStats(symbols: SymbolData[]): CategoryStat[] {
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

// 带超时的fetch函数
export async function fetchWithTimeout(url: string, timeout: number = 8000): Promise<Response> {
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

// 通用数据获取函数
export async function getDataWithCache(
  dataUrl: string,
  fallbackData: SymbolDataResponse,
  cachedData: CachedData | null,
  setCachedData: (data: CachedData) => void,
  logPrefix: string = ''
): Promise<SymbolDataResponse> {
  const now = Date.now();
  
  // 检查是否有有效缓存
  if (cachedData && (now - cachedData.timestamp) < CACHE_DURATION) {
    // 缓存有效，检查是否需要版本对比
    const cacheAge = Math.floor((now - cachedData.timestamp) / 1000 / 60); // 分钟
    console.log(`🟢 [${logPrefix}缓存状态] 使用有效缓存数据`);
    console.log(`   - 缓存时间: ${cacheAge}分钟前`);
    console.log(`   - 数据版本: ${cachedData.data.version}`);
    console.log(`   - 数据数量: ${cachedData.data.symbols.length}`);
    return cachedData.data;
  }
  
  // 缓存过期或不存在，尝试获取新数据
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(`尝试获取${logPrefix}数据 (第${attempt}次)...`);
      const response = await fetchWithTimeout(dataUrl, 8000);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // 验证数据格式
      if (!data.symbols || !Array.isArray(data.symbols)) {
        throw new Error(`${logPrefix}数据格式无效`);
      }
      
      // 如果有缓存，对比版本号
      if (cachedData && cachedData.originalData.version === data.version) {
        console.log(`🟡 [${logPrefix}缓存状态] 版本号相同，更新缓存时间戳`);
        console.log(`   - 远程版本: ${data.version}`);
        console.log(`   - 缓存版本: ${cachedData.originalData.version}`);
        console.log(`   - 操作: 仅更新时间戳，不重新处理数据`);
        cachedData.timestamp = now;
        return cachedData.data;
      }
      
      // 版本不同或无缓存，处理新数据
      console.log(`🔴 [${logPrefix}缓存状态] 版本更新或首次获取，处理新数据`);
      if (cachedData) {
        console.log(`   - 旧版本: ${cachedData.originalData.version}`);
        console.log(`   - 新版本: ${data.version}`);
        console.log(`   - 操作: 重新处理并更新缓存`);
      } else {
        console.log(`   - 状态: 首次获取${logPrefix}数据`);
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
      const newCachedData = {
        data: processedData,
        timestamp: now,
        originalData: data
      };
      setCachedData(newCachedData);
      
      console.log(`${logPrefix}数据获取成功，共${data.symbols.length}个数据`);
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
  console.error(`所有${logPrefix}数据获取尝试都失败了，使用备用方案`);
  
  // 如果有缓存数据，返回缓存（即使过期）
  if (cachedData) {
    console.log(`返回过期的${logPrefix}缓存数据`);
    return cachedData.data;
  }
  
  // 最后的备用方案：返回本地备用数据
  console.log(`返回本地${logPrefix}备用数据`);
  return fallbackData;
}

// 导出缓存相关类型和常量
export type { CachedData };
export { CACHE_DURATION };