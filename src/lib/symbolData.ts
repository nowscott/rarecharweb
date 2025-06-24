// 符号数据获取和缓存工具
import { shuffle } from 'lodash';

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

// 分类映射
export const CATEGORY_MAP: Record<string, string> = {
  'entertainment': '娱乐',
  'japanese': '日语',
  'angle': '角标',
  'korean': '韩语',
  'number': '数字',
  'currency': '货币',
  'music': '音乐',
  'math': '数学',
  'other': '其他',
};

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
      name: CATEGORY_MAP[id] || id,
      count: categoryCounts[id]
    }))
    .sort((a, b) => b.count - a.count);

  return stats;
}

// 获取符号数据（每次请求都重新随机化）
export async function getSymbolData(): Promise<SymbolDataResponse> {
  // 从远程获取数据，不使用缓存
  const response = await fetch(betaDataUrl, { cache: 'no-store' });
  
  if (!response.ok) {
    throw new Error(`获取数据失败: ${response.status}`);
  }
  
  const data = await response.json();
  
  // 使用 lodash 的 shuffle 函数随机化符号数据
  const shuffledSymbols = shuffle(data.symbols);
  
  // 计算统计信息（基于随机化后的数据）
  const categoryStats = calculateCategoryStats(shuffledSymbols);
  
  return {
    ...data,
    symbols: shuffledSymbols,
    stats: {
      totalSymbols: shuffledSymbols.length,
      categoryStats
    }
  };
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