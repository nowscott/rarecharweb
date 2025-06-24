'use client';

import { useSymbolData } from '@/hooks/useSymbolData';
import HomeClient from '@/components/HomeClient';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';

export default function Home() {
  const { symbols, categoryStats, loading, error } = useSymbolData({
    apiEndpoint: '/api/symbols',
    errorMessage: 'Failed to fetch symbols data'
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
