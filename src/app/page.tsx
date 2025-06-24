'use client';

import { useState, useEffect } from 'react';
import { SymbolData, SymbolDataResponse, CategoryStat } from '@/lib/symbolData';
import HomeClient from '@/components/HomeClient';

export default function Home() {
  const [symbols, setSymbols] = useState<SymbolData[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/symbols');
        const data: SymbolDataResponse = await response.json();
        setSymbols(data.symbols);
        setCategoryStats(data.stats?.categoryStats || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <HomeClient 
      symbols={symbols} 
      categoryStats={categoryStats} 
    />
  );
}
