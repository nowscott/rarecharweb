'use client';

import { useEffect } from 'react';
import { preloadAllData } from '@/lib/globalCache';

interface AppInitializerProps {
  children: React.ReactNode;
}

export default function AppInitializer({ children }: AppInitializerProps) {
  useEffect(() => {
    // 在应用启动时预加载所有数据到缓存
    preloadAllData().catch(error => {
      console.error('应用初始化时预加载数据失败:', error);
    });
  }, []);

  return <>{children}</>;
}