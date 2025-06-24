'use client';

import { useState, useEffect } from 'react';
import { SymbolData, SymbolDataResponse, CategoryStat } from '@/lib/types';

interface UseSymbolDataOptions {
  apiEndpoint: string;
  errorMessage?: string;
}

interface UseSymbolDataReturn {
  symbols: SymbolData[];
  categoryStats: CategoryStat[];
  loading: boolean;
  error: string | null;
}

export function useSymbolData({ 
  apiEndpoint, 
  errorMessage = 'Failed to fetch data' 
}: UseSymbolDataOptions): UseSymbolDataReturn {
  const [symbols, setSymbols] = useState<SymbolData[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error(`${errorMessage}: ${response.statusText}`);
        }
        const data: SymbolDataResponse = await response.json();
        setSymbols(data.symbols);
        setCategoryStats(data.stats?.categoryStats || []);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : errorMessage;
        console.error(errorMsg, err);
        setError(errorMsg);
        // 设置空数据，让组件显示错误状态
        setSymbols([]);
        setCategoryStats([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [apiEndpoint, errorMessage]);

  return {
    symbols,
    categoryStats,
    loading,
    error
  };
}