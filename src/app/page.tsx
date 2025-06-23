'use client';

import { useRouter } from 'next/navigation';
import useSymbolData from '@/hooks/useSymbolData';
import SearchBar from '@/components/SearchBar';
import CategoryNav from '@/components/CategoryNav';
import SymbolList from '@/components/SymbolList';

export default function Home() {
  const router = useRouter();
  const {
    loading,
    error,
    activeCategory,
    searchQuery,
    displayedSymbols,
    dynamicCategories,
    handleCategoryChange,
    handleSearch,
  } = useSymbolData();

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
            categories={dynamicCategories} 
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <>
            {searchQuery ? (
              <div className="mb-4">
                <h2 className="text-lg font-medium">搜索结果: {displayedSymbols.length} 个符号</h2>
              </div>
            ) : null}

            <SymbolList 
              displayedSymbols={displayedSymbols}
              searchQuery={searchQuery}
              activeCategory={activeCategory}
            />
          </>
        )}


      </div>
    </div>
  );
}
