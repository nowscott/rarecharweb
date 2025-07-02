'use client';

import React from 'react';
import { useCachedSymbolData } from '@/hooks/useCachedSymbolData';
import HomeClient from '@/components/HomeClient';
import { LoadingSpinner, ErrorDisplay } from '@/components/ui';

export default function EmojiPage() {
  const { symbols, categoryStats, loading, error } = useCachedSymbolData({
    dataType: 'emoji'
  });

  if (loading) {
    return <LoadingSpinner message="加载Emoji中..." />;
  }

  if (error) {
    return <ErrorDisplay message="Emoji加载失败" error={error} />;
  }

  return (
    <HomeClient 
      symbols={symbols} 
      categoryStats={categoryStats}
      pageTitle="Emoji"
      pageDescription="探索丰富的Emoji世界，找到完美的表达方式"
    />
  );
}