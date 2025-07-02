'use client';

import { useState, useEffect } from 'react';
import { SymbolData, SymbolDataResponse, CategoryStat } from '@/lib/core/types';
import { getSymbolData, getEmojiData } from '@/lib/cache/globalCache';

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
        
        // 根据API端点选择数据源，优先使用缓存
        let data: SymbolDataResponse | null = null;
        
        if (apiEndpoint.includes('/api/symbols')) {
          console.log('🔍 [useSymbolData] 获取符号数据（优先使用缓存）');
          data = await getSymbolData();
        } else if (apiEndpoint.includes('/api/emoji')) {
          console.log('🔍 [useSymbolData] 获取表情数据（优先使用缓存）');
          data = await getEmojiData();
        } else {
          // 兜底：直接调用API
          console.log('🔍 [useSymbolData] 未知端点，直接调用API:', apiEndpoint);
          const response = await fetch(apiEndpoint);
          if (!response.ok) {
            throw new Error(`${errorMessage}: ${response.statusText}`);
          }
          data = await response.json();
        }
        
        if (data) {
          const dataType = apiEndpoint.includes('emoji') ? '表情' : '符号';
          console.log(`✅ [${dataType}数据] 获取成功 | 数量: ${data.symbols.length}`);
          setSymbols(data.symbols);
          setCategoryStats(data.stats?.categoryStats || []);
        } else {
          throw new Error('无法获取数据');
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : errorMessage;
        console.error('❌ [useSymbolData] 数据获取失败:', errorMsg, err);
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