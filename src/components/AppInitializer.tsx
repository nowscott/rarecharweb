'use client';

import { useEffect } from 'react';
import { preloadAllData, getCacheStatus } from '@/lib/globalCache';

interface AppInitializerProps {
  children: React.ReactNode;
}

export default function AppInitializer({ children }: AppInitializerProps) {
  useEffect(() => {
    // 智能预加载：检查缓存状态，只在必要时预加载
    const cacheStatus = getCacheStatus();
    
    if (!cacheStatus.isValid || !cacheStatus.symbolCache.hasData || !cacheStatus.emojiCache.hasData) {
      console.log('🚀 缓存无效或不完整，开始预加载数据...');
      preloadAllData().catch(error => {
        console.error('应用初始化时预加载数据失败:', error);
      });
    } else {
      console.log(`🟢 [缓存状态] 使用有效缓存 | 时间: ${cacheStatus.ageMinutes}分钟前`);
      console.log(`📊 [符号数据] 版本: ${cacheStatus.symbolCache.version} | 数量: ${cacheStatus.symbolCache.count}`);
      console.log(`😀 [表情数据] 版本: ${cacheStatus.emojiCache.version} | 数量: ${cacheStatus.emojiCache.count}`);
    }
  }, []);

  return <>{children}</>;
}