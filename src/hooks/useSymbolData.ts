'use client';

import { useState, useEffect } from 'react';
import { getSymbolData, SymbolData, searchSymbols } from '@/lib/symbolData';
import { CATEGORY_MAP } from '@/lib/constants';

// 分类信息接口
interface CategoryInfo {
  id: string;
  name: string;
  count: number;
}

// 符号数据Hook，处理数据获取、分类筛选和搜索
export default function useSymbolData() {
  const [symbols, setSymbols] = useState<SymbolData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedSymbols, setDisplayedSymbols] = useState<SymbolData[]>([]);
  // 动态生成的分类列表
  const [dynamicCategories, setDynamicCategories] = useState<CategoryInfo[]>([]);

  // 计算每个分类下的符号数量并排序
  const calculateCategoryStats = (symbolsArray: SymbolData[]) => {
    // 初始化分类计数对象
    const categoryCounts: Record<string, number> = { 'all': symbolsArray.length };
    
    // 统计每个分类下的符号数量
    symbolsArray.forEach(symbol => {
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
    
    // 转换为分类信息数组
    const categories: CategoryInfo[] = Object.keys(categoryCounts).map(id => ({
      id,
      name: id === 'all' ? '全部' : (CATEGORY_MAP[id] || id),
      count: categoryCounts[id]
    }));
    
    // 按符号数量降序排序，但保持'all'分类在最前面
    categories.sort((a, b) => {
      if (a.id === 'all') return -1;
      if (b.id === 'all') return 1;
      return b.count - a.count;
    });
    
    console.log('动态生成的分类列表:', categories);
    return categories;
  };

  // 获取符号数据
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getSymbolData();
        setSymbols(data.symbols);
        
        // 计算分类统计信息
        const categories = calculateCategoryStats(data.symbols);
        setDynamicCategories(categories);
        
        // 根据当前选中的分类筛选符号
        filterSymbolsByCategory(data.symbols, activeCategory);
      } catch (err) {
        setError('获取数据失败，请稍后再试');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);
  
  // 仅在symbols变化时初始化过滤
  useEffect(() => {
    if (symbols.length > 0 && !searchQuery) {
      console.log('symbols变化，初始化过滤，当前分类:', activeCategory);
      filterSymbolsByCategory(symbols, activeCategory);
    }
  }, [symbols, activeCategory, searchQuery]); // 添加searchQuery依赖，搜索时不触发分类过滤
  
  // 随机打乱数组顺序的函数
  const shuffleArray = <T>(array: T[]): T[] => {
    // 创建数组副本，避免修改原数组
    const shuffled = [...array];
    // Fisher-Yates 洗牌算法
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // 根据分类过滤符号的辅助函数
  const filterSymbolsByCategory = (symbolsArray: SymbolData[], category: string) => {
    let filtered;
    if (category === 'all') {
      filtered = symbolsArray;
    } else {
      filtered = symbolsArray.filter(symbol => 
        symbol.category && symbol.category.includes(category)
      );
    }
    
    let finalResult;
    if (category === 'all') {
      // 全部页面：随机打乱
      finalResult = shuffleArray(filtered);
    } else {
      // 其他分类页面：按unicode排序
      finalResult = [...filtered].sort((a, b) => {
        const aCode = a.symbol.codePointAt(0) || 0;
        const bCode = b.symbol.codePointAt(0) || 0;
        return aCode - bCode;
      });
    }
    
    // 直接显示所有筛选后的数据
    setDisplayedSymbols(finalResult);
    
    console.log(`过滤分类: ${category}, 结果数量: ${finalResult.length}`);
  };


  // 处理分类切换
  const handleCategoryChange = (category: string) => {
    console.log(`切换分类: ${category}`);
    
    // 更新状态，让useEffect处理过滤逻辑
    setActiveCategory(category);
    setSearchQuery('');
    // 不再直接调用filterSymbolsByCategory，避免重复过滤
  };

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query) {
      handleCategoryChange(activeCategory);
      return;
    }
    
    // 搜索时将分类重置为"全部"
    setActiveCategory('all');
    
    const results = searchSymbols(symbols, query);
    // 搜索结果按unicode排序
    const sortedResults = [...results].sort((a, b) => {
      const aCode = a.symbol.codePointAt(0) || 0;
      const bCode = b.symbol.codePointAt(0) || 0;
      return aCode - bCode;
    });
    setDisplayedSymbols(sortedResults);
  };
  
  return {
    symbols,
    loading,
    error,
    activeCategory,
    searchQuery,
    displayedSymbols,
    dynamicCategories, // 添加动态生成的分类列表
    handleCategoryChange,
    handleSearch
  };
}