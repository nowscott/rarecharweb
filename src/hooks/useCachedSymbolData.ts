'use client';

import { useState, useEffect } from 'react';
import { SymbolData, CategoryStat } from '@/lib/core/types';
import { getCacheStatus, getSymbolData, getEmojiData } from '@/lib/cache/globalCache';

interface UseCachedSymbolDataOptions {
  dataType: 'symbol' | 'emoji';
}

interface UseCachedSymbolDataReturn {
  symbols: SymbolData[];
  categoryStats: CategoryStat[];
  version: string;
  loading: boolean;
  error: string | null;
}

export function useCachedSymbolData({ 
  dataType 
}: UseCachedSymbolDataOptions): UseCachedSymbolDataReturn {
  const [symbols, setSymbols] = useState<SymbolData[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [version, setVersion] = useState<string>('v1.0.0');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const cacheStatus = getCacheStatus();
        const dataTypeName = dataType === 'symbol' ? '符号' : '表情';
        
        // 检查缓存状态
        const hasValidCache = dataType === 'symbol' 
          ? cacheStatus.symbolCache.hasData 
          : cacheStatus.emojiCache.hasData;
        
        if (hasValidCache) {
          // 缓存中有数据，直接获取（这会使用缓存而不重新请求）
          console.log(`📋 [智能缓存] 使用${dataTypeName}缓存数据`);
          
          const data = dataType === 'symbol' 
            ? await getSymbolData() 
            : await getEmojiData();
          
          if (data) {
            console.log(`✅ [智能缓存] 使用${dataTypeName}缓存数据 | 数量: ${data.symbols.length}`);
            setSymbols(data.symbols);
            setCategoryStats(data.stats?.categoryStats || []);
            setVersion(data.version || 'v1.0.0');
          } else {
            throw new Error(`${dataTypeName}数据获取失败`);
          }
        } else {
          // 缓存中没有数据，等待预加载完成
          console.log(`⏳ [智能缓存] 等待${dataTypeName}数据预加载...`);
          
          let retryCount = 0;
          const maxRetries = 50; // 最多重试50次（5秒）
          
          const checkData = async (): Promise<void> => {
            const updatedStatus = getCacheStatus();
            const hasData = dataType === 'symbol' 
              ? updatedStatus.symbolCache.hasData 
              : updatedStatus.emojiCache.hasData;
            
            if (hasData) {
              const data = dataType === 'symbol' 
                ? await getSymbolData() 
                : await getEmojiData();
              
              if (data) {
                console.log(`✅ [智能缓存] ${dataTypeName}数据预加载完成 | 数量: ${data.symbols.length}`);
                setSymbols(data.symbols);
                setCategoryStats(data.stats?.categoryStats || []);
                setVersion(data.version || 'v1.0.0');
                setLoading(false);
                return;
              }
            }
            
            retryCount++;
            if (retryCount < maxRetries) {
              setTimeout(checkData, 100);
            } else {
              throw new Error(`${dataTypeName}数据加载超时`);
            }
          };
          
          await checkData();
        }
        
        setLoading(false);
      } catch (err) {
        console.error(`❌ [智能缓存] ${dataType === 'symbol' ? '符号' : '表情'}数据加载失败:`, err);
        setError(err instanceof Error ? err.message : `${dataType === 'symbol' ? '符号' : '表情'}数据加载失败`);
        setLoading(false);
      }
    };

    loadData();
  }, [dataType]);

  return {
    symbols,
    categoryStats,
    version,
    loading,
    error
  };
}