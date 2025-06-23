// 符号数据获取和缓存工具

export interface SymbolData {
  symbol: string;
  name: string;
  pronunciation: string;
  category: string[];
  searchTerms: string[];
  notes: string;
}

export interface SymbolDataResponse {
  version: string;
  symbols: SymbolData[];
}

// 远程数据URL
const betaDataUrl = 'https://symboldata.oss-cn-shanghai.aliyuncs.com/data-beta.json';

// 获取符号数据并缓存
export async function getSymbolData(): Promise<SymbolDataResponse> {
  // 从远程获取数据
  const response = await fetch(betaDataUrl, { next: { revalidate: 3600 } }); // 缓存1小时
  
  if (!response.ok) {
    throw new Error(`获取数据失败: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
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