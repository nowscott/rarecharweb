'use client';

import { useEffect } from 'react';
import { preloadAllData, getCacheStatus } from '@/lib/globalCache';
import { initializeFontCache, getFontCacheStatus } from '@/lib/fontCache';

interface AppInitializerProps {
  children: React.ReactNode;
}

export default function AppInitializer({ children }: AppInitializerProps) {
  useEffect(() => {
    const initializeApp = async () => {
      // 并行初始化数据缓存和字体缓存
      const [dataCacheResult, fontCacheResult] = await Promise.allSettled([
        initializeDataCache(),
        initializeFontCache()
      ]);

      // 记录初始化结果
      if (dataCacheResult.status === 'rejected') {
        console.error('数据缓存初始化失败:', dataCacheResult.reason);
      }
      
      if (fontCacheResult.status === 'rejected') {
        console.error('字体缓存初始化失败:', fontCacheResult.reason);
      }

      // 显示缓存状态
      logCacheStatus();
    };

    // 数据缓存初始化
    const initializeDataCache = async () => {
      const cacheStatus = getCacheStatus();
      
      if (!cacheStatus.isValid || !cacheStatus.symbolCache.hasData || !cacheStatus.emojiCache.hasData) {
        console.log('🚀 数据缓存无效或不完整，开始预加载...');
        await preloadAllData();
      }
    };

    // 记录缓存状态
    const logCacheStatus = () => {
      const dataCacheStatus = getCacheStatus();
      const fontCacheStatus = getFontCacheStatus();
      
      console.log(`🟢 [数据缓存] 有效: ${dataCacheStatus.isValid} | 时间: ${dataCacheStatus.ageMinutes}分钟前`);
      console.log(`📊 [符号数据] 版本: ${dataCacheStatus.symbolCache.version} | 数量: ${dataCacheStatus.symbolCache.count}`);
      console.log(`😀 [表情数据] 版本: ${dataCacheStatus.emojiCache.version} | 数量: ${dataCacheStatus.emojiCache.count}`);
      console.log(`🔤 [字体缓存] 有效: ${fontCacheStatus.isValid} | 时间: ${fontCacheStatus.ageHours}小时前 | 已加载: ${fontCacheStatus.loadedFonts}个`);
    };

    initializeApp();
  }, []);

  return <>{children}</>;
}