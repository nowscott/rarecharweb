'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SymbolData, CategoryStat } from '@/lib/types';
import { processSymbols } from '@/lib/symbolUtils';
import SearchBar from '@/components/SearchBar';
import CategoryNav from '@/components/CategoryNav';
import SymbolList from '@/components/SymbolList';
import { optimizeSymbolRendering, waitForFontsLoad } from '@/lib/fontUtils';

interface HomeClientProps {
  symbols: SymbolData[];
  categoryStats: CategoryStat[];
  pageTitle?: string;
  pageDescription?: string;
}

export default function HomeClient({ symbols, categoryStats, pageTitle = "复制符", pageDescription = "快速查找特殊符号，一键复制" }: HomeClientProps) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // 标记客户端已挂载，避免hydration mismatch
    setIsClient(true);
    
    // 初始化字体优化
    optimizeSymbolRendering();
    
    // 等待字体加载完成
    waitForFontsLoad().catch((error) => {
      console.warn('Font loading failed:', error);
    });
  }, [symbols]);

  // 处理分类数据，添加"全部"分类
  const categories = useMemo(() => {
    const totalCount = symbols.length;
    const allCategory = { id: 'all', name: '全部', count: totalCount };
    return [allCategory, ...categoryStats];
  }, [symbols.length, categoryStats]);

  // 根据当前分类和搜索查询处理符号数据
  const displayedSymbols = useMemo(() => {
    return processSymbols(symbols, activeCategory, searchQuery, isClient);
  }, [symbols, activeCategory, searchQuery, isClient]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSearchQuery(''); // 切换分类时清空搜索
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 顶部导航栏 */}
        <nav className="mb-6 sm:mb-8">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col">
              <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{pageTitle}</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{pageDescription}</p>
            </div>
            <div className="flex space-x-2 sm:space-x-4">
              <button 
                onClick={() => router.push('/')}
                className={`px-3 py-2 sm:px-4 sm:py-2 ${pageTitle === "复制符" ? 'bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg transition-colors flex items-center justify-center sm:justify-start sm:space-x-2 text-sm sm:text-base touch-manipulation active:scale-95`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                <span className="hidden sm:inline sm:ml-2">符号</span>
              </button>
              <button 
                onClick={() => router.push('/emoji')}
                className={`px-3 py-2 sm:px-4 sm:py-2 ${pageTitle === "Emoji 表情符号" ? 'bg-yellow-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white rounded-lg transition-colors flex items-center justify-center sm:justify-start sm:space-x-2 text-sm sm:text-base touch-manipulation active:scale-95`}
              >
                <span className="text-lg">😀</span>
                <span className="hidden sm:inline sm:ml-2">Emoji</span>
              </button>
              <button 
                onClick={() => router.push('/about')}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center sm:justify-start sm:space-x-2 text-sm sm:text-base touch-manipulation active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden sm:inline sm:ml-2">关于</span>
              </button>
            </div>
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

        {!isClient ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-gray-600 dark:text-gray-400">正在加载符号...</p>
            </div>
          </div>
        ) : (
          <SymbolList 
            displayedSymbols={displayedSymbols}
            searchQuery={searchQuery}
          />
        )}
      </div>
    </div>
  );
}