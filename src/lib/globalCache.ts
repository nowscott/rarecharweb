import { SymbolDataResponse } from './types';
import { fetchWithTimeout, calculateCategoryStats } from './apiUtils';

// 缓存接口
interface GlobalCachedData {
  symbolData: SymbolDataResponse | null;
  emojiData: SymbolDataResponse | null;
  timestamp: number;
  symbolOriginalData: SymbolDataResponse | null;
  emojiOriginalData: SymbolDataResponse | null;
}

// 缓存持续时间（1小时）
const CACHE_DURATION = 60 * 60 * 1000;

// 数据源URL
const SYMBOL_DATA_URL = 'https://symboldata.oss-cn-shanghai.aliyuncs.com/data-beta.json';
const EMOJI_DATA_URL = 'https://symboldata.oss-cn-shanghai.aliyuncs.com/emoji-data.json';

// 缓存键名
const CACHE_KEY = 'rarechar_global_cache';

// 获取缓存实例
function getGlobalCache(): GlobalCachedData {
  if (typeof window === 'undefined') {
    // 服务端环境，返回空缓存
    return {
      symbolData: null,
      emojiData: null,
      timestamp: 0,
      symbolOriginalData: null,
      emojiOriginalData: null
    };
  }
  
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.warn('读取缓存失败:', error);
  }
  
  // 返回默认缓存
  return {
    symbolData: null,
    emojiData: null,
    timestamp: 0,
    symbolOriginalData: null,
    emojiOriginalData: null
  };
}

// 保存缓存实例
function saveGlobalCache(cache: GlobalCachedData): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn('保存缓存失败:', error);
  }
}



// 获取单个数据源的函数
async function fetchDataSource(
  url: string,
  dataType: 'symbol' | 'emoji'
): Promise<SymbolDataResponse | null> {
  const now = Date.now();
  const globalCache = getGlobalCache();
  const cachedData = dataType === 'symbol' ? globalCache.symbolData : globalCache.emojiData;
  const originalData = dataType === 'symbol' ? globalCache.symbolOriginalData : globalCache.emojiOriginalData;
  
  // 检查缓存是否在1小时内
  if (cachedData && originalData && (now - globalCache.timestamp) < CACHE_DURATION) {
    const cacheAge = Math.floor((now - globalCache.timestamp) / 1000 / 60);
    console.log(`🟢 [${dataType}缓存状态] 使用有效缓存数据`);
    console.log(`   - 缓存时间: ${cacheAge}分钟前`);
    console.log(`   - 数据版本: ${cachedData.version}`);
    console.log(`   - 数据数量: ${cachedData.symbols.length}`);
    return cachedData;
  }
  
  // 缓存过期或不存在，尝试获取新数据
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(`尝试获取${dataType}数据 (第${attempt}次)...`);
      const response = await fetchWithTimeout(url, 8000);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // 验证数据格式
      const dataArray = dataType === 'emoji' ? data.emojis : data.symbols;
      if (!dataArray || !Array.isArray(dataArray)) {
        throw new Error(`${dataType}数据格式无效`);
      }
      
      // 如果有缓存，对比版本号
      if (originalData && originalData.version === data.version) {
        console.log(`🟡 [${dataType}缓存状态] 版本号相同，更新缓存时间戳`);
        console.log(`   - 远程版本: ${data.version}`);
        console.log(`   - 缓存版本: ${originalData.version}`);
        console.log(`   - 操作: 仅更新时间戳，不重新处理数据`);
        
        // 更新时间戳
        globalCache.timestamp = now;
        saveGlobalCache(globalCache);
        
        return cachedData!;
      }
      
      // 版本不同或无缓存，处理新数据
      console.log(`🔴 [${dataType}缓存状态] 版本更新或首次获取，处理新数据`);
      if (originalData) {
        console.log(`   - 旧版本: ${originalData.version}`);
        console.log(`   - 新版本: ${data.version}`);
        console.log(`   - 操作: 重新处理并更新缓存`);
      } else {
        console.log(`   - 状态: 首次获取${dataType}数据`);
        console.log(`   - 版本: ${data.version}`);
        console.log(`   - 操作: 创建新缓存`);
      }
      
      // 统一数据格式
      let symbols;
      if (dataType === 'emoji') {
        // 将emoji数据转换为symbols格式
        symbols = data.emojis.map((emoji: any) => ({
          symbol: emoji.emoji,
          name: emoji.name,
          pronunciation: '',
          category: [emoji.category],
          searchTerms: emoji.keywords || [],
          notes: emoji.text || ''
        }));
      } else {
        symbols = data.symbols;
      }
      
      const categoryStats = calculateCategoryStats(symbols);
      
      const processedData = {
        ...data,
        symbols: symbols,
        stats: {
          totalSymbols: symbols.length,
          categoryStats
        }
      };
      
      // 更新全局缓存
      if (dataType === 'symbol') {
        globalCache.symbolData = processedData;
        globalCache.symbolOriginalData = data;
      } else {
        globalCache.emojiData = processedData;
        globalCache.emojiOriginalData = data;
      }
      globalCache.timestamp = now;
      saveGlobalCache(globalCache);
      
      console.log(`${dataType}数据获取成功，共${symbols.length}个数据`);
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
  console.error(`所有${dataType}数据获取尝试都失败了，使用备用方案`);
  
  // 如果有缓存数据，返回缓存（即使过期）
  if (cachedData) {
    console.log(`返回过期的${dataType}缓存数据`);
    return cachedData;
  }
  
  // 所有方案都失败了，返回null
  console.log(`所有${dataType}数据获取方案都失败了`);
  return null;
}

// 预加载所有数据
export async function preloadAllData(): Promise<void> {
  console.log('🚀 开始预加载数据到全局缓存...');
  
  try {
    // 并行加载符号数据和表情数据
    const [symbolData, emojiData] = await Promise.all([
      fetchDataSource(SYMBOL_DATA_URL, 'symbol'),
      fetchDataSource(EMOJI_DATA_URL, 'emoji')
    ]);
    
    console.log('✅ 全局缓存预加载完成');
    if (symbolData) console.log(`   - 符号数据: ${symbolData.symbols.length}个`);
    if (emojiData) console.log(`   - 表情数据: ${emojiData.symbols.length}个`);
    
  } catch (error) {
    console.error('❌ 全局缓存预加载失败:', error);
  }
}

// 获取符号数据
export async function getSymbolData(): Promise<SymbolDataResponse | null> {
  return fetchDataSource(SYMBOL_DATA_URL, 'symbol');
}

// 获取表情数据
export async function getEmojiData(): Promise<SymbolDataResponse | null> {
  return fetchDataSource(EMOJI_DATA_URL, 'emoji');
}

// 获取缓存状态（用于调试）
export function getCacheStatus() {
  const now = Date.now();
  const globalCache = getGlobalCache();
  return {
    timestamp: globalCache.timestamp,
    ageMinutes: globalCache.timestamp ? Math.floor((now - globalCache.timestamp) / 1000 / 60) : -1,
    isValid: globalCache.timestamp && (now - globalCache.timestamp) < CACHE_DURATION,
    symbolCache: {
      hasData: !!globalCache.symbolData,
      version: globalCache.symbolOriginalData?.version || 'unknown'
    },
    emojiCache: {
      hasData: !!globalCache.emojiData,
      version: globalCache.emojiOriginalData?.version || 'unknown'
    }
  };
}