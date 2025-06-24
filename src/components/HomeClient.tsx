'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SymbolData, CategoryStat } from '@/lib/symbolData';
import SearchBar from '@/components/SearchBar';
import CategoryNav from '@/components/CategoryNav';
import SymbolList from '@/components/SymbolList';
import { pinyin } from 'pinyin';
import { optimizeSymbolRendering, waitForFontsLoad } from '@/lib/fontUtils';

interface HomeClientProps {
  symbols: SymbolData[];
  categoryStats: CategoryStat[];
}

export default function HomeClient({ symbols, categoryStats }: HomeClientProps) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // 初始化字体优化
    optimizeSymbolRendering();
    
    // 等待字体加载完成
    waitForFontsLoad().catch((error) => {
      console.warn('Font loading failed:', error);
    });
  }, []);

  // 处理分类数据，添加"全部"分类
  const categories = useMemo(() => {
    const totalCount = symbols.length;
    const allCategory = { id: 'all', name: '全部', count: totalCount };
    return [allCategory, ...categoryStats];
  }, [symbols.length, categoryStats]);

  // 根据当前分类和搜索查询过滤符号
  const displayedSymbols = useMemo(() => {
    let filtered = symbols;

    // 按分类过滤
    if (activeCategory !== 'all') {
      filtered = filtered.filter(symbol => symbol.category.includes(activeCategory));
    }

    // 按搜索查询过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(symbol => {
        // 原有的搜索逻辑
        const basicMatch = 
          symbol.symbol.toLowerCase().includes(query) ||
          symbol.name.toLowerCase().includes(query) ||
          symbol.pronunciation.toLowerCase().includes(query) ||
          symbol.notes.toLowerCase().includes(query) ||
          symbol.searchTerms.some((term: string) => term.toLowerCase().includes(query));
        
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
            
            return namePinyin.includes(query) ||
                   notesPinyin.includes(query) ||
                   searchTermsPinyin.some(termPinyin => termPinyin.includes(query));
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            // 如果拼音转换出错，返回false
            return false;
          }
        })();
        
        return basicMatch || pinyinMatch;
      });
    }

    // 排序逻辑：全部分类下保持服务端随机化的顺序，其他分类按unicode排序
    if (!searchQuery.trim()) {
      if (activeCategory === 'all') {
        // 全部分类下保持服务端的随机顺序
        return filtered;
      } else {
        // 其他分类按unicode排序
        return [...filtered].sort((a, b) => a.symbol.localeCompare(b.symbol));
      }
    }

    return filtered;
  }, [symbols, activeCategory, searchQuery, isClient]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 顶部导航栏 */}
        <nav className="mb-8 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold mb-2">复制符</h1>
            <p className="text-gray-600 dark:text-gray-400">快速查找特殊符号，一键复制</p>
          </div>
          <div className="flex space-x-4">
            <button 
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>检索</span>
            </button>
            <button 
              onClick={() => router.push('/about')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>关于</span>
            </button>
          </div>
        </nav>

        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="mb-6">
          <CategoryNav 
            activeCategory={activeCategory} 
            onSelectCategory={handleCategoryChange} 
            categories={categories} 
          />
        </div>

        {searchQuery ? (
          <div className="mb-4">
            <h2 className="text-lg font-medium">搜索结果: {displayedSymbols.length} 个符号</h2>
          </div>
        ) : null}

        <SymbolList 
          displayedSymbols={displayedSymbols}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
}