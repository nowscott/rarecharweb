// 符号数据获取和缓存工具
// lodash shuffle 已移至客户端使用

export interface SymbolData {
  symbol: string;
  name: string;
  pronunciation: string;
  category: string[];
  searchTerms: string[];
  notes: string;
}

export interface CategoryStat {
  id: string;
  name: string;
  count: number;
}

export interface SymbolDataResponse {
  version: string;
  symbols: SymbolData[];
  stats?: {
    totalSymbols: number;
    categoryStats: CategoryStat[];
  };
}

// 远程数据URL
const betaDataUrl = 'https://symboldata.oss-cn-shanghai.aliyuncs.com/data-beta.json';

// 分类映射已移除，因为数据中的分类字段已经是中文

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

// 缓存相关类型和变量
interface CachedData {
  data: SymbolDataResponse;
  timestamp: number;
  originalData: any; // 用于对比的原始数据
}

let cachedSymbolData: CachedData | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1小时

// 后台更新缓存
async function updateCacheInBackground() {
  try {
    const response = await fetch(betaDataUrl, { cache: 'no-store' });
    if (!response.ok) return;
    
    const newData = await response.json();
    
    // 对比数据是否有变化（简单对比符号数量和版本）
    const hasChanged = !cachedSymbolData || 
      cachedSymbolData.originalData.symbols.length !== newData.symbols.length ||
      cachedSymbolData.originalData.version !== newData.version;
    
    if (hasChanged) {
       // 数据有变化，更新缓存（不随机化）
       const categoryStats = calculateCategoryStats(newData.symbols);
       
       cachedSymbolData = {
         data: {
           ...newData,
           symbols: newData.symbols, // 保持原始顺序
           stats: {
             totalSymbols: newData.symbols.length,
             categoryStats
           }
         },
         timestamp: Date.now(),
         originalData: newData
       };
    }
  } catch (error) {
    console.error('后台更新缓存失败:', error);
  }
}

// 获取符号数据（智能缓存策略）
export async function getSymbolData(): Promise<SymbolDataResponse> {
  const now = Date.now();
  
  // 检查是否有有效缓存
  if (cachedSymbolData && (now - cachedSymbolData.timestamp) < CACHE_DURATION) {
    // 缓存有效，直接返回
    return cachedSymbolData.data;
  }
  
  // 缓存过期或不存在，获取新数据
  const response = await fetch(betaDataUrl, { cache: 'no-store' });
  
  if (!response.ok) {
    // 如果请求失败且有缓存，返回缓存数据
    if (cachedSymbolData) {
      return cachedSymbolData.data;
    }
    throw new Error(`获取数据失败: ${response.status}`);
  }
  
  const data = await response.json();
  
  // 不在服务端随机化，保持原始顺序
  const categoryStats = calculateCategoryStats(data.symbols);
  
  const processedData = {
    ...data,
    symbols: data.symbols, // 保持原始顺序
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
  
  // 如果缓存时间超过1小时，启动后台更新
  if (!cachedSymbolData || (now - cachedSymbolData.timestamp) >= CACHE_DURATION) {
    // 不等待后台更新完成
    updateCacheInBackground();
  }
  
  return processedData;
}

// 按类别获取符号
export function getSymbolsByCategory(symbols: SymbolData[], category: string): SymbolData[] {
  return symbols.filter(symbol => symbol.category && symbol.category.includes(category));
}

// 搜索符号
export function searchSymbols(symbols: SymbolData[], query: string): SymbolData[] {
  if (!query) return [];
  
  const lowerQuery = query.toLowerCase();
  
  return symbols.filter(symbol => 
    symbol.symbol.includes(query) || 
    symbol.name.toLowerCase().includes(lowerQuery) ||
    (symbol.searchTerms && symbol.searchTerms.some(term => 
      term.toLowerCase().includes(lowerQuery)
    )) ||
    symbol.notes.toLowerCase().includes(lowerQuery)
  );
}