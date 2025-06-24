'use client';

import React from 'react';
import { useSymbolData } from '@/hooks/useSymbolData';
import HomeClient from '@/components/HomeClient';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';

export default function EmojiPage() {
  const { symbols, categoryStats, loading, error } = useSymbolData({
    apiEndpoint: '/api/emoji',
    errorMessage: 'Failed to fetch emoji data'
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
      pageTitle="Emoji 表情符号"
      pageDescription="探索丰富的Emoji表情符号世界，找到完美的表达方式"
    />
  );
}