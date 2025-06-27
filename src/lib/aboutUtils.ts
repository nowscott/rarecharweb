import { useState, useRef, useEffect } from 'react';
import { aboutConfig } from './aboutConfig';

// 类型定义
export interface CategoryStat {
  name: string;
  count: number;
}

export interface AboutStats {
  totalSymbols: number;
  categoryStats: CategoryStat[];
}

export interface AboutVersions {
  symbol: string;
  emoji: string;
}

// 合并分类统计数据的工具函数
export function mergeCategoryStats(
  symbolCategoryStats: CategoryStat[],
  emojiCategoryStats: CategoryStat[]
): CategoryStat[] {
  const categoryMap = new Map<string, number>();
  
  // 合并符号分类统计
  symbolCategoryStats.forEach(stat => {
    categoryMap.set(stat.name, (categoryMap.get(stat.name) || 0) + stat.count);
  });
  
  // 合并emoji分类统计
  emojiCategoryStats.forEach(stat => {
    categoryMap.set(stat.name, (categoryMap.get(stat.name) || 0) + stat.count);
  });
  
  // 转换为数组并按数量排序
  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

// 清除缓存并重新加载的工具函数
export function clearCacheAndReload(): void {
  if (typeof window !== 'undefined') {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  }
}

// 格式化更新时间的工具函数
export function formatUpdateTime(): string {
  return new Date()
    .toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
    .replace(/\//g, '-');
}

// 后门功能的自定义Hook
export function useBackdoorClick(onTrigger: () => void) {
  const [clickCount, setClickCount] = useState(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
    
  // 避免ESLint警告
  void clickCount;
  
  const handleClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1;
      
      // 如果达到阈值，触发回调
      if (newCount >= aboutConfig.backdoor.clickThreshold) {
        onTrigger();
        return 0;
      }
      
      return newCount;
    });
    
    // 清除之前的计时器
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }
    
    // 设置新的计时器，超时后重置计数
    clickTimerRef.current = setTimeout(() => {
      setClickCount(0);
    }, aboutConfig.backdoor.resetTimeout);
  };

  // 清理计时器
  useEffect(() => {
    return () => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    };
  }, []);
  
  return handleClick;
}

// 生成统计数据的工具函数
export function generateStats(
  symbolData: any[],
  emojiData: any[],
  symbolCategoryStats: CategoryStat[],
  emojiCategoryStats: CategoryStat[]
): AboutStats {
  const mergedCategoryStats = mergeCategoryStats(symbolCategoryStats, emojiCategoryStats);
  
  return {
    totalSymbols: symbolData.length + emojiData.length,
    categoryStats: mergedCategoryStats
  };
}

// 生成版本信息的工具函数
export function generateVersions(
  symbolVersion: string,
  emojiVersion: string
): AboutVersions {
  return {
    symbol: symbolVersion,
    emoji: emojiVersion
  };
}