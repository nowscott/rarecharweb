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

// 内存缓存，避免重复读取localStorage
let memoryCache: GlobalCachedData | null = null;
let memoryCacheTimestamp = 0;

// 后台更新状态
let backgroundUpdateInProgress = false;

// 数据源URL
const SYMBOL_DATA_URL = 'https://symboldata.oss-cn-shanghai.aliyuncs.com/data-beta.json';
const EMOJI_DATA_URL = 'https://symboldata.oss-cn-shanghai.aliyuncs.com/emoji-data.json';

// 缓存键名
const CACHE_KEY = 'rarechar_global_cache';

// 获取缓存实例（支持内存缓存）
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
  
  // 检查内存缓存（5分钟内有效）
  const now = Date.now();
  if (memoryCache && (now - memoryCacheTimestamp) < 5 * 60 * 1000) {
    return memoryCache;
  }
  
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsedCache = JSON.parse(cached);
      // 更新内存缓存
      memoryCache = parsedCache;
      memoryCacheTimestamp = now;
      return parsedCache;
    }
  } catch (error) {
    console.warn('读取缓存失败:', error);
  }
  
  // 返回默认缓存
  const defaultCache = {
    symbolData: null,
    emojiData: null,
    timestamp: 0,
    symbolOriginalData: null,
    emojiOriginalData: null
  };
  
  memoryCache = defaultCache;
  memoryCacheTimestamp = now;
  return defaultCache;
}

// 保存缓存实例（同步更新内存缓存）
function saveGlobalCache(cache: GlobalCachedData): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    // 同步更新内存缓存
    memoryCache = cache;
    memoryCacheTimestamp = Date.now();
  } catch (error) {
    console.warn('保存缓存失败:', error);
  }
}

// 获取缓存状态信息
export function getCacheStatus() {
  const cache = getGlobalCache();
  const now = Date.now();
  const ageMinutes = Math.floor((now - cache.timestamp) / 1000 / 60);
  const isValid = cache.timestamp > 0 && (now - cache.timestamp) < CACHE_DURATION;
  
  return {
    isValid,
    ageMinutes,
    timestamp: cache.timestamp,
    symbolCache: {
      hasData: !!cache.symbolData,
      version: cache.symbolData?.version || null,
      count: cache.symbolData?.symbols?.length || 0
    },
    emojiCache: {
      hasData: !!cache.emojiData,
      version: cache.emojiData?.version || null,
      count: cache.emojiData?.symbols?.length || 0
    }
  };
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
    
    // 后台更新：如果缓存超过30分钟且没有正在进行的后台更新，则启动后台更新
    if (cacheAge > 30 && !backgroundUpdateInProgress) {
      console.log(`🔄 [${dataType}后台更新] 启动后台数据更新...`);
      backgroundUpdateInProgress = true;
      
      // 异步后台更新，不阻塞当前请求
      setTimeout(async () => {
        try {
          await updateDataInBackground(url, dataType);
        } catch (error) {
          console.warn(`后台更新${dataType}数据失败:`, error);
        } finally {
          backgroundUpdateInProgress = false;
        }
      }, 100); // 延迟100ms执行，确保当前请求先返回
    }
    
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

// 后台更新数据（不阻塞UI）
async function updateDataInBackground(url: string, dataType: 'symbol' | 'emoji'): Promise<void> {
  try {
    console.log(`🔄 [${dataType}后台更新] 开始检查远程数据...`);
    const response = await fetchWithTimeout(url, 8000);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    const globalCache = getGlobalCache();
    const originalData = dataType === 'symbol' ? globalCache.symbolOriginalData : globalCache.emojiOriginalData;
    
    // 检查版本号是否有更新
    if (originalData && originalData.version === data.version) {
      console.log(`🟡 [${dataType}后台更新] 版本号相同，仅更新时间戳`);
      globalCache.timestamp = Date.now();
      saveGlobalCache(globalCache);
      return;
    }
    
    // 验证数据格式
    const dataArray = dataType === 'emoji' ? data.emojis : data.symbols;
    if (!dataArray || !Array.isArray(dataArray)) {
      throw new Error(`${dataType}数据格式无效`);
    }
    
    console.log(`🟢 [${dataType}后台更新] 发现新版本，开始处理数据...`);
    console.log(`   - 旧版本: ${originalData?.version || '无'}`);
    console.log(`   - 新版本: ${data.version}`);
    
    // 统一数据格式
    const symbols = dataType === 'emoji' ? data.emojis : data.symbols;
    const categoryStats = calculateCategoryStats(symbols);
    
    const processedData: SymbolDataResponse = {
      version: data.version,
      symbols: symbols,
      stats: {
        totalSymbols: symbols.length,
        categoryStats: categoryStats
      }
    };
    
    // 更新缓存
    const now = Date.now();
    if (dataType === 'symbol') {
      globalCache.symbolData = processedData;
      globalCache.symbolOriginalData = data;
    } else {
      globalCache.emojiData = processedData;
      globalCache.emojiOriginalData = data;
    }
    globalCache.timestamp = now;
    
    saveGlobalCache(globalCache);
    
    console.log(`✅ [${dataType}后台更新] 数据更新完成`);
    console.log(`   - 数据数量: ${symbols.length}`);
    console.log(`   - 缓存时间: ${new Date(now).toLocaleTimeString()}`);
    
  } catch (error) {
    console.warn(`❌ [${dataType}后台更新] 更新失败:`, error);
    throw error;
  }
}