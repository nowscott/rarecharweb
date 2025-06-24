'use client';

import { useState, useEffect } from 'react';
import { SymbolData, SymbolDataResponse, CategoryStat } from '@/lib/types';
import HomeClient from '@/components/HomeClient';

export default function EmojiPage() {
  const [symbols, setSymbols] = useState<SymbolData[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/emoji');
        if (!response.ok) {
          throw new Error('Failed to fetch emoji data');
        }
        const data: SymbolDataResponse = await response.json();
        setSymbols(data.symbols);
        setCategoryStats(data.stats?.categoryStats || []);
      } catch (error) {
        console.error('Error fetching emoji data:', error);
        // 设置空数据，让组件显示错误状态
        setSymbols([]);
        setCategoryStats([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">加载Emoji中...</p>
        </div>
      </div>
    );
  }

  return (
    <HomeClient 
      symbols={symbols} 
      categoryStats={categoryStats}
      pageTitle="Emoji 表情符号"
      pageDescription="探索丰富的Emoji表情符号世界，找到完美的表达方式"
    />
  );
}