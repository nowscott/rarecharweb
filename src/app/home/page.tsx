'use client';

import React from 'react';
import { useCachedSymbolData } from '@/hooks/useCachedSymbolData';
import HomeClient from '@/components/HomeClient';
import { LoadingSpinner, ErrorDisplay } from '@/components/ui';

export default function Home() {
  const { symbols, categoryStats, loading, error } = useCachedSymbolData({
    dataType: 'symbol'
  });

  if (loading) {
    return <LoadingSpinner message="加载符号中..." />;
  }

  if (error) {
    return <ErrorDisplay message="符号加载失败" error={error} />;
  }

  return (
    <HomeClient 
      symbols={symbols} 
      categoryStats={categoryStats} 
    />
  );
}
