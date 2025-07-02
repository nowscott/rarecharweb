// 符号数据工具函数
import { SymbolData } from './types';



// 按类别获取符号
export function getSymbolsByCategory(symbols: SymbolData[], category: string): SymbolData[] {
  return symbols.filter(symbol => 
    symbol.category && symbol.category.includes(category)
  );
}