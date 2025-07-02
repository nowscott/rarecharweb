// 符号搜索和排序工具函数
import { pinyin } from 'pinyin';
import { SymbolData } from './types';
import { shuffle } from 'lodash';

/**
 * 搜索符号数据
 * @param symbols 符号数组
 * @param query 搜索查询字符串
 * @returns 匹配的符号数组
 */
export function searchSymbols(symbols: SymbolData[], query: string): SymbolData[] {
  if (!query.trim()) {
    return symbols;
  }

  const lowerQuery = query.toLowerCase().trim();
  
  return symbols.filter(symbol => {
    // 基础搜索逻辑
    const basicMatch = 
      symbol.symbol.toLowerCase().includes(lowerQuery) ||
      symbol.name.toLowerCase().includes(lowerQuery) ||
      symbol.pronunciation.toLowerCase().includes(lowerQuery) ||
      symbol.notes.toLowerCase().includes(lowerQuery) ||
      symbol.searchTerms.some((term: string) => term.toLowerCase().includes(lowerQuery));
    
    // 拼音搜索逻辑
    const pinyinMatch = (() => {
      try {
        // 将符号名称转换为拼音进行匹配
        const namePinyin = pinyin(symbol.name, {
          style: 'normal', // 不带声调
          heteronym: false // 不返回多音字的所有读音
        }).join('').toLowerCase();
        
        // 将符号备注转换为拼音进行匹配
        const notesPinyin = pinyin(symbol.notes, {
          style: 'normal',
          heteronym: false
        }).join('').toLowerCase();
        
        // 将搜索词转换为拼音进行匹配
        const searchTermsPinyin = symbol.searchTerms.map(term => 
          pinyin(term, {
            style: 'normal',
            heteronym: false
          }).join('').toLowerCase()
        );
        
        return namePinyin.includes(lowerQuery) ||
               notesPinyin.includes(lowerQuery) ||
               searchTermsPinyin.some(termPinyin => termPinyin.includes(lowerQuery));
      } catch {
        // 如果拼音转换出错，返回false
        return false;
      }
    })();
    
    return basicMatch || pinyinMatch;
  });
}

/**
 * 按分类过滤符号
 * @param symbols 符号数组
 * @param category 分类ID，'all' 表示全部
 * @returns 过滤后的符号数组
 */
export function filterSymbolsByCategory(symbols: SymbolData[], category: string): SymbolData[] {
  if (category === 'all') {
    return symbols;
  }
  return symbols.filter(symbol => symbol.category.includes(category));
}

/**
 * 排序符号数据
 * @param symbols 符号数组
 * @param category 当前分类
 * @param hasSearchQuery 是否有搜索查询
 * @returns 排序后的符号数组
 */
export function sortSymbols(symbols: SymbolData[], category: string, hasSearchQuery: boolean, isClient: boolean = false): SymbolData[] {
  // 如果有搜索查询，保持搜索结果的原始顺序
  if (hasSearchQuery) {
    return symbols;
  }
  
  // 全部分类下：客户端随机排序，服务端保持原始顺序（避免hydration mismatch）
  if (category === 'all') {
    return isClient ? shuffle([...symbols]) : symbols;
  } else {
    return [...symbols].sort((a, b) => a.symbol.localeCompare(b.symbol));
  }
}

/**
 * 综合处理符号数据：过滤、搜索、排序
 * @param symbols 原始符号数组
 * @param category 当前分类
 * @param searchQuery 搜索查询
 * @param isClient 是否在客户端运行
 * @returns 处理后的符号数组
 */
export function processSymbols(
  symbols: SymbolData[], 
  category: string, 
  searchQuery: string,
  isClient: boolean = false
): SymbolData[] {
  // 1. 按分类过滤
  let filtered = filterSymbolsByCategory(symbols, category);
  
  // 2. 按搜索查询过滤
  if (searchQuery.trim()) {
    filtered = searchSymbols(filtered, searchQuery);
  }
  
  // 3. 排序
  const hasSearchQuery = searchQuery.trim().length > 0;
  filtered = sortSymbols(filtered, category, hasSearchQuery, isClient);
  
  return filtered;
}