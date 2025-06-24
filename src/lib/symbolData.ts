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
  originalData: SymbolDataResponse; // 用于对比的原始数据
}

let cachedSymbolData: CachedData | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1小时

// 后台更新缓存
async function updateCacheInBackground() {
  try {
    console.log('开始后台更新缓存...');
    const response = await fetchWithTimeout(betaDataUrl, 8000);
    
    if (!response.ok) {
      console.error(`后台更新失败: HTTP ${response.status}`);
      return;
    }
    
    const newData = await response.json();
    
    // 验证数据格式
    if (!newData.symbols || !Array.isArray(newData.symbols)) {
      console.error('后台更新失败: 数据格式无效');
      return;
    }
    
    // 对比数据是否有变化（简单对比符号数量和版本）
    const hasChanged = !cachedSymbolData || 
      cachedSymbolData.originalData.symbols.length !== newData.symbols.length ||
      cachedSymbolData.originalData.version !== newData.version;
    
    if (hasChanged) {
       // 数据有变化，更新缓存
       const categoryStats = calculateCategoryStats(newData.symbols);
       
       cachedSymbolData = {
         data: {
           ...newData,
           symbols: newData.symbols,
           stats: {
             totalSymbols: newData.symbols.length,
             categoryStats
           }
         },
         timestamp: Date.now(),
         originalData: newData
       };
       console.log(`后台缓存更新成功，共${newData.symbols.length}个符号`);
    } else {
      console.log('后台检查完成，数据无变化');
    }
  } catch (error) {
    console.error('后台更新缓存失败:', error);
  }
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
export async function getSymbolData(): Promise<SymbolDataResponse> {
  const now = Date.now();
  
  // 检查是否有有效缓存
  if (cachedSymbolData && (now - cachedSymbolData.timestamp) < CACHE_DURATION) {
    // 缓存有效，直接返回
    return cachedSymbolData.data;
  }
  
  // 尝试获取新数据，最多重试2次
  let lastError: Error | null = null;
  
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
      
      // 处理数据
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
      lastError = error as Error;
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