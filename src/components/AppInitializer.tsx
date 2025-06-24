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
      console.log('🟢 使用现有有效缓存，跳过预加载');
      console.log(`   - 缓存年龄: ${cacheStatus.ageMinutes}分钟`);
      console.log(`   - 符号数据: ${cacheStatus.symbolCache.hasData ? '✓' : '✗'}`);
      console.log(`   - 表情数据: ${cacheStatus.emojiCache.hasData ? '✓' : '✗'}`);
    }
  }, []);

  return <>{children}</>;
}